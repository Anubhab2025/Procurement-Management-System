"use client";

import type React from "react";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/modal";
import { Eye, Plus } from "lucide-react";
import { useProcurement } from "@/contexts/procurement-context";

// Reusable Labeled Input (since Input doesn't support label)
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

export function IndentPage() {
  const { records, addRecord, getRecordsByStage, moveRecordToStage } =
    useProcurement();
  const indents = getRecordsByStage("indent");

  // Modal States
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selected, setSelected] = useState<(typeof indents)[0] | null>(null);

  // Form State
  const [form, setForm] = useState({
    supplierName: "",
    materialName: "",
    quantity: "",
    rate: "",
    deliveryDate: "",
  });

  const resetForm = () => {
    setForm({
      supplierName: "",
      materialName: "",
      quantity: "",
      rate: "",
      deliveryDate: "",
    });
  };

  // Create Indent
  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newIndent = {
      id: String(Date.now()),
      poNo: `PO-2025-${String(records.length + 1).padStart(3, "0")}`,
      supplierName: form.supplierName,
      materialName: form.materialName,
      quantity: Number(form.quantity),
      rate: Number(form.rate),
      deliveryDate: form.deliveryDate,
      stage: "indent" as const,
      status: "Pending" as const,
      createdAt: new Date().toISOString(),
    };
    addRecord(newIndent);
    resetForm();
    setIsCreateOpen(false);
  };

  // View
  const openView = (indent: (typeof indents)[0]) => {
    setSelected(indent);
    setIsViewOpen(true);
  };

  return (
    <>
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          Make Indent
        </h2>
        <Button
          onClick={() => {
            resetForm();
            setIsCreateOpen(true);
          }}
          className="w-full bg-blue-600 hover:bg-blue-700 sm:w-auto flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          <span className="hidden sm:inline">Make Indent</span>
          <span className="sm:hidden">New</span>
        </Button>
      </div>

      {/* Table / Cards */}
      <Card className="mt-6 overflow-hidden">
        {indents.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p className="text-lg font-medium">No indents yet</p>
            <p className="text-sm mt-1">Click "New" to create one.</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {[
                      "PO No.",
                      "Supplier",
                      "Material",
                      "Qty",
                      "Rate",
                      "Delivery",
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
                  {indents.map((i) => (
                    <tr
                      key={i.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">
                        {i.poNo}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">
                        {i.supplierName}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">
                        {i.materialName}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">
                        {i.quantity}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">
                        ₹{i.rate}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">
                        {i.deliveryDate}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                          {i.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex gap-3">
                          <button
                            onClick={() => openView(i)}
                            className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="sm:hidden space-y-4 p-4">
              {indents.map((i) => (
                <div
                  key={i.id}
                  className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold text-gray-900">{i.poNo}</p>
                      <p className="text-sm text-gray-600">{i.supplierName}</p>
                    </div>
                    <span className="rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                      {i.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                    <div>
                      <p className="text-gray-500">Material</p>
                      <p className="font-medium">{i.materialName}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Qty</p>
                      <p className="font-medium">{i.quantity}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Rate</p>
                      <p className="font-medium">₹{i.rate}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Delivery</p>
                      <p className="font-medium text-xs">{i.deliveryDate}</p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <Button
                      onClick={() => openView(i)}
                      variant="outline"
                      className="w-full justify-center text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </Card>

      {/* === CREATE INDENT MODAL === */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Create New Indent"
        className="max-w-lg w-full mx-4 sm:mx-auto"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <LabeledInput
            label="Supplier Name"
            value={form.supplierName}
            onChange={(e) =>
              setForm((f) => ({ ...f, supplierName: e.target.value }))
            }
            placeholder="ABC Suppliers Ltd."
            required
          />
          <LabeledInput
            label="Material Name"
            value={form.materialName}
            onChange={(e) =>
              setForm((f) => ({ ...f, materialName: e.target.value }))
            }
            placeholder="Steel Rods 12mm"
            required
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <LabeledInput
              label="Quantity"
              type="number"
              value={form.quantity}
              onChange={(e) =>
                setForm((f) => ({ ...f, quantity: e.target.value }))
              }
              placeholder="100"
              required
            />
            <LabeledInput
              label="Rate (₹)"
              type="number"
              value={form.rate}
              onChange={(e) => setForm((f) => ({ ...f, rate: e.target.value }))}
              placeholder="850"
              required
            />
          </div>
          <LabeledInput
            label="Delivery Date"
            type="date"
            value={form.deliveryDate}
            onChange={(e) =>
              setForm((f) => ({ ...f, deliveryDate: e.target.value }))
            }
            required
          />
          <div className="flex flex-col gap-3 sm:flex-row pt-2">
            <Button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              Create Indent
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsCreateOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      {/* === VIEW INDENT MODAL === */}
      {selected && (
        <Modal
          isOpen={isViewOpen}
          onClose={() => {
            setIsViewOpen(false);
            setSelected(null);
          }}
          title="Indent Details"
          className="max-w-lg w-full mx-4 sm:mx-auto"
        >
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <span className="text-gray-500">PO No.</span>
                <p className="font-semibold">{selected.poNo}</p>
              </div>
              <div>
                <span className="text-gray-500">Status</span>
                <p className="font-semibold">{selected.status}</p>
              </div>
              <div>
                <span className="text-gray-500">Supplier</span>
                <p className="font-semibold">{selected.supplierName}</p>
              </div>
              <div>
                <span className="text-gray-500">Material</span>
                <p className="font-semibold">{selected.materialName}</p>
              </div>
              <div>
                <span className="text-gray-500">Quantity</span>
                <p className="font-semibold">{selected.quantity}</p>
              </div>
              <div>
                <span className="text-gray-500">Rate</span>
                <p className="font-semibold">₹{selected.rate}</p>
              </div>
              <div>
                <span className="text-gray-500">Delivery</span>
                <p className="font-semibold">{selected.deliveryDate}</p>
              </div>
              <div>
                <span className="text-gray-500">Total</span>
                <p className="font-semibold">
                  ₹{selected.quantity * selected.rate}
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row pt-4">
              <Button
                onClick={() => {
                  setIsViewOpen(false);
                  setSelected(null);
                }}
                className="flex-1 bg-gray-600 hover:bg-gray-700"
              >
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
