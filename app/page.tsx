"use client"

import { useState, useEffect } from "react"
import { BookOpen, Headphones, Plus, ImageIcon, Video, Music, FileText , Mic} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import UploadAudio from "@/components/upload-audio"
import UploadImage from "@/components/upload-image"
import UploadVideo from "@/components/upload-video"
import TextInput from "@/components/text-input"
import VoiceRecorder from "@/components/upload-vocal"
import ResultsView from "@/components/results-view"
import LoadingView from "@/components/loading-view"
import Footer from "@/components/footer"
import Logo from "@/components/logo"
import { GoogleGenAI } from "@google/genai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {video_file} from "@/components/upload-video"

const ai = new GoogleGenAI({ apiKey: "AIzaSyAXdPmONpqOj5ItYG28ICTgyUBFj0wS2Tc" });
const genAI = new GoogleGenerativeAI("AIzaSyAXdPmONpqOj5ItYG28ICTgyUBFj0wS2Tc");
const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro-preview-06-05" });
// save the summary text in a string to export it
export let summaryText: string | null = null;


export default function Home() {
  const [inputValue, setInputValue] = useState("")
  const [textInput, setTextInput] = useState("")
  const [uploadType, setUploadType] = useState<string | null>(null)
  const [showResults, setShowResults] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showMediaMenu, setShowMediaMenu] = useState(false)
  const [contentSource, setContentSource] = useState<"Text" | "URL" | "Image" | "Video" | "YouTube" | "Audio">("Text")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleMediaMenu = () => {
    setShowMediaMenu(!showMediaMenu)
  }

  const handleBreakdown = async () => {

    setIsProcessing(true) 
    const result = await model.generateContent([
        "Please summarize the video in 3 sentences. After the summary, add 2 empty lines and then show in separate paragraphs the keypoints. Each keypoint should be 1-2 sentences. Your output should be a continuous text",
        {
          fileData: {
            fileUri: inputValue,
            mimeType:""
          },
        },
    ]);
    console.log(result.response.text());
    // save the summary text
    summaryText = result.response.text();

    if ((inputValue.trim() && !uploadType) || (uploadType === "text" && textInput.trim()) || uploadType) {
      // Determine the content source
      if (uploadType === "text") {
        setContentSource("Text")
      } else if (uploadType) {
        setContentSource((uploadType.charAt(0).toUpperCase() + uploadType.slice(1)) as any)
      } else if (inputValue.includes("youtube.com") || inputValue.includes("youtu.be")) {
        setContentSource("YouTube")
      } else {
        setContentSource("URL")
      }

      setIsProcessing(true)
      setShowMediaMenu(false)
      // Simulate processing delay
      setTimeout(() => {
        setIsProcessing(false)
        setShowResults(true)
      }, 2000)
    }
  }

  const resetView = () => {
    setInputValue("")
    setTextInput("")
    setUploadType(null)
    setShowResults(false)
    setShowMediaMenu(false)
  }

  if (!mounted) {
    return null // Return nothing during SSR
  }

  if (isProcessing) {
    return <LoadingView />
  }

  if (showResults) {
    return <ResultsView onReset={resetView} source={contentSource} />
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#fdfdfc]">
      <div className="flex-1 flex flex-col p-4 max-w-md mx-auto w-full">
        {/* Logo */}
        <div className="mb-6 text-center">
          <Logo size="medium" />
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col">
          <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Feed us the chaos.
            <br />
            Get the clarity.
          </h3>

          {/* Input options - both inactive */}
          <div className="flex justify-center space-x-4 mb-6">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-100">
              <BookOpen className="w-5 h-5 text-gray-500" />
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-100">
              <Headphones className="w-5 h-5 text-gray-500" />
            </div>
          </div>

           {/* Input area */}
{uploadType === null ? (
  <div className="relative mb-3">
    <Input
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      placeholder="Paste URL and wait"
      className="pr-10 py-6 bg-white border-gray-200 text-black"
    />
    
    {/* Button + Dropdown wrapper */}
    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
      <button
        className="p-2"
        onClick={toggleMediaMenu}
        aria-label="Show media options"
      >
        <Plus className="w-4 h-4 text-gray-400" />
      </button>

      {/* Dropdown */}
      {showMediaMenu && (
        <div className="absolute bottom-full right-2 translate-x-40 mb-2 bg-white shadow-lg rounded-lg border border-gray-100 w-36 z-10">
          <div className="p-1">
            <button
              className="flex items-center space-x-2 w-full p-2 hover:bg-gray-50 rounded"
              onClick={() => {
                setUploadType("text");
                setShowMediaMenu(false);
              }}
            >
              <FileText className="w-5 h-5 text-gray-800" />
              <span className="text-sm">Text</span>
            </button>
            <button
              className="flex items-center space-x-2 w-full p-2 hover:bg-gray-50 rounded"
              onClick={() => {
                setUploadType("audio");
                setShowMediaMenu(false);
              }}
            >
              <Music className="w-5 h-5 text-gray-800" />
              <span className="text-sm">Audio</span>
            </button>
            <button
              className="flex items-center space-x-2 w-full p-2 hover:bg-gray-50 rounded"
              onClick={() => {
                setUploadType("video");
                setShowMediaMenu(false);
              }}
            >
              <Video className="w-5 h-5 text-gray-800" />
              <span className="text-sm">Video</span>
            </button>
            <button
  className="flex items-center space-x-2 w-full p-2 hover:bg-gray-50 rounded"
  onClick={() => {
    setUploadType("record")
    setShowMediaMenu(false)
  }}
>
  <Mic className="w-5 h-5 text-gray-800" />
  <span className="text-sm">Voice</span>
</button>

          </div>
        </div>
      )}
    </div>
  </div>
) : uploadType === "audio" ? (
  <UploadAudio onBack={() => setUploadType(null)} />
) : uploadType === "video" ? (
  <UploadVideo onBack={() => setUploadType(null)} />
) :  uploadType === "record" ? (
  <VoiceRecorder onBack={() => setUploadType(null)} />
) :
(
  <TextInput
    onBack={() => setUploadType(null)}
    onTextChange={setTextInput}
    initialText={textInput}
  />
)}

          {/* Spacer to push button to middle */}
          <div className="flex-grow"></div>

          {/* Action button - positioned in the middle */}
          <Button
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-md py-6 mb-auto"
            onClick={handleBreakdown}
            disabled={isProcessing || (!inputValue && !uploadType) || (uploadType === "text" && !textInput.trim())}
          >
            {isProcessing ? "Processing..." : "Break it down"}
          </Button>

          {/* Spacer to push button to middle */}
          <div className="flex-grow"></div>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  )
}
