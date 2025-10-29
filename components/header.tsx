"use client";

import { Button } from "@/components/ui/button";
import { Menu, LogOut } from "lucide-react";

interface HeaderProps {
  user: { email: string; name: string } | null;
  onLogout: () => void;
  onMenuClick: () => void;
}

export function Header({ user, onLogout, onMenuClick }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="p-1.5 rounded-md hover:bg-gray-100 transition-colors lg:hidden"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
        <h1 className="text-lg font-semibold text-gray-900 sm:text-xl">Procurement</h1>
      </div>

      {user && (
        <div className="flex items-center gap-2">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium text-gray-800">{user.name}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
          <Button
            onClick={onLogout}
            variant="ghost"
            size="sm"
            className="flex items-center gap-1.5 text-gray-700 hover:bg-gray-100"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      )}
    </header>
  );
}