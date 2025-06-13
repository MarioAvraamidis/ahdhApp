import Image from "next/image"

interface LogoProps {
  size?: "small" | "medium" | "large"
}

export default function Logo({ size = "medium" }: LogoProps) {
  // Define sizes for different variants
  const sizes = {
    small: { width: 150, height: 50 },
    medium: { width: 225, height: 75 },
    large: { width: 300, height: 100 },
  }

  const { width, height } = sizes[size]

  return (
    <div className="flex justify-center">
      <Image
        src="/images/adhd-logo-new.png"
        alt="ADHD Break It Down Logo"
        width={width}
        height={height}
        priority
        className="h-auto"
      />
    </div>
  )
}
