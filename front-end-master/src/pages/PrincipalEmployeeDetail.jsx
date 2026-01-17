import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  UserCircle,
  Building2,
  BriefcaseBusiness,
  Phone,
  Mail,
  ArrowLeft,
  Loader2,
  Calendar,
  Users
} from "lucide-react";

const PrincipalEmployeeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEmployeeDetail();
  }, [id]);

  const fetchEmployeeDetail = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:8080/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployee(res.data);
    } catch (err) {
      console.error("Error fetching detail:", err);
      setError("Không thể tải thông tin nhân sự (ID không tồn tại hoặc lỗi mạng).");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="animate-spin text-blue-600" size={40} />
    </div>
  );

  if (error) return (
    <div className="p-6 text-center">
      <p className="text-red-500 mb-4">{error}</p>
      <button
        onClick={() => navigate(-1)}
        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-gray-700"
      >
        Quay lại
      </button>
    </div>
  );

  if (!employee) return null;

  // Determine display values
  const displayRole = employee.positionName || employee.roleName || "Chưa cập nhật";
  const displayDept = employee.facultyName || employee.departmentName || "Chưa phân công";

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* NÚT QUAY LẠI */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 hover:bg-gray-50 transition rounded-lg text-gray-700 mb-5 shadow-sm"
      >
        <ArrowLeft size={18} />
        Quay lại danh sách
      </button>

      {/* HEADER CARD */}
      <div className="bg-white shadow-lg shadow-gray-200/50 rounded-2xl overflow-hidden mb-6">
        <div className="h-32 bg-gradient-to-r from-blue-500 to-cyan-400"></div>
        <div className="px-8 pb-8 relative">
          <div className="flex flex-col md:flex-row gap-6 items-end -mt-12">
            <img
              src={employee.avatar || `https://ui-avatars.com/api/?name=${employee.fullName || employee.username}&background=random&size=128`}
              alt="Avatar"
              className="w-32 h-32 rounded-full border-4 border-white shadow-md bg-white object-cover"
            />
            <div className="flex-1 mb-2">
              <h1 className="text-3xl font-bold text-gray-800">{employee.fullName || employee.username}</h1>
              <div className="flex items-center gap-3 mt-1 text-gray-600">
                <span className="flex items-center gap-1 bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                  {displayRole}
                </span>
                <span className="text-gray-400">|</span>
                <span>{displayDept}</span>
              </div>
            </div>
            <div className="mb-2">
              <span className={`px-4 py-2 rounded-lg text-sm font-semibold border ${employee.isActive
                  ? "bg-green-50 text-green-700 border-green-200"
                  : "bg-red-50 text-red-700 border-red-200"
                }`}>
                {employee.isActive ? "● Đang làm việc" : "● Đã nghỉ việc"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* DETAILS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CARD 1: THÔNG TIN CÁ NHÂN */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-3">
            <UserCircle className="text-blue-500" /> Thông tin cá nhân
          </h3>
          <div className="space-y-4">
            <InfoRow label="Mã nhân viên" value={employee.userId} />
            <InfoRow label="Họ và tên" value={employee.fullName} />
            <InfoRow label="Ngày sinh" value={employee.dob} />
            <InfoRow label="Giới tính" value={employee.gender} />
            <InfoRow label="CCCD/CMND" value={employee.cccd} />
            <InfoRow label="Dân tộc" value={employee.ethnicity} />
            <InfoRow label="Quốc tịch" value={employee.nationality} />
            <InfoRow label="Email" value={employee.email} icon={<Mail size={14} className="mt-1" />} />
            <InfoRow label="Số điện thoại" value={employee.phone} icon={<Phone size={14} className="mt-1" />} />
          </div>
        </div>

        {/* CARD 2: CÔNG VIỆC & HỌC VẤN */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-3">
              <BriefcaseBusiness className="text-blue-500" /> Công việc & Đào tạo
            </h3>
            <div className="space-y-4">
              <InfoRow label="Đơn vị công tác" value={displayDept} icon={<Building2 size={14} className="mt-1" />} />
              <InfoRow label="Chức vụ / Vị trí" value={displayRole} />
              <InfoRow label="Trình độ học vấn" value={employee.educationLevel} />
              <InfoRow label="Tình trạng" value={employee.workingStatus} />
              <InfoRow label="Ngày vào trường" value={employee.joinDate} icon={<Calendar size={14} className="mt-1" />} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-3">
              <Users className="text-blue-500" /> Hợp đồng lao động
            </h3>
            <div className="space-y-4">
              <InfoRow label="Ngày bắt đầu HĐ" value={employee.contractStart} />
              <InfoRow label="Ngày kết thúc HĐ" value={employee.contractEnd} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper Component for consistent rows
const InfoRow = ({ label, value, icon }) => (
  <div className="flex justify-between items-start border-b border-dashed border-gray-100 last:border-0 pb-2 last:pb-0">
    <span className="text-gray-500 text-sm font-medium">{label}</span>
    <div className="flex items-start gap-2 text-gray-800 font-medium text-right max-w-[60%]">
      {icon && <span className="text-gray-400">{icon}</span>}
      <span className="break-words">{value || "---"}</span>
    </div>
  </div>
);

export default PrincipalEmployeeDetail;
