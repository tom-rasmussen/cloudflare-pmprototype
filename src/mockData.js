/**
 * Mock Data Generator
 * Generates realistic feedback data for testing
 */

const sources = ['email', 'github', 'twitter', 'support_ticket', 'forum', 'slack'];

const feedbackTemplates = {
	bug: [
		"The {feature} keeps crashing when I try to {action}. This is blocking my work.",
		"Getting error '{error}' constantly. Very frustrating!",
		"The app freezes every time I {action}. Using version {version}.",
		"Critical bug: {feature} doesn't work on {platform}. Please fix ASAP!",
		"Found a serious issue with {feature} - it's causing data loss."
	],
	feature_request: [
		"Would love to see {feature} added to the product. It would really help with {use_case}.",
		"Any plans to add {feature}? This would make {use_case} much easier.",
		"Suggestion: Add {feature} to improve {use_case}.",
		"It would be great if we could {action}. This feature would save us hours.",
		"Please consider adding {feature}. All our competitors have this."
	],
	ux_issue: [
		"The {feature} UI is confusing. Took me forever to figure out how to {action}.",
		"The navigation for {feature} is not intuitive. Can you simplify it?",
		"Love the product but the {feature} interface needs work.",
		"The {feature} workflow is too complicated. Could use better UX.",
		"Having trouble finding {feature}. The menu structure is confusing."
	],
	performance: [
		"The {feature} is really slow lately. Takes {time} to load.",
		"Performance has degraded significantly. {feature} used to be much faster.",
		"Page load times are terrible. Waiting {time} for {feature} to respond.",
		"The app is sluggish when {action}. Need better performance.",
		"Response time for {feature} is unacceptable. Please optimize."
	],
	positive: [
		"Love the new {feature}! Makes {use_case} so much easier.",
		"Great work on {feature}. This is exactly what we needed!",
		"The {feature} update is fantastic. Thank you!",
		"Really impressed with {feature}. Best {product} on the market.",
		"Just wanted to say {feature} is amazing. Keep up the great work!"
	]
};

const features = [
	'dashboard', 'analytics', 'export feature', 'search functionality', 
	'mobile app', 'API', 'integrations', 'authentication', 'notifications',
	'reporting', 'data sync', 'file upload', 'sharing', 'collaboration tools'
];

const actions = [
	'export data', 'save changes', 'upload files', 'share with team',
	'run reports', 'sync data', 'search results', 'filter items', 
	'create new project', 'delete old items'
];

const useCases = [
	'our workflow', 'team collaboration', 'daily operations',
	'client reporting', 'data analysis', 'project management',
	'customer support', 'sales tracking'
];

const errors = [
	'ERR_CONNECTION_TIMEOUT', 'ERR_INVALID_TOKEN', 'ERR_DATABASE_QUERY',
	'500 Internal Server Error', 'Failed to fetch', 'Permission denied'
];

const platforms = ['iOS', 'Android', 'Windows', 'macOS', 'Linux', 'Chrome', 'Safari'];

const names = [
	'Sarah Johnson', 'Mike Chen', 'Emily Rodriguez', 'James Wilson',
	'Priya Patel', 'David Kim', 'Lisa Anderson', 'Ahmed Hassan',
	'Maria Garcia', 'John Smith', 'Yuki Tanaka', 'Alex Brown'
];

const domains = ['company.com', 'business.io', 'startup.co', 'enterprise.net', 'tech.com'];

function randomChoice(array) {
	return array[Math.floor(Math.random() * array.length)];
}

function randomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateEmail(name) {
	const firstName = name.split(' ')[0].toLowerCase();
	const lastName = name.split(' ')[1].toLowerCase();
	return `${firstName}.${lastName}@${randomChoice(domains)}`;
}

function fillTemplate(template) {
	return template
		.replace('{feature}', randomChoice(features))
		.replace('{action}', randomChoice(actions))
		.replace('{use_case}', randomChoice(useCases))
		.replace('{error}', randomChoice(errors))
		.replace('{platform}', randomChoice(platforms))
		.replace('{version}', `v${randomInt(1, 5)}.${randomInt(0, 9)}.${randomInt(0, 20)}`)
		.replace('{time}', `${randomInt(5, 60)} seconds`)
		.replace('{product}', 'solution');
}

function generateTitle(content) {
	const firstSentence = content.split('.')[0];
	return firstSentence.substring(0, 80) + (firstSentence.length > 80 ? '...' : '');
}

function generateFeedbackItem(product) {
	const categoryType = randomChoice(['bug', 'feature_request', 'ux_issue', 'performance', 'positive']);
	const source = randomChoice(sources);
	const author = randomChoice(names);
	
	let content;
	if (categoryType === 'positive') {
		content = fillTemplate(randomChoice(feedbackTemplates.positive));
	} else {
		content = fillTemplate(randomChoice(feedbackTemplates[categoryType]));
	}
	
	// Add some random variation
	const daysAgo = randomInt(0, 90);
	const createdDate = new Date();
	createdDate.setDate(createdDate.getDate() - daysAgo);
	
	return {
		source,
		source_id: `${source}_${Date.now()}_${randomInt(1000, 9999)}`,
		product,
		title: generateTitle(content),
		content,
		author,
		author_email: generateEmail(author),
		created_at: createdDate.toISOString(),
		metadata: JSON.stringify({
			source_url: `https://${source}.example.com/feedback/${randomInt(10000, 99999)}`,
			user_id: `user_${randomInt(1000, 9999)}`,
			...(source === 'github' && { repo: 'company/product', issue_number: randomInt(100, 999) }),
			...(source === 'support_ticket' && { ticket_id: `TICK-${randomInt(10000, 99999)}` })
		})
	};
}

export function generateMockFeedback(count = 20, product = 'CloudFlow Pro') {
	const feedback = [];
	for (let i = 0; i < count; i++) {
		feedback.push(generateFeedbackItem(product));
	}
	return feedback;
}

// Sample products
export const sampleProducts = [
	{
		name: 'CloudFlow Pro',
		description: 'Enterprise workflow automation platform'
	},
	{
		name: 'DataSync Plus',
		description: 'Real-time data synchronization service'
	},
	{
		name: 'AnalyticsPro',
		description: 'Advanced analytics and reporting tool'
	}
];
