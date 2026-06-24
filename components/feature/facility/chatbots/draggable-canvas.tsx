"use client"

import * as React from "react"
import { useCallback, useRef, useState, useEffect } from "react"

interface DraggableCanvasProps {
  children: React.ReactNode
  zoomLevel: number
  onZoomChange?: (zoom: number) => void
  className?: string
}

export function DraggableCanvas({
  children,
  zoomLevel,
  onZoomChange,
  className,
}: DraggableCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const dragStart = useRef({ x: 0, y: 0, panX: 0, panY: 0 })
  const zoomRef = useRef(zoomLevel)

  useEffect(() => {
    zoomRef.current = zoomLevel
  }, [zoomLevel])

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button !== 0) return
      if ((e.target as HTMLElement).closest("[data-chat-window]")) return

      setIsDragging(true)
      dragStart.current = {
        x: e.clientX,
        y: e.clientY,
        panX: pan.x,
        panY: pan.y,
      }
      e.preventDefault()
    },
    [pan]
  )

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return

      const dx = e.clientX - dragStart.current.x
      const dy = e.clientY - dragStart.current.y

      setPan({
        x: dragStart.current.panX + dx,
        y: dragStart.current.panY + dy,
      })
    },
    [isDragging]
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      document.body.style.cursor = "grabbing"
      document.body.style.userSelect = "none"
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
      document.body.style.cursor = ""
      document.body.style.userSelect = ""
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault()
        e.stopPropagation()
        const delta = e.deltaY > 0 ? -10 : 10
        const newZoom = Math.min(200, Math.max(25, zoomRef.current + delta))
        onZoomChange?.(newZoom)
      }
    }

    container.addEventListener("wheel", handleWheel, { passive: false })

    return () => {
      container.removeEventListener("wheel", handleWheel)
    }
  }, [onZoomChange])

  const handleDoubleClick = useCallback(() => {
    setPan({ x: 0, y: 0 })
    if (onZoomChange) {
      onZoomChange(100)
    }
  }, [onZoomChange])

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden ${isDragging ? "cursor-grabbing" : "cursor-grab"} ${className || ""}`}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
      style={{
        backgroundImage: "radial-gradient(circle, #d1d5db 1px, transparent 1px)",
        backgroundSize: "20px 20px",
      }}
    >
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoomLevel / 100})`,
          transformOrigin: "center center",
          transition: isDragging ? "none" : "transform 0.1s ease-out",
        }}
      >
        {children}
      </div>
    </div>
  )
}
