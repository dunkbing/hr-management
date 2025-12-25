import { useState } from "react";
import {
  Search,
  Users,
  Eye,
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";

// ================= MODAL XEM NHANH =================
const QuickViewModal = ({ employee, onClose }) => {
  if (!employee) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[420px] rounded-xl shadow-lg p-6 relative">
        <h2 className="text-xl font-bold text-[#009FE3] mb-4">
          Thông tin nhân sự
        </h2>

        <div className="space-y-2">
          <p><strong>Họ và tên:</strong> {employee.name}</p>
          <p><strong>Đơn vị:</strong> {employee.department}</p>
          <p><strong>Chức danh:</strong> {employee.position}</p>
          <p><strong>Email:</strong> {employee.email}</p>
        </div>

        <div className="flex justify-end mt-5 gap-3">
          <Link
            to={`/principal/employees/${employee.id}`}
            className="bg-[#009FE3] text-white px-4 py-2 rounded-lg shadow hover:bg-[#007fbf]"
          >
            Xem chi tiết
          </Link>
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg hover:bg-gray-100"
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
  const employees = [
    { id: 1, name: "Nguyễn Văn A", department: "Khoa CNTT", position: "Giảng viên", email: "vana@hau.edu.vn" },
    { id: 2, name: "Trần Thị B", department: "Phòng Tổ chức Hành chính", position: "Chuyên viên", email: "thib@hau.edu.vn" },
    { id: 3, name: "Lê Văn C", department: "Khoa Kiến trúc", position: "Trưởng khoa", email: "levanc@hau.edu.vn" },
    { id: 4, name: "Phạm Văn D", department: "Khoa CNTT", position: "Giảng viên", email: "vand@hau.edu.vn" },
    { id: 5, name: "Hoàng Thu E", department: "Khoa Kiến trúc", position: "Giảng viên", email: "ehoang@hau.edu.vn" },
  ];

  const departmentOptions = [
    "Tất cả",
    "Khoa CNTT",
    "Khoa Kiến trúc",
    "Phòng Tổ chức Hành chính",
  ];

  const positionOptions = ["Tất cả", "Giảng viên", "Chuyên viên", "Trưởng khoa"];

  const [search, setSearch] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("Tất cả");
  const [filterPosition, setFilterPosition] = useState("Tất cả");
  const [quickViewData, setQuickViewData] = useState(null);

  const [page, setPage] = useState(1);
  const pageSize = 3;

  const filteredEmployees = employees.filter((e) => {
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase());
    const matchDept =
      filterDepartment === "Tất cả" || e.department === filterDepartment;
    const matchPos =
      filterPosition === "Tất cả" || e.position === filterPosition;

    return matchSearch && matchDept && matchPos;
  });

  const totalPages = Math.ceil(filteredEmployees.length / pageSize);
  const paginated = filteredEmployees.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const exportExcel = () => {
    alert("Xuất Excel (mock). Sau này kết nối API thật là chạy được.");
  };

  return (
    <div className="p-6">

      {/* TIÊU ĐỀ + XUẤT EXCEL */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#009FE3]">Quản lý nhân sự</h1>

        <button
          onClick={exportExcel}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow"
        >
          <FileSpreadsheet size={18} />
          Xuất Excel
        </button>
      </div>

      {/* ================= SEARCH + FILTERS (FULL WIDTH) ================= */}
      <div className="w-full mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

          {/* TÌM KIẾM — full width, dài hơn */}
          <div className="md:col-span-2">
            <label className="text-sm text-gray-600">Tìm theo tên</label>
            <div className="flex items-center bg-white border px-3 rounded-lg mt-1 shadow-sm">
              <Search size={18} className="text-gray-500" />
              <input
                className="w-full px-2 py-2 outline-none bg-transparent"
                placeholder="Nhập tên nhân sự..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* ĐƠN VỊ */}
          <div>
            <label className="text-sm text-gray-600">Đơn vị</label>
            <select
              className="border rounded-lg px-3 py-2 bg-white w-full mt-1 shadow-sm"
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
            >
              {departmentOptions.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* CHỨC DANH */}
          <div>
            <label className="text-sm text-gray-600">Chức danh</label>
            <select
              className="border rounded-lg px-3 py-2 bg-white w-full mt-1 shadow-sm"
              value={filterPosition}
              onChange={(e) => setFilterPosition(e.target.value)}
            >
              {positionOptions.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-white rounded-xl shadow border">

        {/* HEADER TABLE + TOTAL COUNT */}
        <div className="flex justify-between items-center px-4 py-3 border-b bg-gray-50 rounded-t-xl">
          <p className="font-semibold text-gray-700">Danh sách nhân sự</p>

          <div className="flex items-center gap-2 text-gray-600">
            <Users size={22} className="text-[#009FE3]" />
            <span className="font-semibold">{employees.length} nhân sự</span>
          </div>
        </div>

        {/* TABLE */}
        <table className="w-full text-left">
          <thead>
            <tr className="bg-white border-b">
              <th className="p-3">Họ và tên</th>
              <th className="p-3">Đơn vị</th>
              <th className="p-3">Chức danh</th>
              <th className="p-3">Email</th>
              <th className="p-3 text-center">Hành động</th>
            </tr>
          </thead>

          <tbody>
            {paginated.map((emp) => (
              <tr key={emp.id} className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">{emp.name}</td>
                <td className="p-3">{emp.department}</td>
                <td className="p-3">{emp.position}</td>
                <td className="p-3">{emp.email}</td>

                <td className="p-3 flex justify-center gap-4">
                  <button
                    onClick={() => setQuickViewData(emp)}
                    className="text-[#009FE3] hover:underline flex items-center gap-1"
                  >
                    <Eye size={18} /> Xem nhanh
                  </button>

                  <Link
                    to={`/principal/employees/${emp.id}`}
                    className="text-blue-500 hover:underline"
                  >
                    Chi tiết
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* PAGINATION */}
        <div className="flex justify-center items-center gap-4 py-4">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className={`p-2 border rounded-lg ${
              page === 1 ? "opacity-40" : "hover:bg-gray-100"
            }`}
          >
            <ChevronLeft size={18} />
          </button>

          <span className="font-medium">
            Trang {page} / {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className={`p-2 border rounded-lg ${
              page === totalPages ? "opacity-40" : "hover:bg-gray-100"
            }`}
          >
            <ChevronRight size={18} />
          </button>
        </div>
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
