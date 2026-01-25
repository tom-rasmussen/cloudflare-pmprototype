import { CreateFeedbackRequest } from './types';

export const mockFeedbackData: CreateFeedbackRequest[] = [
  // CloudSync Pro - Positive feedback
  {
    product_id: 1,
    source_name: 'twitter',
    title: 'CloudSync is amazing!',
    content: 'Just started using CloudSync Pro and I\'m blown away by how fast the sync is. Files appear on all my devices instantly. The UI is clean and intuitive. Worth every penny!',
    author_name: 'Sarah Chen',
    author_email: 'sarah.c@email.com'
  },
  // CloudSync Pro - Bug report
  {
    product_id: 1,
    source_name: 'github',
    external_id: 'ISSUE-1234',
    title: 'Sync fails on large files',
    content: 'When trying to sync files larger than 5GB, the upload consistently fails at around 80% completion. Error message: "Connection timeout". This is blocking our team\'s workflow. Steps to reproduce: 1) Select file > 5GB, 2) Initiate sync, 3) Wait for progress to reach 80%, 4) Observe failure.',
    author_name: 'Mike Developer',
    author_email: 'mike.dev@company.com',
    url: 'https://github.com/cloudsync/issues/1234'
  },
  // CloudSync Pro - Feature request
  {
    product_id: 1,
    source_name: 'email',
    title: 'Request: Selective Sync Feature',
    content: 'It would be great to have selective sync so I can choose which folders to sync to which devices. I have a 15" laptop with limited storage and don\'t need all my files on it. This feature would make CloudSync perfect for my needs.',
    author_name: 'Jennifer Williams',
    author_email: 'jen.w@email.com'
  },
  // TaskFlow - Negative feedback
  {
    product_id: 2,
    source_name: 'zendesk',
    external_id: 'TICKET-5678',
    title: 'Mobile app constantly crashes',
    content: 'The TaskFlow mobile app on iOS crashes every time I try to attach a file to a task. This has been happening for the past week after the latest update. I\'ve tried reinstalling but the issue persists. Our team relies on mobile access and this is severely impacting productivity.',
    author_name: 'Alex Rodriguez',
    author_email: 'alex.r@startup.io',
    url: 'https://support.taskflow.com/ticket/5678'
  },
  // TaskFlow - Performance issue
  {
    product_id: 2,
    source_name: 'reddit',
    title: 'TaskFlow getting slower with more projects',
    content: 'Anyone else noticing that TaskFlow becomes sluggish when you have 50+ projects? The dashboard takes forever to load and switching between projects has noticeable lag. We love the features but the performance is becoming a dealbreaker.',
    author_name: 'PM_ProductManager',
    url: 'https://reddit.com/r/productivity/comments/xyz'
  },
  // TaskFlow - Positive feature
  {
    product_id: 2,
    source_name: 'twitter',
    content: 'The new automation features in @TaskFlow are game-changing! Set up triggers for when tasks move between stages and it automatically notifies the right people. Saved us so much time on status updates.',
    author_name: 'Tech_Startup_CEO'
  },
  // DataViz Analytics - Feature request
  {
    product_id: 3,
    source_name: 'intercom',
    external_id: 'CONV-9012',
    title: 'Need custom color palettes',
    content: 'We\'re a brand-focused company and need to use our brand colors in all dashboards. The current preset color schemes don\'t match our brand guidelines. Custom color palette support would be essential for our continued use of DataViz.',
    author_name: 'Marketing Director',
    author_email: 'marketing@bigcorp.com'
  },
  // DataViz Analytics - Pricing concern
  {
    product_id: 3,
    source_name: 'email',
    title: 'Pricing increase concerns',
    content: 'Just received notice of a 40% price increase for our annual renewal. While we love DataViz, this is a significant jump. Can we discuss? We\'re evaluating alternatives but would prefer to stay if we can work something out.',
    author_name: 'CFO',
    author_email: 'cfo@enterprise.com'
  },
  // DataViz Analytics - UX issue
  {
    product_id: 3,
    source_name: 'zendesk',
    external_id: 'TICKET-3456',
    title: 'Dashboard sharing is confusing',
    content: 'The permission system for sharing dashboards is really unclear. I tried to share a dashboard with view-only access but the recipient could edit it. The UI doesn\'t make it obvious what level of access you\'re granting. Documentation would help but a better UX would be ideal.',
    author_name: 'Data Analyst',
    author_email: 'analyst@company.com'
  },
  // CloudSync Pro - Documentation issue
  {
    product_id: 1,
    source_name: 'github',
    external_id: 'ISSUE-1235',
    title: 'API documentation is outdated',
    content: 'The API docs still reference v1 endpoints but the current version is v2. Several endpoints return different response formats than documented. This is making integration difficult for our development team.',
    author_name: 'DevOps Engineer',
    author_email: 'devops@tech.co',
    url: 'https://github.com/cloudsync/issues/1235'
  },
  // TaskFlow - Critical bug
  {
    product_id: 2,
    source_name: 'email',
    title: 'URGENT: Data loss in recent update',
    content: 'We just updated to version 3.2 and several of our projects have lost task comments and attachments from the past month. This is critical business data. Please help immediately. Our project IDs are: PRJ-100, PRJ-101, PRJ-102.',
    author_name: 'Project Manager',
    author_email: 'pm@agency.com'
  },
  // DataViz Analytics - Positive review
  {
    product_id: 3,
    source_name: 'twitter',
    content: 'DataViz Analytics has transformed how we present data to stakeholders. The real-time dashboard updates and beautiful visualizations make data storytelling so much easier. Highly recommend!',
    author_name: 'DataScience_Pro'
  },
  // Additional CloudSync Pro feedback
  {
    product_id: 1,
    source_name: 'zendesk',
    external_id: 'TICKET-2001',
    title: 'Files disappearing after sync',
    content: 'Some of our files are disappearing after syncing between devices. We noticed that files with special characters in the name like "&" or "%" are not syncing properly. This is affecting our design team who use these in file names frequently.',
    author_name: 'Design Lead',
    author_email: 'design@creative.co'
  },
  {
    product_id: 1,
    source_name: 'email',
    title: 'Love the new dark mode!',
    content: 'Just wanted to say thank you for adding dark mode in the latest update. As someone who works late nights, this is a lifesaver for my eyes. The implementation is beautiful and consistent across all screens.',
    author_name: 'Night Owl Developer',
    author_email: 'dev@nightshift.io'
  },
  {
    product_id: 1,
    source_name: 'reddit',
    title: 'CloudSync vs competitors',
    content: 'Been using CloudSync Pro for 6 months now after switching from Dropbox. The speed is noticeably better and the version history feature has saved me multiple times. Only complaint is the mobile app could use some work.',
    author_name: 'ProductivityNerd',
    url: 'https://reddit.com/r/cloudstorage/comments/abc'
  },
  {
    product_id: 1,
    source_name: 'intercom',
    title: 'Need offline mode',
    content: 'I travel frequently and often don\'t have internet. Would really appreciate an offline mode where I can mark certain folders to be available offline. Currently I have to use a third-party tool for this.',
    author_name: 'Frequent Traveler',
    author_email: 'traveler@consulting.com'
  },
  // Additional TaskFlow feedback
  {
    product_id: 2,
    source_name: 'github',
    external_id: 'ISSUE-789',
    title: 'Keyboard shortcuts not working on Firefox',
    content: 'None of the keyboard shortcuts work when using Firefox browser. Tested on Firefox 120+ on both Mac and Windows. Chrome works fine. Please add cross-browser support for accessibility.',
    author_name: 'Firefox User',
    author_email: 'firefox.fan@email.com',
    url: 'https://github.com/taskflow/issues/789'
  },
  {
    product_id: 2,
    source_name: 'email',
    title: 'Amazing customer support!',
    content: 'Just wanted to give a shoutout to your support team, especially Maria who helped me migrate our team from Asana. She was patient, knowledgeable, and went above and beyond. You have a customer for life!',
    author_name: 'Happy Customer',
    author_email: 'happy@smallbusiness.com'
  },
  {
    product_id: 2,
    source_name: 'zendesk',
    external_id: 'TICKET-4567',
    title: 'Calendar integration broken',
    content: 'The Google Calendar integration stopped working after your last update. Tasks with due dates are no longer appearing in our calendars. This is causing missed deadlines across our organization.',
    author_name: 'Operations Manager',
    author_email: 'ops@logistics.com'
  },
  {
    product_id: 2,
    source_name: 'twitter',
    title: 'Feature request: Time tracking',
    content: 'Would love to see built-in time tracking in @TaskFlow. Currently we use Toggl alongside but native integration would be much cleaner. Any plans for this?',
    author_name: 'AgencyOwner'
  },
  {
    product_id: 2,
    source_name: 'intercom',
    title: 'Confusing onboarding experience',
    content: 'We just signed up for TaskFlow and the onboarding is quite confusing. Too many features thrown at you at once. A more gradual introduction or interactive tutorial would help new users get started.',
    author_name: 'New User',
    author_email: 'newbie@startup.io'
  },
  // Additional DataViz Analytics feedback
  {
    product_id: 3,
    source_name: 'email',
    title: 'Export to PDF is broken',
    content: 'When exporting dashboards to PDF, the charts are cut off and the formatting is completely wrong. This used to work fine last month. We need this for board presentations.',
    author_name: 'Executive Assistant',
    author_email: 'ea@corporation.com'
  },
  {
    product_id: 3,
    source_name: 'github',
    external_id: 'ISSUE-456',
    title: 'SQL query timeout too short',
    content: 'The 30-second timeout for SQL queries is too short for our complex analytical queries. Some of our reports require joins across large datasets. Please allow custom timeout settings.',
    author_name: 'Data Engineer',
    author_email: 'data@techcompany.com',
    url: 'https://github.com/dataviz/issues/456'
  },
  {
    product_id: 3,
    source_name: 'reddit',
    title: 'Best BI tool for startups',
    content: 'After trying Looker, Metabase, and Tableau, we settled on DataViz Analytics. The learning curve is gentler and the pricing makes more sense for a startup our size. Highly recommend for teams under 50 people.',
    author_name: 'StartupCTO',
    url: 'https://reddit.com/r/analytics/comments/def'
  },
  {
    product_id: 3,
    source_name: 'zendesk',
    external_id: 'TICKET-7890',
    title: 'Mobile dashboard view is unusable',
    content: 'The mobile web experience for viewing dashboards is terrible. Charts don\'t resize properly, text overlaps, and interactive elements are too small to tap. We need to share dashboards with executives on the go.',
    author_name: 'Mobile User',
    author_email: 'mobile@field.com'
  },
  {
    product_id: 3,
    source_name: 'twitter',
    content: 'The new alerting feature in @DataVizAnalytics is exactly what we needed. Now we get Slack notifications when KPIs go out of range. No more manual checking! 🎉',
    author_name: 'DataDriven_PM'
  },
  {
    product_id: 3,
    source_name: 'intercom',
    title: 'SSO integration issues',
    content: 'We\'re trying to set up SAML SSO with Okta but the configuration keeps failing. The error messages are not helpful. We\'ve been going back and forth with support for 2 weeks now with no resolution.',
    author_name: 'IT Admin',
    author_email: 'it@enterprise.org'
  }
];
