"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Package, Clock, FileText, AlertTriangle } from "lucide-react";
import { useProcurement } from "@/contexts/procurement-context";
import { format } from "date-fns";

export function Dashboard() {
  const { getRecordsByStage, records } = useProcurement();

  const totalPOs = getRecordsByStage("po").length;
  const pendingIndents = getRecordsByStage("indent", "Pending").length;
  const pendingQC = getRecordsByStage("weighment", "Verified").length;
  const pendingBills = getRecordsByStage("bills", "Bill Pending").length;

  const stats = [
    { label: "Total POs", value: totalPOs, icon: Package, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Pending Indents", value: pendingIndents, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "QC Pending", value: pendingQC, icon: AlertCircle, color: "text-orange-600", bg: "bg-orange-50" },
    { label: "Bills Pending", value: pendingBills, icon: FileText, color: "text-red-600", bg: "bg-red-50" },
  ];

  const recent = [...records]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6)
    .map((r) => ({
      stage: r.stage.toUpperCase(),
      status: r.status,
      poNo: r.poNo,
      material: r.materialName,
      supplier: r.supplierName,
      time: format(new Date(r.createdAt), "MMM d, h:mm a"),
    }));

  const today = new Date().toISOString().split("T")[0];
  const delayed = records.filter(
    (r) => r.deliveryDate && r.deliveryDate < today && r.stage !== "mrn"
  ).length;

  const alerts = [];
  if (pendingQC > 0) alerts.push({ type: "warning", icon: AlertCircle, message: `${pendingQC} QC pending` });
  if (pendingBills > 0) alerts.push({ type: "danger", icon: FileText, message: `${pendingBills} bills pending` });
  if (delayed > 0) alerts.push({ type: "info", icon: AlertTriangle, message: `${delayed} delayed delivery(ies)` });

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Dashboard</h1>
        <Badge variant="secondary" className="hidden sm:inline-flex">
          {format(new Date(), "EEEE, MMMM d")}
        </Badge>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4 sm:gap-4">
        {stats.map((stat, i) => (
          <Card
            key={i}
            className="group relative overflow-hidden border-0 shadow-sm hover:shadow-md transition-all duration-200"
          >
            <div className="p-4 sm:p-5">
              <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${stat.bg} mb-3`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">{stat.label}</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
            </div>
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-0 group-hover:opacity-20 transition-opacity" />
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Alerts */}
        {alerts.length > 0 && (
          <Card className="lg:col-span-1 p-4 sm:p-5 border-0 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Alerts
            </h3>
            <div className="space-y-2">
              {alerts.map((alert, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-2 p-2.5 rounded-md text-xs font-medium ${
                    alert.type === "warning"
                      ? "bg-amber-50 text-amber-800"
                      : alert.type === "danger"
                      ? "bg-red-50 text-red-800"
                      : "bg-blue-50 text-blue-800"
                  }`}
                >
                  <alert.icon className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{alert.message}</span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Recent Activity */}
        <Card className="lg:col-span-2 p-4 sm:p-5 border-0 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Recent Activity</h3>
          <div className="space-y-3">
            {recent.length === 0 ? (
              <p className="text-sm text-gray-500 italic">No recent activity</p>
            ) : (
              recent.map((act, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between text-xs sm:text-sm pb-3 last:pb-0 border-b border-gray-100 last:border-0"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {act.poNo} - {act.material}
                    </p>
                    <p className="text-gray-600 truncate">
                      {act.supplier} • <span className="font-medium">{act.stage}</span>
                    </p>
                  </div>
                  <span className="text-gray-500 ml-2 whitespace-nowrap">{act.time}</span>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}