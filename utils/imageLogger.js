import logger from './logger'

/**
 * Utility to track image loading and errors
 */
export function logImageError(src, error) {
  logger.imageError(src, error)
  
  // Check if the image path looks correct
  if (!src.startsWith('/') && !src.startsWith('http')) {
    logger.warn('Image path may be incorrect', { src, suggestion: 'Ensure path starts with / for public folder' })
  }
}

export function logImageLoad(src) {
  logger.debug('Image loaded successfully', { src })
}

/**
 * Create an image with error logging
 */
export function createTrackedImage(src, onLoad, onError) {
  const img = new Image()
  
  img.onload = () => {
    logImageLoad(src)
    onLoad?.()
  }
  
  img.onerror = (error) => {
    logImageError(src, error)
    onError?.()
  }
  
  img.src = src
  return img
}

/**
 * Verify if an image exists
 */
export async function verifyImageExists(src) {
  return new Promise((resolve) => {
    const img = new Image()
    
    img.onload = () => {
      logger.debug('Image verified', { src, exists: true })
      resolve(true)
    }
    
    img.onerror = () => {
      logger.warn('Image not found', { src, exists: false })
      resolve(false)
    }
    
    img.src = src
  })
}
