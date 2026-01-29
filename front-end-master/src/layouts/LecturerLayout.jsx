import React, { useState } from "react";
import LecturerSidebar from "../components/LecturerSidebar";
import LecturerHeader from "../components/LecturerHeader";
import Footer from "../components/Footer";

const LecturerLayout = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="flex flex-col h-screen bg-[#F8FAFC] overflow-hidden">
            <LecturerHeader onToggleSidebar={() => setCollapsed(!collapsed)} collapsed={collapsed} />
            <div className="flex flex-1 overflow-hidden">
                <LecturerSidebar collapsed={collapsed} />
                <div className="flex-1 flex flex-col overflow-y-auto">
                    <main className="flex-1 p-0">
                        {children}
                    </main>
                    <Footer />
                </div>
            </div>
        </div>
    );
};

export default LecturerLayout;
