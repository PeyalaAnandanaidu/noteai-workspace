import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ProtectedRoute, PublicOnlyRoute } from './ProtectedRoute'
import { AppLayout } from '../layouts/AppLayout'
import { AuthLayout } from '../layouts/AuthLayout'
import { LandingPage } from '../pages/LandingPage'
import { LoginPage } from '../pages/LoginPage'
import { SignupPage } from '../pages/SignupPage'
import { DashboardPage } from '../pages/DashboardPage'
import { NotesPage } from '../pages/NotesPage'
import { NoteEditorPage } from '../pages/NoteEditorPage'
import { SharedNotePage } from '../pages/SharedNotePage'
import { NotFoundPage } from '../pages/NotFoundPage'

const router = createBrowserRouter([
  // ── Public routes ──────────────────────────────
  {
    path: '/',
    element: <LandingPage />,   // Landing page at root
  },
  {
    path: '/shared/:shareId',
    element: <SharedNotePage />,
  },

  // ── Auth routes (redirect if logged in) ────────
  {
    element: <PublicOnlyRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          { path: '/login', element: <LoginPage /> },
          { path: '/signup', element: <SignupPage /> },
        ],
      },
    ],
  },

  // ── Protected routes (require auth) ────────────
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: '/dashboard', element: <DashboardPage /> },
          { path: '/notes', element: <NotesPage /> },
          { path: '/notes/:id', element: <NoteEditorPage /> },
          { path: '/archive', element: <NotesPage /> },
        ],
      },
    ],
  },

  // ── 404 ────────────────────────────────────────
  { path: '*', element: <NotFoundPage /> },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}