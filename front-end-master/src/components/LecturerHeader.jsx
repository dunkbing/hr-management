import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell, LogOut, User as UserIcon, Menu, X } from "lucide-react";
import axiosClient from "../api/axiosClient";
import Avatar from "./Avatar";

const LecturerHeader = ({ onToggleSidebar, collapsed }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [user, setUser] = useState(null);
    const menuRef = useRef();
    const navigate = useNavigate();

    useEffect(() => {
        fetchUser();
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const fetchUser = async () => {
        try {
            const res = await axiosClient.get("/users/me");
            setUser(res.data);
        } catch (err) {
            console.error("Failed to fetch user info", err);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <header className="flex items-center justify-between bg-white px-8 py-5 shadow-sm relative z-30 transition-all border-b border-slate-100">
            <div className="flex items-center gap-8">
                {/* Toggle Sidebar Button */}
                <button
                    onClick={onToggleSidebar}
                    className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400 hover:text-[#009FE3]"
                    title={collapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"}
                >
                    <Menu size={24} className={`transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`} />
                </button>

                {/* Logo & University Title */}
                <Link to="/lecturer/dashboard" className="flex items-center gap-3 group">
                    <div className="bg-slate-50 p-1.5 rounded-xl shadow-inner group-hover:bg-[#009FE3]/5 transition-colors">
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/0/03/Logo_HAU.png"
                            alt="Logo HAU"
                            className="w-8 h-8 object-contain"
                            style={{ filter: 'invert(48%) sepia(100%) saturate(2476%) hue-rotate(179deg) brightness(94%) contrast(101%)' }}
                        />
                    </div>
                    <div className="hidden sm:block">
                        <h1 className="font-black text-[#009FE3] leading-none text-[13px] uppercase tracking-tight">Trường Đại học</h1>
                        <h2 className="font-black text-[#009FE3] leading-none text-[13px] uppercase tracking-tight mt-1">Kiến trúc Hà Nội</h2>
                    </div>
                </Link>
            </div>

            <div className="flex items-center gap-8">
                <button className="relative p-2 text-slate-400 hover:text-[#009FE3] hover:bg-slate-50 rounded-xl transition-all">
                    <Bell size={22} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>

                <div className="h-8 w-[1px] bg-slate-100"></div>

                <div className="flex items-center gap-4 relative" ref={menuRef}>
                    <div
                        className="flex items-center gap-4 cursor-pointer group"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        <div className="text-right">
                            <p className="text-sm font-black text-slate-800 leading-none group-hover:text-[#009FE3] transition-colors">{user?.fullName}</p>
                            <p className="text-[10px] font-black text-[#009FE3] uppercase tracking-[0.2em] mt-1">{user?.roleName}</p>
                        </div>
                        <div className="relative group p-0.5 rounded-full border-2 border-transparent hover:border-[#009FE3] transition-all">
                            <Avatar
                                src={user?.avatar}
                                name={user?.fullName}
                                size="md"
                                className="ring-2 ring-transparent transition-all"
                            />
                        </div>
                    </div>

                    {menuOpen && (
                        <div className="absolute right-0 top-full mt-4 w-56 bg-white border border-slate-100 rounded-2xl shadow-xl z-20 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="p-4 border-b border-slate-50 bg-slate-50/50">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Tài khoản</p>
                                <p className="text-sm font-bold text-slate-700 truncate">{user?.email}</p>
                            </div>
                            <button
                                onClick={() => { setMenuOpen(false); navigate("/lecturer/profile"); }}
                                className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-600 hover:bg-blue-50 hover:text-[#009FE3] transition-colors"
                            >
                                <UserIcon size={16} />
                                Hồ sơ cá nhân
                            </button>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-500 hover:bg-rose-50 transition-colors"
                            >
                                <LogOut size={16} />
                                Đăng xuất
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default LecturerHeader;
