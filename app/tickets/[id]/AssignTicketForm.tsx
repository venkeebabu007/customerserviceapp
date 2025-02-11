"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "react-hot-toast"

type Agent = {
  id: string
  name: string
}

export default function AssignTicketForm({
  ticketId,
  agents,
  currentAssignee,
}: {
  ticketId: string
  agents: Agent[]
  currentAssignee: string | null
}) {
  const [assignedTo, setAssignedTo] = useState(currentAssignee || "unassigned")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleAssign = async () => {
    if (assignedTo === currentAssignee) return

    setIsSubmitting(true)
    const supabase = createClient()

    try {
      const { error } = await supabase
        .from("tickets_csapp")
        .update({ assigned_agent_id: assignedTo === "unassigned" ? null : assignedTo })
        .eq("id", ticketId)

      if (error) throw error

      toast.success("Ticket assigned successfully")
      router.refresh()
    } catch (error) {
      console.error("Error assigning ticket:", error)
      toast.error("Failed to assign ticket. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex items-center space-x-2">
      <Select value={assignedTo} onValueChange={setAssignedTo}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Assign to..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="unassigned">Unassigned</SelectItem>
          {agents.map((agent) => (
            <SelectItem key={agent.id} value={agent.id}>
              {agent.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button onClick={handleAssign} disabled={isSubmitting || assignedTo === currentAssignee}>
        {isSubmitting ? "Assigning..." : "Assign"}
      </Button>
    </div>
  )
}

