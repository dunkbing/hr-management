import { useEffect, useState } from "react";
import { X } from "lucide-react";

const AddDepartmentModal = ({
    isOpen,
    onClose,
    onAdd,
    nodes,
    initialData, // dùng cho chỉnh sửa
}) => {
    const [formData, setFormData] = useState({
        name: "",
        code: "",
        orderIndex: 0,
        parentId: "",
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
    }, []);

    // 🔹 Tự động fill dữ liệu khi chỉnh sửa
    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || "",
                code: initialData.code || "",
                orderIndex: initialData.orderIndex || 0,
                parentId: initialData.parentId || "",
                status: initialData.status || "ACTIVE",
                managerId: initialData.managerId || "",
            });
        } else {
            setFormData({
                name: "",
                code: "",
                orderIndex: 0,
                parentId: "",
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

        onAdd({
            ...formData,
            parentId: formData.parentId || null,
        });

        onClose();
    };

    // 🔹 Flatten tree cho select phòng ban cha
    const flattenNodes = (nodes, prefix = "") => {
        let result = [];
        nodes.forEach((node) => {
            result.push({
                id: node.id,
                name: prefix + node.name,
            });
            if (node.children) {
                result = result.concat(
                    flattenNodes(node.children, prefix + "-- ")
                );
            }
        });
        return result;
    };

    const flatList = flattenNodes(nodes);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                    <X size={20} />
                </button>

                {/* 🔹 TIÊU ĐỀ */}
                <h2 className="text-xl font-bold mb-4 text-[#009FE3]">
                    {initialData ? "Chỉnh sửa phòng ban" : "Thêm phòng ban mới"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Mã phòng ban <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="code"
                            value={formData.code}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-[#009FE3] focus:border-[#009FE3]"
                            placeholder="VD: PB01"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Tên phòng ban <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-[#009FE3] focus:border-[#009FE3]"
                            placeholder="VD: Phòng Hành chính"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Thứ tự sắp xếp
                        </label>
                        <input
                            type="number"
                            name="orderIndex"
                            value={formData.orderIndex}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-[#009FE3] focus:border-[#009FE3]"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Phòng ban cha
                        </label>
                        <select
                            name="parentId"
                            value={formData.parentId}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-[#009FE3] focus:border-[#009FE3]"
                        >
                            <option value="">-- Không có (Thư mục gốc) --</option>
                            {flatList.map((node) => (
                                <option key={node.id} value={node.id}>
                                    {node.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Trưởng phòng
                        </label>
                        <select
                            name="managerId"
                            value={formData.managerId}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-[#009FE3] focus:border-[#009FE3]"
                        >
                            <option value="">-- Chưa phân công --</option>
                            {users
                                .filter(user => user.role?.roleCode === "truongkhoa")
                                .map((user) => (
                                    <option key={user.userId} value={user.userId}>
                                        {user.username}
                                    </option>
                                ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Trạng thái
                        </label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-[#009FE3] focus:border-[#009FE3]"
                        >
                            <option value="ACTIVE">Sử dụng</option>
                            <option value="INACTIVE">Không sử dụng</option>
                        </select>
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-[#009FE3] text-white rounded-md hover:bg-[#009FE3]"
                        >
                            {initialData ? "Lưu thay đổi" : "Thêm mới"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddDepartmentModal;
