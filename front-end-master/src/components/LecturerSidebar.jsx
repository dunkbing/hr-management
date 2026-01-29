import {
    LayoutDashboard,
    User,
    Send,
    ClipboardList,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const LecturerSidebar = ({ collapsed }) => {
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <aside className={`${collapsed ? "w-20" : "w-64"} bg-white shadow-md flex flex-col transition-all duration-300 overflow-hidden`}>
            <nav className="mt-8 flex-1 text-slate-700">
                <Link
                    to="/lecturer/dashboard"
                    className={`flex items-center gap-3 px-6 py-3 transition ${isActive("/lecturer/dashboard")
                        ? "text-white rounded-r-full mr-2"
                        : "text-slate-600 hover:text-primary"
                        }`}
                    style={isActive("/lecturer/dashboard") ? { backgroundColor: '#009FE3' } : {}}
                >
                    <LayoutDashboard size={18} color={isActive("/lecturer/dashboard") ? "#fff" : "#3B82F6"} />
                    {!collapsed && <span className="text-sm font-semibold truncate">Bảng điều khiển</span>}
                </Link>

                <Link
                    to="/lecturer/profile"
                    className={`flex items-center gap-3 px-6 py-3 transition ${isActive("/lecturer/profile")
                        ? "text-white rounded-r-full mr-2"
                        : "text-slate-600 hover:text-primary"
                        }`}
                    style={isActive("/lecturer/profile") ? { backgroundColor: '#009FE3' } : {}}
                >
                    <User size={18} color={isActive("/lecturer/profile") ? "#fff" : "#8B5CF6"} />
                    {!collapsed && <span className="text-sm font-semibold truncate">Thông tin cá nhân</span>}
                </Link>

                <Link
                    to="/lecturer/submit-request"
                    className={`flex items-center gap-3 px-6 py-3 transition ${isActive("/lecturer/submit-request")
                        ? "text-white rounded-r-full mr-2"
                        : "text-slate-600 hover:text-primary"
                        }`}
                    style={isActive("/lecturer/submit-request") ? { backgroundColor: '#009FE3' } : {}}
                >
                    <Send size={18} color={isActive("/lecturer/submit-request") ? "#fff" : "#10B981"} />
                    {!collapsed && <span className="text-sm font-semibold truncate">Gửi yêu cầu</span>}
                </Link>

                <Link
                    to="/lecturer/my-requests"
                    className={`flex items-center gap-3 px-6 py-3 transition ${isActive("/lecturer/my-requests")
                        ? "text-white rounded-r-full mr-2"
                        : "text-slate-600 hover:text-primary"
                        }`}
                    style={isActive("/lecturer/my-requests") ? { backgroundColor: '#009FE3' } : {}}
                >
                    <ClipboardList size={18} color={isActive("/lecturer/my-requests") ? "#fff" : "#64748B"} />
                    {!collapsed && <span className="text-sm font-semibold truncate">Lịch sử yêu cầu</span>}
                </Link>
            </nav>
        </aside>
    );
};

export default LecturerSidebar;
