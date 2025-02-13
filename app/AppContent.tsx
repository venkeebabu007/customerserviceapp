"use client"

import { useState, useEffect } from "react"
import { TopNavBar } from "@/app/dashboard/components/TopNavBar"
import { AppSidebar } from "@/app/dashboard/components/Sidebar"
import { useTheme } from "@/components/ThemeProvider"
import type { User } from "@/lib/mockData"
import { createClient } from "@/utils/supabase/client"
import type React from "react" // Added import for React

export function AppContent({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (session) {
        const { data: user, error } = await supabase
          .from("users_csapp")
          .select("*")
          .eq("auth_user_id", session.user.id)
          .single()
        if (error) {
          console.error("Error fetching user:", error)
        } else {
          setUser(user)
        }
      }
    }
    fetchUser()
  }, [])

  return (
    <div className={`flex h-screen ${theme}`}>
      {user && <AppSidebar />}
      <div className="flex-grow flex flex-col">
        {user && <TopNavBar user={user} />}
        <main className="flex-grow overflow-auto p-6">{children}</main>
      </div>
    </div>
  )
}

