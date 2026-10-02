interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

export default function TableSkeleton({ rows = 5, columns = 4 }: TableSkeletonProps) {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden animate-pulse">
      {/* Header */}
      <div className={`grid gap-4 p-4 bg-gray-850 border-b border-gray-700`} style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, i) => (
          <div key={i} className="h-4 bg-gray-700 rounded" />
        ))}
      </div>

      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className={`grid gap-4 p-4 border-b border-gray-700 last:border-b-0`}
          style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div key={colIndex} className="h-4 bg-gray-700 rounded" />
          ))}
        </div>
      ))}
    </div>
  );
}
