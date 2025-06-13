"use client"

import { useEffect, useState } from "react"
import Footer from "@/components/footer"
import Logo from "@/components/logo"

export default function LoadingView() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + Math.random() * 10
        return newProgress > 90 ? 90 : newProgress
      })
    }, 300)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col min-h-screen bg-[#fdfdfc]">
      <div className="flex-1 flex flex-col p-4 max-w-md mx-auto w-full">
        {/* Logo */}
        <div className="mb-8 text-center">
          <Logo size="medium" />
        </div>

        {/* Loading animation */}
        <div className="flex flex-col items-center justify-center flex-grow">
          <div className="relative w-20 h-20 mb-6">
            <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
          </div>

          <h3 className="text-xl font-medium text-gray-800 mb-2">Breaking it down...</h3>
          <p className="text-gray-500 text-center mb-8">
            We're analyzing your content and extracting the key information.
          </p>

          <div className="w-full max-w-xs bg-gray-200 rounded-full h-2 mb-1">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300 ease-in-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-400">{Math.round(progress)}% complete</p>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  )
}
