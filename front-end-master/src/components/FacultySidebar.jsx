import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FilePlus2,
  BarChart2,
  Settings,
} from "lucide-react";

const facultyMenu = [
  { label: "Dashboard", path: "/faculty/dashboard", icon: <LayoutDashboard size={18} /> },
  { label: "Nhân sự khoa tôi", path: "/faculty/employees", icon: <Users size={18} /> },

  // ⭐ Tên mới theo yêu cầu
  { label: "Đề xuất & Yêu cầu", path: "/faculty/proposals", icon: <FilePlus2 size={18} /> },

  { label: "Báo cáo khoa", path: "/faculty/reports", icon: <BarChart2 size={18} /> },

  // ⭐ Cài đặt NGAY DƯỚI Báo cáo khoa
  { label: "Cài đặt", path: "/faculty/settings", icon: <Settings size={18} /> },
];

const FacultySidebar = () => {
  const location = useLocation();
  const mainColor = "#009FE3";

  return (
    <aside className="w-64 bg-white shadow-md flex flex-col">
      {/* Logo */}
      <Link
        to="/faculty/dashboard"
        className="p-6 border-b flex items-center gap-3 hover:bg-[#e0f3fc] transition"
        style={{ color: mainColor }}
      >
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/0/03/Logo_HAU.png"
          alt="Logo Trường Đại học Kiến trúc Hà Nội"
          className="w-10 h-10 object-contain"
        />
        <div className="font-bold leading-tight text-[15px]">
          TRƯỜNG ĐẠI HỌC <br /> KIẾN TRÚC HÀ NỘI
        </div>
      </Link>

      {/* Menu */}
      <nav className="mt-4 flex-1">
        {facultyMenu.map((item, idx) => {
          const active = location.pathname.startsWith(item.path);

          return (
            <Link
              key={idx}
              to={item.path}
              className={`flex items-center gap-3 px-6 py-3 text-gray-600 
                hover:bg-[#e0f3fc] hover:text-[#009FE3] transition
                ${active ? "rounded-r-full mr-2" : ""}`}
              style={active ? { backgroundColor: mainColor, color: "#fff" } : {}}
            >
              <span>{item.icon}</span>
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default FacultySidebar;
