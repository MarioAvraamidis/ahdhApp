"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Download, Share2, Volume2, Pause } from "lucide-react"
import Footer from "@/components/footer"
import ClientOnly from "@/components/client-only"
import Logo from "@/components/logo"
import { summaryText } from "@/app/page"
import { title } from "@/app/page"
import { jsPDF } from "jspdf"


interface ResultsViewProps {
  onReset: () => void
  source?: "Text" | "URL" | "Image" | "Video" | "YouTube" | "Audio"
}

export default function ResultsView({ onReset, source = "YouTube" }: ResultsViewProps) {
  const [activeTab, setActiveTab] = useState("summary")
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioProgress, setAudioProgress] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [mounted, setMounted] = useState(false)
  let pars: string[] = []
  if (summaryText) pars = summaryText.split('\n\n\n')
  const title = pars[0];
  const summary = pars[1];
  const keypoints = pars[2]?.split('\n\n') ?? [];

  useEffect(() => {
    setMounted(true)
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis && isPlaying) {
        window.speechSynthesis.cancel()
      }
    }
  }, [isPlaying])

  const handleTextToSpeech = () => {
    if (!mounted) return

    if (isPlaying && audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
      return
    }

    let textToSpeak = ""
    if (activeTab === "summary") {
      const summaryElements = document.querySelectorAll('[data-tab="summary"] p')
      summaryElements.forEach((el) => {
        textToSpeak += el.textContent + " "
      })
    } else if (activeTab === "keypoints") {
      const keypointElements = document.querySelectorAll('[data-tab="keypoints"] p')
      keypointElements.forEach((el) => {
        textToSpeak += el.textContent + " "
      })
    }

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(textToSpeak)
      utterance.rate = 1
      utterance.pitch = 1
      utterance.volume = 1

      utterance.onstart = () => {
        setIsPlaying(true)
      }

      utterance.onend = () => {
        setIsPlaying(false)
        setAudioProgress(0)
      }

      utterance.onboundary = (event) => {
        const progress = (event.charIndex / textToSpeak.length) * 100
        setAudioProgress(progress)
      }

      window.speechSynthesis.speak(utterance)

      audioRef.current = {
        pause: () => {
          window.speechSynthesis.cancel()
        },
      } as HTMLAudioElement
    }
  }

  if (!mounted) return null

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#fdfdfc]">
      <div className="flex flex-col flex-1 w-full h-full px-4 py-3">
        {/* Header */}
        <div className="flex items-center justify-between mb-1">
          <button onClick={onReset} className="flex items-center text-gray-600 p-2">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex justify-center items-center">
            <Logo size="small" />
          </div>
          <div className="p-2 w-6 opacity-0" />
        </div>
  
        {/* Source indicator */}
        <div className="mb-0.5">
          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
            From {source}
          </span>
        </div>
  
        {/* Title */}
        <div className="mb-2">
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        </div>
  
        {/* Tabs */}
        <Tabs defaultValue="summary" className="flex-1 flex flex-col" onValueChange={setActiveTab}>
        <TabsList
  className="inline-flex w-fit mx-auto gap-4 rounded-lg bg-gray-200/80 px-2 py-1"
>
  <TabsTrigger value="summary"  className="px-4">Summary</TabsTrigger>
  <TabsTrigger value="keypoints" className="px-4">Key Points</TabsTrigger>
</TabsList>
  
          <TabsContent
  value="summary"
  data-tab="summary"
  /* full width + full height, add some side padding */
  className="flex-1 w-full h-full overflow-y-auto px-6"
>
  {/* center the block and cap its max width for readability */}
  <div className="w-full max-w-4xl mx-auto bg-gray-30 p-8 rounded-lg">
    <p className="text-gray-900 text-3xl leading-loose font-['Verdana']">
      {summary}
    </p>
  </div>
</TabsContent>

  
          
          
          
          <TabsContent value="keypoints" className="flex-1 overflow-y-auto space-y-3 pr-1" data-tab="keypoints">
  {keypoints.map((point, index) => (
    <div key={index} className="bg-gray-50 p-4 rounded-lg flex items-start">
      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
        <span className="text-white text-xs font-bold">{index + 1}</span>
      </div>
      <p className="text-2xl leading-7 flex flex-wrap font-['Verdana']">
      {point.split(" ").map((word, i) => (
  <span key={i} className="mr-1 flex">
    <span
      /* bold only on every 2nd word (i = 1, 3, 5 …) */
      className={`${i % 2 === 0 ? "font-bold text-gray-900" : "text-gray-900"}`}
    >
      {word.charAt(0)}
    </span>
    <span className="text-gray-900">{word.slice(1)}</span>
  </span>
))}

      </p>
    </div>
  ))}
</TabsContent>

        </Tabs>
  

        {/* Audio progress bar */}
        <ClientOnly>
          {isPlaying && (
            <div className="mb-2">
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-blue-500 h-1.5 rounded-full transition-all duration-300 ease-in-out"
                  style={{ width: `${audioProgress}%` }}
                ></div>
              </div>
            </div>
          )}
        </ClientOnly>
  
        {/* Buttons */}
        <div className="grid grid-cols-2 gap-3 mt-3 mb-1 sticky bottom-0 bg-[#fdfdfc] py-3">
          <Button
            variant="outline"
            className="flex items-center justify-center h-14 py-2 bg-white shadow-sm"
            onClick={handleTextToSpeech}
          >
            {isPlaying ? <Pause className="w-5 h-5 mr-2" /> : <Volume2 className="w-5 h-5 mr-2" />}
            <span>{isPlaying ? "Pause" : "Audio"}</span>
          </Button>
          <Button
            variant="outline"
            className="flex items-center justify-center h-14 py-2 bg-white shadow-sm"
            onClick={() => {
              const doc = new jsPDF()
              const content = summaryText || "No content available"
              const lines = doc.splitTextToSize(content, 180)
              doc.text(lines, 15, 20)
              doc.save("summary.pdf")
            }}
          >
            <Download className="w-5 h-5 mr-2" />
            <span>Save</span>
          </Button>
        </div>
  
        {/* Footer */}
        <Footer />
      </div>
    </div>
  )
}  