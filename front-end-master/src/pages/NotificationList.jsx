import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
    Bell,
    CheckCircle2,
    Clock,
    ChevronRight,
    Search,
    Filter,
    Trash2,
    Inbox
} from "lucide-react";

const NotificationList = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all"); // all, unread, read
    const [search, setSearch] = useState("");
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const res = await axios.get("http://localhost:8080/api/notifications", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(res.data);
        } catch (err) {
            console.error("Failed to fetch notifications", err);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (id) => {
        try {
            await axios.put(`http://localhost:8080/api/notifications/${id}/read`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
        } catch (err) {
            console.error("Failed to mark as read", err);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await axios.put("http://localhost:8080/api/notifications/read-all", {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        } catch (err) {
            console.error("Failed to mark all as read", err);
        }
    };

    const filteredNotifications = notifications.filter(n => {
        const matchesFilter = filter === "all" || (filter === "unread" ? !n.read : n.read);
        const matchesSearch = n.title.toLowerCase().includes(search.toLowerCase()) ||
            (n.message && n.message.toLowerCase().includes(search.toLowerCase()));
        return matchesFilter && matchesSearch;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="p-6 lg:p-10 bg-[#F8FAFC] min-h-screen space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                        <Bell className="w-8 h-8 text-[#009FE3]" />
                        Thông báo của tôi
                    </h1>
                    <p className="text-slate-500 mt-1 font-bold text-sm">
                        Quản lý và cập nhật các thông báo mới nhất từ hệ thống.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleMarkAllAsRead}
                        className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all"
                    >
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        Đánh dấu đã đọc hết
                    </button>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-xl w-full md:w-auto">
                    <button
                        onClick={() => setFilter("all")}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filter === "all" ? "bg-white text-primary shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
                    >
                        Tất cả
                    </button>
                    <button
                        onClick={() => setFilter("unread")}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filter === "unread" ? "bg-white text-primary shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
                    >
                        Chưa đọc
                    </button>
                    <button
                        onClick={() => setFilter("read")}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filter === "read" ? "bg-white text-primary shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
                    >
                        Đã đọc
                    </button>
                </div>

                <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm thông báo..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                    />
                </div>
            </div>

            {/* List */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                {filteredNotifications.length > 0 ? (
                    <div className="divide-y divide-slate-50">
                        {filteredNotifications.map((noti) => (
                            <div
                                key={noti.id}
                                onClick={() => navigate(`/notification/${noti.id}`)}
                                className={`p-6 flex items-start gap-4 hover:bg-slate-50/50 transition-all cursor-pointer group ${!noti.read ? "bg-blue-50/20" : ""}`}
                            >
                                <div className={`p-3 rounded-2xl shrink-0 ${!noti.read ? "bg-blue-50 text-primary" : "bg-slate-50 text-slate-400"}`}>
                                    <Bell className="w-6 h-6" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2 mb-1">
                                        <h3 className={`text-sm md:text-base truncate ${!noti.read ? "font-black text-slate-950" : "font-bold text-slate-700"}`}>
                                            {noti.title}
                                        </h3>
                                        <span className="text-[10px] md:text-xs font-black text-slate-500 whitespace-nowrap flex items-center gap-1 uppercase tracking-widest">
                                            <Clock className="w-3 h-3 text-[#009FE3]" />
                                            {noti.timeDisplay || "Vừa xong"}
                                        </span>
                                    </div>
                                    <p className={`text-sm line-clamp-2 leading-relaxed ${!noti.read ? "text-slate-800 font-bold" : "text-slate-500 font-medium"}`}>
                                        {noti.message}
                                    </p>
                                </div>
                                <div className="shrink-0 self-center">
                                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-primary transition-colors" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-20 flex flex-col items-center justify-center text-center">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-300">
                            <Inbox size={40} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-400">Không có thông báo nào</h3>
                        <p className="text-sm text-slate-400 max-w-xs mt-1">
                            {search || filter !== "all" ? "Không tìm thấy thông báo nào khớp với bộ lọc hiện tại." : "Mọi thứ đều im ắng. Bạn chưa có thông báo mới nào từ hệ thống."}
                        </p>
                        {(search || filter !== "all") && (
                            <button
                                onClick={() => { setSearch(""); setFilter("all"); }}
                                className="mt-6 text-primary font-bold hover:underline"
                            >
                                Xóa tất cả bộ lọc
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationList;
