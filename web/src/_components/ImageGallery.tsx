'use client'

import { Package, ZoomIn } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import Lightbox from 'yet-another-react-lightbox'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import 'yet-another-react-lightbox/styles.css'

interface ImageGalleryProps {
  images: string[]
  productTitle: string
}

const ImageGallery = ({ images, productTitle }: ImageGalleryProps) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
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

  const slides = validImages.map((src) => ({ src }))

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div
        className="group relative aspect-square cursor-zoom-in overflow-hidden rounded-3xl bg-white shadow-lg"
        onClick={() => setLightboxOpen(true)}
      >
        <Image
          src={validImages[selectedImageIndex]}
          alt={`${productTitle} - Image ${selectedImageIndex + 1}`}
          fill
          className="object-cover transition-all duration-300"
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority={selectedImageIndex === 0}
        />
        {/* Zoom hint overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-200 group-hover:bg-black/10">
          <div className="flex items-center gap-2 rounded-full bg-black/50 px-3 py-1.5 opacity-100 transition-opacity duration-200 sm:opacity-0 sm:group-hover:opacity-100">
            <ZoomIn className="h-4 w-4 text-white" />
            <span className="text-xs font-medium text-white">Zoom</span>
          </div>
        </div>
      </div>

      {/* Thumbnail Gallery */}
      {validImages.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {validImages.slice(0, 4).map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImageIndex(index)}
              className={`relative aspect-square cursor-pointer overflow-hidden rounded-xl bg-white shadow-md transition-all duration-200 ${
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

      {/* Lightbox */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={slides}
        index={selectedImageIndex}
        on={{ view: ({ index }) => setSelectedImageIndex(index) }}
        plugins={[Zoom]}
        zoom={{ maxZoomPixelRatio: 4, scrollToZoom: true }}
      />
    </div>
  )
}

export default ImageGallery
