import { useState, useEffect } from "react";
import { Search, Filter, FileSpreadsheet, Eye, Grid, List as ListIcon, User, Mail, Phone, Briefcase, Building2 } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";

const FacultyEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "list"

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:8080/api/users/my-faculty", {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Map backend fields to frontend usage
      const mapped = res.data.map((u) => ({
        id: u.userId,
        name: u.fullName || u.username,
        role: u.positionName || u.roleName || "Chưa có chức vụ",
        department: u.departmentName || "Trực thuộc Khoa",
        status: u.isActive ? "Đang làm việc" : "Đã nghỉ",
        email: u.email || "---",
        phone: u.phone || "---",
        avatar: u.avatar || `https://ui-avatars.com/api/?name=${u.fullName || u.username}&background=random`,
        createdAt: u.createdAt
      }));
      setEmployees(mapped);
    } catch (error) {
      console.error("Failed to fetch faculty employees:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEmployees = employees.filter((emp) => {
    const matchSearch =
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.email.toLowerCase().includes(search.toLowerCase());

    const matchRole = roleFilter === "all" ? true : emp.role === roleFilter;
    const matchDepartment =
      departmentFilter === "all" ? true : emp.department === departmentFilter;

    // Simple status filter mapping
    const matchStatus = statusFilter === "all" ? true : emp.status === statusFilter;

    return matchSearch && matchRole && matchDepartment && matchStatus;
  });

  // Calculate unique departments for filter
  const uniqueDepartments = [...new Set(employees.map(e => e.department))];
  // Calculate unique roles for filter
  const uniqueRoles = [...new Set(employees.map(e => e.role))];

  const exportExcel = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:8080/api/users/my-faculty/export", {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob", // Important for file download
      });

      // Create a link to download the blob
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Danh-sach-nhan-su-${new Date().toISOString().slice(0, 10)}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Export failed:", error);

      // Try to read the error message from the blob
      if (error.response && error.response.data instanceof Blob) {
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const errorObj = JSON.parse(reader.result);
            alert(`Xuất dữ liệu thất bại: ${errorObj.message || errorObj.error || "Lỗi không xác định"}`);
          } catch (e) {
            // If not JSON, just show text
            alert(`Xuất dữ liệu thất bại: ${reader.result}`);
          }
        };
        reader.readAsText(error.response.data);
      } else {
        alert("Xuất dữ liệu thất bại. Vui lòng kiểm tra kết nối hoặc đăng nhập lại.");
      }
    }
  };

  // Calculate stats
  const totalEmployees = employees.length;
  const totalLecturers = employees.filter(e => e.role && e.role.toLowerCase().includes("giảng viên")).length;
  // Calculate new employees in current month
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const newEmployeesCount = employees.filter(e => {
    if (!e.createdAt) return false;
    const d = new Date(e.createdAt);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  }).length;


  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      {/* Tiêu đề & Stats */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-950 uppercase tracking-tight">
            Nhân sự khoa tôi
          </h1>
          <p className="text-slate-500 mt-1 font-bold text-sm">Quản lý toàn bộ hồ sơ nhân sự trong khoa của bạn</p>
        </div>

        <div className="flex gap-3">
          <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <User size={20} />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Tổng nhân sự</p>
              <p className="text-lg font-black text-slate-900">{totalEmployees}</p>
            </div>
          </div>
          <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3">
            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
              <Briefcase size={20} />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Giảng viên</p>
              <p className="text-lg font-black text-slate-900">{totalLecturers}</p>
            </div>
          </div>
          <button
            onClick={exportExcel}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl shadow hover:bg-green-700 transition"
          >
            <FileSpreadsheet size={18} />
            <span className="hidden sm:inline">Xuất Excel</span>
          </button>
        </div>
      </div>

      {/* Thanh công cụ */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">

        {/* Tìm kiếm */}
        <div className="flex items-center gap-3 bg-slate-50 px-4 py-3 rounded-2xl w-full md:w-96 border border-transparent focus-within:bg-white focus-within:border-[#009FE3]/30 focus-within:ring-4 focus-within:ring-[#009FE3]/5 transition-all">
          <Search size={18} className="text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo tên hoặc email..."
            className="bg-transparent outline-none w-full text-sm font-bold text-slate-700 placeholder:text-slate-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Filters & View Mode */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl border border-gray-200">
            <Filter size={16} className="text-gray-500" />
            <select
              className="bg-transparent outline-none text-sm text-gray-700 min-w-[120px]"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="all">Tất cả chức danh</option>
              {uniqueRoles.map((role, idx) => (
                <option key={idx} value={role}>{role}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl border border-gray-200">
            <Building2 size={16} className="text-gray-500" />
            <select
              className="bg-transparent outline-none text-sm text-gray-700 min-w-[120px]"
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
            >
              <option value="all">Tất cả bộ môn</option>
              {uniqueDepartments.map((dept, idx) => (
                <option key={idx} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          <div className="w-px h-8 bg-gray-200 mx-2 hidden md:block"></div>

          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-md transition ${viewMode === "grid" ? "bg-white shadow text-blue-600" : "text-gray-400 hover:text-gray-600"}`}
            >
              <Grid size={18} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-md transition ${viewMode === "list" ? "bg-white shadow text-blue-600" : "text-gray-400 hover:text-gray-600"}`}
            >
              <ListIcon size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {filteredEmployees.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <User size={32} className="text-gray-400" />
          </div>
          <p className="text-gray-500 text-lg">Không tìm thấy nhân sự phù hợp</p>
          <button
            onClick={() => { setSearch(""); setRoleFilter("all"); setDepartmentFilter("all"); setStatusFilter("all") }}
            className="mt-4 text-blue-600 hover:underline"
          >
            Xóa bộ lọc
          </button>
        </div>
      ) : (
        <>
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredEmployees.map((emp) => (
                <div key={emp.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition group relative overflow-hidden">
                  {/* Status Badge */}
                  <div className={`absolute top-4 right-4 text-xs font-semibold px-2.5 py-1 rounded-full ${emp.status === "Đang làm việc" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                    }`}>
                    {emp.status}
                  </div>

                  <div className="flex flex-col items-center text-center">
                    <div className="relative mb-4">
                      <img
                        src={emp.avatar}
                        alt={emp.name}
                        className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-sm group-hover:scale-105 transition duration-300"
                      />
                    </div>
                    <h3 className="font-black text-lg text-slate-900 mb-1">{emp.name}</h3>
                    <p className="text-[#009FE3] font-black text-[10px] uppercase tracking-widest mb-3">{emp.role}</p>
                    <p className="text-slate-500 text-[10px] font-black flex items-center gap-2 mb-6 bg-slate-50 px-4 py-1.5 rounded-full uppercase tracking-wider">
                      <Building2 size={12} className="text-[#009FE3]" /> {emp.department}
                    </p>

                    <div className="w-full border-t border-slate-50 pt-4 flex flex-col gap-3">
                      <div className="flex items-center gap-3 text-xs text-slate-500 truncate w-full justify-center font-bold">
                        <Mail size={14} className="shrink-0 text-slate-300" /> <span className="truncate">{emp.email}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500 w-full justify-center font-bold">
                        <Phone size={14} className="shrink-0 text-slate-300" /> <span>{emp.phone}</span>
                      </div>
                    </div>

                    <Link
                      to={`/faculty/employees/${emp.id}`}
                      className="mt-6 w-full py-2.5 rounded-xl bg-blue-50 text-blue-600 font-medium hover:bg-blue-100 transition flex items-center justify-center gap-2 group-hover:bg-blue-600 group-hover:text-white"
                    >
                      <Eye size={18} /> Xem chi tiết
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50/80 text-[10px] font-black text-slate-500 text-left uppercase tracking-widest border-b border-slate-50">
                      <th className="p-4">Nhân sự</th>
                      <th className="p-4">Chức danh</th>
                      <th className="p-4">Bộ môn</th>
                      <th className="p-4">Trạng thái</th>
                      <th className="p-4">Liên hệ</th>
                      <th className="p-4 text-center">Hành động</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {filteredEmployees.map((emp) => (
                      <tr key={emp.id} className="hover:bg-blue-50/30 transition">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={emp.avatar}
                              alt={emp.name}
                              className="w-10 h-10 rounded-full object-cover border shadow-sm"
                            />
                            <div>
                              <p className="font-semibold text-gray-800">{emp.name}</p>
                              <p className="text-xs text-gray-500">ID: {emp.id}</p>
                            </div>
                          </div>
                        </td>

                        <td className="p-4 text-sm text-gray-700 font-medium">{emp.role}</td>
                        <td className="p-4 text-sm text-gray-600">{emp.department}</td>

                        <td className="p-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold
                              ${emp.status === "Đang làm việc"
                                ? "bg-green-50 text-green-700 border border-green-200"
                                : "bg-red-50 text-red-700 border border-red-200"
                              }
                            `}
                          >
                            {emp.status}
                          </span>
                        </td>

                        <td className="p-4">
                          <div className="flex flex-col gap-1">
                            <span className="text-xs text-gray-600 flex items-center gap-1">
                              <Mail size={12} /> {emp.email}
                            </span>
                            <span className="text-xs text-gray-600 flex items-center gap-1">
                              <Phone size={12} /> {emp.phone}
                            </span>
                          </div>
                        </td>

                        <td className="p-4 text-center">
                          <Link
                            to={`/faculty/employees/${emp.id}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-gray-700 text-sm hover:border-blue-300 hover:text-blue-600 transition shadow-sm"
                          >
                            <Eye size={16} /> Xem
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FacultyEmployees;
