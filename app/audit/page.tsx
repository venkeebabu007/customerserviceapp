import { createClient } from "@/utils/supabase/server"
import { Input } from "@/components/ui/input"

export const dynamic = "force-dynamic"

async function getAuditLogs(searchTerm = "") {
  const supabase = createClient()

  let query = supabase
    .from("audit_logs_csapp")
    .select(`
      id,
      user_id,
      action,
      details,
      created_at,
      users_csapp (name, email)
    `)
    .order("created_at", { ascending: false })

  if (searchTerm) {
    query = query.or(
      `action.ilike.%${searchTerm}%,details.ilike.%${searchTerm}%,users_csapp.name.ilike.%${searchTerm}%,users_csapp.email.ilike.%${searchTerm}%`,
    )
  }

  const { data: logs, error } = await query

  if (error) {
    console.error("Error fetching audit logs:", error)
    return []
  }

  return logs.map((log) => ({
    ...log,
    userName: log.users_csapp?.name || log.users_csapp?.email || "Unknown User",
  }))
}

export default async function AuditPage({
  searchParams,
}: {
  searchParams: { search: string }
}) {
  const searchTerm = searchParams.search || ""
  const auditLogs = await getAuditLogs(searchTerm)

  return (
    <div className="space-y-6 max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">Audit Logs</h1>

      <div className="mb-6">
        <form>
          <Input
            type="text"
            name="search"
            placeholder="Search logs..."
            defaultValue={searchTerm}
            className="w-full px-3 py-2 border rounded"
          />
        </form>
      </div>

      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">Timestamp</th>
            <th className="py-3 px-6 text-left">User</th>
            <th className="py-3 px-6 text-left">Action</th>
            <th className="py-3 px-6 text-left">Details</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {auditLogs.map((log) => (
            <tr key={log.id} className="border-b border-gray-200 hover:bg-gray-100">
              <td className="py-3 px-6">{new Date(log.created_at).toLocaleString()}</td>
              <td className="py-3 px-6">{log.userName}</td>
              <td className="py-3 px-6">{log.action.replace("_", " ")}</td>
              <td className="py-3 px-6">{log.details}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {auditLogs.length === 0 && (
        <p className="text-center text-gray-500">
          No audit logs found. Logs will appear here when users perform actions such as logging in.
        </p>
      )}
    </div>
  )
}

