import { create } from "zustand"
import { persist } from "zustand/middleware"

type UserRole = "admin" | "manager" | "agent" | null

interface AuthState {
  userRole: UserRole
  setUserRole: (role: UserRole) => void
  isAdmin: () => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      userRole: null,
      setUserRole: (role) => set({ userRole: role }),
      isAdmin: () => get().userRole === "admin",
    }),
    {
      name: "auth-storage",
    },
  ),
)

