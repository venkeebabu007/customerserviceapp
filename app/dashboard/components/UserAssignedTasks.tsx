"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
import Link from "next/link"
import type { User } from "@/lib/database.types"
import { useRouter } from "next/navigation"

type Ticket = {
  id: string
  title: string
  status: string
  priority: string
}

export default function UserAssignedTasks() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [assignedTickets, setAssignedTickets] = useState<Ticket[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchUserAndTickets = async () => {
      const supabase = createClient()
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session) {
          const { data: user, error: userError } = await supabase
            .from("users_csapp")
            .select("*")
            .eq("auth_user_id", session.user.id)
            .single()

          if (userError) throw userError

          setCurrentUser(user as User)

          const { data: tickets, error: ticketsError } = await supabase
            .from("tickets_csapp")
            .select("id, title, status, priority")
            .eq("assigned_agent_id", user.id)
            .order("created_at", { ascending: false })
            .limit(5)

          if (ticketsError) throw ticketsError

          setAssignedTickets(tickets as Ticket[])
        } else {
          // If there's no session, redirect to login page
          router.push("/login")
        }
      } catch (err) {
        console.error("Error fetching data:", err)
        setError("Failed to load assigned tickets. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserAndTickets()

    // Set up a listener for auth state changes
    const supabase = createClient()
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        setCurrentUser(null)
        setAssignedTickets([])
        router.push("/login")
      }
    })

    // Cleanup the listener on component unmount
    return () => {
      subscription.unsubscribe()
    }
  }, [router])

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>{error}</div>

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-6">
      <h2 className="text-xl font-semibold mb-4">Your Assigned Tickets</h2>
      {assignedTickets.length > 0 ? (
        <ul className="space-y-2">
          {assignedTickets.map((ticket) => (
            <li key={ticket.id} className="flex justify-between items-center border-b pb-2">
              <Link href={`/dashboard/tickets/${ticket.id}`} className="text-blue-600 hover:underline">
                {ticket.title}
              </Link>
              <div className="flex space-x-2">
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    ticket.priority === "High"
                      ? "bg-red-100 text-red-800"
                      : ticket.priority === "Medium"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                  }`}
                >
                  {ticket.priority}
                </span>
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    ticket.status === "Open"
                      ? "bg-blue-100 text-blue-800"
                      : ticket.status === "InProgress"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {ticket.status}
                </span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No tickets assigned to you at the moment.</p>
      )}
    </div>
  )
}

