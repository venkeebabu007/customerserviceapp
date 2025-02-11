"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { toast } from "react-hot-toast"

export default function EscalateTicketButton({ ticketId }: { ticketId: string }) {
  const [isEscalating, setIsEscalating] = useState(false)
  const router = useRouter()

  const handleEscalate = async () => {
    setIsEscalating(true)
    const supabase = createClient()

    try {
      const { error } = await supabase
        .from("tickets_csapp")
        .update({ escalated: true, status: "Escalated" })
        .eq("id", ticketId)

      if (error) throw error

      toast.success("Ticket escalated successfully")
      router.refresh()
    } catch (error) {
      console.error("Error escalating ticket:", error)
      toast.error("Failed to escalate ticket. Please try again.")
    } finally {
      setIsEscalating(false)
    }
  }

  return (
    <Button onClick={handleEscalate} disabled={isEscalating} variant="destructive">
      {isEscalating ? "Escalating..." : "Escalate Ticket"}
    </Button>
  )
}

