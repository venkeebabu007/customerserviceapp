"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { mockUsers, type User } from "../../../lib/mockData"
import { Button } from "@/components/ui/button"

export default function AdminDashboardPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    const userJson = localStorage.getItem("currentUser")
    if (userJson) {
      const user = JSON.parse(userJson)
      setCurrentUser(user)
      if (user.role !== "admin" && user.role !== "manager") {
        router.push("/")
      }
    } else {
      router.push("/login")
    }
  }, [router])

  if (!currentUser || (currentUser.role !== "admin" && currentUser.role !== "manager")) {
    return null
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">User Management</h2>
          <Link href="/users/register">
            <Button>Register New User</Button>
          </Link>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">System Statistics</h2>
          <p>Total Users: {mockUsers.length}</p>
          <p>Active Users: {mockUsers.filter((user) => user.isActive).length}</p>
        </div>
      </div>
    </div>
  )
}

