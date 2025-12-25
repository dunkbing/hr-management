import { useState } from "react";
import {
  ClipboardCheck,
  MoreVertical,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";

const ApprovalPage = () => {
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [rejectRequest, setRejectRequest] = useState(null);
  const [reason, setReason] = useState("");
  const [openMenu, setOpenMenu] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const requests = [
    {
      id: 1,
      employee: "Nguyễn Văn A",
      type: "Nghỉ phép",
      date: "2025-11-10",
      status: "pending",
      department: "Khoa CNTT",
    },
    {
      id: 2,
      employee: "Trần Thị B",
      type: "Tăng lương",
      date: "2025-11-09",
      status: "approved",
      department: "Khoa Kinh tế",
    },
    {
      id: 3,
      employee: "Lê Văn C",
      type: "Cập nhật hồ sơ",
      date: "2025-11-08",
      status: "rejected",
      department: "Khoa Nội thất",
      reason: "Thiếu minh chứng hợp lệ",
    },
  ];

  const statusBadge = {
    pending: (
      <span className="inline-flex px-2 py-1 rounded bg-yellow-100 text-yellow-700 text-xs items-center gap-1 mt-2 w-fit">
        <Clock size={14} /> Chờ duyệt
      </span>
    ),
    approved: (
      <span className="inline-flex px-2 py-1 rounded bg-green-100 text-green-700 text-xs items-center gap-1 mt-2 w-fit">
        <CheckCircle size={14} /> Đã duyệt
      </span>
    ),
    rejected: (
      <span className="inline-flex px-2 py-1 rounded bg-red-100 text-red-700 text-xs items-center gap-1 mt-2 w-fit">
        <XCircle size={14} /> Từ chối
      </span>
    ),
  };

  const filteredRequests = requests.filter((r) => {
    const matchSearch = r.employee.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || r.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="p-3">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <ClipboardCheck size={30} className="text-[#009FE3]" />
        <h1 className="text-2xl font-bold text-gray-700">Phê duyệt yêu cầu</h1>
      </div>

      {/* Search + Filter */}
      <div className="flex gap-3 mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm nhân viên..."
          className="border p-2 rounded w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border p-2 rounded"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="pending">Chờ duyệt</option>
          <option value="approved">Đã duyệt</option>
          <option value="rejected">Từ chối</option>
        </select>
      </div>

      {/* Danh sách yêu cầu */}
      <div className="space-y-3">
        {filteredRequests.map((req) => (
          <div
            key={req.id}
            className="bg-white shadow rounded-xl p-4 relative border hover:shadow-md transition flex items-start justify-between"
          >
            {/* Bên trái */}
            <div className="flex-1">
              <p className="font-semibold text-gray-800 text-lg">
                {req.employee}
              </p>
              <p className="text-sm text-gray-600">{req.department}</p>

              {statusBadge[req.status]}

              <div className="mt-2 text-sm">
                <p>
                  <strong>Loại yêu cầu:</strong> {req.type}
                </p>
                <p>
                  <strong>Ngày gửi:</strong> {req.date}
                </p>
              </div>

              {req.status === "rejected" && req.reason && (
                <p className="text-sm text-red-600 mt-2">
                  <strong>Lý do từ chối:</strong> {req.reason}
                </p>
              )}
            </div>

            {/* Nút 3 chấm */}
            <button
              className="text-gray-500 hover:text-gray-700 ml-3"
              onClick={() => setOpenMenu(openMenu === req.id ? null : req.id)}
            >
              <MoreVertical size={22} />
            </button>

            {/* Menu */}
            {openMenu === req.id && (
              <div className="absolute top-12 right-4 bg-white shadow-lg rounded-lg border z-20 w-40">
                <button
                  onClick={() => {
                    setSelectedRequest(req);
                    setOpenMenu(null);
                  }}
                  className="block w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
                >
                  Xem chi tiết
                </button>

                {/* Chỉ pending mới có duyệt/từ chối */}
                {req.status === "pending" && (
                  <>
                    <button
                      onClick={() => {
                        alert("Đã duyệt yêu cầu!");
                        setOpenMenu(null);
                      }}
                      className="block w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
                    >
                      Duyệt
                    </button>

                    <button
                      onClick={() => {
                        setRejectRequest(req);
                        setOpenMenu(null);
                      }}
                      className="block w-full text-left px-3 py-2 hover:bg-gray-100 text-sm text-red-600"
                    >
                      Từ chối
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Popup chi tiết */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Chi tiết yêu cầu</h2>

            <p className="mb-2">
              <strong>Nhân viên:</strong> {selectedRequest.employee}
            </p>
            <p className="mb-2">
              <strong>Khoa gửi:</strong> {selectedRequest.department}
            </p>
            <p className="mb-2">
              <strong>Loại yêu cầu:</strong> {selectedRequest.type}
            </p>
            <p className="mb-2">
              <strong>Ngày gửi:</strong> {selectedRequest.date}
            </p>
            <p className="mb-2">
              <strong>Trạng thái:</strong> {statusBadge[selectedRequest.status]}
            </p>

            {selectedRequest.status === "rejected" && selectedRequest.reason && (
              <p className="text-red-600">
                <strong>Lý do từ chối:</strong> {selectedRequest.reason}
              </p>
            )}

            <div className="flex justify-end mt-4">
              <button
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
                onClick={() => setSelectedRequest(null)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popup từ chối */}
      {rejectRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-3">Từ chối yêu cầu</h2>

            <textarea
              rows="4"
              placeholder="Nhập lý do từ chối..."
              className="w-full border rounded-lg p-2 text-sm"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            ></textarea>

            <div className="flex justify-end gap-3 mt-4">
              <button
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                onClick={() => {
                  setRejectRequest(null);
                  setReason("");
                }}
              >
                Hủy
              </button>

              <button
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                onClick={() => {
                  alert("Đã từ chối: " + reason);
                  setRejectRequest(null);
                  setReason("");
                }}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApprovalPage;
