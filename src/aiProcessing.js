/**
 * AI Processing Module
 * Uses Workers AI for sentiment analysis, categorization, and summarization
 */

/**
 * Process feedback with Workers AI
 */
export async function processFeedbackWithAI(ai, feedback) {
	try {
		// Prepare the prompt for analysis
		const analysisPrompt = `Analyze the following product feedback and provide:
1. Sentiment (positive, negative, or neutral)
2. Sentiment score (0-1, where 0 is very negative, 1 is very positive)
3. Category (bug, feature_request, ux_issue, performance, documentation, security, or other)
4. Priority (low, medium, high, or critical)
5. A brief 1-sentence summary

Feedback: "${feedback.content}"

Respond ONLY with valid JSON in this exact format:
{
  "sentiment": "positive|negative|neutral",
  "sentiment_score": 0.0-1.0,
  "category": "bug|feature_request|ux_issue|performance|documentation|security|other",
  "priority": "low|medium|high|critical",
  "summary": "brief summary here"
}`;

		// Use Workers AI for analysis
		const response = await ai.run('@cf/meta/llama-3.1-8b-instruct', {
			messages: [
				{ role: 'system', content: 'You are a product feedback analyzer. Respond only with valid JSON.' },
				{ role: 'user', content: analysisPrompt }
			],
			temperature: 0.3,
			max_tokens: 300
		});

		let analysis;
		try {
			// Extract JSON from response
			const responseText = response.response || JSON.stringify(response);
			const jsonMatch = responseText.match(/\{[\s\S]*\}/);
			
			if (jsonMatch) {
				analysis = JSON.parse(jsonMatch[0]);
			} else {
				throw new Error('No JSON found in response');
			}
		} catch (parseError) {
			console.error('Failed to parse AI response:', parseError);
			// Fallback to basic analysis
			analysis = performBasicAnalysis(feedback.content);
		}

		// Return enhanced feedback
		return {
			...feedback,
			sentiment: analysis.sentiment || 'neutral',
			sentiment_score: analysis.sentiment_score || 0.5,
			category: analysis.category || 'other',
			priority: analysis.priority || 'medium',
			ai_summary: analysis.summary || feedback.title || feedback.content.substring(0, 100),
			processed_at: new Date().toISOString()
		};
	} catch (error) {
		console.error('AI processing error:', error);
		// Fallback to basic analysis
		return {
			...feedback,
			...performBasicAnalysis(feedback.content),
			processed_at: new Date().toISOString()
		};
	}
}

/**
 * Fallback basic analysis using keyword matching
 */
function performBasicAnalysis(content) {
	const lowerContent = content.toLowerCase();
	
	// Sentiment detection
	const positiveWords = ['love', 'great', 'excellent', 'amazing', 'fantastic', 'thank', 'perfect', 'awesome'];
	const negativeWords = ['bug', 'crash', 'error', 'broken', 'fail', 'slow', 'terrible', 'awful', 'horrible'];
	
	let positiveCount = 0;
	let negativeCount = 0;
	
	positiveWords.forEach(word => {
		if (lowerContent.includes(word)) positiveCount++;
	});
	
	negativeWords.forEach(word => {
		if (lowerContent.includes(word)) negativeCount++;
	});
	
	let sentiment = 'neutral';
	let sentiment_score = 0.5;
	
	if (positiveCount > negativeCount) {
		sentiment = 'positive';
		sentiment_score = 0.7 + (positiveCount * 0.1);
	} else if (negativeCount > positiveCount) {
		sentiment = 'negative';
		sentiment_score = 0.3 - (negativeCount * 0.1);
	}
	
	sentiment_score = Math.max(0, Math.min(1, sentiment_score));
	
	// Category detection
	let category = 'other';
	if (lowerContent.includes('bug') || lowerContent.includes('crash') || lowerContent.includes('error')) {
		category = 'bug';
	} else if (lowerContent.includes('feature') || lowerContent.includes('add') || lowerContent.includes('would love')) {
		category = 'feature_request';
	} else if (lowerContent.includes('slow') || lowerContent.includes('performance') || lowerContent.includes('faster')) {
		category = 'performance';
	} else if (lowerContent.includes('confusing') || lowerContent.includes('ux') || lowerContent.includes('interface')) {
		category = 'ux_issue';
	}
	
	// Priority detection
	let priority = 'medium';
	if (lowerContent.includes('critical') || lowerContent.includes('urgent') || lowerContent.includes('asap')) {
		priority = 'critical';
	} else if (lowerContent.includes('important') || lowerContent.includes('blocking')) {
		priority = 'high';
	} else if (sentiment === 'positive') {
		priority = 'low';
	}
	
	return {
		sentiment,
		sentiment_score,
		category,
		priority,
		ai_summary: content.substring(0, 100) + (content.length > 100 ? '...' : '')
	};
}

/**
 * Generate embedding for semantic search using Workers AI
 */
export async function generateEmbedding(ai, text) {
	try {
		const response = await ai.run('@cf/baai/bge-base-en-v1.5', {
			text: text.substring(0, 512) // Limit text length for embedding
		});
		
		return response.data[0] || null;
	} catch (error) {
		console.error('Embedding generation error:', error);
		return null;
	}
}

/**
 * Generate AI summary for a collection of feedback
 */
export async function generateBatchSummary(ai, feedbackItems, maxItems = 10) {
	try {
		const items = feedbackItems.slice(0, maxItems);
		const feedbackText = items.map((item, i) => 
			`${i + 1}. [${item.category}] ${item.content}`
		).join('\n\n');
		
		const summaryPrompt = `Summarize the following product feedback items. Identify:
1. Main themes and patterns
2. Most critical issues
3. Top feature requests
4. Overall sentiment

Feedback items:
${feedbackText}

Provide a concise executive summary (3-4 sentences).`;

		const response = await ai.run('@cf/meta/llama-3.1-8b-instruct', {
			messages: [
				{ role: 'system', content: 'You are a product manager assistant providing executive summaries.' },
				{ role: 'user', content: summaryPrompt }
			],
			temperature: 0.5,
			max_tokens: 500
		});

		return response.response || 'Unable to generate summary';
	} catch (error) {
		console.error('Batch summary error:', error);
		return 'Summary unavailable';
	}
}
