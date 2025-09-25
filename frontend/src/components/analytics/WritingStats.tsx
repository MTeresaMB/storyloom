import { useMemo } from 'react'
import type { WritingStats } from '../../types/analytics'
import { createWritingStatsCards, validateWritingStats } from '../../utils/analytics/writingStatsConfig'
import StatCard from '../ui/StatCard'

interface WritingStatsProps {
  stats: WritingStats
  className?: string
}

export default function WritingStats({ stats, className = '' }: WritingStatsProps) {
  const statCards = useMemo(() => {
    if (!validateWritingStats(stats)) {
      return []
    }
    return createWritingStatsCards(stats)
  }, [stats])

  if (statCards.length === 0) {
    return (
      <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 ${className}`}>
        <div className="col-span-full text-center text-gray-500 py-8">
          No writing statistics available
        </div>
      </div>
    )
  }

  return (
    <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 ${className}`}>
      {statCards.map((card, index) => (
        <StatCard
          key={`${card.title}-${index}`}
          title={card.title}
          value={card.value}
          icon={card.icon}
          color={card.color}
          bgColor={card.bgColor}
        />
      ))}
    </div>
  )
}