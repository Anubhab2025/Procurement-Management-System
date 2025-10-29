"use client"

import { Button } from "@/components/ui/button"
import { Menu, LogOut } from "lucide-react"

interface HeaderProps {
  user: { email: string; name: string } | null
  onLogout: () => void
  onMenuClick: () => void
}

export function Header({ user, onLogout, onMenuClick }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden">
          <Menu size={20} />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Procurement Management System</h1>
      </div>

      <div className="flex items-center gap-4">
        {user && (
          <>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
            <Button onClick={onLogout} variant="outline" className="flex items-center gap-2 bg-transparent">
              <LogOut size={18} />
              Logout
            </Button>
          </>
        )}
      </div>
    </header>
  )
}
