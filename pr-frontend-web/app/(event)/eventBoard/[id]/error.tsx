'use client' // Error boundaries must be Client Components

import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-6 text-center">
      <h2 className="text-2xl font-bold text-red-600 mb-4">Algo ha salido mal</h2>
      <p className="mb-6 text-gray-700">
        No es posible cargar el detalle de este evento.
      </p>
      <div className="flex gap-4">
        <Button
          onClick={reset}
    
        >
          Intentalo de nuevo
        </Button>
        <Link
          href="/eventBoard"
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
        >
          Volver a eventos
        </Link>
      </div>
    </div>
  )
}
