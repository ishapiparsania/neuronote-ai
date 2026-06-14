import { SummaryResult, ChatMessage } from '@/types/ai';
import { Note } from '@/types/note';
import { CHAT_SYSTEM_PROMPT, SUMMARIZE_SYSTEM_PROMPT, buildNotesContext } from './prompts';

type GeminiContentPart = {
	text: string;
};

type GeminiContent = {
	role: 'user' | 'model';
	parts: GeminiContentPart[];
};

type GeminiResponse = {
	candidates?: Array<{
		content?: {
			parts?: GeminiContentPart[];
		};
	}>;
	error?: {
		message?: string;
	};
};

const GEMINI_MODEL = 'gemini-3.5-flash';
const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta';

function getResponseText(response: GeminiResponse): string {
	return (
		response.candidates
			?.[0]?.content?.parts?.map(part => part.text).join('')
			?.trim() ?? ''
	);
}

function parseJsonSummary(raw: string): SummaryResult {
	const parsed = JSON.parse(raw) as Partial<SummaryResult>;
	return {
		summary: parsed.summary ?? 'No summary available.',
		actionItems: Array.isArray(parsed.actionItems) ? parsed.actionItems : [],
	};
}

export class GeminiService {
	private getApiKey: () => string;

	constructor(getApiKey: () => string) {
		this.getApiKey = getApiKey;
	}

	private async generateContent(body: object): Promise<string> {
		const apiKey = this.getApiKey();
		if (!apiKey) {
			throw new Error('API key not configured');
		}

		const response = await fetch(
			`${GEMINI_API_BASE}/models/${GEMINI_MODEL}:generateContent?key=${encodeURIComponent(apiKey)}`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(body),
			},
		);

		const rawText = await response.text();
		let payload: GeminiResponse = {};

		if (rawText) {
			try {
				payload = JSON.parse(rawText) as GeminiResponse;
			} catch {
				throw new Error('Gemini returned an invalid response.');
			}
		}

		if (!response.ok) {
			throw new Error(payload.error?.message ?? 'Gemini request failed.');
		}

		const text = getResponseText(payload);
		if (!text) {
			throw new Error('Gemini returned an empty response.');
		}

		return text;
	}

	async summarizeNote(content: string): Promise<SummaryResult> {
		const raw = await this.generateContent({
			systemInstruction: {
				parts: [{ text: SUMMARIZE_SYSTEM_PROMPT }],
			},
			contents: [
				{
					role: 'user',
					parts: [{ text: content }],
				},
			],
			generationConfig: {
				responseMimeType: 'application/json',
				maxOutputTokens: 512,
				temperature: 0.2,
			},
		});

		return parseJsonSummary(raw);
	}

	async chatWithNotes(
		notes: Note[],
		history: ChatMessage[],
		userMessage: string,
	): Promise<string> {
		const raw = await this.generateContent({
			systemInstruction: {
				parts: [
					{
						text: `${CHAT_SYSTEM_PROMPT}\n\n--- USER NOTES ---\n${buildNotesContext(notes)}`,
					},
				],
			},
			contents: [
				...history.slice(-10).map<GeminiContent>(message => ({
					role: message.role === 'assistant' ? 'model' : 'user',
					parts: [{ text: message.content }],
				})),
				{
					role: 'user',
					parts: [{ text: userMessage }],
				},
			],
			generationConfig: {
				maxOutputTokens: 1024,
				temperature: 0.5,
			},
		});

		return raw;
	}
}