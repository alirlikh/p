export default function EducationCardSkeleton() {
  return (
    <div className="flex flex-col bg-gray-800 rounded-[40px] px-6 py-10 md:flex-row max-w-screen-2xl mx-auto md:justify-between my-6 animate-pulse">
      {/* Left side - Degree info */}
      <div className="shrink-0 order-1 p-2 m-3">
        <div className="h-7 bg-gray-700 rounded w-48 mb-3" />
        <div className="h-6 bg-gray-700 rounded w-40 mb-2" />
        <div className="space-y-2">
          <div className="h-4 bg-gray-700 rounded w-36" />
          <div className="h-4 bg-gray-700 rounded w-32" />
        </div>
      </div>

      {/* Right side - College and details */}
      <div className="shrink basis-[70%] order-2 p-2 m-3">
        <div className="h-7 bg-gray-700 rounded w-56 mb-4" />
        <div className="space-y-3">
          <div className="h-4 bg-gray-700 rounded w-full" />
          <div className="h-4 bg-gray-700 rounded w-11/12" />
          <div className="h-4 bg-gray-700 rounded w-4/5" />
        </div>
      </div>
    </div>
  );
}
