import React from "react";
import PrincipalSidebar from "../components/PrincipalSidebar";  
import Header from "../components/Header"; // Thêm Header

const PrincipalLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* SIDEBAR HIỆU TRƯỞNG */}
      <PrincipalSidebar />

      {/* MAIN WRAPPER */}
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

export default PrincipalLayout;
