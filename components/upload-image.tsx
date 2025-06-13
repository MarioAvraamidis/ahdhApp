"use client"

import type React from "react"

import { useState } from "react"
import { X, ImageIcon } from "lucide-react"

interface UploadImageProps {
  onBack: () => void
}

export default function UploadImage({ onBack }: UploadImageProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0]
      if (droppedFile.type.startsWith("image/")) {
        setFile(droppedFile)
        const reader = new FileReader()
        reader.onload = () => {
          setPreview(reader.result as string)
        }
        reader.readAsDataURL(droppedFile)
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      setFile(selectedFile)

      const reader = new FileReader()
      reader.onload = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  const removeFile = () => {
    setFile(null)
    setPreview(null)
  }

  return (
    <div className="mb-3 relative">
      <div className="absolute top-0 right-0 p-2">
        <button className="rounded-full bg-gray-100 p-1" onClick={onBack}>
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-md p-6">
        <div className="text-center">
          <h4 className="font-medium mb-1">Image Upload</h4>

          {preview ? (
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 mb-2 overflow-hidden rounded-lg">
                <img src={preview || "/placeholder.svg"} alt="Preview" className="w-full h-full object-cover" />
              </div>
              <p className="text-sm text-gray-600 mb-1">{file?.name}</p>
              <p className="text-xs text-gray-400">{file ? Math.round(file.size / 1024) : 0} KB</p>
              <button onClick={removeFile} className="mt-2 text-xs text-red-500">
                Remove
              </button>
            </div>
          ) : (
            <div
              className={`border-2 border-dashed rounded-lg p-8 mt-2 transition-colors ${
                isDragging ? "border-blue-500 bg-blue-50" : "border-gray-200"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <ImageIcon className="w-8 h-8 text-gray-800" />
                </div>
                <p className="text-sm font-medium mb-1">Click to upload image</p>
                <p className="text-xs text-gray-500 mb-4">JPG, PNG up to 5MB</p>

                <input type="file" accept="image/*" className="hidden" id="image-upload" onChange={handleFileChange} />
                <label htmlFor="image-upload" className="cursor-pointer text-sm text-blue-600 hover:text-blue-700">
                  Browse files
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
