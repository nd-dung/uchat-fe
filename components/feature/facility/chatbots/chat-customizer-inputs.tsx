"use client"

import * as React from "react"
import { useState, useCallback, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ChevronDown, ChevronRight, type LucideIcon, Upload, X, Loader2 } from "lucide-react"
import { useUploadImage } from "@/lib/api/generated/upload/upload"
import Cropper from "react-easy-crop"
import { Button } from "@/components/ui/button"

export interface PropertySectionProps {
  title: string
  icon: LucideIcon
  sectionKey: string
  children: React.ReactNode
  badge?: string
  isCollapsed: boolean
  onToggle: (key: string) => void
  hidden?: boolean
  keywords?: string
}

export const PropertySection = React.memo(function PropertySection({
  title,
  icon: Icon,
  sectionKey,
  children,
  badge,
  isCollapsed,
  onToggle,
  hidden,
  keywords,
}: PropertySectionProps) {
  const handleToggle = useCallback(() => onToggle(sectionKey), [onToggle, sectionKey])

  if (hidden) return null

  return (
    <div className="border border-border rounded-none bg-card/50 backdrop-blur-sm">
      <button
        onClick={handleToggle}
        className="w-full flex items-center justify-between p-3 hover:bg-accent/10 transition-colors"
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
            className="w-16 h-7 text-xs text-right border-0 bg-white rounded px-2 cursor-ns-resize select-none"
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

function toValidHexColor(value: string): string {
  const trimmed = value.trim().toLowerCase()
  if (/^#[0-9a-f]{6}$/.test(trimmed)) return trimmed
  if (/^#[0-9a-f]{3}$/.test(trimmed)) {
    const [, r, g, b] = trimmed
    return `#${r}${r}${g}${g}${b}${b}`
  }
  return "#ffffff"
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

  const hexValue = toValidHexColor(value)

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
            value={hexValue}
            onChange={handleColorChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
        <Input
          value={value}
          onChange={handleTextChange}
          className="flex-1 h-8 text-xs font-mono bg-white border-border"
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
        className="h-8 text-xs bg-white border-border"
      />
    </div>
  )
})

export interface SelectInputProps {
  label: string
  value: string
  options: { value: string; label: string }[]
  onChange: (value: string) => void
}

export const SelectInput = React.memo(function SelectInput({
  label,
  value,
  options,
  onChange,
}: SelectInputProps) {
  const handleValueChange = useCallback((newValue: string) => onChange(newValue), [onChange])

  return (
    <div className="space-y-2">
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      <Select value={value} onValueChange={handleValueChange}>
        <SelectTrigger className="h-8 text-xs bg-white border-border">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
})

function getCroppedImg(imageSrc: string, pixelCrop: { x: number; y: number; width: number; height: number }): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.crossOrigin = "anonymous"
    image.onload = () => {
      const canvas = document.createElement("canvas")
      canvas.width = pixelCrop.width
      canvas.height = pixelCrop.height
      const ctx = canvas.getContext("2d")
      if (!ctx) {
        reject(new Error("No context"))
        return
      }
      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      )
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob)
        } else {
          reject(new Error("Canvas is empty"))
        }
      }, "image/png")
    }
    image.onerror = () => reject(new Error("Failed to load image"))
    image.src = imageSrc
  })
}

export interface UploadInputProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  accept?: string
  crop?: boolean
  cropShape?: "rect" | "round"
}

export const UploadInput = React.memo(function UploadInput({
  label,
  value,
  onChange,
  placeholder = "https://...",
  accept = "image/*",
  crop = false,
  cropShape = "rect",
}: UploadInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const uploadMutation = useUploadImage()
  const [imgError, setImgError] = useState(false)
  const [showCropModal, setShowCropModal] = useState(false)
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [cropPosition, setCropPosition] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<{ x: number; y: number; width: number; height: number } | null>(null)

  useEffect(() => {
    setImgError(false)
  }, [value])

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return

      if (crop) {
        const reader = new FileReader()
        reader.onload = () => {
          setImageSrc(reader.result as string)
          setShowCropModal(true)
        }
        reader.readAsDataURL(file)
      } else {
        uploadMutation.mutate(
          { data: { file } },
          {
            onSuccess: (response) => {
              if (response.data?.url) {
                onChange(response.data.url)
              }
            },
          }
        )
      }

      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    },
    [onChange, uploadMutation, crop]
  )

  const handleCropConfirm = useCallback(async () => {
    if (!imageSrc || !croppedAreaPixels) return

    try {
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels)
      const croppedFile = new File([croppedBlob], "cropped-image.png", { type: "image/png" })

      uploadMutation.mutate(
        { data: { file: croppedFile } },
        {
          onSuccess: (response) => {
            if (response.data?.url) {
              onChange(response.data.url)
            }
            setShowCropModal(false)
            setImageSrc(null)
          },
        }
      )
    } catch (error) {
      console.error("Crop failed:", error)
    }
  }, [imageSrc, croppedAreaPixels, onChange, uploadMutation])

  const handleCropCancel = useCallback(() => {
    setShowCropModal(false)
    setImageSrc(null)
  }, [])

  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleClear = useCallback(() => {
    onChange("")
  }, [onChange])

  return (
    <div className="space-y-2">
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
      />
      {value ? (
        <div className={`relative w-full h-20 border border-border overflow-hidden bg-muted group ${cropShape === "round" ? "rounded-full" : "rounded-md"}`}>
          {!imgError ? (
            <img
              src={value}
              alt={label}
              className="w-full h-full object-contain"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
              Không thể tải ảnh
            </div>
          )}
          <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
            <button
              type="button"
              onClick={handleUploadClick}
              disabled={uploadMutation.isPending}
              className="h-7 px-2 flex items-center justify-center rounded-md bg-white text-foreground text-xs disabled:opacity-50"
            >
              {uploadMutation.isPending ? (
                <Loader2 className="w-3 h-3 animate-spin mr-1" />
              ) : (
                <Upload className="w-3 h-3 mr-1" />
              )}
              Thay đổi
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="h-7 px-2 flex items-center justify-center rounded-md bg-white text-foreground text-xs"
            >
              <X className="w-3 h-3 mr-1" />
              Xóa
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleUploadClick}
          disabled={uploadMutation.isPending}
          className="w-full h-20 flex flex-col items-center justify-center gap-1 rounded-md border-2 border-dashed border-border hover:border-primary/50 transition-colors bg-white disabled:opacity-50"
        >
          {uploadMutation.isPending ? (
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          ) : (
            <Upload className="w-5 h-5 text-muted-foreground" />
          )}
          <span className="text-xs text-muted-foreground">
            {uploadMutation.isPending ? "Đang tải..." : "Chọn ảnh"}
          </span>
        </button>
      )}

      {showCropModal && imageSrc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-lg w-[400px] max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-semibold text-sm">Cắt ảnh</h3>
              <Button variant="ghost" size="sm" onClick={handleCropCancel} className="h-8 w-8 p-0">
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex-1 p-4">
              <div className="relative h-[300px] bg-gray-100">
                <Cropper
                  image={imageSrc}
                  crop={cropPosition}
                  zoom={zoom}
                  aspect={1}
                  cropShape={cropShape}
                  onCropChange={setCropPosition}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
              </div>
              <div className="mt-4 space-y-2">
                <Label className="text-xs text-muted-foreground">Zoom</Label>
                <Slider
                  value={[zoom]}
                  onValueChange={(value) => setZoom(value[0])}
                  min={1}
                  max={3}
                  step={0.1}
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 p-4 border-t">
              <Button variant="outline" size="sm" onClick={handleCropCancel}>
                Hủy
              </Button>
              <Button size="sm" onClick={handleCropConfirm} disabled={uploadMutation.isPending}>
                {uploadMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-1" />
                ) : null}
                Xác nhận
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
})
