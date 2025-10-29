"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Dashboard } from "@/components/pages/dashboard"
import { IndentPage } from "@/components/pages/indent-page"
import { POIssuePage } from "@/components/pages/po-issue-page"
import { FollowUpPage } from "@/components/pages/follow-up-page"
import { MaterialReceivingPage } from "@/components/pages/material-receiving-page"
import { WeighmentPage } from "@/components/pages/weighment-page"
import { QCPage } from "@/components/pages/qc-page"
import { MRNPage } from "@/components/pages/mrn-page"
import { BillsPage } from "@/components/pages/bills-page"
import { QCReportPage } from "@/components/pages/qc-report-page"
import { BillEntryPage } from "@/components/pages/bill-entry-page"

interface LayoutProps {
  user: { email: string; name: string } | null
  onLogout: () => void
}

export function Layout({ user, onLogout }: LayoutProps) {
  const [currentPage, setCurrentPage] = useState("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard />
      case "indent":
        return <IndentPage />
      case "po-issue":
        return <POIssuePage />
      case "follow-up":
        return <FollowUpPage />
      case "material-receiving":
        return <MaterialReceivingPage />
      case "weighment":
        return <WeighmentPage />
      case "qc":
        return <QCPage />
      case "mrn":
        return <MRNPage />
      case "bills":
        return <BillsPage />
      case "qc-report":
        return <QCReportPage />
      case "bill-entry":
        return <BillEntryPage />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header user={user} onLogout={onLogout} onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-auto">
          <div className="p-6">{renderPage()}</div>
        </main>
        <footer className="bg-gray-900 text-gray-400 text-center py-3 text-sm">Powered by Botivate</footer>
      </div>
    </div>
  )
}
