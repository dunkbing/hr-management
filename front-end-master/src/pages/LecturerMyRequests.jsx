import React, { useState, useEffect } from "react";
import { ClipboardList, Clock, CheckCircle2, XCircle, Search, Eye, Loader2, Filter, AlertCircle, ChevronDown } from "lucide-react";
import axiosClient from "../api/axiosClient";

const LecturerMyRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedReq, setSelectedReq] = useState(null);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("ALL");

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const res = await axiosClient.get("/personnel-requests/my");
            // Sắp xếp yêu cầu mới nhất lên đầu
            setRequests(res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        } catch (err) {
            console.error("Error fetching requests:", err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusInfo = (status) => {
        switch (status) {
            case "PENDING_ADMIN":
                return { label: "Chờ Admin duyệt", color: "text-blue-600 bg-blue-50 border-blue-100", icon: Clock };
            case "PENDING_PRINCIPAL":
                return { label: "Chờ Hiệu trưởng duyệt", color: "text-amber-600 bg-amber-50 border-amber-100", icon: Clock };
            case "APPROVED":
                return { label: "Đã phê duyệt", color: "text-emerald-600 bg-emerald-50 border-emerald-100", icon: CheckCircle2 };
            case "REJECTED":
                return { label: "Bị từ chối", color: "text-rose-600 bg-rose-50 border-rose-100", icon: XCircle };
            default:
                return { label: status, color: "text-slate-600 bg-slate-50 border-slate-100", icon: Clock };
        }
    };

    const filteredRequests = requests.filter(req => {
        const matchesSearch = req.title.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter === "ALL" || (filter === "PENDING" && req.status.startsWith("PENDING")) || req.status === filter;
        return matchesSearch && matchesFilter;
    });

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[500px] gap-4">
            <Loader2 className="animate-spin h-12 w-12 text-[#009FE3]" />
            <p className="text-gray-400 font-black text-[10px] uppercase tracking-[0.2em]">Đang đồng bộ dữ liệu...</p>
        </div>
    );

    return (
        <div className="p-6 lg:p-10 bg-[#F8FAFC] min-h-screen">
            <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">

                {/* Header & Stats */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-black text-gray-800 flex items-center gap-4 tracking-tight">
                            <div className="p-3 bg-blue-50 text-[#009FE3] rounded-2xl">
                                <ClipboardList size={28} />
                            </div>
                            Lịch sử yêu cầu của tôi
                        </h1>
                        <p className="text-gray-500 font-medium ml-1">Quản lý và theo dõi tiến độ phê duyệt các đề xuất của bạn.</p>
                    </div>
                </div>

                {/* Filters & Tools */}
                <div className="bg-white p-4 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo tiêu đề yêu cầu..."
                            className="w-full pl-16 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-400 transition-all text-sm font-bold text-gray-700 outline-none"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-2 w-full md:w-auto">
                        <select
                            className="flex-1 md:w-48 bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-gray-600 outline-none cursor-pointer hover:bg-slate-100 transition-colors"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        >
                            <option value="ALL">Tất cả trạng thái</option>
                            <option value="PENDING">🕒 Đang chờ duyệt</option>
                            <option value="APPROVED">✅ Đã phê duyệt</option>
                            <option value="REJECTED">❌ Đã từ chối</option>
                        </select>
                    </div>
                </div>

                {/* Requests Grid */}
                <div className="grid grid-cols-1 gap-4">
                    {filteredRequests.length === 0 ? (
                        <div className="bg-white p-20 rounded-[3rem] border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-gray-300">
                            <AlertCircle size={48} className="mb-4 opacity-20" />
                            <p className="font-black text-sm uppercase tracking-widest mb-1">Không tìm thấy kết quả</p>
                            <p className="text-xs font-medium">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm của bạn.</p>
                        </div>
                    ) : (
                        filteredRequests.map(req => {
                            const status = getStatusInfo(req.status);
                            return (
                                <div key={req.id} className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 group">
                                    <div className="flex items-start md:items-center gap-6">
                                        <div className={`p-5 rounded-2xl shrink-0 transition-transform group-hover:scale-110 duration-500 ${status.color}`}>
                                            <status.icon size={28} />
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex flex-wrap items-center gap-2 mb-1">
                                                <span className="text-[10px] font-black text-blue-500 bg-blue-50 px-2.5 py-1 rounded-lg uppercase tracking-wider">{req.type}</span>
                                                <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">{new Date(req.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-800 group-hover:text-[#009FE3] transition-colors">{req.title}</h3>
                                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mt-2 ${status.color}`}>
                                                <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${status.color.split(' ')[0] === 'text-blue-600' ? 'bg-blue-600' : status.color.split(' ')[0] === 'text-amber-600' ? 'bg-amber-600' : status.color.split(' ')[0] === 'text-emerald-600' ? 'bg-emerald-600' : 'bg-rose-600'}`}></div>
                                                {status.label}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 self-end md:self-center">
                                        <button
                                            onClick={() => setSelectedReq(req)}
                                            className="flex items-center gap-2 px-6 py-3 bg-slate-50 hover:bg-[#009FE3] text-gray-500 hover:text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all hover:shadow-lg active:scale-95"
                                        >
                                            <Eye size={16} />
                                            Chi tiết
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Modal chi tiết */}
            {selectedReq && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-[3rem] w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-300 relative border border-white/20">
                        <div className={`p-8 md:p-12 ${getStatusInfo(selectedReq.status).color} bg-opacity-10 border-b border-white`}>
                            <div className="flex justify-between items-start">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                        <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border ${getStatusInfo(selectedReq.status).color}`}>
                                            {selectedReq.type}
                                        </span>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                            ID: #{selectedReq.id}
                                        </span>
                                    </div>
                                    <h2 className="text-3xl font-black text-gray-800 leading-tight">{selectedReq.title}</h2>
                                    <p className="text-sm text-gray-500 font-medium">Ngày gửi: {new Date(selectedReq.createdAt).toLocaleDateString()}</p>
                                </div>
                                <button
                                    onClick={() => setSelectedReq(null)}
                                    className="p-3 bg-white hover:bg-rose-50 text-gray-400 hover:text-rose-500 rounded-2xl shadow-sm transition-all active:scale-90"
                                >
                                    <XCircle size={24} />
                                </button>
                            </div>
                        </div>

                        <div className="p-8 md:p-12 space-y-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nội dung đề xuất</label>
                                <div className="bg-slate-50 p-8 rounded-[2rem] text-gray-700 leading-relaxed italic border border-slate-100 font-medium whitespace-pre-wrap">
                                    "{selectedReq.content}"
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest ml-1">Phản hồi từ Admin</label>
                                    <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100 text-sm font-bold text-blue-700 min-h-[80px] flex items-center italic">
                                        {selectedReq.adminNote || "Đang chờ Admin thẩm định..."}
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-emerald-400 uppercase tracking-widest ml-1">Quyết định Hiệu trưởng</label>
                                    <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100 text-sm font-bold text-emerald-700 min-h-[80px] flex items-center italic">
                                        {selectedReq.principalNote || "Đang chờ Hiệu trưởng phê chuẩn..."}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 bg-slate-50/50 border-t border-slate-100 flex justify-end">
                            <button
                                onClick={() => setSelectedReq(null)}
                                className="px-10 py-4 bg-white hover:bg-slate-100 text-gray-500 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-sm border border-slate-200"
                            >
                                Đóng cửa sổ
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LecturerMyRequests;
