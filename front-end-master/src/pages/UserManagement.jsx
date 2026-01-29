import React, { useState, useEffect } from "react";
import { FaSearch, FaPlus, FaFileExcel, FaCogs, FaColumns, FaLink, FaTimes, FaTrash } from "react-icons/fa";
import axios from "axios";
import Pagination from "../components/Pagination";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Form State
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    roleCode: "giangvien"
  });

  const token = localStorage.getItem("token");

  // Fetch Users
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/users", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/api/users", newUser, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("✅ Thêm người dùng thành công!");
      setShowModal(false);
      setNewUser({ username: "", password: "", roleCode: "giangvien" });
      fetchUsers(); // Refresh list
    } catch (err) {
      alert("❌ Lỗi: " + (err.response?.data?.message || "Không thể thêm người dùng"));
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) return;
    try {
      await axios.delete(`http://localhost:8080/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("✅ Xóa người dùng thành công!");
      fetchUsers();
    } catch (err) {
      alert("❌ Lỗi: " + (err.response?.data?.message || "Không thể xóa người dùng"));
    }
  };

  // Filter
  const filteredUsers = users.filter(u =>
    u.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);
  const handleItemsPerPageChange = (size) => {
    setItemsPerPage(size);
    setCurrentPage(1);
  };

  return (
    <div className="p-6 relative space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">
        QUẢN LÝ TÀI KHOẢN NGƯỜI DÙNG
      </h1>

      {/* Toolbar */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-2">
          <div className="relative w-72">
            <FaSearch className="absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm tài khoản..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#009FE3]/20 transition-all font-medium text-slate-700 shadow-sm"
            />
          </div>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-[#009FE3] text-white px-4 py-2 rounded-lg hover:bg-[#008bc7] font-medium shadow"
        >
          <FaPlus /> Thêm mới
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border-none rounded-2xl bg-white shadow-sm border border-slate-100">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-slate-50/80 text-[10px] font-black text-slate-500 text-left uppercase tracking-widest border-b border-slate-50">
              <th className="p-4">ID</th>
              <th className="p-4">Tài khoản</th>
              <th className="p-4">Vai trò</th>
              <th className="p-4">Trạng thái</th>
              <th className="p-4">Ngày tạo</th>
              <th className="p-4 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.length > 0 ? (
              currentUsers.map((u, index) => (
                <tr key={u.userId} className="hover:bg-slate-50/50 border-b border-slate-50 transition">
                  <td className="p-4 text-slate-400 font-bold">{indexOfFirstItem + index + 1}</td>
                  <td className="p-4 font-bold text-[#009FE3]">{u.username}</td>
                  <td className="p-4 text-sm font-medium">
                    <span className="px-2 py-1 rounded-lg bg-slate-100 text-slate-700 text-[10px] font-black uppercase tracking-widest">
                      {u.role ? u.role.roleCode : "N/A"}
                    </span>
                  </td>
                  <td className="p-4">
                    {u.isActive ? (
                      <span className="text-emerald-600 font-bold text-sm">Hoạt động</span>
                    ) : (
                      <span className="text-rose-500 font-bold text-sm">Đã khóa</span>
                    )}
                  </td>
                  <td className="p-4 text-slate-500 font-medium text-sm">
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString("vi-VN") : ""}
                  </td>
                  <td className="p-4 text-center">
                    {(() => {
                      const currentRole = localStorage.getItem("role");
                      const currentUsername = localStorage.getItem("username");
                      const targetRole = u.role ? u.role.roleCode : "";

                      // 1. Không thể tự xóa chính mình
                      if (u.username === currentUsername) return null;

                      // 2. Admin không thể xóa SuperAdmin
                      if (currentRole === "admin" && targetRole === "superadmin") return null;

                      // 3. Admin không thể xóa Admin khác (chỉ SuperAdmin mới được xóa Admin)
                      if (currentRole === "admin" && targetRole === "admin") return null;

                      return (
                        <button
                          onClick={() => handleDeleteUser(u.userId)}
                          className="text-red-500 hover:text-red-700 bg-red-100 p-2 rounded-full transition-colors"
                          title="Xóa người dùng"
                        >
                          <FaTrash />
                        </button>
                      );
                    })()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-6 text-center text-gray-500 italic">
                  Chưa có dữ liệu người dùng.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        totalItems={filteredUsers.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
      />

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 transform transition-all scale-100">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h2 className="text-xl font-bold text-gray-800">Thêm người dùng mới</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-red-500">
                <FaTimes size={20} />
              </button>
            </div>

            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tài khoản</label>
                <input
                  type="text"
                  required
                  value={newUser.username}
                  onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#009FE3] outline-none"
                  placeholder="Nhập tên đăng nhập..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
                <input
                  type="password"
                  required
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#009FE3] outline-none"
                  placeholder="Nhập mật khẩu..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vai trò</label>
                <select
                  value={newUser.roleCode}
                  onChange={(e) => setNewUser({ ...newUser, roleCode: e.target.value })}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#009FE3] outline-none bg-white"
                >
                  {localStorage.getItem("role") === "superadmin" && (
                    <>
                      <option value="superadmin">Siêu quản trị (Super Admin)</option>
                      <option value="admin">Quản trị hệ thống (Admin)</option>
                    </>
                  )}
                  <option value="hieutruong">Hiệu trưởng</option>
                  <option value="truongkhoa">Trưởng khoa</option>
                  <option value="giangvien">Giảng viên / Nhân sự</option>
                </select>
              </div>

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
                  className="px-6 py-2 rounded-lg bg-[#009FE3] text-white hover:bg-[#008bc7] font-medium shadow-md"
                >
                  Tạo tài khoản
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserManagement;
