import { createClient } from "@/utils/supabase/server"
import { DashboardCard } from "@/components/DashboardCard"

export const dynamic = "force-dynamic"

async function getTicketCounts() {
  const supabase = createClient()

  const { data: tickets, error } = await supabase.from("tickets_csapp").select("status")

  if (error) {
    console.error("Error fetching tickets:", error)
    return { openTickets: 0, inProgressTickets: 0, resolvedTickets: 0 }
  }

  const openTickets = tickets.filter((ticket) => ticket.status === "Open").length
  const inProgressTickets = tickets.filter((ticket) => ticket.status === "InProgress").length
  const resolvedTickets = tickets.filter((ticket) => ticket.status === "Resolved").length

  return { openTickets, inProgressTickets, resolvedTickets }
}

async function getCurrentUser() {
  const supabase = createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) return null

  const { data: user, error } = await supabase
    .from("users_csapp")
    .select("*")
    .eq("auth_user_id", session.user.id)
    .single()

  if (error) {
    console.error("Error fetching current user:", error)
    return null
  }

  return user
}

export default async function Home() {
  const { openTickets, inProgressTickets, resolvedTickets } = await getTicketCounts()
  const currentUser = await getCurrentUser()

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard title="Open Tickets" count={openTickets} link="/dashboard/tickets?status=open" />
        <DashboardCard title="In Progress" count={inProgressTickets} link="/dashboard/tickets?status=in-progress" />
        <DashboardCard title="Resolved Tickets" count={resolvedTickets} link="/dashboard/tickets?status=resolved" />
      </div>
      {currentUser?.role === "manager" && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">Manager-Specific Features</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>View team performance metrics</li>
            <li>Assign tickets to agents</li>
            <li>Generate reports</li>
          </ul>
        </div>
      )}
      {currentUser?.role === "admin" && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">Admin-Specific Features</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Manage user accounts</li>
            <li>Configure system settings</li>
            <li>View system logs</li>
          </ul>
        </div>
      )}
    </div>
  )
}

