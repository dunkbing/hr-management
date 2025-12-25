import { useState } from "react";
import {
  User,
  Bell,
  Shield,
  Lock,
  Mail,
  FileText,   // 🔥 Thay cho FileSpreadsheet bị lỗi
  Save,
} from "lucide-react";

const FacultySettings = () => {
  const [profile, setProfile] = useState({
    fullname: "Nguyễn Văn A",
    email: "truongkhoa@hau.edu.vn",
    phone: "0123456789",
  });

  const [notifications, setNotifications] = useState({
    email: true,
    system: true,
  });

  const [security, setSecurity] = useState({
    twoFactor: false,
    autoLogout: true,
  });

  const [password, setPassword] = useState({
    current: "",
    newPass: "",
    confirm: "",
  });

  const [signature, setSignature] = useState(
    "Trưởng khoa – Trường Đại học Kiến trúc Hà Nội"
  );

  const [reportSettings, setReportSettings] = useState({
    defaultExportFormat: "pdf",
    autoSendToAdmin: false,
  });

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Cài đặt của Trưởng khoa</h1>

      {/* --- HỒ SƠ CÁ NHÂN --- */}
      <div className="bg-white p-5 rounded-xl shadow-md mb-6">
        <div className="flex items-center gap-3 mb-4">
          <User className="w-6 h-6 text-blue-700" />
          <h2 className="text-xl font-semibold">Thông tin cá nhân</h2>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div>
            <label className="font-semibold">Họ và tên</label>
            <input
              type="text"
              className="w-full border rounded-lg p-2 mt-1"
              value={profile.fullname}
              onChange={(e) =>
                setProfile({ ...profile, fullname: e.target.value })
              }
            />
          </div>
          <div>
            <label className="font-semibold">Email</label>
            <input
              type="email"
              className="w-full border rounded-lg p-2 mt-1"
              value={profile.email}
              onChange={(e) =>
                setProfile({ ...profile, email: e.target.value })
              }
            />
          </div>
          <div>
            <label className="font-semibold">Số điện thoại</label>
            <input
              type="text"
              className="w-full border rounded-lg p-2 mt-1"
              value={profile.phone}
              onChange={(e) =>
                setProfile({ ...profile, phone: e.target.value })
              }
            />
          </div>
        </div>

        <button className="mt-4 px-5 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2">
          <Save className="w-4 h-4" /> Lưu thay đổi
        </button>
      </div>

      {/* --- THÔNG BÁO --- */}
      <div className="bg-white p-5 rounded-xl shadow-md mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Bell className="w-6 h-6 text-orange-600" />
          <h2 className="text-xl font-semibold">Thông báo</h2>
        </div>

        <div className="flex flex-col gap-4">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={notifications.email}
              onChange={() =>
                setNotifications({
                  ...notifications,
                  email: !notifications.email,
                })
              }
            />
            Nhận thông báo qua Email
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={notifications.system}
              onChange={() =>
                setNotifications({
                  ...notifications,
                  system: !notifications.system,
                })
              }
            />
            Nhận thông báo hệ thống
          </label>
        </div>

        <button className="mt-4 px-5 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2">
          <Save className="w-4 h-4" /> Lưu thay đổi
        </button>
      </div>

      {/* --- BẢO MẬT --- */}
      <div className="bg-white p-5 rounded-xl shadow-md mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-6 h-6 text-green-600" />
          <h2 className="text-xl font-semibold">Bảo mật</h2>
        </div>

        <label className="flex items-center gap-3 mb-3">
          <input
            type="checkbox"
            checked={security.twoFactor}
            onChange={() =>
              setSecurity({ ...security, twoFactor: !security.twoFactor })
            }
          />
          Kích hoạt xác thực 2 lớp
        </label>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={security.autoLogout}
            onChange={() =>
              setSecurity({ ...security, autoLogout: !security.autoLogout })
            }
          />
          Tự động đăng xuất sau 15 phút không hoạt động
        </label>

        <button className="mt-4 px-5 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2">
          <Save className="w-4 h-4" /> Lưu thay đổi
        </button>
      </div>

      {/* --- ĐỔI MẬT KHẨU --- */}
      <div className="bg-white p-5 rounded-xl shadow-md mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Lock className="w-6 h-6 text-red-600" />
          <h2 className="text-xl font-semibold">Đổi mật khẩu</h2>
        </div>

        <div className="grid grid-cols-3 gap-5">
          <div>
            <label className="font-semibold">Mật khẩu hiện tại</label>
            <input
              type="password"
              className="w-full border rounded-lg p-2 mt-1"
              value={password.current}
              onChange={(e) =>
                setPassword({ ...password, current: e.target.value })
              }
            />
          </div>

          <div>
            <label className="font-semibold">Mật khẩu mới</label>
            <input
              type="password"
              className="w-full border rounded-lg p-2 mt-1"
              value={password.newPass}
              onChange={(e) =>
                setPassword({ ...password, newPass: e.target.value })
              }
            />
          </div>

          <div>
            <label className="font-semibold">Nhập lại mật khẩu</label>
            <input
              type="password"
              className="w-full border rounded-lg p-2 mt-1"
              value={password.confirm}
              onChange={(e) =>
                setPassword({ ...password, confirm: e.target.value })
              }
            />
          </div>
        </div>

        <button className="mt-4 px-5 py-2 bg-red-600 text-white rounded-lg flex items-center gap-2">
          <Save className="w-4 h-4" /> Đổi mật khẩu
        </button>
      </div>

      {/* --- CÀI ĐẶT BÁO CÁO --- */}
      <div className="bg-white p-5 rounded-xl shadow-md mb-6">
        <div className="flex items-center gap-3 mb-4">
          <FileText className="w-6 h-6 text-purple-600" />
          <h2 className="text-xl font-semibold">Cài đặt báo cáo</h2>
        </div>

        <div>
          <label className="font-semibold">Định dạng xuất báo cáo mặc định</label>
          <select
            className="border rounded-lg p-2 w-full mt-2"
            value={reportSettings.defaultExportFormat}
            onChange={(e) =>
              setReportSettings({
                ...reportSettings,
                defaultExportFormat: e.target.value,
              })
            }
          >
            <option value="pdf">PDF</option>
            <option value="xlsx">Excel (.xlsx)</option>
            <option value="csv">CSV</option>
          </select>
        </div>

        <label className="flex items-center gap-3 mt-4">
          <input
            type="checkbox"
            checked={reportSettings.autoSendToAdmin}
            onChange={() =>
              setReportSettings({
                ...reportSettings,
                autoSendToAdmin: !reportSettings.autoSendToAdmin,
              })
            }
          />
          Tự động gửi báo cáo cho Phòng Tổ chức – Hành chính
        </label>

        <button className="mt-4 px-5 py-2 bg-purple-700 text-white rounded-lg flex items-center gap-2">
          <Save className="w-4 h-4" /> Lưu cài đặt báo cáo
        </button>
      </div>

      {/* --- CHỮ KÝ --- */}
      <div className="bg-white p-5 rounded-xl shadow-md">
        <div className="flex items-center gap-3 mb-4">
          <Mail className="w-6 h-6 text-gray-700" />
          <h2 className="text-xl font-semibold">Chữ ký cuối báo cáo</h2>
        </div>

        <textarea
          className="border w-full rounded-lg p-3"
          rows={3}
          value={signature}
          onChange={(e) => setSignature(e.target.value)}
        ></textarea>

        <button className="mt-4 px-5 py-2 bg-blue-700 text-white rounded-lg flex items-center gap-2">
          <Save className="w-4 h-4" /> Lưu chữ ký
        </button>
      </div>
    </div>
  );
};

export default FacultySettings;
