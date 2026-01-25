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
  }
];
