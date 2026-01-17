import { geminiApiKey, geminiModel } from '../config';

export const isLlmConfigured = () =>
  typeof geminiApiKey === 'string' && geminiApiKey.trim().length > 0;

export const askGemini = async (prompt: string, context?: string) => {
  if (!isLlmConfigured()) return null;

  const combinedPrompt = context ? `${context}\n\n${prompt}` : prompt;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${geminiApiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: combinedPrompt }],
        },
      ],
    }),
  });

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (typeof text !== 'string') return null;

  const cleaned = text.trim();
  return cleaned.length > 0 ? cleaned : null;
};
