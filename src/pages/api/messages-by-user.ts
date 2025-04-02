// File: pages/api/messages-by-user.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../lib/mongodb';
import Chat from '../../../models/Chat';
import Message from '../../../models/Message';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  if (req.method === 'GET') {
    try {
      const { userId } = req.query;
      
      console.log('API received request for userId:', userId);
      
      if (!userId) {
        return res.status(400).json({ success: false, error: 'User ID is required' });
      }
      
      // First, get all chat IDs for this user
      const chats = await Chat.find({ userId }).select('_id');
      
      if (chats.length === 0) {
        return res.status(200).json({ 
          success: true, 
          data: [] 
        });
      }
      
      const chatIds = chats.map(chat => chat._id);
      console.log(`Found ${chatIds.length} chats for user:`, userId);
      
      // Then, get all messages for these chats
      const messages = await Message.find({ 
        chatId: { $in: chatIds } 
      }).sort({ createdAt: -1 });
      
      console.log(`Found ${messages.length} messages across all chats`);
      
      return res.status(200).json({ 
        success: true, 
        data: messages
      });
    } catch (error) {
      console.error('Error fetching messages by user:', error);
      return res.status(500).json({ success: false, error: 'Server error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
  }
}