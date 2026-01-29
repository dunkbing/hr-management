import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
    ArrowLeft,
    Bell,
    Clock,
    Calendar,
    MessageSquare,
    AlertCircle
} from "lucide-react";

const NotificationDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [notification, setNotification] = useState(null);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchNotificationDetail = async () => {
            try {
                // Backend doesn't have a direct "get detail" endpoint, but we can filter from all
                // or we can mark as read via the PUT endpoint which is already implemented
                // Let's mark it as read first
                await axios.put(`http://localhost:8080/api/notifications/${id}/read`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const res = await axios.get("http://localhost:8080/api/notifications", {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const detail = res.data.find(n => n.id === parseInt(id));
                setNotification(detail);
            } catch (err) {
                console.error("Failed to fetch notification detail", err);
            } finally {
                setLoading(false);
            }
        };

        fetchNotificationDetail();
    }, [id, token]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!notification) {
        return (
            <div className="p-6 lg:p-10 flex flex-col items-center justify-center min-h-screen">
                <AlertCircle className="w-16 h-16 text-slate-300 mb-4" />
                <h2 className="text-xl font-bold text-slate-800">Không tìm thấy thông báo</h2>
                <p className="text-slate-500 mt-2">Thông báo này có thể đã bị xóa hoặc bạn không có quyền xem.</p>
                <button
                    onClick={() => navigate("/notification")}
                    className="mt-6 flex items-center gap-2 text-primary font-bold hover:underline"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Quay lại danh sách
                </button>
            </div>
        );
    }

    return (
        <div className="p-6 lg:p-10 bg-[#F8FAFC] min-h-screen space-y-8 animate-in fade-in duration-500">
            {/* Back button */}
            <button
                onClick={() => navigate("/notification")}
                className="group flex items-center gap-2 text-slate-500 hover:text-primary transition-colors font-bold"
            >
                <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-100 group-hover:border-primary/20 transition-all">
                    <ArrowLeft className="w-5 h-5" />
                </div>
                Quay lại danh sách
            </button>

            <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
                    {/* Header */}
                    <div className="p-8 md:p-10 border-b border-slate-50">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-4 bg-blue-50 text-primary rounded-[20px]">
                                <Bell size={28} />
                            </div>
                            <div>
                                <h1 className="text-xl md:text-3xl font-black text-slate-950 leading-tight">
                                    {notification.title}
                                </h1>
                                <div className="flex flex-wrap items-center gap-4 mt-4">
                                    <span className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 bg-slate-100/50 px-3 py-1.5 rounded-lg uppercase tracking-widest">
                                        <Clock size={14} className="text-[#009FE3]" />
                                        {notification.timeDisplay || "Vừa xong"}
                                    </span>
                                    <span className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 bg-slate-100/50 px-3 py-1.5 rounded-lg uppercase tracking-widest">
                                        <Calendar size={14} className="text-[#009FE3]" />
                                        {new Date(notification.createdAt).toLocaleDateString("vi-VN")}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-8 md:p-10 space-y-8">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-slate-400 font-black uppercase tracking-widest text-[10px]">
                                <MessageSquare size={14} className="text-[#009FE3]" />
                                Nội dung chi tiết
                            </div>
                            <div className="text-slate-800 leading-relaxed space-y-4 text-base md:text-lg font-medium">
                                {notification.message.split('\n').map((line, i) => (
                                    <p key={i}>{line}</p>
                                ))}
                            </div>
                        </div>

                        <div className="pt-8 border-t border-slate-50">
                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                <p className="text-xs text-slate-500 font-medium italic">
                                    Thông báo này được hệ thống gửi tự động. Nếu bạn có thắc mắc hoặc cần hỗ trợ về nội dung này, vui lòng liên hệ bộ phận Quản trị hệ thống.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action button */}
                <div className="mt-8 flex justify-center">
                    <button
                        onClick={() => navigate("/dashboard")}
                        className="px-8 py-4 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5 transition-all w-full md:w-auto"
                    >
                        Về Trang chủ
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotificationDetail;
