import { useState } from "react";
import { Eye, Check, X, Search, FileSpreadsheet } from "lucide-react";

// Mock dữ liệu yêu cầu
const mockRequests = [
  {
    id: 1,
    title: "Yêu cầu thêm nhân sự phòng CNTT",
    sender: "Admin Phòng Tổ chức Hành chính",
    type: "Admin",
    date: "2025-12-01",
    status: "Chờ duyệt",
    content: "Phòng CNTT cần thêm 2 nhân viên IT.",
  },
  {
    id: 2,
    title: "Yêu cầu thay đổi lịch học Khoa Kiến trúc",
    sender: "Trưởng Khoa Kiến trúc",
    type: "Khoa",
    date: "2025-11-30",
    status: "Chờ duyệt",
    content: "Đề nghị điều chỉnh lịch học học kỳ 2.",
  },
  {
    id: 3,
    title: "Yêu cầu mua thiết bị phòng Lab",
    sender: "Admin Phòng Đào tạo",
    type: "Admin",
    date: "2025-11-28",
    status: "Đã duyệt",
    content: "Cần mua thêm máy tính và máy chiếu cho phòng Lab.",
  },
];

const PrincipalApprovalManagement = () => {
  const [search, setSearch] = useState("");
  const [detailPopup, setDetailPopup] = useState(null);

  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const filteredRequests = mockRequests.filter(
    (r) =>
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.sender.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredRequests.length / pageSize);

  const paginatedData = filteredRequests.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Duyệt / Từ chối yêu cầu
  const handleApprove = (id) => {
    const index = mockRequests.findIndex((r) => r.id === id);
    if (index !== -1) mockRequests[index].status = "Đã duyệt";
    setDetailPopup(null);
  };

  const handleReject = (id) => {
    const index = mockRequests.findIndex((r) => r.id === id);
    if (index !== -1) mockRequests[index].status = "Từ chối";
    setDetailPopup(null);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Phê duyệt yêu cầu
      </h1>

      {/* Thanh tìm kiếm */}
      <div className="relative mb-6">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={18}
        />
        <input
          type="text"
          placeholder="Tìm kiếm yêu cầu..."
          className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Bảng danh sách yêu cầu */}
      <div className="bg-white shadow rounded-xl p-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-lg text-gray-700">
            Danh sách yêu cầu
          </h2>

          <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
            <FileSpreadsheet size={18} />
            Xuất báo cáo
          </button>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="text-left bg-gray-100">
              <th className="p-3">Tiêu đề</th>
              <th className="p-3">Người gửi</th>
              <th className="p-3">Loại</th>
              <th className="p-3">Ngày gửi</th>
              <th className="p-3">Trạng thái</th>
              <th className="p-3 text-center">Hành động</th>
            </tr>
          </thead>

          <tbody>
            {paginatedData.map((r) => (
              <tr key={r.id} className="border-t hover:bg-gray-50">
                <td className="p-3">{r.title}</td>
                <td className="p-3">{r.sender}</td>
                <td className="p-3">{r.type}</td>
                <td className="p-3">{r.date}</td>
                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      r.status === "Đã duyệt"
                        ? "bg-green-100 text-green-700"
                        : r.status === "Từ chối"
                        ? "bg-red-100 text-red-600"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {r.status}
                  </span>
                </td>

                <td className="p-3 flex justify-center gap-3">
                  <button
                    className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100"
                    onClick={() => setDetailPopup(r)}
                  >
                    <Eye size={18} className="text-blue-600" />
                  </button>

                  {r.status === "Chờ duyệt" && (
                    <>
                      <button
                        className="p-2 rounded-lg bg-green-50 hover:bg-green-100"
                        onClick={() => handleApprove(r.id)}
                      >
                        <Check size={18} className="text-green-600" />
                      </button>

                      <button
                        className="p-2 rounded-lg bg-red-50 hover:bg-red-100"
                        onClick={() => handleReject(r.id)}
                      >
                        <X size={18} className="text-red-600" />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Phân trang */}
        <div className="flex justify-between items-center mt-4">
          <p className="text-sm text-gray-600">
            Trang {currentPage}/{totalPages} — Tổng {filteredRequests.length} yêu
            cầu
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
                className={`px-3 py-1 rounded-lg text-sm border ${
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

      {/* Popup chi tiết yêu cầu */}
      {detailPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-[600px] p-6 space-y-4 shadow-xl">
            <h3 className="text-xl font-bold text-gray-700">
              Chi tiết yêu cầu
            </h3>

            <div className="space-y-2 text-gray-600">
              <p>
                <strong>Tiêu đề:</strong> {detailPopup.title}
              </p>
              <p>
                <strong>Người gửi:</strong> {detailPopup.sender}
              </p>
              <p>
                <strong>Loại:</strong> {detailPopup.type}
              </p>
              <p>
                <strong>Ngày gửi:</strong> {detailPopup.date}
              </p>
              <p>
                <strong>Nội dung:</strong> {detailPopup.content}
              </p>
              <p>
                <strong>Trạng thái:</strong>{" "}
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    detailPopup.status === "Đã duyệt"
                      ? "bg-green-100 text-green-700"
                      : detailPopup.status === "Từ chối"
                      ? "bg-red-100 text-red-600"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {detailPopup.status}
                </span>
              </p>
            </div>

            {detailPopup.status === "Chờ duyệt" && (
              <div className="flex gap-3 mt-4">
                <button
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  onClick={() => handleApprove(detailPopup.id)}
                >
                  Duyệt
                </button>
                <button
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  onClick={() => handleReject(detailPopup.id)}
                >
                  Từ chối
                </button>
              </div>
            )}

            <div className="mt-4 text-right">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
                onClick={() => setDetailPopup(null)}
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

export default PrincipalApprovalManagement;
