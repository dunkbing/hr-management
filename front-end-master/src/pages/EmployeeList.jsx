import React, { useState, useEffect } from "react";
import Pagination from "../components/Pagination";
import { useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaEdit,
  FaTrash,
  FaPlus,
  FaFileExcel,
  FaEye,
} from "react-icons/fa";
import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

function EmployeeList() {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  const [roles, setRoles] = useState([]);

  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [unitType, setUnitType] = useState("");
  const [unitName, setUnitName] = useState("");

  const [filtered, setFiltered] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modal States
  const [showImportModal, setShowImportModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const [usersResp, facResp, depResp, posResp, rolesResp] = await Promise.all([
        axios.get(`${API_BASE_URL}/users`, config),
        axios.get(`${API_BASE_URL}/faculties`, config),
        axios.get(`${API_BASE_URL}/departments`, config),
        axios.get(`${API_BASE_URL}/positions`, config),
        axios.get(`${API_BASE_URL}/roles`, config),
      ]);
      setEmployees(usersResp.data);
      setFaculties(facResp.data);
      setDepartments(depResp.data);
      setPositions(posResp.data);
      setRoles(rolesResp.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  // ===== FILTER LOGIC =====
  useEffect(() => {
    const applyFilters = async () => {
      let baseData = [];

      if (searchTerm.trim() !== "") {
        try {
          const token = localStorage.getItem("token");
          const res = await axios.get(`${API_BASE_URL}/users/search?q=${searchTerm}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          baseData = res.data;
        } catch (error) {
          console.error("Search error:", error);
          // Fallback to local search if API fails
          baseData = employees.filter(emp =>
            emp.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.username?.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
      } else {
        baseData = employees;
      }

      // Apply unit filters locally
      let result = [...baseData];
      if (unitType) {
        if (unitType === "Khoa") {
          result = result.filter((e) => e.facultyName);
        } else {
          result = result.filter((e) => e.departmentName);
        }
      }

      if (unitName) {
        result = result.filter((e) =>
          e.facultyName === unitName || e.departmentName === unitName
        );
      }

      setFiltered(result);
      setCurrentPage(1); // Reset to first page whenever filters change
    };

    if (searchTerm.trim() !== "") {
      const delayDebounceFn = setTimeout(applyFilters, 500);
      return () => clearTimeout(delayDebounceFn);
    } else {
      applyFilters();
    }
  }, [searchTerm, unitType, unitName, employees]);

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xoá người dùng này?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`${API_BASE_URL}/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert("Xoá thành công");
        fetchData();
      } catch (error) {
        alert("Xoá thất bại");
      }
    }
  };

  // ===== STATISTICS =====
  const totalEmployees = employees.length;
  const totalFaculty = employees.filter((e) => e.facultyId || e.facultyName).length;
  const totalDepartment = employees.filter((e) => e.departmentId || e.departmentName).length;

  // ===== PAGINATION LOGIC =====
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filtered.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (size) => {
    setItemsPerPage(size);
    setCurrentPage(1);
  };

  return (
    <div className="p-6 space-y-6">
      {/* ===== HEADER ===== */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Quản lý nhân viên
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Danh sách cán bộ, giảng viên, nhân sự
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => navigate("/employees/add")}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white bg-[#009FE3] hover:bg-[#008bc7]"
          >
            <FaPlus /> Thêm mới
          </button>

          <button
            onClick={() => setShowImportModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white bg-green-600 hover:bg-green-700">
            <FaFileExcel /> Nhập Excel
          </button>
        </div>
      </div>

      {/* ===== STATISTICS (ĐÃ THÊM LẠI) ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Tổng nhân viên</p>
          <p className="text-3xl font-black text-[#009FE3]">
            {totalEmployees}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Nhân viên theo khoa</p>
          <p className="text-3xl font-black text-purple-600">
            {totalFaculty}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Nhân viên theo phòng ban</p>
          <p className="text-3xl font-black text-emerald-600">
            {totalDepartment}
          </p>
        </div>
      </div>

      {/* ===== FILTER + SEARCH ===== */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="relative w-72">
          <FaSearch className="absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo tên..."
            className="pl-10 pr-4 py-2 w-full bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#009FE3]/20 transition-all font-medium text-slate-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          value={unitType}
          onChange={(e) => {
            setUnitType(e.target.value);
            setUnitName("");
          }}
          className="bg-white border border-slate-200 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-[#009FE3]/20 transition-all font-semibold text-slate-600"
        >
          <option value="">Tất cả đơn vị</option>
          <option value="Khoa">Khoa</option>
          <option value="Phòng ban">Phòng ban</option>
        </select>

        <select
          value={unitName}
          onChange={(e) => setUnitName(e.target.value)}
          disabled={!unitType}
          className="bg-white border border-slate-200 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-[#009FE3]/20 transition-all font-semibold text-slate-600 disabled:bg-slate-50 disabled:text-slate-400"
        >
          <option value="">-- Chọn đơn vị --</option>
          {(unitType === "Khoa" ? faculties : departments).map((u, i) => (
            <option key={i} value={u.name || u.departmentName}>
              {u.name || u.departmentName}
            </option>
          ))}
        </select>
      </div>

      {/* ===== TABLE ===== */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50/80 text-slate-800 font-black uppercase tracking-widest text-[10px] border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-left">STT</th>
              <th className="px-6 py-4 text-left">Họ và tên</th>
              <th className="px-6 py-4 text-left">Email</th>
              <th className="px-6 py-4 text-left">Chức vụ</th>
              <th className="px-6 py-4 text-left">Đơn vị</th>
              <th className="px-6 py-4 text-left">Ngày sinh</th>
              <th className="px-6 py-4 text-center">Hành động</th>
            </tr>
          </thead>

          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((emp, index) => (
                <tr
                  key={emp.userId}
                  className="border-b border-slate-50 hover:bg-slate-50/50 transition"
                >
                  <td className="px-6 py-4 text-slate-500 font-bold">{indexOfFirstItem + index + 1}</td>
                  <td className="px-6 py-4 font-bold text-slate-900">{emp.fullName || emp.username}</td>
                  <td className="px-6 py-4 text-slate-600 font-medium">{emp.email || "---"}</td>
                  <td className="px-6 py-4 text-slate-600 font-medium">{emp.positionName || "Chưa cập nhật"}</td>
                  <td className="px-6 py-4 text-slate-600 font-medium">{emp.facultyName || emp.departmentName || "Hệ thống"}</td>
                  <td className="px-6 py-4 text-slate-600 font-medium">{emp.dob || "---"}</td>

                  <td className="px-6 py-3">
                    <div className="flex justify-center items-center gap-1">
                      <button
                        onClick={() => navigate(`/employees/${emp.userId}`)}
                        title="Xem chi tiết"
                        className="p-2 rounded-full text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition"
                      >
                        <FaEye size={14} />
                      </button>

                      {(() => {
                        const currentRole = localStorage.getItem("role");
                        const currentUsername = localStorage.getItem("username");
                        const targetRole = emp.roleCode || (emp.role ? emp.role.roleCode : "");

                        // Rule 1: No one usually edits/deletes SuperAdmin except SuperAdmin (if allowed)
                        // But specifically: "tất cả các tài khoản khác thấp hơn superadmin đều không có quyền chỉnh sửa và xoá tài khoản superadmin"
                        const isTargetSuperAdmin = targetRole === "superadmin";
                        const isCurrentSuperAdmin = currentRole === "superadmin";

                        if (isTargetSuperAdmin && !isCurrentSuperAdmin) {
                          return null; // Hide both Edit and Delete
                        }

                        // Edit Button
                        // If target is SuperAdmin, only SuperAdmin can see (already handled above)
                        const canEdit = true;

                        // Delete Button
                        // 1. Cannot delete self
                        // 2. Admin cannot delete Admin (only SuperAdmin can)
                        // 3. Admin cannot delete SuperAdmin (handled above)
                        let canDelete = true;

                        if (emp.username === currentUsername) canDelete = false;
                        if (targetRole === "admin" && currentRole === "admin") canDelete = false;

                        return (
                          <>
                            {canEdit && (
                              <button
                                title="Chỉnh sửa"
                                onClick={() => navigate(`/employees/edit/${emp.userId}`)}
                                className="p-2 rounded-full text-[#009FE3] hover:text-[#008bc7] hover:bg-[#009FE3]/10 transition"
                              >
                                <FaEdit size={14} />
                              </button>
                            )}

                            {canDelete && (
                              <button
                                title="Xoá"
                                onClick={() => handleDelete(emp.userId)}
                                className="p-2 rounded-full text-red-500 hover:text-red-700 hover:bg-red-50 transition"
                              >
                                <FaTrash size={14} />
                              </button>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="text-center text-gray-500 py-6 italic"
                >
                  Không tìm thấy nhân viên nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        totalItems={filtered.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
      />
      {/* ===== MODALS ===== */}

      {showImportModal && (
        <ImportExcelModal
          onClose={() => setShowImportModal(false)}
          onSuccess={() => {
            setShowImportModal(false);
            fetchData();
          }}
        />
      )}
    </div>
  );
}

// ===== SUB-COMPONENTS =====


function ImportExcelModal({ onClose, onSuccess }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleDownloadTemplate = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/users/template`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'user_template.xlsx');
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Error downloading template:", error);
      alert("Lỗi khi tải file mẫu");
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("Vui lòng chọn file");
    const formData = new FormData();
    formData.append("file", file);
    try {
      setUploading(true);
      const token = localStorage.getItem("token");
      const response = await axios.post(`${API_BASE_URL}/users/import`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        },
        responseType: 'arraybuffer' // Quan trọng để nhận file blob
      });

      // Kiểm tra header lỗi từ backend
      if (response.headers['x-import-error'] === 'true') {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'import_errors.xlsx');
        document.body.appendChild(link);
        link.click();
        alert("⚠️ Một số dòng bị lỗi. Vui lòng kiểm tra file 'import_errors.xlsx' vừa tải xuống.");
      } else {
        alert("✅ Nhập dữ liệu thành công");
      }
      onSuccess();
    } catch (error) {
      console.error("Error uploading file:", error);
      let errorMsg = "Lỗi khi tải file";
      if (error.response?.data instanceof ArrayBuffer) {
        const decodedString = new TextDecoder().decode(error.response.data);
        try {
          const errorJson = JSON.parse(decodedString);
          errorMsg = errorJson.message || errorMsg;
        } catch (e) {
          errorMsg = decodedString || errorMsg;
        }
      }
      alert("❌ " + errorMsg);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-800">Nhập từ Excel</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-[#009FE3]/5 p-4 rounded-lg flex flex-col items-center gap-3">
            <p className="text-sm text-[#009FE3] text-center">Tải file mẫu về để nhập dữ liệu đúng định dạng hệ thống</p>
            <button
              onClick={handleDownloadTemplate}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-[#009FE3] text-[#009FE3] rounded-lg hover:bg-[#009FE3]/10"
            >
              <FaFileExcel /> Tải file mẫu
            </button>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Chọn file Excel đã nhập</label>
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <div className="flex gap-3">
            <button
              disabled={uploading}
              onClick={handleUpload}
              className="flex-1 bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-400"
            >
              {uploading ? "Đang xử lý..." : "Tải lên & Lưu"}
            </button>
            <button onClick={onClose} className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200">
              Hủy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeList;
