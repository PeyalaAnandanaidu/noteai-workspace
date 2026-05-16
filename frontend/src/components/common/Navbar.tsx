import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BookOpen, Menu, X } from 'lucide-react'
import { useAuthStore } from '../../store/auth.store'
import { Button } from '../ui/button'
import { ThemeToggle } from './ThemeToggle'

export function Navbar() {
  const { isAuthenticated, logout } = useAuthStore()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-900 dark:text-slate-100">
              NoteAI
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-sm text-slate-600 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-sm text-slate-600 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
            >
              How it Works
            </a>
            <a
              href="#pricing"
              className="text-sm text-slate-600 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
            >
              Pricing
            </a>
          </div>

          {/* Desktop Auth Buttons + Theme */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <div className="w-px h-6 bg-slate-200 dark:bg-slate-700"></div>
            {isAuthenticated ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/dashboard')}
                  className="text-slate-600 dark:text-slate-400"
                >
                  Dashboard
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700 dark:bg-slate-900"
                >
                  Sign out
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/login')}
                  className="text-slate-600 dark:text-slate-400"
                >
                  Sign in
                </Button>
                <Button
                  size="sm"
                  onClick={() => navigate('/signup')}
                  className="bg-violet-600 hover:bg-violet-700 text-white"
                >
                  Get started free
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden py-4 border-t border-slate-100 dark:border-slate-800 space-y-1">
            <a
              href="#features"
              className="block px-3 py-2 text-sm text-slate-600 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg"
              onClick={() => setMenuOpen(false)}
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="block px-3 py-2 text-sm text-slate-600 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg"
              onClick={() => setMenuOpen(false)}
            >
              How it Works
            </a>
            <a
              href="#pricing"
              className="block px-3 py-2 text-sm text-slate-600 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg"
              onClick={() => setMenuOpen(false)}
            >
              Pricing
            </a>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2 px-3">
              {isAuthenticated ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      navigate('/dashboard')
                      setMenuOpen(false)
                    }}
                    className="w-full dark:bg-slate-900 dark:border-slate-700 dark:text-slate-300"
                  >
                    Dashboard
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="w-full dark:text-slate-400"
                  >
                    Sign out
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      navigate('/login')
                      setMenuOpen(false)
                    }}
                    className="w-full dark:bg-slate-900 dark:border-slate-700 dark:text-slate-300"
                  >
                    Sign in
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      navigate('/signup')
                      setMenuOpen(false)
                    }}
                    className="w-full bg-violet-600 hover:bg-violet-700 text-white"
                  >
                    Get started free
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}