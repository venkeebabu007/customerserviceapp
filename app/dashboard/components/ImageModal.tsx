"use client"

import { useState } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"

interface ImageModalProps {
  src: string
  alt: string
}

export function ImageModal({ src, alt }: ImageModalProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="cursor-pointer">
          <Image
            src={src || "/placeholder.svg"}
            alt={alt}
            width={100}
            height={100}
            className="rounded-md object-cover"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.svg"
              console.error("Error loading image:", src)
            }}
          />
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] sm:max-h-[80vh]">
        <div className="relative w-full h-full">
          <Image
            src={src || "/placeholder.svg"}
            alt={alt}
            layout="responsive"
            width={800}
            height={600}
            className="object-contain"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.svg"
              console.error("Error loading full-size image:", src)
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}

