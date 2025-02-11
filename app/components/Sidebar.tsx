"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, TicketIcon, BarChart2, FileText, Settings, Menu, UserPlus, ShieldAlert } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { useSidebar } from "@/components/ui/sidebar"
import { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"

const menuItems = [
  { icon: Home, label: "Dashboard", href: "/" },
  { icon: TicketIcon, label: "Tickets", href: "/tickets" },
  { icon: BarChart2, label: "Reports", href: "/reports" },
  { icon: FileText, label: "Audit Logs", href: "/audit" },
  { icon: Settings, label: "Settings", href: "/settings" },
  { icon: ShieldAlert, label: "Admin Dashboard", href: "/admin/dashboard", adminOnly: true },
  { icon: UserPlus, label: "Add Users", href: "/admin/add-users", adminOnly: true },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { toggleSidebar } = useSidebar()
  const [userRole, setUserRole] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserRole = async () => {
      const supabase = createClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (session) {
        const { data: user } = await supabase
          .from("users_csapp")
          .select("role")
          .eq("auth_user_id", session.user.id)
          .single()
        if (user) {
          setUserRole(user.role)
        }
      }
    }
    fetchUserRole()
  }, [])

  return (
    <Sidebar className="border-r border-gray-200">
      <SidebarHeader className="flex items-center justify-between px-4 py-2">
        <span className="text-xl font-bold">CS App</span>
        <SidebarTrigger onClick={toggleSidebar}>
          <Menu className="h-6 w-6" />
        </SidebarTrigger>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => {
            if (item.adminOnly && userRole !== "admin") {
              return null
            }
            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50",
                      pathname === item.href && "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50",
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4 text-xs text-gray-500">© 2025 CS App Inc.</SidebarFooter>
    </Sidebar>
  )
}

