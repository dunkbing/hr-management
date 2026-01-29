import React, { useState, useEffect } from "react";
import { FaCamera } from "react-icons/fa";
import axiosClient from "../api/axiosClient";

function Profile() {
  const mainColor = "#009FE3"; // Màu chính
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    userId: null,
    fullName: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    cccd: "",
    ethnicity: "",
    nationality: "",
    educationLevel: "",
    workingStatus: "",
    roleName: "",
    facultyName: "",
    departmentName: "",
    positionName: "",
    avatar: "/default-avatar.png",
    password: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axiosClient.get("/users/me");
      const data = res.data;
      setFormData({
        ...data,
        password: "", // Không gán mật khẩu cũ vào form
        avatar: data.avatar || "/default-avatar.png",
      });
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch profile", err);
      alert("Không thể tải thông tin cá nhân");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const uploadData = new FormData();
      uploadData.append("file", file);
      try {
        const res = await axiosClient.post("/users/avatar", uploadData, {
          headers: {
            "Content-Type": "multipart/form-data"
          },
        });
        setFormData((prev) => ({ ...prev, avatar: res.data.avatar }));
        alert("✅ Thay đổi ảnh đại diện thành công!");
        window.dispatchEvent(new Event("userUpdated"));
      } catch (err) {
        console.error("Failed to upload avatar", err);
        alert("❌ Lỗi khi tải ảnh lên");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.put(`/users/${formData.userId}`, formData);
      alert("✅ Thông tin đã được cập nhật!");
      window.dispatchEvent(new Event("userUpdated"));
    } catch (err) {
      console.error("Failed to update profile", err);
      alert("❌ Lỗi khi cập nhật thông tin");
    }
  };

  if (loading) return <div className="p-10 text-center text-slate-500 font-medium uppercase tracking-widest text-xs">Đang tải thông tin...</div>;

  return (
    <div className="max-w-4xl mx-auto mt-6 bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-12">
      <h1 className="text-2xl font-black text-slate-950 mb-10 text-center uppercase tracking-tight">
        Thông tin cá nhân
      </h1>

      <div className="flex flex-col items-center mb-8">
        <div className="relative group">
          <img
            src={formData.avatar}
            alt="Avatar"
            className="w-32 h-32 rounded-3xl object-cover border-4 border-white shadow-xl ring-1 ring-slate-100"
          />
          <label
            htmlFor="avatar-upload"
            className="absolute -bottom-2 -right-2 bg-[#009FE3] text-white p-3 rounded-2xl cursor-pointer hover:bg-[#0077b3] transition-all shadow-lg active:scale-90"
          >
            <FaCamera size={16} />
          </label>
          <input
            type="file"
            id="avatar-upload"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Thông tin cơ bản */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-[#009FE3] uppercase tracking-widest border-b border-blue-50 pb-2">Thông tin cơ bản</h3>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Họ và tên</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName || ""}
                onChange={handleChange}
                className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-[#009FE3]/5 focus:bg-white transition-all font-bold text-slate-700 outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email || ""}
                onChange={handleChange}
                className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-[#009FE3]/5 focus:bg-white transition-all font-bold text-slate-700 outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Số điện thoại</label>
              <input
                type="text"
                name="phone"
                value={formData.phone || ""}
                onChange={handleChange}
                className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-[#009FE3]/5 focus:bg-white transition-all font-bold text-slate-700 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Ngày sinh</label>
              <input
                type="date"
                name="dob"
                value={formData.dob || ""}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-[#009FE3] transition-all font-medium text-slate-900"
              />
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-sm font-bold text-[#009FE3] uppercase tracking-widest border-b border-blue-50 pb-2">Thông tin định danh</h3>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Số CCCD</label>
              <input
                type="text"
                name="cccd"
                value={formData.cccd || ""}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-[#009FE3] transition-all font-medium text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Giới tính</label>
              <select
                name="gender"
                value={formData.gender || ""}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-[#009FE3] transition-all font-medium text-slate-900 appearance-none"
              >
                <option value="">Chọn giới tính</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Dân tộc</label>
              <input
                type="text"
                name="ethnicity"
                value={formData.ethnicity || ""}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-[#009FE3] transition-all font-medium text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Trình độ học vấn</label>
              <input
                type="text"
                name="educationLevel"
                value={formData.educationLevel || ""}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-[#009FE3] transition-all font-medium text-slate-900"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Thông tin công tác (Read-only) */}
        <div className="space-y-6">
          <h3 className="text-sm font-bold text-[#009FE3] uppercase tracking-widest border-b border-blue-50 pb-2">Thông tin công tác</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Khoa/Viện</label>
              <p className="text-sm font-medium text-slate-700 bg-slate-50 px-4 py-3 rounded-2xl border border-slate-100">{formData.facultyName || "N/A"}</p>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Phòng ban</label>
              <p className="text-sm font-medium text-slate-700 bg-slate-50 px-4 py-3 rounded-2xl border border-slate-100">{formData.departmentName || "N/A"}</p>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Chức danh</label>
              <p className="text-sm font-medium text-slate-700 bg-slate-50 px-4 py-3 rounded-2xl border border-slate-100">{formData.positionName || "N/A"}</p>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Vai trò hệ thống</label>
              <p className="text-sm font-medium text-slate-700 bg-slate-50 px-4 py-3 rounded-2xl uppercase border border-slate-100">{formData.roleName || "N/A"}</p>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Trạng thái làm việc</label>
              <p className="text-sm font-bold text-emerald-600 bg-emerald-50 px-4 py-3 rounded-2xl border border-emerald-100">{formData.workingStatus || "Đang làm việc"}</p>
            </div>
          </div>
        </div>

        {/* Section 3: Bảo mật */}
        <div className="space-y-6">
          <h3 className="text-sm font-bold text-rose-500 uppercase tracking-widest border-b border-rose-50 pb-2">Bảo mật</h3>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Đổi mật khẩu mới</label>
            <input
              type="password"
              name="password"
              value={formData.password || ""}
              onChange={handleChange}
              placeholder="Nhập mật khẩu mới nếu muốn thay đổi..."
              className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-rose-400 transition-all font-medium text-slate-900 placeholder:font-normal placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="flex justify-center pt-8">
          <button
            type="submit"
            className="bg-[#009FE3] text-white px-12 py-4 rounded-2xl font-bold uppercase tracking-widest text-sm hover:bg-[#0077b3] hover:shadow-xl hover:shadow-blue-200 transition-all active:scale-95"
          >
            Cập nhật hồ sơ
          </button>
        </div>
      </form>
    </div>
  );
}

export default Profile;
