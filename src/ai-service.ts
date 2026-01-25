import { Env, AIAnalysisResult } from './types';

export class AIService {
  constructor(private env: Env) {}

  /**
   * Analyze feedback using Workers AI for sentiment and categorization
   */
  async analyzeFeedback(content: string, title?: string): Promise<AIAnalysisResult> {
    const fullText = title ? `${title}\n\n${content}` : content;
    
    // Create analysis prompt
    const prompt = `Analyze the following product feedback and provide:
1. Sentiment (positive, negative, or neutral) with a score from -1 (very negative) to 1 (very positive)
2. Category (bug, feature_request, ux_issue, performance, documentation, pricing, other)
3. Priority (low, medium, high, critical)

Feedback:
"""
${fullText}
"""

Respond with a JSON object in this exact format:
{
  "sentiment": {
    "score": <number between -1 and 1>,
    "label": "<positive|negative|neutral>"
  },
  "category": "<category>",
  "priority": "<priority>"
}`;

    try {
      const response = await this.env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
        messages: [
          { role: 'system', content: 'You are a product feedback analyzer. Always respond with valid JSON only, no additional text.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 500
      });

      // Parse AI response
      const result = this.parseAIResponse(response);
      return result;
    } catch (error) {
      console.error('AI analysis error:', error);
      // Fallback to neutral analysis if AI fails
      return {
        sentiment: { score: 0, label: 'neutral' },
        category: 'other',
        priority: 'medium'
      };
    }
  }

  /**
   * Generate embeddings for semantic search
   */
  async generateEmbedding(text: string): Promise<number[]> {
    try {
      const response = await this.env.AI.run('@cf/baai/bge-base-en-v1.5', {
        text: [text]
      });

      return response.data[0] as number[];
    } catch (error) {
      console.error('Embedding generation error:', error);
      throw error;
    }
  }

  /**
   * Generate a summary of multiple feedback items
   */
  async generateSummary(feedbackItems: Array<{ title?: string; content: string; category?: string }>): Promise<string> {
    const feedbackText = feedbackItems
      .map((item, idx) => `${idx + 1}. ${item.title || 'Untitled'}: ${item.content.substring(0, 200)}...`)
      .join('\n\n');

    const prompt = `Summarize the key themes and insights from this product feedback. Be concise and highlight the most important issues, requests, and sentiments.

Feedback:
${feedbackText}

Summary:`;

    try {
      const response = await this.env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
        messages: [
          { role: 'system', content: 'You are a product manager assistant that creates concise feedback summaries.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 300
      });

      return response.response || 'Unable to generate summary.';
    } catch (error) {
      console.error('Summary generation error:', error);
      return 'Error generating summary.';
    }
  }

  /**
   * Parse AI response and extract structured data
   */
  private parseAIResponse(response: any): AIAnalysisResult {
    try {
      // Extract JSON from response
      let jsonStr = response.response || '';
      
      // Remove markdown code blocks if present
      jsonStr = jsonStr.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      
      const parsed = JSON.parse(jsonStr);
      
      // Validate and normalize
      return {
        sentiment: {
          score: Math.max(-1, Math.min(1, parsed.sentiment?.score || 0)),
          label: this.normalizeSentiment(parsed.sentiment?.label)
        },
        category: this.normalizeCategory(parsed.category),
        priority: this.normalizePriority(parsed.priority)
      };
    } catch (error) {
      console.error('Failed to parse AI response:', error, 'Response:', response);
      // Return default values
      return {
        sentiment: { score: 0, label: 'neutral' },
        category: 'other',
        priority: 'medium'
      };
    }
  }

  private normalizeSentiment(label: string): 'positive' | 'negative' | 'neutral' {
    const normalized = label?.toLowerCase() || '';
    if (normalized.includes('pos')) return 'positive';
    if (normalized.includes('neg')) return 'negative';
    return 'neutral';
  }

  private normalizeCategory(category: string): string {
    const normalized = category?.toLowerCase() || '';
    const validCategories = ['bug', 'feature_request', 'ux_issue', 'performance', 'documentation', 'pricing', 'other'];
    
    for (const valid of validCategories) {
      if (normalized.includes(valid.replace('_', ' ')) || normalized.includes(valid)) {
        return valid;
      }
    }
    return 'other';
  }

  private normalizePriority(priority: string): 'low' | 'medium' | 'high' | 'critical' {
    const normalized = priority?.toLowerCase() || '';
    if (normalized.includes('crit')) return 'critical';
    if (normalized.includes('high')) return 'high';
    if (normalized.includes('low')) return 'low';
    return 'medium';
  }
}
