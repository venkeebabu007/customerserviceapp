"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "react-hot-toast"

export default function FileUploadForm({ ticketId }: { ticketId: string }) {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const router = useRouter()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFile = e.target.files[0]
      if (selectedFile && selectedFile.type.startsWith("image/")) {
        setFile(selectedFile)
      } else {
        toast.error("Please select an image file")
        e.target.value = ""
      }
    }
  }

  const handleUpload = async () => {
    const supabase = createClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session || !session.user) {
      toast.error("You must be logged in to upload files")
      return
    }
    if (!file) return

    setIsUploading(true)
    const supabaseClient = createClient()

    const formData = new FormData()
    formData.append("file", file)

    const fileExt = file.name.split(".").pop()
    const fileName = `${Math.random()}.${fileExt}`
    const { error: uploadError } = await supabaseClient.storage
      .from("attachments")
      .upload(`${ticketId}/${fileName}`, file)
    if (uploadError) {
      throw new Error("Error uploading avatar")
    }
    const { error: insertError } = await supabaseClient.from("attachments_csapp").insert({
      ticket_id: ticketId,
      file_name: file.name,
      file_url: `${ticketId}/${fileName}`,
      uploaded_by: session.user.id,
    })

    if (insertError) {
      throw new Error("Error associating the file with the ticket")
    }

    setIsUploading(false)
  }

  return (
    <div className="flex items-center space-x-2">
      <Input type="file" accept="image/*" onChange={handleFileChange} />
      <Button onClick={handleUpload} disabled={!file || isUploading}>
        {isUploading ? "Uploading..." : "Upload"}
      </Button>
    </div>
  )
}

