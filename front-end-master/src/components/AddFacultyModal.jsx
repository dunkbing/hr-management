import { useEffect, useState } from "react";
import { X } from "lucide-react";

const AddFacultyModal = ({
    isOpen,
    onClose,
    onAdd,
    initialData, // dùng cho chỉnh sửa
}) => {
    const [formData, setFormData] = useState({
        name: "",
        code: "",
        description: "",
        status: "ACTIVE",
        managerId: "",
    });

    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch("http://localhost:8080/api/users", {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
                if (res.ok) {
                    const data = await res.json();
                    setUsers(data);
                }
            } catch (err) {
                console.error("Error fetching users:", err);
            }
        };
        fetchUsers();
    }, [isOpen]);

    // 🔹 Tự động fill dữ liệu khi chỉnh sửa
    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || "",
                code: initialData.code || "",
                description: initialData.description || "",
                status: initialData.status || "ACTIVE",
                managerId: initialData.managerId || "",
            });
        } else {
            setFormData({
                name: "",
                code: "",
                description: "",
                status: "ACTIVE",
                managerId: "",
            });
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onAdd(formData);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-[#009FE3] transition-colors"
                >
                    <X size={20} />
                </button>

                {/* 🔹 TIÊU ĐỀ */}
                <h2 className="text-xl font-bold mb-4 text-[#009FE3]">
                    {initialData ? "Chỉnh sửa khoa" : "Thêm khoa mới"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">
                            Mã khoa <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="code"
                            value={formData.code}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-[#009FE3] transition-all font-medium text-slate-900"
                            placeholder="VD: K_CNTT"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">
                            Tên khoa <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-[#009FE3] transition-all font-medium text-slate-900"
                            placeholder="VD: Khoa Công nghệ Thông tin"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">
                            Trưởng khoa
                        </label>
                        <select
                            name="managerId"
                            value={formData.managerId}
                            onChange={handleChange}
                            className="w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-[#009FE3] transition-all font-medium text-slate-900 appearance-none"
                        >
                            <option value="">-- Chưa phân công --</option>
                            {users
                                .filter(user => user.role?.roleCode === "truongkhoa" || user.role?.roleCode === "giangvien")
                                .map((user) => (
                                    <option key={user.userId} value={user.userId}>
                                        {user.username}
                                    </option>
                                ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">
                            Mô tả
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-[#009FE3] transition-all font-medium text-slate-900"
                            placeholder="Mô tả về khoa..."
                            rows="2"
                        ></textarea>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">
                            Trạng thái
                        </label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-[#009FE3] transition-all font-medium text-slate-900 appearance-none"
                        >
                            <option value="ACTIVE">Hoạt động</option>
                            <option value="INACTIVE">Ngưng</option>
                        </select>
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 rounded-xl text-slate-600 font-bold hover:bg-slate-50 transition-all"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="px-8 py-2 bg-[#009FE3] text-white rounded-xl font-bold hover:shadow-lg hover:shadow-blue-200 transition-all active:scale-95"
                        >
                            {initialData ? "Lưu thay đổi" : "Thêm mới"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddFacultyModal;
