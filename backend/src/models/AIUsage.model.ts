import mongoose, { Document, Schema } from 'mongoose';

export interface IAIUsage extends Document {
  userId: mongoose.Types.ObjectId;
  noteId: mongoose.Types.ObjectId;
  type: 'summary';
  tokensUsed: number;
  createdAt: Date;
}

const aiUsageSchema = new Schema<IAIUsage>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    noteId: {
      type: Schema.Types.ObjectId,
      ref: 'Note',
      required: true,
    },
    type: {
      type: String,
      enum: ['summary'],
      default: 'summary',
    },
    tokensUsed: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    // Only store createdAt, not updatedAt for usage logs
  }
);

// Index for dashboard queries: "get all AI usage for user in last 7 days"
aiUsageSchema.index({ userId: 1, createdAt: -1 });

export const AIUsage = mongoose.model<IAIUsage>('AIUsage', aiUsageSchema);