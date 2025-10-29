"use client";

import type React from "react";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/modal";
import { Eye, FileInput } from "lucide-react";
import { useProcurement } from "@/contexts/procurement-context";

// Reusable Labeled Input
function LabeledInput({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  disabled = false,
  required = false,
}: {
  label: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <Input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full"
      />
    </div>
  );
}

export function BillEntryPage() {
  const [tab, setTab] = useState<"pending" | "history">("pending");
  const { getRecordsByStage, updateRecord, moveRecordToStage: moveToStage } = useProcurement();

  // Pending: QC Reports that need bill entry
  const pending = getRecordsByStage("qcreport", "QC Report Done");
  // History: ERP Completed
  const history = getRecordsByStage("billentry", "ERP Completed");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<(typeof pending)[0] | null>(null);
  const [formData, setFormData] = useState({
    enteredBy: "",
    billNo: "",
    amount: "",
  });

  const handleBillEntry = (record: (typeof pending)[0]) => {
    const billNo = record.billNo || `BILL-${String(history.length + 1).padStart(3, "0")}`;
    setSelectedRecord(record);
    setFormData({
      enteredBy: "",
      billNo,
      amount: record.amount ? String(record.amount) : "",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRecord) {
      updateRecord(selectedRecord.id, {
        entryDate: new Date().toISOString().split("T")[0],
        enteredBy: formData.enteredBy,
        billNo: formData.billNo,
        amount: Number(formData.amount) || 0,
        status: "ERP Completed" as const,
      });
      moveToStage(selectedRecord.id, "billentry", "ERP Completed");
      setIsModalOpen(false);
      setSelectedRecord(null);
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-0">
      {/* Header */}
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Bill Entry in ERP</h2>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200 overflow-x-auto">
        <button
          onClick={() => setTab("pending")}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
            tab === "pending"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-600 hover:text-gray-900"
          }`}
        >
          Pending ({pending.length})
        </button>
        <button
          onClick={() => setTab("history")}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
            tab === "history"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-600 hover:text-gray-900"
          }`}
        >
          History ({history.length})
        </button>
      </div>

      {/* === PENDING TAB === */}
      {tab === "pending" && (
        <Card className="overflow-hidden">
          {pending.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p className="text-lg font-medium">No pending ERP entries</p>
              <p className="text-sm mt-1">All QC reports have been entered in ERP.</p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Bill No.
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        PO No.
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {pending.map((record) => (
                      <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <Button
                            onClick={() => handleBillEntry(record)}
                            className="bg-teal-600 hover:bg-teal-700 text-xs flex items-center gap-1"
                          >
                            <FileInput className="w-3.5 h-3.5" />
                            ERP Entry
                          </Button>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">
                          {record.billNo || "—"}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">{record.poNo}</td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-green-700">
                          ₹{record.amount?.toLocaleString("en-IN") || "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4 p-4">
                {pending.map((record) => (
                  <div
                    key={record.id}
                    className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold text-gray-900">{record.poNo}</p>
                        <p className="text-sm text-gray-600">Bill: {record.billNo || "Auto"}</p>
                      </div>
                      <span className="text-xs font-medium text-yellow-800 bg-yellow-100 px-2.5 py-0.5 rounded-full">
                        QC Done
                      </span>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-gray-500">Amount</p>
                      <p className="font-bold text-green-700">
                        ₹{record.amount?.toLocaleString("en-IN") || "—"}
                      </p>
                    </div>

                    {/* Action Button First */}
                    <Button
                      onClick={() => handleBillEntry(record)}
                      className="w-full bg-teal-600 hover:bg-teal-700 flex items-center justify-center gap-2"
                    >
                      <FileInput className="w-4 h-4" />
                      Enter in ERP
                    </Button>
                  </div>
                ))}
              </div>
            </>
          )}
        </Card>
      )}

      {/* === HISTORY TAB === */}
      {tab === "history" && (
        <Card className="overflow-hidden">
          {history.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p className="text-lg font-medium">No ERP history</p>
              <p className="text-sm mt-1">Completed entries will appear here.</p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Bill No.
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        PO No.
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Entry Date
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {history.map((record) => (
                      <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                        <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">
                          {record.billNo}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">{record.poNo}</td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-green-700">
                          ₹{record.amount.toLocaleString("en-IN")}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">{record.entryDate}</td>
                        <td className="px-4 py-3">
                          <span className="inline-flex rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                            {record.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4 p-4">
                {history.map((record) => (
                  <div
                    key={record.id}
                    className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold text-gray-900">{record.billNo}</p>
                        <p className="text-sm text-gray-600">{record.poNo}</p>
                      </div>
                      <span className="text-xs font-medium text-green-800 bg-green-100 px-2.5 py-0.5 rounded-full">
                        ERP Done
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-gray-500">Amount</p>
                        <p className="font-medium text-green-700">₹{record.amount.toLocaleString("en-IN")}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Entered on</p>
                        <p className="font-medium">{record.entryDate}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </Card>
      )}

      {/* === ERP ENTRY MODAL === */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="ERP Bill Entry"
        className="max-w-lg w-full mx-4 sm:mx-auto"
        backdropClassName="bg-black/30"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <LabeledInput label="Bill No." value={formData.billNo} onChange={() => {}} disabled />
          <LabeledInput label="PO No." value={selectedRecord?.poNo || ""} onChange={() => {}} disabled />
          <LabeledInput
            label="Amount (₹)"
            value={formData.amount}
            onChange={() => {}}
            disabled
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Entered By
            </label>
            <select
              value={formData.enteredBy}
              onChange={(e) => setFormData({ ...formData, enteredBy: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select</option>
              <option value="Accounts Executive">Accounts Executive</option>
              <option value="Finance Manager">Finance Manager</option>
            </select>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row pt-2">
            <Button type="submit" className="flex-1 bg-teal-600 hover:bg-teal-700">
              Complete ERP Entry
            </Button>
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}