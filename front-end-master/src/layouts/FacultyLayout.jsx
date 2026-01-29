import React, { useState } from "react";
import FacultySidebar from "../components/FacultySidebar";
import Header from "../components/Header";

const FacultyLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-gray-100 overflow-hidden">
      {/* HEADER */}
      <Header onToggleSidebar={() => setCollapsed(!collapsed)} collapsed={collapsed} />

      <div className="flex flex-1 overflow-hidden">
        <FacultySidebar collapsed={collapsed} />
        <main className="flex-1 p-6 overflow-y-auto transition-all duration-300">
          {children}
        </main>
      </div>
    </div>
  );
};

export default FacultyLayout;
