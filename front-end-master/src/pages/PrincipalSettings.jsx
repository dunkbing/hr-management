import React, { useState, useEffect } from "react";
import { Card, CardContent } from "../components/Card";
import { User, Lock, Bell, SunMoon, Loader2, Save, CheckCircle2 } from "lucide-react";
import axios from "axios";

const PrincipalSettings = () => {
  const [profile, setProfile] = useState({
    id: null,
    username: "",
    fullName: "",
    email: "",
    phone: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Password state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifySystem, setNotifySystem] = useState(true);
  const [theme, setTheme] = useState("light");

  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:8080/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data;
      setProfile({
        id: data.userId,
        username: data.username,
        fullName: data.fullName,
        email: data.email || "",
        phone: data.phone || "",
        roleCode: data.roleCode, // Keep these for context if needed
      });
    } catch (err) {
      console.error("Failed to fetch profile", err);
      showMessage("error", "Không thể tải thông tin cá nhân");
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      // Only send fields that are editable or necessary
      const payload = {
        fullName: profile.fullName,
        email: profile.email,
        phone: profile.phone,
        // Backend user update might require other fields to NOT be null if it's strict,
        // but typically DTO updates only non-null fields or we send what we have.
        // Let's assume the controller/service merges changes.
        // If not, we might need to fetch full object first.
        // For safety, let's just send these.
        // NOTE: The backend 'updateUser' maps non-null fields from DTO to entity.
      };

      await axios.put(`http://localhost:8080/api/users/${profile.id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showMessage("success", "Thông tin cá nhân đã được lưu!");
    } catch (err) {
      console.error("Update failed", err);
      showMessage("error", "Lỗi khi cập nhật thông tin.");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      showMessage("error", "Vui lòng nhập đầy đủ thông tin mật khẩu");
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showMessage("error", "Mật khẩu mới không khớp!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const payload = {
        username: profile.username,
        oldPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      };

      await axios.post("http://localhost:8080/api/auth/change-password", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      showMessage("success", "Đổi mật khẩu thành công!");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      console.error("Change password failed", err);
      // Error message from backend
      const msg = err.response?.data || "Đổi mật khẩu thất bại";
      showMessage("error", msg);
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="animate-spin text-blue-600" size={40} />
    </div>
  );

  return (
    <div className="p-6 space-y-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Cài đặt Hiệu trưởng</h1>
        {message && (
          <div className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 animate-bounce
            ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message.type === 'success' && <CheckCircle2 size={16} />}
            {message.text}
          </div>
        )}
      </div>

      {/* Thông tin cá nhân */}
      <Card className="shadow-md">
        <CardContent className="p-6 space-y-4">
          <h2 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
            <User size={20} /> Thông tin cá nhân
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-gray-600 mb-1 text-sm font-medium">Họ và tên</label>
              <input
                type="text"
                value={profile.fullName}
                onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-600 mb-1 text-sm font-medium">Email</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-600 mb-1 text-sm font-medium">Số điện thoại</label>
              <input
                type="text"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-600 mb-1 text-sm font-medium">Tên đăng nhập (Không thể thay đổi)</label>
              <input
                type="text"
                value={profile.username}
                disabled
                className="border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 text-gray-500 cursor-not-allowed"
              />
            </div>
          </div>

          <button
            onClick={handleSaveProfile}
            disabled={saving}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
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
              <label className="text-gray-600 mb-1 text-sm font-medium">Mật khẩu hiện tại</label>
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="hidden md:block"></div> {/* Spacer */}
            <div className="flex flex-col">
              <label className="text-gray-600 mb-1 text-sm font-medium">Mật khẩu mới</label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-600 mb-1 text-sm font-medium">Xác nhận mật khẩu mới</label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
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
            <Bell size={20} /> Cài đặt thông báo <span className="text-xs text-gray-400 font-normal">(Chức năng đang phát triển)</span>
          </h2>

          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-2 text-gray-700">
              <input
                type="checkbox"
                checked={notifyEmail}
                onChange={(e) => setNotifyEmail(e.target.checked)}
                className="w-4 h-4 text-blue-600"
              />
              Nhận thông báo qua email
            </label>

            <label className="flex items-center gap-2 text-gray-700">
              <input
                type="checkbox"
                checked={notifySystem}
                onChange={(e) => setNotifySystem(e.target.checked)}
                className="w-4 h-4 text-blue-600"
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
            <SunMoon size={20} /> Giao diện <span className="text-xs text-gray-400 font-normal">(Chức năng đang phát triển)</span>
          </h2>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-gray-700">
              <input
                type="radio"
                name="theme"
                value="light"
                checked={theme === "light"}
                onChange={(e) => setTheme(e.target.value)}
                className="text-blue-600"
              />
              Sáng
            </label>
            <label className="flex items-center gap-2 text-gray-700">
              <input
                type="radio"
                name="theme"
                value="dark"
                checked={theme === "dark"}
                onChange={(e) => setTheme(e.target.value)}
                className="text-blue-600"
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
