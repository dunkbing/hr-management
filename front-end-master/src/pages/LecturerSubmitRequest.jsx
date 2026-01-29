import React, { useState, useEffect } from "react";
import { Send, FileText, AlertCircle, CheckCircle2, History, Loader2 } from "lucide-react";
import axiosClient from "../api/axiosClient";
import { useNavigate } from "react-router-dom";

const LecturerSubmitRequest = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        type: "NGHI_PHEP",
        content: ""
    });

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axiosClient.get("/users/me");
                setUser(res.data);
            } catch (err) {
                console.error("Error fetching user:", err);
                setMessage({ type: "error", text: "Không thể lấy thông tin người dùng. Vui lòng đăng nhập lại." });
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user || !user.userId) {
            setMessage({ type: "error", text: "Lỗi xác thực: Không tìm thấy ID người dùng." });
            return;
        }

        if (!formData.title.trim() || !formData.content.trim()) {
            setMessage({ type: "error", text: "Vui lòng điền đầy đủ tiêu đề và nội dung." });
            return;
        }

        setSubmitting(true);
        setMessage({ type: "", text: "" });

        try {
            await axiosClient.post("/personnel-requests", formData);

            setMessage({ type: "success", text: "Yêu cầu của bạn đã được gửi thành công và đang chờ Admin phê duyệt." });
            setFormData({ title: "", type: "NGHI_PHEP", content: "" });

            // Redirect after success
            setTimeout(() => navigate("/lecturer/my-requests"), 2500);
        } catch (err) {
            console.error("Error submitting request:", err);
            const errorMsg = err.response?.data?.message || "Gửi yêu cầu thất bại. Vui lòng thử lại sau.";
            setMessage({ type: "error", text: errorMsg });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
            <Loader2 className="animate-spin h-12 w-12 text-[#009FE3]" />
            <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Đang tải thông tin...</p>
        </div>
    );

    return (
        <div className="p-6 lg:p-10 bg-[#F8FAFC] min-h-screen">
            <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in zoom-in duration-500">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-slate-950 flex items-center gap-4 tracking-tight">
                            <div className="p-3 bg-blue-50 text-[#009FE3] rounded-2xl shadow-sm">
                                <Send className="w-8 h-8" />
                            </div>
                            Gửi yêu cầu phê duyệt
                        </h1>
                        <p className="text-gray-500 mt-2 font-medium">Yêu cầu của bạn sẽ được phê duyệt qua 2 cấp: Admin và Hiệu trưởng</p>
                    </div>
                    <button
                        onClick={() => navigate("/lecturer/my-requests")}
                        className="flex items-center gap-3 text-gray-500 hover:text-[#009FE3] font-bold text-xs uppercase tracking-widest bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-100 transition-all hover:shadow-md active:scale-95"
                    >
                        <History className="w-4 h-4" />
                        Lịch sử yêu cầu
                    </button>
                </div>

                <div className="bg-white rounded-[3rem] shadow-xl shadow-blue-50/50 border border-slate-100 overflow-hidden">
                    <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-8">
                        {message.text && (
                            <div className={`p-6 rounded-[2rem] flex items-center gap-4 animate-in slide-in-from-top duration-500 shadow-sm border ${message.type === "success"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                : "bg-rose-50 text-rose-700 border-rose-100"
                                }`}>
                                <div className={`p-2 rounded-full ${message.type === "success" ? "bg-emerald-100" : "bg-rose-100"}`}>
                                    {message.type === "success" ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                                </div>
                                <p className="font-bold text-sm leading-relaxed">{message.text}</p>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Loại yêu cầu</label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-100 focus:bg-white rounded-[1.5rem] focus:ring-4 focus:ring-blue-50 transition-all font-bold text-gray-700 appearance-none cursor-pointer outline-none"
                                >
                                    <option value="NGHI_PHEP">🍃 Nghỉ phép</option>
                                    <option value="THANG_CHUC">📈 Đề xuất thăng chức</option>
                                    <option value="DIEU_CHUYEN">✈️ Công tác / Điều chuyển</option>
                                    <option value="KHAC">📄 Yêu cầu khác</option>
                                </select>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tiêu đề yêu cầu</label>
                                <div className="relative group">
                                    <FileText className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#009FE3] transition-colors" />
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full pl-16 pr-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-100 focus:bg-white rounded-[1.5rem] focus:ring-4 focus:ring-blue-50 transition-all font-bold text-gray-700 outline-none"
                                        placeholder="VD: Đơn xin nghỉ phép năm"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nội dung chi tiết</label>
                            <textarea
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                className="w-full px-8 py-6 bg-slate-50 border-2 border-transparent focus:border-blue-100 focus:bg-white rounded-[2rem] focus:ring-4 focus:ring-blue-50 transition-all font-medium text-gray-700 h-56 resize-none outline-none leading-relaxed"
                                placeholder="Hãy trình bày lý do và các mốc thời gian cụ thể cho yêu cầu của bạn..."
                                required
                            />
                        </div>

                        <div className="flex justify-between items-center pt-6 border-t border-slate-50">
                            <p className="text-xs text-gray-400 font-medium hidden md:block italic">
                                * Thông tin của bạn sẽ được bảo mật và chuyển trực tiếp tới phòng TCHC.
                            </p>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full md:w-auto flex items-center justify-center gap-4 bg-[#009FE3] hover:bg-[#0087c2] text-white px-12 py-5 rounded-[1.75rem] shadow-xl shadow-blue-100 hover:shadow-blue-200 active:scale-95 transition-all font-black text-xs uppercase tracking-widest disabled:opacity-50 disabled:pointer-events-none"
                            >
                                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                                Xác nhận gửi yêu cầu
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LecturerSubmitRequest;
