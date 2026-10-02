export default function BlogPostCardSkeleton() {
  return (
    <div className="max-w-96 rounded-[40px] bg-gray-800 w-full mx-8 mt-20 border-2 border-gray-700 animate-pulse">
      {/* Image placeholder */}
      <div className="w-5/6 mx-auto place-items-center -mt-12 h-52">
        <div className="w-full h-full rounded-[40px] border-2 border-dashed border-gray-700 bg-gray-700" />
      </div>

      {/* Content */}
      <div className="mx-auto p-6 mt-5 space-y-4 mb-3">
        {/* Category badges */}
        <div className="flex flex-wrap gap-2 justify-center">
          <div className="h-6 w-20 bg-gray-700 rounded-full" />
          <div className="h-6 w-24 bg-gray-700 rounded-full" />
        </div>

        {/* Title - 2 lines */}
        <div className="space-y-2">
          <div className="h-6 bg-gray-700 rounded w-11/12 mx-auto" />
          <div className="h-6 bg-gray-700 rounded w-3/4 mx-auto" />
        </div>

        {/* Excerpt - 3 lines */}
        <div className="space-y-2 pt-2">
          <div className="h-4 bg-gray-700 rounded w-full" />
          <div className="h-4 bg-gray-700 rounded w-full" />
          <div className="h-4 bg-gray-700 rounded w-5/6 mx-auto" />
        </div>

        {/* Meta Info */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-700">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 bg-gray-700 rounded-full" />
            <div className="h-4 w-20 bg-gray-700 rounded" />
          </div>
          <div className="flex items-center gap-4">
            <div className="h-4 w-16 bg-gray-700 rounded" />
            <div className="h-4 w-20 bg-gray-700 rounded" />
          </div>
        </div>

        {/* Read More */}
        <div className="h-5 w-24 bg-gray-700 rounded mx-auto" />
      </div>
    </div>
  );
}
