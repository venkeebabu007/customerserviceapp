import { createClient } from "@/utils/supabase/server"
import ReportsCharts from "../components/ReportsCharts"

export const dynamic = "force-dynamic"

async function getTicketData() {
  const supabase = createClient()

  const { data: tickets, error } = await supabase
    .from("tickets_csapp")
    .select("*")
    .order("created_at", { ascending: true })

  if (error) {
    console.error("Error fetching tickets:", error)
    return []
  }

  return tickets
}

async function getAgentPerformance() {
  const supabase = createClient()

  const { data: agents, error } = await supabase.from("users_csapp").select("id, name").in("role", ["agent", "manager"])

  if (error) {
    console.error("Error fetching agents:", error)
    return []
  }

  const agentPerformance = await Promise.all(
    agents.map(async (agent) => {
      const { data: resolvedTickets, error: ticketError } = await supabase
        .from("tickets_csapp")
        .select("*")
        .eq("assigned_agent_id", agent.id)
        .eq("status", "Resolved")

      if (ticketError) {
        console.error(`Error fetching tickets for agent ${agent.id}:`, ticketError)
        return null
      }

      const ticketsResolved = resolvedTickets.length
      const totalResolutionTime = resolvedTickets.reduce((sum, ticket) => {
        const createdAt = new Date(ticket.created_at)
        const updatedAt = new Date(ticket.updated_at)
        return sum + (updatedAt.getTime() - createdAt.getTime()) / (1000 * 60 * 60) // Convert to hours
      }, 0)

      const averageResolutionTime = ticketsResolved > 0 ? totalResolutionTime / ticketsResolved : 0

      return {
        agentId: agent.id,
        agentName: agent.name,
        ticketsResolved,
        averageResolutionTime,
      }
    }),
  )

  return agentPerformance.filter(Boolean)
}

export default async function ReportsPage() {
  const tickets = await getTicketData()
  const agentPerformance = await getAgentPerformance()

  const ticketTrends = tickets.reduce((acc: Record<string, any>, ticket) => {
    const date = new Date(ticket.created_at).toISOString().split("T")[0]
    if (!acc[date]) {
      acc[date] = { date, newTickets: 0, resolvedTickets: 0 }
    }
    acc[date].newTickets++
    if (ticket.status === "Resolved") {
      acc[date].resolvedTickets++
    }
    return acc
  }, {})

  const chartData = Object.values(ticketTrends)
  const unresolvedTickets = tickets.filter((ticket) => ticket.status !== "Resolved").length

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Reports & Analytics</h1>
      <ReportsCharts chartData={chartData} agentPerformance={agentPerformance} unresolvedTickets={unresolvedTickets} />
    </div>
  )
}

