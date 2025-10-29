"use client";

import type React from "react";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/modal";
import { Eye, Send, FileText } from "lucide-react";
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

export function POIssuePage() {
  const {
    getRecordsByStage,
    moveRecordToStage: moveToStage,
    updateRecord,
  } = useProcurement();
  const posPending = getRecordsByStage("indent", "Pending");
  const posHistory = getRecordsByStage("po", "Issued");

  const [tab, setTab] = useState<"pending" | "history">("pending");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPO, setSelectedPO] = useState<(typeof posPending)[0] | null>(
    null
  );
  const [formData, setFormData] = useState({
    issueDate: "",
    supplierContact: "",
    modeOfSend: "Mail",
    attachmentName: "",
  });

  const handleIssuePO = (po: (typeof posPending)[0]) => {
    setSelectedPO(po);
    setFormData({
      issueDate: new Date().toISOString().split("T")[0],
      supplierContact: "",
      modeOfSend: "Mail",
      attachmentName: "",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPO) {
      updateRecord(selectedPO.id, {
        issueDate: formData.issueDate,
        supplierContact: formData.supplierContact,
        modeOfSend: formData.modeOfSend,
        attachmentName: formData.attachmentName,
        status: "Issued" as const,
      });
      moveToStage(selectedPO.id, "po", "Issued");
      setIsModalOpen(false);
      setSelectedPO(null);
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-0">
      {/* Header */}
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Issue PO</h2>

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
          Pending ({posPending.length})
        </button>
        <button
          onClick={() => setTab("history")}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
            tab === "history"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-600 hover:text-gray-900"
          }`}
        >
          History ({posHistory.length})
        </button>
      </div>

      {/* === PENDING TAB === */}
      {tab === "pending" && (
        <Card className="overflow-hidden">
          {posPending.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p className="text-lg font-medium">No pending POs</p>
              <p className="text-sm mt-1">All indents have been issued.</p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {[
                        "Action",
                        "PO No.",
                        "Supplier",
                        "Material",
                        "Qty",
                        "Rate",
                      ].map((h) => (
                        <th
                          key={h}
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {posPending.map((po) => (
                      <tr
                        key={po.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <Button
                            onClick={() => handleIssuePO(po)}
                            className="bg-green-600 hover:bg-green-700 text-xs flex items-center gap-1"
                          >
                            <Send className="w-3.5 h-3.5" />
                            Issue PO
                          </Button>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">
                          {po.poNo}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">
                          {po.supplierName}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">
                          {po.materialName}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">
                          {po.quantity}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">
                          ₹{po.rate}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4 p-4">
                {posPending.map((po) => (
                  <div
                    key={po.id}
                    className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold text-gray-900">{po.poNo}</p>
                        <p className="text-sm text-gray-600">
                          {po.supplierName}
                        </p>
                      </div>
                      <span className="text-xs font-medium text-yellow-800 bg-yellow-100 px-2.5 py-0.5 rounded-full">
                        Pending
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                      <div>
                        <p className="text-gray-500">Material</p>
                        <p className="font-medium">{po.materialName}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Qty</p>
                        <p className="font-medium">{po.quantity}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Rate</p>
                        <p className="font-medium">₹{po.rate}</p>
                      </div>
                    </div>

                    <Button
                      onClick={() => handleIssuePO(po)}
                      className="w-full bg-green-600 hover:bg-green-700 text-sm flex items-center justify-center gap-2 mt-2"
                    >
                      <Send className="w-4 h-4" />
                      Issue PO
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
          {posHistory.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p className="text-lg font-medium">No history</p>
              <p className="text-sm mt-1">Issued POs will appear here.</p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {[
                        "PO No.",
                        "Supplier",
                        "Material",
                        "Issue Date",
                        "Attachment",
                        "Status",
                        "Action",
                      ].map((h) => (
                        <th
                          key={h}
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {posHistory.map((po) => (
                      <tr
                        key={po.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">
                          {po.poNo}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">
                          {po.supplierName}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">
                          {po.materialName}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">
                          {po.issueDate}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">
                          {po.attachmentName ? (
                            <div className="flex items-center gap-1 text-blue-600">
                              <FileText className="w-4 h-4" />
                              {po.attachmentName}
                            </div>
                          ) : (
                            "-"
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                            {po.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm">
                            <Eye className="w-4 h-4" />
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4 p-4">
                {posHistory.map((po) => (
                  <div
                    key={po.id}
                    className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold text-gray-900">{po.poNo}</p>
                        <p className="text-sm text-gray-600">
                          {po.supplierName}
                        </p>
                      </div>
                      <span className="text-xs font-medium text-green-800 bg-green-100 px-2.5 py-0.5 rounded-full">
                        Issued
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                      <div>
                        <p className="text-gray-500">Material</p>
                        <p className="font-medium">{po.materialName}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Issue Date</p>
                        <p className="font-medium text-xs">{po.issueDate}</p>
                      </div>
                      {po.attachmentName && (
                        <div className="col-span-2">
                          <p className="text-gray-500">Attachment</p>
                          <p className="font-medium text-blue-600 flex items-center gap-1 text-xs">
                            <FileText className="w-3.5 h-3.5" />
                            {po.attachmentName}
                          </p>
                        </div>
                      )}
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

      {/* === ISSUE PO MODAL === */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Issue Purchase Order"
        className="max-w-lg w-full mx-4 sm:mx-auto"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <LabeledInput
            label="PO No."
            value={selectedPO?.poNo || ""}
            onChange={() => {}}
            disabled
          />
          <LabeledInput
            label="Issue Date"
            type="date"
            value={formData.issueDate}
            onChange={(e) =>
              setFormData({ ...formData, issueDate: e.target.value })
            }
            required
          />
          <LabeledInput
            label="Supplier Contact"
            placeholder="Phone / Email"
            value={formData.supplierContact}
            onChange={(e) =>
              setFormData({ ...formData, supplierContact: e.target.value })
            }
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mode of Send
            </label>
            <select
              value={formData.modeOfSend}
              onChange={(e) =>
                setFormData({ ...formData, modeOfSend: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Mail</option>
              <option>WhatsApp</option>
              <option>Email</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Attachment (PDF)
            </label>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  attachmentName: e.target.files?.[0]?.name || "",
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {formData.attachmentName && (
              <p className="mt-1 text-xs text-green-600 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5" />
                {formData.attachmentName}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-3 sm:flex-row pt-2">
            <Button
              type="submit"
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              Issue PO
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
