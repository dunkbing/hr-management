import React, { useState, useEffect } from "react";
import { Plus, X, Eye, Loader2, Send, Clock, CheckCircle2, XCircle } from "lucide-react";
import axiosClient from "../api/axiosClient";

const FacultyProposals = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedReq, setSelectedReq] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    type: "NGHI_PHEP",
    content: ""
  });

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await axiosClient.get("/personnel-requests/my");
      setRequests(res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axiosClient.post("/personnel-requests", formData);
      setShowForm(false);
      setFormData({ title: "", type: "NGHI_PHEP", content: "" });
      fetchRequests();
    } catch (err) {
      console.error(err);
      alert("Gửi đề xuất thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case "PENDING_ADMIN": return { label: "Chờ Admin duyệt", color: "text-blue-600 bg-blue-50", icon: Clock };
      case "PENDING_PRINCIPAL": return { label: "Chờ Hiệu trưởng duyệt", color: "text-amber-600 bg-amber-50", icon: Clock };
      case "APPROVED": return { label: "Đã duyệt", color: "text-emerald-600 bg-emerald-50", icon: CheckCircle2 };
      case "REJECTED": return { label: "Từ chối", color: "text-rose-600 bg-rose-50", icon: XCircle };
      default: return { label: status, color: "text-gray-600 bg-gray-50", icon: Clock };
    }
  };

  if (loading) return <div className="p-10 text-center"><Loader2 className="animate-spin mx-auto w-10 h-10 text-blue-500" /></div>;

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-950 uppercase tracking-tight">Đề xuất & Yêu cầu của tôi</h1>
          <p className="text-slate-500 mt-1 font-bold text-sm">Theo dõi các yêu cầu công tác hoặc cá nhân gửi lên cấp trên.</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-[#009FE3] hover:bg-[#0087c2] text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-blue-100"
        >
          <Plus size={20} />
          Gửi đề xuất mới
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {requests.length === 0 ? (
          <div className="bg-white p-20 rounded-[2.5rem] border border-dashed border-slate-200 text-center text-gray-400 font-bold uppercase tracking-widest">
            Chưa có đề xuất nào
          </div>
        ) : (
          requests.map(req => {
            const status = getStatusInfo(req.status);
            return (
              <div key={req.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-all flex items-center justify-between group">
                <div className="flex items-center gap-5">
                  <div className={`p-4 rounded-2xl ${status.color}`}>
                    <status.icon size={24} />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-[10px] font-black text-blue-500 bg-blue-50 px-2 py-0.5 rounded-md uppercase tracking-wider">{req.type}</span>
                      <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{new Date(req.createdAt).toLocaleDateString()}</span>
                    </div>
                    <h3 className="text-lg font-black text-slate-900 group-hover:text-[#009FE3] transition-colors">{req.title}</h3>
                    <p className={`text-[10px] font-black mt-1 uppercase tracking-widest ${status.color.split(' ')[0]}`}>{status.label}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedReq(req)}
                  className="p-3 bg-slate-50 hover:bg-[#e0f3fc] text-slate-400 hover:text-[#009FE3] rounded-xl transition-all"
                >
                  <Eye size={20} />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* MODAL: SUBMIT FORM */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-xl shadow-2xl animate-in zoom-in duration-300 overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Soạn đề xuất mới</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Loại đề xuất</label>
                  <select
                    className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-gray-700 focus:ring-2 focus:ring-blue-400 transition-all shadow-inner"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  >
                    <option value="NGHI_PHEP">Nghỉ phép</option>
                    <option value="THANG_CHUC">Thăng chức</option>
                    <option value="DIEU_CHUYEN">Điều chuyển</option>
                    <option value="KHAC">Khác</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Tiêu đề</label>
                  <input
                    type="text"
                    className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-gray-700 focus:ring-2 focus:ring-blue-400 transition-all shadow-inner"
                    placeholder="VD: Đề xuất nhân sự..."
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nội dung chi tiết</label>
                <textarea
                  className="w-full bg-slate-50 border-none rounded-2xl p-4 font-medium text-gray-700 focus:ring-2 focus:ring-blue-400 transition-all shadow-inner min-h-[150px]"
                  placeholder="Nhập nội dung đề xuất của bạn..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#009FE3] hover:bg-[#0087c2] text-white py-4 rounded-2xl font-bold shadow-xl shadow-blue-100 transition-all flex items-center justify-center gap-2"
              >
                {submitting ? <Loader2 className="animate-spin w-5 h-5" /> : <Send size={20} />}
                Xác nhận gửi đề xuất
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: DETAIL */}
      {selectedReq && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-xl shadow-2xl animate-in zoom-in duration-300 overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
              <div>
                <span className="text-[10px] font-black text-blue-500 bg-blue-100/50 px-3 py-1 rounded-full uppercase tracking-widest">{selectedReq.type}</span>
                <h2 className="text-xl font-bold text-gray-800 mt-2">{selectedReq.title}</h2>
              </div>
              <button onClick={() => setSelectedReq(null)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
            </div>
            <div className="p-8 space-y-6">
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Nội dung đề xuất</p>
                <div className="bg-slate-50 p-6 rounded-2xl text-gray-700 italic border border-slate-100">
                  "{selectedReq.content}"
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50">
                  <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Phản hồi Admin</p>
                  <p className="text-sm font-bold text-gray-600 mt-1">{selectedReq.adminNote || "Chưa có phản hồi"}</p>
                </div>
                <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100/50">
                  <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Hiệu trưởng quyết định</p>
                  <p className="text-sm font-bold text-gray-600 mt-1">{selectedReq.principalNote || "Chưa có phản hồi"}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-50 flex justify-center">
                <button
                  onClick={() => setSelectedReq(null)}
                  className="bg-slate-100 hover:bg-slate-200 text-gray-500 px-8 py-3 rounded-xl font-bold transition-all"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultyProposals;
