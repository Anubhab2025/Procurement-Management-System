"use client";

import type React from "react";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/modal";
import { Eye, PackageCheck } from "lucide-react";
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

export function MRNPage() {
  const [tab, setTab] = useState<"pending" | "history">("pending");
  const { getRecordsByStage, updateRecord, moveRecordToStage: moveToStage } = useProcurement();

  // Pending: QC Done and Approved
  const qcDone = getRecordsByStage("qc", "QC Done");
  const pending = qcDone.filter((r) => r.approvalStatus === "Approved");

  // History: MRN Created
  const history = getRecordsByStage("mrn", "MRN Created");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<(typeof pending)[0] | null>(null);
  const [formData, setFormData] = useState({
    approvedBy: "",
    materialCondition: "OK",
  });

  const handleMRN = (record: (typeof pending)[0]) => {
    setSelectedRecord(record);
    setFormData({ approvedBy: "", materialCondition: "OK" });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRecord) {
      const mrnNo = `MRN-${String(history.length + 1).padStart(3, "0")}`;
      updateRecord(selectedRecord.id, {
        mrnNo,
        unloadingDate: new Date().toISOString().split("T")[0],
        approvedBy: formData.approvedBy,
        materialCondition: formData.materialCondition,
        status: "MRN Created" as const,
      });
      moveToStage(selectedRecord.id, "mrn", "MRN Created");
      setIsModalOpen(false);
      setSelectedRecord(null);
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-0">
      {/* Header */}
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
        Material Unloading & MRN Generation
      </h2>

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
              <p className="text-lg font-medium">No pending MRN</p>
              <p className="text-sm mt-1">All approved QC materials have MRN.</p>
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
                        Material
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {pending.map((record) => (
                      <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <Button
                            onClick={() => handleMRN(record)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-xs flex items-center gap-1"
                          >
                            <PackageCheck className="w-3.5 h-3.5" />
                            Generate MRN
                          </Button>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">{record.poNo}</td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">{record.materialName}</td>
                        <td className="px-4 py-3">
                          <span className="inline-flex rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                            QC Done
                          </span>
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
                        <p className="text-sm text-gray-600">{record.materialName}</p>
                      </div>
                      <span className="text-xs font-medium text-yellow-800 bg-yellow-100 px-2.5 py-0.5 rounded-full">
                        QC Done
                      </span>
                    </div>

                    {/* Action Button First */}
                    <Button
                      onClick={() => handleMRN(record)}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center gap-2"
                    >
                      <PackageCheck className="w-4 h-4" />
                      Generate MRN
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
              <p className="text-lg font-medium">No MRN history</p>
              <p className="text-sm mt-1">Generated MRNs will appear here.</p>
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
                        MRN No.
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        PO No.
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Material
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Condition
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Approved By
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
                        <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">{record.mrnNo}</td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">{record.poNo}</td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">{record.materialName}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              record.materialCondition === "OK"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {record.materialCondition}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">{record.approvedBy}</td>
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
                        <p className="font-semibold text-gray-900">{record.mrnNo}</p>
                        <p className="text-sm text-gray-600">{record.poNo}</p>
                      </div>
                      <span
                        className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                          record.materialCondition === "OK"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {record.materialCondition}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                      <div>
                        <p className="text-gray-500">Material</p>
                        <p className="font-medium">{record.materialName}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Approved By</p>
                        <p className="font-medium text-xs">{record.approvedBy}</p>
                      </div>
                    </div>

                    {/* Action Button First */}
                    <button className="w-full flex items-center justify-center gap-1 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors">
                      <Eye className="w-4 h-4" />
                      View MRN
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </Card>
      )}

      {/* === MRN MODAL === */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Generate MRN"
        className="max-w-lg w-full mx-4 sm:mx-auto"
        backdropClassName="bg-black/30"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <LabeledInput label="PO No." value={selectedRecord?.poNo || ""} onChange={() => {}} disabled />
          <LabeledInput label="Material" value={selectedRecord?.materialName || ""} onChange={() => {}} disabled />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Approved By
            </label>
            <select
              value={formData.approvedBy}
              onChange={(e) => setFormData({ ...formData, approvedBy: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select</option>
              <option value="Manager">Manager</option>
              <option value="Store Head">Store Head</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Material Condition
            </label>
            <select
              value={formData.materialCondition}
              onChange={(e) => setFormData({ ...formData, materialCondition: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="OK">OK</option>
              <option value="Damaged">Damaged</option>
            </select>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row pt-2">
            <Button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-700">
              Generate MRN
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