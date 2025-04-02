// pages/api/chats.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../lib/mongodb';
import Chat from '../../../models/Chat';
import Message from '../../../models/Message';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  // GET request to fetch all chats for a user
  if (req.method === 'GET') {
    try {
      const { userId } = req.query;
      
      if (!userId) {
        return res.status(400).json({ 
          success: false, 
          error: 'userId is required' 
        });
      }
      
      // Find all chats for this user
      const chats = await Chat.find({ userId }).sort({ updatedAt: -1 });
      
      return res.status(200).json({ 
        success: true, 
        data: chats 
      });
    } catch (error) {
      console.error('Error fetching chats:', error);
      return res.status(500).json({ 
        success: false, 
        error: 'Server error' 
      });
    }
  }
  
  // POST request to create a new chat
  else if (req.method === 'POST') {
    try {
      const { chatName, userId } = req.body;
      
      if (!chatName || !userId) {
        return res.status(400).json({ 
          success: false, 
          error: 'Chat name and userId are required' 
        });
      }
      
      // Create a new chat
      const chat = await Chat.create({
        chatName,
        userId
      });
      
      return res.status(201).json({ 
        success: true, 
        data: chat 
      });
    } catch (error) {
      console.error('Error creating chat:', error);
      return res.status(500).json({ 
        success: false, 
        error: 'Server error' 
      });
    }
  }

  // DELETE request to delete a chat and its messages
  else if (req.method === 'DELETE') {
    try {
      const { chatId } = req.query;
      
      if (!chatId) {
        return res.status(400).json({ 
          success: false, 
          error: 'chatId is required for deletion' 
        });
      }
      
      console.log(`Attempting to delete chat with ID: ${chatId}`);
      
      // First, delete all messages associated with this chat
      const messagesDeleted = await Message.deleteMany({ chatId });
      console.log(`Deleted ${messagesDeleted.deletedCount} messages for chat ID: ${chatId}`);
      
      // Then delete the chat itself
      const chatDeleted = await Chat.findByIdAndDelete(chatId);
      
      if (!chatDeleted) {
        return res.status(404).json({ 
          success: false, 
          error: 'Chat not found' 
        });
      }
      
      console.log(`Successfully deleted chat: ${chatId}`);
      
      return res.status(200).json({ 
        success: true, 
        message: 'Chat and associated messages deleted successfully',
        data: {
          chatId: chatId,
          messagesDeleted: messagesDeleted.deletedCount
        }
      });
    } catch (error) {
      console.error('Error deleting chat:', error);
      return res.status(500).json({ 
        success: false, 
        error: 'Server error' 
      });
    }
  }

  // Method not allowed
  else {
    res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
    return res.status(405).json({ 
      success: false, 
      error: `Method ${req.method} Not Allowed` 
    });
  }
}