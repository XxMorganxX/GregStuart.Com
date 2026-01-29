'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import styles from './Billboard.module.css'
import logger from '../utils/logger'

export default function Billboard({ 
  items = [], 
  title, 
  rotateInterval = 5000,
  variant = 'default',  // 'default', 'vertical', 'wide', 'center'
  stationaryBackground = false  // if true, only text animates, background stays fixed
}) {
  const activeItems = items.filter(item => item.active)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [nextIndex, setNextIndex] = useState(null)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Log component mount
  useEffect(() => {
    logger.component('Billboard', 'mounted', { 
      itemCount: activeItems.length, 
      title, 
      variant,
      rotateInterval 
    })
  }, [])

  // Handle image errors
  const handleImageError = (e, itemTitle) => {
    logger.imageError(e.target.src, new Error(`Billboard image failed: ${itemTitle}`))
  }

  // Auto-rotate through items
  useEffect(() => {
    if (activeItems.length <= 1) return

    const timer = setInterval(() => {
      startTransition((currentIndex + 1) % activeItems.length)
    }, rotateInterval)

    return () => clearInterval(timer)
  }, [activeItems.length, rotateInterval, currentIndex])

  const startTransition = (newIndex) => {
    if (isTransitioning || newIndex === currentIndex) return
    
    setNextIndex(newIndex)
    setIsTransitioning(true)
    
    // After animation completes, finalize the transition
    setTimeout(() => {
      setCurrentIndex(newIndex)
      setNextIndex(null)
      setIsTransitioning(false)
    }, 500) // Match CSS transition duration
  }

  const goToSlide = (index) => {
    startTransition(index)
  }

  if (activeItems.length === 0) return null

  const variantClass = variant === 'vertical' ? styles.vertical : 
                       variant === 'wide' ? styles.wide :
                       variant === 'center' ? styles.center : ''

  // Render title text (for stationary background mode)
  const TitleText = ({ item, className }) => {
    const hasExternalLink = item.externalLink && item.externalLink.length > 0
    const hasInternalLink = item.link && item.link.length > 0

    const titleContent = <div className={styles.cardTitle}>{item.title}</div>

    if (hasExternalLink) {
      return (
        <a
          href={item.externalLink}
          target="_blank"
          rel="noopener noreferrer"
          className={`${styles.titleLink} ${className}`}
        >
          {titleContent}
        </a>
      )
    } else if (hasInternalLink) {
      return (
        <Link href={item.link} className={`${styles.titleLink} ${className}`}>
          {titleContent}
        </Link>
      )
    } else {
      return (
        <div className={`${styles.titleWrapper} ${className}`}>
          {titleContent}
        </div>
      )
    }
  }

  // Render a single card (for standard mode)
  const CardItem = ({ item, className }) => {
    const hasExternalLink = item.externalLink && item.externalLink.length > 0
    const hasInternalLink = item.link && item.link.length > 0

    const content = (
    <>
      <div
        className={styles.cardImage}
          style={{ backgroundImage: `url(${item.image})` }}
      />
      <div className={styles.cardOverlay}>
          <div className={styles.cardTitle}>{item.title}</div>
      </div>
    </>
  )

    if (hasExternalLink) {
      return (
        <a
          href={item.externalLink}
          target="_blank"
          rel="noopener noreferrer"
          className={`${styles.card} ${className}`}
        >
          {content}
        </a>
      )
    } else if (hasInternalLink) {
      return (
        <Link href={item.link} className={`${styles.card} ${className}`}>
          {content}
        </Link>
      )
    } else {
      return (
        <div className={`${styles.card} ${className}`}>
          {content}
        </div>
      )
    }
  }

  // Stationary background mode - only text rotates
  if (stationaryBackground && activeItems.length > 0) {
    const backgroundImage = activeItems[0].image // Use first item's image as stationary background
    
    return (
      <section className={`${styles.billboard} ${variantClass} ${styles.stationaryBg}`}>
        {title && <h2 className={styles.sectionTitle}>{title}</h2>}
        
        <div className={styles.cardWrapper}>
          {/* Stationary background image */}
          <div 
            className={styles.stationaryBackground}
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
          
          {/* Text overlay that rotates */}
          <div className={styles.textContainer}>
            <TitleText 
              item={activeItems[currentIndex]} 
              className={isTransitioning ? styles.textExitToLeft : styles.textCurrent}
            />
            
            {isTransitioning && nextIndex !== null && (
              <TitleText 
                item={activeItems[nextIndex]} 
                className={styles.textEnterFromRight}
              />
            )}
          </div>
        </div>

        {/* Navigation dots */}
        {activeItems.length > 1 && variant !== 'center' && (
          <div className={styles.dots}>
            {activeItems.map((_, index) => (
              <button
                key={index}
                className={`${styles.dot} ${index === currentIndex ? styles.activeDot : ''}`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </section>
    )
  }

  // Standard mode - entire card rotates
  return (
    <section className={`${styles.billboard} ${variantClass}`}>
      {title && <h2 className={styles.sectionTitle}>{title}</h2>}
      
      <div className={styles.cardWrapper}>
        <div className={styles.cardContainer}>
          {/* Current card - slides out to the left when transitioning */}
          <CardItem 
            item={activeItems[currentIndex]} 
            className={isTransitioning ? styles.exitToLeft : styles.current}
          />
          
          {/* Next card - slides in from the right when transitioning */}
          {isTransitioning && nextIndex !== null && (
            <CardItem 
              item={activeItems[nextIndex]} 
              className={styles.enterFromRight}
            />
          )}
        </div>
      </div>

      {/* Navigation dots */}
      {activeItems.length > 1 && variant !== 'center' && (
        <div className={styles.dots}>
          {activeItems.map((_, index) => (
            <button
              key={index}
              className={`${styles.dot} ${index === currentIndex ? styles.activeDot : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  )
}
