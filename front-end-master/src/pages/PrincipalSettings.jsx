// src/pages/PrincipalSettings.jsx
import React, { useState } from "react";
import { Card, CardContent } from "../components/Card";
import { User, Lock, Bell, SunMoon } from "lucide-react";

const PrincipalSettings = () => {
  const [fullName, setFullName] = useState("Nguyễn Văn Hiệu");
  const [email, setEmail] = useState("hieu.truong@university.edu.vn");
  const [phone, setPhone] = useState("0912345678");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifySystem, setNotifySystem] = useState(true);
  const [theme, setTheme] = useState("light");

  const handleSaveProfile = () => {
    alert("Thông tin cá nhân đã được lưu!");
    // Tích hợp API lưu thông tin nếu có
  };

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      alert("Mật khẩu mới không khớp!");
      return;
    }
    alert("Mật khẩu đã được thay đổi!");
    // Tích hợp API thay đổi mật khẩu
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="p-6 space-y-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800">Cài đặt Hiệu trưởng</h1>

      {/* Thông tin cá nhân */}
      <Card className="shadow-md">
        <CardContent className="p-6 space-y-4">
          <h2 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
            <User size={20} /> Thông tin cá nhân
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-gray-600 mb-1">Họ và tên</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-600 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-600 mb-1">Số điện thoại</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
          </div>

          <button
            onClick={handleSaveProfile}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Lưu thông tin
          </button>
        </CardContent>
      </Card>

      {/* Đổi mật khẩu */}
      <Card className="shadow-md">
        <CardContent className="p-6 space-y-4">
          <h2 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
            <Lock size={20} /> Đổi mật khẩu
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-gray-600 mb-1">Mật khẩu hiện tại</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-600 mb-1">Mật khẩu mới</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-600 mb-1">Xác nhận mật khẩu mới</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
          </div>

          <button
            onClick={handleChangePassword}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Đổi mật khẩu
          </button>
        </CardContent>
      </Card>

      {/* Cài đặt thông báo */}
      <Card className="shadow-md">
        <CardContent className="p-6 space-y-4">
          <h2 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
            <Bell size={20} /> Cài đặt thông báo
          </h2>

          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={notifyEmail}
                onChange={(e) => setNotifyEmail(e.target.checked)}
                className="w-4 h-4"
              />
              Nhận thông báo qua email
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={notifySystem}
                onChange={(e) => setNotifySystem(e.target.checked)}
                className="w-4 h-4"
              />
              Nhận thông báo hệ thống
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Cài đặt giao diện */}
      <Card className="shadow-md">
        <CardContent className="p-6 space-y-4">
          <h2 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
            <SunMoon size={20} /> Giao diện
          </h2>

          <div className="flex items-center gap-4">
            <label>
              <input
                type="radio"
                name="theme"
                value="light"
                checked={theme === "light"}
                onChange={(e) => setTheme(e.target.value)}
                className="mr-2"
              />
              Sáng
            </label>
            <label>
              <input
                type="radio"
                name="theme"
                value="dark"
                checked={theme === "dark"}
                onChange={(e) => setTheme(e.target.value)}
                className="mr-2"
              />
              Tối
            </label>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrincipalSettings;
