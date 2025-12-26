import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Settings as SettingsIcon,
  UserCog,
  Shield,
  Bell,
  Database,
  Save,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Lock,
  Mail,
  Trophy,
  Activity,
  Download,
  Upload,
} from "lucide-react";

const Settings = () => {
  const mainColor = "#009FE3";
  const [activeTab, setActiveTab] = useState("general");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [config, setConfig] = useState({});
  const [message, setMessage] = useState({ type: "", text: "" });
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/settings", {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Set default values if keys are missing
      const data = {
        system_name: "Hệ thống quản lý nhân sự HAU",
        admin_email: "admin@hau.edu.vn",
        footer_text: "© 2025 Đại học Kiến trúc Hà Nội - HRM System",
        password_expiry: "90",
        require_2fa: "false",
        notify_new_user: "true",
        notify_approval: "true",
        ...res.data,
      };
      setConfig(data);
    } catch (err) {
      console.error("Failed to fetch settings", err);
      showMsg("error", "Không thể tải cấu hình hệ thống");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.post("http://localhost:8080/api/settings", config, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showMsg("success", "Đã lưu cài đặt hệ thống thành công!");
    } catch (err) {
      console.error("Failed to save settings", err);
      showMsg("error", "Lỗi khi lưu cài đặt");
    } finally {
      setSaving(false);
    }
  };

  const showMsg = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  const handleChange = (key, value) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-10 h-10 text-[#009FE3] animate-spin" />
        <p className="text-gray-500 font-medium font-inter">Đang chuẩn bị cấu hình...</p>
      </div>
    );
  }

  const tabs = [
    { id: "general", label: "Chung", icon: UserCog },
    { id: "security", label: "Bảo mật", icon: Shield },
    { id: "notifications", label: "Thông báo", icon: Bell },
    { id: "database", label: "Dữ liệu", icon: Database },
  ];

  return (
    <div className="p-6 lg:p-10 bg-[#F8FAFC] min-h-screen animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <SettingsIcon className="w-8 h-8 text-[#009FE3]" />
            Cấu hình hệ thống chuyên sâu
          </h1>
          <p className="text-gray-500 mt-1 font-medium">Thiết lập tham số vận hành và chính sách bảo mật</p>
        </div>

        {message.text && (
          <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl animate-in slide-in-from-top duration-300 ${message.type === "success" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-rose-50 text-rose-600 border border-rose-100"
            }`}>
            {message.type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span className="text-sm font-semibold">{message.text}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Nav */}
        <div className="space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl transition-all duration-300 font-semibold ${activeTab === tab.id
                  ? "bg-white text-[#009FE3] shadow-lg shadow-blue-100/50 ring-1 ring-blue-50"
                  : "text-gray-500 hover:bg-white hover:text-[#009FE3]"
                }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden min-h-[500px] flex flex-col">
            <div className="p-8 md:p-12 flex-1">
              {activeTab === "general" && (
                <div className="space-y-8 animate-in slide-in-from-right duration-500">
                  <div className="flex items-center gap-3 mb-2">
                    <UserCog className="w-6 h-6 text-[#009FE3]" />
                    <h2 className="text-xl font-bold text-gray-800">Thông tin cơ bản</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-500 uppercase tracking-wider ml-1">Tên hệ thống</label>
                      <div className="relative">
                        <Trophy className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={config.system_name || ""}
                          onChange={(e) => handleChange("system_name", e.target.value)}
                          className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-400 transition-all font-medium text-gray-700"
                          placeholder="HRM Application"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-500 uppercase tracking-wider ml-1">Email quản trị</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          value={config.admin_email || ""}
                          onChange={(e) => handleChange("admin_email", e.target.value)}
                          className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-400 transition-all font-medium text-gray-700"
                          placeholder="admin@example.com"
                        />
                      </div>
                    </div>

                    <div className="md:col-span-2 space-y-2">
                      <label className="text-sm font-bold text-gray-500 uppercase tracking-wider ml-1">Nội dung chân trang</label>
                      <textarea
                        value={config.footer_text || ""}
                        onChange={(e) => handleChange("footer_text", e.target.value)}
                        className="w-full px-4 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-400 transition-all font-medium text-gray-700 h-24 resize-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "security" && (
                <div className="space-y-8 animate-in slide-in-from-right duration-500">
                  <div className="flex items-center gap-3 mb-2">
                    <Shield className="w-6 h-6 text-emerald-500" />
                    <h2 className="text-xl font-bold text-gray-800">Chính sách bảo mật</h2>
                  </div>

                  <div className="space-y-6">
                    <div className="p-6 bg-slate-50 rounded-3xl flex items-center justify-between group hover:bg-white hover:ring-1 hover:ring-blue-100 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                          <RefreshCw className="w-5 h-5 text-[#009FE3]" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-800">Chu kỳ đổi mật khẩu</p>
                          <p className="text-sm text-gray-500 font-medium">Bắt buộc người dùng thay đổi mật khẩu định kỳ</p>
                        </div>
                      </div>
                      <select
                        value={config.password_expiry || "90"}
                        onChange={(e) => handleChange("password_expiry", e.target.value)}
                        className="bg-white border-none rounded-xl px-4 py-2 font-bold text-gray-700 focus:ring-2 focus:ring-blue-400"
                      >
                        <option value="30">30 ngày</option>
                        <option value="60">60 ngày</option>
                        <option value="90">90 ngày</option>
                        <option value="0">Không bắt buộc</option>
                      </select>
                    </div>

                    <div className="p-6 bg-slate-50 rounded-3xl flex items-center justify-between group hover:bg-white hover:ring-1 hover:ring-blue-100 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                          <Lock className="w-5 h-5 text-amber-500" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-800">Xác thực 2 yếu tố (2FA)</p>
                          <p className="text-sm text-gray-500 font-medium">Tăng cường bảo mật bằng mã OTP qua Email</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleChange("require_2fa", config.require_2fa === "true" ? "false" : "true")}
                        className={`w-14 h-7 rounded-full transition-colors relative ${config.require_2fa === "true" ? "bg-[#009FE3]" : "bg-slate-300"}`}
                      >
                        <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${config.require_2fa === "true" ? "left-8" : "left-1"}`} />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "notifications" && (
                <div className="space-y-8 animate-in slide-in-from-right duration-500">
                  <div className="flex items-center gap-3 mb-2">
                    <Bell className="w-6 h-6 text-purple-500" />
                    <h2 className="text-xl font-bold text-gray-800">Thông báo tự động</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div
                      onClick={() => handleChange("notify_new_user", config.notify_new_user === "true" ? "false" : "true")}
                      className={`p-8 rounded-[2rem] border-2 cursor-pointer transition-all duration-300 ${config.notify_new_user === "true"
                          ? "bg-blue-50/50 border-blue-200"
                          : "bg-white border-slate-100 hover:border-slate-200"
                        }`}
                    >
                      <Activity className={`w-8 h-8 mb-4 ${config.notify_new_user === "true" ? "text-blue-600" : "text-slate-300"}`} />
                      <p className="font-bold text-gray-800">Nhân sự mới</p>
                      <p className="text-sm text-gray-500 mt-1">Thông báo khi có tài khoản mới được tạo</p>
                    </div>

                    <div
                      onClick={() => handleChange("notify_approval", config.notify_approval === "true" ? "false" : "true")}
                      className={`p-8 rounded-[2rem] border-2 cursor-pointer transition-all duration-300 ${config.notify_approval === "true"
                          ? "bg-purple-50/50 border-purple-200"
                          : "bg-white border-slate-100 hover:border-slate-200"
                        }`}
                    >
                      <RefreshCw className={`w-8 h-8 mb-4 ${config.notify_approval === "true" ? "text-purple-600" : "text-slate-300"}`} />
                      <p className="font-bold text-gray-800">Phê duyệt</p>
                      <p className="text-sm text-gray-500 mt-1">Thông báo khi có yêu cầu cần xử lý</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "database" && (
                <div className="space-y-8 animate-in slide-in-from-right duration-500">
                  <div className="flex items-center gap-3 mb-2">
                    <Database className="w-6 h-6 text-amber-500" />
                    <h2 className="text-xl font-bold text-gray-800">Quản trị dữ liệu</h2>
                  </div>

                  <div className="p-8 bg-amber-50 rounded-[2rem] border border-amber-100">
                    <p className="text-amber-800 font-bold mb-2 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5" />
                      Lưu ý quan trọng
                    </p>
                    <p className="text-amber-700/80 text-sm font-medium leading-relaxed">
                      Việc sao lưu dữ liệu nên được thực hiện định kỳ hàng tuần. Trong trường hợp khôi phục, toàn bộ dữ liệu hiện tại sẽ bị ghi đè bởi bản sao lưu.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <button className="flex-1 flex items-center justify-center gap-3 bg-white hover:bg-slate-50 text-gray-700 py-4 rounded-2xl border border-slate-200 font-bold transition-all">
                      <Download className="w-5 h-5" />
                      Tải bản sao lưu (.sql)
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-3 bg-gray-800 hover:bg-gray-900 text-white py-4 rounded-2xl font-bold transition-all">
                      <Upload className="w-5 h-5" />
                      Phục hồi từ file
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="p-8 bg-slate-50/50 border-t border-slate-100 flex justify-end gap-3">
              <button
                onClick={fetchSettings}
                className="px-6 py-3 rounded-2xl hover:bg-slate-100 text-gray-500 font-bold transition-all"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 bg-[#009FE3] hover:bg-[#0087c2] text-white px-8 py-3 rounded-2xl shadow-xl shadow-blue-200 transition-all font-bold disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Save className="w-5 h-5" />
                )}
                Lưu cài đặt
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
