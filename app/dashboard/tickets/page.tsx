import { createClient } from "@/utils/supabase/server"
import { DashboardCard } from "@/components/DashboardCard"



import Link from "next/link"
import { Button } from "@/components/ui/button"
import UserAssignedTasks from "../components/UserAssignedTasks"
import AllAttachments from "../components/AllAttachments"

export const dynamic = "force-dynamic"

export default async function TicketsPage() {
  const supabase = createClient()

  const { data: tickets, error } = await supabase
    .from("tickets_csapp")
    .select(`
    *,
    assigned_agent:users_csapp(name)
  `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching tickets:", error)
    return <div>Error loading tickets. Please try again later.</div>
  }

  return (
    <div className="space-y-6">
      <UserAssignedTasks />
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">All Tickets</h1>
        <Link href="/dashboard/tickets/create">
          <Button>Create New Ticket</Button>
        </Link>
      </div>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  ID
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Title
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Priority
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Category
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Assigned To
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{ticket.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ticket.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ticket.status}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ticket.priority}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ticket.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {ticket.assigned_agent ? ticket.assigned_agent.name : "Unassigned"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link href={`/tickets/${ticket.id}`} className="text-indigo-600 hover:text-indigo-900 mr-2">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
     
    </div>
  )
}

