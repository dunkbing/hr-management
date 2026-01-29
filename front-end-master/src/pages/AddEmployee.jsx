import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaSave, FaTimes, FaUserPlus, FaUserEdit } from "react-icons/fa";
import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

const AddEmployee = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const mainColor = "#009FE3";

  const [faculties, setFaculties] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [unitType, setUnitType] = useState("");
  const [unitId, setUnitId] = useState("");
  const [positionId, setPositionId] = useState("");
  const [roleId, setRoleId] = useState("");

  const [form, setForm] = useState({
    username: "",
    fullName: "",
    email: "",
    password: "",
    dob: "",
    gender: "",
    phone: "",
    joinDate: "",
    contractStart: "",
    contractEnd: "",
    cccd: "",
    ethnicity: "",
    nationality: "",
    educationLevel: "",
    workingStatus: "Đang làm việc",
  });

  useEffect(() => {
    fetchMetadataAndUser();
  }, [id]);

  const fetchMetadataAndUser = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const [facResp, depResp, posResp, rolesResp] = await Promise.all([
        axios.get(`${API_BASE_URL}/faculties`, config),
        axios.get(`${API_BASE_URL}/departments`, config),
        axios.get(`${API_BASE_URL}/positions`, config),
        axios.get(`${API_BASE_URL}/roles`, config),
      ]);
      setFaculties(facResp.data);
      setDepartments(depResp.data);
      setPositions(posResp.data);

      // --- FILTER ROLES ---
      const fetchedRoles = rolesResp.data || [];
      const currentUserRole = localStorage.getItem("role"); // "admin", "superadmin", etc.

      // Define allowed role codes
      let allowedCodes = [];
      if (currentUserRole === "superadmin") {
        // Superadmin: thêm Admin, Hiệu trưởng, Trưởng khoa, Giảng viên
        allowedCodes = ["admin", "hieutruong", "truongkhoa", "giangvien"];
      } else if (currentUserRole === "admin") {
        // Admin: chỉ thêm Hiệu trưởng, Trưởng khoa, Giảng viên
        allowedCodes = ["hieutruong", "truongkhoa", "giangvien"];
      } else {
        // Fallback for others (shouldn't happen on this page normally)
        allowedCodes = ["giangvien"];
      }

      const filtered = fetchedRoles.filter((r) => {
        // Normalize code
        const code = (r.roleCode || "").toLowerCase().replace("role_", "");
        return allowedCodes.includes(code);
      });

      setRoles(filtered);

      if (isEdit) {
        const userResp = await axios.get(`${API_BASE_URL}/users/${id}`, config);
        const u = userResp.data;
        setForm({
          username: u.username || "",
          fullName: u.fullName || "",
          email: u.email || "",
          password: "", // Don't pre-fill password for editing
          dob: u.dob || "",
          gender: u.gender || "",
          phone: u.phone || "",
          joinDate: u.joinDate || "",
          contractStart: u.contractStart || "",
          contractEnd: u.contractEnd || "",
          cccd: u.cccd || "",
          ethnicity: u.ethnicity || "",
          nationality: u.nationality || "",
          educationLevel: u.educationLevel || "",
          workingStatus: u.workingStatus || "Đang làm việc",
        });

        setRoleId(u.roleId || "");
        setPositionId(u.positionId || "");

        if (u.facultyId) {
          setUnitType("khoa");
          setUnitId(u.facultyId);
        } else if (u.departmentId) {
          setUnitType("phongban");
          setUnitId(u.departmentId);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Lỗi khi tải dữ liệu: " + (error.response?.data || error.message));
    } finally {
      setLoading(false);
    }
  };

  const educationLevels = [
    "Cử nhân",
    "Thạc sĩ",
    "Tiến sĩ",
    "Phó Giáo sư",
    "Giáo sư",
  ];

  const workingStatuses = [
    "Đang làm việc",
    "Tạm nghỉ",
    "Nghỉ thai sản",
    "Nghỉ không lương",
    "Đã nghỉ việc",
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      roleId: roleId ? parseInt(roleId) : null,
      positionId: positionId ? parseInt(positionId) : null,
      facultyId: unitType === "khoa" ? parseInt(unitId) : null,
      departmentId: unitType === "phongban" ? parseInt(unitId) : null,
    };

    // If editing and password is empty, remove it from payload
    if (isEdit && !payload.password) {
      delete payload.password;
    }

    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (isEdit) {
        await axios.put(`${API_BASE_URL}/users/${id}`, payload, config);
        alert("✅ Cập nhật nhân viên thành công.");
      } else {
        await axios.post(`${API_BASE_URL}/users`, payload, config);
        alert("✅ Thêm nhân viên thành công.");
      }
      navigate("/employees");
    } catch (error) {
      alert(`❌ ${isEdit ? "Cập nhật" : "Thêm"} thất bại: ` + (error.response?.data || error.message));
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-[#009FE3] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Đang tải biểu mẫu...</p>
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto flex items-center gap-3 mb-8">
        <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 text-[#009FE3]">
          {isEdit ? <FaUserEdit size={24} /> : <FaUserPlus size={24} />}
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-900">
            {isEdit ? "Chỉnh sửa hồ sơ nhân viên" : "Thêm nhân viên mới"}
          </h1>
          <p className="text-slate-500 text-sm font-bold">Vui lòng điền đầy đủ các thông tin cần thiết</p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl shadow-gray-200/50 rounded-2xl p-8 space-y-8 max-w-4xl mx-auto border border-gray-100"
      >
        {/* --- Phần 1: Đơn vị & Chức trách --- */}
        <div>
          <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2 uppercase tracking-wide">
            <span className="w-1.5 h-6 bg-[#009FE3] rounded-full"></span>
            Đơn vị & Tổ chức
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Loại đơn vị</label>
              <select
                value={unitType}
                onChange={(e) => {
                  setUnitType(e.target.value);
                  setUnitId("");
                }}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition"
                required
              >
                <option value="">-- Chọn loại đơn vị --</option>
                <option value="khoa">Khoa</option>
                <option value="phongban">Phòng ban</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                {unitType === "khoa" ? "Chọn khoa" : unitType === "phongban" ? "Chọn phòng ban" : "Đơn vị cụ thể"}
              </label>
              <select
                value={unitId}
                onChange={(e) => setUnitId(e.target.value)}
                disabled={!unitType}
                className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#009FE3]/20 transition-all font-bold text-slate-800 outline-none disabled:bg-slate-100/50"
                required
              >
                <option value="">
                  {unitType ? `-- Chọn ${unitType === "khoa" ? "khoa" : "phòng ban"} --` : "-- Vui lòng chọn loại đơn vị để chọn tiếp --"}
                </option>
                {(unitType === "khoa" ? faculties : unitType === "phongban" ? departments : []).map((u, i) => (
                  <option key={i} value={u.id || u.departmentId}>
                    {u.name || u.departmentName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Chức danh</label>
              <select
                value={positionId}
                onChange={(e) => setPositionId(e.target.value)}
                className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#009FE3]/20 transition-all font-bold text-slate-800 outline-none"
                required
              >
                <option value="">-- Chọn chức danh --</option>
                {positions.map((p, i) => (
                  <option key={i} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Vai trò hệ thống</label>
              <select
                value={roleId}
                onChange={(e) => setRoleId(e.target.value)}
                className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#009FE3]/20 transition-all font-bold text-slate-800 outline-none"
                required
              >
                <option value="">-- Chọn vai trò --</option>
                {roles.map((r, i) => (
                  <option key={i} value={r.roleId}>{r.roleName}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* --- Phần 2: Tài khoản & Bảo mật --- */}
        <div>
          <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2 uppercase tracking-wide">
            <span className="w-1.5 h-6 bg-[#009FE3] rounded-full"></span>
            Tài khoản đăng nhập
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tên tài khoản</label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition"
                required
                disabled={isEdit}
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                {isEdit ? "Mật khẩu (Bỏ trống nếu không đổi)" : "Mật khẩu mới"}
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition"
                required={!isEdit}
                placeholder={isEdit ? "••••••••" : ""}
              />
            </div>
          </div>
        </div>

        {/* --- Phần 3: Thông tin cá nhân --- */}
        <div>
          <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2 uppercase tracking-wide">
            <span className="w-1.5 h-6 bg-[#009FE3] rounded-full"></span>
            Thông tin nhân thân
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <label className="block mb-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Họ và tên</label>
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#009FE3]/20 transition-all font-bold text-slate-800 outline-none"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Giới tính</label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#009FE3]/20 transition-all font-bold text-slate-800 outline-none"
                required
              >
                <option value="">-- Chọn --</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">Ngày sinh</label>
              <input
                type="date"
                name="dob"
                value={form.dob}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-white outline-none transition focus:ring-2 focus:ring-blue-100"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">Email cá nhân</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 outline-none transition focus:ring-2 focus:ring-blue-100"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">Số điện thoại</label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 outline-none transition focus:ring-2 focus:ring-blue-100"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Số CCCD</label>
              <input
                type="text"
                name="cccd"
                value={form.cccd}
                onChange={handleChange}
                className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#009FE3]/20 transition-all font-bold text-slate-800 outline-none"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Dân tộc</label>
              <input
                type="text"
                name="ethnicity"
                value={form.ethnicity}
                onChange={handleChange}
                className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#009FE3]/20 transition-all font-bold text-slate-800 outline-none"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Quốc tịch</label>
              <input
                type="text"
                name="nationality"
                value={form.nationality}
                onChange={handleChange}
                className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#009FE3]/20 transition-all font-bold text-slate-800 outline-none"
                required
              />
            </div>
          </div>
        </div>

        {/* --- Phần 4: Trình độ & Hợp đồng --- */}
        <div>
          <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2 uppercase tracking-wide">
            <span className="w-1.5 h-6 bg-[#009FE3] rounded-full"></span>
            Học vấn & Công tác
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">Trình độ cao nhất</label>
              <select
                name="educationLevel"
                value={form.educationLevel}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 outline-none transition focus:ring-2 focus:ring-blue-100"
                required
              >
                <option value="">-- Chọn trình độ --</option>
                {educationLevels.map((lv, i) => (
                  <option key={i} value={lv}>{lv}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">Tình trạng làm việc</label>
              <select
                name="workingStatus"
                value={form.workingStatus}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 outline-none transition focus:ring-2 focus:ring-blue-100"
                required
              >
                {workingStatuses.map((st, i) => (
                  <option key={i} value={st}>{st}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">Ngày vào trường</label>
              <input
                type="date"
                name="joinDate"
                value={form.joinDate}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-white outline-none transition focus:ring-2 focus:ring-blue-100"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">Bắt đầu HĐ</label>
                <input
                  type="date"
                  name="contractStart"
                  value={form.contractStart}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-white outline-none transition focus:ring-2 focus:ring-blue-100"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">Kết thúc HĐ</label>
                <input
                  type="date"
                  name="contractEnd"
                  value={form.contractEnd}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-white outline-none transition focus:ring-2 focus:ring-blue-100"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* --- Nút hành động --- */}
        <div className="flex justify-end gap-4 pt-6 mt-8 border-t border-gray-50">
          <button
            type="button"
            onClick={() => navigate("/employees")}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition font-semibold"
          >
            <FaTimes /> Huỷ bỏ
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 px-10 py-2.5 rounded-xl text-white font-bold shadow-lg hover:shadow-blue-200/50 transition-all active:scale-95"
            style={{ backgroundColor: mainColor }}
          >
            <FaSave /> {isEdit ? "Cập nhật hồ sơ" : "Lưu nhân viên"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEmployee;
