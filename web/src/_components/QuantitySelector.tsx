'use client'

import { Minus, Plus } from 'lucide-react'
import { useState } from 'react'

interface QuantitySelectorProps {
  maxQuantity: number
  onQuantityChange: (quantity: number) => void
  initialQuantity?: number
}

export function QuantitySelector({
  maxQuantity,
  onQuantityChange,
  initialQuantity = 1,
}: QuantitySelectorProps) {
  const [quantity, setQuantity] = useState(initialQuantity)

  const handleDecrement = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1
      setQuantity(newQuantity)
      onQuantityChange(newQuantity)
    }
  }

  const handleIncrement = () => {
    if (quantity < maxQuantity) {
      const newQuantity = quantity + 1
      setQuantity(newQuantity)
      onQuantityChange(newQuantity)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

    // Allow empty input for user editing
    if (value === '') {
      setQuantity(0)
      return
    }

    const numValue = parseInt(value, 10)

    // Validate the input
    if (!isNaN(numValue) && numValue >= 1 && numValue <= maxQuantity) {
      setQuantity(numValue)
      onQuantityChange(numValue)
    } else if (!isNaN(numValue) && numValue > maxQuantity) {
      setQuantity(maxQuantity)
      onQuantityChange(maxQuantity)
    }
  }

  const handleBlur = () => {
    // If empty or 0, reset to 1
    if (quantity === 0) {
      setQuantity(1)
      onQuantityChange(1)
    }
  }

  const isDecrementDisabled = quantity <= 1
  const isIncrementDisabled = quantity >= maxQuantity

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-primary/80">Quantity</label>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleDecrement}
          disabled={isDecrementDisabled}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-border/50 bg-background transition-all hover:border-secondary hover:bg-secondary/10 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-border/50 disabled:hover:bg-background"
          aria-label="Decrease quantity"
        >
          <Minus className="h-4 w-4 text-primary" />
        </button>

        <input
          type="number"
          value={quantity}
          onChange={handleInputChange}
          onBlur={handleBlur}
          min="1"
          max={maxQuantity}
          className="h-10 w-20 rounded-lg border border-border/50 bg-background px-3 text-center font-semibold text-primary transition-all focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20"
          aria-label="Quantity"
        />

        <button
          type="button"
          onClick={handleIncrement}
          disabled={isIncrementDisabled}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-border/50 bg-background transition-all hover:border-secondary hover:bg-secondary/10 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-border/50 disabled:hover:bg-background"
          aria-label="Increase quantity"
        >
          <Plus className="h-4 w-4 text-primary" />
        </button>

        <span className="ml-2 text-sm text-primary/60">
          {maxQuantity} available
        </span>
      </div>
    </div>
  )
}
