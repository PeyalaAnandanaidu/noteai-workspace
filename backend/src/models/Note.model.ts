import mongoose, { Document, Schema } from 'mongoose';

interface AISummary {
  summary: string;
  actionItems: string[];
  suggestedTitle: string;
  generatedAt: Date;
}

export interface INote extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  content: string;
  tags: string[];
  isPinned: boolean;
  isArchived: boolean;
  isPublic: boolean;
  shareId?: string;
  aiSummary?: AISummary;
  createdAt: Date;
  updatedAt: Date;
}

const aiSummarySchema = new Schema<AISummary>(
  {
    summary: String,
    actionItems: [String],
    suggestedTitle: String,
    generatedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const noteSchema = new Schema<INote>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      default: 'Untitled Note',
      maxlength: [300, 'Title cannot exceed 300 characters'],
    },
    content: {
      type: String,
      default: '',
    },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: (tags: string[]) => tags.length <= 10,
        message: 'Cannot have more than 10 tags',
      },
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    shareId: {
      type: String,
      // ✅ No unique, no sparse, no index here — completely plain
    },
    aiSummary: {
      type: aiSummarySchema,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// ✅ All indexes defined here in one place
noteSchema.index({ userId: 1, updatedAt: -1 });
noteSchema.index({ shareId: 1 }, { unique: true, sparse: true });
noteSchema.index(
  { title: 'text', content: 'text', tags: 'text' },
  { weights: { title: 10, tags: 5, content: 1 } }
);

export const Note = mongoose.model<INote>('Note', noteSchema);