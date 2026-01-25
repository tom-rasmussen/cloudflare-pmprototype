/**
 * Queue Operations Module
 * Handles Cloudflare Queue operations for async feedback processing
 */

/**
 * Send feedback to processing queue
 */
export async function queueFeedback(queue, feedback) {
	try {
		await queue.send(feedback);
		return true;
	} catch (error) {
		console.error('Queue send error:', error);
		throw error;
	}
}

/**
 * Send multiple feedback items in batch
 */
export async function queueBatchFeedback(queue, feedbackItems) {
	try {
		await queue.sendBatch(feedbackItems);
		return true;
	} catch (error) {
		console.error('Queue batch send error:', error);
		throw error;
	}
}
