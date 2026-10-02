export default function BlogPostDetailSkeleton() {
  return (
    <div className="min-h-screen animate-pulse">
      {/* Back Button */}
      <div className="p-4 px-8 md:px-28 pt-8">
        <div className="h-5 w-32 bg-gray-700 rounded" />
      </div>

      <article className="max-w-4xl mx-auto p-4 px-8 md:px-12 py-8">
        {/* Cover Image */}
        <div className="relative w-full h-96 rounded-[40px] overflow-hidden mb-8 border-2 border-gray-700 bg-gray-700" />

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-4">
          <div className="h-6 w-24 bg-gray-700 rounded-full" />
          <div className="h-6 w-20 bg-gray-700 rounded-full" />
        </div>

        {/* Title */}
        <div className="space-y-3 mb-6">
          <div className="h-12 bg-gray-700 rounded w-full" />
          <div className="h-12 bg-gray-700 rounded w-4/5" />
        </div>

        {/* Excerpt */}
        <div className="space-y-2 mb-6">
          <div className="h-6 bg-gray-700 rounded w-full" />
          <div className="h-6 bg-gray-700 rounded w-11/12" />
        </div>

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-6 pb-6 mb-8 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 bg-gray-700 rounded-full" />
            <div className="space-y-2">
              <div className="h-4 w-32 bg-gray-700 rounded" />
              <div className="h-3 w-24 bg-gray-700 rounded" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-4 w-20 bg-gray-700 rounded" />
            <div className="h-4 w-16 bg-gray-700 rounded" />
          </div>
        </div>

        {/* Content Blocks */}
        <div className="space-y-6 mb-12">
          <div className="space-y-3">
            <div className="h-4 bg-gray-700 rounded w-full" />
            <div className="h-4 bg-gray-700 rounded w-full" />
            <div className="h-4 bg-gray-700 rounded w-11/12" />
            <div className="h-4 bg-gray-700 rounded w-full" />
            <div className="h-4 bg-gray-700 rounded w-4/5" />
          </div>

          <div className="h-64 bg-gray-700 rounded-lg" />

          <div className="space-y-3">
            <div className="h-4 bg-gray-700 rounded w-full" />
            <div className="h-4 bg-gray-700 rounded w-full" />
            <div className="h-4 bg-gray-700 rounded w-5/6" />
          </div>
        </div>

        {/* Tags */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="h-4 w-16 bg-gray-700 rounded mb-3" />
          <div className="flex flex-wrap gap-2">
            <div className="h-7 w-20 bg-gray-700 rounded-full" />
            <div className="h-7 w-24 bg-gray-700 rounded-full" />
            <div className="h-7 w-28 bg-gray-700 rounded-full" />
          </div>
        </div>

        {/* Share/Back */}
        <div className="mt-12 pt-8 border-t border-gray-700 flex justify-between items-center">
          <div className="h-11 w-32 bg-gray-700 rounded-lg" />
          <div className="h-11 w-32 bg-gray-700 rounded-lg" />
        </div>
      </article>
    </div>
  );
}
