'use client'

import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

const BackButton = ({ label = 'Back to store' }: { label?: string }) => {
  const router = useRouter()

  return (
    <button
      onClick={() => router.back()}
      className="inline-flex cursor-pointer items-center gap-2 text-sm text-primary/70 transition-colors hover:text-primary"
    >
      <ArrowLeft className="h-4 w-4" />
      {label}
    </button>
  )
}

export default BackButton
