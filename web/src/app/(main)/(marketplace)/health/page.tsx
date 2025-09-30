export default function HealthPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Health Services
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Lorem Medicina</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit
            </p>
          </div>
          <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Ipsum Prevención</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Sed do eiusmod tempor incididunt ut labore
            </p>
          </div>
          <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Dolor Emergencias</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Ut enim ad minim veniam, quis nostrud
            </p>
          </div>
          <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Amet Bienestar</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Excepteur sint occaecat cupidatat non proident
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
