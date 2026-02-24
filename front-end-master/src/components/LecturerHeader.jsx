import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell, LogOut, User as UserIcon, Menu, X } from "lucide-react";
import axios from "axios";
import Avatar from "./Avatar";

const LecturerHeader = ({ onToggleSidebar, collapsed }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [notiOpen, setNotiOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const menuRef = useRef();
    const notiRef = useRef();
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchUser();
        fetchNotifications();

        // Polling every 30 seconds for new notifications
        const interval = setInterval(fetchNotifications, 30000);

        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
            if (notiRef.current && !notiRef.current.contains(e.target)) {
                setNotiOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            clearInterval(interval);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const fetchUser = async () => {
        if (!token) return;
        try {
            const res = await axios.get("http://localhost:8080/api/users/me", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(res.data);
        } catch (err) {
            console.error("Failed to fetch user info", err);
        }
    };

    const fetchNotifications = async () => {
        if (!token) return;
        try {
            const [listRes, countRes] = await Promise.all([
                axios.get("http://localhost:8080/api/notifications", {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get("http://localhost:8080/api/notifications/unread-count", {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ]);
            setNotifications(listRes.data);
            setUnreadCount(countRes.data);
        } catch (err) {
            console.error("Failed to fetch notifications", err);
        }
    };

    const handleOpenNotification = async (id) => {
        try {
            await axios.put(`http://localhost:8080/api/notifications/${id}/read`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
            setNotiOpen(false);
            navigate(`/notification/${id}`);
        } catch (err) {
            console.error("Failed to mark notification as read", err);
        }
    };

    const handleReadAll = async () => {
        try {
            await axios.put("http://localhost:8080/api/notifications/read-all", {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            setUnreadCount(0);
        } catch (err) {
            console.error("Failed to mark all as read", err);
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
                {/* Notification Icon with Dropdown */}
                <div className="relative" ref={notiRef}>
                    <button
                        onClick={() => setNotiOpen(!notiOpen)}
                        className="relative p-2 text-slate-400 hover:text-[#009FE3] hover:bg-slate-50 rounded-xl transition-all"
                    >
                        <Bell size={22} />
                        {unreadCount > 0 && (
                            <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs flex items-center justify-center rounded-full font-bold">
                                {unreadCount}
                            </span>
                        )}
                    </button>

                    {/* Notification Dropdown */}
                    {notiOpen && (
                        <div className="absolute right-0 mt-3 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="p-4 text-sm font-black text-slate-800 border-b border-slate-100 bg-slate-50/50">
                                Thông báo
                            </div>

                            <div className="max-h-96 overflow-y-auto">
                                {notifications.length === 0 && (
                                    <div className="p-8 text-center">
                                        <Bell className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                                        <p className="text-sm font-bold text-slate-400">Chưa có thông báo</p>
                                        <p className="text-xs text-slate-400 mt-1">Các thông báo mới sẽ hiển thị ở đây</p>
                                    </div>
                                )}

                                {notifications.slice(0, 5).map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => handleOpenNotification(item.id)}
                                        className={`w-full text-left px-4 py-3 border-b border-slate-50 hover:bg-slate-50 transition-colors flex flex-col gap-1 ${!item.read ? "bg-blue-50/30" : ""
                                            }`}
                                    >
                                        <div className={`text-sm ${!item.read ? "font-bold text-slate-900" : "font-semibold text-slate-600"}`}>
                                            {item.title}
                                        </div>
                                        {item.message && (
                                            <div className="text-xs text-slate-500 line-clamp-2">
                                                {item.message}
                                            </div>
                                        )}
                                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">
                                            {item.timeDisplay || item.time}
                                        </div>
                                    </button>
                                ))}
                            </div>

                            <div className="flex border-t border-slate-100">
                                <button
                                    className="flex-1 py-3 text-xs font-bold text-slate-600 hover:bg-slate-50 border-r border-slate-100 transition-colors"
                                    onClick={handleReadAll}
                                >
                                    Đánh dấu đã đọc hết
                                </button>
                                <button
                                    className="flex-1 py-3 text-xs font-bold text-[#009FE3] hover:bg-slate-50 transition-colors"
                                    onClick={() => {
                                        navigate("/notification");
                                        setNotiOpen(false);
                                    }}
                                >
                                    Xem tất cả
                                </button>
                            </div>
                        </div>
                    )}
                </div>

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
