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
                    <tr className="bg-blue-50 text-sm text-gray-700 text-left">
                        <th className="p-4 font-semibold border-b">Mã HĐ</th>
                        <th className="p-4 font-semibold border-b">Nhân sự</th>
                        <th className="p-4 font-semibold border-b">Loại HĐ</th>
                        <th className="p-4 font-semibold border-b">Ngày ký</th>
                        <th className="p-4 font-semibold border-b">Hiệu lực</th>
                        <th className="p-4 font-semibold border-b">Trạng thái</th>
                        <th className="p-4 font-semibold border-b text-center">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {filtered.map(c => (
                        <tr key={c.id} className="hover:bg-gray-50 border-b">
                            <td className="p-4 font-medium text-blue-600">{c.contractCode}</td>
                            <td className="p-4">{c.fullName}</td>
                            <td className="p-4">
                                {c.contractType === "THU_VIEC" && "Thử việc"}
                                {c.contractType === "XAC_DINH_THOI_HAN" && "Xác định thời hạn"}
                                {c.contractType === "KHONG_XAC_DINH_THOI_HAN" && "Không xác định thời hạn"}
                            </td>
                            <td className="p-4">{c.signDate}</td>
                            <td className="p-4">{c.startDate} - {c.endDate || "∞"}</td>
                            <td className="p-4">
                                <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${c.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
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
                    <tr className="bg-blue-50 text-sm text-gray-700 text-left">
                        <th className="p-4 font-semibold border-b">Nhân sự</th>
                        <th className="p-4 font-semibold border-b">Ngày sự kiện</th>
                        <th className="p-4 font-semibold border-b">Loại sự kiện</th>
                        <th className="p-4 font-semibold border-b">Thay đổi vị trí</th>
                        <th className="p-4 font-semibold border-b">Thay đổi đơn vị</th>
                        <th className="p-4 font-semibold border-b text-center">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {filtered.map(h => (
                        <tr key={h.id} className="hover:bg-gray-50 border-b">
                            <td className="p-4 font-medium">{h.fullName}</td>
                            <td className="p-4">{h.eventDate}</td>
                            <td className="p-4 text-blue-600 font-medium">{h.eventType}</td>
                            <td className="p-4">
                                <div className="text-xs text-gray-500">Cũ: {h.oldPosition || "-"}</div>
                                <div className="font-medium">Mới: {h.newPosition || "-"}</div>
                            </td>
                            <td className="p-4">
                                <div className="text-xs text-gray-500">Cũ: {h.oldDepartment || "-"}</div>
                                <div className="font-medium">Mới: {h.newDepartment || "-"}</div>
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
        <div className="p-6 relative">
            <h1 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <FaFileContract /> QUẢN LÝ HỢP ĐỒNG & CÔNG TÁC
            </h1>

            {/* TABS */}
            <div className="flex gap-4 border-b mb-6">
                <button
                    className={`pb-3 px-4 font-medium transition ${activeTab === 'contracts' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-blue-500'}`}
                    onClick={() => { setActiveTab('contracts'); setSearchTerm(""); }}
                >
                    <FaFileContract className="inline mr-2" /> Danh sách Hợp đồng
                </button>
                <button
                    className={`pb-3 px-4 font-medium transition ${activeTab === 'history' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-blue-500'}`}
                    onClick={() => { setActiveTab('history'); setSearchTerm(""); }}
                >
                    <FaHistory className="inline mr-2" /> Quá trình Công tác
                </button>
            </div>

            {/* Toolbar */}
            <div className="flex justify-between mb-4">
                <div className="flex items-center border rounded-lg overflow-hidden bg-white shadow-sm">
                    <input
                        type="text"
                        placeholder="Tìm kiếm..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="px-3 py-2 outline-none text-sm w-80"
                    />
                    <button className="bg-blue-600 text-white px-3 py-2">
                        <FaSearch />
                    </button>
                </div>

                <button
                    onClick={handleOpenAdd}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium shadow"
                >
                    <FaPlus /> Thêm {activeTab === 'contracts' ? 'Hợp đồng' : 'Sự kiện'}
                </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto border rounded-xl bg-white shadow">
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
