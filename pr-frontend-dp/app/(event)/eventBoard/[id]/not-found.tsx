import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-6 text-center">
      <h2 className="text-2xl font-bold mb-4">Event no encontrado</h2>
      <p className="mb-6 text-gray-700">
        No enotramos el evento que buscas, vuelve a intentarlo.
      </p>
      <Link
        href="/eventBoard"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        Return to events
      </Link>
    </div>
  )
}
