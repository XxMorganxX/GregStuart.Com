/**
 * Global window error handler
 * Add this script to catch unhandled errors
 */
'use client'

import { useEffect } from 'react'
import logger from '../utils/logger'

export default function GlobalErrorHandler() {
  useEffect(() => {
    // Handle unhandled errors
    const handleError = (event) => {
      logger.error('Unhandled Error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error,
        stack: event.error?.stack,
      })
    }

    // Handle unhandled promise rejections
    const handleUnhandledRejection = (event) => {
      logger.error('Unhandled Promise Rejection', {
        reason: event.reason,
        promise: event.promise,
      })
      
      // Check if it's a fetch error
      if (event.reason?.message?.includes('fetch')) {
        logger.fetchError('unknown', event.reason, 'Promise rejection')
      }
    }

    // Handle resource loading errors
    const handleResourceError = (event) => {
      if (event.target.tagName === 'IMG') {
        logger.imageError(event.target.src, new Error('Image failed to load'))
      } else if (event.target.tagName === 'SCRIPT') {
        logger.error('Script Load Error', { src: event.target.src })
      } else if (event.target.tagName === 'LINK') {
        logger.error('Stylesheet Load Error', { href: event.target.href })
      }
    }

    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleUnhandledRejection)
    window.addEventListener('error', handleResourceError, true) // Use capture phase for resource errors

    // Log when user leaves the page
    const handleBeforeUnload = () => {
      logger.info('User leaving page', { url: window.location.href })
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    // Initial page load log
    logger.info('Page loaded', {
      url: window.location.href,
      referrer: document.referrer,
      userAgent: navigator.userAgent,
    })

    return () => {
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
      window.removeEventListener('error', handleResourceError, true)
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [])

  // This component doesn't render anything
  return null
}
