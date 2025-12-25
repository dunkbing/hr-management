import React, { useState } from "react";
import { Plus, X, MoreVertical } from "lucide-react";

const FacultyProposals = () => {
  const [showForm, setShowForm] = useState(false);
  const [showReason, setShowReason] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");

  const [openMenuId, setOpenMenuId] = useState(null);

  const [proposals, setProposals] = useState([
    {
      id: 1,
      title: "Đề xuất tuyển thêm giảng viên môn CSDL",
      content: "Môn CSDL đang thiếu 2 giảng viên do tăng số lượng lớp.",
      date: "2025-01-12",
      status: "approved",
      reason: "Phê duyệt: Nhu cầu nhân lực tăng",
      file: null,
    },
    {
      id: 2,
      title: "Đề xuất nghỉ phép 2 ngày",
      content: "Tôi xin nghỉ phép ngày 12 và 13/02/2025.",
      date: "2025-02-01",
      status: "pending",
      reason: "",
      file: null,
    },
    {
      id: 3,
      title: "Đề xuất thay đổi chức vụ nhân sự",
      content: "Đề xuất nâng chức vụ cho nhân sự có thành tích tốt.",
      date: "2025-02-03",
      status: "rejected",
      reason: "Từ chối: Chưa đủ điều kiện đánh giá",
      file: null,
    },
  ]);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    file: null,
    editId: null,
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.editId) {
      setProposals(
        proposals.map((p) =>
          p.id === formData.editId
            ? {
                ...p,
                title: formData.title,
                content: formData.content,
                file: formData.file || p.file,
              }
            : p
        )
      );

      setFormData({ title: "", content: "", file: null, editId: null });
      setShowForm(false);
      return;
    }

    const newProposal = {
      id: proposals.length + 1,
      title: formData.title,
      content: formData.content,
      date: new Date().toISOString().split("T")[0],
      status: "pending",
      reason: "",
      file: formData.file,
    };

    setProposals([newProposal, ...proposals]);
    setShowForm(false);
    setFormData({ title: "", content: "", file: null, editId: null });
  };

  const filteredProposals =
    filterStatus === "all"
      ? proposals
      : proposals.filter((p) => p.status === filterStatus);

  const statusLabel = {
    pending: "Chờ duyệt",
    approved: "Đã duyệt",
    rejected: "Từ chối",
  };

  const statusColor = {
    pending: "text-yellow-600 bg-yellow-100",
    approved: "text-green-600 bg-green-100",
    rejected: "text-red-600 bg-red-100",
  };

  return (
    <div className="p-8">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Đề xuất & Yêu cầu</h1>

        <button
          onClick={() => {
            setFormData({ title: "", content: "", file: null, editId: null });
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          <Plus size={20} /> Thêm đề xuất
        </button>
      </div>

      {/* FILTER */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-600 mb-2">Bộ lọc</h3>
        <div className="flex gap-2">
          {[
            { key: "all", label: "Tất cả" },
            { key: "pending", label: "Chờ duyệt" },
            { key: "approved", label: "Đã duyệt" },
            { key: "rejected", label: "Từ chối" },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilterStatus(f.key)}
              className={`px-4 py-2 rounded-lg border text-sm transition ${
                filterStatus === f.key
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* LIST */}
      <div className="flex flex-col gap-4">
        {filteredProposals.map((p) => (
          <div
            key={p.id}
            className="bg-white p-5 shadow-md rounded-xl border hover:shadow-lg transition relative"
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-bold text-gray-800">{p.title}</h2>
                <p className="text-sm text-gray-500 mt-1">Ngày gửi: {p.date}</p>

                <span
                  className={`inline-block mt-2 px-3 py-1 rounded-full text-sm ${statusColor[p.status]}`}
                >
                  {statusLabel[p.status]}
                </span>
              </div>

              <div className="relative">
                <button
                  onClick={() =>
                    setOpenMenuId(openMenuId === p.id ? null : p.id)
                  }
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <MoreVertical size={20} />
                </button>

                {openMenuId === p.id && (
                  <div className="absolute right-0 mt-2 bg-white shadow-lg border rounded-lg w-40 z-10">
                    <button
                      onClick={() => {
                        setSelectedProposal(p);
                        setShowReason(true);
                        setOpenMenuId(null);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Xem chi tiết
                    </button>

                    {p.status === "pending" && (
                      <>
                        <button
                          onClick={() => {
                            setFormData({
                              title: p.title,
                              content: p.content,
                              file: p.file,
                              editId: p.id,
                            });
                            setShowForm(true);
                            setOpenMenuId(null);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                          Chỉnh sửa
                        </button>

                        <button
                          onClick={() => {
                            setProposals(
                              proposals.filter((item) => item.id !== p.id)
                            );
                            setOpenMenuId(null);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                        >
                          Huỷ
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {filteredProposals.length === 0 && (
          <p className="text-center text-gray-500 pt-10">
            Không có đề xuất nào.
          </p>
        )}
      </div>

      {/* MODAL: FORM */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-xl w-[500px] relative">
            <button
              onClick={() => setShowForm(false)}
              className="absolute right-4 top-4 text-gray-500 hover:text-black"
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-bold mb-4">
              {formData.editId ? "Chỉnh sửa đề xuất" : "Gửi đề xuất mới"}
            </h2>

            <form onSubmit={handleSubmit}>
              <label className="block mb-2 font-medium">Tiêu đề</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full border rounded-lg p-2 mb-4"
              />

              <label className="block mb-2 font-medium">Nội dung đề xuất</label>
              <textarea
                rows={4}
                required
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                className="w-full border rounded-lg p-2 mb-4"
              />

              <label className="block mb-2 font-medium">Đính kèm file</label>
              <input
                type="file"
                onChange={(e) =>
                  setFormData({ ...formData, file: e.target.files[0] })
                }
                className="w-full border rounded-lg p-2 mb-4"
              />

              {formData.file && (
                <p className="text-sm text-gray-600 mb-4">
                  📎 File đã chọn: <strong>{formData.file.name}</strong>
                </p>
              )}

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              >
                {formData.editId ? "Cập nhật" : "Gửi đề xuất"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: XEM CHI TIẾT */}
      {showReason && selectedProposal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-xl w-[550px] relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowReason(false)}
              className="absolute right-4 top-4 text-gray-500 hover:text-black"
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-bold mb-4">Chi tiết đề xuất</h2>

            {/* Tiêu đề */}
            <div className="mb-4">
              <p className="text-gray-600 font-medium mb-1">Tiêu đề:</p>
              <p className="text-gray-800 font-semibold text-lg">
                {selectedProposal.title}
              </p>
            </div>

            {/* Nội dung trong 1 khung */}
            <div className="mb-4">
              <p className="text-gray-600 font-medium mb-1">Nội dung đề xuất:</p>
              <div className="border rounded-lg bg-gray-50 p-4 text-gray-800 leading-relaxed max-h-[250px] overflow-y-auto">
                {selectedProposal.content}
              </div>
            </div>

            {/* Trạng thái */}
            <div className="mb-4">
              <p className="text-gray-600 font-medium mb-1">Trạng thái:</p>
              <p className="font-semibold">
                {statusLabel[selectedProposal.status]}
              </p>
            </div>

            {/* Lý do */}
            <div className="mb-4">
              <p className="text-gray-600 font-medium mb-1">Lý do duyệt / từ chối:</p>
              <div className="border rounded-lg bg-gray-50 p-3 text-gray-700">
                {selectedProposal.reason || "Không có"}
              </div>
            </div>

            {/* File đính kèm */}
            {selectedProposal.file && (
              <div className="mb-4">
                <p className="text-gray-600 font-medium mb-1">File đính kèm:</p>
                <a className="text-blue-600 underline cursor-pointer" href="#">
                  {selectedProposal.file.name}
                </a>
              </div>
            )}

            <div className="mt-6 text-right">
              <button
                onClick={() => setShowReason(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
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

export default FacultyProposals;
