// src/pages/Settings.jsx
import { useState } from "react";
import { UserCog, Shield, Bell, Database } from "lucide-react";

const Settings = () => {
  const mainColor = "#009FE3"; // màu chủ đạo
  const [activeTab, setActiveTab] = useState("general");

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4" style={{ color: mainColor }}>
        ⚙️ Cài đặt hệ thống
      </h1>
      <p className="text-gray-600 mb-6">
        Quản lý các thông tin cấu hình, bảo mật và thông báo của hệ thống quản lý nhân sự.
      </p>

      {/* Tabs menu */}
      <div className="flex gap-4 border-b mb-6">
        <button
          onClick={() => setActiveTab("general")}
          className={`pb-2 border-b-2 transition ${
            activeTab === "general"
              ? `border-[${mainColor}] text-[${mainColor}] font-semibold`
              : "border-transparent text-gray-500 hover:text-[#009FE3]"
          }`}
        >
          <UserCog className="inline mr-2" size={16} /> Chung
        </button>

        <button
          onClick={() => setActiveTab("security")}
          className={`pb-2 border-b-2 transition ${
            activeTab === "security"
              ? `border-[${mainColor}] text-[${mainColor}] font-semibold`
              : "border-transparent text-gray-500 hover:text-[#009FE3]"
          }`}
        >
          <Shield className="inline mr-2" size={16} /> Bảo mật
        </button>

        <button
          onClick={() => setActiveTab("notifications")}
          className={`pb-2 border-b-2 transition ${
            activeTab === "notifications"
              ? `border-[${mainColor}] text-[${mainColor}] font-semibold`
              : "border-transparent text-gray-500 hover:text-[#009FE3]"
          }`}
        >
          <Bell className="inline mr-2" size={16} /> Thông báo
        </button>

        <button
          onClick={() => setActiveTab("database")}
          className={`pb-2 border-b-2 transition ${
            activeTab === "database"
              ? `border-[${mainColor}] text-[${mainColor}] font-semibold`
              : "border-transparent text-gray-500 hover:text-[#009FE3]"
          }`}
        >
          <Database className="inline mr-2" size={16} /> Dữ liệu
        </button>
      </div>

      {/* Nội dung tab */}
      <div className="mt-4">
        {activeTab === "general" && (
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-3">Thông tin chung</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Tên hệ thống</label>
                <input
                  type="text"
                  className="border rounded-md w-full p-2"
                  defaultValue="Hệ thống quản lý nhân sự HAU"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Email quản trị</label>
                <input
                  type="email"
                  className="border rounded-md w-full p-2"
                  defaultValue="admin@hau.edu.vn"
                />
              </div>
              <button
                className="px-4 py-2 rounded-md text-white transition"
                style={{ backgroundColor: mainColor }}
              >
                Lưu thay đổi
              </button>
            </form>
          </div>
        )}

        {activeTab === "security" && (
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-3">Cài đặt bảo mật</h2>
            <div className="space-y-3">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="accent-[#009FE3]" defaultChecked />
                <span>Bắt buộc đổi mật khẩu sau 90 ngày</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="accent-[#009FE3]" />
                <span>Xác thực 2 bước (2FA)</span>
              </label>
              <button
                className="px-4 py-2 rounded-md text-white mt-4 transition"
                style={{ backgroundColor: mainColor }}
              >
                Lưu cài đặt
              </button>
            </div>
          </div>
        )}

        {activeTab === "notifications" && (
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-3">Cài đặt thông báo</h2>
            <div className="space-y-3">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="accent-[#009FE3]" defaultChecked />
                <span>Thông báo khi có nhân sự mới</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="accent-[#009FE3]" />
                <span>Thông báo khi có yêu cầu phê duyệt</span>
              </label>
              <button
                className="px-4 py-2 rounded-md text-white mt-4 transition"
                style={{ backgroundColor: mainColor }}
              >
                Lưu cài đặt
              </button>
            </div>
          </div>
        )}

        {activeTab === "database" && (
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-3">Quản lý dữ liệu</h2>
            <p className="text-gray-600 mb-4">
              Sao lưu và khôi phục dữ liệu hệ thống để đảm bảo an toàn thông tin.
            </p>
            <div className="flex gap-4">
              <button className="px-4 py-2 rounded-md text-white transition" style={{ backgroundColor: "#009FE3" }}>
                Sao lưu dữ liệu
              </button>
              <button className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition">
                Khôi phục dữ liệu
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
