'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import styles from './ImageAnchoredLayout.module.css'

/**
 * ImageAnchoredLayout - Positions overlays relative to an image with object-fit: cover
 * 
 * The problem: When using object-fit: cover, the image is scaled and potentially cropped.
 * Percentage-based positions in the container don't match actual image coordinates.
 * 
 * The solution: Calculate where the image is actually rendered and transform the
 * overlay layer to match, so percentage positions stay anchored to the image.
 * 
 * object-position: center top means:
 * - Horizontally: centered (cropped equally from left/right if needed)
 * - Vertically: aligned to top (cropped from bottom if needed)
 */
export default function ImageAnchoredLayout({ 
  imageSrc, 
  imageAlt = '', 
  children,
  className = ''
}) {
  const containerRef = useRef(null)
  const imageRef = useRef(null)
  const [overlayStyle, setOverlayStyle] = useState({})

  // Calculate where the image is actually rendered within the container
  const calculateOverlayPosition = useCallback(() => {
    const container = containerRef.current
    const image = imageRef.current
    
    if (!container || !image || !image.naturalWidth) return

    const containerWidth = container.offsetWidth
    const containerHeight = container.offsetHeight
    const imageNaturalWidth = image.naturalWidth
    const imageNaturalHeight = image.naturalHeight

    // Calculate aspect ratios
    const containerAspect = containerWidth / containerHeight
    const imageAspect = imageNaturalWidth / imageNaturalHeight

    let renderedWidth, renderedHeight, offsetX, offsetY

    if (containerAspect > imageAspect) {
      // Container is wider than image - image fills width, cropped vertically
      renderedWidth = containerWidth
      renderedHeight = containerWidth / imageAspect
      offsetX = 0
      // object-position: center top - image starts at top, crops from bottom
      offsetY = 0
    } else {
      // Container is taller than image - image fills height, cropped horizontally
      renderedHeight = containerHeight
      renderedWidth = containerHeight * imageAspect
      // object-position: center - horizontally centered
      offsetX = (containerWidth - renderedWidth) / 2
      offsetY = 0
    }

    // The overlay layer should match the image's rendered dimensions and position
    setOverlayStyle({
      width: `${renderedWidth}px`,
      height: `${renderedHeight}px`,
      left: `${offsetX}px`,
      top: `${offsetY}px`,
    })
  }, [])

  // Recalculate on mount, image load, and resize
  useEffect(() => {
    const image = imageRef.current
    
    // Calculate immediately if image is already loaded
    if (image?.complete && image?.naturalWidth) {
      calculateOverlayPosition()
    }

    // Also calculate when image loads
    const handleLoad = () => calculateOverlayPosition()
    image?.addEventListener('load', handleLoad)

    // Recalculate on window resize
    window.addEventListener('resize', calculateOverlayPosition)

    return () => {
      image?.removeEventListener('load', handleLoad)
      window.removeEventListener('resize', calculateOverlayPosition)
    }
  }, [calculateOverlayPosition])

  return (
    <div ref={containerRef} className={`${styles.container} ${className}`}>
      <img
        ref={imageRef}
        src={imageSrc}
        alt={imageAlt}
        className={styles.backgroundImage}
      />
      <div className={styles.overlayLayer} style={overlayStyle}>
        {children}
      </div>
    </div>
  )
}

