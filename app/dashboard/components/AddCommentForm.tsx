"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { toast } from "react-hot-toast"

export default function AddCommentForm({ ticketId }: { ticketId: string }) {
  const [comment, setComment] = useState("")
  const [isInternal, setIsInternal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const supabase = createClient()

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()
      if (authError) throw authError

      if (!user || !user.email) {
        throw new Error("No authenticated user found")
      }

      const { data: userData, error: userError } = await supabase
        .from("users_csapp")
        .select("id")
        .eq("email", user.email)
        .single()

      if (userError) throw userError
      if (!userData) throw new Error("User not found in users_csapp table")

      const { error: commentError } = await supabase.from("comments_csapp").insert({
        ticket_id: ticketId,
        user_id: userData.id,
        comment: comment,
        is_internal: isInternal,
      })

      if (commentError) throw commentError

      setComment("")
      setIsInternal(false)
      toast.success(isInternal ? "Internal comment added" : "Comment added")
      router.refresh()
    } catch (error) {
      console.error("Error adding comment:", error)
      toast.error("Failed to add comment. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <Textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="w-full p-2 border rounded-md"
        rows={3}
        placeholder="Add a comment..."
        required
      />
      <div className="flex items-center mt-2">
        <Checkbox id="internal" checked={isInternal} onCheckedChange={(checked) => setIsInternal(checked as boolean)} />
        <Label htmlFor="internal" className="ml-2">
          Internal Comment
        </Label>
        <Button type="submit" className="ml-auto" disabled={isSubmitting}>
          {isSubmitting ? "Adding..." : "Add Comment"}
        </Button>
      </div>
    </form>
  )
}

