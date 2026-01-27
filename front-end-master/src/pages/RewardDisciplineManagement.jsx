import React, { useState, useEffect } from 'react';
import RewardDisciplineService from '../api/RewardDisciplineService';
import axios from 'axios';
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

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Quản lý Khen thưởng & Kỷ luật</h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                    + Thêm mới
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-100 text-gray-700">
                            <th className="p-3 border-b">STT</th>
                            <th className="p-3 border-b">Nhân viên</th>
                            <th className="p-3 border-b">Loại</th>
                            <th className="p-3 border-b">Số QĐ</th>
                            <th className="p-3 border-b">Nội dung</th>
                            <th className="p-3 border-b">Ngày QĐ</th>
                            <th className="p-3 border-b">Ngày hiệu lực</th>
                            <th className="p-3 border-b">Đính kèm</th>
                            <th className="p-3 border-b">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {records.map((record, index) => (
                            <tr key={record.id} className="hover:bg-gray-50 border-b">
                                <td className="p-3">{index + 1}</td>
                                <td className="p-3 font-medium">{record.employeeName}</td>
                                <td className="p-3">
                                    <span className={`px-2 py-1 rounded text-sm ${record.type === 'REWARD' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                        {record.type === 'REWARD' ? 'Khen thưởng' : 'Kỷ luật'}
                                    </span>
                                </td>
                                <td className="p-3">{record.decisionNumber}</td>
                                <td className="p-3 max-w-xs truncate" title={record.reason}>{record.reason}</td>
                                <td className="p-3">{record.decisionDate}</td>
                                <td className="p-3">{record.effectiveDate}</td>
                                <td className="p-3">
                                    {record.attachmentPath ? (
                                        <button
                                            onClick={() => handleDownload(record.attachmentPath)}
                                            className="text-blue-600 hover:underline"
                                        >
                                            Tải về
                                        </button>
                                    ) : (
                                        <span className="text-gray-400">Không có</span>
                                    )}
                                </td>
                                <td className="p-3">
                                    <button
                                        onClick={() => handleDelete(record.id)}
                                        className="text-red-500 hover:text-red-700 transition"
                                    >
                                        Xóa
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

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-lg shadow-xl animate-fade-in">
                        <h3 className="text-xl font-semibold mb-4 text-gray-800">Thêm Quyết định mới</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nhân viên</label>
                                <select
                                    name="userId"
                                    value={formData.userId}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                >
                                    <option value="">-- Chọn nhân viên --</option>
                                    {users.map(u => (
                                        <option key={u.userId} value={u.userId}>{u.fullName} ({u.username})</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Loại</label>
                                    <select
                                        name="type"
                                        value={formData.type}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                    >
                                        <option value="REWARD">Khen thưởng</option>
                                        <option value="DISCIPLINE">Kỷ luật</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Số quyết định</label>
                                    <input
                                        type="text"
                                        name="decisionNumber"
                                        value={formData.decisionNumber}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung / Lý do</label>
                                <textarea
                                    name="reason"
                                    value={formData.reason}
                                    onChange={handleInputChange}
                                    rows="3"
                                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                ></textarea>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Ngày quyết định</label>
                                    <input
                                        type="date"
                                        name="decisionDate"
                                        value={formData.decisionDate}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Ngày hiệu lực</label>
                                    <input
                                        type="date"
                                        name="effectiveDate"
                                        value={formData.effectiveDate}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">File đính kèm</label>
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                />
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                                >
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
