import mongoose from 'mongoose'
import { Note } from '../../models/Note.model'
import { AIUsage } from '../../models/AIUsage.model'

// ✅ Get date string in LOCAL time (not UTC)
function toLocalDateString(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}` // "2026-05-16"
}

// ✅ Generate last 7 days using local time
function getLast7Days(): string[] {
  const days: string[] = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    days.push(toLocalDateString(d)) // ✅ local, not UTC
  }
  return days
}

// ✅ Get timezone offset string like "+05:30" or "-05:00"
function getTimezoneOffset(): string {
  const offset = new Date().getTimezoneOffset() // minutes, negative for ahead of UTC
  const abs = Math.abs(offset)
  const hours = String(Math.floor(abs / 60)).padStart(2, '0')
  const mins = String(abs % 60).padStart(2, '0')
  return `${offset <= 0 ? '+' : '-'}${hours}:${mins}`
}

export const dashboardService = {
  async getStats(userId: string) {
    const userObjectId = new mongoose.Types.ObjectId(userId)

    // ✅ Start of 7 days ago in local time
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6)
    sevenDaysAgo.setHours(0, 0, 0, 0)

    // ✅ End of today in local time
    const todayEnd = new Date()
    todayEnd.setHours(23, 59, 59, 999)

    const timezone = getTimezoneOffset() // e.g., "+05:30"

    const [
      totalNotes,
      archivedNotes,
      pinnedNotes,
      notesWithAI,
      recentNotes,
      topTags,
      aiStats,
      rawWeeklyActivity,
    ] = await Promise.all([

      Note.countDocuments({ userId: userObjectId, isArchived: false }),

      Note.countDocuments({ userId: userObjectId, isArchived: true }),

      Note.countDocuments({ userId: userObjectId, isPinned: true, isArchived: false }),

      Note.countDocuments({ userId: userObjectId, aiSummary: { $ne: null } }),

      Note.find({ userId: userObjectId, isArchived: false })
        .sort({ updatedAt: -1 })
        .limit(5)
        .select('title updatedAt tags isPinned aiSummary')
        .lean(),

      Note.aggregate([
        { $match: { userId: userObjectId, isArchived: false } },
        { $unwind: '$tags' },
        { $group: { _id: '$tags', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 8 },
        { $project: { tag: '$_id', count: 1, _id: 0 } },
      ]),

      AIUsage.aggregate([
        { $match: { userId: userObjectId } },
        {
          $group: {
            _id: null,
            totalSummaries: { $sum: 1 },
            totalTokens: { $sum: '$tokensUsed' },
          },
        },
      ]),

      Note.aggregate([
        {
          $match: {
            userId: userObjectId,
            updatedAt: {
              $gte: sevenDaysAgo,
              $lte: todayEnd, // ✅ include all of today
            },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: '%Y-%m-%d',
                date: '$updatedAt',
                timezone, // ✅ group by LOCAL date, not UTC
              },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
        { $project: { date: '$_id', count: 1, _id: 0 } },
      ]),
    ])

    // ✅ Fill missing days with 0
    const last7Days = getLast7Days()
    const activityMap = new Map<string, number>()

    rawWeeklyActivity.forEach((item: { date: string; count: number }) => {
      activityMap.set(item.date, item.count)
    })

    const weeklyActivity = last7Days.map((date) => ({
      date,
      count: activityMap.get(date) ?? 0,
    }))

    console.log('[dashboard] timezone:', timezone)
    console.log('[dashboard] last7Days:', last7Days)
    console.log('[dashboard] weeklyActivity:', weeklyActivity)

    return {
      overview: { totalNotes, archivedNotes, pinnedNotes, notesWithAI },
      recentNotes,
      topTags,
      aiUsage: {
        totalSummaries: aiStats[0]?.totalSummaries || 0,
        totalTokensUsed: aiStats[0]?.totalTokens || 0,
      },
      weeklyActivity,
    }
  },
}