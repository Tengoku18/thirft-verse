'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface ExpandableDescriptionProps {
  description: string
  maxLines?: number
}

export default function ExpandableDescription({
  description,
  maxLines = 4,
}: ExpandableDescriptionProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [needsExpansion, setNeedsExpansion] = useState(false)
  const contentRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    if (contentRef.current) {
      const lineHeight = parseInt(getComputedStyle(contentRef.current).lineHeight)
      const maxHeight = lineHeight * maxLines
      setNeedsExpansion(contentRef.current.scrollHeight > maxHeight + 10)
    }
  }, [description, maxLines])

  return (
    <div className="rounded-2xl border border-secondary/20 bg-gradient-to-br from-secondary/5 via-accent-2/5 to-transparent p-4 sm:p-6">
      <h2 className="font-heading mb-3 text-lg font-semibold text-primary">
        Description
      </h2>

      <div className="relative">
        <p
          ref={contentRef}
          className={`whitespace-pre-line leading-relaxed text-primary/80 transition-all duration-300 ${
            !isExpanded && needsExpansion ? 'line-clamp-4' : ''
          }`}
        >
          {description}
        </p>

        {/* Gradient fade effect when collapsed */}
        {!isExpanded && needsExpansion && (
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white/80 to-transparent" />
        )}
      </div>

      {needsExpansion && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-secondary transition-colors hover:text-secondary/80"
        >
          {isExpanded ? (
            <>
              Show less
              <ChevronUp className="h-4 w-4" />
            </>
          ) : (
            <>
              Show more
              <ChevronDown className="h-4 w-4" />
            </>
          )}
        </button>
      )}
    </div>
  )
}
