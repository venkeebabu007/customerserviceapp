export type UserRole = "agent" | "manager" | "admin"

export type User = {
  id: string
  auth_user_id: string
  name: string
  email: string
  role: UserRole
  is_active: boolean
  created_at: Date
  updated_at: Date
}

export type Ticket = {
  id: string
  title: string
  description: string
  customerName: string
  customerContact: string
  category: "TechnicalIssue" | "BillingIssue" | "GeneralInquiry"
  priority: "Low" | "Medium" | "High"
  status: "Open" | "InProgress" | "Resolved" | "Escalated"
  assignedAgentId: string | null
  escalated: boolean
  createdAt: Date
  updatedAt: Date
}

export type TicketComment = {
  id: string
  ticketId: string
  userId: string
  comment: string
  createdAt: Date
  isInternal: boolean
}

export const mockUsers: User[] = [
  {
    id: "1",
    auth_user_id: "auth1",
    name: "John Doe",
    email: "john@example.com",
    role: "agent",
    is_active: true,
    created_at: new Date("2023-01-01"),
    updated_at: new Date("2023-01-01"),
  },
  {
    id: "2",
    auth_user_id: "auth2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "manager",
    is_active: true,
    created_at: new Date("2023-01-02"),
    updated_at: new Date("2023-01-02"),
  },
  {
    id: "3",
    auth_user_id: "auth3",
    name: "Alice Johnson",
    email: "alice@example.com",
    role: "admin",
    is_active: true,
    created_at: new Date("2023-01-03"),
    updated_at: new Date("2023-01-03"),
  },
]

export const mockTickets: Ticket[] = [
  {
    id: "1",
    title: "Cannot access account",
    description: "Customer is unable to log in to their account",
    customerName: "Alice Johnson",
    customerContact: "alice@example.com",
    category: "TechnicalIssue",
    priority: "High",
    status: "Open",
    assignedAgentId: "1",
    escalated: false,
    createdAt: new Date("2023-05-01T10:00:00Z"),
    updatedAt: new Date("2023-05-01T10:00:00Z"),
  },
  {
    id: "2",
    title: "Billing discrepancy",
    description: "Customer reports incorrect charges on their latest bill",
    customerName: "Bob Williams",
    customerContact: "bob@example.com",
    category: "BillingIssue",
    priority: "Medium",
    status: "InProgress",
    assignedAgentId: "2",
    escalated: false,
    createdAt: new Date("2023-05-02T14:30:00Z"),
    updatedAt: new Date("2023-05-02T15:45:00Z"),
  },
  {
    id: "3",
    title: "Feature request",
    description: "Customer requesting a new feature for the product",
    customerName: "Charlie Brown",
    customerContact: "charlie@example.com",
    category: "GeneralInquiry",
    priority: "Low",
    status: "Open",
    assignedAgentId: null,
    escalated: false,
    createdAt: new Date("2023-05-03T09:00:00Z"),
    updatedAt: new Date("2023-05-03T09:00:00Z"),
  },
  {
    id: "4",
    title: "Payment issue",
    description: "Customer unable to process payment",
    customerName: "David Wilson",
    customerContact: "david@example.com",
    category: "BillingIssue",
    priority: "High",
    status: "InProgress",
    assignedAgentId: "1",
    escalated: true,
    createdAt: new Date("2023-05-04T11:00:00Z"),
    updatedAt: new Date("2023-05-04T11:30:00Z"),
  },
  {
    id: "5",
    title: "Product defect",
    description: "Customer reporting a defect in the product",
    customerName: "Eva Martinez",
    customerContact: "eva@example.com",
    category: "TechnicalIssue",
    priority: "Medium",
    status: "Open",
    assignedAgentId: "2",
    escalated: false,
    createdAt: new Date("2023-05-05T14:00:00Z"),
    updatedAt: new Date("2023-05-05T14:00:00Z"),
  },
]

export const mockComments: (TicketComment & { user: User })[] = [
  {
    id: "1",
    ticketId: "1",
    userId: "1",
    comment: "Attempted to reset password, but customer still unable to access account.",
    createdAt: new Date("2023-05-01T11:30:00Z"),
    user: mockUsers[0],
    isInternal: false,
  },
  {
    id: "2",
    ticketId: "2",
    userId: "2",
    comment: "Reviewed billing records, found discrepancy. Will process refund.",
    createdAt: new Date("2023-05-02T16:00:00Z"),
    user: mockUsers[1],
    isInternal: true,
  },
]

export type TicketTrend = {
  date: string
  newTickets: number
  resolvedTickets: number
}

export type AgentPerformance = {
  agentId: string
  agentName: string
  ticketsResolved: number
  averageResolutionTime: number
}

export type AuditLog = {
  id: string
  userId: string
  userName: string
  action: "login" | "ticket_update" | "ticket_assignment"
  details: string
  timestamp: Date
}

export const mockTicketTrends: TicketTrend[] = [
  { date: "2023-05-01", newTickets: 10, resolvedTickets: 8 },
  { date: "2023-05-02", newTickets: 15, resolvedTickets: 12 },
  { date: "2023-05-03", newTickets: 8, resolvedTickets: 10 },
  { date: "2023-05-04", newTickets: 12, resolvedTickets: 9 },
  { date: "2023-05-05", newTickets: 18, resolvedTickets: 15 },
]

export const mockAgentPerformance: AgentPerformance[] = [
  { agentId: "1", agentName: "John Doe", ticketsResolved: 45, averageResolutionTime: 2.5 },
  { agentId: "2", agentName: "Jane Smith", ticketsResolved: 52, averageResolutionTime: 2.1 },
  { agentId: "3", agentName: "Alice Johnson", ticketsResolved: 38, averageResolutionTime: 2.8 },
]

export const mockAuditLogs: AuditLog[] = [
  {
    id: "1",
    userId: "1",
    userName: "John Doe",
    action: "login",
    details: "Logged in successfully",
    timestamp: new Date("2023-05-05T09:00:00Z"),
  },
  {
    id: "2",
    userId: "2",
    userName: "Jane Smith",
    action: "ticket_update",
    details: "Updated ticket #1 status to In Progress",
    timestamp: new Date("2023-05-05T10:15:00Z"),
  },
  {
    id: "3",
    userId: "3",
    userName: "Alice Johnson",
    action: "ticket_assignment",
    details: "Assigned ticket #2 to John Doe",
    timestamp: new Date("2023-05-05T11:30:00Z"),
  },
  {
    id: "4",
    userId: "1",
    userName: "John Doe",
    action: "ticket_update",
    details: "Resolved ticket #1",
    timestamp: new Date("2023-05-05T14:45:00Z"),
  },
  {
    id: "5",
    userId: "2",
    userName: "Jane Smith",
    action: "login",
    details: "Logged in successfully",
    timestamp: new Date("2023-05-06T08:30:00Z"),
  },
]

