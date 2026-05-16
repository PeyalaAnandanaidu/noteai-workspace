import { Note, INote } from '../../models/Note.model'
import { v4 as uuidv4 } from 'uuid'
import mongoose from 'mongoose'

interface CreateNoteInput {
    title?: string
    content?: string
    tags?: string[]
}

interface UpdateNoteInput {
    title?: string
    content?: string
    tags?: string[]
    isPinned?: boolean
    isArchived?: boolean
    isPublic?: boolean
}

interface GetNotesQuery {
    search?: string
    tags?: string
    archived?: string
    pinned?: string
    page?: string
    limit?: string
    sort?: string
}

export const notesService = {
    async getNotes(userId: string, query: GetNotesQuery) {
        const {
            search,
            tags,
            archived = 'false',
            pinned,
            page = '1',
            limit = '20',
        } = query

        const filter: mongoose.FilterQuery<INote> = {
            userId: new mongoose.Types.ObjectId(userId),
            isArchived: archived === 'true',
        }

        if (pinned === 'true') {
            filter.isPinned = true
        }

        if (tags) {
            const tagArray = tags.split(',').map((t) => t.trim())
            filter.tags = { $in: tagArray }
        }

        if (search && search.trim()) {
            filter.$text = { $search: search.trim() }
        }

        const skip = (parseInt(page) - 1) * parseInt(limit)

        // ✅ Determine sorting FIRST
        let sortOption: any = { isPinned: -1, updatedAt: -1 }

        if (search) {
            sortOption = { score: { $meta: 'textScore' }, updatedAt: -1 }
        } else {
            if (query.sort === 'oldest') {
                sortOption = { isPinned: -1, updatedAt: 1 }
            }

            if (query.sort === 'title_asc') {
                sortOption = { isPinned: -1, title: 1 }
            }

            if (query.sort === 'title_desc') {
                sortOption = { isPinned: -1, title: -1 }
            }
        }

        const [notes, total] = await Promise.all([
            Note.find(filter)
                .sort(sortOption)      // ✅ Apply sort here
                .skip(skip)
                .limit(parseInt(limit))
                .lean(),

            Note.countDocuments(filter),
        ])

        return {
            notes,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / parseInt(limit)),
            },
        }
    },

    async getNoteById(noteId: string, userId: string): Promise<INote> {
        const note = await Note.findOne({
            _id: noteId,
            userId: new mongoose.Types.ObjectId(userId),
        })

        if (!note) {
            throw new Error('Note not found')
        }

        return note
    },

    async createNote(userId: string, input: CreateNoteInput): Promise<INote> {
        const note = await Note.create({
            userId,
            title: input.title || 'Untitled Note',
            content: input.content || '',
            tags: input.tags || [],
        })
        return note
    },

    async updateNote(
        noteId: string,
        userId: string,
        input: UpdateNoteInput
    ): Promise<INote> {
        // ✅ Business rule: archiving a note removes the pin
        // A note cannot be both pinned and archived
        const updateData: UpdateNoteInput = { ...input }

        if (input.isArchived === true) {
            updateData.isPinned = false
        }

        // ✅ Business rule: unarchiving a note brings it back as unpinned
        // User can re-pin it manually if they want
        if (input.isArchived === false) {
            // Don't touch isPinned — let user decide after unarchiving
        }

        const note = await Note.findOneAndUpdate(
            {
                _id: noteId,
                userId: new mongoose.Types.ObjectId(userId),
            },
            { $set: updateData },
            {
                new: true,
                runValidators: true,
            }
        )

        if (!note) {
            throw new Error('Note not found')
        }

        console.log(`[updateNote] ${noteId}:`, {
            isPinned: note.isPinned,
            isArchived: note.isArchived,
        })

        return note
    },

    async deleteNote(noteId: string, userId: string): Promise<void> {
        const result = await Note.findOneAndDelete({
            _id: noteId,
            userId: new mongoose.Types.ObjectId(userId),
        })

        if (!result) {
            throw new Error('Note not found')
        }
    },

    async generateShareLink(noteId: string, userId: string): Promise<string> {
        const shareId = uuidv4()

        const note = await Note.findOneAndUpdate(
            { _id: noteId, userId: new mongoose.Types.ObjectId(userId) },
            { $set: { shareId, isPublic: true } },
            { new: true }
        )

        if (!note) {
            throw new Error('Note not found')
        }

        return shareId
    },

    async removeShareLink(noteId: string, userId: string): Promise<void> {
        const note = await Note.findOneAndUpdate(
            { _id: noteId, userId: new mongoose.Types.ObjectId(userId) },
            { $unset: { shareId: '' }, $set: { isPublic: false } },
            { new: true }
        )

        if (!note) {
            throw new Error('Note not found')
        }
    },

    async getSharedNote(shareId: string) {
        const note = await Note.findOne({
            shareId: shareId.trim(),
            isPublic: true,
        })
            .select('-userId')
            .lean()

        if (!note) {
            throw new Error('Shared note not found or no longer public')
        }

        return note
    },
}