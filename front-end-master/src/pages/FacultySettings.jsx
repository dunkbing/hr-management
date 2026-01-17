import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  User,
  Bell,
  Shield,
  Lock,
  Mail,
  FileText,
  Save,
  Camera,
  Loader2,
  Phone,
  AtSign,
  AlertCircle
} from "lucide-react";

// Utility to get current auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
};

const FacultySettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null); // { type: 'success' | 'error', text: '' }

  // User Profile State
  const [profile, setProfile] = useState({
    id: null,
    username: "",
    fullName: "",
    email: "",
    phone: "",
    avatar: "",
    roleName: "",
    facultyName: ""
  });

  // Password Change State
  const [passData, setPassData] = useState({
    current: "",
    newPass: "",
    confirm: ""
  });

  // Local Settings (Persisted in localStorage)
  const [settings, setSettings] = useState({
    emailNotif: true,
    systemNotif: true,
    twoFactor: false,
    autoLogout: true,
    reportFormat: "pdf",
    signature: "Trưởng khoa – Trường Đại học Kiến trúc Hà Nội"
  });

  // Fetch Data on Load
  useEffect(() => {
    fetchProfile();
    loadLocalSettings();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/users/me", {
        headers: getAuthHeaders(),
      });
      const u = res.data;
      setProfile({
        id: u.userId,
        username: u.username,
        fullName: u.fullName || "",
        email: u.email || "",
        phone: u.phone || "",
        avatar: u.avatar || "",
        roleName: u.roleName,
        facultyName: u.facultyName
      });
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Không thể tải thông tin cá nhân." });
    } finally {
      setLoading(false);
    }
  };

  const loadLocalSettings = () => {
    const saved = localStorage.getItem("facultySettings");
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  };

  const saveLocalSettings = () => {
    localStorage.setItem("facultySettings", JSON.stringify(settings));
    setMessage({ type: "success", text: "Đã lưu cài đặt cục bộ." });
    setTimeout(() => setMessage(null), 3000);
  };

  // handlers
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const saveProfile = async () => {
    if (!profile.fullName.trim()) {
      setMessage({ type: "error", text: "Họ tên không được để trống." });
      return;
    }
    setSaving(true);
    try {
      // Only send updatable fields
      const payload = {
        fullName: profile.fullName,
        email: profile.email,
        phone: profile.phone,
        avatar: profile.avatar // If avatar changed
      };

      await axios.put(`http://localhost:8080/api/users/${profile.id}`, payload, {
        headers: getAuthHeaders(),
      });
      setMessage({ type: "success", text: "Cập nhật hồ sơ thành công!" });
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Lỗi khi cập nhật hồ sơ." });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const changePassword = async () => {
    if (!passData.current || !passData.newPass || !passData.confirm) {
      setMessage({ type: "error", text: "Vui lòng nhập đầy đủ thông tin mật khẩu." });
      return;
    }
    if (passData.newPass !== passData.confirm) {
      setMessage({ type: "error", text: "Mật khẩu xác nhận không khớp." });
      return;
    }
    if (passData.newPass.length < 6) {
      setMessage({ type: "error", text: "Mật khẩu mới phải có ít nhất 6 ký tự." });
      return;
    }

    setSaving(true);
    try {
      await axios.post("http://localhost:8080/api/auth/change-password", {
        username: profile.username,
        oldPassword: passData.current,
        newPassword: passData.newPass
      }, { headers: getAuthHeaders() });

      setMessage({ type: "success", text: "Đổi mật khẩu thành công!" });
      setPassData({ current: "", newPass: "", confirm: "" });
    } catch (err) {
      const msg = err.response?.data || "Đổi mật khẩu thất bại.";
      setMessage({ type: "error", text: typeof msg === 'string' ? msg : "Đổi mật khẩu thất bại" });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setSaving(true);
      const res = await axios.post("http://localhost:8080/api/users/avatar", formData, {
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "multipart/form-data",
        },
      });
      // Update avatar immediately
      setProfile(prev => ({ ...prev, avatar: res.data.avatar }));
      setMessage({ type: "success", text: "Cập nhật ảnh đại diện thành công!" });
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Lỗi upload ảnh." });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  if (loading) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8 pb-20">

      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Cài đặt tài khoản</h1>
          <p className="text-gray-500 mt-1">Quản lý thông tin cá nhân và cấu hình hệ thống</p>
        </div>

        {message && (
          <div className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium animate-fade-in-down
            ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message.type === 'error' && <AlertCircle size={16} />}
            {message.text}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT COLUMN - USER CARD */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center relative overflow-hidden">

            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-blue-500 to-cyan-400"></div>

            <div className="relative mt-12 mb-4 group">
              <div className="w-24 h-24 rounded-full border-4 border-white shadow-md overflow-hidden bg-gray-200">
                <img
                  src={profile.avatar || `https://ui-avatars.com/api/?name=${profile.fullName}&background=random`}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <label className="absolute bottom-0 right-0 p-1.5 bg-gray-800 text-white rounded-full cursor-pointer hover:bg-black transition shadow-sm">
                <Camera size={14} />
                <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
              </label>
            </div>

            <h2 className="text-xl font-bold text-gray-900">{profile.fullName}</h2>
            <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full mt-1">
              {profile.roleName || "Trưởng khoa"}
            </span>
            <p className="text-gray-500 text-sm mt-2">{profile.facultyName || "Chưa cập nhật khoa"}</p>
          </div>

          {/* Quick Stats or Info could go here */}
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
            <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
              <Shield size={18} /> Trạng thái tài khoản
            </h3>
            <div className="space-y-2 text-sm text-blue-700">
              <div className="flex justify-between">
                <span>Trạng thái:</span>
                <span className="font-bold text-green-600">Đang hoạt động</span>
              </div>
              <div className="flex justify-between">
                <span>Xác thực:</span>
                <span>Cơ bản</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - FORMS */}
        <div className="lg:col-span-2 space-y-8">

          {/* 1. PERSONAL INFO */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-5 pb-2 border-b">
              <User className="text-blue-500" size={20} />
              Thông tin cá nhân
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Họ và tên</label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 text-gray-400" size={18} />
                  <input
                    type="text"
                    name="fullName"
                    value={profile.fullName}
                    onChange={handleProfileChange}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Tên đăng nhập</label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 text-gray-400" size={18} />
                  <input
                    type="text"
                    value={profile.username}
                    disabled
                    className="w-full pl-10 pr-4 py-2 border rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Email</label>
                <div className="relative">
                  <AtSign className="absolute left-3 top-2.5 text-gray-400" size={18} />
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleProfileChange}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Số điện thoại</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 text-gray-400" size={18} />
                  <input
                    type="text"
                    name="phone"
                    value={profile.phone}
                    onChange={handleProfileChange}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={saveProfile}
                disabled={saving}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition shadow-md disabled:opacity-50"
              >
                {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                Lưu thay đổi
              </button>
            </div>
          </section>

          {/* 2. CHANGE PASSWORD */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-5 pb-2 border-b">
              <Lock className="text-red-500" size={20} />
              Đổi mật khẩu
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Mật khẩu hiện tại</label>
                <input
                  type="password"
                  value={passData.current}
                  onChange={(e) => setPassData({ ...passData, current: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-100 focus:border-red-400 transition outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Mật khẩu mới</label>
                <input
                  type="password"
                  value={passData.newPass}
                  onChange={(e) => setPassData({ ...passData, newPass: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-100 focus:border-red-400 transition outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Nhập lại mật khẩu</label>
                <input
                  type="password"
                  value={passData.confirm}
                  onChange={(e) => setPassData({ ...passData, confirm: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-100 focus:border-red-400 transition outline-none"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={changePassword}
                disabled={saving}
                className="px-5 py-2 bg-white border border-red-200 text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2 transition disabled:opacity-50"
              >
                {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                Cập nhật mật khẩu
              </button>
            </div>
          </section>

          {/* 3. PREFERENCES & REPORT SIGNATURE */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-5 pb-2 border-b">
              <FileText className="text-purple-500" size={20} />
              Cấu hình & Báo cáo
            </h3>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Toggles */}
                <div className="space-y-3">
                  <p className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Bell size={16} /> Thông báo
                  </p>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.emailNotif}
                      onChange={() => setSettings({ ...settings, emailNotif: !settings.emailNotif })}
                      className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                    />
                    <span className="text-gray-600">Nhận thông báo qua Email</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.systemNotif}
                      onChange={() => setSettings({ ...settings, systemNotif: !settings.systemNotif })}
                      className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                    />
                    <span className="text-gray-600">Nhận thông báo hệ thống</span>
                  </label>
                </div>

                {/* Selects */}
                <div>
                  <p className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <FileText size={16} /> Định dạng xuất báo cáo
                  </p>
                  <select
                    value={settings.reportFormat}
                    onChange={(e) => setSettings({ ...settings, reportFormat: e.target.value })}
                    className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-purple-100 outline-none"
                  >
                    <option value="pdf">PDF</option>
                    <option value="xlsx">Excel (.xlsx)</option>
                    <option value="csv">CSV</option>
                  </select>
                </div>
              </div>

              {/* Signature */}
              <div>
                <p className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Mail size={16} /> Chữ ký cuối báo cáo
                </p>
                <textarea
                  value={settings.signature}
                  onChange={(e) => setSettings({ ...settings, signature: e.target.value })}
                  className="w-full border rounded-lg p-3 h-24 focus:ring-2 focus:ring-purple-100 outline-none resize-none"
                  placeholder="Nhập chữ ký của bạn..."
                ></textarea>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={saveLocalSettings}
                className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center gap-2 transition shadow-md"
              >
                <Save size={18} /> Lưu cấu hình
              </button>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default FacultySettings;
