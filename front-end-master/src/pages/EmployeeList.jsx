import React, { useState, useEffect } from "react";
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
  const itemsPerPage = 10;

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

  return (
    <div className="p-6 space-y-6">
      {/* ===== HEADER ===== */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Quản lý nhân viên
          </h1>
          <p className="text-sm text-gray-500">
            Danh sách cán bộ, giảng viên, nhân sự
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => navigate("/employees/add")}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700"
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
        <div className="bg-white rounded-xl shadow p-4">
          <p className="text-sm text-gray-500">Tổng nhân viên</p>
          <p className="text-2xl font-semibold text-blue-600">
            {totalEmployees}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <p className="text-sm text-gray-500">Nhân viên theo khoa</p>
          <p className="text-2xl font-semibold text-purple-600">
            {totalFaculty}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <p className="text-sm text-gray-500">Nhân viên theo phòng ban</p>
          <p className="text-2xl font-semibold text-green-600">
            {totalDepartment}
          </p>
        </div>
      </div>

      {/* ===== FILTER + SEARCH ===== */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="relative w-72">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm theo tên..."
            className="pl-10 pr-4 py-2 w-full border rounded-lg"
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
          className="border rounded-lg px-3 py-2"
        >
          <option value="">Tất cả đơn vị</option>
          <option value="Khoa">Khoa</option>
          <option value="Phòng ban">Phòng ban</option>
        </select>

        <select
          value={unitName}
          onChange={(e) => setUnitName(e.target.value)}
          disabled={!unitType}
          className="border rounded-lg px-3 py-2"
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
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-6 py-3">STT</th>
              <th className="px-6 py-3">Họ và tên</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Chức vụ</th>
              <th className="px-6 py-3">Đơn vị</th>
              <th className="px-6 py-3">Ngày sinh</th>
              <th className="px-6 py-3 text-center">Hành động</th>
            </tr>
          </thead>

          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((emp, index) => (
                <tr
                  key={emp.userId}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-3">{indexOfFirstItem + index + 1}</td>
                  <td className="px-6 py-3 font-medium">{emp.fullName || emp.username}</td>
                  <td className="px-6 py-3">{emp.email || "---"}</td>
                  <td className="px-6 py-3">{emp.positionName || "Chưa cập nhật"}</td>
                  <td className="px-6 py-3">{emp.facultyName || emp.departmentName || "Hệ thống"}</td>
                  <td className="px-6 py-3">{emp.dob || "---"}</td>

                  <td className="px-6 py-3">
                    <div className="flex justify-center items-center gap-1">
                      <button
                        onClick={() => navigate(`/employees/${emp.userId}`)}
                        title="Xem chi tiết"
                        className="p-2 rounded-full text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition"
                      >
                        <FaEye size={14} />
                      </button>

                      <button
                        title="Chỉnh sửa"
                        onClick={() => navigate(`/employees/edit/${emp.userId}`)}
                        className="p-2 rounded-full text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition"
                      >
                        <FaEdit size={14} />
                      </button>

                      {emp.username !== localStorage.getItem("username") && (
                        <button
                          title="Xoá"
                          onClick={() => handleDelete(emp.userId)}
                          className="p-2 rounded-full text-red-500 hover:text-red-700 hover:bg-red-50 transition"
                        >
                          <FaTrash size={14} />
                        </button>
                      )}
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

      {/* ===== PAGINATION CONTROLS ===== */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded border bg-white disabled:opacity-50 hover:bg-gray-50 transition"
          >
            Trước
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => handlePageChange(i + 1)}
              className={`px-3 py-1 rounded border transition ${currentPage === i + 1
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white hover:bg-gray-50"
                }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded border bg-white disabled:opacity-50 hover:bg-gray-50 transition"
          >
            Sau
          </button>
        </div>
      )}
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
      await axios.post(`${API_BASE_URL}/users/import`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });
      alert("Nhập dữ liệu thành công");
      onSuccess();
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Lỗi khi tải file: " + (error.response?.data || error.message));
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
          <div className="bg-blue-50 p-4 rounded-lg flex flex-col items-center gap-3">
            <p className="text-sm text-blue-700 text-center">Tải file mẫu về để nhập dữ liệu đúng định dạng hệ thống</p>
            <button
              onClick={handleDownloadTemplate}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50"
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
