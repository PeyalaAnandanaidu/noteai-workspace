// frontend/src/hooks/useCollaboration.ts

import { useEffect, useRef, useState, useCallback } from 'react'
import { io, Socket } from 'socket.io-client'

interface CollabUser {
    userId: string
    name: string
}

interface UseCollaborationProps {
    noteId: string
    userId: string
    userName: string
    onContentChange: (content: string) => void
    onTitleChange: (title: string) => void
}

export function useCollaboration({
    noteId,
    userId,
    userName,
    onContentChange,
    onTitleChange,
}: UseCollaborationProps) {
    const socketRef = useRef<Socket | null>(null)
    const [activeUsers, setActiveUsers] = useState<CollabUser[]>([])
    const [typingUser, setTypingUser] = useState<string | null>(null)
    const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const isRemoteUpdate = useRef(false)

    useEffect(() => {
        // Connect to socket server
        const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api'
        const socketUrl = apiUrl.replace('/api', '')

        const socket = io(socketUrl, {
            transports: ['websocket'],
            withCredentials: true,
        })


        socketRef.current = socket

        // Join the note room
        socket.emit('join-note', { noteId, userId, name: userName })

        // Receive content/title changes from others
        socket.on('receive-changes', ({ content, title }) => {
            console.log('📥 Received changes')

            isRemoteUpdate.current = true

            if (content !== undefined) onContentChange(content)
            if (title !== undefined) onTitleChange(title)

            setTimeout(() => {
                isRemoteUpdate.current = false
            }, 50)
        })

        // Receive active users list
        socket.on('users-changed', ({ users }: { users: CollabUser[] }) => {
            // Don't show yourself in the list
            setActiveUsers(users.filter((u) => u.userId !== userId))
        })

        // Receive typing indicator
        socket.on('user-typing', ({ name }: { name: string }) => {
            setTypingUser(name)

            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current)
            }

            typingTimeoutRef.current = setTimeout(() => {
                setTypingUser(null)
            }, 1500)
        })

        return () => {
            socket.emit('leave-note', { noteId, userId })
            socket.disconnect()

            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current)
            }
        }
    }, [noteId, userId])

    // Send content change to others
    const sendContentChange = useCallback(
        (content: string) => {
            if (isRemoteUpdate.current) return

            socketRef.current?.emit('note-change', {
                noteId,
                content,
            })
        },
        [noteId]
    )

    // Send title change to others
    const sendTitleChange = useCallback(
        (title: string) => {
            if (isRemoteUpdate.current) return

            socketRef.current?.emit('note-change', {
                noteId,
                title,
            })
        },
        [noteId]
    )

    // Send typing indicator
    const sendTyping = useCallback(() => {
        socketRef.current?.emit('typing', { noteId, name: userName })
    }, [noteId, userName])

    return {
        activeUsers,
        typingUser,
        sendContentChange,
        sendTitleChange,
        sendTyping,
        isRemoteUpdate,
    }
}