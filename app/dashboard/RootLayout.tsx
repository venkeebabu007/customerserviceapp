import type React from "react"
import { AppContent } from "../AppContent"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <AppContent>{children}</AppContent>
}

