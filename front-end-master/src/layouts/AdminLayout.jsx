import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

const AdminLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-gray-100 overflow-hidden">
      {/* HEADER - Top level, full width */}
      <Header onToggleSidebar={() => setCollapsed(!collapsed)} collapsed={collapsed} />

      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR - Starts below header */}
        <Sidebar collapsed={collapsed} />

        {/* MAIN AREA - No padding here, let children handle their own spacing */}
        <main className="flex-1 overflow-y-auto transition-all duration-300">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
