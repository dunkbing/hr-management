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

      <div className="relative z-10 bg-white/95 backdrop-blur-xl rounded-[2.5rem] shadow-2xl p-12 w-full max-w-md ml-20 border border-white/50">
        <div className="flex flex-col items-center mb-10">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/0/03/Logo_HAU.png"
            alt="Logo HAU"
            className="w-24 h-24 mb-4 object-contain filter drop-shadow-lg"
          />
          <h1 className="text-2xl font-black text-slate-950 text-center uppercase tracking-tight leading-tight">
            Hệ thống<br />Quản lý nhân sự
          </h1>
        </div>

        <form onSubmit={handleLogin}>
          {/* Vai trò */}
          <div className="mb-6 relative group">
            <FaHome className="absolute left-4 top-4 text-slate-400 group-focus-within:text-[#009FE3] transition-colors" />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full pl-12 pr-10 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-[#009FE3]/10 focus:bg-white focus:border-[#009FE3]/30 transition-all text-sm font-normal text-slate-600 outline-none appearance-none cursor-pointer"
            >
              <option value="superadmin">Siêu quản trị (Super Admin)</option>
              <option value="admin">Quản trị hệ thống (Admin)</option>
              <option value="truong_don_vi">Trưởng khoa / Trưởng đơn vị</option>
              <option value="hieu_truong">Hiệu trưởng</option>
              <option value="nhan_su">Giảng viên / Nhân sự</option>
            </select>
          </div>

          {/* Username */}
          <div className="mb-6 relative group">
            <FaUser className="absolute left-4 top-4 text-slate-400 group-focus-within:text-[#009FE3] transition-colors" />
            <input
              type="text"
              placeholder="Tài khoản"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-[#009FE3]/10 focus:bg-white focus:border-[#009FE3]/30 transition-all text-sm font-normal text-slate-600 outline-none"
              required
            />
          </div>

          {/* Password */}
          <div className="mb-6 relative group">
            <FaLock className="absolute left-4 top-4 text-slate-400 group-focus-within:text-[#009FE3] transition-colors" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-[#009FE3]/10 focus:bg-white focus:border-[#009FE3]/30 transition-all text-sm font-normal text-slate-600 outline-none"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-4 text-slate-300 hover:text-slate-500 transition-colors"
            >
              {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
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
            className="w-full bg-[#009FE3] hover:bg-[#0087c2] text-white py-4 rounded-2xl shadow-xl shadow-blue-100 hover:shadow-blue-200 transition-all font-black text-xs uppercase tracking-[0.2em]"
          >
            Đăng nhập hệ thống
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
