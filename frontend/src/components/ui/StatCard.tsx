import type { StatCardProps } from '../../types/ui'

export default function StatCard({
  title,
  value,
  icon,
  color,
  bgColor,
  className
}: StatCardProps & { className?: string }) {
  return (
    <div className={`${bgColor} rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
        </div>
        <div className={color}>
          {icon}
        </div>
      </div>
    </div>
  )
}
