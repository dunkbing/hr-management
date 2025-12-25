import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaUserEdit, FaDownload, FaUser, FaBriefcase, FaAddressCard, FaInfoCircle } from "react-icons/fa";
import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

function EmployeeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const mainColor = "#009FE3";

  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("personal");

  useEffect(() => {
    fetchEmployee();
  }, [id]);

  const fetchEmployee = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE_URL}/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEmployee(res.data);
    } catch (error) {
      console.error("Error fetching employee:", error);
      alert("Không thể tải thông tin nhân viên");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 italic">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-2xl font-bold text-gray-700">Không tìm thấy nhân viên</h2>
        <Link to="/employees" className="text-blue-600 hover:underline mt-4 block">Quay lại danh sách</Link>
      </div>
    );
  }

  // Placeholder avatar logic
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(employee.fullName || employee.username)}&background=009FE3&color=fff&size=256`;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/employees")}
            className="p-2 hover:bg-white rounded-full transition shadow-sm bg-white"
          >
            <FaArrowLeft className="text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Hồ sơ nhân viên</h1>
        </div>
        <button
          onClick={() => navigate(`/employees/edit/${id}`)}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold shadow-lg hover:opacity-90 transition"
          style={{ backgroundColor: mainColor, color: "#fff" }}
        >
          <FaUserEdit /> Chỉnh sửa hồ sơ
        </button>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Summary Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-blue-400 to-blue-600"></div>
            <div className="px-6 pb-8 -mt-16 text-center">
              <div className="relative inline-block">
                <img
                  src={avatarUrl}
                  alt={employee.fullName}
                  className="w-32 h-32 rounded-3xl object-cover border-4 border-white shadow-xl mx-auto"
                />
                <div className={`absolute bottom-2 right-2 w-4 h-4 rounded-full border-2 border-white ${employee.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
              </div>
              <h2 className="mt-4 text-2xl font-bold text-gray-800">{employee.fullName || employee.username}</h2>
              <p className="text-blue-600 font-semibold">{employee.positionName || "Chức danh chưa cập nhật"}</p>
              <div className="mt-2 text-sm text-gray-500 flex items-center justify-center gap-1">
                <FaBriefcase className="w-3 h-3" />
                <span>{employee.facultyName || employee.departmentName || "Phòng ban chưa cập nhật"}</span>
              </div>
              <div className="mt-6 pt-6 border-t border-gray-50 flex justify-center gap-4">
                <div className="text-center">
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Trạng thái</p>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${employee.isActive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                    {employee.isActive ? "Hoạt động" : "Tạm khóa"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-widest mb-4 flex items-center gap-2">
              <FaInfoCircle className="text-blue-500" /> Liên hệ nhanh
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-400">Email công việc</p>
                <p className="text-sm font-medium text-gray-700 break-all">{employee.email || "---"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Số điện thoại</p>
                <p className="text-sm font-medium text-gray-700">{employee.phone || "---"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Tabs */}
        <div className="lg:col-span-2">
          {/* Tab Navigation */}
          <div className="flex gap-1 p-1 bg-gray-100 rounded-xl mb-6">
            <TabButton
              label="Cá nhân"
              icon={<FaUser />}
              active={activeTab === "personal"}
              onClick={() => setActiveTab("personal")}
              primary={mainColor}
            />
            <TabButton
              label="Công việc"
              icon={<FaBriefcase />}
              active={activeTab === "work"}
              onClick={() => setActiveTab("work")}
              primary={mainColor}
            />
            <TabButton
              label="Định danh & Trình độ"
              icon={<FaAddressCard />}
              active={activeTab === "id"}
              onClick={() => setActiveTab("id")}
              primary={mainColor}
            />
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 min-h-[400px]">
            {activeTab === "personal" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-2 duration-300">
                <SectionHeader title="Thông tin cơ bản" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                  <InfoItem label="Họ và tên" value={employee.fullName} />
                  <InfoItem label="Tên người dùng" value={employee.username} />
                  <InfoItem label="Ngày sinh" value={employee.dob} />
                  <InfoItem label="Giới tính" value={employee.gender} />
                  <InfoItem label="Quốc tịch" value={employee.nationality} />
                  <InfoItem label="Dân tộc" value={employee.ethnicity} />
                </div>
              </div>
            )}

            {activeTab === "work" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-2 duration-300">
                <SectionHeader title="Chi tiết công tác" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                  <InfoItem label="Đơn vị" value={employee.facultyName || employee.departmentName} />
                  <InfoItem label="Chức vụ" value={employee.positionName} />
                  <InfoItem label="Ngày vào trường" value={employee.joinDate} />
                  <InfoItem label="Tình trạng công tác" value={employee.workingStatus} />
                </div>

                <SectionHeader title="Hợp đồng lao động" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                  <InfoItem label="Ngày bắt đầu" value={employee.contractStart} />
                  <InfoItem label="Ngày kết thúc" value={employee.contractEnd} />
                </div>
              </div>
            )}

            {activeTab === "id" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-2 duration-300">
                <SectionHeader title="Giấy tờ định danh" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                  <InfoItem label="Số CCCD/CMND" value={employee.cccd} />
                  <InfoItem label="Học vị/Trình độ" value={employee.educationLevel} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Internal Components
const TabButton = ({ label, icon, active, onClick, primary }) => (
  <button
    onClick={onClick}
    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${active
        ? "bg-white shadow-sm text-gray-800"
        : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
      }`}
    style={active ? { color: primary } : {}}
  >
    {icon}
    <span>{label}</span>
  </button>
);

const SectionHeader = ({ title }) => (
  <div className="flex items-center gap-4 mb-4">
    <h3 className="text-base font-bold text-gray-800 flex-shrink-0">{title}</h3>
    <div className="h-px bg-gray-100 w-full"></div>
  </div>
);

const InfoItem = ({ label, value }) => (
  <div className="space-y-1">
    <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">{label}</p>
    <p className="text-sm font-semibold text-gray-700">{value || "---"}</p>
  </div>
);

export default EmployeeDetail;
