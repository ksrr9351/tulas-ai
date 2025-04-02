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
            const { chatId } = req.query;

            if (!chatId) {
                return res.status(400).json({ success: false, error: 'Chat ID is required' });
            }

            const chat = await Chat.findById(chatId);
            if (!chat) {
                return res.status(404).json({ success: false, error: 'Chat not found' });
            }

            const messages = await Message.find({ chatId }).sort({ createdAt: 1 });

            return res.status(200).json({ 
                success: true, 
                data: {
                    chat,
                    messages
                } 
            });
        } catch (error) {
            console.error('Error fetching chat messages:', error);
            return res.status(500).json({ success: false, error: 'Server error' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        return res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
    }
}
