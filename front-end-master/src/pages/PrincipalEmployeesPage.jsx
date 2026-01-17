import { useState, useEffect } from "react";
import axios from "axios";
import {
  Search,
  Users,
  Eye,
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Filter
} from "lucide-react";
import { Link } from "react-router-dom";

// ================= MODAL XEM NHANH =================
const QuickViewModal = ({ employee, onClose }) => {
  if (!employee) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white w-[450px] rounded-xl shadow-2xl p-6 relative animate-scale-up">
        <h2 className="text-xl font-bold text-[#009FE3] mb-4 border-b pb-2">
          Thông tin nhân sự
        </h2>

        <div className="space-y-3">
          <div className="flex gap-3 items-center">
            <img
              src={employee.avatar || `https://ui-avatars.com/api/?name=${employee.name}&background=random`}
              alt="Avatar"
              className="w-16 h-16 rounded-full object-cover border-2 border-blue-100"
            />
            <div>
              <p className="text-lg font-bold text-gray-800">{employee.name}</p>
              <span className="text-sm bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{employee.role}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2 text-sm mt-2">
            <p><strong className="text-gray-600">Đơn vị:</strong> {employee.department}</p>
            <p><strong className="text-gray-600">Email:</strong> {employee.email}</p>
            <p><strong className="text-gray-600">SĐT:</strong> {employee.phone || "---"}</p>
            <p><strong className="text-gray-600">Trạng thái:</strong>
              <span className={employee.status === "Đang làm việc" ? "text-green-600 font-bold ml-1" : "text-red-500 font-bold ml-1"}>
                {employee.status}
              </span>
            </p>
          </div>
        </div>

        <div className="flex justify-end mt-6 gap-3">
          <Link
            to={`/principal/employees/${employee.id}`}
            className="bg-[#009FE3] text-white px-4 py-2 rounded-lg shadow hover:bg-[#009FE3] transition"
          >
            Xem chi tiết đầy đủ
          </Link>
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

// ================= MAIN COMPONENT =================
const PrincipalEmployeeList = () => {
  // State
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [search, setSearch] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("Tất cả");
  const [filterRole, setFilterRole] = useState("Tất cả"); // Changed from Position to Role/Position

  // Pagination
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Quick View
  const [quickViewData, setQuickViewData] = useState(null);

  // Derived Options for Selects
  const [departmentOptions, setDepartmentOptions] = useState(["Tất cả"]);
  const [roleOptions, setRoleOptions] = useState(["Tất cả"]);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:8080/api/users", {
        headers: { Authorization: `Bearer ${token}` }
      });

      const rawData = res.data;

      // Map data
      const mapped = rawData.map(u => ({
        id: u.userId,
        name: u.fullName || u.username,
        email: u.email || "---",
        phone: u.phone,
        avatar: u.avatar,
        // Prioritize Faculty Name, then Department Name, then "Chưa phân công"
        department: u.facultyName || u.departmentName || "Khối Phòng Ban", // Or logic based on roles
        // Role logic
        role: u.positionName || u.roleName || "Nhân viên",
        status: u.isActive ? "Đang làm việc" : "Đã nghỉ"
      }));

      setEmployees(mapped);

      // Extract unique options for filters
      const depts = new Set(["Tất cả"]);
      const roles = new Set(["Tất cả"]);
      mapped.forEach(e => {
        if (e.department) depts.add(e.department);
        if (e.role) roles.add(e.role);
      });

      setDepartmentOptions(Array.from(depts));
      setRoleOptions(Array.from(roles));

    } catch (err) {
      console.error("Fetch employees failed", err);
      setError("Không thể tải danh sách nhân sự.");
    } finally {
      setLoading(false);
    }
  };

  // Filter Logic
  const filteredEmployees = employees.filter((e) => {
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.email.toLowerCase().includes(search.toLowerCase());
    const matchDept = filterDepartment === "Tất cả" || e.department === filterDepartment;
    const matchRole = filterRole === "Tất cả" || e.role === filterRole;

    return matchSearch && matchDept && matchRole;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredEmployees.length / pageSize);
  const paginated = filteredEmployees.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  // TODO: Implement backend export for ALL employees if needed
  const exportExcel = () => {
    alert("Chức năng xuất Excel toàn trường đang phát triển backend.");
  };

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;
  if (error) return <div className="p-10 text-center text-red-500">{error}</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">

      {/* TIÊU ĐỀ + XUẤT EXCEL */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#009FE3]">Quản lý nhân sự toàn trường</h1>
          <p className="text-gray-500 text-sm">Xem và quản lý tất cả cán bộ, giảng viên, nhân viên</p>
        </div>

        <button
          //   onClick={exportExcel}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow opacity-50 cursor-not-allowed"
          title="Chức năng đang phát triển"
        >
          <FileSpreadsheet size={18} />
          Xuất Excel
        </button>
      </div>

      {/* ================= SEARCH + FILTERS ================= */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 sticky top-20 z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">

          {/* TÌM KIẾM */}
          <div className="md:col-span-5">
            <label className="text-sm font-semibold text-gray-700 mb-1 block">Tìm kiếm</label>
            <div className="flex items-center bg-gray-50 border border-gray-200 px-3 rounded-lg focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-400 transition">
              <Search size={18} className="text-gray-400" />
              <input
                className="w-full px-2 py-2.5 outline-none bg-transparent text-sm"
                placeholder="Nhập tên hoặc email..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              />
            </div>
          </div>

          {/* ĐƠN VỊ */}
          <div className="md:col-span-3">
            <label className="text-sm font-semibold text-gray-700 mb-1 block">Đơn vị / Khoa</label>
            <div className="relative">
              <Filter className="absolute left-3 top-3 text-gray-400" size={16} />
              <select
                className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2.5 bg-gray-50 text-sm focus:ring-2 focus:ring-blue-100 outline-none cursor-pointer"
                value={filterDepartment}
                onChange={(e) => { setFilterDepartment(e.target.value); setPage(1); }}
              >
                {departmentOptions.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          {/* CHỨC DANH */}
          <div className="md:col-span-3">
            <label className="text-sm font-semibold text-gray-700 mb-1 block">Chức vụ / Vai trò</label>
            <div className="relative">
              <Filter className="absolute left-3 top-3 text-gray-400" size={16} />
              <select
                className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2.5 bg-gray-50 text-sm focus:ring-2 focus:ring-blue-100 outline-none cursor-pointer"
                value={filterRole}
                onChange={(e) => { setFilterRole(e.target.value); setPage(1); }}
              >
                {roleOptions.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>

          {/* RESET BUTTON */}
          <div className="md:col-span-1">
            <button
              onClick={() => { setSearch(""); setFilterDepartment("Tất cả"); setFilterRole("Tất cả"); setPage(1); }}
              className="w-full py-2.5 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 text-sm font-medium transition"
            >
              Đặt lại
            </button>
          </div>

        </div>
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

        {/* HEADER TABLE + TOTAL COUNT */}
        <div className="flex justify-between items-center px-6 py-4 border-b bg-gray-50/50">
          <p className="font-semibold text-gray-700">Danh sách nhân sự</p>
          <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-3 py-1 rounded-full text-sm">
            <Users size={16} />
            <span className="font-bold">{filteredEmployees.length}</span> nhân sự
          </div>
        </div>

        {/* TABLE CONTENT */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b text-gray-600 text-sm uppercase tracking-wider">
                <th className="p-4 font-semibold">Họ và tên</th>
                <th className="p-4 font-semibold">Đơn vị</th>
                <th className="p-4 font-semibold">Chức vụ</th>
                <th className="p-4 font-semibold">Email</th>
                <th className="p-4 font-semibold text-center">Trạng thái</th>
                <th className="p-4 font-semibold text-center">Hành động</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {paginated.length > 0 ? (
                paginated.map((emp) => (
                  <tr key={emp.id} className="hover:bg-blue-50/30 transition duration-150">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={emp.avatar || `https://ui-avatars.com/api/?name=${emp.name}&background=random`}
                          alt="ava"
                          className="w-9 h-9 rounded-full object-cover border border-gray-200"
                        />
                        <span className="font-medium text-gray-900">{emp.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600 text-sm">{emp.department}</td>
                    <td className="p-4">
                      <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-600">
                        {emp.role}
                      </span>
                    </td>
                    <td className="p-4 text-gray-500 text-sm">{emp.email}</td>
                    <td className="p-4 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${emp.status === "Đang làm việc"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                        }`}>
                        {emp.status}
                      </span>
                    </td>

                    <td className="p-4 flex justify-center gap-3">
                      <button
                        onClick={() => setQuickViewData(emp)}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition"
                        title="Xem nhanh"
                      >
                        <Eye size={18} />
                      </button>

                      <Link
                        to={`/principal/employees/${emp.id}`}
                        className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-full transition"
                        title="Chi tiết"
                      >
                        <ChevronRight size={18} />
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500 italic">
                    Không tìm thấy nhân sự nào phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 py-4 border-t bg-gray-50/50">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className={`p-2 border rounded-lg bg-white shadow-sm ${page === 1 ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-100 text-gray-700"
                }`}
            >
              <ChevronLeft size={18} />
            </button>

            <span className="text-sm font-medium text-gray-600">
              Trang <span className="font-bold text-gray-900">{page}</span> / {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className={`p-2 border rounded-lg bg-white shadow-sm ${page === totalPages ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-100 text-gray-700"
                }`}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>

      {/* MODAL */}
      <QuickViewModal
        employee={quickViewData}
        onClose={() => setQuickViewData(null)}
      />
    </div>
  );
};

export default PrincipalEmployeeList;
