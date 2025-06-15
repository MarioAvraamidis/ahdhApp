"use client"

import type React from "react"

import { useState } from "react"
import { X, FileText } from "lucide-react"

interface TextInputProps {
  onBack: () => void
  onTextChange: (text: string) => void
  initialText?: string
}
export let textSummary : string | null = null;
export default function TextInput({ onBack, onTextChange, initialText = "" }: TextInputProps) {
  const [text, setText] = useState(initialText)

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value
    textSummary = newText;
    setText(newText)
    onTextChange(newText)
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
          <h4 className="font-medium mb-1">Text Input</h4>

          <div className="flex flex-col items-center mt-3">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-gray-800" />
            </div>

            <textarea
              value={text}
              onChange={handleTextChange}
              placeholder="Paste or type your text here..."
              className="w-full h-32 p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
