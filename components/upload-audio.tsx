"use client"

import type React from "react"

import { useState } from "react"
import { X, Music } from "lucide-react"

interface UploadAudioProps {
  onBack: () => void
}

export default function UploadAudio({ onBack }: UploadAudioProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)

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
      if (droppedFile.type.startsWith("audio/")) {
        setFile(droppedFile)
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const removeFile = () => {
    setFile(null)
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
          <h4 className="font-medium mb-1">Audio Upload</h4>

          {file ? (
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                <Music className="w-6 h-6 text-gray-800" />
              </div>
              <p className="text-sm text-gray-600 mb-1">{file.name}</p>
              <p className="text-xs text-gray-400">{Math.round(file.size / 1024)} KB</p>
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
                  <Music className="w-8 h-8 text-gray-800" />
                </div>
                <p className="text-sm font-medium mb-1">Click to upload audio</p>
                <p className="text-xs text-gray-500 mb-4">MP3 up to 10MB</p>

                <input type="file" accept="audio/*" className="hidden" id="audio-upload" onChange={handleFileChange} />
                <label htmlFor="audio-upload" className="cursor-pointer text-sm text-blue-600 hover:text-blue-700">
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
