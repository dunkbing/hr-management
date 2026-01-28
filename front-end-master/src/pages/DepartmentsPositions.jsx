import { useState, useEffect } from "react";
import { Plus, Search, Eye, Edit, Users } from "lucide-react";
import AddDepartmentModal from "../components/AddDepartmentModal";
import Pagination from "../components/Pagination";

const Departments = () => {
  const mainColor = "#009FE3";

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [initialData, setInitialData] = useState(null);
  const [staffList, setStaffList] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // =========================
  // FETCH DEPARTMENTS
  // =========================
  const fetchDepartments = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token"); // 🔹 Lấy token
      const res = await fetch("http://localhost:8080/api/departments", {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` // 🔹 Gửi kèm token
        },
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setDepartments(data);
    } catch (err) {
      console.error("Lỗi fetch departments:", err);
      alert("Không tải được danh sách phòng ban. Vui lòng thử lại!");
      setDepartments([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  // =========================
  // FILTER
  // =========================
  const filteredDepartments = departments.filter((d) => {
    const matchSearch =
      d.departmentName?.toLowerCase().includes(search.toLowerCase()) ||
      d.departmentCode?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter ? d.status === statusFilter : true;
    return matchSearch && matchStatus;
    return matchSearch && matchStatus;
  });

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDepartments = filteredDepartments.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);
  const handleItemsPerPageChange = (size) => {
    setItemsPerPage(size);
    setCurrentPage(1);
  };

  // =========================
  // ADD DEPARTMENT
  // =========================
  const handleAddDepartment = async (formData) => {
    try {
      const token = localStorage.getItem("token");
      const isEdit = !!initialData;
      const url = isEdit
        ? `http://localhost:8080/api/departments/${initialData.departmentId}`
        : "http://localhost:8080/api/departments";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          departmentCode: formData.code,
          departmentName: formData.name,
          orderIndex: Number(formData.orderIndex) || 0,
          parentId: formData.parentId || null,
          status: formData.status,
          managerId: formData.managerId || null,
        }),
      });

      if (!res.ok) throw new Error(`${isEdit ? "Cập nhật" : "Thêm"} phòng ban thất bại`);

      alert(`${isEdit ? "Cập nhật" : "Thêm"} phòng ban thành công!`);
      fetchDepartments();
      setShowAddModal(false);
      setInitialData(null);
    } catch (err) {
      console.error(err);
      alert(err.message || "Thao tác thất bại");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa phòng ban này?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8080/api/departments/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        },
      });
      if (!res.ok) throw new Error("Xóa phòng ban thất bại");
      alert("Xóa thành công!");
      fetchDepartments();
      setShowViewModal(false);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleShowStaff = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8080/api/departments/${id}/staff`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setStaffList(data);
        setShowStaffModal(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 bg-[#f9fafb] min-h-screen">
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Danh sách phòng ban</h1>
        <p className="text-sm text-gray-500">Quản lý hoạt động & nhân sự phòng ban</p>
      </div>

      {/* FILTER BAR */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-3 items-center w-2/3">
          <div className="relative w-1/2">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm theo tên / mã phòng ban"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-md text-sm focus:ring-2 focus:ring-[#009FE3]"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-md px-3 py-2 text-sm"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="ACTIVE">Hoạt động</option>
            <option value="INACTIVE">Ngưng</option>
          </select>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-[#009FE3] text-white px-4 py-2 rounded-md hover:bg-[#009FE3]"
        >
          <Plus size={18} />
          Thêm phòng ban
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded shadow p-4">
          <p className="text-sm text-gray-500">Phòng ban</p>
          <p className="text-2xl font-bold">{departments.length}</p>
        </div>
        <div className="bg-white rounded shadow p-4">
          <p className="text-sm text-gray-500">Hoạt động</p>
          <p className="text-2xl font-bold text-green-600">
            {departments.filter((d) => d.status === "ACTIVE").length}
          </p>
        </div>
        <div className="bg-white rounded shadow p-4">
          <p className="text-sm text-gray-500">Ngưng</p>
          <p className="text-2xl font-bold text-red-600">
            {departments.filter((d) => d.status === "INACTIVE").length}
          </p>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {isLoading ? (
          <div className="text-center py-10 text-gray-500">Đang tải dữ liệu...</div>
        ) : filteredDepartments.length === 0 ? (
          <div className="text-center py-10 text-gray-500">Chưa có phòng ban nào</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="px-4 py-3 text-left">STT</th>
                <th className="px-4 py-3 text-left">Mã</th>
                <th className="px-4 py-3 text-left">Tên phòng ban</th>
                <th className="px-4 py-3 text-left">Trưởng phòng</th>
                <th className="px-4 py-3 text-center">Nhân sự</th>
                <th className="px-4 py-3 text-center">Trạng thái</th>
                <th className="px-4 py-3 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {currentDepartments.map((d, index) => (
                <tr
                  key={d.departmentId}
                  className="border-t"
                  onClick={() => setSelectedDept(d)}
                >
                  <td className="px-4 py-3">{indexOfFirstItem + index + 1}</td>
                  <td className="px-4 py-3 font-medium">{d.departmentCode}</td>
                  <td className="px-4 py-3">{d.departmentName}</td>
                  <td className="px-4 py-3">{d.managerName || ""}</td>
                  <td className="px-4 py-3 text-center">{d.totalStaff || 0}</td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${d.status === "ACTIVE"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                        }`}
                    >
                      {d.status === "ACTIVE" ? "Hoạt động" : "Ngưng hoạt động"}
                    </span>
                  </td>
                  <td
                    className="px-4 py-3 text-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex justify-center gap-2">
                      <Eye
                        size={18}
                        className="text-[#009FE3] hover:scale-110 transition-transform cursor-pointer"
                        onClick={() => {
                          setSelectedDept(d);
                          setShowViewModal(true);
                        }}
                      />
                      <Edit
                        size={18}
                        className="text-gray-500 hover:text-orange-500 hover:scale-110 transition-transform cursor-pointer"
                        onClick={() => {
                          setInitialData({
                            ...d,
                            code: d.departmentCode,
                            name: d.departmentName,
                          });
                          setShowAddModal(true);
                        }}
                      />
                      <Users
                        size={18}
                        className="text-gray-500 hover:text-green-500 hover:scale-110 transition-transform cursor-pointer"
                        onClick={() => {
                          setSelectedDept(d);
                          handleShowStaff(d.departmentId);
                        }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Pagination
        totalItems={filteredDepartments.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
      />

      {/* ADD DEPARTMENT MODAL */}
      <AddDepartmentModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setInitialData(null);
        }}
        onAdd={handleAddDepartment}
        nodes={departments}
        initialData={initialData}
      />

      {/* VIEW DETAILS MODAL */}
      {showViewModal && selectedDept && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
            <div className="bg-[#009FE3] text-white px-6 py-4 flex justify-between items-center">
              <h3 className="text-lg font-bold">Chi tiết phòng ban</h3>
              <button onClick={() => setShowViewModal(false)} className="text-white hover:opacity-80">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div><p className="text-xs text-gray-500 uppercase">Mã phòng ban</p><p className="font-semibold text-gray-800">{selectedDept.departmentCode}</p></div>
              <div><p className="text-xs text-gray-500 uppercase">Tên phòng ban</p><p className="font-semibold text-gray-800">{selectedDept.departmentName}</p></div>
              <div><p className="text-xs text-gray-500 uppercase">Trưởng phòng</p><p className="text-gray-800">{selectedDept.managerName || "Chưa có"}</p></div>
              <div><p className="text-xs text-gray-500 uppercase">Số lượng nhân sự</p><p className="text-gray-800">{selectedDept.totalStaff} người</p></div>
              <div><p className="text-xs text-gray-500 uppercase">Trạng thái</p>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${selectedDept.status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                  {selectedDept.status === "ACTIVE" ? "Hoạt động" : "Ngưng hoạt động"}
                </span>
              </div>
              <div className="pt-4 border-t flex justify-end gap-3">
                <button onClick={() => handleDelete(selectedDept.departmentId)} className="bg-red-50 text-red-600 px-4 py-2 rounded-md hover:bg-red-100 text-sm font-medium">Xóa phòng ban</button>
                <button onClick={() => setShowViewModal(false)} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 text-sm">Đóng</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STAFF LIST MODAL */}
      {showStaffModal && selectedDept && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden">
            <div className="bg-[#009FE3] text-white px-6 py-4 flex justify-between items-center">
              <h3 className="text-lg font-bold">Nhân sự: {selectedDept.departmentName}</h3>
              <button onClick={() => setShowStaffModal(false)} className="text-white hover:opacity-80">✕</button>
            </div>
            <div className="p-6">
              <div className="overflow-auto max-h-[60vh]">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-600">
                    <tr>
                      <th className="px-4 py-2 text-left">STT</th>
                      <th className="px-4 py-2 text-left">Tên đăng nhập</th>
                      <th className="px-4 py-2 text-left">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {staffList.length === 0 ? (
                      <tr><td colSpan="3" className="text-center py-10 text-gray-500">Phòng ban này chưa có nhân sự</td></tr>
                    ) : (
                      staffList.map((s, idx) => (
                        <tr key={s.userId} className="border-t hover:bg-gray-50">
                          <td className="px-4 py-2">{idx + 1}</td>
                          <td className="px-4 py-2 font-medium">{s.username}</td>
                          <td className="px-4 py-2">
                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${s.status ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                              {s.status ? "Kích hoạt" : "Khóa"}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <div className="pt-4 mt-4 border-t text-right">
                <button onClick={() => setShowStaffModal(false)} className="bg-[#009FE3] text-white px-6 py-2 rounded-md hover:bg-[#009FE3] text-sm">Đóng</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Departments;
