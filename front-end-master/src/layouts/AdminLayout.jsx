import React from "react";
import Sidebar from "../components/Sidebar"; 
import Header from "../components/Header"; // Thêm Header

const AdminLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* SIDEBAR ADMIN */}
      <Sidebar />

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col">
        
        {/* HEADER */}
        <Header />

        {/* MAIN CONTENT */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
