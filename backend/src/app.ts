// backend/src/app.ts

import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import http from 'http'                          // ✅ ADD
import { Server } from 'socket.io'               // ✅ ADD

import { env } from './config/env'
import { connectDB } from './config/db'
import { errorHandler } from './middleware/error.middleware'
import { registerNoteSocket } from './socket/noteSocket' // ✅ ADD

// Route imports
import authRoutes from './modules/auth/auth.routes'
import notesRoutes from './modules/notes/notes.routes'
import aiRoutes from './modules/ai/ai.routes'
import dashboardRoutes from './modules/dashboard/dashboard.routes'
import sharedRoutes from './modules/notes/shared.routes'

env.validateEnv()

const app = express()

// ✅ Create HTTP server from express app
const server = http.createServer(app)

// ✅ Attach Socket.io to the HTTP server
const io = new Server(server, {
  cors: {
    origin: env.frontendUrl,
    methods: ['GET', 'POST', 'PATCH'],
    credentials: true,
  },
})

// ✅ Register socket handlers
registerNoteSocket(io)

// ── Security Middleware ──────────────────────────────────────
app.use(helmet())
app.use(
  cors({
    origin: env.frontendUrl,
    credentials: true,
  })
)

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
})

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Too many auth attempts, please try again later.',
})

app.use(globalLimiter)
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// ── Health Check ─────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// ── Routes ───────────────────────────────────────────────────
app.use('/api/auth', authLimiter, authRoutes)
app.use('/api/notes', notesRoutes)
app.use('/api/ai', aiRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/shared', sharedRoutes)

// ── Error Handler ─────────────────────────────────────────────
app.use(errorHandler)

// ── Start Server ─────────────────────────────────────────────
async function bootstrap() {
  await connectDB()
  // ✅ Use server.listen() not app.listen()
  server.listen(env.port, () => {
    console.log(`🚀 Server running on port ${env.port} [${env.nodeEnv}]`)
    console.log(`🔌 Socket.io ready`)
  })
}

bootstrap()

export default app