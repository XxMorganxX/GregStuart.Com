'use client'

import { useState, useRef, useEffect } from 'react'
import styles from './LayoutEditor.module.css'

export default function LayoutEditor({ children, id, initialPosition = { x: 0, y: 0 }, initialSize = { width: 200, height: 200 } }) {
  const [position, setPosition] = useState(initialPosition)
  const [size, setSize] = useState(initialSize)
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [parentSize, setParentSize] = useState({ width: 1400, height: 800 })
  const elementRef = useRef(null)

  // Get parent container size for relative calculations
  useEffect(() => {
    const updateParentSize = () => {
      if (elementRef.current?.parentElement) {
        const parent = elementRef.current.parentElement
        setParentSize({
          width: parent.offsetWidth,
          height: parent.offsetHeight
        })
      }
    }
    
    updateParentSize()
    window.addEventListener('resize', updateParentSize)
    return () => window.removeEventListener('resize', updateParentSize)
  }, [])

  // Calculate ALL values as percentages
  const pctLeft = ((position.x / parentSize.width) * 100).toFixed(1)
  const pctTop = ((position.y / parentSize.height) * 100).toFixed(1)
  const pctWidth = ((size.width / parentSize.width) * 100).toFixed(1)
  const pctHeight = ((size.height / parentSize.height) * 100).toFixed(1)
  const pctRight = (((parentSize.width - position.x - size.width) / parentSize.width) * 100).toFixed(1)

  const handleMouseDown = (e) => {
    if (e.target.classList.contains(styles.resizeHandle)) return
    setIsDragging(true)
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    })
  }

  const handleResizeMouseDown = (e) => {
    e.stopPropagation()
    setIsResizing(true)
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height
    })
  }

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y
        })
      }
      if (isResizing) {
        const deltaX = e.clientX - dragStart.x
        const deltaY = e.clientY - dragStart.y
        setSize({
          width: Math.max(50, dragStart.width + deltaX),
          height: Math.max(50, dragStart.height + deltaY)
        })
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      setIsResizing(false)
    }

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, isResizing, dragStart])

  const copyCSS = () => {
    // Determine if element is closer to left or right edge
    const useRight = position.x > parentSize.width / 2
    
    const css = `/* ${id} */
position: absolute;
${useRight ? `right: ${pctRight}%;` : `left: ${pctLeft}%;`}
top: ${pctTop}%;
width: ${pctWidth}%;
height: ${pctHeight}%;
z-index: 4;`
    navigator.clipboard.writeText(css)
    alert('CSS copied to clipboard!')
  }

  const useRight = position.x > parentSize.width / 2

  return (
    <div
      ref={elementRef}
      className={`${styles.layoutEditor} ${isDragging ? styles.dragging : ''}`}
      style={{
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
      }}
      onMouseDown={handleMouseDown}
    >
      <div className={styles.content}>
        {children}
      </div>
      
      {/* Info panel */}
      <div className={styles.infoPanel}>
        <div className={styles.infoTitle}>{id}</div>
        <div className={styles.infoSection}>All % (scales with BG)</div>
        {useRight ? (
          <div className={styles.infoRow}>
            <span>right:</span> <strong>{pctRight}%</strong>
          </div>
        ) : (
          <div className={styles.infoRow}>
            <span>left:</span> <strong>{pctLeft}%</strong>
          </div>
        )}
        <div className={styles.infoRow}>
          <span>top:</span> <strong>{pctTop}%</strong>
        </div>
        <div className={styles.infoRow}>
          <span>width:</span> <strong>{pctWidth}%</strong>
        </div>
        <div className={styles.infoRow}>
          <span>height:</span> <strong>{pctHeight}%</strong>
        </div>
        <div className={styles.infoSection}>Container: {parentSize.width}×{parentSize.height}</div>
        <button className={styles.copyBtn} onClick={copyCSS}>
          Copy CSS
        </button>
      </div>

      {/* Resize handle */}
      <div 
        className={styles.resizeHandle}
        onMouseDown={handleResizeMouseDown}
      />
    </div>
  )
}
