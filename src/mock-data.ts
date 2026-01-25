import { CreateFeedbackRequest } from './types';

/**
 * Diverse mock feedback data - 15 tickets per product
 * Distribution: Priority (critical/high/medium/low), Sentiment (negative/neutral/positive)
 * Sources spread across: github, email, twitter, slack, discord, zendesk, intercom, reddit
 */

export const mockFeedbackData: CreateFeedbackRequest[] = [
  // ============================================
  // CLOUDSYNC PRO (Product ID: 1) - 15 tickets
  // Cloud storage and file synchronization
  // ============================================

  // Critical
  {
    product_id: 1,
    source_name: 'github',
    title: 'Data corruption during sync causes file loss',
    content: 'Critical issue: Files are getting corrupted when syncing large folders. We lost several important documents. Steps to reproduce: 1) Create folder with 500+ files, 2) Sync to second device, 3) Some files are truncated or corrupted. This is a data integrity issue that needs immediate attention.',
    author_name: 'enterprise_admin',
    author_email: 'admin@bigcorp.com',
    external_id: 'ISSUE-2001'
  },

  // High priority
  {
    product_id: 1,
    source_name: 'zendesk',
    title: 'Files not syncing between Mac and Windows',
    content: 'Our team uses both Mac and Windows machines. Files created on Mac are not appearing on Windows devices and vice versa. This started after the v3.2 update. We have 50 users affected and productivity is significantly impacted.',
    author_name: 'IT Manager',
    author_email: 'it@company.com',
    external_id: 'TICKET-3301'
  },
  {
    product_id: 1,
    source_name: 'email',
    title: 'Sync conflicts not being resolved properly',
    content: 'When two people edit the same file, the conflict resolution creates duplicate files with random suffixes. We now have hundreds of "file (1).docx" type duplicates. The merge option would be much more useful than just duplicating.',
    author_name: 'Project Lead',
    author_email: 'lead@agency.io'
  },
  {
    product_id: 1,
    source_name: 'github',
    title: 'Upload fails for files over 2GB',
    content: 'Attempting to upload files larger than 2GB consistently fails at around 95% progress with error "Request timeout". Our video production team regularly works with 4-8GB files. Chunked upload should handle this better.',
    author_name: 'video_editor',
    external_id: 'ISSUE-2045'
  },
  {
    product_id: 1,
    source_name: 'twitter',
    title: 'CloudSync saved my project',
    content: '@CloudSyncPro just saved my entire thesis when my laptop died. Had automatic backup enabled and recovered everything within minutes. This is why I pay for premium!',
    author_name: 'grad_student_22'
  },

  // Medium priority
  {
    product_id: 1,
    source_name: 'discord',
    title: 'Mobile app drains battery during background sync',
    content: 'The iOS app is using 40% of my battery even when I\'m not actively using it. Background sync seems to be running constantly. Need an option to limit sync frequency or only sync on WiFi.',
    author_name: 'mobile_user_mike'
  },
  {
    product_id: 1,
    source_name: 'intercom',
    title: 'Cannot share folders with external collaborators',
    content: 'We need to share project folders with clients who don\'t have CloudSync accounts. Currently the only option is to send individual file links. A guest access feature would be incredibly valuable for agencies like ours.',
    author_name: 'Agency Owner',
    author_email: 'owner@creative.co'
  },
  {
    product_id: 1,
    source_name: 'email',
    title: 'Selective sync feature works perfectly',
    content: 'Just wanted to send a quick note - the selective sync feature you added last month is exactly what I needed. My laptop only has 256GB storage and I can now choose which folders to keep locally. Thank you!',
    author_name: 'Happy Customer',
    author_email: 'happy@email.com'
  },
  {
    product_id: 1,
    source_name: 'reddit',
    title: 'Switched from Dropbox - CloudSync is faster',
    content: 'Been using CloudSync Pro for 3 months after 5 years on Dropbox. The sync speed is noticeably faster, especially for initial uploads. The only thing I miss is the Paper feature, but overall very happy with the switch.',
    author_name: 'productivity_nerd',
    url: 'https://reddit.com/r/cloudStorage/comments/abc123'
  },
  {
    product_id: 1,
    source_name: 'github',
    title: 'API v2 documentation needs examples',
    content: 'The API documentation for v2 endpoints is missing code examples. The endpoint descriptions are there but without examples it\'s hard to understand the expected request/response formats. Would appreciate Python and JavaScript examples.',
    author_name: 'developer_dan',
    external_id: 'ISSUE-2089'
  },

  // Low priority
  {
    product_id: 1,
    source_name: 'twitter',
    title: 'Dark mode text contrast issue',
    content: '@CloudSyncPro the dark mode is great but the gray text on dark gray background is hard to read. Could you increase the contrast a bit? Accessibility matters!',
    author_name: 'a11y_advocate'
  },
  {
    product_id: 1,
    source_name: 'slack',
    title: 'File versioning UI could be improved',
    content: 'The version history feature is useful but the UI makes it hard to compare versions. Would be nice to have a side-by-side diff view or at least better timestamps showing who made changes.',
    author_name: 'design_team_lead'
  },
  {
    product_id: 1,
    source_name: 'discord',
    title: 'Love the new upload progress indicator',
    content: 'Small thing but the new upload progress bar that shows individual file progress is so much better than the old one. Nice attention to detail!',
    author_name: 'ui_appreciator'
  },
  {
    product_id: 1,
    source_name: 'email',
    title: 'Support team was incredibly helpful',
    content: 'I had an issue with my account migration and Sarah from support spent 45 minutes helping me resolve it. That level of customer service is rare these days. You have a customer for life!',
    author_name: 'Grateful User',
    author_email: 'grateful@email.com'
  },
  {
    product_id: 1,
    source_name: 'slack',
    title: 'Question about sync frequency',
    content: 'Is there a way to set custom sync intervals? I don\'t need real-time sync and would prefer to reduce network usage by syncing every 30 minutes instead.',
    author_name: 'bandwidth_conscious'
  },

  // ============================================
  // TASKFLOW (Product ID: 2) - 15 tickets
  // Team collaboration and project management
  // ============================================

  // Critical
  {
    product_id: 2,
    source_name: 'email',
    title: 'URGENT: Lost all task data after update',
    content: 'After updating to version 4.1, all our project tasks from the past 3 months have disappeared. We have 12 active projects with hundreds of tasks. This is catastrophic for our team. Please help immediately. Account ID: ORG-98765',
    author_name: 'Panicked PM',
    author_email: 'pm@startup.io'
  },

  // High priority
  {
    product_id: 2,
    source_name: 'github',
    title: 'Kanban board freezes with 100+ tasks',
    content: 'Performance degrades significantly when a board has more than 100 tasks. Dragging cards becomes laggy (2-3 second delay) and sometimes the board completely freezes. Tested on Chrome, Firefox, and Safari - same issue on all. Memory usage spikes to 2GB+.',
    author_name: 'perf_tester',
    external_id: 'ISSUE-892'
  },
  {
    product_id: 2,
    source_name: 'zendesk',
    title: 'Google Calendar integration stopped syncing',
    content: 'Task due dates are no longer appearing in Google Calendar. The integration shows as connected but no events are being created. This worked fine until last week. We rely on this for deadline tracking.',
    author_name: 'Calendar User',
    author_email: 'user@marketing.co',
    external_id: 'TICKET-4521'
  },
  {
    product_id: 2,
    source_name: 'slack',
    title: 'Real-time collaboration not updating',
    content: 'When multiple team members are viewing the same board, changes made by one person don\'t appear for others until they refresh. This is causing confusion and duplicate work. Real-time sync seems broken.',
    author_name: 'team_lead_sarah'
  },
  {
    product_id: 2,
    source_name: 'twitter',
    title: 'TaskFlow automations are game-changing',
    content: 'Set up @TaskFlow automations to auto-assign tasks based on labels and notify the right people when status changes. Saved our team easily 5 hours per week on manual updates. This is how PM tools should work!',
    author_name: 'automation_fan'
  },

  // Medium priority
  {
    product_id: 2,
    source_name: 'discord',
    title: 'Mobile app crashes when attaching photos',
    content: 'On Android 14, the app crashes every time I try to attach a photo to a task. Taking a new photo or selecting from gallery - both crash. Attaching PDFs works fine. This is blocking our field team from reporting issues.',
    author_name: 'android_user_alex'
  },
  {
    product_id: 2,
    source_name: 'intercom',
    title: 'Need bulk task assignment feature',
    content: 'When reorganizing projects, I often need to reassign 50+ tasks from one team member to another. Currently I have to edit each task individually. A bulk edit feature would save hours of tedious work.',
    author_name: 'Operations Manager',
    author_email: 'ops@logistics.com'
  },
  {
    product_id: 2,
    source_name: 'email',
    title: 'Timeline view is exactly what we needed',
    content: 'The new timeline/Gantt view is perfect for our project planning. Being able to see task dependencies visually and adjust dates by dragging has made our sprint planning sessions much more effective. Great addition!',
    author_name: 'Scrum Master',
    author_email: 'sm@agile.team'
  },
  {
    product_id: 2,
    source_name: 'reddit',
    title: 'Best Jira alternative for small teams',
    content: 'After trying Asana, Monday, and Notion, we settled on TaskFlow. It has the right balance of features without being overwhelming. The free tier is actually usable unlike others. Highly recommend for teams under 20 people.',
    author_name: 'startup_founder',
    url: 'https://reddit.com/r/projectmanagement/comments/xyz789'
  },
  {
    product_id: 2,
    source_name: 'github',
    title: 'Webhook documentation incomplete',
    content: 'Trying to set up webhooks to integrate with our CI/CD pipeline. The docs show the webhook URL setup but don\'t document the payload structure for different events. Need to know the JSON schema for task.created, task.updated, etc.',
    author_name: 'devops_engineer',
    external_id: 'ISSUE-901'
  },

  // Low priority
  {
    product_id: 2,
    source_name: 'twitter',
    title: 'Notification sounds are too loud',
    content: '@TaskFlow the notification sound scared me half to death in a quiet office. Can we get volume control or different sound options? Maybe a gentle chime instead of the current DING?',
    author_name: 'startled_worker'
  },
  {
    product_id: 2,
    source_name: 'slack',
    title: 'Would love custom task statuses',
    content: 'The default To Do / In Progress / Done works for simple projects but we need custom statuses like "Awaiting Review", "Blocked", "QA Testing". Having to use workarounds with tags is clunky.',
    author_name: 'workflow_customizer'
  },
  {
    product_id: 2,
    source_name: 'discord',
    title: 'Keyboard shortcuts are a productivity boost',
    content: 'Just discovered all the keyboard shortcuts (press ? to see them). Game changer! I can now create tasks, change status, and navigate without touching the mouse. Thanks for including these!',
    author_name: 'keyboard_ninja'
  },
  {
    product_id: 2,
    source_name: 'email',
    title: 'Smooth onboarding experience',
    content: 'We just migrated our 15-person team from Trello. The import tool worked flawlessly and the interactive tutorial helped everyone get up to speed in a day. Impressed with how smooth it was.',
    author_name: 'Team Admin',
    author_email: 'admin@smallbiz.com'
  },
  {
    product_id: 2,
    source_name: 'slack',
    title: 'How to set up recurring tasks?',
    content: 'We have weekly reports that need to be done every Friday. Is there a way to create recurring tasks that auto-generate? Couldn\'t find this in the settings.',
    author_name: 'process_manager'
  },

  // ============================================
  // DATAVIZ ANALYTICS (Product ID: 3) - 15 tickets
  // Business intelligence and data visualization
  // ============================================

  // Critical
  {
    product_id: 3,
    source_name: 'github',
    title: 'Dashboard crashes with datasets over 1M rows',
    content: 'When loading a dashboard connected to a table with more than 1 million rows, the entire browser tab crashes. Memory usage climbs to 8GB before the crash. We need to visualize large datasets for our analytics. This is blocking our enterprise deployment.',
    author_name: 'data_engineer',
    author_email: 'de@enterprise.com',
    external_id: 'ISSUE-567'
  },

  // High priority
  {
    product_id: 3,
    source_name: 'zendesk',
    title: 'SQL query timeout set too low',
    content: 'Complex analytical queries with multiple joins are timing out after 30 seconds. Some of our reports legitimately need 2-3 minutes to process. Please add an option to configure timeout per query or per dashboard.',
    author_name: 'BI Analyst',
    author_email: 'analyst@retail.co',
    external_id: 'TICKET-7891'
  },
  {
    product_id: 3,
    source_name: 'email',
    title: 'PDF export cuts off charts',
    content: 'When exporting dashboards to PDF, charts on the right side of the page are being cut off. The preview looks fine but the exported PDF is missing about 20% of the content. This is blocking our monthly board reports.',
    author_name: 'Executive Assistant',
    author_email: 'ea@corporation.com'
  },
  {
    product_id: 3,
    source_name: 'email',
    title: 'SSO integration failing with Okta',
    content: 'We\'ve been trying to set up SAML SSO with Okta for 2 weeks now. The configuration keeps failing with "Invalid SAML response". Support has been helpful but we still can\'t get it working. This is blocking our company-wide rollout.',
    author_name: 'IT Security',
    author_email: 'security@fintech.io'
  },
  {
    product_id: 3,
    source_name: 'twitter',
    title: 'DataViz replaced our Tableau license',
    content: 'Switched from Tableau to @DataVizAnalytics and saving $50k/year. The learning curve was minimal for our team and we haven\'t lost any functionality we actually used. ROI positive in month one.',
    author_name: 'cfo_savings'
  },

  // Medium priority
  {
    product_id: 3,
    source_name: 'discord',
    title: 'Custom color palettes not saving',
    content: 'I create a custom color palette for our brand colors, save it, but when I come back the next day it\'s reverted to defaults. Tried on multiple browsers. The colors show as saved in settings but don\'t apply to charts.',
    author_name: 'brand_guardian'
  },
  {
    product_id: 3,
    source_name: 'github',
    title: 'Calculated fields documentation sparse',
    content: 'The documentation for calculated fields only covers basic operations. Need more examples for: window functions, date calculations, conditional logic, and working with null values. Current docs assume too much prior knowledge.',
    author_name: 'sql_analyst',
    external_id: 'ISSUE-612'
  },
  {
    product_id: 3,
    source_name: 'email',
    title: 'Real-time data refresh is amazing',
    content: 'Set up a live dashboard for our sales floor showing real-time metrics. The 30-second auto-refresh works flawlessly. Our team loves seeing the numbers update throughout the day. Huge morale boost when we hit targets!',
    author_name: 'Sales Director',
    author_email: 'sales@growth.co'
  },
  {
    product_id: 3,
    source_name: 'reddit',
    title: 'Finally a BI tool for non-technical users',
    content: 'Our marketing team can actually build their own dashboards without asking the data team for help. The drag-and-drop interface is intuitive and the auto-suggestions for chart types are helpful. Democratizing data access!',
    author_name: 'data_democratizer',
    url: 'https://reddit.com/r/BusinessIntelligence/comments/def456'
  },
  {
    product_id: 3,
    source_name: 'slack',
    title: 'Best practices for dashboard sharing?',
    content: 'We want to share dashboards with clients who don\'t have accounts. What\'s the recommended approach? Public links seem too open, but creating accounts for each client is overhead. Is there a middle ground?',
    author_name: 'consulting_pm'
  },

  // Low priority
  {
    product_id: 3,
    source_name: 'twitter',
    title: 'Mobile dashboard view needs improvement',
    content: '@DataVizAnalytics the desktop experience is great but dashboards are almost unusable on mobile. Charts don\'t resize properly and filters are tiny. For a tool in 2024, mobile should be better.',
    author_name: 'mobile_executive'
  },
  {
    product_id: 3,
    source_name: 'email',
    title: 'Would like more chart types',
    content: 'The current chart options cover most needs but we\'d love to see: waterfall charts, bullet charts, and treemaps added. These are common in financial reporting and would help us consolidate tools.',
    author_name: 'Finance Analyst',
    author_email: 'finance@corp.com'
  },
  {
    product_id: 3,
    source_name: 'discord',
    title: 'Alerting feature caught a revenue anomaly',
    content: 'Set up an alert for when daily revenue drops more than 20%. It triggered last week and we discovered a payment processing issue within an hour. Without the alert we might not have noticed for days. Paid for itself!',
    author_name: 'revenue_ops'
  },
  {
    product_id: 3,
    source_name: 'zendesk',
    title: 'Support helped optimize slow query',
    content: 'Opened a ticket about a slow dashboard and the support engineer actually looked at my SQL and suggested index improvements. Above and beyond what I expected. Dashboard now loads in 2 seconds instead of 45.',
    author_name: 'Optimized User',
    author_email: 'optimized@data.co',
    external_id: 'TICKET-7950'
  },
  {
    product_id: 3,
    source_name: 'intercom',
    title: 'Need help with data source connections',
    content: 'Trying to connect to our Snowflake warehouse but getting authentication errors. The connection wizard is straightforward but something isn\'t working. Can someone walk me through the setup?',
    author_name: 'New User',
    author_email: 'newuser@analytics.co'
  },

  // ============================================
  // API GATEWAY (Product ID: 4) - 15 tickets
  // Managed API gateway service
  // ============================================

  // Critical
  {
    product_id: 4,
    source_name: 'github',
    title: 'Gateway returning 502 errors under load',
    content: 'At approximately 5000 requests/second, the gateway starts returning 502 Bad Gateway errors intermittently. We\'re seeing about 5% error rate at this load level. Logs show upstream connection timeouts. This is impacting production traffic during peak hours.',
    author_name: 'sre_oncall',
    author_email: 'sre@platform.io',
    external_id: 'ISSUE-1201'
  },

  // High priority
  {
    product_id: 4,
    source_name: 'email',
    title: 'Rate limiting not being enforced correctly',
    content: 'We configured rate limits of 100 requests/minute per API key but clients are able to make 200+ requests without being throttled. The rate limit headers show the correct limits but enforcement isn\'t happening. This is a security concern.',
    author_name: 'API Security Lead',
    author_email: 'security@api.company'
  },
  {
    product_id: 4,
    source_name: 'zendesk',
    title: 'WebSocket connections dropping randomly',
    content: 'WebSocket connections through the gateway are being terminated after random intervals (sometimes 30 seconds, sometimes 5 minutes). Our real-time features depend on stable connections. Keep-alive is configured correctly on our end.',
    author_name: 'Backend Dev',
    author_email: 'backend@realtime.app',
    external_id: 'TICKET-9001'
  },
  {
    product_id: 4,
    source_name: 'email',
    title: 'Certificate renewal process confusing',
    content: 'Our SSL certificate is expiring in 2 weeks and the renewal process in the dashboard is unclear. The documentation mentions auto-renewal but I can\'t find where to enable it. Don\'t want to have an outage due to expired cert.',
    author_name: 'DevOps Engineer',
    author_email: 'devops@saas.io'
  },
  {
    product_id: 4,
    source_name: 'twitter',
    title: 'API Gateway cut our latency significantly',
    content: 'Migrated to @APIGateway last month and our p99 latency dropped from 450ms to 180ms. The edge caching and global distribution are doing exactly what they promised. Our users are noticing the speed improvement!',
    author_name: 'latency_hunter'
  },

  // Medium priority
  {
    product_id: 4,
    source_name: 'discord',
    title: 'Analytics dashboard shows wrong request counts',
    content: 'The analytics dashboard is showing about 30% fewer requests than what our backend logs show. We\'ve verified with multiple counting methods. Either requests aren\'t being logged by the gateway or the dashboard calculation is wrong.',
    author_name: 'analytics_skeptic'
  },
  {
    product_id: 4,
    source_name: 'github',
    title: 'OAuth2 token validation adding latency',
    content: 'Token validation is adding 50-100ms to every request. We\'re using JWT tokens and expected local validation to be fast. Profiling shows the gateway is making an external call for each validation. Is there a caching option?',
    author_name: 'perf_engineer',
    external_id: 'ISSUE-1245'
  },
  {
    product_id: 4,
    source_name: 'email',
    title: 'Auto-scaling handled Black Friday perfectly',
    content: 'Just wanted to share a success story. We had 10x normal traffic on Black Friday and the gateway auto-scaled without any intervention from our team. Zero downtime, no errors. That\'s exactly why we chose a managed solution.',
    author_name: 'E-commerce CTO',
    author_email: 'cto@shop.com'
  },
  {
    product_id: 4,
    source_name: 'reddit',
    title: 'Best API gateway for serverless',
    content: 'Using API Gateway with Lambda backends and the integration is seamless. The request/response transformation features save us from writing boilerplate code. If you\'re doing serverless, this is the way to go.',
    author_name: 'serverless_advocate',
    url: 'https://reddit.com/r/serverless/comments/ghi789'
  },
  {
    product_id: 4,
    source_name: 'intercom',
    title: 'Best pattern for API versioning?',
    content: 'We\'re about to release v2 of our API and want to run v1 and v2 in parallel. What\'s the recommended approach with the gateway? Path-based (/v1/, /v2/) or header-based versioning? Any gotchas to watch out for?',
    author_name: 'API Architect',
    author_email: 'architect@platform.dev'
  },

  // Low priority
  {
    product_id: 4,
    source_name: 'slack',
    title: 'Console UI could be more intuitive',
    content: 'The configuration console has a lot of options which is great for power users but overwhelming for newcomers. A "simple mode" with just the common settings would help. Took me a while to find where to set up basic routing.',
    author_name: 'new_admin'
  },
  {
    product_id: 4,
    source_name: 'github',
    title: 'Feature request: GraphQL support',
    content: 'Currently the gateway is REST-focused. With GraphQL adoption growing, native support for GraphQL-specific features would be valuable: query depth limiting, cost analysis, persisted queries, etc.',
    author_name: 'graphql_fan',
    external_id: 'ISSUE-1289'
  },
  {
    product_id: 4,
    source_name: 'discord',
    title: 'Documentation is comprehensive',
    content: 'Shoutout to the docs team - the API Gateway documentation is one of the best I\'ve seen. Clear examples, common use cases covered, and the troubleshooting guide actually helped me debug an issue. Well done!',
    author_name: 'docs_appreciator'
  },
  {
    product_id: 4,
    source_name: 'email',
    title: 'Migration from Kong was smooth',
    content: 'We migrated 50+ API routes from Kong to your gateway over a weekend. The configuration export/import made it manageable. A few edge cases needed manual tweaking but overall much easier than expected.',
    author_name: 'Platform Team Lead',
    author_email: 'platform@tech.co'
  },
  {
    product_id: 4,
    source_name: 'slack',
    title: 'Need help understanding caching behavior',
    content: 'I\'ve set up caching but not sure if it\'s working correctly. How can I verify cache hits vs misses? The headers don\'t seem to indicate cache status. Is there a debug mode or logging option?',
    author_name: 'cache_confused'
  }
];
