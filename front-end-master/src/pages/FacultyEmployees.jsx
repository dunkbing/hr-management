import { useState } from "react";
import { Search, Filter, FileSpreadsheet, Eye } from "lucide-react";
import { Link } from "react-router-dom";

const FacultyEmployees = () => {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const employees = [
    {
      id: 1,
      name: "Nguyễn Văn A",
      role: "Giảng viên",
      department: "Bộ môn Kết cấu",
      status: "Đang làm việc",
      email: "nguyenvana@hau.edu.vn",
      phone: "0987654321",
      avatar: "https://ui-avatars.com/api/?name=Nguyen+Van+A",
    },
    {
      id: 2,
      name: "Trần Thị B",
      role: "Trợ giảng",
      department: "Bộ môn Đồ họa",
      status: "Nghỉ phép",
      email: "tranthib@hau.edu.vn",
      phone: "0912345678",
      avatar: "https://ui-avatars.com/api/?name=Tran+Thi+B",
    },
    {
      id: 3,
      name: "Phạm Quốc C",
      role: "Nhân viên hành chính",
      department: "Văn phòng khoa",
      status: "Đang làm việc",
      email: "phamquocc@hau.edu.vn",
      phone: "0977123456",
      avatar: "https://ui-avatars.com/api/?name=Pham+Quoc+C",
    },
  ];

  const filteredEmployees = employees.filter((emp) => {
    const matchSearch =
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.email.toLowerCase().includes(search.toLowerCase());

    const matchRole = roleFilter === "all" ? true : emp.role === roleFilter;
    const matchDepartment =
      departmentFilter === "all" ? true : emp.department === departmentFilter;
    const matchStatus =
      statusFilter === "all" ? true : emp.status === statusFilter;

    return matchSearch && matchRole && matchDepartment && matchStatus;
  });

  const exportExcel = () => {
    alert("Đang chuẩn bị xuất Excel danh sách nhân sự...");
  };

  return (
    <div className="p-6">
      {/* Tiêu đề */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Nhân sự khoa tôi</h1>

        <button
          onClick={exportExcel}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl shadow hover:bg-green-700"
        >
          <FileSpreadsheet size={18} />
          Xuất Excel
        </button>
      </div>

      {/* Dashboard mini */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-gray-500">Tổng nhân sự</p>
          <p className="text-2xl font-bold">{employees.length}</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-gray-500">Giảng viên</p>
          <p className="text-2xl font-bold">
            {employees.filter((e) => e.role === "Giảng viên").length}
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-gray-500">Biến động tháng này</p>
          <p className="text-xl font-semibold text-blue-600">+2 / -1</p>
        </div>
      </div>

      {/* Thanh chức năng */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        {/* Ô tìm kiếm */}
        <div className="flex items-center border rounded-xl bg-white px-3 py-2 shadow-sm w-80">
          <Search size={18} className="text-gray-500" />
          <input
            type="text"
            placeholder="Tìm kiếm nhân sự..."
            className="ml-2 outline-none w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Lọc chức danh */}
        <div className="flex items-center border rounded-xl bg-white px-3 py-2 shadow-sm">
          <Filter size={18} className="text-gray-600" />
          <select
            className="ml-2 outline-none bg-transparent"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="all">Tất cả chức danh</option>
            <option value="Giảng viên">Giảng viên</option>
            <option value="Trợ giảng">Trợ giảng</option>
            <option value="Nhân viên hành chính">Nhân viên hành chính</option>
          </select>
        </div>

        <select
          className="border rounded-xl bg-white px-3 py-2 shadow-sm"
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
        >
          <option value="all">Tất cả bộ môn</option>
          <option value="Bộ môn Kết cấu">Bộ môn Kết cấu</option>
          <option value="Bộ môn Đồ họa">Bộ môn Đồ họa</option>
          <option value="Văn phòng khoa">Văn phòng khoa</option>
        </select>

        <select
          className="border rounded-xl bg-white px-3 py-2 shadow-sm"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="Đang làm việc">Đang làm việc</option>
          <option value="Nghỉ phép">Nghỉ phép</option>
          <option value="Công tác">Công tác</option>
        </select>
      </div>

      {/* Bảng danh sách */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-3">Nhân sự</th>
              <th className="text-left p-3">Chức danh</th>
              <th className="text-left p-3">Bộ môn</th>
              <th className="text-left p-3">Trạng thái</th>
              <th className="text-left p-3">Email</th>
              <th className="text-left p-3">SĐT</th>
              <th className="text-center p-3">Hành động</th>
            </tr>
          </thead>

          <tbody>
            {filteredEmployees.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center p-4 text-gray-500">
                  Không tìm thấy nhân sự nào...
                </td>
              </tr>
            ) : (
              filteredEmployees.map((emp) => (
                <tr key={emp.id} className="border-t hover:bg-gray-50">
                  <td className="p-3 flex items-center gap-3">
                    <img
                      src={emp.avatar}
                      alt={emp.name}
                      className="w-10 h-10 rounded-full border"
                    />
                    <span className="font-medium">{emp.name}</span>
                  </td>

                  <td className="p-3">{emp.role}</td>
                  <td className="p-3">{emp.department}</td>

                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm
                        ${
                          emp.status === "Đang làm việc"
                            ? "bg-green-100 text-green-700"
                            : emp.status === "Nghỉ phép"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-blue-100 text-blue-700"
                        }
                      `}
                    >
                      {emp.status}
                    </span>
                  </td>

                  <td className="p-3">{emp.email}</td>
                  <td className="p-3">{emp.phone}</td>

                  <td className="p-3 text-center">
                    <Link
                      to={`/faculty/employees/${emp.id}`}
                      className="text-blue-600 hover:underline flex items-center gap-1 mx-auto"
                    >
                      <Eye size={16} /> Xem
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FacultyEmployees;
