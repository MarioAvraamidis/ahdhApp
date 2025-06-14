"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Download, Share2, Volume2, Pause } from "lucide-react"
import Footer from "@/components/footer"
import ClientOnly from "@/components/client-only"
import Logo from "@/components/logo"
import { summaryText } from "@/app/page"

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
  let pars: string[] = [];
  if (summaryText)
    pars = summaryText.split('\n\n');
  const summary = pars[0];         // First paragraph is the summary
  const keypoints = pars.slice(1); // The rest are keypoints

  useEffect(() => {
    setMounted(true)
    return () => {
      // Clean up speech synthesis if component unmounts while playing
      if (typeof window !== "undefined" && window.speechSynthesis && isPlaying) {
        window.speechSynthesis.cancel()
      }
    }
  }, [isPlaying])

  // Function to handle text-to-speech
  const handleTextToSpeech = () => {
    if (!mounted) return

    if (isPlaying && audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
      return
    }

    // Get the text content from the active tab
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

    // Use the Web Speech API for text-to-speech
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(textToSpeak)
      utterance.rate = 1
      utterance.pitch = 1
      utterance.volume = 1

      // Set up event handlers
      utterance.onstart = () => {
        setIsPlaying(true)
      }

      utterance.onend = () => {
        setIsPlaying(false)
        setAudioProgress(0)
      }

      // Update progress
      utterance.onboundary = (event) => {
        const progress = (event.charIndex / textToSpeak.length) * 100
        setAudioProgress(progress)
      }

      window.speechSynthesis.speak(utterance)

      // Store reference to control playback
      audioRef.current = {
        pause: () => {
          window.speechSynthesis.cancel()
        },
      } as HTMLAudioElement
    }
  }

  if (!mounted) {
    return null // Return nothing during SSR
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#fdfdfc]">
      <div className="flex-1 flex flex-col p-4 max-w-md mx-auto w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={onReset} className="flex items-center text-gray-600 p-2">
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex justify-center items-center">
            <Logo size="small" />
          </div>

          <button className="text-gray-600 p-2">
            <Share2 className="w-5 h-5" />
          </button>
        </div>

        {/* Source indicator */}
        <div className="mb-2">
          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
            From {source}
          </span>
        </div>

        {/* Content title */}
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-800">Understanding ADHD Symptoms</h2>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="summary" className="mb-4" onValueChange={setActiveTab}>
          <TabsList className="flex justify-center gap-4 mb-4">
          <TabsTrigger value="summary" className="px-4">Summary</TabsTrigger>
          <TabsTrigger value="keypoints" className="px-4">Key Points</TabsTrigger>

          </TabsList>

          <TabsContent value="summary" className="space-y-3" data-tab="summary">
            <div className="bg-gray-30 p-4 rounded-lg">
              <p className="text-gray-500 text-sm">
                 {summaryText}
              </p>
            </div>
          </TabsContent>


          <TabsContent value="keypoints" className="space-y-3" data-tab="keypoints">
            {keypoints.map((point, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg flex items-start">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                  <span className="text-white text-xs font-bold">{index + 1}</span>
                </div>
                <p className="text-gray-800 text-sm">{point}</p>
              </div>
            ))}
          </TabsContent>


          {/* <TabsContent value="summary" className="space-y-3" data-tab="summary">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-800 text-sm">
                 {summaryText}
              </p>
            </div>
          </TabsContent>

          <TabsContent value="keypoints" className="space-y-3" data-tab="keypoints">
            <div className="bg-gray-50 p-4 rounded-lg flex items-start">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                <span className="text-white text-xs font-bold">1</span>
              </div>
              <p className="text-gray-800 text-sm">
                ADHD affects approximately 4-5% of adults and 5-7% of children worldwide.
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg flex items-start">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                <span className="text-white text-xs font-bold">2</span>
              </div>
              <p className="text-gray-800 text-sm">
                Executive functions affected include working memory, self-regulation, organization, and time management.
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg flex items-start">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                <span className="text-white text-xs font-bold">3</span>
              </div>
              <p className="text-gray-800 text-sm">
                ADHD often co-occurs with other conditions like anxiety, depression, and learning disabilities.
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg flex items-start">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                <span className="text-white text-xs font-bold">4</span>
              </div>
              <p className="text-gray-800 text-sm">
                Diagnosis requires symptoms to be present for at least 6 months and to significantly impact daily
                functioning.
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg flex items-start">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                <span className="text-white text-xs font-bold">5</span>
              </div>
              <p className="text-gray-800 text-sm">
                Hyperfocus is a lesser-known symptom where individuals can focus intensely on activities they find
                interesting.
              </p>
            </div>
          </TabsContent> */}

        </Tabs>

        {/* Audio progress bar (only visible when audio is playing) */}
        <ClientOnly>
          {isPlaying && (
            <div className="mb-4">
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-blue-500 h-1.5 rounded-full transition-all duration-300 ease-in-out"
                  style={{ width: `${audioProgress}%` }}
                ></div>
              </div>
            </div>
          )}
        </ClientOnly>

        {/* Action buttons - only Audio and Save */}
        <div className="grid grid-cols-2 gap-3 mt-auto sticky bottom-4">
          <Button
            variant="outline"
            className="flex items-center justify-center h-14 py-2 bg-white shadow-sm"
            onClick={handleTextToSpeech}
          >
            {isPlaying ? <Pause className="w-5 h-5 mr-2" /> : <Volume2 className="w-5 h-5 mr-2" />}
            <span>{isPlaying ? "Pause" : "Audio"}</span>
          </Button>
          <Button variant="outline" className="flex items-center justify-center h-14 py-2 bg-white shadow-sm">
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
