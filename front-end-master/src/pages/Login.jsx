import React, { useState } from "react";
import { FaUser, FaLock, FaHome, FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://localhost:8080/api/auth/login", {
        username,
        password,
        role,
      });

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("username", res.data.username);
        localStorage.setItem("role", res.data.role);

        alert("Đăng nhập thành công!");

        // Chuyển hướng theo quyền
        const userRole = res.data.role; // normalized from backend

        if (userRole === "admin" || userRole === "superadmin") {
          window.location.href = "/dashboard";
        } else if (userRole === "hieutruong" || userRole === "hieu_truong") {
          window.location.href = "/principal/dashboard";
        } else if (userRole === "truongkhoa" || userRole === "truong_don_vi") {
          window.location.href = "/faculty/dashboard";
        } else if (userRole === "giangvien" || userRole === "nhan_su") {
          window.location.href = "/lecturer/dashboard";
        } else {
          window.location.href = "/dashboard";
        }
      } else if (res.data.error) {
        // Display error message from backend
        setError(res.data.message || "Đăng nhập thất bại!");
      } else {
        setError("Đăng nhập thất bại!");
      }
    } catch (err) {
      // Display specific error message from backend
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Không thể kết nối đến server!");
      }
    }
  };

  return (
    <div className="relative flex items-center justify-start min-h-screen bg-gray-100">
      {/* Ảnh nền */}
      <div className="absolute inset-0">
        <img
          src="https://scontent.fhan14-5.fna.fbcdn.net/v/t39.30808-6/560813566_1256277349874348_785042294496922688_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=uXGcoO4OYKkQ7kNvwHlmxcu&_nc_oc=AdnAo-DhSObAusJrwf4sxtGeJh8vY3e0j5kX7nP4PP4N4rFi5bx921Lf_g77EtieOKI&_nc_zt=23&_nc_ht=scontent.fhan14-5.fna&_nc_gid=n3gbNMkVZD7VvU8UTjCfEA&oh=00_Afp2gmEou6K8td6mnZZa3oAK6PsjksE_4Lk8mkj7yYDvzw&oe=69801128"
          alt="Trường Đại học Kiến trúc Hà Nội"
          className="w-full h-full object-cover"
        />
        <div
          className="absolute inset-0 bg-primary/40 backdrop-blur-sm"
        ></div>
      </div>

      {/* Form */}
      <div className="relative z-10 bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 w-full max-w-md ml-20">
        <div className="flex flex-col items-center mb-6">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/0/03/Logo_HAU.png"
            alt="Logo HAU"
            className="w-20 h-20 mb-3 object-contain"
          />
          <h1 className="text-2xl font-bold text-gray-800 text-center">
            HỆ THỐNG QUẢN LÝ NHÂN SỰ
          </h1>
        </div>

        <form onSubmit={handleLogin}>
          {/* Vai trò */}
          <div className="mb-5 relative">
            <FaHome className="absolute left-3 top-3 text-gray-500" />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none appearance-none"
            >
              <option value="superadmin">Siêu quản trị (Super Admin)</option>
              <option value="admin">Quản trị hệ thống (Admin)</option>
              <option value="truong_don_vi">Trưởng khoa / Trưởng đơn vị</option>
              <option value="hieu_truong">Hiệu trưởng</option>
              <option value="nhan_su">Giảng viên / Nhân sự</option>
            </select>
          </div>

          {/* Username */}
          <div className="mb-5 relative">
            <FaUser className="absolute left-3 top-3 text-gray-500" />
            <input
              type="text"
              placeholder="Tài khoản"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
              required
            />
          </div>

          {/* Password */}
          <div className="mb-5 relative">
            <FaLock className="absolute left-3 top-3 text-gray-500" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-600"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Quên mật khẩu */}
          <div className="text-center mb-6">
            <a
              href="#"
              className="text-primary text-sm font-medium"
            >
              Quên mật khẩu
            </a>
          </div>

          {/* Nút đăng nhập */}
          <button
            type="submit"
            className="w-full bg-primary text-white p-2 rounded-lg"
          >
            Đăng nhập
          </button>

          {/* Hiển thị lỗi */}
          {error && (
            <p className="text-center text-red-600 mt-3 font-medium">
              {error}
            </p>
          )}
        </form>
      </div>

      {/* Footer */}
      <div className="absolute bottom-3 right-5 text-white/80 text-sm">
        Thiết kế & Phát triển bởi Ngoc Anh Tran
      </div>
    </div>
  );
}

export default Login;
