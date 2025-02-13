"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { toast } from "react-hot-toast"

export default function StatusChangeForm({ ticketId, currentStatus }: { ticketId: string; currentStatus: string }) {
  const [status, setStatus] = useState(currentStatus)
  const router = useRouter()

  const validStatuses = ["Open", "InProgress", "Resolved", "Escalated"]

  const handleStatusChange = async (newStatus: string) => {
    if (!validStatuses.includes(newStatus)) {
      console.error("Invalid status:", newStatus)
      return
    }

    const supabase = createClient()

    try {
      const { error } = await supabase.from("tickets_csapp").update({ status: newStatus }).eq("id", ticketId)

      if (error) {
        console.error("Error updating ticket status:", error)
        toast.error("Failed to update ticket status. Please try again.")
      } else {
        setStatus(newStatus)
        toast.success("Ticket status updated successfully")
        router.refresh()
      }
    } catch (error) {
      console.error("Error updating ticket status:", error)
      toast.error("An unexpected error occurred. Please try again.")
    }
  }

  return (
    <div className="flex space-x-2 mb-4">
      <select value={status} onChange={(e) => handleStatusChange(e.target.value)} className="p-2 border rounded">
        <option value="Open">Open</option>
        <option value="InProgress">In Progress</option>
        <option value="Resolved">Resolved</option>
        <option value="Escalated">Escalated</option>
      </select>
    </div>
  )
}

