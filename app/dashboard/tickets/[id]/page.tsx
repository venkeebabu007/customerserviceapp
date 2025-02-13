import { createClient } from "@/utils/supabase/server"
import { notFound } from "next/navigation"
import AddCommentForm from "../../components/AddCommentForm"
import StatusChangeForm from "./StatusChangeForm"
import AssignTicketForm from "./AssignTicketForm"
import FileUploadForm from "./FileUploadForm"
import EscalateTicketButton from "./EscalateTicketButton"
import TicketAttachments from "@/app/dashboard/components/TicketAttachments"
import CreateTicketPage from "../create/page"

export const dynamic = "force-dynamic"

export default async function TicketPage({ params }: { params: { id: string } }) {
  if (params.id === "create") {
    return <CreateTicketPage />
  }

  const supabase = createClient()

  const { data: ticket, error: ticketError } = await supabase
    .from("tickets_csapp")
    .select(`
    *,
    assigned_agent:users_csapp(id, name)
  `)
    .eq("id", params.id)
    .single()

  if (ticketError || !ticket) {
    console.error("Error fetching ticket:", ticketError)
    notFound()
  }

  const { data: comments, error: commentsError } = await supabase
    .from("comments_csapp")
    .select("*, users_csapp(name)")
    .eq("ticket_id", params.id)
    .order("created_at", { ascending: true })

  if (commentsError) {
    console.error("Error fetching comments:", commentsError)
    return <div>Error loading comments. Please try again later.</div>
  }

  // Fetch the current user's role
  const {
    data: { session },
  } = await supabase.auth.getSession()
  const { data: currentUser } = await supabase
    .from("users_csapp")
    .select("role")
    .eq("auth_user_id", session?.user.id)
    .single()

  const userRole = currentUser?.role

  // Fetch all agents for the assignment dropdown
  const { data: agents } = await supabase.from("users_csapp").select("id, name").in("role", ["agent", "manager"])

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-4">{ticket.title}</h1>
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <p className="mb-2">
          <strong>Status:</strong> {ticket.status}
        </p>
        <p className="mb-2">
          <strong>Priority:</strong> {ticket.priority}
        </p>
        <p className="mb-2">
          <strong>Category:</strong> {ticket.category}
        </p>
        <p className="mb-2">
          <strong>Assigned To:</strong> {ticket.assigned_agent?.name || "Unassigned"}
        </p>
        {(userRole === "manager" || userRole === "admin") && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Assign Ticket</h3>
            <AssignTicketForm
              ticketId={ticket.id}
              agents={agents || []}
              currentAssignee={ticket.assigned_agent?.id || null}
            />
          </div>
        )}
        <p className="mb-4">
          <strong>Description:</strong> {ticket.description}
        </p>

        <div className="space-y-4">
          <StatusChangeForm ticketId={ticket.id} currentStatus={ticket.status} />

          {(userRole === "manager" || userRole === "admin") && !ticket.escalated && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Escalate Ticket</h3>
              <EscalateTicketButton ticketId={ticket.id} />
            </div>
          )}
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">Attachments</h2>
        <FileUploadForm ticketId={ticket.id} />
        <TicketAttachments ticketId={ticket.id} />
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">Comments</h2>
        <AddCommentForm ticketId={ticket.id} />
        <div className="space-y-4 mt-4">
          {comments.map((comment) => {
            if (comment.is_internal && !["agent", "manager", "admin"].includes(userRole)) {
              return null
            }
            return (
              <div
                key={comment.id}
                className={`p-4 rounded-lg ${comment.is_internal ? "bg-yellow-100" : "bg-gray-100"}`}
              >
                <p className="mb-2">{comment.comment}</p>
                <p className="text-sm text-gray-500">
                  By {comment.users_csapp.name} on {new Date(comment.created_at).toLocaleString()}
                  {comment.is_internal && " (Internal)"}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

