import React, { useState, useEffect } from "react";
import { FaSearch, FaPlus, FaFileExcel, FaCogs, FaColumns, FaLink, FaTimes } from "react-icons/fa";
import axios from "axios";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);

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

  // Filter
  const filteredUsers = users.filter(u =>
    u.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 relative">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        QUẢN LÝ TÀI KHOẢN NGƯỜI DÙNG
      </h1>

      {/* Toolbar */}
      <div className="flex justify-between mb-4">
        <div className="flex gap-2">
          <div className="flex items-center border rounded-lg overflow-hidden bg-white shadow-sm">
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 outline-none text-sm w-64"
            />
            <button className="bg-blue-600 text-white px-3 py-2">
              <FaSearch />
            </button>
          </div>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium shadow"
        >
          <FaPlus /> Thêm mới
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border rounded-xl bg-white shadow">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-blue-50 text-sm text-gray-700 text-left">
              <th className="p-4 font-semibold border-b">ID</th>
              <th className="p-4 font-semibold border-b">Tài khoản</th>
              <th className="p-4 font-semibold border-b">Vai trò</th>
              <th className="p-4 font-semibold border-b">Trạng thái</th>
              <th className="p-4 font-semibold border-b">Ngày tạo</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((u) => (
                <tr key={u.userId} className="hover:bg-gray-50 border-b">
                  <td className="p-4">{u.userId}</td>
                  <td className="p-4 font-medium text-blue-600">{u.username}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 rounded bg-gray-100 text-gray-700 text-xs font-bold uppercase">
                      {u.role ? u.role.roleCode : "N/A"}
                    </span>
                  </td>
                  <td className="p-4">
                    {u.isActive ? (
                      <span className="text-green-600 font-medium">Hoạt động</span>
                    ) : (
                      <span className="text-red-600">Đã khóa</span>
                    )}
                  </td>
                  <td className="p-4 text-gray-500 text-sm">
                    {u.createdAt ? new Date(u.createdAt).toLocaleString() : ""}
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
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
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
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Nhập mật khẩu..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vai trò</label>
                <select
                  value={newUser.roleCode}
                  onChange={(e) => setNewUser({ ...newUser, roleCode: e.target.value })}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                >
                  <option value="admin">Admin (Quản trị)</option>
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
                  className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium shadow-md"
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
