import React, { useState, useEffect } from "react";
import { ClipboardCheck, Clock, CheckCircle2, XCircle, Eye, Loader2, MessageSquare } from "lucide-react";
import axiosClient from "../api/axiosClient";

const FacultyHeadApproval = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedReq, setSelectedReq] = useState(null);
    const [note, setNote] = useState("");
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const res = await axiosClient.get("/personnel-requests/pending/faculty-head");
            setRequests(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        setActionLoading(true);
        try {
            await axiosClient.post(`/personnel-requests/${id}/approve-faculty-head`, { note });
            setRequests(requests.filter(r => r.id !== id));
            setSelectedReq(null);
            setNote("");
        } catch (err) {
            console.error(err);
            alert("Phê duyệt thất bại");
        } finally {
            setActionLoading(false);
        }
    };

    const handleReject = async (id) => {
        setActionLoading(true);
        try {
            await axiosClient.post(`/personnel-requests/${id}/reject`, { note, rejectedBy: "faculty_head" });
            setRequests(requests.filter(r => r.id !== id));
            setSelectedReq(null);
            setNote("");
        } catch (err) {
            console.error(err);
            alert("Từ chối thất bại");
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) return <div className="p-10 text-center"><Loader2 className="animate-spin mx-auto w-10 h-10 text-indigo-500" /></div>;

    return (
        <div className="p-6">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                    <ClipboardCheck size={28} />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Phê duyệt yêu cầu (Trưởng khoa)</h1>
                    <p className="text-sm text-slate-500 font-medium">Các yêu cầu từ giảng viên trong khoa đang chờ bạn xét duyệt</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {requests.length === 0 ? (
                    <div className="bg-white p-12 rounded-3xl border border-dashed text-center text-gray-400">
                        Hiện không có yêu cầu nào chờ phê duyệt.
                    </div>
                ) : (
                    requests.map(req => (
                        <div key={req.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-all">
                            <div className="flex items-center gap-4">
                                <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl">
                                    <Clock size={24} />
                                </div>
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md uppercase tracking-widest">{req.type}</span>
                                        <span className="text-xs text-slate-400 font-bold">{new Date(req.createdAt).toLocaleDateString("vi-VN")}</span>
                                    </div>
                                    <h3 className="text-lg font-black text-slate-900">{req.title}</h3>
                                    <p className="text-sm text-slate-500 font-bold">Người gửi: <span className="text-indigo-600">{req.requesterName}</span></p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedReq(req)}
                                className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-600 px-5 py-3 rounded-xl font-bold text-sm transition-all"
                            >
                                <Eye size={18} />
                                Xem & Phê duyệt
                            </button>
                        </div>
                    ))
                )}
            </div>

            {/* Modal chi tiết */}
            {selectedReq && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl animate-in zoom-in duration-300">
                        <div className="p-8 border-b border-slate-50">
                            <div className="flex justify-between items-start">
                                <div>
                                    <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-widest">{selectedReq.type}</span>
                                    <h2 className="text-2xl font-black text-slate-900 mt-2">{selectedReq.title}</h2>
                                    <p className="text-sm text-slate-500 font-bold mt-1">Gửi bởi: <span className="text-indigo-600">{selectedReq.requesterName}</span></p>
                                </div>
                                <button onClick={() => setSelectedReq(null)} className="p-2 hover:bg-slate-50 rounded-full transition-colors text-gray-400">
                                    <XCircle size={24} />
                                </button>
                            </div>
                        </div>

                        <div className="p-8 space-y-6">
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">Nội dung yêu cầu</label>
                                <div className="bg-slate-50 p-6 rounded-2xl text-gray-700 leading-relaxed min-h-[100px]">
                                    {selectedReq.content}
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block flex items-center gap-2">
                                    <MessageSquare size={14} />
                                    Ghi chú phê duyệt
                                </label>
                                <textarea
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-indigo-600/20 transition-all outline-none min-h-[100px]"
                                    placeholder="Nhập ý kiến chỉ đạo hoặc lý do từ chối nếu có..."
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                />
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    onClick={() => handleReject(selectedReq.id)}
                                    disabled={actionLoading}
                                    className="flex-1 flex items-center justify-center gap-2 border-2 border-rose-500 text-rose-500 hover:bg-rose-50 py-4 rounded-2xl font-bold transition-all disabled:opacity-50"
                                >
                                    <XCircle size={20} />
                                    Từ chối yêu cầu
                                </button>
                                <button
                                    onClick={() => handleApprove(selectedReq.id)}
                                    disabled={actionLoading}
                                    className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-bold shadow-xl shadow-indigo-100 transition-all disabled:opacity-50"
                                >
                                    {actionLoading ? <Loader2 className="animate-spin w-5 h-5" /> : <CheckCircle2 size={20} />}
                                    Duyệt & Chuyển Admin
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FacultyHeadApproval;
