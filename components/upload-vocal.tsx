"use client"

import { useState, useRef } from "react"
import { X, Mic } from "lucide-react"

interface VoiceRecorderProps {
  onBack: () => void
}

export default function VoiceRecorder({ onBack }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunks = useRef<Blob[]>([])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunks.current = []

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.current.push(event.data)
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunks.current, { type: "audio/webm" })
        const url = URL.createObjectURL(blob)
        setAudioUrl(url)
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error("Microphone access denied", error)
    }
  }

  const stopRecording = () => {
    mediaRecorderRef.current?.stop()
    setIsRecording(false)
  }

  const resetRecording = () => {
    setAudioUrl(null)
    setIsRecording(false)
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
          <h4 className="font-medium mb-4">Voice Recorder</h4>

          {audioUrl ? (
            <div className="flex flex-col items-center space-y-2">
              <audio controls src={audioUrl} className="w-full" />
              <button onClick={resetRecording} className="text-xs text-red-500">
                Delete recording
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <Mic className="w-8 h-8 text-gray-800" />
              </div>

              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`px-4 py-2 text-white rounded-md ${
                  isRecording ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                {isRecording ? "Stop Recording" : "Start Recording"}
              </button>

              <p className="text-xs text-gray-500">Voice will be recorded using your mic</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
