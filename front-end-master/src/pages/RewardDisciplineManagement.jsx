import React, { useState, useEffect } from 'react';
import RewardDisciplineService from '../api/RewardDisciplineService';
import axios from 'axios';
import Pagination from '../components/Pagination';
import { Plus, Download, Trash2, Loader2, AlertCircle } from 'lucide-react';
// Assuming you have a User API to get list of users for selection
// If not, we might need to use an existing one or create a simple one. 
// I'll assume we can use the one from UserManagement or similar.
// For now I'll check how to get users.

const RewardDisciplineManagement = () => {
    const [records, setRecords] = useState([]);
    const [users, setUsers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        userId: '',
        type: 'REWARD',
        reason: '',
        decisionNumber: '',
        decisionDate: '',
        effectiveDate: '',
        file: null
    });
    const [loading, setLoading] = useState(false);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    useEffect(() => {
        fetchRecords();
        fetchUsers();
    }, []);

    const fetchRecords = async () => {
        try {
            const data = await RewardDisciplineService.getAll();
            setRecords(data);
        } catch (error) {
            console.error("Error fetching records:", error);
        }
    };

    const fetchUsers = async () => {
        try {
            // Need to find the correct endpoint to get all user basic info
            // Assuming /api/users exists and returns list
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8080/api/users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(response.data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, file: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = new FormData();
            data.append('userId', formData.userId);
            data.append('type', formData.type);
            data.append('reason', formData.reason);
            data.append('decisionNumber', formData.decisionNumber);
            if (formData.decisionDate) {
                data.append('decisionDate', formData.decisionDate);
            }
            if (formData.effectiveDate) {
                data.append('effectiveDate', formData.effectiveDate);
            }
            if (formData.file) {
                data.append('file', formData.file);
            }

            await RewardDisciplineService.create(data);
            alert('Tạo quyết định thành công!');
            setIsModalOpen(false);
            fetchRecords();
            // Reset form
            setFormData({
                userId: '',
                type: 'REWARD',
                reason: '',
                decisionNumber: '',
                decisionDate: '',
                effectiveDate: '',
                file: null
            });
        } catch (error) {
            console.error("Error creating record:", error);
            alert('Có lỗi xảy ra!');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa?')) {
            try {
                await RewardDisciplineService.delete(id);
                fetchRecords();
            } catch (error) {
                console.error("Error deleting:", error);
                alert("Lỗi khi xóa!");
            }
        }
    };

    const handleDownload = async (fileName) => {
        if (!fileName) return;
        try {
            const response = await RewardDisciplineService.downloadFile(fileName);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName.split('_').slice(1).join('_')); // Remove uuid prefix for cleaner name if possible or just use filename
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Download error:", error);
            alert("Không thể tải file!");
        }
    };

    // Calculate pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentRecords = records.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);
    const handleItemsPerPageChange = (size) => {
        setItemsPerPage(size);
        setCurrentPage(1);
    };

    return (
        <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black text-slate-950 uppercase tracking-tight">Quản lý Khen thưởng & Kỷ luật</h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-[#009FE3] hover:bg-[#008bc7] text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-100 transition-all active:scale-95 flex items-center gap-2"
                >
                    <Plus size={18} /> Thêm quyết định mới
                </button>
            </div>

            <div className="overflow-x-auto border-none rounded-2xl bg-white">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/80 text-[10px] font-black text-slate-500 text-left uppercase tracking-widest border-b border-slate-50">
                            <th className="p-4">STT</th>
                            <th className="p-4">Nhân viên</th>
                            <th className="p-4">Loại</th>
                            <th className="p-4">Số QĐ</th>
                            <th className="p-4">Nội dung</th>
                            <th className="p-4">Ngày QĐ</th>
                            <th className="p-4">Ngày hiệu lực</th>
                            <th className="p-4">Đính kèm</th>
                            <th className="p-4">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentRecords.map((record, index) => (
                            <tr key={record.id} className="hover:bg-slate-50/50 border-b border-slate-50 transition">
                                <td className="p-4 text-slate-400 font-bold">{indexOfFirstItem + index + 1}</td>
                                <td className="p-4 font-bold text-slate-900">{record.employeeName}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${record.type === 'REWARD' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                                        }`}>
                                        {record.type === 'REWARD' ? 'Khen thưởng' : 'Kỷ luật'}
                                    </span>
                                </td>
                                <td className="p-4 font-black text-[#009FE3] uppercase tracking-wider">{record.decisionNumber}</td>
                                <td className="p-4 max-w-xs truncate text-slate-600 font-medium" title={record.reason}>{record.reason}</td>
                                <td className="p-4 text-slate-500 font-bold">{record.decisionDate}</td>
                                <td className="p-4 text-slate-500 font-bold">{record.effectiveDate}</td>
                                <td className="p-4 font-black">
                                    {record.attachmentPath ? (
                                        <button
                                            onClick={() => handleDownload(record.attachmentPath)}
                                            className="text-[#009FE3] hover:text-blue-700 flex items-center gap-1 transition font-bold"
                                        >
                                            <Download size={14} />
                                            Tải tập tin
                                        </button>
                                    ) : (
                                        <span className="text-slate-300 font-bold text-xs uppercase tracking-widest">Không có</span>
                                    )}
                                </td>
                                <td className="p-4">
                                    <button
                                        onClick={() => handleDelete(record.id)}
                                        className="p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                                        title="Xóa bản ghi"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {records.length === 0 && (
                            <tr>
                                <td colSpan="9" className="p-4 text-center text-gray-500">Chưa có dữ liệu</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <Pagination
                totalItems={records.length}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                onItemsPerPageChange={handleItemsPerPageChange}
            />

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-xl shadow-2xl animate-in zoom-in duration-300 overflow-hidden">
                        <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Thêm Quyết định mới</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><Plus size={24} className="rotate-45" /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Nhân viên thụ hưởng</label>
                                <select
                                    name="userId"
                                    value={formData.userId}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-slate-700 focus:ring-4 focus:ring-[#009FE3]/5 focus:bg-white transition-all outline-none"
                                >
                                    <option value="">-- Chọn nhân viên --</option>
                                    {users.map(u => (
                                        <option key={u.userId} value={u.userId}>{u.fullName} ({u.username})</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Loại hình</label>
                                    <select
                                        name="type"
                                        value={formData.type}
                                        onChange={handleInputChange}
                                        className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-slate-700 focus:ring-4 focus:ring-[#009FE3]/5 focus:bg-white transition-all outline-none"
                                    >
                                        <option value="REWARD">Khen thưởng</option>
                                        <option value="DISCIPLINE">Kỷ luật</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Số quyết định</label>
                                    <input
                                        type="text"
                                        name="decisionNumber"
                                        value={formData.decisionNumber}
                                        onChange={handleInputChange}
                                        className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-slate-700 focus:ring-4 focus:ring-[#009FE3]/5 focus:bg-white transition-all outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Nội dung / Lý do chi tiết</label>
                                <textarea
                                    name="reason"
                                    value={formData.reason}
                                    onChange={handleInputChange}
                                    rows="3"
                                    className="w-full bg-slate-50 border-none rounded-2xl p-4 font-medium text-slate-700 focus:ring-4 focus:ring-[#009FE3]/5 focus:bg-white transition-all outline-none resize-none"
                                ></textarea>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Ngày ra quyết định</label>
                                    <input
                                        type="date"
                                        name="decisionDate"
                                        value={formData.decisionDate}
                                        onChange={handleInputChange}
                                        className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-slate-700 focus:ring-4 focus:ring-[#009FE3]/5 focus:bg-white transition-all outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Ngày có hiệu lực</label>
                                    <input
                                        type="date"
                                        name="effectiveDate"
                                        value={formData.effectiveDate}
                                        onChange={handleInputChange}
                                        className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-slate-700 focus:ring-4 focus:ring-[#009FE3]/5 focus:bg-white transition-all outline-none"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Tài liệu đính kèm (PDF, Image)</label>
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    className="w-full text-sm text-slate-500 file:mr-4 file:py-3 file:px-6 file:rounded-2xl file:border-0 file:text-xs file:font-black file:uppercase file:tracking-widest file:bg-[#009FE3]/10 file:text-[#009FE3] hover:file:bg-[#009FE3]/20 cursor-pointer transition-all"
                                />
                            </div>

                            <div className="flex justify-end gap-4 pt-8 border-t border-slate-50">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-8 py-4 text-slate-500 bg-slate-50 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-100 transition-all"
                                >
                                    Hủy bỏ
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-10 py-4 bg-[#009FE3] hover:bg-[#008bc7] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-100 transition-all flex items-center gap-3 disabled:opacity-50"
                                >
                                    {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <Plus size={18} />}
                                    {loading ? 'Đang xử lý...' : 'Lưu quyết định'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RewardDisciplineManagement;
