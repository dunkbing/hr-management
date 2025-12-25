import React, { useState } from "react";
import { FaCamera } from "react-icons/fa";

function Profile() {
  const mainColor = "#009FE3"; // Màu chính
  const [formData, setFormData] = useState({
    name: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    password: "",
    role: "Admin",
    dob: "1990-01-01",
    avatar: "/default-avatar.png",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, avatar: imageUrl }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Dữ liệu đã lưu:", formData);
    alert("Thông tin đã được cập nhật!");
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white rounded-2xl shadow-md p-8">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        Thông tin cá nhân
      </h1>

      <div className="flex flex-col items-center mb-6">
        <div className="relative">
          <img
            src={formData.avatar}
            alt="Avatar"
            className={`w-32 h-32 rounded-full object-cover border-4 border-[${mainColor}] shadow`}
          />
          <label
            htmlFor="avatar-upload"
            className={`absolute bottom-0 right-0 bg-[${mainColor}] text-white p-2 rounded-full cursor-pointer hover:bg-[#0077b3] transition`}
          >
            <FaCamera />
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

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-gray-700 font-medium mb-1">Họ và tên</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[${mainColor}]`}
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[${mainColor}]`}
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Mật khẩu mới</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Nhập mật khẩu mới..."
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[${mainColor}]`}
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Chức vụ</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[${mainColor}]`}
          >
            <option value="Admin">Admin</option>
            <option value="HR">HR</option>
            <option value="Trưởng khoa">Trưởng khoa</option>
            <option value="Giảng viên">Giảng viên</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Ngày sinh</label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[${mainColor}]`}
          />
        </div>

        <div className="flex justify-center mt-6">
          <button
            type="submit"
            className={`bg-[${mainColor}] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#0077b3] transition`}
          >
            Lưu thay đổi
          </button>
        </div>
      </form>
    </div>
  );
}

export default Profile;
