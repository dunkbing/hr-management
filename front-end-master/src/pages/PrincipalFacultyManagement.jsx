import { useState } from "react";
import { Search, Eye, Users, FileSpreadsheet } from "lucide-react";

// 🔹 Mock dữ liệu KHOA
const mockFaculties = [
  {
    id: 1,
    name: "Khoa Công nghệ Thông tin",
    dean: "Trần Thị B",
    employees: 54,
    status: "Đang hoạt động",
  },
  {
    id: 2,
    name: "Khoa Xây dựng",
    dean: "Nguyễn Văn H",
    employees: 41,
    status: "Đang hoạt động",
  },
  {
    id: 3,
    name: "Khoa Kiến trúc",
    dean: "Lê Thị C",
    employees: 36,
    status: "Tạm dừng",
  },
];

const PrincipalFacultyManagement = () => {
  const [search, setSearch] = useState("");
  const [quickViewData, setQuickViewData] = useState(null);
  const [staffPopup, setStaffPopup] = useState(null);

  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const filteredFaculties = mockFaculties.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredFaculties.length / pageSize);

  const paginatedData = filteredFaculties.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Quản lý khoa</h1>

      {/* THANH TÌM KIẾM */}
      <div className="relative mb-6">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={18}
        />
        <input
          type="text"
          placeholder="Tìm kiếm khoa..."
          className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 
                     outline-none focus:ring-2 focus:ring-blue-400"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* BẢNG DANH SÁCH */}
      <div className="bg-white shadow rounded-xl p-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-lg text-gray-700">Danh sách khoa</h2>

          <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
            <FileSpreadsheet size={18} />
            Xuất báo cáo
          </button>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="text-left bg-gray-100">
              <th className="p-3">Tên khoa</th>
              <th className="p-3">Trưởng khoa</th>
              <th className="p-3">Nhân sự</th>
              <th className="p-3">Trạng thái</th>
              <th className="p-3 text-center">Hành động</th>
            </tr>
          </thead>

          <tbody>
            {paginatedData.map((f) => (
              <tr key={f.id} className="border-t hover:bg-gray-50">
                <td className="p-3">{f.name}</td>
                <td className="p-3">{f.dean}</td>
                <td className="p-3">{f.employees}</td>
                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      f.status === "Đang hoạt động"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {f.status}
                  </span>
                </td>

                <td className="p-3 flex justify-center gap-3">
                  {/* Xem nhanh */}
                  <button
                    className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100"
                    onClick={() => setQuickViewData(f)}
                  >
                    <Eye size={18} className="text-blue-600" />
                  </button>

                  {/* Nhân sự */}
                  <button
                    className="p-2 rounded-lg bg-orange-50 hover:bg-orange-100"
                    onClick={() => setStaffPopup(f)}
                  >
                    <Users size={18} className="text-orange-600" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* PHÂN TRANG */}
        <div className="flex justify-between items-center mt-4">
          <p className="text-sm text-gray-600">
            Trang {currentPage}/{totalPages} — Tổng {filteredFaculties.length} khoa
          </p>

          <div className="flex items-center gap-2">
            <button
              className="px-3 py-1 border rounded-lg text-sm hover:bg-gray-100 disabled:opacity-40"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Trước
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded-lg text-sm border 
                  ${
                    currentPage === i + 1
                      ? "bg-blue-600 text-white"
                      : "hover:bg-gray-100"
                  }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              className="px-3 py-1 border rounded-lg text-sm hover:bg-gray-100 disabled:opacity-40"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Sau
            </button>
          </div>
        </div>
      </div>

      {/* POPUP XEM NHANH */}
      {quickViewData && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-[500px] p-6 space-y-4 shadow-xl">
            <h3 className="text-xl font-bold text-gray-700">Thông tin khoa</h3>

            <div className="space-y-2 text-gray-600">
              <p><strong>Tên khoa:</strong> {quickViewData.name}</p>
              <p><strong>Trưởng khoa:</strong> {quickViewData.dean}</p>
              <p><strong>Nhân sự:</strong> {quickViewData.employees}</p>
              <p><strong>Trạng thái:</strong> {quickViewData.status}</p>
            </div>

            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              onClick={() => setQuickViewData(null)}
            >
              Đóng
            </button>
          </div>
        </div>
      )}

      {/* POPUP NHÂN SỰ */}
      {staffPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl w-[700px] p-6">
            <h3 className="text-xl font-bold mb-4">
              Nhân sự của {staffPopup.name}
            </h3>

            <div className="flex justify-between mb-4">
              <input
                type="text"
                placeholder="Tìm nhân sự..."
                className="border px-3 py-2 rounded-lg w-1/2"
              />

              <button className="flex items-center gap-2 bg-green-600 text-white px-3 py-2 rounded-lg">
                <FileSpreadsheet size={18} />
                Xuất Excel
              </button>
            </div>

            <p className="text-gray-600 italic text-sm">
              (Danh sách nhân sự tạm thời – chưa có API)
            </p>

            <div className="mt-4 text-right">
              <button
                onClick={() => setStaffPopup(null)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
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

export default PrincipalFacultyManagement;
