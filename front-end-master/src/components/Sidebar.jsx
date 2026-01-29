import {
  LayoutDashboard,
  Users,
  Building2,
  BarChart2,
  Settings,
  BookOpen,
  Briefcase,
  ClipboardCheck,
  FileText,
  Award,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = ({ collapsed }) => {
  const location = useLocation();

  const isActive = (path) => {
    if (location.pathname === "/" && path === "/dashboard") return true;
    return location.pathname.startsWith(path);
  };

  return (
    <aside className={`${collapsed ? "w-20" : "w-64"} bg-white shadow-md flex flex-col transition-all duration-300 overflow-hidden`}>
      <nav className="mt-8 flex-1 text-slate-700">
        {/* Dashboard */}
        <Link
          to="/dashboard"
          className={`flex items-center gap-3 px-6 py-3 transition ${isActive("/dashboard")
            ? "text-white rounded-r-full mr-2"
            : "text-slate-600 hover:text-primary"
            }`}
          style={isActive("/dashboard") ? { backgroundColor: '#009FE3' } : {}}
        >
          <LayoutDashboard size={18} color={isActive("/dashboard") ? "#fff" : "#3B82F6"} />
          {!collapsed && <span className="text-sm font-semibold truncate">Dashboard thống kê</span>}
        </Link>

        {/* Nhân sự */}
        <Link
          to="/employees"
          className={`flex items-center gap-3 px-6 py-3 transition ${isActive("/employees")
            ? "text-white rounded-r-full mr-2"
            : "text-gray-600"
            }`}
          style={isActive("/employees") ? { backgroundColor: '#009FE3' } : {}}
        >
          <Users size={18} color={isActive("/employees") ? "#fff" : "#10B981"} />
          {!collapsed && <span className="text-sm font-medium truncate">Quản lý nhân sự</span>}
        </Link>

        {/* ===== QUẢN LÝ PHÒNG BAN ===== */}
        <Link
          to="/departments"
          className={`flex items-center gap-3 px-6 py-3 transition ${isActive("/departments")
            ? "text-white rounded-r-full mr-2"
            : "text-gray-600"
            }`}
          style={isActive("/departments") ? { backgroundColor: '#009FE3' } : {}}
        >
          <Building2 size={18} color={isActive("/departments") ? "#fff" : "#F59E0B"} />
          {!collapsed && <span className="text-sm font-medium truncate">Quản lý phòng ban</span>}
        </Link>

        {/* ===== QUẢN LÝ KHOA ===== */}
        <Link
          to="/faculties"
          className={`flex items-center gap-3 px-6 py-3 transition ${isActive("/faculties")
            ? "text-white rounded-r-full mr-2"
            : "text-gray-600"
            }`}
          style={isActive("/faculties") ? { backgroundColor: '#009FE3' } : {}}
        >
          <BookOpen size={18} color={isActive("/faculties") ? "#fff" : "#8B5CF6"} />
          {!collapsed && <span className="text-sm font-medium truncate">Quản lý khoa</span>}
        </Link>

        {/* Chức danh */}
        <Link
          to="/positions"
          className={`flex items-center gap-3 px-6 py-3 transition ${isActive("/positions")
            ? "text-white rounded-r-full mr-2"
            : "text-gray-600"
            }`}
          style={isActive("/positions") ? { backgroundColor: '#009FE3' } : {}}
        >
          <Briefcase size={18} color={isActive("/positions") ? "#fff" : "#06B6D4"} />
          {!collapsed && <span className="text-sm font-medium truncate">Quản lý chức danh</span>}
        </Link>

        {/* Hợp đồng */}
        <Link
          to="/contracts"
          className={`flex items-center gap-3 px-6 py-3 transition ${isActive("/contracts")
            ? "text-white rounded-r-full mr-2"
            : "text-gray-600"
            }`}
          style={isActive("/contracts") ? { backgroundColor: '#009FE3' } : {}}
        >
          <FileText size={18} color={isActive("/contracts") ? "#fff" : "#EC4899"} />
          {!collapsed && <span className="text-sm font-medium truncate">Quản lý hợp đồng</span>}
        </Link>

        {/* Khen thưởng & Kỷ luật */}
        <Link
          to="/reward-discipline"
          className={`flex items-center gap-3 px-6 py-3 transition ${isActive("/reward-discipline")
            ? "text-white rounded-r-full mr-2"
            : "text-gray-600"
            }`}
          style={isActive("/reward-discipline") ? { backgroundColor: '#009FE3' } : {}}
        >
          <Award size={18} color={isActive("/reward-discipline") ? "#fff" : "#EF4444"} />
          {!collapsed && <span className="text-sm font-medium truncate">Khen thưởng & Kỷ luật</span>}
        </Link>

        {/* Trình phê duyệt */}
        <Link
          to="/approvals"
          className={`flex items-center gap-3 px-6 py-3 transition ${isActive("/approvals")
            ? "text-white rounded-r-full mr-2"
            : "text-gray-600"
            }`}
          style={isActive("/approvals") ? { backgroundColor: '#009FE3' } : {}}
        >
          <ClipboardCheck size={18} color={isActive("/approvals") ? "#fff" : "#6366F1"} />
          {!collapsed && <span className="text-sm font-medium truncate">Trình phê duyệt</span>}
        </Link>

        {/* Báo cáo */}
        <Link
          to="/reports"
          className={`flex items-center gap-3 px-6 py-3 transition ${isActive("/reports")
            ? "text-white rounded-r-full mr-2"
            : "text-gray-600"
            }`}
          style={isActive("/reports") ? { backgroundColor: '#009FE3' } : {}}
        >
          <BarChart2 size={18} color={isActive("/reports") ? "#fff" : "#64748B"} />
          {!collapsed && <span className="text-sm font-medium truncate">Báo cáo & Thống kê</span>}
        </Link>

        {/* Cài đặt */}
        <Link
          to="/settings"
          className={`flex items-center gap-3 px-6 py-3 transition ${isActive("/settings")
            ? "text-white rounded-r-full mr-2"
            : "text-gray-600"
            }`}
          style={isActive("/settings") ? { backgroundColor: '#009FE3' } : {}}
        >
          <Settings size={18} color={isActive("/settings") ? "#fff" : "#4B5563"} />
          {!collapsed && <span className="text-sm font-medium truncate">Cài đặt hệ thống</span>}
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
