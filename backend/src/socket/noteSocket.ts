// backend/src/socket/noteSocket.ts

import { Server, Socket } from 'socket.io'

interface ActiveUser {
    socketId: string
    userId: string
    name: string
    noteId: string
}

// Track active users per note room
const activeUsers = new Map<string, ActiveUser[]>()

export function registerNoteSocket(io: Server) {
    io.on('connection', (socket: Socket) => {
        console.log('🔌 Socket connected:', socket.id)

        // ── Join a note room ──────────────────────────────
        socket.on(
            'join-note',
            ({ noteId, userId, name }: { noteId: string; userId: string; name: string }) => {
                socket.join(noteId)

                // Add user to active users
                const user: ActiveUser = { socketId: socket.id, userId, name, noteId }

                if (!activeUsers.has(noteId)) {
                    activeUsers.set(noteId, [])
                }

                // Avoid duplicate entries
                const existing = activeUsers.get(noteId)!
                const alreadyIn = existing.find((u) => u.userId === userId)
                if (!alreadyIn) {
                    existing.push(user)
                }

                // Broadcast updated user list to everyone in room
                io.to(noteId).emit('users-changed', {
                    users: activeUsers.get(noteId)!.map((u) => ({
                        userId: u.userId,
                        name: u.name,
                    })),
                })

                console.log(`👤 ${name} joined note: ${noteId}`)
            }
        )

        // ── Note content change ───────────────────────────
        // backend/src/socket/noteSocket.ts

        socket.on('note-change', ({ noteId, content, title }) => {
            // Broadcast to everyone ELSE in the room
            socket.to(noteId).emit('receive-changes', {
                content,
                title,
            })
        })
        // ── Typing indicator ──────────────────────────────
        socket.on(
            'typing',
            ({ noteId, name }: { noteId: string; name: string }) => {
                socket.to(noteId).emit('user-typing', { name })
            }
        )

        // ── Leave note room ───────────────────────────────
        socket.on('leave-note', ({ noteId, userId }: { noteId: string; userId: string }) => {
            handleLeave(socket, io, noteId, userId)
        })

        // ── Disconnect ────────────────────────────────────
        socket.on('disconnect', () => {
            // Find which note this socket was in
            activeUsers.forEach((users, noteId) => {
                const user = users.find((u) => u.socketId === socket.id)
                if (user) {
                    handleLeave(socket, io, noteId, user.userId)
                }
            })
            console.log('❌ Socket disconnected:', socket.id)
        })
    })
}

function handleLeave(
    socket: Socket,
    io: Server,
    noteId: string,
    userId: string
) {
    socket.leave(noteId)

    if (activeUsers.has(noteId)) {
        const updated = activeUsers
            .get(noteId)!
            .filter((u) => u.userId !== userId)

        if (updated.length === 0) {
            activeUsers.delete(noteId)
        } else {
            activeUsers.set(noteId, updated)
        }

        io.to(noteId).emit('users-changed', {
            users: (activeUsers.get(noteId) || []).map((u) => ({
                userId: u.userId,
                name: u.name,
            })),
        })
    }
}