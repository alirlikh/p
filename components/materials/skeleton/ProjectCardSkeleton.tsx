export default function ProjectCardSkeleton() {
  return (
    <div className="max-w-96 rounded-[40px] bg-gray-800 w-full mx-8 mt-20 border-2 border-gray-700 animate-pulse">
      {/* Image placeholder */}
      <div className="w-5/6 mx-auto place-items-center -mt-12 h-52">
        <div className="w-full h-full rounded-[40px] border-2 border-dashed border-gray-700 bg-gray-700" />
      </div>

      {/* Content */}
      <div className="mx-auto p-3 mt-5 text-center space-y-6 mb-3">
        {/* Title */}
        <div className="h-8 bg-gray-700 rounded w-3/4 mx-auto" />

        {/* Icons */}
        <div className="flex flex-row justify-center items-center gap-4">
          <div className="h-10 w-10 bg-gray-700 rounded-full" />
          <div className="h-10 w-10 bg-gray-700 rounded-full" />
        </div>
      </div>
    </div>
  );
}
