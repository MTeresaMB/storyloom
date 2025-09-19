export function Metric({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div className="text-center">
      <div className={`text-2xl font-bold ${className ?? ''}`}>{value}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  )
}