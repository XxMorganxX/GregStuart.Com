'use client'

import { useEffect, useState } from 'react'
import Header from '../../components/Header'
import styles from './page.module.css'
import logger from '../../utils/logger'

export default function About() {
  const [pageLoadTime, setPageLoadTime] = useState(null)
  const [resourcesLoaded, setResourcesLoaded] = useState({
    background: false,
    photo: false
  })

  useEffect(() => {
    const startTime = performance.now()
    logger.navigation('/about')
    logger.component('About', 'mounted', { 
      userAgent: navigator.userAgent,
      viewport: { width: window.innerWidth, height: window.innerHeight },
      online: navigator.onLine,
      connectionType: navigator.connection?.effectiveType,
      downlink: navigator.connection?.downlink,
      rtt: navigator.connection?.rtt
    })

    // Track unhandled promise rejections (catches "Failed to fetch" errors)
    const handleUnhandledRejection = (event) => {
      logger.error('Unhandled promise rejection detected', {
        reason: event.reason?.message || String(event.reason),
        stack: event.reason?.stack,
        promise: String(event.promise),
        isFetchError: event.reason?.message?.includes('Failed to fetch'),
        timestamp: Date.now()
      })
      
      // Prevent default to avoid console noise
      event.preventDefault()
    }

    // Track network status changes
    const handleOnline = () => {
      logger.info('Network connection restored', {
        timestamp: Date.now(),
        connectionType: navigator.connection?.effectiveType
      })
    }

    const handleOffline = () => {
      logger.warn('Network connection lost', {
        timestamp: Date.now()
      })
    }

    // Track connection type changes
    const handleConnectionChange = () => {
      logger.info('Connection type changed', {
        effectiveType: navigator.connection?.effectiveType,
        downlink: navigator.connection?.downlink,
        rtt: navigator.connection?.rtt,
        saveData: navigator.connection?.saveData
      })
    }

    window.addEventListener('unhandledrejection', handleUnhandledRejection)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    if (navigator.connection) {
      navigator.connection.addEventListener('change', handleConnectionChange)
    }

    // Monitor resource loading
    const checkResources = () => {
      const loadTime = performance.now() - startTime
      setPageLoadTime(loadTime)
      logger.info('Page load complete', {
        loadTime: `${loadTime.toFixed(2)}ms`,
        resourcesLoaded
      })
    }

    // Monitor network failures
    const handleNetworkError = (event) => {
      logger.error('Network error detected', {
        type: event.type,
        target: event.target?.tagName,
        src: event.target?.src || event.target?.href,
        message: 'Resource failed to load'
      })
    }

    // Add global error listener
    window.addEventListener('error', handleNetworkError, true)

    // Monitor fetch failures with detailed tracking
    const originalFetch = window.fetch
    let fetchCounter = 0
    const DEBUG_LOG_ENDPOINT = 'http://127.0.0.1:7242/ingest'
    const MALICIOUS_DOMAINS = ['sevendata.fun', 'secdomcheck.online', 'adclick', 'tracking']
    
    window.fetch = async (...args) => {
      const url = typeof args[0] === 'string' ? args[0] : args[0]?.url || ''
      
      // Don't intercept debug logging endpoints to prevent recursion
      if (url.includes(DEBUG_LOG_ENDPOINT)) {
        try {
          return await originalFetch(...args)
        } catch (e) {
          // Silently fail debug logs - don't crash the page
          return new Response(null, { status: 500 })
        }
      }
      
      const fetchId = ++fetchCounter
      const startFetch = performance.now()
      const method = args[1]?.method || 'GET'
      const headers = args[1]?.headers
      
      // Detect potentially malicious requests
      const isSuspicious = MALICIOUS_DOMAINS.some(domain => url.includes(domain))
      
      // Get stack trace to identify the source
      const stack = new Error().stack
      const stackLines = stack?.split('\n').slice(2, 6) // Get caller info
      
      if (isSuspicious) {
        logger.error(`🚨 SUSPICIOUS FETCH DETECTED [#${fetchId}]`, {
          url,
          method,
          stack: stackLines,
          possibleSource: 'Browser extension or injected script',
          timestamp: Date.now()
        })
        
        // Log to console with styling for visibility
        console.group(`%c🚨 MALICIOUS REQUEST BLOCKED`, 'color: red; font-weight: bold; font-size: 14px')
        console.log('%cURL:', 'font-weight: bold', url)
        console.log('%cStack trace (shows source):', 'font-weight: bold')
        console.log(stackLines.join('\n'))
        console.log('%cCheck chrome://extensions to identify the culprit', 'color: orange; font-weight: bold')
        console.groupEnd()
      }
      
      try {
        if (!isSuspicious) {
          logger.debug(`[Fetch #${fetchId}] Initiated`, { 
            url, 
            method,
            headers: headers ? Object.fromEntries(new Headers(headers)) : undefined,
            online: navigator.onLine,
            connectionType: navigator.connection?.effectiveType
          })
        }
      } catch (logErr) {
        // Don't let logging errors break the fetch
        console.warn('Logging error:', logErr)
      }
      
      try {
        const response = await originalFetch(...args)
        const duration = performance.now() - startFetch
        
        if (!isSuspicious) {
          try {
            logger.info(`[Fetch #${fetchId}] Completed`, {
              url,
              status: response.status,
              statusText: response.statusText,
              duration: `${duration.toFixed(2)}ms`,
              ok: response.ok,
              headers: Object.fromEntries(response.headers),
              redirected: response.redirected,
              type: response.type
            })
          } catch (logErr) {
            console.warn('Logging error:', logErr)
          }
          
          if (!response.ok) {
            try {
              logger.warn(`[Fetch #${fetchId}] Non-OK response`, {
                url,
                status: response.status,
                statusText: response.statusText
              })
            } catch (logErr) {
              console.warn('Logging error:', logErr)
            }
          }
        }
        
        return response
      } catch (error) {
        const duration = performance.now() - startFetch
        
        if (isSuspicious) {
          console.error(`%c❌ Malicious request failed (${url})`, 'color: red', error)
        } else {
          try {
            logger.error(`[Fetch #${fetchId}] FAILED`, {
              url,
              method,
              duration: `${duration.toFixed(2)}ms`,
              errorType: error.name,
              errorMessage: error.message,
              stack: error.stack,
              online: navigator.onLine,
              connectionType: navigator.connection?.effectiveType,
              cause: error.cause
            })
          } catch (logErr) {
            console.error('Logging error:', logErr)
            // Still log the original error
            console.error('Original fetch error:', error)
          }
        }
        
        throw error
      }
    }

    // Check if page is fully loaded
    if (document.readyState === 'complete') {
      checkResources()
    } else {
      window.addEventListener('load', checkResources)
    }
    
    return () => {
      logger.component('About', 'unmounted', { 
        pageLoadTime,
        resourcesLoaded
      })
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
      window.removeEventListener('error', handleNetworkError, true)
      window.removeEventListener('load', checkResources)
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      
      if (navigator.connection) {
        navigator.connection.removeEventListener('change', handleConnectionChange)
      }
      
      window.fetch = originalFetch // Restore original fetch
    }
  }, [])

  const handleImageError = (e, imageName) => {
    setResourcesLoaded(prev => ({ ...prev, [imageName]: false }))
    logger.imageError(e.target.src, new Error(`Failed to load ${imageName}`))
    logger.error('Image load failure details', {
      imageName,
      src: e.target.src,
      naturalWidth: e.target.naturalWidth,
      naturalHeight: e.target.naturalHeight,
      complete: e.target.complete,
      currentSrc: e.target.currentSrc
    })
  }

  const handleImageLoad = (imageName) => {
    setResourcesLoaded(prev => ({ ...prev, [imageName]: true }))
    logger.debug(`Image loaded: ${imageName}`, {
      naturalWidth: event.target.naturalWidth,
      naturalHeight: event.target.naturalHeight
    })
  }

  const handleBackgroundError = (e) => {
    setResourcesLoaded(prev => ({ ...prev, background: false }))
    logger.imageError(e.target.src, new Error('Failed to load background image'))
  }

  const handleBackgroundLoad = () => {
    setResourcesLoaded(prev => ({ ...prev, background: true }))
    logger.debug('Background image loaded successfully')
  }

  return (
    <div className={styles.pageWrapper}>
      {/* Header */}
      <div className={styles.headerWrapper}>
        <Header />
      </div>

      {/* Background Image */}
      <div className={styles.backgroundContainer}>
        <img 
          src="/bg.jpg" 
          alt="Background" 
          className={styles.backgroundImage}
        />
      </div>

      {/* Main Content */}
      <main className={styles.mainContainer}>
        <div className={styles.contentArea}>
          {/* Two Column Layout */}
          <div className={styles.aboutLayout}>
            {/* Left Column - Grid */}
            <div className={styles.leftColumn}>
              <div className={styles.gridContainer}>
                {/* Top Left - Name Box */}
                <div className={`${styles.gridItem} ${styles.nameBox}`}>
                  <h1>Greg Stuart</h1>
                </div>
                
                {/* Top Right - Photo */}
                <div className={`${styles.gridItem} ${styles.photoBox}`}>
                  <img 
                    src="/greg-about-me.jpeg" 
                    alt="Greg Stuart"
                    onError={(e) => handleImageError(e, 'greg-photo')}
                    onLoad={() => handleImageLoad('greg-photo')}
                  />
                </div>
                
                {/* Bottom Left - Quote Box */}
                <div className={`${styles.gridItem} ${styles.quoteBox}`}>
                  <p>Greg Gives Direction on Improving Advertising as much +1,000%</p>
                </div>
                
                {/* Bottom Right - Title Box */}
                <div className={`${styles.gridItem} ${styles.titleBox}`}>
                  <p>Global Leader in Digital Advertising</p>
                </div>
              </div>
            </div>

            {/* Right Column - Bio Content */}
            <div className={styles.rightColumn}>
              <div className={styles.bioSection}>
                <h2 className={styles.bioTitle}>A bit about me...</h2>
                
                <p className={styles.bioText}>
                  Greg Stuart is a proven digital media General Manager & CEO, having led 
                  or served on teams building consumer digital media & internet ad-technology 
                  businesses since 1993, with successful acquisitions & an IPO.
                </p>
                
                <p className={styles.bioText}>
                  Greg has held board member & advisory roles resulting in exits of companies 
                  with liquidity events of over $1.6 billion in the past five years, many of 
                  which were atleast 10x multiple.
                </p>
                
                <p className={`${styles.bioText} ${styles.highlight}`}>
                  Greg happily lives in Brooklyn, NY, with his wife 
                  Pamela, and his twin daughters & son.
                </p>
              </div>
            </div>
          </div>

          {/* Career Highlights Section */}
          <div className={styles.highlightsSection}>
            <ul className={styles.highlightsList}>
              <li className={styles.highlightItem}>
                <span className={styles.bullet}>●</span>
                <p>
                  Recognized thought leader in digital media & advertising. Made Ad Age list of 
                  <span className={styles.award}> "10 Who Made Their Mark" </span>
                  for 2006 (alongside hip-hot entrepreneur Jay-Z & youtube Cofounder Chad Hurley).
                </p>
              </li>
              
              <li className={styles.highlightItem}>
                <span className={styles.bullet}>●</span>
                <p>
                  Coauthor of what sticks: why Most Advertising Fails and How to Guarantee yours 
                  Succeeds (#1 book in Ad Age's 2006 Book of Tens).
                </p>
              </li>
              
              <li className={styles.highlightItem}>
                <span className={styles.bullet}>●</span>
                <p>
                  Doubled revenue in first two years as current CEO of Mobile Marketing Association 
                  (MMA), the premier global nonprofit trade association, representing 700+ member companies.
                </p>
              </li>
              
              <li className={styles.highlightItem}>
                <span className={styles.bullet}>●</span>
                <p>
                  Former CEO of Interactive Advertising Bureau (IAB), serving AOL, CBS's CNET, 
                  Google, Yahoo! and others; grew IAB's revenues +500% (37% CAGR) in four years.
                </p>
              </li>
            </ul>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={styles.mainFooter}>
        <nav className={styles.footerNav}>
          <a href="/about">About Me</a>
          <span className={styles.dot}>●</span>
          <a href="/media-kit">Media Kit</a>
          <span className={styles.dot}>●</span>
          <a href="/contact">Contact Me</a>
          <span className={styles.dot}>●</span>
          <a href="/news">News &amp; Press</a>
        </nav>
        
        <div className={styles.footerRight}>
          <div className={styles.socialIcons}>
            <a href="https://www.facebook.com/gregnstuart" target="_blank" rel="noopener noreferrer" className={`${styles.socialIcon} ${styles.facebook}`} aria-label="Facebook">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a href="https://www.youtube.com/@GregStuart" target="_blank" rel="noopener noreferrer" className={`${styles.socialIcon} ${styles.youtube}`} aria-label="YouTube">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>
            <a href="https://www.linkedin.com/in/gregstuart/" target="_blank" rel="noopener noreferrer" className={`${styles.socialIcon} ${styles.linkedin}`} aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
          </div>
          <span className={styles.copyright}>© Greg Stuart</span>
        </div>
      </footer>
    </div>
  )
}
