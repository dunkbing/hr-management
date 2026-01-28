import {
    LayoutDashboard,
    User,
    Send,
    ClipboardList,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const LecturerSidebar = () => {
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <aside className="w-64 bg-white shadow-md flex flex-col">
            {/* Logo */}
            <Link
                to="/lecturer/dashboard"
                className="flex items-center gap-3 p-6 border-b transition"
            >
                <img
                    src="https://upload.wikimedia.org/wikipedia/commons/0/03/Logo_HAU.png"
                    alt="Logo HAU"
                    className="w-10 h-10 object-contain"
                />
                <div className="font-bold leading-tight text-[15px] text-primary">
                    TRƯỜNG ĐẠI HỌC <br /> KIẾN TRÚC HÀ NỘI
                </div>
            </Link>

            <nav className="mt-4 flex-1 text-gray-600">
                <Link
                    to="/lecturer/dashboard"
                    className={`flex items-center gap-3 px-6 py-3 transition ${isActive("/lecturer/dashboard")
                        ? "text-white rounded-r-full mr-2"
                        : "text-gray-600"
                        }`}
                    style={isActive("/lecturer/dashboard") ? { backgroundColor: '#009FE3' } : {}}
                >
                    <LayoutDashboard size={18} color={isActive("/lecturer/dashboard") ? "#fff" : "#3B82F6"} />
                    <span className="text-sm font-medium">Bảng điều khiển</span>
                </Link>

                <Link
                    to="/lecturer/profile"
                    className={`flex items-center gap-3 px-6 py-3 transition ${isActive("/lecturer/profile")
                        ? "text-white rounded-r-full mr-2"
                        : "text-gray-600"
                        }`}
                    style={isActive("/lecturer/profile") ? { backgroundColor: '#009FE3' } : {}}
                >
                    <User size={18} color={isActive("/lecturer/profile") ? "#fff" : "#8B5CF6"} />
                    <span className="text-sm font-medium">Thông tin cá nhân</span>
                </Link>

                <Link
                    to="/lecturer/submit-request"
                    className={`flex items-center gap-3 px-6 py-3 transition ${isActive("/lecturer/submit-request")
                        ? "text-white rounded-r-full mr-2"
                        : "text-gray-600"
                        }`}
                    style={isActive("/lecturer/submit-request") ? { backgroundColor: '#009FE3' } : {}}
                >
                    <Send size={18} color={isActive("/lecturer/submit-request") ? "#fff" : "#10B981"} />
                    <span className="text-sm font-medium">Gửi yêu cầu</span>
                </Link>

                <Link
                    to="/lecturer/my-requests"
                    className={`flex items-center gap-3 px-6 py-3 transition ${isActive("/lecturer/my-requests")
                        ? "text-white rounded-r-full mr-2"
                        : "text-gray-600"
                        }`}
                    style={isActive("/lecturer/my-requests") ? { backgroundColor: '#009FE3' } : {}}
                >
                    <ClipboardList size={18} color={isActive("/lecturer/my-requests") ? "#fff" : "#64748B"} />
                    <span className="text-sm font-medium">Lịch sử yêu cầu</span>
                </Link>
            </nav>
        </aside>
    );
};

export default LecturerSidebar;
