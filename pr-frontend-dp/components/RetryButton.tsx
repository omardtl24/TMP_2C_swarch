'use client'

import { Button } from "@/components/ui/button"

export default function RetryButton() {
  return (
    <Button 
      variant="outline" 
      onClick={() => window.location.reload()}
      className="mx-auto"
    >
      Intentar de nuevo
    </Button>
  )
}
