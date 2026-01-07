export default function ThemeCardSkeleton() {
  return (
    <div className="rounded-xl shadow-lg p-6 animate-pulse bg-gray-200">
      <div className="h-5 w-2/3 bg-gray-300 rounded mb-2"></div>
      <div className="h-4 w-1/3 bg-gray-300 rounded mb-4"></div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-300 rounded"></div>
        <div className="h-3 bg-gray-300 rounded"></div>
        <div className="h-3 w-5/6 bg-gray-300 rounded"></div>
      </div>
    </div>
  );
}
