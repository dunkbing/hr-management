import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPlus, FaSearch, FaEdit, FaTrash, FaTimes, FaFileContract, FaHistory, FaBriefcase } from "react-icons/fa";

const ContractManagement = () => {
    const [activeTab, setActiveTab] = useState("contracts"); // 'contracts' or 'history'

    // Data States
    const [contracts, setContracts] = useState([]);
    const [workHistories, setWorkHistories] = useState([]);
    const [users, setUsers] = useState([]);

    // UI States
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false); // Can be 'contract' or 'history' modal
    const [modalType, setModalType] = useState(""); // 'contract' or 'history'
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);

    // Forms
    const [contractForm, setContractForm] = useState({
        userId: "",
        contractCode: "",
        contractType: "THU_VIEC",
        signDate: "",
        startDate: "",
        endDate: "",
        status: "ACTIVE",
        note: ""
    });

    const [historyForm, setHistoryForm] = useState({
        userId: "",
        eventDate: "",
        eventType: "TIEP_NHAN",
        oldPosition: "",
        newPosition: "",
        oldDepartment: "",
        newDepartment: "",
        description: ""
    });

    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchUsers();
        if (activeTab === "contracts") fetchContracts();
        else fetchWorkHistories();
    }, [activeTab]);

    const fetchContracts = async () => {
        try {
            const res = await axios.get("http://localhost:8080/api/contracts", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setContracts(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchWorkHistories = async () => {
        try {
            const res = await axios.get("http://localhost:8080/api/work-history", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setWorkHistories(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchUsers = async () => {
        try {
            const res = await axios.get("http://localhost:8080/api/users", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    // Handlers
    const handleOpenAdd = () => {
        setIsEditing(false);
        setCurrentId(null);
        setModalType(activeTab === "contracts" ? "contract" : "history");

        // Reset forms
        setContractForm({ userId: "", contractCode: "", contractType: "THU_VIEC", signDate: "", startDate: "", endDate: "", status: "ACTIVE", note: "" });
        setHistoryForm({ userId: "", eventDate: "", eventType: "TIEP_NHAN", oldPosition: "", newPosition: "", oldDepartment: "", newDepartment: "", description: "" });

        setShowModal(true);
    };

    const handleOpenEdit = (item) => {
        setIsEditing(true);
        setCurrentId(item.id);
        if (activeTab === "contracts") {
            setModalType("contract");
            setContractForm({
                userId: item.userId,
                contractCode: item.contractCode,
                contractType: item.contractType,
                signDate: item.signDate || "",
                startDate: item.startDate || "",
                endDate: item.endDate || "",
                status: item.status,
                note: item.note || ""
            });
        } else {
            setModalType("history");
            setHistoryForm({
                userId: item.userId,
                eventDate: item.eventDate || "",
                eventType: item.eventType,
                oldPosition: item.oldPosition || "",
                newPosition: item.newPosition || "",
                oldDepartment: item.oldDepartment || "",
                newDepartment: item.newDepartment || "",
                description: item.description || ""
            });
        }
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa?")) return;
        try {
            const url = activeTab === "contracts"
                ? `http://localhost:8080/api/contracts/${id}`
                : `http://localhost:8080/api/work-history/${id}`;

            await axios.delete(url, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("✅ Xóa thành công!");
            activeTab === "contracts" ? fetchContracts() : fetchWorkHistories();
        } catch (err) {
            alert("❌ Lỗi: " + (err.response?.data?.message || "Không thể xóa"));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (modalType === "contract") {
                // Validation
                if (!contractForm.userId) {
                    alert("⚠️ Vui lòng chọn Nhân sự!");
                    return;
                }
                if (!contractForm.contractCode) {
                    alert("⚠️ Vui lòng nhập Mã hợp đồng!");
                    return;
                }

                // Sanitize payload for Contract
                const payload = {
                    ...contractForm,
                    userId: parseInt(contractForm.userId),
                    signDate: contractForm.signDate || null,
                    startDate: contractForm.startDate || null,
                    endDate: contractForm.endDate || null,
                };

                if (isEditing) {
                    await axios.put(`http://localhost:8080/api/contracts/${currentId}`, payload, { headers: { Authorization: `Bearer ${token}` } });
                } else {
                    await axios.post("http://localhost:8080/api/contracts", payload, { headers: { Authorization: `Bearer ${token}` } });
                }
                fetchContracts();
            } else {
                // Validation
                if (!historyForm.userId) {
                    alert("⚠️ Vui lòng chọn Nhân sự!");
                    return;
                }

                // Sanitize payload for WorkHistory
                const payload = {
                    ...historyForm,
                    userId: parseInt(historyForm.userId),
                    eventDate: historyForm.eventDate || null,
                };

                if (isEditing) {
                    await axios.put(`http://localhost:8080/api/work-history/${currentId}`, payload, { headers: { Authorization: `Bearer ${token}` } });
                } else {
                    await axios.post("http://localhost:8080/api/work-history", payload, { headers: { Authorization: `Bearer ${token}` } });
                }
                fetchWorkHistories();
            }
            alert(`✅ ${isEditing ? "Cập nhật" : "Thêm"} thành công!`);
            setShowModal(false);
        } catch (err) {
            console.error("Submit Error:", err);
            const serverMessage = err.response?.data?.message || err.response?.data?.error || JSON.stringify(err.response?.data) || "Có lỗi xảy ra";
            alert(`❌ Lỗi: ${serverMessage}`);
        }
    };

    // Rendering Helper
    const renderContractsTable = () => {
        const filtered = contracts.filter(c =>
            c.contractCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
        );

        return (
            <table className="min-w-full border-collapse">
                <thead>
                    <tr className="bg-slate-50/80 text-[10px] font-black text-slate-500 text-left uppercase tracking-widest border-b border-slate-50">
                        <th className="p-4">Mã HĐ</th>
                        <th className="p-4">Nhân sự</th>
                        <th className="p-4">Loại HĐ</th>
                        <th className="p-4">Ngày ký</th>
                        <th className="p-4">Hiệu lực</th>
                        <th className="p-4">Trạng thái</th>
                        <th className="p-4 text-center">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {filtered.map(c => (
                        <tr key={c.id} className="hover:bg-slate-50/50 border-b border-slate-50 transition">
                            <td className="p-4 font-black text-[#009FE3] uppercase tracking-wider">{c.contractCode}</td>
                            <td className="p-4 font-bold text-slate-900">{c.fullName}</td>
                            <td className="p-4 text-slate-600 font-medium">
                                {c.contractType === "THU_VIEC" && "Thử việc"}
                                {c.contractType === "XAC_DINH_THOI_HAN" && "Xác định thời hạn"}
                                {c.contractType === "KHONG_XAC_DINH_THOI_HAN" && "Không xác định thời hạn"}
                            </td>
                            <td className="p-4 text-slate-600 font-medium">{c.signDate}</td>
                            <td className="p-4 text-slate-600 font-medium">{c.startDate} - {c.endDate || "∞"}</td>
                            <td className="p-4">
                                <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${c.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                    {c.status === 'ACTIVE' ? "Hiệu lực" : c.status === 'EXPIRED' ? "Hết hạn" : "Chấm dứt"}
                                </span>
                            </td>
                            <td className="p-4 text-center">
                                <button onClick={() => handleOpenEdit(c)} className="text-blue-500 bg-blue-100 p-2 rounded-full mr-2"><FaEdit /></button>
                                <button onClick={() => handleDelete(c.id)} className="text-red-500 bg-red-100 p-2 rounded-full"><FaTrash /></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    const renderHistoryTable = () => {
        const filtered = workHistories.filter(h =>
            h.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            h.eventType?.toLowerCase().includes(searchTerm.toLowerCase())
        );

        return (
            <table className="min-w-full border-collapse">
                <thead>
                    <tr className="bg-slate-50/80 text-[10px] font-black text-slate-500 text-left uppercase tracking-widest border-b border-slate-50">
                        <th className="p-4">Nhân sự</th>
                        <th className="p-4">Ngày sự kiện</th>
                        <th className="p-4">Loại sự kiện</th>
                        <th className="p-4">Thay đổi vị trí</th>
                        <th className="p-4">Thay đổi đơn vị</th>
                        <th className="p-4 text-center">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {filtered.map(h => (
                        <tr key={h.id} className="hover:bg-slate-50/50 border-b border-slate-50 transition">
                            <td className="p-4 font-bold text-slate-900">{h.fullName}</td>
                            <td className="p-4 text-slate-600 font-medium">{h.eventDate}</td>
                            <td className="p-4 text-[#009FE3] font-bold text-xs uppercase tracking-wider">{h.eventType}</td>
                            <td className="p-4">
                                <div className="text-[10px] font-bold text-slate-400 uppercase">Cũ: {h.oldPosition || "-"}</div>
                                <div className="font-bold text-slate-800 text-sm italic">Mới: {h.newPosition || "-"}</div>
                            </td>
                            <td className="p-4">
                                <div className="text-[10px] font-bold text-slate-400 uppercase">Cũ: {h.oldDepartment || "-"}</div>
                                <div className="font-bold text-slate-800 text-sm italic">Mới: {h.newDepartment || "-"}</div>
                            </td>
                            <td className="p-4 text-center">
                                <button onClick={() => handleOpenEdit(h)} className="text-blue-500 bg-blue-100 p-2 rounded-full mr-2"><FaEdit /></button>
                                <button onClick={() => handleDelete(h.id)} className="text-red-500 bg-red-100 p-2 rounded-full"><FaTrash /></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    return (
        <div className="p-6 relative space-y-6">
            <h1 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <FaFileContract className="text-[#009FE3]" /> QUẢN LÝ HỢP ĐỒNG & CÔNG TÁC
            </h1>

            <div className="flex gap-1 p-1 bg-slate-100 rounded-xl mb-6 w-fit">
                <button
                    className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'contracts' ? 'bg-white shadow-sm text-[#009FE3]' : 'text-slate-500 hover:text-slate-700'}`}
                    onClick={() => { setActiveTab('contracts'); setSearchTerm(""); }}
                >
                    <FaFileContract className="inline mr-2" /> Hợp đồng
                </button>
                <button
                    className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'history' ? 'bg-white shadow-sm text-[#009FE3]' : 'text-slate-500 hover:text-slate-700'}`}
                    onClick={() => { setActiveTab('history'); setSearchTerm(""); }}
                >
                    <FaHistory className="inline mr-2" /> Công tác
                </button>
            </div>

            <div className="flex justify-between items-center mb-6">
                <div className="relative w-80">
                    <FaSearch className="absolute left-3 top-3 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 w-full bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#009FE3]/20 transition-all font-medium text-slate-700 shadow-sm"
                    />
                </div>

                <button
                    onClick={handleOpenAdd}
                    className="flex items-center gap-2 bg-[#009FE3] text-white px-6 py-2 rounded-xl font-bold shadow-lg hover:shadow-blue-200 transition-all active:scale-95"
                >
                    <FaPlus /> Thêm {activeTab === 'contracts' ? 'Hợp đồng' : 'Sự kiện'}
                </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto border-none rounded-2xl bg-white shadow-sm border border-slate-100">
                {activeTab === 'contracts' ? renderContractsTable() : renderHistoryTable()}
            </div>

            {/* MODAL */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 transform transition-all scale-100 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6 border-b pb-4">
                            <h2 className="text-xl font-bold text-gray-800">
                                {isEditing ? "Cập nhật" : "Thêm mới"} {modalType === 'contract' ? "Hợp đồng" : "Sự kiện công tác"}
                            </h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-red-500">
                                <FaTimes size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* User Select (Create only) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nhân sự <span className="text-red-500">*</span></label>
                                <select
                                    value={modalType === 'contract' ? contractForm.userId : historyForm.userId}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (modalType === 'contract') setContractForm({ ...contractForm, userId: val });
                                        else setHistoryForm({ ...historyForm, userId: val });
                                    }}
                                    disabled={isEditing}
                                    required
                                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 bg-white"
                                >
                                    <option value="">-- Chọn nhân sự --</option>
                                    {users.map(u => (
                                        <option key={u.userId} value={u.userId}>{u.fullName}</option>
                                    ))}
                                </select>
                            </div>

                            {modalType === 'contract' ? (
                                <>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Mã HĐ <span className="text-red-500">*</span></label>
                                            <input type="text" value={contractForm.contractCode} onChange={e => setContractForm({ ...contractForm, contractCode: e.target.value })} required className="w-full border rounded-lg px-3 py-2" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Loại HĐ</label>
                                            <select value={contractForm.contractType} onChange={e => setContractForm({ ...contractForm, contractType: e.target.value })} className="w-full border rounded-lg px-3 py-2 bg-white">
                                                <option value="THU_VIEC">Thử việc</option>
                                                <option value="XAC_DINH_THOI_HAN">Xác định thời hạn</option>
                                                <option value="KHONG_XAC_DINH_THOI_HAN">Không xác định thời hạn</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-3">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Ngày ký</label>
                                            <input type="date" value={contractForm.signDate} onChange={e => setContractForm({ ...contractForm, signDate: e.target.value })} className="w-full border rounded-lg px-2 py-2" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Bắt đầu</label>
                                            <input type="date" value={contractForm.startDate} onChange={e => setContractForm({ ...contractForm, startDate: e.target.value })} className="w-full border rounded-lg px-2 py-2" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Kết thúc</label>
                                            <input type="date" value={contractForm.endDate} onChange={e => setContractForm({ ...contractForm, endDate: e.target.value })} className="w-full border rounded-lg px-2 py-2" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                                        <select value={contractForm.status} onChange={e => setContractForm({ ...contractForm, status: e.target.value })} className="w-full border rounded-lg px-3 py-2 bg-white">
                                            <option value="ACTIVE">Hiệu lực</option>
                                            <option value="EXPIRED">Hết hạn</option>
                                            <option value="TERMINATED">Chấm dứt</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
                                        <textarea value={contractForm.note} onChange={e => setContractForm({ ...contractForm, note: e.target.value })} rows="2" className="w-full border rounded-lg px-3 py-2"></textarea>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Ngày sự kiện</label>
                                            <input type="date" value={historyForm.eventDate} onChange={e => setHistoryForm({ ...historyForm, eventDate: e.target.value })} className="w-full border rounded-lg px-3 py-2" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Loại sự kiện</label>
                                            <select value={historyForm.eventType} onChange={e => setHistoryForm({ ...historyForm, eventType: e.target.value })} className="w-full border rounded-lg px-3 py-2 bg-white">
                                                <option value="TIEP_NHAN">Tiếp nhận</option>
                                                <option value="DIEU_CHUYEN">Điều chuyển</option>
                                                <option value="BO_NHIEM">Bổ nhiệm</option>
                                                <option value="MIEN_NHIEM">Miễn nhiệm</option>
                                                <option value="THANG_CHUC">Thăng chức</option>
                                                <option value="THAY_DOI_CHUC_DANH">Thay đổi chức danh</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Vị trí cũ</label>
                                            <input type="text" value={historyForm.oldPosition} onChange={e => setHistoryForm({ ...historyForm, oldPosition: e.target.value })} className="w-full border rounded-lg px-3 py-2" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Vị trí mới</label>
                                            <input type="text" value={historyForm.newPosition} onChange={e => setHistoryForm({ ...historyForm, newPosition: e.target.value })} className="w-full border rounded-lg px-3 py-2" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Đơn vị cũ</label>
                                            <input type="text" value={historyForm.oldDepartment} onChange={e => setHistoryForm({ ...historyForm, oldDepartment: e.target.value })} className="w-full border rounded-lg px-3 py-2" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Đơn vị mới</label>
                                            <input type="text" value={historyForm.newDepartment} onChange={e => setHistoryForm({ ...historyForm, newDepartment: e.target.value })} className="w-full border rounded-lg px-3 py-2" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả chi tiết</label>
                                        <textarea value={historyForm.description} onChange={e => setHistoryForm({ ...historyForm, description: e.target.value })} rows="3" className="w-full border rounded-lg px-3 py-2"></textarea>
                                    </div>
                                </>
                            )}

                            <div className="pt-4 flex gap-3 justify-end">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 font-medium"
                                >
                                    Hủy bỏ
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium shadow-md"
                                >
                                    {isEditing ? "Lưu thay đổi" : "Tạo mới"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContractManagement;
