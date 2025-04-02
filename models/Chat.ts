import mongoose, { Schema, Document } from 'mongoose';

export interface IChat extends Document {
  chatName: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

const ChatSchema: Schema = new Schema(
  {
    chatName: {
      type: String,
      required: [true, 'Please provide a chat name'],
      maxlength: [100, 'Chat name cannot be more than 100 characters'],
    },
    userId: {
      type: String,
      required: [true, 'Please provide a user ID'],
    },
  },
  {
    timestamps: true,
  }
);

// Check if the model is already defined to prevent overwriting during hot reloads
export default mongoose.models.Chat || mongoose.model<IChat>('Chat', ChatSchema);