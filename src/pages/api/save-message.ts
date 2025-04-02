import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../lib/mongodb';
import Chat from '../../../models/Chat';
import Message from '../../../models/Message';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    await dbConnect();

    if (req.method === 'POST') {
        try {
            const { chatId, role, content } = req.body;

            if (!chatId || !role || !content) {
                return res.status(400).json({ success: false, error: 'ChatId, role, and content are required' });
            }

            const chat = await Chat.findById(chatId);
            if (!chat) {
                return res.status(404).json({ success: false, error: 'Chat not found' });
            }

            const message = await Message.create({ chatId, role, content });

            // Update chat's updatedAt timestamp
            await Chat.findByIdAndUpdate(chatId, { updatedAt: new Date() });

            return res.status(201).json({ success: true, data: message });
        } catch (error) {
            console.error('Error saving message:', error);
            return res.status(500).json({ success: false, error: 'Server error' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
    }
}
