'use client'

import { Check, Copy } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { copyToClipboard } from '@/utils/clipboard'

interface CopyButtonProps {
  text: string
  className?: string
  label?: string
}

export default function CopyButton({ text, className = '', label }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    const success = await copyToClipboard(text)

    if (success) {
      setCopied(true)
      toast.success('Copied to clipboard!', {
        duration: 2000,
        position: 'bottom-center',
      })
      setTimeout(() => setCopied(false), 2000)
    } else {
      toast.error('Failed to copy to clipboard', {
        duration: 2000,
        position: 'bottom-center',
      })
    }
  }

  return (
    <button
      onClick={handleCopy}
      className={`inline-flex cursor-pointer items-center gap-1.5 text-primary/60 transition-colors hover:text-primary ${className}`}
      title={label || 'Copy to clipboard'}
      aria-label={label || 'Copy to clipboard'}
    >
      {copied ? (
        <Check className="h-4 w-4 text-green-600" strokeWidth={2} />
      ) : (
        <Copy className="h-4 w-4" strokeWidth={2} />
      )}
    </button>
  )
}
