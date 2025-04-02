import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../lib/mongodb';
import Chat from '../../../models/Chat';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  if (req.method === 'POST') {
    try {
      const { chatName, userId, messages } = req.body;
      
      if (!chatName) {
        return res.status(400).json({ success: false, error: 'Chat name is required' });
      }
      
      // Create a new chat or update an existing one
      const chat = await Chat.findOneAndUpdate(
        { chatName, userId },
        { chatName, userId, $set: { updatedAt: new Date() } },
        { upsert: true, new: true }
      );
      
      return res.status(200).json({ success: true, data: chat });
    } catch (error) {
      console.error('Error updating chat session:', error);
      return res.status(500).json({ success: false, error: 'Server error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
  }
}