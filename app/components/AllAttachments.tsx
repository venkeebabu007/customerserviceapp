"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
import { Loader2 } from "lucide-react"
import { ImageModal } from "./ImageModal"

interface Attachment {
  id: string
  ticket_id: string
  file_name: string
  file_url: string
  created_at: string
  publicUrl: string
}

export default function AllAttachments() {
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchAttachments() {
      const supabase = createClient()

      try {
        // Fetch all attachments from the attachments_csapp table
        const { data, error } = await supabase
          .from("attachments_csapp")
          .select("*")
          .order("created_at", { ascending: false })

        if (error) {
          throw error
        }

        if (data) {
          const attachmentPromises = data.map(async (attachment) => {
            const { data: urlData } = supabase.storage.from("attachments").getPublicUrl(attachment.file_url)

            return {
              ...attachment,
              publicUrl: urlData.publicUrl,
            }
          })

          const attachmentData = await Promise.all(attachmentPromises)
          setAttachments(attachmentData)
        }
      } catch (error) {
        console.error("Error fetching attachments:", error)
        setError("Failed to load attachments. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchAttachments()
  }, [])

  if (isLoading) {
    return <Loader2 className="w-6 h-6 animate-spin" />
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  if (attachments.length === 0) {
    return <div>No attachments found.</div>
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {attachments.map((attachment) => (
        <div key={attachment.id} className="flex flex-col items-center">
          <ImageModal src={attachment.publicUrl || "/placeholder.svg"} alt={attachment.file_name} />
          <div className="mt-2 text-center">
            <p className="text-sm font-medium text-gray-900 truncate">{attachment.file_name}</p>
            <p className="text-xs text-gray-500">Ticket ID: {attachment.ticket_id}</p>
            <p className="text-xs text-gray-500">{new Date(attachment.created_at).toLocaleString()}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

