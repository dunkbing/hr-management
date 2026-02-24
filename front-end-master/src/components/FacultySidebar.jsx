import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FilePlus2,
  ClipboardCheck,
  BarChart2,
  Settings,
} from "lucide-react";

const facultyMenu = [
  { label: "Dashboard", path: "/faculty/dashboard", icon: <LayoutDashboard size={18} />, iconColor: "#3B82F6" },
  { label: "Nhân sự khoa tôi", path: "/faculty/employees", icon: <Users size={18} />, iconColor: "#10B981" },

  // ⭐ Tên mới theo yêu cầu
  { label: "Đề xuất & Yêu cầu", path: "/faculty/proposals", icon: <FilePlus2 size={18} />, iconColor: "#F59E0B" },

  // ⭐ Phê duyệt yêu cầu từ nhân viên
  { label: "Phê duyệt yêu cầu", path: "/faculty/approvals", icon: <ClipboardCheck size={18} />, iconColor: "#8B5CF6" },

  { label: "Báo cáo khoa", path: "/faculty/reports", icon: <BarChart2 size={18} />, iconColor: "#64748B" },

  // ⭐ Cài đặt NGAY DƯỚI Báo cáo khoa
  { label: "Cài đặt", path: "/faculty/settings", icon: <Settings size={18} />, iconColor: "#4B5563" },
];

const FacultySidebar = ({ collapsed }) => {
  const location = useLocation();

  return (
    <aside className={`${collapsed ? "w-20" : "w-64"} bg-white shadow-md flex flex-col transition-all duration-300 overflow-hidden`}>
      {/* Menu */}
      <nav className="mt-8 flex-1">
        {facultyMenu.map((item, idx) => {
          const active = location.pathname.startsWith(item.path);

          return (
            <Link
              key={idx}
              to={item.path}
              className={`flex items-center gap-3 px-6 py-3 text-slate-600 
                transition hover:text-primary
                ${active ? "rounded-r-full mr-2" : ""}`}
              style={active ? { backgroundColor: '#009FE3', color: '#fff' } : {}}
            >
              <span>
                {React.cloneElement(item.icon, {
                  color: active ? "#fff" : item.iconColor
                })}
              </span>
              {!collapsed && <span className="text-sm font-semibold truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default FacultySidebar;
