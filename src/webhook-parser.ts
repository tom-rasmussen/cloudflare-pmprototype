import { Env } from './types';

/**
 * Webhook Parser using Cloudflare Workers AI
 *
 * FRICTION POINT: Each AI call has latency (~500ms-2s), and there's no built-in
 * caching for AI responses. For high-volume webhooks, this could be slow.
 *
 * FRICTION POINT: AI output is non-deterministic. Same input may produce
 * slightly different JSON structure. Need robust parsing with fallbacks.
 */

export interface ParsedWebhook {
  title: string | null;
  content: string;
  author_name: string | null;
  author_email: string | null;
  external_id: string | null;
  url: string | null;
  product_hint: string | null;
  raw_data: any;
}

export class WebhookParser {
  constructor(private env: Env) {}

  /**
   * Parse webhook from any source using AI
   */
  async parse(source: string, rawPayload: any): Promise<ParsedWebhook> {
    // Try source-specific parser first (faster, more reliable)
    const quickParse = this.quickParse(source, rawPayload);
    if (quickParse) {
      return quickParse;
    }

    // Fall back to AI parsing for unknown formats
    return await this.aiParse(source, rawPayload);
  }

  /**
   * Quick parsing for known webhook formats (no AI needed)
   */
  private quickParse(source: string, payload: any): ParsedWebhook | null {
    try {
      switch (source) {
        case 'discord':
          return this.parseDiscord(payload);
        case 'slack':
          return this.parseSlack(payload);
        case 'github':
          return this.parseGitHub(payload);
        case 'twitter':
        case 'x':
          return this.parseTwitter(payload);
        case 'email':
          return this.parseEmail(payload);
        default:
          return null;
      }
    } catch (e) {
      console.error(`Quick parse failed for ${source}:`, e);
      return null;
    }
  }

  private parseDiscord(payload: any): ParsedWebhook {
    return {
      title: null,
      content: payload.content || payload.message?.content || '',
      author_name: payload.author?.username || payload.member?.user?.username || 'Discord User',
      author_email: null,
      external_id: payload.id || payload.message?.id || null,
      url: payload.channel_id ? `https://discord.com/channels/${payload.guild_id}/${payload.channel_id}/${payload.id}` : null,
      product_hint: null,
      raw_data: payload
    };
  }

  private parseSlack(payload: any): ParsedWebhook {
    // Handle various Slack event types
    const event = payload.event || payload;
    return {
      title: null,
      content: event.text || event.message?.text || '',
      author_name: event.user || event.username || 'Slack User',
      author_email: null,
      external_id: event.ts || event.event_ts || null,
      url: event.permalink || null,
      product_hint: null,
      raw_data: payload
    };
  }

  private parseGitHub(payload: any): ParsedWebhook {
    // Handle issues, comments, discussions
    const issue = payload.issue || payload.discussion || payload.comment;
    const action = payload.action || 'created';

    if (issue) {
      return {
        title: issue.title || `GitHub ${action}`,
        content: issue.body || payload.comment?.body || '',
        author_name: issue.user?.login || payload.sender?.login || 'GitHub User',
        author_email: null,
        external_id: `${payload.repository?.full_name}#${issue.number}`,
        url: issue.html_url || null,
        product_hint: payload.repository?.name || null,
        raw_data: payload
      };
    }

    // Handle other GitHub events
    return {
      title: `GitHub ${action}`,
      content: JSON.stringify(payload).slice(0, 500),
      author_name: payload.sender?.login || 'GitHub',
      author_email: null,
      external_id: null,
      url: null,
      product_hint: payload.repository?.name || null,
      raw_data: payload
    };
  }

  private parseTwitter(payload: any): ParsedWebhook {
    // Twitter API v2 format
    const tweet = payload.data || payload;
    const user = payload.includes?.users?.[0] || {};

    return {
      title: null,
      content: tweet.text || '',
      author_name: user.username || user.name || tweet.author_id || 'Twitter User',
      author_email: null,
      external_id: tweet.id || null,
      url: tweet.id ? `https://twitter.com/i/status/${tweet.id}` : null,
      product_hint: null,
      raw_data: payload
    };
  }

  private parseEmail(payload: any): ParsedWebhook {
    // SendGrid/Mailgun inbound format
    return {
      title: payload.subject || payload.Subject || 'Email Feedback',
      content: payload.text || payload.body || payload.html?.replace(/<[^>]*>/g, '') || '',
      author_name: payload.from_name || payload.from?.split('<')[0]?.trim() || 'Email User',
      author_email: payload.from_email || payload.from?.match(/<(.+)>/)?.[1] || payload.from || null,
      external_id: payload.message_id || payload['Message-Id'] || null,
      url: null,
      product_hint: null,
      raw_data: payload
    };
  }

  /**
   * AI-powered parsing for unknown webhook formats
   *
   * FRICTION POINT: AI parsing adds ~1-2 seconds latency per request
   */
  private async aiParse(source: string, payload: any): Promise<ParsedWebhook> {
    const prompt = `Parse this webhook payload from "${source}" and extract feedback information.

Payload:
${JSON.stringify(payload, null, 2).slice(0, 2000)}

Return a JSON object with these fields:
- title: A short summary or subject (string or null)
- content: The main message/body text (string, required)
- author_name: Who sent this (string or null)
- author_email: Email if available (string or null)
- external_id: Original ID from the source (string or null)
- url: Link to original if available (string or null)
- product_hint: Which product this might be about (string or null)

Return ONLY valid JSON, no explanation.`;

    try {
      const response = await this.env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
        messages: [
          { role: 'system', content: 'You are a JSON parser. Return only valid JSON objects.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 500
      });

      const responseText = (response as any).response || '';

      // Extract JSON from response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          title: parsed.title || null,
          content: parsed.content || JSON.stringify(payload).slice(0, 500),
          author_name: parsed.author_name || null,
          author_email: parsed.author_email || null,
          external_id: parsed.external_id || null,
          url: parsed.url || null,
          product_hint: parsed.product_hint || null,
          raw_data: payload
        };
      }
    } catch (e) {
      console.error('AI parsing failed:', e);
    }

    // Ultimate fallback
    return {
      title: `${source} feedback`,
      content: typeof payload === 'string' ? payload : JSON.stringify(payload).slice(0, 500),
      author_name: null,
      author_email: null,
      external_id: null,
      url: null,
      product_hint: null,
      raw_data: payload
    };
  }
}

/**
 * Mock webhook generators for testing
 */
export const mockWebhooks = {
  discord: () => ({
    id: `msg_${Date.now()}`,
    type: 0,
    content: getRandomDiscordMessage(),
    channel_id: '123456789012345678',
    guild_id: '987654321098765432',
    author: {
      id: '111222333444555666',
      username: getRandomUsername(),
      avatar: 'abc123'
    },
    timestamp: new Date().toISOString()
  }),

  slack: () => ({
    type: 'message',
    channel: 'C0123456789',
    user: 'U0123456789',
    text: getRandomSlackMessage(),
    ts: `${Date.now() / 1000}`,
    team: 'T0123456789'
  }),

  github: () => ({
    action: 'opened',
    issue: {
      number: Math.floor(Math.random() * 1000) + 100,
      title: getRandomGitHubTitle(),
      body: getRandomGitHubBody(),
      user: { login: getRandomUsername() },
      labels: [{ name: Math.random() > 0.5 ? 'bug' : 'enhancement' }],
      html_url: 'https://github.com/example/repo/issues/123'
    },
    repository: {
      name: 'cloudsync-pro',
      full_name: 'company/cloudsync-pro'
    },
    sender: { login: getRandomUsername() }
  }),

  twitter: () => ({
    data: {
      id: `${Date.now()}`,
      text: getRandomTweet(),
      author_id: '123456789'
    },
    includes: {
      users: [{
        id: '123456789',
        username: getRandomUsername(),
        name: 'Random User'
      }]
    }
  }),

  email: () => ({
    from: `${getRandomUsername()}@example.com`,
    from_name: getRandomUsername().replace('_', ' '),
    to: 'feedback@product.com',
    subject: getRandomEmailSubject(),
    text: getRandomEmailBody(),
    timestamp: new Date().toISOString(),
    message_id: `<${Date.now()}@mail.example.com>`
  })
};

// Random content generators
function getRandomUsername(): string {
  const names = ['alex_dev', 'sarah_pm', 'mike_user', 'jen_designer', 'chris_ops', 'taylor_qa', 'jordan_support', 'casey_admin'];
  return names[Math.floor(Math.random() * names.length)];
}

function getRandomDiscordMessage(): string {
  const messages = [
    'Hey team, CloudSync keeps disconnecting when I try to upload large files. Anyone else seeing this?',
    'The new update is awesome! Love the dark mode feature 🎉',
    'Is there a way to sync specific folders only? I don\'t want everything synced to my laptop',
    'Getting error 503 when trying to access shared folders. Help!',
    'Feature request: can we get notifications when someone edits a shared file?',
    'The mobile app is so slow compared to desktop. Please optimize!',
    'Just wanted to say your customer support is amazing. Got my issue resolved in 10 mins!',
    'Why did the price increase? The value doesn\'t justify the new pricing IMO'
  ];
  return messages[Math.floor(Math.random() * messages.length)];
}

function getRandomSlackMessage(): string {
  const messages = [
    'TaskFlow integration with Jira is broken again :disappointed:',
    'Loving the new timeline view! Makes project planning so much easier :tada:',
    'Can we get keyboard shortcuts for common actions? Would speed up my workflow a lot',
    'The search is not finding my tasks from last month. Is there a retention limit?',
    'Anyone know how to bulk edit task assignees? Need to reassign 50 tasks',
    'Great work on the mobile app update! Finally works offline properly',
    'We need better permissions - can\'t share tasks externally with clients',
    'Calendar sync stopped working after the latest update'
  ];
  return messages[Math.floor(Math.random() * messages.length)];
}

function getRandomGitHubTitle(): string {
  const titles = [
    'API returns 500 error on large file uploads',
    'Feature: Add dark mode support',
    'Documentation is outdated for v2 API',
    'Performance regression in latest release',
    'Add webhook support for real-time updates',
    'Mobile app crashes on iOS 17',
    'Request: Export data to CSV',
    'Bug: Duplicate notifications being sent'
  ];
  return titles[Math.floor(Math.random() * titles.length)];
}

function getRandomGitHubBody(): string {
  const bodies = [
    'Steps to reproduce:\n1. Upload file > 5GB\n2. Wait for upload to reach 80%\n3. Observe 500 error\n\nExpected: Upload completes\nActual: Server error',
    'Would be great to have a dark mode option. Many developers work in low-light environments and the bright UI is straining.',
    'The docs at /api/v2/endpoints reference parameters that no longer exist. Please update to reflect current implementation.',
    'After updating to v3.2, page load times increased from ~200ms to ~1.5s. Profiling shows the new analytics module is the cause.',
    'We need webhooks to trigger our CI/CD pipeline when certain events occur. Currently polling the API which is inefficient.',
    'App crashes immediately on launch on iOS 17.2. Stack trace attached. Seems related to the new notification framework.',
    'For compliance we need to export all data to CSV format. Currently only JSON is supported which requires additional processing.',
    'Users are receiving 2-3 duplicate notifications for each event. Started after the notification service update on Monday.'
  ];
  return bodies[Math.floor(Math.random() * bodies.length)];
}

function getRandomTweet(): string {
  const tweets = [
    '@DataVizAnalytics the new charts are 🔥 Finally can visualize our sales funnel properly!',
    '@CloudSyncPro why is sync so slow today? Usually it\'s instant but now taking 10+ minutes',
    'Just discovered @TaskFlow and it\'s already transformed how our team works. Highly recommend!',
    '@DataVizAnalytics export to PDF is broken again 😤 This is the third time this month',
    'The @CloudSyncPro team really listens to feedback. Suggested a feature last month and it\'s already shipped!',
    '@TaskFlow mobile app needs work. Crashes every time I try to attach a photo',
    'Switching from Jira to @TaskFlow was the best decision our team made this year',
    '@DataVizAnalytics pricing is getting out of hand. $50/user/month is too steep for startups'
  ];
  return tweets[Math.floor(Math.random() * tweets.length)];
}

function getRandomEmailSubject(): string {
  const subjects = [
    'Issue with my subscription - charged twice',
    'Feature request: team management improvements',
    'Love your product! Quick suggestion though',
    'URGENT: Data not syncing for 3 days',
    'Question about enterprise pricing',
    'Bug report: export function not working',
    'Feedback on the new dashboard design',
    'Cancellation request - too expensive'
  ];
  return subjects[Math.floor(Math.random() * subjects.length)];
}

function getRandomEmailBody(): string {
  const bodies = [
    'Hi,\n\nI was charged $29.99 twice on my last billing cycle. Order IDs: ORD-12345 and ORD-12346.\n\nPlease refund the duplicate charge.\n\nThanks,\nA Customer',
    'Hello team,\n\nI\'d love to see better team management features. Specifically:\n- Role-based permissions\n- Team activity dashboard\n- Bulk user invites\n\nThese would help us scale our usage significantly.\n\nBest regards',
    'Hey!\n\nJust wanted to say I\'ve been using your product for 6 months and it\'s been great. One small suggestion: could you add keyboard shortcuts? Would speed up my workflow.\n\nKeep up the great work!',
    'This is urgent - our team\'s data hasn\'t synced in 3 days. We\'re a paying enterprise customer and this is affecting our operations.\n\nPlease prioritize this issue.\n\nAccount ID: ENT-9876',
    'Hi,\n\nWe\'re considering upgrading to enterprise. Can you provide:\n- Volume pricing for 500+ users\n- SSO/SAML support details\n- SLA guarantees\n\nThanks',
    'The export to Excel function gives a corrupted file every time. Tried on Chrome, Firefox, and Safari. All same result.\n\nSteps: Dashboard > Reports > Export > Excel\n\nPlease fix ASAP as we need this for our quarterly report.',
    'Regarding the new dashboard design - the colors are too muted and it\'s hard to distinguish between different chart types. The old design was more accessible.\n\nConsider adding a high-contrast option.',
    'I need to cancel my subscription. The product is good but at $49/month it\'s too expensive for our small team. We\'re going with a cheaper alternative.\n\nPlease confirm cancellation.'
  ];
  return bodies[Math.floor(Math.random() * bodies.length)];
}
