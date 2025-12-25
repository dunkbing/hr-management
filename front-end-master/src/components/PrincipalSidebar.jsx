import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Building2,
  School,
  CheckCircle,
  BarChart2,
  Settings,
} from "lucide-react";

// ⭐ Menu theo đúng thứ tự yêu cầu
const principalMenu = [
  { label: "Dashboard thống kê", path: "/principal/dashboard", icon: <LayoutDashboard size={18} /> },
  { label: "Quản lý nhân sự", path: "/principal/employees", icon: <Users size={18} /> },
  { label: "Quản lý phòng ban", path: "/principal/departments", icon: <Building2 size={18} /> },
  { label: "Quản lý khoa", path: "/principal/faculties", icon: <School size={18} /> },
  { label: "Phê duyệt", path: "/principal/approvals", icon: <CheckCircle size={18} /> },
  { label: "Báo cáo - Thống kê", path: "/principal/reports", icon: <BarChart2 size={18} /> },
  { label: "Cài đặt", path: "/principal/settings", icon: <Settings size={18} /> },
];

const PrincipalSidebar = () => {
  const location = useLocation();
  const mainColor = "#009FE3";

  return (
    <aside className="w-64 bg-white shadow-md flex flex-col">
      {/* Logo trường */}
      <Link
        to="/principal/dashboard"
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
        {principalMenu.map((item, i) => {
          const active = location.pathname === item.path;

          return (
            <Link
              key={i}
              to={item.path}
              className={`flex items-center gap-3 px-6 py-3 text-gray-600 
                hover:bg-[#e0f3fc] hover:text-[#009FE3] transition
                ${active ? "rounded-r-full mr-2" : ""}`}
              style={active ? { backgroundColor: mainColor, color: "#fff" } : {}}
            >
              {/* ICON */}
              <span>{item.icon}</span>

              {/* LABEL */}
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default PrincipalSidebar;
