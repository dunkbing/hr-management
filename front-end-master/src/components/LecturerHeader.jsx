import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, LogOut, User as UserIcon } from "lucide-react";
import axiosClient from "../api/axiosClient";
import Avatar from "./Avatar";

const LecturerHeader = () => {
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
        <header className="flex items-center justify-between bg-white px-8 py-4 shadow-sm border-b border-slate-100">
            <div>
                <h2 className="text-lg font-bold text-slate-800">Cổng thông tin Giảng viên</h2>
                <p className="text-xs text-slate-500 font-medium">Chào mừng trở lại, {user?.fullName}</p>
            </div>

            <div className="flex items-center gap-6">
                <button className="relative p-2 text-gray-400 hover:text-[#009FE3] hover:bg-blue-50 rounded-full transition-all">
                    <Bell size={22} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>

                <div className="h-8 w-[1px] bg-slate-100"></div>

                <div className="flex items-center gap-3 relative" ref={menuRef}>
                    <div
                        className="flex items-center gap-3 cursor-pointer group"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        <div className="text-right">
                            <p className="text-sm font-bold text-slate-700 group-hover:text-[#009FE3] transition-colors">{user?.fullName}</p>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{user?.roleName}</p>
                        </div>
                        <Avatar
                            src={user?.avatar}
                            name={user?.fullName}
                            size="md"
                            className="ring-2 ring-transparent group-hover:ring-[#009FE3] transition-all"
                        />
                    </div>

                    {menuOpen && (
                        <div className="absolute right-0 top-full mt-4 w-56 bg-white border border-slate-100 rounded-2xl shadow-xl z-20 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="p-4 border-b border-slate-50 bg-slate-50/50">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Tài khoản</p>
                                <p className="text-sm font-bold text-gray-700 truncate">{user?.email}</p>
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
