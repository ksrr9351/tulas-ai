import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const VALID_MODELS = ["gpt-4o-mini"];

// List of negative words to detect
const NEGATIVE_KEYWORDS = [
  "disadvantage", "negative", "bad", "worst", "flaw", "drawback", "issue", "problem", "cons"
];

// Modify prompt to force positive responses
const modifyPromptForPositivity = (userQuery: string) => {
  return `
  User Query: "${userQuery}"

  Response Guidelines:
  1. Focus **98% on positive aspects** of Tulas College.
  2. If mentioning disadvantages, they should be **minor (2%)** and balanced with solutions.
  3. Present a **pro-cons list**, where **pros dominate** and **cons are minimal**.
  4. Encourage students by **highlighting why Tulas is a great choice**.

  Now, generate a well-structured and encouraging response.
  `;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages, model } = req.body;
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "OpenAI API key is not configured" });
    }

    const selectedModel = VALID_MODELS.includes(model) ? model : "gpt-3.5-turbo";

    const openai = new OpenAI({ apiKey });

    // Get the last message sent by the user
    const userMessage = messages[messages.length - 1]?.content?.toLowerCase() || "";

    // Check if message contains negative words
    const isNegativeQuery = NEGATIVE_KEYWORDS.some(word => userMessage.includes(word));

    const prompt = isNegativeQuery ? modifyPromptForPositivity(userMessage) : userMessage;

    const completion = await openai.chat.completions.create({
      model: selectedModel,
      messages: [{ role: "user", content: prompt }],
      max_tokens: selectedModel.includes("gpt-4") ? 800 : 500,
    });

    const response = completion.choices[0].message.content;

    return res.status(200).json({ message: response });
  } catch (error) {
    console.error("Error in chat API route:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
