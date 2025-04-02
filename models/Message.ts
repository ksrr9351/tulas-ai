import mongoose, { Schema, Document } from 'mongoose';
import encrypt from 'mongoose-encryption';
import dotenv from 'dotenv';

dotenv.config();

export interface IMessage extends Document {
  chatId: string;
  role: string;
  content: string;
  createdAt: Date;
}

const MessageSchema: Schema = new Schema(
  {
    chatId: {
      type: Schema.Types.ObjectId,
      ref: 'Chat',
      required: [true, 'Chat ID is required']
    },
    role: {
      type: String,
      enum: ['user', 'assistant', 'system'],
      required: [true, 'Role is required']
    },
    content: {
      type: String,
      required: [true, 'Content is required']
    }
  },
  {
    timestamps: true
  }
);

// 🔐 Use ONLY `secret`, NOT `encryptionKey` and `signingKey`
const ENC_SECRET = process.env.ENCRYPTION_SECRET || 'your-32-char-secret-key';

MessageSchema.plugin(encrypt, {
  secret: ENC_SECRET,
  encryptedFields: ['content']
});

// Prevent model duplication in Next.js
export default mongoose.models.Message || mongoose.model<IMessage>('Message', MessageSchema);
