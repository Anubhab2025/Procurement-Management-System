"use client";

import { ChevronLeft, ChevronRight, Menu, X } from "lucide-react"; // Added X here

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: "ChartBar" },
  { id: "indent", label: "Make Indent", icon: "FileText" },
  { id: "po-issue", label: "Issue PO", icon: "Send" },
  { id: "follow-up", label: "Follow-up", icon: "RefreshCw" },
  { id: "material-receiving", label: "Material Receiving", icon: "Truck" },
  { id: "weighment", label: "Weighment", icon: "Scale" },
  { id: "qc", label: "Quality Check", icon: "Beaker" },
  { id: "mrn", label: "MRN Generation", icon: "Package" },
  { id: "bills", label: "Submit Bills", icon: "DollarSign" },
  { id: "qc-report", label: "QC Report", icon: "FileCheck" },
  { id: "bill-entry", label: "Bill Entry", icon: "Receipt" },
];

const iconMap: Record<string, React.ReactNode> = {
  ChartBar: (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
      />
    </svg>
  ),
  FileText: (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  ),
  Send: (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
      />
    </svg>
  ),
  RefreshCw: (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
      />
    </svg>
  ),
  Truck: (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 17a2 2 0 11-4 0 2 2 0 014 0zm10 0a2 2 0 11-4 0 2 2 0 014 0zm-2-8h.01M9 9h.01M19 9H5a2 2 0 00-2 2v8a2 2 0 002 2h14a2 2 0 002-2v-8a2 2 0 00-2-2z"
      />
    </svg>
  ),
  Scale: (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v v4m0 0v4m0-4h4m-4 0H8"
      />
    </svg>
  ),
  Beaker: (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.022.547m7.5-.5v.01M19.5 7.5a2 2 0 11-4 0 2 2 0 014 0z"
      />
    </svg>
  ),
  Package: (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
      />
    </svg>
  ),
  DollarSign: (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  FileCheck: (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  Receipt: (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  ),
};

export function Sidebar({
  currentPage,
  onPageChange,
  isOpen,
  onToggle,
}: SidebarProps) {
  /* Desktop Sidebar */
  const DesktopSidebar = () => (
    <aside
      className={`
        hidden md:flex flex-col
        ${isOpen ? "w-64" : "w-20"}
        bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900
        text-white overflow-hidden
        transition-all duration-300 ease-in-out
        border-r border-slate-700 shadow-2xl
        relative z-40
      `}
    >
      <div className="p-5 flex items-center justify-between">
        <div
          className={`flex items-center gap-3 overflow-hidden transition-all ${
            isOpen ? "w-40" : "w-0"
          }`}
        >
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">P</span>
          </div>
          <h2 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent whitespace-nowrap">
            Procurement
          </h2>
        </div>

        <button
          onClick={onToggle}
          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-all duration-200 hover:scale-110 active:scale-95 shadow-lg"
        >
          <div
            className="transition-transform duration-300"
            style={{ transform: isOpen ? "rotate(0deg)" : "rotate(180deg)" }}
          >
            {isOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </div>
        </button>
      </div>

      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700">
        {menuItems.map((item) => {
          const isActive = currentPage === item.id;
          const Icon = iconMap[item.icon];

          return (
            <div key={item.id} className="relative group">
              <button
                onClick={() => onPageChange(item.id)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl
                  transition-all duration-200 relative overflow-hidden
                  ${
                    isActive
                      ? "text-white shadow-lg"
                      : "text-slate-400 hover:text-white"
                  }
                `}
                title={!isOpen ? item.label : ""}
              >
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl animate-pulse" />
                )}
                <div className="absolute inset-0 bg-slate-700 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity" />
                <div
                  className={`relative z-10 transition-all duration-200 ${
                    isActive ? "scale-110" : "group-hover:scale-125"
                  }`}
                >
                  {Icon}
                </div>
                <span
                  className={`
                    relative z-10 text-sm font-medium whitespace-nowrap overflow-hidden
                    transition-all duration-300
                    ${isOpen ? "opacity-100 w-auto" : "opacity-0 w-0"}
                  `}
                >
                  {item.label}
                </span>
                {!isOpen && (
                  <div className="absolute left-full ml-3 px-3 py-2 bg-slate-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap z-50 before:content-[''] before:absolute before:top-1/2 before:-left-1 before:-translate-y-1/2 before:border-4 before:border-transparent before:border-r-slate-800">
                    {item.label}
                  </div>
                )}
              </button>
            </div>
          );
        })}
      </nav>

      <div className="h-1 bg-gradient-to-r from-blue-600 via-cyan-500 to-purple-600" />
    </aside>
  );

  /* Mobile Drawer */
  const MobileDrawer = () => (
    <div className="md:hidden">
      {/* Hamburger */}
      <button
        onClick={onToggle}
        className="fixed top-4 left-4 z-50 p-2 bg-slate-800 rounded-lg shadow-lg hover:bg-slate-700 transition-colors"
        aria-label="Open menu"
      >
        <Menu className="w-6 h-6 text-white" />
      </button>

      {/* Backdrop + Drawer */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={onToggle}>
          <aside
            className="absolute left-0 top-0 h-full w-72 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col shadow-2xl animate-in slide-in-from-left duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 flex items-center justify-between border-b border-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">P</span>
                </div>
                <h2 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                  Procurement
                </h2>
              </div>
              <button
                onClick={onToggle}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                <X className="w-5 h-5" /> {/* Now works – X is imported */}
              </button>
            </div>

            <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
              {menuItems.map((item) => {
                const isActive = currentPage === item.id;
                const Icon = iconMap[item.icon];

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onPageChange(item.id);
                      onToggle();
                    }}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3 rounded-xl
                      transition-all duration-200
                      ${
                        isActive
                          ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg"
                          : "text-slate-300 hover:text-white hover:bg-slate-700"
                      }
                    `}
                  >
                    <div className={isActive ? "scale-110" : ""}>{Icon}</div>
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </aside>
        </div>
      )}
    </div>
  );

  return (
    <>
      <DesktopSidebar />
      <MobileDrawer />
    </>
  );
}
