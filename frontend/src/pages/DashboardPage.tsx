import { Link } from 'react-router-dom'
import {
    FileText, Archive, Pin, Sparkles, Clock, Tag, TrendingUp,
} from 'lucide-react'
import { useDashboard } from '../features/dashboard/hooks/useDashboard'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Skeleton } from '../components/ui/skeleton'
import { timeAgo } from '../utils/helpers'


function StatCard({
    icon: Icon, label, value, sublabel, colorClass, iconBg,
}: {
    icon: React.ElementType
    label: string
    value: number | string
    sublabel?: string
    colorClass: string
    iconBg: string
}) {
    return (
        <Card className="border-slate-200 dark:border-slate-800 dark:bg-slate-900">
            <CardContent className="p-5">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                            {label}
                        </p>
                        <p className={`text-3xl font-bold mt-1 ${colorClass}`}>{value}</p>
                        {sublabel && (
                            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                                {sublabel}
                            </p>
                        )}
                    </div>
                    <div className={`w-11 h-11 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>
                        <Icon className={`w-5 h-5 ${colorClass}`} />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export function DashboardPage() {
    const { data, isLoading, isError } = useDashboard()

    if (isLoading) {
        return (
            <div className="p-6 space-y-6 max-w-6xl mx-auto">
                <div>
                    <Skeleton className="h-7 w-36 mb-1 dark:bg-slate-800" />
                    <Skeleton className="h-4 w-52 dark:bg-slate-800" />
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="h-28 rounded-xl dark:bg-slate-800" />
                    ))}
                </div>
            </div>
        )
    }

    if (isError) {
        return (
            <div className="p-6 text-center">
                <p className="text-slate-500 dark:text-slate-400">
                    Failed to load dashboard. Please refresh.
                </p>
            </div>
        )
    }

    const { overview, recentNotes, topTags, aiUsage, weeklyActivity } = data!

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    Dashboard
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
                    Your workspace at a glance
                </p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={FileText} label="Active Notes" value={overview.totalNotes} sublabel="Not archived" colorClass="text-violet-600 dark:text-violet-400" iconBg="bg-violet-100 dark:bg-violet-950" />
                <StatCard icon={Archive} label="Archived" value={overview.archivedNotes} sublabel="In archive" colorClass="text-amber-600 dark:text-amber-400" iconBg="bg-amber-100 dark:bg-amber-950" />
                <StatCard icon={Pin} label="Pinned" value={overview.pinnedNotes} sublabel="Pinned notes" colorClass="text-blue-600 dark:text-blue-400" iconBg="bg-blue-100 dark:bg-blue-950" />
                <StatCard icon={Sparkles} label="AI Summaries" value={overview.notesWithAI} sublabel="Notes analyzed" colorClass="text-purple-600 dark:text-purple-400" iconBg="bg-purple-100 dark:bg-purple-950" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Notes */}
                <Card className="lg:col-span-2 border-slate-200 dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base font-semibold flex items-center gap-2 text-slate-800 dark:text-slate-200">
                            <Clock className="w-4 h-4 text-slate-400" />
                            Recently Edited
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-1 pt-0">
                        {recentNotes.length === 0 ? (
                            <div className="py-8 text-center">
                                <p className="text-sm text-slate-400">No notes yet.</p>
                                <Link to="/notes" className="text-sm text-violet-600 dark:text-violet-400 hover:underline mt-1 inline-block">
                                    Create your first note →
                                </Link>
                            </div>
                        ) : (
                            recentNotes.map((note: any) => (
                                <Link
                                    key={note._id}
                                    to={`/notes/${note._id}`}
                                    className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group"
                                >
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200 group-hover:text-violet-700 dark:group-hover:text-violet-400 truncate">
                                            {note.title || 'Untitled Note'}
                                        </p>
                                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                                            <span className="text-xs text-slate-400 dark:text-slate-500">
                                                {timeAgo(note.updatedAt)}
                                            </span>
                                            {note.tags?.slice(0, 2).map((tag: string) => (
                                                <Badge key={tag} variant="secondary" className="text-xs px-1.5 py-0 h-4 dark:bg-slate-700 dark:text-slate-300">
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                    {note.aiSummary && (
                                        <Sparkles className="w-3.5 h-3.5 text-violet-400 shrink-0 ml-2" />
                                    )}
                                </Link>
                            ))
                        )}
                    </CardContent>
                </Card>

                {/* Right Column */}
                <div className="space-y-4">
                    {/* Top Tags */}
                    <Card className="border-slate-200 dark:border-slate-800 dark:bg-slate-900">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base font-semibold flex items-center gap-2 text-slate-800 dark:text-slate-200">
                                <Tag className="w-4 h-4 text-slate-400" />
                                Top Tags
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                            {topTags.length === 0 ? (
                                <p className="text-sm text-slate-400 py-2">No tags yet</p>
                            ) : (
                                <div className="flex flex-wrap gap-2">
                                    {topTags.map(({ tag, count }: { tag: string; count: number }) => (
                                        <div key={tag} className="flex items-center gap-1.5">
                                            <Badge variant="outline" className="text-xs border-violet-200 dark:border-violet-800 text-violet-700 dark:text-violet-400 bg-violet-50 dark:bg-violet-950">
                                                {tag}
                                            </Badge>
                                            <span className="text-xs text-slate-400">{count}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* AI Usage */}
                    <Card className="border-slate-200 dark:border-slate-800 dark:bg-slate-900">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base font-semibold flex items-center gap-2 text-slate-800 dark:text-slate-200">
                                <Sparkles className="w-4 h-4 text-violet-400" />
                                AI Usage
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0 space-y-3">
                            <div className="flex justify-between items-center py-1.5 border-b border-slate-50 dark:border-slate-800">
                                <span className="text-sm text-slate-500 dark:text-slate-400">Total summaries</span>
                                <span className="font-semibold text-slate-900 dark:text-slate-100">{aiUsage.totalSummaries}</span>
                            </div>
                            <div className="flex justify-between items-center py-1.5">
                                <span className="text-sm text-slate-500 dark:text-slate-400">Tokens used</span>
                                <span className="font-semibold text-slate-900 dark:text-slate-100">{aiUsage.totalTokensUsed.toLocaleString()}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Weekly Activity */}
                    {/* Weekly Activity */}
                    <Card className="border-slate-200 dark:border-slate-800 dark:bg-slate-900">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base font-semibold flex items-center gap-2 text-slate-800 dark:text-slate-200">
                                <TrendingUp className="w-4 h-4 text-slate-400" />
                                Weekly Activity
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <WeeklyActivityChart data={weeklyActivity} />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

function WeeklyActivityChart({
  data,
}: {
  data: { date: string; count: number }[]
}) {
  if (!data || data.length === 0) {
    return (
      <p className="text-sm text-slate-400 dark:text-slate-500 py-4 text-center">
        No activity this week
      </p>
    )
  }

  const BAR_MAX_HEIGHT = 52 // px
  const maxCount = Math.max(...data.map((d) => d.count), 1)

  // ✅ Use local date string, not UTC
  const todayStr = new Date().toLocaleDateString('en-CA') // "YYYY-MM-DD" in local time

  return (
    <div className="space-y-2">
      {/* Bar Chart */}
      <div className="flex items-end gap-1.5 h-20 pt-2">
        {data.map(({ date, count }) => {
          // ✅ Pixel height instead of percentage
          const barHeight =
            count === 0
              ? 4
              : Math.max((count / maxCount) * BAR_MAX_HEIGHT, 6)

          const isToday = date === todayStr // ✅ local date comparison

          return (
            <div
              key={date}
              className="flex-1 flex flex-col items-center gap-1"
              title={`${formatChartDate(date)}: ${count} note${count !== 1 ? 's' : ''}`}
            >
              <span className="text-xs text-slate-400 dark:text-slate-500">
                {count > 0 ? count : ''}
              </span>
              {/* ✅ Fixed height container, align bars to bottom */}
              <div
                className="w-full flex items-end"
                style={{ height: `${BAR_MAX_HEIGHT}px` }}
              >
                <div
                  className={`w-full rounded-t-sm transition-all duration-300 ${
                    count === 0
                      ? 'bg-slate-100 dark:bg-slate-800'
                      : isToday
                      ? 'bg-violet-600 dark:bg-violet-500'
                      : 'bg-violet-400 dark:bg-violet-600'
                  }`}
                  style={{ height: `${barHeight}px` }} // ✅ px not %
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Day Labels */}
      <div className="flex gap-1.5">
        {data.map(({ date }) => {
          const isToday = date === todayStr
          return (
            <div key={date} className="flex-1 text-center">
              <span
                className={`text-xs font-medium ${
                  isToday
                    ? 'text-violet-600 dark:text-violet-400'
                    : 'text-slate-400 dark:text-slate-500'
                }`}
              >
                {getDayLabel(date)}
              </span>
            </div>
          )
        })}
      </div>

      {/* Total this week */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
        <span className="text-xs text-slate-400 dark:text-slate-500">
          This week
        </span>
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          {data.reduce((sum, d) => sum + d.count, 0)} notes edited
        </span>
      </div>
    </div>
  )
}

// ✅ Helper: Get short day name
function getDayLabel(dateStr: string): string {
  const date = new Date(dateStr + 'T12:00:00')
  return date.toLocaleDateString('en', { weekday: 'short' }).slice(0, 1)
}

// ✅ Helper: Format date for tooltip
function formatChartDate(dateStr: string): string {
  const date = new Date(dateStr + 'T12:00:00')
  return date.toLocaleDateString('en', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}