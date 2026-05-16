import { useNavigate } from 'react-router-dom'
import {
  Sparkles,
  FileText,
  Search,
  Share2,
  BarChart3,
  Tag,
  Pin,
  ArrowRight,
  Check,
  Zap,
  Shield,
  Globe,
} from 'lucide-react'
import { Navbar } from '../components/common/Navbar'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'

// ─── Data ────────────────────────────────────────────────────

const features = [
  {
    icon: Sparkles,
    color: 'bg-violet-100 dark:bg-violet-950 text-violet-600 dark:text-violet-400',
    title: 'AI-Powered Summaries',
    description:
      'Generate intelligent summaries, extract action items, and get title suggestions from your notes using Llama 3.',
  },
  {
    icon: FileText,
    color: 'bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400',
    title: 'Markdown Support',
    description:
      'Write in Markdown with a live preview. Format your notes with headings, lists, code blocks, and more.',
  },
  {
    icon: Search,
    color: 'bg-green-100 dark:bg-green-950 text-green-600 dark:text-green-400',
    title: 'Smart Search',
    description:
      'Find any note instantly with full-text search and tag filtering. Results ranked by relevance.',
  },
  {
    icon: Share2,
    color: 'bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400',
    title: 'Public Sharing',
    description:
      'Share notes publicly with a unique link. Anyone can view without needing an account.',
  },
  {
    icon: BarChart3,
    color: 'bg-pink-100 dark:bg-pink-950 text-pink-600 dark:text-pink-400',
    title: 'Productivity Dashboard',
    description:
      'Track your writing habits, most-used tags, AI usage stats, and weekly activity at a glance.',
  },
  {
    icon: Tag,
    color: 'bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400',
    title: 'Tags & Organization',
    description:
      'Organize notes with tags, pin important ones, and archive what you no longer need.',
  },
]

const steps = [
  {
    step: '01',
    title: 'Create a note',
    description:
      'Start typing in the editor. Notes autosave as you write so you never lose your work.',
  },
  {
    step: '02',
    title: 'Generate AI insights',
    description:
      'Click "AI Summary" to get an instant summary, action items, and a suggested title.',
  },
  {
    step: '03',
    title: 'Organize & share',
    description:
      'Add tags, pin important notes, and share publicly with a single click.',
  },
]

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for personal use',
    features: [
      'Up to 50 notes',
      '10 AI summaries/month',
      'Full-text search',
      'Public sharing',
      'Markdown editor',
    ],
    cta: 'Get started free',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$9',
    period: 'per month',
    description: 'For power users',
    features: [
      'Unlimited notes',
      'Unlimited AI summaries',
      'Priority AI processing',
      'Advanced analytics',
      'Export to PDF',
      'Priority support',
    ],
    cta: 'Start free trial',
    highlighted: true,
  },
]

const stats = [
  { value: '10k+', label: 'Notes created' },
  { value: '5k+', label: 'AI summaries' },
  { value: '2k+', label: 'Active users' },
  { value: '99.9%', label: 'Uptime' },
]

// ─── Landing Page ─────────────────────────────────────────────

export function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <Navbar />

      {/* ── Hero Section ────────────────────────────────────── */}
      <section className="pt-32 pb-20 px-4 sm:px-6 bg-gradient-to-b from-slate-50 dark:from-slate-950 to-white dark:to-slate-900">
        <div className="max-w-4xl mx-auto text-center">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-violet-50 dark:bg-violet-950 border border-violet-200 dark:border-violet-800 rounded-full px-4 py-1.5 mb-6">
            <Sparkles className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
            <span className="text-xs font-medium text-violet-700 dark:text-violet-300">
              Powered by Llama 3 via Groq
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 dark:text-slate-100 leading-tight mb-6">
            Notes that think{' '}
            <span className="text-violet-600 dark:text-violet-400">with you</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed mb-8 max-w-2xl mx-auto">
            NoteAI is a smart workspace where you write, and AI helps you
            summarize, organize, and act on your ideas — instantly.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
            <Button
              size="lg"
              onClick={() => navigate('/signup')}
              className="bg-violet-600 hover:bg-violet-700 text-white px-8 h-12 text-base gap-2 w-full sm:w-auto"
            >
              Start for free
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/login')}
              className="h-12 text-base px-8 w-full sm:w-auto border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 dark:bg-slate-900"
            >
              Sign in
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="flex items-center justify-center gap-6 text-sm text-slate-500 dark:text-slate-400 flex-wrap">
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-green-500" />
              No credit card required
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-green-500" />
              Free forever plan
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-green-500" />
              Setup in 60 seconds
            </div>
          </div>
        </div>

        {/* Hero UI Preview */}
        <div className="max-w-5xl mx-auto mt-16">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl shadow-slate-200 dark:shadow-black/40 overflow-hidden">

            {/* Fake browser chrome */}
            <div className="flex items-center gap-2 px-4 py-3 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <div className="flex-1 mx-4 bg-white dark:bg-slate-900 rounded-md px-3 py-1 text-xs text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700">
                app.noteai.com/notes
              </div>
            </div>

            {/* Fake App UI */}
            <div className="flex h-80">

              {/* Sidebar */}
              <div className="w-48 border-r border-slate-100 dark:border-slate-800 p-3 bg-slate-50 dark:bg-slate-900 shrink-0">
                <div className="flex items-center gap-2 mb-4 px-2">
                  <div className="w-6 h-6 bg-violet-600 rounded-md" />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    NoteAI
                  </span>
                </div>
                <div className="space-y-0.5">
                  {['Dashboard', 'Notes', 'Archive'].map((item, i) => (
                    <div
                      key={item}
                      className={`px-2 py-1.5 rounded-md text-xs font-medium ${
                        i === 1
                          ? 'bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300'
                          : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {item}
                    </div>
                  ))}
                </div>

                {/* Fake note list */}
                <div className="mt-4 space-y-1.5">
                  {[
                    { title: 'Sprint Planning', tag: 'work' },
                    { title: 'Personal Goals', tag: 'personal' },
                    { title: 'Book Notes', tag: 'learning' },
                  ].map((note) => (
                    <div
                      key={note.title}
                      className="p-2 bg-white dark:bg-slate-800 rounded-md border border-slate-100 dark:border-slate-700 cursor-pointer"
                    >
                      <p className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">
                        {note.title}
                      </p>
                      <span className="text-xs text-violet-500 dark:text-violet-400">
                        {note.tag}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Editor */}
              <div className="flex-1 p-5 bg-white dark:bg-slate-900">
                <div className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3">
                  Sprint Planning Notes
                </div>
                <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 font-mono">
                  <div className="text-slate-400 dark:text-slate-500">
                    ## Agenda
                  </div>
                  <div>- Review sprint goals for Q2</div>
                  <div>- Assign tasks to team members</div>
                  <div>- Set deadlines and milestones</div>
                  <div className="mt-2 text-slate-400 dark:text-slate-500">
                    ## Action Items
                  </div>
                  <div>- John: Prepare UI mockups</div>
                  <div>- Sarah: Review API structure</div>
                </div>
              </div>

              {/* AI Panel */}
              <div className="w-56 border-l border-slate-100 dark:border-slate-800 p-4 bg-gradient-to-b from-violet-50 dark:from-violet-950/30 to-white dark:to-slate-900 shrink-0">
                <div className="flex items-center gap-1.5 mb-3">
                  <Sparkles className="w-3.5 h-3.5 text-violet-500" />
                  <span className="text-xs font-semibold text-violet-800 dark:text-violet-300">
                    AI Insights
                  </span>
                </div>
                <div className="mb-3">
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                    SUMMARY
                  </p>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    Sprint planning session covering Q2 goals, task assignments,
                    and deadline setting.
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                    ACTION ITEMS
                  </p>
                  <div className="space-y-1">
                    {['Prepare UI mockups', 'Review API structure'].map(
                      (item, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-1.5 text-xs text-slate-700 dark:text-slate-300"
                        >
                          <span className="w-4 h-4 rounded-full bg-violet-200 dark:bg-violet-900 text-violet-700 dark:text-violet-300 flex items-center justify-center shrink-0 font-medium text-xs">
                            {i + 1}
                          </span>
                          {item}
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ───────────────────────────────────────────── */}
      <section className="py-16 border-y border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="text-3xl font-bold text-violet-600 dark:text-violet-400 mb-1">
                {value}
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-400">
                {label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ────────────────────────────────────────── */}
      <section id="features" className="py-24 px-4 sm:px-6 bg-white dark:bg-slate-950">
        <div className="max-w-6xl mx-auto">

          {/* Section Header */}
          <div className="text-center mb-16">
            <Badge
              variant="secondary"
              className="mb-4 bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300 border-0"
            >
              Features
            </Badge>
            <h2 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Everything you need to think clearly
            </h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
              A focused set of tools that work together to help you capture,
              understand, and act on your ideas.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, color, title, description }) => (
              <div
                key={title}
                className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-violet-200 dark:hover:border-violet-700 hover:shadow-lg hover:shadow-violet-50 dark:hover:shadow-black/20 transition-all group bg-white dark:bg-slate-900"
              >
                <div
                  className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  {title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it Works ────────────────────────────────────── */}
      <section
        id="how-it-works"
        className="py-24 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900"
      >
        <div className="max-w-4xl mx-auto">

          {/* Section Header */}
          <div className="text-center mb-16">
            <Badge
              variant="secondary"
              className="mb-4 bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300 border-0"
            >
              How it Works
            </Badge>
            <h2 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Three steps to smarter notes
            </h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
              Getting value from NoteAI takes less than a minute.
            </p>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map(({ step, title, description }, index) => (
              <div key={step} className="relative text-center">

                {/* Connector line between steps */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-px bg-violet-200 dark:bg-violet-800 z-0" />
                )}

                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-violet-600 dark:bg-violet-700 text-white flex items-center justify-center text-xl font-bold mx-auto mb-4 shadow-lg shadow-violet-200 dark:shadow-black/30">
                    {step}
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2 text-lg">
                    {title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why NoteAI ──────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 bg-white dark:bg-slate-950">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Left: Text */}
            <div>
              <Badge
                variant="secondary"
                className="mb-4 bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300 border-0"
              >
                Why NoteAI
              </Badge>
              <h2 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-6">
                Built for people who think a lot
              </h2>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-8">
                Most note apps just store text. NoteAI understands it. We
                use the fastest AI inference available (Groq + Llama 3) so
                your summaries appear in seconds, not minutes.
              </p>

              <div className="space-y-4">
                {[
                  {
                    icon: Zap,
                    title: 'Lightning fast AI',
                    description:
                      'Groq inference is 10x faster than typical AI APIs. Summaries in under 3 seconds.',
                  },
                  {
                    icon: Shield,
                    title: 'Your notes, your data',
                    description:
                      'Notes are private by default. You choose what to share and with whom.',
                  },
                  {
                    icon: Globe,
                    title: 'Access from anywhere',
                    description:
                      'Web-based workspace. No downloads, no installs. Works on any device.',
                  },
                ].map(({ icon: Icon, title, description }) => (
                  <div key={title} className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-950 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-0.5">
                        {title}
                      </h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: AI Output card */}
            <div className="bg-gradient-to-br from-violet-50 dark:from-violet-950/30 to-purple-50 dark:to-slate-900 rounded-2xl border border-violet-100 dark:border-violet-900 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                <span className="font-semibold text-violet-900 dark:text-violet-300">
                  AI Summary Example
                </span>
              </div>

              {/* Input note preview */}
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-violet-100 dark:border-violet-900 p-4 mb-3 text-sm text-slate-600 dark:text-slate-400 font-mono leading-relaxed">
                <span className="text-slate-400 dark:text-slate-500 text-xs block mb-2">
                  Your note:
                </span>
                Met with the team today. We need to finish the auth module
                before Friday. John is handling the UI, Sarah has the backend.
                Need to write tests and set up deployment...
              </div>

              {/* Arrow */}
              <div className="flex justify-center my-3">
                <div className="flex items-center gap-2 text-xs text-violet-500 dark:text-violet-400 font-medium">
                  <Sparkles className="w-3.5 h-3.5" />
                  AI processing...
                </div>
              </div>

              {/* Output */}
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-violet-100 dark:border-violet-900 p-4 space-y-3">
                <div>
                  <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    Summary
                  </span>
                  <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">
                    Team meeting focused on completing the auth module by
                    Friday, with clear ownership assigned.
                  </p>
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    Action Items
                  </span>
                  <ul className="mt-1 space-y-1">
                    {[
                      'John: Complete auth UI components',
                      'Sarah: Finish backend auth module',
                      'Team: Write tests before Friday',
                    ].map((item, i) => (
                      <li
                        key={i}
                        className="text-sm text-slate-700 dark:text-slate-300 flex items-center gap-2"
                      >
                        <span className="w-4 h-4 rounded-full bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-300 text-xs flex items-center justify-center font-medium shrink-0">
                          {i + 1}
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    Suggested Title
                  </span>
                  <p className="text-sm text-violet-700 dark:text-violet-400 font-medium mt-1">
                    "Auth Module Sprint — Team Assignments"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pricing ─────────────────────────────────────────── */}
      <section id="pricing" className="py-24 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-4xl mx-auto">

          {/* Section Header */}
          <div className="text-center mb-16">
            <Badge
              variant="secondary"
              className="mb-4 bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300 border-0"
            >
              Pricing
            </Badge>
            <h2 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Simple, honest pricing
            </h2>
            <p className="text-lg text-slate-500 dark:text-slate-400">
              Start free. Upgrade when you need more.
            </p>
          </div>

          {/* Plans */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl border p-6 ${
                  plan.highlighted
                    ? 'bg-violet-600 dark:bg-violet-700 border-violet-600 dark:border-violet-700 text-white shadow-xl shadow-violet-200 dark:shadow-black/30'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                }`}
              >
                {/* Plan header */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`font-semibold text-lg ${
                        plan.highlighted ? 'text-white' : 'text-slate-900 dark:text-slate-100'
                      }`}
                    >
                      {plan.name}
                    </span>
                    {plan.highlighted && (
                      <span className="text-xs bg-white/20 text-white px-2.5 py-1 rounded-full font-medium">
                        Popular
                      </span>
                    )}
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span
                      className={`text-4xl font-bold ${
                        plan.highlighted ? 'text-white' : 'text-slate-900 dark:text-slate-100'
                      }`}
                    >
                      {plan.price}
                    </span>
                    <span
                      className={`text-sm ${
                        plan.highlighted ? 'text-violet-200' : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      /{plan.period}
                    </span>
                  </div>
                  <p
                    className={`text-sm mt-1 ${
                      plan.highlighted ? 'text-violet-200' : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {plan.description}
                  </p>
                </div>

                {/* Features list */}
                <ul className="space-y-2.5 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2.5">
                      <Check
                        className={`w-4 h-4 shrink-0 ${
                          plan.highlighted
                            ? 'text-violet-200'
                            : 'text-violet-600 dark:text-violet-400'
                        }`}
                      />
                      <span
                        className={`text-sm ${
                          plan.highlighted
                            ? 'text-violet-100'
                            : 'text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Button
                  className={`w-full ${
                    plan.highlighted
                      ? 'bg-white text-violet-600 hover:bg-violet-50'
                      : 'bg-violet-600 dark:bg-violet-700 hover:bg-violet-700 dark:hover:bg-violet-800 text-white'
                  }`}
                  onClick={() => navigate('/signup')}
                >
                  {plan.cta}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ──────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 bg-violet-600 dark:bg-violet-700">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to take smarter notes?
          </h2>
          <p className="text-violet-200 text-lg mb-8">
            Join thousands of people using NoteAI to think more clearly.
            Free forever, no credit card needed.
          </p>
          <Button
            size="lg"
            onClick={() => navigate('/signup')}
            className="bg-white text-violet-600 hover:bg-violet-50 px-10 h-12 text-base font-semibold gap-2"
          >
            Get started free
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer className="bg-slate-900 dark:bg-slate-950 text-slate-400 dark:text-slate-500 py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">

            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-violet-600 rounded-lg flex items-center justify-center">
                <FileText className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-bold text-white">NoteAI</span>
            </div>

            {/* Links */}
            <div className="flex items-center gap-8 text-sm">
              <a
                href="#features"
                className="text-slate-400 dark:text-slate-500 hover:text-white dark:hover:text-slate-300 transition-colors"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-slate-400 dark:text-slate-500 hover:text-white dark:hover:text-slate-300 transition-colors"
              >
                How it Works
              </a>
              <a
                href="#pricing"
                className="text-slate-400 dark:text-slate-500 hover:text-white dark:hover:text-slate-300 transition-colors"
              >
                Pricing
              </a>
            </div>

            {/* Copyright */}
            <p className="text-sm">
              © {new Date().getFullYear()} NoteAI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}