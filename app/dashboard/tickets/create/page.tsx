"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { toast } from "react-hot-toast"

export default function CreateTicketPage() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [customerName, setCustomerName] = useState("")
  const [customerContact, setCustomerContact] = useState("")
  const [category, setCategory] = useState("TechnicalIssue")
  const [priority, setPriority] = useState("Medium")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [agents, setAgents] = useState<{ id: string; name: string }[]>([])
  const [assignedTo, setAssignedTo] = useState("")
  const router = useRouter()

  useEffect(() => {
    const fetchAgents = async () => {
      const supabase = createClient()
      const { data, error } = await supabase.from("users_csapp").select("id, name").in("role", ["agent", "manager"])
      if (data) setAgents(data)
      if (error) console.error("Error fetching agents:", error)
    }
    fetchAgents()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const supabase = createClient()

    try {
      const { data, error } = await supabase.from("tickets_csapp").insert({
        title,
        description,
        customer_name: customerName,
        customer_contact: customerContact,
        category,
        priority,
        status: "Open",
        assigned_agent_id: assignedTo || null,
      })

      if (error) throw error

      toast.success("Ticket created successfully!")
      router.push("/dashboard/tickets")
    } catch (error) {
      console.error("Error creating ticket:", error)
      toast.error("Failed to create ticket. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Create New Ticket</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            required
          />
        </div>
        <div>
          <Label htmlFor="customerName">Customer Name</Label>
          <Input id="customerName" value={customerName} onChange={(e) => setCustomerName(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="customerContact">Customer Contact</Label>
          <Input
            id="customerContact"
            value={customerContact}
            onChange={(e) => setCustomerContact(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TechnicalIssue">Technical Issue</SelectItem>
              <SelectItem value="BillingIssue">Billing Issue</SelectItem>
              <SelectItem value="GeneralInquiry">General Inquiry</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="priority">Priority</Label>
          <Select value={priority} onValueChange={setPriority}>
            <SelectTrigger>
              <SelectValue placeholder="Select a priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Low">Low</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="High">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="assignedTo">Assign To</Label>
          <Select value={assignedTo} onValueChange={setAssignedTo}>
            <SelectTrigger>
              <SelectValue placeholder="Select an agent" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Unassigned">Unassigned</SelectItem>
              {agents.map((agent) => (
                <SelectItem key={agent.id} value={agent.id}>
                  {agent.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Ticket"}
        </Button>
      </form>
    </div>
  )
}

