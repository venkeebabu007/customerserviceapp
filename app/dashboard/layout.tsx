"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import type { User } from "../../lib/mockData"
import { Toaster } from "react-hot-toast"
import "../globals.css"
import type React from "react"
import { AppSidebar } from "./components/Sidebar"
import { TopNavBar } from "./components/TopNavBar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { createClient } from "@/utils/supabase/client"
import { ThemeProvider } from "@/components/ThemeProvider"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient()
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession()

        if (sessionError) throw sessionError

        if (session) {
          const { data: user, error: userError } = await supabase
            .from("users_csapp")
            .select("*")
            .eq("auth_user_id", session.user.id)
            .single()

          if (userError) throw userError

          if (user) {
            setCurrentUser(user as User)
            if (window.location.pathname === "/login") {
              router.push("/")
            }
          } else {
            throw new Error("User not found in users_csapp table")
          }
        } else {
          setCurrentUser(null)
          if (window.location.pathname !== "/login") {
            router.push("/login")
          }
        }
      } catch (error) {
        console.error("Authentication error:", error)
        await supabase.auth.signOut()
        setCurrentUser(null)
        router.push("/login")
      }
    }

    checkUser().finally(() => setIsLoading(false))
  }, [router])

  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <SidebarProvider>
            <Toaster position="top-right" />
            {isLoading ? (
              <div className="flex items-center justify-center min-h-screen">
                <p>Loading...</p>
              </div>
            ) : currentUser ? (
              <div className="flex min-h-screen w-full">
                <AppSidebar />
                <div className="flex flex-col flex-1">
                  <TopNavBar user={currentUser} />
                  <main className="flex-1 bg-gray-100 dark:bg-gray-900 p-4">{children}</main>
                </div>
              </div>
            ) : (
              <div className="min-h-screen bg-gray-100 dark:bg-gray-900 w-full">{children}</div>
            )}
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

