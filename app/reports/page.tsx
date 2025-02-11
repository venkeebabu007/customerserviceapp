import { createClient } from "@/utils/supabase/server"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

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

  const ticketTrends = tickets.reduce((acc, ticket) => {
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

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Ticket Trends</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="newTickets" fill="#8884d8" name="New Tickets" />
            <Bar dataKey="resolvedTickets" fill="#82ca9d" name="Resolved Tickets" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Agent Performance</h2>
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Agent Name</th>
              <th className="py-3 px-6 text-left">Tickets Resolved</th>
              <th className="py-3 px-6 text-left">Avg. Resolution Time (hours)</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {agentPerformance.map((agent) => (
              <tr key={agent.agentId} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6">{agent.agentName}</td>
                <td className="py-3 px-6">{agent.ticketsResolved}</td>
                <td className="py-3 px-6">{agent.averageResolutionTime.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Unresolved Tickets</h2>
        <p className="text-4xl font-bold text-red-500">{unresolvedTickets}</p>
      </div>
    </div>
  )
}

