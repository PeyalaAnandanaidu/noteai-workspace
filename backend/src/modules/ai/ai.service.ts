import Groq from 'groq-sdk';
import { env } from '../../config/env';
import { AIUsage } from '../../models/AIUsage.model';
import { Note } from '../../models/Note.model';

const groq = new Groq({
  apiKey: env.groqApiKey,
});

interface AISummaryResult {
  summary: string;
  actionItems: string[];
  suggestedTitle: string;
}

const SYSTEM_PROMPT = `You are a helpful AI assistant that analyzes notes and extracts key information.
You MUST respond with valid JSON only. No markdown, no explanation, just the JSON object.

Required JSON structure:
{
  "summary": "A concise 2-3 sentence summary of the note content",
  "action_items": ["Action item 1", "Action item 2"],
  "suggested_title": "A clear, descriptive title for this note"
}

Rules:
- summary: 2-3 sentences max, capture the essence
- action_items: Extract concrete tasks/todos (empty array if none)
- suggested_title: Max 10 words, descriptive and clear
- Always return valid JSON, nothing else`;

export const aiService = {
  async generateSummary(
    noteId: string,
    userId: string
  ): Promise<AISummaryResult> {
    // Fetch the note to get content
    const note = await Note.findOne({ _id: noteId, userId });

    if (!note) {
      throw new Error('Note not found');
    }

    const noteContent = `Title: ${note.title}\n\nContent:\n${note.content}`;

    if (!note.content || note.content.trim().length < 10) {
      throw new Error('Note content is too short to summarize');
    }

    // Call Groq API
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: `Please analyze this note and return the JSON summary:\n\n${noteContent}`,
        },
      ],
      temperature: 0.3, // Lower temp = more consistent, structured output
      max_tokens: 500,
    });

    const rawResponse = completion.choices[0]?.message?.content;

    if (!rawResponse) {
      throw new Error('No response from AI service');
    }

    // Parse JSON response — with error handling
    let parsed: { summary: string; action_items: string[]; suggested_title: string };

    try {
      // Sometimes LLMs add backticks — strip them just in case
      const cleaned = rawResponse
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();

      parsed = JSON.parse(cleaned);
    } catch {
      throw new Error('AI returned invalid response format');
    }

    const result: AISummaryResult = {
      summary: parsed.summary || '',
      actionItems: Array.isArray(parsed.action_items) ? parsed.action_items : [],
      suggestedTitle: parsed.suggested_title || note.title,
    };

    // Save summary to note
    await Note.findByIdAndUpdate(noteId, {
      $set: {
        aiSummary: {
          summary: result.summary,
          actionItems: result.actionItems,
          suggestedTitle: result.suggestedTitle,
          generatedAt: new Date(),
        },
      },
    });

    // Log AI usage for dashboard stats
    await AIUsage.create({
      userId,
      noteId,
      type: 'summary',
      tokensUsed: completion.usage?.total_tokens || 0,
    });

    return result;
  },
};