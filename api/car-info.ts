import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  try {
    const { brand, title, category } = req.body;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 700,
        messages: [
          {
            role: 'user',
            content: `
You are an automotive expert.

Give premium automotive information about:
Brand: ${brand}
Model: ${title}
Category: ${category}

Return ONLY valid JSON:

{
  "about": "...",
  "history": "...",
  "facts": ["...", "...", "...", "..."]
}
            `,
          },
        ],
      }),
    });

    const data = await response.json();

    const text =
      data.content?.map((b: any) => b.text || '').join('') || '';

    const clean = text.replace(/```json|```/g, '').trim();

    res.status(200).json(JSON.parse(clean));
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: 'Failed to fetch car info',
    });
  }
}