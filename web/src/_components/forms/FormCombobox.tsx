'use client'

import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react'
import { Search, ChevronDown, Check, X } from 'lucide-react'

interface FormComboboxProps {
  label: string
  placeholder?: string
  error?: string
  required?: boolean
  options: string[]
  value?: string
  onChange?: (value: string) => void
  disabled?: boolean
  className?: string
}

export interface FormComboboxRef {
  getValue: () => string
  setValue: (value: string) => void
}

export const FormCombobox = forwardRef<FormComboboxRef, FormComboboxProps>(
  (
    {
      label,
      placeholder = 'Search...',
      error,
      required,
      options,
      value: controlledValue,
      onChange,
      disabled,
      className = '',
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedValue, setSelectedValue] = useState(controlledValue || '')
    const [highlightedIndex, setHighlightedIndex] = useState(-1)
    const containerRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const listRef = useRef<HTMLUListElement>(null)

    // Sync with controlled value
    useEffect(() => {
      if (controlledValue !== undefined) {
        setSelectedValue(controlledValue)
      }
    }, [controlledValue])

    // Expose methods via ref
    useImperativeHandle(ref, () => ({
      getValue: () => selectedValue,
      setValue: (value: string) => {
        setSelectedValue(value)
        onChange?.(value)
      },
    }))

    // Filter options based on search query
    const filteredOptions = options.filter((option) =>
      option.toLowerCase().includes(searchQuery.toLowerCase())
    )

    // Handle click outside to close dropdown
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setIsOpen(false)
          setSearchQuery('')
        }
      }

      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Scroll highlighted item into view
    useEffect(() => {
      if (highlightedIndex >= 0 && listRef.current) {
        const items = listRef.current.querySelectorAll('li')
        items[highlightedIndex]?.scrollIntoView({ block: 'nearest' })
      }
    }, [highlightedIndex])

    const handleSelect = (option: string) => {
      setSelectedValue(option)
      setSearchQuery('')
      setIsOpen(false)
      onChange?.(option)
    }

    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation()
      setSelectedValue('')
      setSearchQuery('')
      onChange?.('')
      inputRef.current?.focus()
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (disabled) return

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          if (!isOpen) {
            setIsOpen(true)
          } else {
            setHighlightedIndex((prev) =>
              prev < filteredOptions.length - 1 ? prev + 1 : prev
            )
          }
          break
        case 'ArrowUp':
          e.preventDefault()
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev))
          break
        case 'Enter':
          e.preventDefault()
          if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
            handleSelect(filteredOptions[highlightedIndex])
          }
          break
        case 'Escape':
          setIsOpen(false)
          setSearchQuery('')
          break
      }
    }

    return (
      <div className={`w-full ${className}`} ref={containerRef}>
        <label className="mb-2 block text-sm font-medium text-primary">
          {label} {required && <span className="text-red-500">*</span>}
        </label>

        <div className="relative">
          {/* Input Container */}
          <div
            className={`relative flex items-center rounded-xl border ${
              error ? 'border-red-500' : isOpen ? 'border-secondary ring-2 ring-secondary/20' : 'border-border'
            } bg-surface transition-all ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
            onClick={() => {
              if (!disabled) {
                setIsOpen(true)
                inputRef.current?.focus()
              }
            }}
          >
            <Search className="absolute left-3 h-4 w-4 text-primary/40" />

            <input
              ref={inputRef}
              type="text"
              className="w-full bg-transparent py-3 pl-10 pr-16 text-primary placeholder-primary/40 focus:outline-none disabled:cursor-not-allowed"
              placeholder={selectedValue || placeholder}
              value={isOpen ? searchQuery : selectedValue}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setHighlightedIndex(0)
                if (!isOpen) setIsOpen(true)
              }}
              onFocus={() => setIsOpen(true)}
              onKeyDown={handleKeyDown}
              disabled={disabled}
            />

            <div className="absolute right-2 flex items-center gap-1">
              {selectedValue && !disabled && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="rounded-full p-1 hover:bg-primary/10 transition-colors"
                >
                  <X className="h-4 w-4 text-primary/40" />
                </button>
              )}
              <ChevronDown
                className={`h-4 w-4 text-primary/40 transition-transform ${
                  isOpen ? 'rotate-180' : ''
                }`}
              />
            </div>
          </div>

          {/* Dropdown */}
          {isOpen && (
            <ul
              ref={listRef}
              className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-xl border border-border bg-surface shadow-lg"
            >
              {filteredOptions.length === 0 ? (
                <li className="px-4 py-3 text-sm text-primary/50">
                  No results found
                </li>
              ) : (
                filteredOptions.map((option, index) => (
                  <li
                    key={option}
                    className={`flex cursor-pointer items-center justify-between px-4 py-2.5 text-sm transition-colors ${
                      index === highlightedIndex
                        ? 'bg-secondary/10 text-secondary'
                        : 'text-primary hover:bg-primary/5'
                    } ${selectedValue === option ? 'font-medium' : ''}`}
                    onClick={() => handleSelect(option)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                  >
                    <span>{option}</span>
                    {selectedValue === option && (
                      <Check className="h-4 w-4 text-secondary" />
                    )}
                  </li>
                ))
              )}
            </ul>
          )}
        </div>

        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    )
  }
)

FormCombobox.displayName = 'FormCombobox'
