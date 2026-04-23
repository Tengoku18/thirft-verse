'use client'

import { Search, X } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { debounce } from '@/utils/exploreHelpers'

interface SearchBarProps {
  placeholder?: string
  onSearch: (query: string) => void
  debounceMs?: number
  className?: string
}

export default function SearchBar({
  placeholder = 'Search...',
  onSearch,
  debounceMs = 300,
  className = '',
}: SearchBarProps) {
  const [value, setValue] = useState('')
  const [focused, setFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      onSearch(query)
    }, debounceMs),
    [onSearch, debounceMs]
  )

  useEffect(() => {
    debouncedSearch(value)
  }, [value, debouncedSearch])

  const handleClear = () => {
    setValue('')
    onSearch('')
    inputRef.current?.focus()
  }

  return (
    <div className={`group relative ${className}`}>
      {/* Subtle glow ring on focus */}
      <div
        aria-hidden
        className={`from-secondary/30 via-accent-2/20 pointer-events-none absolute -inset-0.5 rounded-full bg-linear-to-r to-transparent opacity-0 blur-md transition-opacity duration-300 ${
          focused ? 'opacity-100' : ''
        }`}
      />

      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-4">
        <Search
          className={`h-4 w-4 transition-all duration-300 ${
            focused ? 'text-secondary scale-110' : 'text-primary/45'
          }`}
          strokeWidth={2}
        />
      </div>

      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        className="border-border/70 bg-surface text-primary placeholder:text-primary/40 focus:border-secondary/70 focus:ring-secondary/20 relative w-full rounded-full border py-2.5 pr-11 pl-10 font-sans text-sm transition-all duration-200 focus:ring-4 focus:outline-none"
      />

      {value && (
        <button
          onClick={handleClear}
          className="text-primary/40 hover:text-primary hover:bg-background/80 absolute inset-y-0 right-1.5 z-10 my-auto flex h-7 w-7 cursor-pointer items-center justify-center rounded-full transition-all duration-200 hover:scale-105 active:scale-90"
          aria-label="Clear search"
        >
          <X className="h-3.5 w-3.5" strokeWidth={2.4} />
        </button>
      )}
    </div>
  )
}
