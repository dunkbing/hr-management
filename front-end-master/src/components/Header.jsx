import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Bell, Menu, X, ChevronLeft, ChevronRight } from "lucide-react";
import axios from "axios";
import Avatar from "./Avatar";

const Header = ({ onToggleSidebar, collapsed }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [notiOpen, setNotiOpen] = useState(false);
  const [user, setUser] = useState(null);
  const menuRef = useRef();
  const notiRef = useRef();
  const navigate = useNavigate();

  // 🛎️ Dữ liệu thông báo thực tế
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchUser();
    fetchNotifications();

    // Polling every 30 seconds for new notifications
    const interval = setInterval(fetchNotifications, 30000);

    const handleUpdate = () => fetchUser();
    window.addEventListener("userUpdated", handleUpdate);

    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
      if (notiRef.current && !notiRef.current.contains(e.target)) {
        setNotiOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      clearInterval(interval);
      window.removeEventListener("userUpdated", handleUpdate);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchUser = async () => {
    if (!token) return;
    try {
      const res = await axios.get("http://localhost:8080/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    } catch (err) {
      console.error("Failed to fetch user info", err);
    }
  };

  const fetchNotifications = async () => {
    if (!token) return;
    try {
      const [listRes, countRes] = await Promise.all([
        axios.get("http://localhost:8080/api/notifications", {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get("http://localhost:8080/api/notifications/unread-count", {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      setNotifications(listRes.data);
      setUnreadCount(countRes.data);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleOpenNotification = async (id) => {
    try {
      await axios.put(`http://localhost:8080/api/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
      setNotiOpen(false);
      navigate(`/notification/${id}`);
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  };

  const handleReadAll = async () => {
    try {
      await axios.put("http://localhost:8080/api/notifications/read-all", {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Failed to mark all as read", err);
    }
  };

  return (
    <header className="flex items-center justify-between bg-white px-6 py-4 shadow-sm relative z-30 border-b border-slate-100">
      <div className="flex items-center gap-8">
        {/* Toggle Sidebar Button */}
        <button
          onClick={onToggleSidebar}
          className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400 hover:text-[#009FE3]"
          title={collapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"}
        >
          <Menu size={24} className={`transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`} />
        </button>

        {/* Logo & University Title - Unified Blue Branding */}
        <Link to="/dashboard" className="flex items-center gap-3 group">
          <div className="bg-slate-50 p-1.5 rounded-xl shadow-inner group-hover:bg-[#009FE3]/5 transition-colors">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/0/03/Logo_HAU.png"
              alt="Logo HAU"
              className="w-8 h-8 object-contain"
              style={{ filter: 'invert(48%) sepia(100%) saturate(2476%) hue-rotate(179deg) brightness(94%) contrast(101%)' }}
            />
          </div>
          <div className="hidden sm:block">
            <h1 className="font-black text-[#009FE3] leading-none text-[13px] uppercase tracking-tight">Trường Đại học</h1>
            <h2 className="font-black text-[#009FE3] leading-none text-[13px] uppercase tracking-tight mt-1">Kiến trúc Hà Nội</h2>
          </div>
        </Link>

        {/* Search box */}
        <div className="hidden lg:flex items-center gap-3 bg-slate-50 border border-transparent focus-within:bg-white focus-within:border-[#009FE3]/30 focus-within:ring-4 focus-within:ring-[#009FE3]/5 rounded-xl px-4 py-2.5 w-72 transition-all group">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4 text-slate-400 group-focus-within:text-[#009FE3]"
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
            placeholder="Tìm kiếm nhanh..."
            className="flex-1 text-sm outline-none bg-transparent text-slate-700 placeholder:text-slate-400 font-bold"
          />
        </div>
      </div>

      {/* Notification + Avatar */}
      <div className="flex items-center gap-6">

        {/* 🔔 Icon thông báo */}
        <div className="relative" ref={notiRef}>
          <div className="p-2 hover:bg-slate-50 rounded-xl transition-all group cursor-pointer" onClick={() => setNotiOpen(!notiOpen)}>
            <Bell
              className="w-6 h-6 text-slate-500 group-hover:text-[#009FE3] transition-colors"
            />
          </div>

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
                    className={`w-full text-left px-4 py-3 border-b hover:bg-slate-50 flex flex-col gap-1 ${!item.read ? "bg-blue-50/50" : ""
                      }`}
                  >
                    <div className={`text-sm ${!item.read ? "font-bold text-slate-900" : "font-semibold text-slate-600"}`}>
                      {item.title}
                    </div>
                    {item.message && <div className="text-xs text-slate-500 line-clamp-1">{item.message}</div>}
                    <div className="text-[10px] text-slate-400 font-medium">{item.timeDisplay || item.time}</div>
                  </button>
                ))}
              </div>

              <div className="flex border-t">
                <button
                  className="flex-1 py-2 text-xs text-gray-500 hover:bg-gray-50 border-r"
                  onClick={handleReadAll}
                >
                  Đánh dấu đã đọc hết
                </button>
                <button
                  className="flex-1 py-2 text-xs text-blue-600 font-semibold hover:bg-gray-50"
                  onClick={() => {
                    navigate("/notification");
                    setNotiOpen(false);
                  }}
                >
                  Xem tất cả
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Avatar + Dropdown */}
        <div className="flex items-center gap-4 relative" ref={menuRef}>
          <div className="text-right hidden sm:block">
            <p className="text-sm font-black text-slate-900 leading-none">{user?.fullName || "Người dùng"}</p>
            <p className="text-[10px] font-black text-[#009FE3] uppercase tracking-[0.2em] mt-1">{user?.roleName || "N/A"}</p>
          </div>
          <div className="relative group p-0.5 rounded-full border-2 border-transparent hover:border-[#009FE3] transition-all">
            <Avatar
              src={user?.avatar}
              name={user?.fullName}
              size="md"
              className="cursor-pointer"
              onClick={() => setMenuOpen(!menuOpen)}
            />
          </div>

          {menuOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
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
