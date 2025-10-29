"use client";

import type React from "react";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/modal";
import { Eye, MessageSquare } from "lucide-react";
import { useProcurement } from "@/contexts/procurement-context";

// Fixed LabeledInput
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

export function FollowUpPage() {
  const { getRecordsByStage, moveRecordToStage: moveToStage, updateRecord } = useProcurement();
  const pending = getRecordsByStage("po", "Issued");
  const history = getRecordsByStage("followup", "Follow-up Done");

  const [tab, setTab] = useState<"pending" | "history">("pending");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<(typeof pending)[0] | null>(null);
  const [formData, setFormData] = useState({
    expectedDelivery: "",
    remarks: "",
  });

  const handleFollowUp = (record: (typeof pending)[0]) => {
    setSelectedRecord(record);
    setFormData({
      expectedDelivery: record.deliveryDate || "",
      remarks: "",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRecord) {
      updateRecord(selectedRecord.id, {
        expectedDelivery: formData.expectedDelivery,
        remarks: formData.remarks,
        status: "Follow-up Done" as const,
      });
      moveToStage(selectedRecord.id, "followup", "Follow-up Done");
      setIsModalOpen(false);
      setSelectedRecord(null);
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-0">
      {/* Header */}
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Follow-up</h2>

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
              <p className="text-lg font-medium">No pending follow-ups</p>
              <p className="text-sm mt-1">All POs have been followed up.</p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray,gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        PO No.
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Supplier
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Material
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Expected Delivery
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {pending.map((record) => (
                      <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <Button
                            onClick={() => handleFollowUp(record)}
                            className="bg-purple-600 hover:bg-purple-700 text-xs flex items-center gap-1"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            Follow-up
                          </Button>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">{record.poNo}</td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">{record.supplierName}</td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">{record.materialName}</td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">
                          {record.expectedDelivery || record.deliveryDate}
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
                        <p className="text-sm text-gray-600">{record.supplierName}</p>
                      </div>
                      <span className="text-xs font-medium text-yellow-800 bg-yellow-100 px-2.5 py-0.5 rounded-full">
                        Pending
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                      <div>
                        <p className="text-gray-500">Material</p>
                        <p className="font-medium">{record.materialName}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Expected</p>
                        <p className="font-medium text-xs">
                          {record.expectedDelivery || record.deliveryDate}
                        </p>
                      </div>
                    </div>

                    <Button
                      onClick={() => handleFollowUp(record)}
                      className="w-full bg-purple-600 hover:bg-purple-700 flex items-center justify-center gap-2"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Follow-up
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
              <p className="text-lg font-medium">No follow-up history</p>
              <p className="text-sm mt-1">Followed-up POs will appear here.</p>
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
                        PO No.
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Supplier
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Material
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Expected Delivery
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {history.map((record) => (
                      <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <button className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm">
                            <Eye className="w-4 h-4" />
                            View
                          </button>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">{record.poNo}</td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">{record.supplierName}</td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">{record.materialName}</td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">{record.expectedDelivery}</td>
                        <td className="px-4 py-3">
                          <span className="inline-flex rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
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
                        <p className="font-semibold text-gray-900">{record.poNo}</p>
                        <p className="text-sm text-gray-600">{record.supplierName}</p>
                      </div>
                      <span className="text-xs font-medium text-blue-800 bg-blue-100 px-2.5 py-0.5 rounded-full">
                        {record.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                      <div>
                        <p className="text-gray-500">Material</p>
                        <p className="font-medium">{record.materialName}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Expected</p>
                        <p className="font-medium text-xs">{record.expectedDelivery}</p>
                      </div>
                    </div>

                    <button className="w-full flex items-center justify-center gap-1 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors">
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </Card>
      )}

      {/* === FOLLOW-UP MODAL === */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Follow-up"
        className="max-w-lg w-full mx-4 sm:mx-auto"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <LabeledInput label="PO No." value={selectedRecord?.poNo || ""} onChange={() => {}} disabled />
          <LabeledInput
            label="Expected Delivery Date"
            type="date"
            value={formData.expectedDelivery}
            onChange={(e) => setFormData({ ...formData, expectedDelivery: e.target.value })}
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Remarks / Notes
            </label>
            <textarea
              placeholder="Enter follow-up remarks..."
              value={formData.remarks}
              onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={4}
            />
          </div>
          <div className="flex flex-col gap-3 sm:flex-row pt-2">
            <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
              Submit Follow-up
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