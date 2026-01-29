import { useState, useEffect } from "react";
import { Search, Eye, Users, FileSpreadsheet, Loader2 } from "lucide-react";
import axios from "axios";

const PrincipalDepartmentManagement = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [quickViewData, setQuickViewData] = useState(null);

  // Staff Popup State
  const [staffPopup, setStaffPopup] = useState(null);
  const [staffList, setStaffList] = useState([]);
  const [loadingStaff, setLoadingStaff] = useState(false);

  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      // Use the flat list endpoint if available, or tree. 
      // Based on controller, getAll accepts search param and returns list
      const res = await axios.get("http://localhost:8080/api/departments", {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Flatten the tree or use the list directly depending on backend response.
      // Assuming 'getAll' returns a list of DepartmentTreeResponse which might suffice.
      // If the backend returns a tree structure, we might need to flatten it or just show top levels.
      // Let's assume for now it returns a list or we can just display what we get.
      // Reviewing logic: the backend 'getAll' with search param seems to return a flat list or filtered list.
      setDepartments(res.data);
    } catch (err) {
      console.error("Failed to fetch departments", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenStaffPopup = async (dept) => {
    setStaffPopup(dept);
    setStaffList([]);
    setLoadingStaff(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:8080/api/departments/${dept.id}/staff`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStaffList(res.data);
    } catch (err) {
      console.error("Failed to fetch staff", err);
      alert("Không thể tải danh sách nhân sự.");
    } finally {
      setLoadingStaff(false);
    }
  };

  const filteredDepartments = departments.filter((d) => {
    // Map backend fields: departmentName vs name
    const name = d.departmentName || d.name || "";
    return name.toLowerCase().includes(search.toLowerCase());
  });

  const totalPages = Math.ceil(filteredDepartments.length / pageSize);

  const paginatedData = filteredDepartments.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  if (loading) return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="animate-spin text-blue-600" size={40} />
    </div>
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-black text-slate-900 mb-6 uppercase tracking-tight">
        Quản lý phòng ban
      </h1>

      {/* THANH TÌM KIẾM */}
      <div className="relative mb-6">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={18}
        />
        <input
          type="text"
          placeholder="Tìm kiếm phòng ban..."
          className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 outline-none 
                     focus:ring-2 focus:ring-blue-400"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
        />
      </div>

      {/* BẢNG DANH SÁCH */}
      <div className="bg-white shadow rounded-xl p-5">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-black text-lg text-slate-800 uppercase tracking-wider">
            Danh sách phòng ban ({filteredDepartments.length})
          </h2>

          <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 opacity-50 cursor-not-allowed">
            <FileSpreadsheet size={18} />
            Xuất báo cáo
          </button>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50/80 text-[10px] font-black text-slate-500 text-left uppercase tracking-widest border-b border-slate-50">
              <th className="p-4">Mã PB</th>
              <th className="p-4">Tên phòng ban</th>
              <th className="p-4">Mô tả</th>
              <th className="p-4">Nhân sự</th>
              <th className="p-4">Trạng thái</th>
              <th className="p-4 text-center">Hành động</th>
            </tr>
          </thead>

          <tbody>
            {paginatedData.length > 0 ? paginatedData.map((d) => (
              <tr key={d.id} className="hover:bg-slate-50/50 border-b border-slate-50 transition">
                <td className="p-4 font-black text-[#009FE3] uppercase tracking-wider">{d.departmentCode || "---"}</td>
                <td className="p-4 font-black text-slate-900">{d.departmentName || d.name}</td>
                <td className="p-4 text-slate-500 font-medium truncate max-w-xs">{d.description || "---"}</td>
                <td className="p-4 font-black text-slate-800">{d.memberCount || 0}</td>
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${d.active
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-rose-100 text-rose-700"
                      }`}
                  >
                    {d.active ? "Đang hoạt động" : "Đã khóa"}
                  </span>
                </td>
                <td className="p-3 flex justify-center gap-3">
                  <button
                    className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100"
                    onClick={() => setQuickViewData(d)}
                    title="Xem chi tiết"
                  >
                    <Eye size={18} className="text-blue-600" />
                  </button>

                  <button
                    className="p-2 rounded-lg bg-orange-50 hover:bg-orange-100"
                    onClick={() => handleOpenStaffPopup(d)}
                    title="Xem danh sách nhân sự"
                  >
                    <Users size={18} className="text-orange-600" />
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="6" className="p-6 text-center text-gray-500 italic">Không tìm thấy phòng ban nào</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* PHÂN TRANG */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-gray-600">
              Trang {currentPage}/{totalPages}
            </p>

            <div className="flex items-center gap-2">
              <button
                className="px-3 py-1 border rounded-lg text-sm hover:bg-gray-100 disabled:opacity-40"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Trước
              </button>
              <button
                className="px-3 py-1 border rounded-lg text-sm hover:bg-gray-100 disabled:opacity-40"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </div>

      {/* POPUP XEM CHI TIẾT */}
      {quickViewData && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-[500px] p-6 space-y-4 shadow-xl">
            <h3 className="text-xl font-bold text-gray-700 border-b pb-2">
              Thông tin phòng ban
            </h3>

            <div className="space-y-3 text-gray-600">
              <p><strong>Mã phòng ban:</strong> {quickViewData.departmentCode}</p>
              <p><strong>Tên phòng ban:</strong> {quickViewData.departmentName || quickViewData.name}</p>
              <p><strong>Mô tả:</strong> {quickViewData.description || "Không có"}</p>
              <p><strong>Số lượng nhân sự:</strong> {quickViewData.memberCount || 0}</p>
              <p>
                <strong>Trạng thái:</strong>{" "}
                <span className={quickViewData.active ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
                  {quickViewData.active ? "Hoạt động" : "Đã khóa"}
                </span>
              </p>
            </div>

            <div className="flex justify-end pt-4">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                onClick={() => setQuickViewData(null)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP DANH SÁCH NHÂN SỰ */}
      {staffPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl w-[800px] max-h-[80vh] flex flex-col p-6">
            <h3 className="text-xl font-bold mb-4 text-blue-600 border-b pb-2">
              Nhân sự thuộc: {staffPopup.departmentName || staffPopup.name}
            </h3>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto min-h-[300px]">
              {loadingStaff ? (
                <div className="flex justify-center items-center h-full">
                  <Loader2 className="animate-spin text-blue-500" />
                </div>
              ) : staffList.length > 0 ? (
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="p-3 border-b">Họ tên</th>
                      <th className="p-3 border-b">Chức vụ</th>
                      <th className="p-3 border-b">Email</th>
                      <th className="p-3 border-b text-center">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {staffList.map((s) => (
                      <tr key={s.userId} className="border-b hover:bg-blue-50">
                        <td className="p-3 font-medium">
                          <div className="flex items-center gap-2">
                            <img src={s.avatar || `https://ui-avatars.com/api/?name=${s.fullName}&background=random`} className="w-8 h-8 rounded-full" alt="" />
                            {s.fullName}
                          </div>
                        </td>
                        <td className="p-3">{s.positionName || s.roleName || "Nhân viên"}</td>
                        <td className="p-3 text-gray-500">{s.email}</td>
                        <td className="p-3 text-center">
                          <span className={`px-2 py-0.5 rounded text-xs ${s.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {s.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center text-gray-500 py-10">
                  Chưa có nhân sự nào trong phòng ban này.
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t flex justify-end">
              <button
                onClick={() => setStaffPopup(null)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrincipalDepartmentManagement;
