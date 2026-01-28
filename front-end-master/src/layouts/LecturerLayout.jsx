import React from "react";
import LecturerSidebar from "../components/LecturerSidebar";
import LecturerHeader from "../components/LecturerHeader";
import Footer from "../components/Footer";

const LecturerLayout = ({ children }) => {
    return (
        <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
            <div className="flex flex-1">
                <LecturerSidebar />
                <div className="flex-1 flex flex-col">
                    <LecturerHeader />
                    <main className="flex-1 p-0 overflow-y-auto">
                        {children}
                    </main>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default LecturerLayout;
