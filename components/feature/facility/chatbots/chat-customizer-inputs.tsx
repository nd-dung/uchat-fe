"use client"

import * as React from "react"
import { useState, useCallback, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, ChevronRight, type LucideIcon } from "lucide-react"

export interface PropertySectionProps {
  title: string
  icon: LucideIcon
  sectionKey: string
  children: React.ReactNode
  badge?: string
  isCollapsed: boolean
  onToggle: (key: string) => void
}

export const PropertySection = React.memo(function PropertySection({
  title,
  icon: Icon,
  sectionKey,
  children,
  badge,
  isCollapsed,
  onToggle,
}: PropertySectionProps) {
  const handleToggle = useCallback(() => onToggle(sectionKey), [onToggle, sectionKey])

  return (
    <div className="border border-border rounded-lg bg-card/50 backdrop-blur-sm">
      <button
        onClick={handleToggle}
        className="w-full flex items-center justify-between p-3 hover:bg-accent/10 transition-colors rounded-t-lg"
      >
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-primary" />
          <span className="font-medium text-sm text-foreground">{title}</span>
          {badge && (
            <Badge variant="secondary" className="text-xs">
              {badge}
            </Badge>
          )}
        </div>
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </button>
      {!isCollapsed && <div className="p-3 pt-0 space-y-4 border-t border-border/50">{children}</div>}
    </div>
  )
})

export interface NumericInputProps {
  label: string
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  unit?: string
}

export const NumericInput = React.memo(function NumericInput({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  unit = "",
}: NumericInputProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [startValue, setStartValue] = useState(0)
  const [startY, setStartY] = useState(0)

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true)
    setStartValue(value)
    setStartY(e.clientY)
    document.body.style.cursor = "ns-resize"
  }, [value])

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => onChange(Number(e.target.value)),
    [onChange]
  )

  const handleSliderChange = useCallback((val: number[]) => onChange(val[0]), [onChange])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return
      const deltaY = startY - e.clientY
      const newValue = Math.max(min, Math.min(max, startValue + deltaY * step))
      onChange(newValue)
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      document.body.style.cursor = "default"
    }

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, startY, startValue, min, max, step, onChange])

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
        <div className="flex items-center gap-1">
          <Input
            type="number"
            value={value}
            onChange={handleInputChange}
            onMouseDown={handleMouseDown}
            className="w-16 h-7 text-xs text-right border-0 bg-input rounded px-2 cursor-ns-resize select-none"
            min={min}
            max={max}
            step={step}
          />
          <span className="text-xs text-muted-foreground min-w-[20px]">{unit}</span>
        </div>
      </div>
      <Slider
        value={[value]}
        onValueChange={handleSliderChange}
        min={min}
        max={max}
        step={step}
        className="w-full"
      />
    </div>
  )
})

export interface ColorInputProps {
  label: string
  value: string
  onChange: (value: string) => void
}

export const ColorInput = React.memo(function ColorInput({ label, value, onChange }: ColorInputProps) {
  const handleColorChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value),
    [onChange]
  )
  const handleTextChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value),
    [onChange]
  )

  return (
    <div className="space-y-2">
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      <div className="flex items-center gap-2">
        <div
          className="w-10 h-8 rounded-md border-2 border-border cursor-pointer relative overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          style={{ backgroundColor: value }}
        >
          <Input
            type="color"
            value={value}
            onChange={handleColorChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
        <Input
          value={value}
          onChange={handleTextChange}
          className="flex-1 h-8 text-xs font-mono bg-input border-border"
          placeholder="#000000"
        />
      </div>
    </div>
  )
})

export interface TextInputProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export const TextInput = React.memo(function TextInput({
  label,
  value,
  onChange,
  placeholder,
}: TextInputProps) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value),
    [onChange]
  )

  return (
    <div className="space-y-2">
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      <Input
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="h-8 text-xs bg-input border-border"
      />
    </div>
  )
})
