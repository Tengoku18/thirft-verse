'use client'

import { Package } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

interface ImageGalleryProps {
  images: string[]
  productTitle: string
}

const ImageGallery = ({ images, productTitle }: ImageGalleryProps) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const validImages = images.filter(Boolean)

  if (validImages.length === 0) {
    return (
      <div className="space-y-4">
        <div className="relative aspect-square overflow-hidden rounded-3xl bg-white shadow-lg">
          <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-gray-100 to-gray-200">
            <Package className="h-24 w-24 text-gray-300" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square overflow-hidden rounded-3xl bg-white shadow-lg">
        <Image
          src={validImages[selectedImageIndex]}
          alt={`${productTitle} - Image ${selectedImageIndex + 1}`}
          fill
          className="object-cover transition-all duration-300"
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority={selectedImageIndex === 0}
        />
      </div>

      {/* Thumbnail Gallery */}
      {validImages.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {validImages.slice(0, 4).map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImageIndex(index)}
              className={`relative aspect-square overflow-hidden rounded-xl bg-white shadow-md transition-all duration-200 ${
                selectedImageIndex === index
                  ? 'ring-4 ring-secondary scale-95'
                  : 'hover:scale-105 hover:shadow-lg'
              }`}
            >
              <Image
                src={image}
                alt={`${productTitle} - Thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 25vw, 12.5vw"
              />
            </button>
          ))}
        </div>
      )}

      {/* Image Counter */}
      {validImages.length > 1 && (
        <div className="text-center">
          <p className="text-sm text-primary/60">
            {selectedImageIndex + 1} / {validImages.length}
          </p>
        </div>
      )}
    </div>
  )
}

export default ImageGallery
