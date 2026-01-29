import React from "react";
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
  { label: "Dashboard thống kê", path: "/principal/dashboard", icon: <LayoutDashboard size={18} />, iconColor: "#3B82F6" },
  { label: "Quản lý nhân sự", path: "/principal/employees", icon: <Users size={18} />, iconColor: "#10B981" },
  { label: "Quản lý phòng ban", path: "/principal/departments", icon: <Building2 size={18} />, iconColor: "#F59E0B" },
  { label: "Quản lý khoa", path: "/principal/faculties", icon: <School size={18} />, iconColor: "#8B5CF6" },
  { label: "Phê duyệt", path: "/principal/approvals", icon: <CheckCircle size={18} />, iconColor: "#6366F1" },
  { label: "Báo cáo - Thống kê", path: "/principal/reports", icon: <BarChart2 size={18} />, iconColor: "#64748B" },
  { label: "Cài đặt", path: "/principal/settings", icon: <Settings size={18} />, iconColor: "#4B5563" },
];

const PrincipalSidebar = ({ collapsed }) => {
  const location = useLocation();

  return (
    <aside className={`${collapsed ? "w-20" : "w-64"} bg-white shadow-md flex flex-col transition-all duration-300 overflow-hidden`}>
      {/* Menu */}
      <nav className="mt-8 flex-1">
        {principalMenu.map((item, i) => {
          const active = location.pathname === item.path;

          return (
            <Link
              key={i}
              to={item.path}
              className={`flex items-center gap-3 px-6 py-3 text-slate-600 
                transition hover:text-primary
                ${active ? "rounded-r-full mr-2" : ""}`}
              style={active ? { backgroundColor: '#009FE3', color: '#fff' } : {}}
            >
              {/* ICON */}
              <span>
                {React.cloneElement(item.icon, {
                  color: active ? "#fff" : item.iconColor
                })}
              </span>

              {/* LABEL */}
              {!collapsed && <span className="text-sm font-semibold truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default PrincipalSidebar;
