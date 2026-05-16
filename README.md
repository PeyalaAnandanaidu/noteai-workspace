# Complete README.md

```md
# NoteAI — Collaborative AI Notes Workspace

A full-stack, AI-powered notes application built for the **Peblo Full Stack Developer Challenge**.

Users can create, organize, and share notes with AI-generated summaries, real-time collaboration, and productivity insights — all in a clean, modern interface.

---

## 🌐 Live Demo

- **Frontend:** [https://your-app.vercel.app](https://your-app.vercel.app)
- **Backend:** [https://your-app.onrender.com](https://your-app.onrender.com)


---

## 🏗️ Architecture

```
┌─────────────────────┐   HTTPS/JWT    ┌──────────────────────┐
│     Frontend        │ ◄────────────► │      Backend         │
│  React + Vite + TS  │                │  Node.js + Express   │
│     (Vercel)        │   Socket.io    │     (Render)         │
└─────────────────────┘ ◄────────────► └──────────┬───────────┘
                                                   │
                                       ┌───────────▼──────────┐
                                       │   MongoDB Atlas      │
                                       │   + Groq AI API      │
                                       └──────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, TypeScript, Tailwind CSS, shadcn/ui |
| State Management | Zustand (auth), TanStack Query (server state) |
| Backend | Node.js, Express, TypeScript |
| Database | MongoDB Atlas + Mongoose ODM |
| AI Provider | Groq API (Llama 3-8b) |
| Real-time | Socket.io (WebSockets) |
| Authentication | JWT + bcryptjs (12 salt rounds) |
| Validation | Zod (backend), React Hook Form (frontend) |

---

## 📁 Folder Structure

```
├── frontend/
│   └── src/
│       ├── components/         # Reusable UI components (shadcn/ui)
│       │   ├── ui/             # Button, Card, Badge, Skeleton, etc.
│       │   └── common/         # MarkdownToolbar, CollaborationBar, etc.
│       ├── features/           # Feature-based hooks
│       │   ├── notes/hooks/    # useNotes, useNote, useUpdateNote
│       │   ├── ai/hooks/       # useGenerateSummary
│       │   └── dashboard/hooks/# useDashboard
│       ├── hooks/              # Shared hooks (useDebounce, useCollaboration)
│       ├── pages/              # Route-level page components
│       ├── layouts/            # AppLayout, AuthLayout
│       ├── services/           # Axios API service layer
│       ├── store/              # Zustand auth store
│       ├── config/             # Constants, API URLs
│       ├── types/              # TypeScript interfaces
│       ├── utils/              # Helper functions
│       └── routes/             # React Router config
│
└── backend/
    └── src/
        ├── modules/
        │   ├── auth/           # Signup, login, JWT
        │   ├── notes/          # CRUD, share, archive
        │   ├── ai/             # Groq summary generation
        │   └── dashboard/      # Aggregation & stats
        ├── socket/             # Socket.io real-time handlers
        ├── middleware/         # Auth, error handler, validation
        ├── models/            # Mongoose schemas (User, Note, AIUsage)
        ├── config/            # DB connection, env validation
        └── utils/             # Response helpers
```

---

## ✨ Features

### 1. Authentication
- Signup and login with JWT tokens
- Persistent sessions via localStorage (Zustand persist)
- Protected routes — unauthenticated users redirected to login
- Passwords hashed with bcryptjs (12 salt rounds)
- Rate limiting: 10 requests/15 min on auth endpoints

### 2. Notes Workspace
- Create, edit, and delete notes
- **Auto-save** after 1.5 seconds of inactivity (debounced)
- **Markdown editor** with live preview toggle
- **Markdown toolbar** with formatting buttons
- Tags — add by typing + Enter, remove with ✕
- Pin important notes (always sorted to top)
- Archive notes (separate archive view)
- Business rule: archiving removes pin automatically

### 3. AI Integration (Groq + Llama 3)
- One-click AI summary generation
- Extracts **action items** from note content
- Suggests **better titles** with "Apply" button
- Results displayed in side panel
- AI usage tracked (summaries count + tokens used)
- Rate limited: 20 requests/hour

### 4. Search & Filtering
- **Full-text search** with MongoDB text index
- **Tag filtering** with clickable tag pills
- **Sorting**: Recently edited (default), Oldest, Title A-Z, Title Z-A
- Pinned notes always appear first regardless of sort
- Search is **debounced** (400ms) for smooth UX

### 5. Public Sharing
- Generate unique public share link (UUID v4)
- Anyone can view shared notes **without login**
- Remove share link to make private again
- Clean public-facing page with markdown rendering + AI summary

### 6. Productivity Dashboard
- Total active notes count
- Archived notes count
- Pinned notes count
- AI summaries generated count
- **Recently edited** notes (last 5)
- **Most-used tags** (top 8, aggregation pipeline)
- **Weekly activity** bar chart (last 7 days)
- Total AI tokens used

### 7. Real-Time Collaboration (Bonus)
- Implemented using **Socket.io** WebSockets
- Multiple sessions editing same note see changes **instantly**
- **Active user avatars** with initials shown in editor
- **"User is typing..."** indicator with animation
- Room-based architecture (each note = one room)
- Auto-cleanup on disconnect

### 8. Additional Features (Bonus)
- **Markdown preview** with toggle (edit/preview modes)
- **Keyboard shortcuts** (Ctrl+B bold, Ctrl+I italic, etc.)
- **Dark mode** support (Tailwind dark: classes)
- **Optimistic UI** updates (instant feedback)
- **Landing page** with feature showcase

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ installed
- **MongoDB Atlas** account ([free tier](https://www.mongodb.com/cloud/atlas))
- **Groq API key** ([free at console.groq.com](https://console.groq.com))

---

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/noteai-workspace.git
cd noteai-workspace
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/noteai
JWT_SECRET=your-super-secret-key-minimum-32-characters-long
JWT_EXPIRES_IN=7d
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
FRONTEND_URL=http://localhost:5173
```

Start the backend:

```bash
npm run dev
```

You should see:

```
✅ MongoDB connected successfully
🚀 Server running on port 5000 [development]
🔌 Socket.io ready
```

---

### 3. Frontend Setup

Open a **new terminal**:

```bash
cd frontend
npm install
```

Create `.env` file:

```bash
cp .env.example .env
```

Edit `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

You should see:

```
VITE ready in 500ms
➜ Local: http://localhost:5173/
```

---

### 4. Open the Application

Visit: **http://localhost:5173**

1. Click **"Get Started"** on the landing page
2. **Sign up** with name, email, password
3. **Create a note** and start writing
4. Click **"AI Summary"** to generate insights
5. Click **"Share"** to create a public link
6. Visit **Dashboard** to see productivity stats

---

## 🧪 How to Test

### Manual Testing

```bash
# 1. Start both servers
cd backend && npm run dev    # Terminal 1
cd frontend && npm run dev   # Terminal 2

# 2. Open browser
http://localhost:5173

# 3. Create account and test all features
```

### Test Real-Time Collaboration

```bash
# Open SAME note in two different browsers:
# Chrome:  http://localhost:5173/notes/<note-id>
# Firefox: http://localhost:5173/notes/<note-id>
# (Login as same user in both)
# Type in Chrome → see changes appear in Firefox instantly
```

### Test Public Sharing

```bash
# 1. Open a note → click "Share" → copy public link
# 2. Open an incognito/private window
# 3. Paste the public link
# 4. Note should be visible without login
```

### API Health Check

```bash
curl http://localhost:5000/health
# Response: { "status": "ok", "timestamp": "..." }
```

---

## 📡 API Reference

### Auth

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/signup` | No | Register new user |
| POST | `/api/auth/login` | No | Login, returns JWT |
| GET | `/api/auth/me` | Yes | Get current user |

### Notes

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/notes` | Yes | List notes (search, filter, sort) |
| POST | `/api/notes` | Yes | Create note |
| GET | `/api/notes/:id` | Yes | Get single note |
| PATCH | `/api/notes/:id` | Yes | Update note |
| DELETE | `/api/notes/:id` | Yes | Delete note |
| POST | `/api/notes/:id/share` | Yes | Generate share link |
| DELETE | `/api/notes/:id/share` | Yes | Remove share link |

### AI

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/ai/notes/:id/generate-summary` | Yes | Generate AI summary |

### Public

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/shared/:shareId` | No | View shared note |

### Dashboard

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/dashboard` | Yes | Get all stats |

### Query Parameters (GET /api/notes)

| Param | Example | Description |
|-------|---------|-------------|
| `search` | `?search=sprint` | Full-text search |
| `tags` | `?tags=work,meeting` | Filter by tags |
| `archived` | `?archived=true` | Show archived notes |
| `sort` | `?sort=oldest` | Sort: `oldest`, `title_asc`, `title_desc` |
| `page` | `?page=2` | Pagination |
| `limit` | `?limit=10` | Items per page |

---

## 🗄️ Database Schema

### User

```json
{
  "_id": "ObjectId",
  "name": "String (required)",
  "email": "String (unique, indexed)",
  "password": "String (hashed, select: false)",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Note

```json
{
  "_id": "ObjectId",
  "userId": "ObjectId (ref: User, indexed)",
  "title": "String (default: 'Untitled Note')",
  "content": "String (markdown)",
  "tags": ["String (lowercase, max 10)"],
  "isPinned": "Boolean (default: false)",
  "isArchived": "Boolean (default: false)",
  "isPublic": "Boolean (default: false)",
  "shareId": "String (UUID, unique, sparse index)",
  "aiSummary": {
    "summary": "String",
    "actionItems": ["String"],
    "suggestedTitle": "String",
    "generatedAt": "Date"
  },
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### AIUsage

```json
{
  "_id": "ObjectId",
  "userId": "ObjectId (ref: User, indexed)",
  "noteId": "ObjectId (ref: Note)",
  "type": "String (enum: 'summary')",
  "tokensUsed": "Number",
  "createdAt": "Date"
}
```

### Indexes

```
users:    email (unique)
notes:    userId, shareId (sparse), title+content (text index)
aiusages: userId
```

---

## 🔒 Security

- JWT tokens expire in 7 days
- Passwords hashed with bcryptjs (12 rounds)
- Helmet.js for HTTP security headers
- CORS restricted to frontend URL only
- Rate limiting:
  - Global: 100 requests / 15 minutes
  - Auth: 10 requests / 15 minutes
  - AI: 20 requests / hour
- Input validation with Zod on all endpoints
- No secrets committed (all in `.env`, gitignored)
- MongoDB injection prevention via Mongoose

---

## 🤖 AI Integration Details

**Provider:** Groq (Llama )

**How it works:**
1. User clicks "AI Summary" on a note
2. Backend sends note content to Groq API with structured prompt
3. AI returns JSON: `{ summary, action_items, suggested_title }`
4. Response saved to note document
5. Usage logged to AIUsage collection
6. Dashboard displays aggregate stats

**Sample AI Output:**

```json
{
  "summary": "Sprint planning meeting focused on authentication module with clear task assignments and Friday deadline.",
  "actionItems": [
    "Complete backend auth APIs",
    "Design dashboard UI",
    "Test AI summary outputs"
  ],
  "suggestedTitle": "Sprint 12 Planning Notes"
}
```

---


---

## 📋 Business Rules

- A note **cannot** be pinned AND archived simultaneously
- Archiving a note **automatically removes** its pin
- Share links are UUID v4, globally unique
- AI summaries are stored directly on the note document
- Tags are lowercase, maximum 10 per note
- Default sort: pinned first, then most recently updated

---

## 🚢 Deployment

### Backend → Render

1. Create **Web Service** on [render.com](https://render.com)
2. Connect GitHub repo
3. **Root Directory:** `backend`
4. **Build Command:** `npm install && npm run build`
5. **Start Command:** `node dist/app.js`
6. Add all environment variables from `.env.example`

### Frontend → Vercel

1. Import repo on [vercel.com](https://vercel.com)
2. **Root Directory:** `frontend`
3. **Build Command:** `npm run build`
4. Add `VITE_API_URL` pointing to Render backend URL
5. Deploy

---

## 📸 Screenshots

> Add screenshots to `samples/screenshots/` folder

- Landing Page
- Dashboard
- Note Editor with Markdown
- AI Summary Panel
- Search & Filter
- Public Shared Note
- Real-Time Collaboration





## 👨‍💻 Author

**PEYALA ANANDA NAIDU**
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

