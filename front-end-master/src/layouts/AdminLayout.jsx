import React from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Footer from "../components/Footer";

const AdminLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="flex flex-1">
        {/* SIDEBAR ADMIN */}
        <Sidebar />

        {/* MAIN AREA */}
        <div className="flex-1 flex flex-col">
          {/* HEADER */}
          <Header />

          {/* MAIN CONTENT */}
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>

      {/* FOOTER */}
      <Footer />
    </div>
  );
};

export default AdminLayout;
