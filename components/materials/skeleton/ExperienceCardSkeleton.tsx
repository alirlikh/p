export default function ExperienceCardSkeleton() {
  return (
    <div className="flex flex-col bg-gray-800 rounded-[40px] px-6 py-10 md:flex-row max-w-screen-2xl mx-auto md:justify-between my-6 animate-pulse">
      {/* Left side - Job info */}
      <div className="shrink-0 order-1 p-2 m-3">
        <div className="h-7 bg-gray-700 rounded w-48 mb-3" />
        <div className="h-9 bg-gray-700 rounded w-40 mb-2" />
        <div className="space-y-2">
          <div className="h-4 bg-gray-700 rounded w-36" />
          <div className="h-4 bg-gray-700 rounded w-32" />
        </div>
      </div>

      {/* Right side - Company and duties */}
      <div className="shrink basis-[70%] order-2 p-2 m-3">
        <div className="h-7 bg-gray-700 rounded w-56 mb-4" />
        <div className="p-2 space-y-4">
          <div>
            <div className="h-5 bg-gray-700 rounded w-40 mb-2" />
            <div className="px-5 space-y-2">
              <div className="h-4 bg-gray-700 rounded w-full" />
              <div className="h-4 bg-gray-700 rounded w-11/12" />
              <div className="h-4 bg-gray-700 rounded w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
