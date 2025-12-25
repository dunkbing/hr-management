import React from "react";
import FacultySidebar from "../components/FacultySidebar";  
import Header from "../components/Header"; // Thêm Header

const FacultyLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* SIDEBAR TRƯỞNG KHOA */}
      <FacultySidebar />

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

export default FacultyLayout;
