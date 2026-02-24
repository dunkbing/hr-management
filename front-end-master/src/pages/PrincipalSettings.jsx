import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "../components/Card";
import { User, Lock, Bell, SunMoon, Loader2, Save, CheckCircle2, Camera, Mail, Phone, ShieldCheck, PenTool } from "lucide-react";
import axios from "axios";

const PrincipalSettings = () => {
  const [profile, setProfile] = useState({
    id: null,
    username: "",
    fullName: "",
    email: "",
    phone: "",
    avatar: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingSignature, setUploadingSignature] = useState(false);
  const fileInputRef = useRef(null);
  const signatureInputRef = useRef(null);

  // Password state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifySystem, setNotifySystem] = useState(true);

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
        avatar: data.avatar || "",
        digitalSignature: data.digitalSignature || "",
        roleCode: data.roleCode,
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
    setTimeout(() => setMessage(null), 4000);
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const payload = {
        fullName: profile.fullName,
        email: profile.email,
        phone: profile.phone,
      };

      await axios.put(`http://localhost:8080/api/users/${profile.id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showMessage("success", "Thông tin cá nhân đã được lưu thành công!");
    } catch (err) {
      console.error("Update failed", err);
      showMessage("error", "Lỗi khi cập nhật thông tin.");
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      showMessage("error", "Ảnh không được vượt quá 2MB");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("http://localhost:8080/api/users/avatar", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        },
      });
      setProfile({ ...profile, avatar: res.data.avatar });
      showMessage("success", "Cập nhật ảnh đại diện thành công!");
    } catch (err) {
      console.error("Avatar upload failed", err);
      showMessage("error", "Không thể tải ảnh lên.");
    } finally {
      setUploading(false);
    }
  };

  const handleSignatureUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      showMessage("error", "Ảnh chữ ký không được vượt quá 2MB");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setUploadingSignature(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("http://localhost:8080/api/users/digital-signature", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        },
      });
      setProfile({ ...profile, digitalSignature: res.data.digitalSignature });
      showMessage("success", "Cập nhật chữ ký số thành công!");
    } catch (err) {
      console.error("Signature upload failed", err);
      showMessage("error", err.response?.data || "Không thể tải chữ ký lên.");
    } finally {
      setUploadingSignature(false);
    }
  };

  const handleChangePassword = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      showMessage("error", "Vui lòng nhập đầy đủ thông tin mật khẩu");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      showMessage("error", "Mật khẩu mới phải từ 6 ký tự trở lên");
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
      const msg = err.response?.data || "Đổi mật khẩu thất bại";
      showMessage("error", msg);
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="animate-spin text-[#009FE3]" size={48} />
        <p className="text-slate-500 font-bold animate-pulse">Đang tải cấu hình...</p>
      </div>
    </div>
  );

  return (
    <div className="p-6 lg:p-10 space-y-8 bg-gray-50 min-h-screen animate-in fade-in duration-500">
      <div className="flex justify-between items-center px-2">
        <div>
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Cài đặt tài khoản</h1>
          <p className="text-slate-500 font-bold text-sm mt-1">Quản lý thông tin cá nhân và bảo mật của Hiệu trưởng</p>
        </div>
        {message && (
          <div className={`px-4 py-2 rounded-xl text-sm font-black flex items-center gap-2 shadow-sm animate-in slide-in-from-top duration-300
            ${message.type === 'success' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
            {message.type === 'success' ? <CheckCircle2 size={18} /> : <ShieldCheck size={18} />}
            {message.text}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* CỘT CÁ NHÂN & AVATAR */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="rounded-3xl border-none shadow-sm overflow-hidden bg-white">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row gap-10">
                {/* Avatar Section */}
                <div className="flex flex-col items-center gap-4 shrink-0">
                  <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
                    <img
                      src={profile.avatar || `https://ui-avatars.com/api/?name=${profile.fullName}&background=009FE3&color=fff&size=200`}
                      alt="Avatar"
                      className="w-40 h-40 rounded-3xl object-cover border-4 border-white shadow-xl transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Camera className="text-white" size={32} />
                    </div>
                    {uploading && (
                      <div className="absolute inset-0 bg-white/60 rounded-3xl flex items-center justify-center">
                        <Loader2 className="animate-spin text-[#009FE3]" size={32} />
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <div className="text-center">
                    <p className="text-sm font-black text-slate-800 uppercase tracking-wide">Ảnh đại diện</p>
                    <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase">JPG, PNG tối đa 2MB</p>
                  </div>
                </div>

                {/* Form Section */}
                <div className="flex-1 space-y-6">
                  <h2 className="text-lg font-black text-slate-800 dark:text-slate-100 flex items-center gap-2 uppercase tracking-wide">
                    <User size={20} className="text-[#009FE3]" /> Thông tin cơ bản
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-1">
                        Họ và tên
                      </label>
                      <input
                        type="text"
                        value={profile.fullName}
                        onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#009FE3]/20 font-bold text-slate-800 transition-all"
                        placeholder="Nhập họ tên..."
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-1">
                        <Mail size={12} /> Email
                      </label>
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#009FE3]/20 font-bold text-slate-800 transition-all"
                        placeholder="example@gmail.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-1">
                        <Phone size={12} /> Số điện thoại
                      </label>
                      <input
                        type="text"
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#009FE3]/20 font-bold text-slate-800 transition-all"
                        placeholder="0xxx xxx xxx"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-1">
                        Tên đăng nhập
                      </label>
                      <input
                        type="text"
                        value={profile.username}
                        disabled
                        className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 font-bold text-slate-400 cursor-not-allowed opacity-70"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-50 flex justify-end">
                    <button
                      onClick={handleSaveProfile}
                      disabled={saving}
                      className="bg-[#009FE3] hover:bg-[#008cc9] text-white px-8 py-3 rounded-2xl shadow-lg shadow-blue-200 transition-all font-black uppercase text-xs flex items-center gap-2 disabled:opacity-50"
                    >
                      {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                      Lưu thay đổi
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Đổi mật khẩu */}
          <Card className="rounded-3xl border-none shadow-sm overflow-hidden bg-white">
            <CardContent className="p-8 space-y-6">
              <h2 className="text-lg font-black text-slate-800 flex items-center gap-2 uppercase tracking-wide">
                <Lock size={20} className="text-rose-500" /> Bảo mật & Mật khẩu
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Mật khẩu cũ</label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-rose-200 font-bold text-slate-800 transition-all"
                    placeholder="••••••••"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Mật khẩu mới</label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-rose-200 font-bold text-slate-800 transition-all"
                    placeholder="Tối thiểu 6 ký tự"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Xác nhận</label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-rose-200 font-bold text-slate-800 transition-all"
                    placeholder="Nhập lại mật khẩu mới"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleChangePassword}
                  className="bg-slate-900 hover:bg-black text-white px-8 py-3 rounded-2xl shadow-lg transition-all font-black uppercase text-xs"
                >
                  Cập nhật mật khẩu
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Chữ ký số */}
          <Card className="rounded-3xl border-none shadow-sm overflow-hidden bg-white">
            <CardContent className="p-8 space-y-6">
              <h2 className="text-lg font-black text-slate-800 flex items-center gap-2 uppercase tracking-wide">
                <PenTool size={20} className="text-indigo-500" /> Chữ ký số hóa
              </h2>

              <div className="flex flex-col md:flex-row items-start gap-6">
                {/* Preview chữ ký */}
                <div className="flex-1 bg-slate-50 p-6 rounded-2xl border-2 border-dashed border-slate-200 min-h-[140px] flex items-center justify-center">
                  {profile.digitalSignature ? (
                    <div className="relative group">
                      <img
                        src={profile.digitalSignature}
                        alt="Chữ ký số"
                        className="max-h-24 max-w-full object-contain"
                      />
                      <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity rounded" />
                    </div>
                  ) : (
                    <div className="text-center">
                      <PenTool size={32} className="text-slate-300 mx-auto mb-2" />
                      <p className="text-sm font-bold text-slate-400">Chưa có chữ ký số</p>
                      <p className="text-xs text-slate-300 mt-1">Upload chữ ký để sử dụng khi ký duyệt</p>
                    </div>
                  )}
                </div>

                {/* Upload button */}
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => signatureInputRef.current?.click()}
                    disabled={uploadingSignature}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl shadow-lg shadow-indigo-200 transition-all font-black uppercase text-xs flex items-center gap-2 disabled:opacity-50"
                  >
                    {uploadingSignature ? <Loader2 className="animate-spin" size={16} /> : <PenTool size={16} />}
                    {profile.digitalSignature ? "Đổi chữ ký" : "Upload chữ ký"}
                  </button>
                  <input
                    type="file"
                    ref={signatureInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleSignatureUpload}
                  />
                  <p className="text-[10px] text-slate-400 font-bold uppercase text-center">
                    PNG, JPG • Tối đa 2MB
                  </p>
                </div>
              </div>

              <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100">
                <p className="text-xs text-indigo-700 font-bold leading-relaxed">
                  💡 <strong>Lưu ý:</strong> Chữ ký này sẽ tự động được gắn vào mọi quyết định mà bạn phê duyệt.
                  Hãy đảm bảo chữ ký rõ ràng và chính xác.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CỘT PHỤ - THÔNG BÁO */}
        <div className="space-y-8">
          <Card className="rounded-3xl border-none shadow-sm h-fit bg-white border border-slate-100">
            <CardContent className="p-8">
              <h2 className="text-lg font-black text-slate-800 flex items-center gap-2 uppercase tracking-wide">
                <Bell size={20} className="text-orange-500" /> Thông báo
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl">
                  <span className="text-sm font-bold text-slate-700">Email Marketing</span>
                  <button
                    onClick={() => setNotifyEmail(!notifyEmail)}
                    className={`w-12 h-6 rounded-full transition-colors relative ${notifyEmail ? 'bg-blue-500' : 'bg-slate-200'}`}>
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${notifyEmail ? 'left-7' : 'left-1'}`} />
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl">
                  <span className="text-sm font-bold text-slate-700">Thông báo hệ thống</span>
                  <button
                    onClick={() => setNotifySystem(!notifySystem)}
                    className={`w-12 h-6 rounded-full transition-colors relative ${notifySystem ? 'bg-blue-500' : 'bg-slate-200'}`}>
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${notifySystem ? 'left-7' : 'left-1'}`} />
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PrincipalSettings;
