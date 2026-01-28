import React, { useState, useEffect } from "react";
import { FaPlus, FaSearch, FaEdit, FaTrash, FaTimes, FaSave } from "react-icons/fa";
import positionApi from "../api/positionApi";
import facultyApi from "../api/facultyApi";
import departmentApi from "../api/departmentApi";
import Pagination from "../components/Pagination";

const Positions = () => {
  const primary = "#009FE3";

  const [positions, setPositions] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");

  const [unitFilter, setUnitFilter] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingPos, setEditingPos] = useState(null);
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: "",
    unitType: "Khoa", // Khoa hoặc Phòng ban
    facultyId: "",
    departmentId: ""
  });

  useEffect(() => {
    fetchData();
    loadMetadata();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await positionApi.getAll();
      setPositions(res.data);
    } catch (err) {
      console.error("Lỗi tải chức danh:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadMetadata = async () => {
    try {
      const [facRes, depRes] = await Promise.all([
        facultyApi.getAll({ status: "ACTIVE" }),
        departmentApi.getAll()
      ]);
      setFaculties(facRes.data);
      setDepartments(depRes.data);
    } catch (err) {
      console.error("Lỗi tải metadata:", err);
    }
  };

  const handleOpenModal = (pos = null) => {
    if (pos) {
      setEditingPos(pos);
      setFormData({
        code: pos.code || "",
        name: pos.name,
        description: pos.description || "",
        unitType: pos.unitType || "Khoa",
        facultyId: pos.unitType === "Khoa" ? pos.unitId : "",
        departmentId: pos.unitType === "Phòng ban" ? pos.unitId : ""
      });
    } else {
      setEditingPos(null);
      setFormData({
        code: "",
        name: "",
        description: "",
        unitType: "Khoa",
        facultyId: "",
        departmentId: ""
      });
    }
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.code) return alert("Vui lòng nhập mã chức danh");
    if (!formData.name) return alert("Vui lòng nhập tên chức danh");
    if (formData.unitType === "Khoa" && !formData.facultyId) return alert("Vui lòng chọn khoa");
    if (formData.unitType === "Phòng ban" && !formData.departmentId) return alert("Vui lòng chọn phòng ban");

    const payload = {
      code: formData.code,
      name: formData.name,
      description: formData.description,
      facultyId: formData.unitType === "Khoa" ? formData.facultyId : null,
      departmentId: formData.unitType === "Phòng ban" ? formData.departmentId : null
    };

    try {
      if (editingPos) {
        await positionApi.update(editingPos.id, payload);
      } else {
        await positionApi.create(payload);
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      alert("Lỗi khi lưu chức danh: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xoá chức danh này?")) return;
    try {
      await positionApi.delete(id);
      fetchData();
    } catch (err) {
      alert("Lỗi khi xoá chức danh");
    }
  };

  /** ================= FILTER ================= */
  const filtered = positions.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchUnit = unitFilter ? p.unitType === unitFilter : true;
    return matchSearch && matchUnit;
  });

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filtered.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);
  const handleItemsPerPageChange = (size) => {
    setItemsPerPage(size);
    setCurrentPage(1); // Reset to first page when changing size
  };

  /** ================= STATISTIC ================= */
  const total = positions.length;
  const totalFaculty = positions.filter(p => p.unitType === "Khoa").length;
  const totalDepartment = positions.filter(p => p.unitType === "Phòng ban").length;

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6 text-gray-800">
      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Danh sách chức danh
          </h1>
          <p className="text-gray-500">
            Quản lý chức danh theo khoa và phòng ban
          </p>
        </div>
      </div>

      {/* ================= FILTER BAR ================= */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="flex gap-4 w-full lg:w-auto">
          <div className="relative w-full lg:w-72">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo tên chức danh"
              className="pl-10 pr-3 py-2 border rounded-lg w-full bg-white focus:outline-none focus:ring-1 focus:ring-[#009FE3]"
            />
          </div>

          <select
            value={unitFilter}
            onChange={(e) => setUnitFilter(e.target.value)}
            className="border rounded-lg px-3 py-2 bg-white focus:outline-none"
          >
            <option value="">Tất cả đơn vị</option>
            <option value="Khoa">Khoa</option>
            <option value="Phòng ban">Phòng ban</option>
          </select>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-white shadow-sm hover:opacity-90 transition"
          style={{ backgroundColor: primary }}
        >
          <FaPlus /> Thêm chức danh
        </button>
      </div>

      {/* ================= STATISTIC ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Tổng chức danh" value={total} color="text-[#009FE3]" />
        <StatCard title="Theo khoa" value={totalFaculty} color="text-green-600" />
        <StatCard title="Theo phòng ban" value={totalDepartment} color="text-orange-500" />
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-gray-500 italic">Đang tải dữ liệu...</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 border-b">
              <tr>
                <th className="px-6 py-4 text-left font-semibold w-16">STT</th>
                <th className="px-6 py-4 text-left font-semibold">Mã chức danh</th>
                <th className="px-6 py-4 text-left font-semibold">Tên chức danh</th>
                <th className="px-6 py-4 text-left font-semibold">Loại đơn vị</th>
                <th className="px-6 py-4 text-left font-semibold">Tên đơn vị</th>
                <th className="px-6 py-4 text-center font-semibold">Hành động</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {currentItems.map((p, index) => (
                <tr
                  key={p.id}
                  className="hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-4 text-gray-500 w-16">
                    {indexOfFirstItem + index + 1}
                  </td>

                  <td className="px-6 py-4">
                    <div className="font-semibold text-[#009FE3]">{p.code}</div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-800">{p.name}</div>
                    <div className="text-xs text-gray-400 line-clamp-1">{p.description}</div>
                  </td>

                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${p.unitType === "Khoa" ? "bg-green-50 text-green-600" : "bg-orange-50 text-orange-600"
                      }`}>
                      {p.unitType}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-gray-700">
                    {p.unitName}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => handleOpenModal(p)}
                        className="p-2 rounded-full bg-sky-50 text-[#009FE3] hover:bg-sky-100"
                        title="Chỉnh sửa"
                      >
                        <FaEdit size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-2 rounded-full bg-red-50 text-red-500 hover:bg-red-100"
                        title="Xoá"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-12 text-gray-400 italic">
                    Không tìm thấy dữ liệu chức danh
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <Pagination
        totalItems={filtered.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
      />

      {/* ================= MODAL ================= */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
              <h2 className="text-xl font-bold text-gray-800">
                {editingPos ? "Chỉnh sửa chức danh" : "Thêm chức danh mới"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Loại đơn vị</label>
                  <select
                    value={formData.unitType}
                    onChange={(e) => setFormData({ ...formData, unitType: e.target.value, facultyId: "", departmentId: "" })}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-1 focus:ring-[#009FE3] outline-none bg-white font-medium shadow-sm"
                  >
                    <option value="Khoa">Khoa</option>
                    <option value="Phòng ban">Phòng ban</option>
                  </select>
                </div>

                <div>
                  {formData.unitType === "Khoa" ? (
                    <>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Chọn Khoa</label>
                      <select
                        value={formData.facultyId}
                        onChange={(e) => setFormData({ ...formData, facultyId: e.target.value })}
                        className="w-full border rounded-lg px-3 py-2 focus:ring-1 focus:ring-[#009FE3] outline-none bg-white font-medium shadow-sm"
                      >
                        <option value="">-- Chọn Khoa --</option>
                        {faculties.map(f => (
                          <option key={f.id} value={f.id}>{f.name}</option>
                        ))}
                      </select>
                    </>
                  ) : (
                    <>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Chọn Phòng ban</label>
                      <select
                        value={formData.departmentId}
                        onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                        className="w-full border rounded-lg px-3 py-2 focus:ring-1 focus:ring-[#009FE3] outline-none bg-white font-medium shadow-sm"
                      >
                        <option value="">-- Chọn Phòng ban --</option>
                        {departments.map(d => (
                          <option key={d.departmentId} value={d.departmentId}>{d.departmentName}</option>
                        ))}
                      </select>
                    </>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mã chức danh <span className="text-red-500">*</span></label>
                  <input
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-1 focus:ring-[#009FE3] outline-none shadow-sm"
                    placeholder="Ví dụ: GV, TP..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tên chức danh <span className="text-red-500">*</span></label>
                  <input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-1 focus:ring-[#009FE3] outline-none shadow-sm"
                    placeholder="Ví dụ: Giảng viên, Trưởng phòng..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-1 focus:ring-[#009FE3] outline-none shadow-sm"
                  rows="2"
                  placeholder="Nhập mô tả chức danh..."
                />
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-100 transition"
              >
                Huỷ bỏ
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-2 rounded-lg text-white font-semibold shadow-md active:scale-95 transition"
                style={{ backgroundColor: primary }}
              >
                <FaSave /> {editingPos ? "Cập nhật" : "Lưu lại"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/** ================= STAT CARD ================= */
const StatCard = ({ title, value, color }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition">
    <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">{title}</p>
    <p className={`text-3xl font-bold mt-1 ${color}`}>{value}</p>
  </div>
);

export default Positions;
