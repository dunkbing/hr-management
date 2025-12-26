import React from "react";
import LecturerSidebar from "../components/LecturerSidebar";
import LecturerHeader from "../components/LecturerHeader";

const LecturerLayout = ({ children }) => {
    return (
        <div className="flex min-h-screen bg-[#F8FAFC]">
            <LecturerSidebar />
            <div className="flex-1 flex flex-col">
                <LecturerHeader />
                <main className="flex-1 p-0 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default LecturerLayout;
