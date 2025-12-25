import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [notiOpen, setNotiOpen] = useState(false);
  const menuRef = useRef();
  const notiRef = useRef();
  const navigate = useNavigate();

  // 🛎️ Dữ liệu thông báo (giả lập backend)
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Trưởng khoa gửi yêu cầu phê duyệt nhân sự",
      time: "5 phút trước",
      read: false,
    },
    {
      id: 2,
      title: "Phòng tổ chức đã cập nhật hồ sơ nhân viên",
      time: "1 giờ trước",
      read: false,
    },
    {
      id: 3,
      title: "Bạn có 1 cuộc họp vào lúc 15:00",
      time: "Hôm nay",
      read: true,
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
      if (notiRef.current && !notiRef.current.contains(e.target)) {
        setNotiOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Khi nhấn vào thông báo → chuyển trang + đánh dấu đã đọc
  const handleOpenNotification = (id) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, read: true } : n
      )
    );
    navigate(`/notification/${id}`);
    setNotiOpen(false);
  };

  return (
    <header className="flex items-center justify-between bg-white p-4 shadow-sm relative">
      {/* Search box */}
      <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 w-72">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
          />
        </svg>
        <input
          type="text"
          placeholder="Tìm kiếm..."
          className="flex-1 text-sm outline-none bg-transparent"
        />
      </div>

      {/* Notification + Avatar */}
      <div className="flex items-center gap-6">

        {/* 🔔 Icon thông báo */}
        <div className="relative" ref={notiRef}>
          <Bell
            className="w-6 h-6 text-gray-600 cursor-pointer"
            onClick={() => setNotiOpen(!notiOpen)}
          />

          {/* Badge số lượng thông báo chưa đọc */}
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              {unreadCount}
            </span>
          )}

          {/* Dropdown danh sách thông báo */}
          {notiOpen && (
            <div className="absolute right-0 mt-3 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              <div className="p-3 text-sm text-gray-700 border-b font-semibold">
                Thông báo
              </div>

              <div className="max-h-72 overflow-y-auto">
                {notifications.length === 0 && (
                  <div className="p-3 text-sm text-gray-500">
                    Không có thông báo mới
                  </div>
                )}

                {notifications.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleOpenNotification(item.id)}
                    className={`w-full text-left px-4 py-3 border-b hover:bg-gray-50 ${
                      !item.read ? "bg-gray-100" : ""
                    }`}
                  >
                    <div className="text-sm font-medium text-gray-800">
                      {item.title}
                    </div>
                    <div className="text-xs text-gray-500">{item.time}</div>
                  </button>
                ))}
              </div>

              <button
                className="w-full py-2 text-sm text-blue-600 hover:bg-gray-50 rounded-b-lg"
                onClick={() => navigate("/notification")}
              >
                Xem tất cả thông báo
              </button>
            </div>
          )}
        </div>

        {/* Avatar + Dropdown */}
        <div className="relative" ref={menuRef}>
          <img
            src="https://i.pravatar.cc/40"
            alt="User"
            className="rounded-full w-10 h-10 border border-gray-200 cursor-pointer"
            onClick={() => setMenuOpen(!menuOpen)}
          />

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/profile");
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-t-lg"
              >
                Thông tin tài khoản
              </button>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 rounded-b-lg"
              >
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
