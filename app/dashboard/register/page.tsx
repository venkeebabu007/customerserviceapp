"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { mockUsers, type User, type UserRole } from "@/lib/mockData"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "react-hot-toast"

export default function RegisterUserPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [role, setRole] = useState<UserRole>("agent")
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    const userJson = localStorage.getItem("currentUser")
    if (userJson) {
      const user = JSON.parse(userJson)
      setCurrentUser(user)
      if (user.role !== "admin") {
        router.push("/")
      }
    } else {
      router.push("/login")
    }
  }, [router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // In a real application, you would make an API call to register the user
    // For now, we'll just add the user to the mockUsers array
    const newUser: User = {
      id: (mockUsers.length + 1).toString(),
      name,
      email,
      role,
      isActive: true,
      createdAt: new Date(),
    }
    mockUsers.push(newUser)

    // Show success message
    toast.success("User registered successfully")

    // Clear form
    setName("")
    setEmail("")
    setRole("agent")
  }

  if (!currentUser || currentUser.role !== "admin") {
    return null // or you could return an "Access Denied" message
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Register New User</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="role">Role</Label>
          <Select value={role} onValueChange={(value: UserRole) => setRole(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="agent">Agent</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button type="submit">Register User</Button>
      </form>
    </div>
  )
}

