import React, { useState, useEffect } from "react";
import { CheckCircle2, XCircle, Clock, Eye, Search, FileSpreadsheet, Loader2, MessageSquare, ShieldCheck } from "lucide-react";
import axiosClient from "../api/axiosClient";

const PrincipalApprovalManagement = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReq, setSelectedReq] = useState(null);
  const [note, setNote] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await axiosClient.get("/personnel-requests/pending/principal");
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
      await axiosClient.post(`/personnel-requests/${id}/approve-principal`, { note });
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
      await axiosClient.post(`/personnel-requests/${id}/reject`, { note, isAdmin: "false" });
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

  const filteredRequests = requests.filter(r =>
    r.title.toLowerCase().includes(search.toLowerCase()) ||
    r.requesterName.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="p-10 text-center"><Loader2 className="animate-spin mx-auto w-10 h-10 text-emerald-500" /></div>;

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
            <ShieldCheck size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900">Phê duyệt cuối cùng (Hiệu trưởng)</h1>
            <p className="text-sm text-slate-500 font-bold italic">Các yêu cầu này đã được Admin thẩm định và đang chờ quyết định của bạn.</p>
          </div>
        </div>

        <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-emerald-100">
          <FileSpreadsheet size={20} />
          Xuất báo cáo phê duyệt
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Tìm kiếm theo tiêu đề hoặc người gửi..."
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-400 transition-all text-sm font-medium"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-black uppercase tracking-widest">
            {filteredRequests.length} Yêu cầu
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/80 text-[10px] font-black text-slate-500 text-left uppercase tracking-widest border-b border-slate-50">
                <th className="px-6 py-4">Yêu cầu</th>
                <th className="px-6 py-4">Người gửi</th>
                <th className="px-6 py-4">Loại</th>
                <th className="px-6 py-4">Ngày gửi</th>
                <th className="px-6 py-4 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredRequests.map(req => (
                <tr key={req.id} className="hover:bg-slate-50/50 border-b border-slate-50 transition-colors group">
                  <td className="px-6 py-5">
                    <p className="font-black text-slate-900 group-hover:text-emerald-600 transition-colors uppercase tracking-tight">{req.title}</p>
                    <p className="text-[10px] text-slate-400 font-black uppercase mt-1">Request ID: #{req.id}</p>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500 uppercase">
                        {req.requesterName?.charAt(0) || "U"}
                      </div>
                      <span className="text-sm font-black text-slate-800">{req.requesterName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg uppercase tracking-widest">{req.type}</span>
                  </td>
                  <td className="px-6 py-5 text-xs text-slate-500 font-black uppercase tracking-widest">
                    {new Date(req.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex justify-center">
                      <button
                        onClick={() => setSelectedReq(req)}
                        className="p-2.5 bg-white border border-slate-100 rounded-xl shadow-sm hover:border-emerald-200 hover:bg-emerald-50 group/btn transition-all"
                      >
                        <Eye size={18} className="text-slate-400 group-hover/btn:text-emerald-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredRequests.length === 0 && (
            <div className="p-20 text-center text-gray-300 font-bold uppercase tracking-widest text-sm">
              Không tìm thấy yêu cầu nào
            </div>
          )}
        </div>
      </div>

      {/* Modal chi tiết cho Hiệu trưởng */}
      {selectedReq && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[3rem] w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="p-10 bg-gradient-to-br from-emerald-600 to-teal-700 text-white relative">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-black bg-white/20 px-3 py-1 rounded-full uppercase tracking-widest border border-white/20">Cấp 2 - Hiệu trưởng</span>
                  <h2 className="text-3xl font-black mt-4">{selectedReq.title}</h2>
                  <p className="text-emerald-100 mt-2 font-medium opacity-80">Người gửi: {selectedReq.requesterName}</p>
                </div>
                <button onClick={() => setSelectedReq(null)} className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
                  <XCircle size={28} />
                </button>
              </div>
            </div>

            <div className="p-10 space-y-8">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Loại yêu cầu</p>
                  <p className="font-bold text-gray-700 mt-1">{selectedReq.type}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Ngày gửi</p>
                  <p className="font-bold text-gray-700 mt-1">{new Date(selectedReq.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block">Nội dung chi tiết</label>
                <div className="bg-emerald-50/30 p-8 rounded-3xl border border-emerald-50 text-gray-700 leading-relaxed italic">
                  "{selectedReq.content}"
                </div>
              </div>

              {selectedReq.adminNote && (
                <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-50">
                  <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2 block">Ý kiến của Admin (Cấp 1)</label>
                  <p className="text-sm text-blue-700 font-bold">{selectedReq.adminNote}</p>
                </div>
              )}

              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block flex items-center gap-2">
                  <MessageSquare size={14} />
                  Bút phê của Hiệu trưởng
                </label>
                <textarea
                  className="w-full bg-slate-50 border-none rounded-3xl p-6 text-sm focus:ring-2 focus:ring-emerald-400 outline-none min-h-[120px] font-bold text-gray-700"
                  placeholder="Nhập ý kiến chỉ đạo cuối cùng..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>

              <div className="flex gap-4 pt-2">
                <button
                  onClick={() => handleReject(selectedReq.id)}
                  disabled={actionLoading}
                  className="flex-1 flex items-center justify-center gap-3 bg-slate-100 hover:bg-rose-50 hover:text-rose-500 py-5 rounded-[1.5rem] font-bold transition-all text-gray-500 disabled:opacity-50"
                >
                  <XCircle size={24} />
                  Bác bỏ yêu cầu
                </button>
                <button
                  onClick={() => handleApprove(selectedReq.id)}
                  disabled={actionLoading}
                  className="flex-3 flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white py-5 rounded-[1.5rem] font-bold shadow-xl shadow-emerald-100 transition-all disabled:opacity-50"
                >
                  {actionLoading ? <Loader2 className="animate-spin w-6 h-6" /> : <CheckCircle2 size={24} />}
                  Chấp thuận & Ban hành
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrincipalApprovalManagement;
