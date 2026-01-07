export default function ServiceCardSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden shadow animate-pulse bg-white">
      {/* Imagen */}
      <div className="h-40 bg-gray-300" />

      {/* Texto */}
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-300 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-5/6" />
      </div>
    </div>
  );
}
