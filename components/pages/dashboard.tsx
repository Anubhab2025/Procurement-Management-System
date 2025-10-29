"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useProcurement } from "@/contexts/procurement-context"

export function Dashboard() {
  const { getRecordsByStage, records } = useProcurement()

  const totalPOs = getRecordsByStage("po").length
  const pendingIndents = getRecordsByStage("indent", "Pending").length
  const pendingQC = getRecordsByStage("weighment", "Verified").length
  const pendingBills = getRecordsByStage("bills", "Bill Pending").length

  const stats = [
    { label: "Total POs", value: String(totalPOs), color: "bg-blue-100 text-blue-900" },
    { label: "Pending Indents", value: String(pendingIndents), color: "bg-yellow-100 text-yellow-900" },
    { label: "Pending QC", value: String(pendingQC), color: "bg-orange-100 text-orange-900" },
    { label: "Pending Bills", value: String(pendingBills), color: "bg-red-100 text-red-900" },
  ]

  const recent = [...records]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6)
    .map((r, idx) => ({
      id: idx,
      action: `${r.stage.toUpperCase()} - ${r.status}`,
      details: `${r.poNo} - ${r.materialName} (${r.supplierName})`,
      time: new Date(r.createdAt).toLocaleString(),
    }))

  const alerts: { type: "warning" | "danger" | "info"; message: string }[] = []
  if (pendingQC > 0) alerts.push({ type: "warning", message: `QC pending for ${pendingQC} material(s)` })
  if (pendingBills > 0) alerts.push({ type: "danger", message: `Bills submission pending: ${pendingBills}` })

  const today = new Date().toISOString().split("T")[0]
  const delayed = records.filter((r) => r.deliveryDate && r.deliveryDate < today && r.stage !== "mrn").length
  if (delayed > 0) alerts.push({ type: "info", message: `Delivery delay alerts: ${delayed}` })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h2>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <Card key={idx} className={`p-6 ${stat.color}`}>
            <p className="text-sm font-medium opacity-75">{stat.label}</p>
            <p className="text-3xl font-bold mt-2">{stat.value}</p>
          </Card>
        ))}
      </div>

      
      {/* Alerts */}
      {alerts.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h3>
          <div className="space-y-3">
            {alerts.map((alert, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg ${
                  alert.type === "warning"
                    ? "bg-yellow-50 text-yellow-800 border border-yellow-200"
                    : alert.type === "danger"
                      ? "bg-red-50 text-red-800 border border-red-200"
                      : "bg-blue-50 text-blue-800 border border-blue-200"
                }`}
              >
                {alert.message}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Recent Activities */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
        <div className="space-y-4">
          {recent.map((activity) => (
            <div key={activity.id} className="flex items-start gap-4 pb-4 border-b border-gray-200 last:border-0">
              <div className="flex-1">
                <p className="font-medium text-gray-900">{activity.action}</p>
                <p className="text-sm text-gray-600">{activity.details}</p>
              </div>
              <p className="text-xs text-gray-500 whitespace-nowrap">{activity.time}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
