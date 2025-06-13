"use client"

import { useEffect, useState } from "react"

export default function Footer() {
  // Use a static string for initial render to avoid hydration mismatch
  const [year, setYear] = useState("2025")

  useEffect(() => {
    // Update the year on the client side only
    setYear(new Date().getFullYear().toString())
  }, [])

  return (
    <footer className="py-3 text-center text-xs text-gray-500 mt-auto">
      © {year} ADHD Break It Down. All rights reserved.
    </footer>
  )
}
