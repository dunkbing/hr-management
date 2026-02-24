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
              src={employee.officialPhoto || employee.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(employee.fullName || employee.username)}&background=random&size=128`}
              alt="Avatar"
              className="w-32 h-32 rounded-full border-4 border-white shadow-md bg-white object-cover"
            />
            <div className="flex-1 mb-2">
              <h1 className="text-3xl font-black text-slate-950 uppercase tracking-tight">{employee.fullName || employee.username}</h1>
              <div className="flex items-center gap-3 mt-2 text-slate-600">
                <span className="flex items-center gap-1 bg-[#009FE3] text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-100">
                  {displayRole}
                </span>
                <span className="text-slate-300">/</span>
                <span className="text-sm font-black text-slate-500 uppercase tracking-widest">{displayDept}</span>
              </div>
            </div>
            <div className="mb-2">
              <span className={`px-4 py-2 rounded-xl text-[10px] font-black border uppercase tracking-widest shadow-sm ${employee.isActive
                ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                : "bg-rose-50 text-rose-700 border-rose-100"
                }`}>
                {employee.isActive ? "Đang làm việc" : "Đã nghỉ việc"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* DETAILS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CARD 1: THÔNG TIN CÁ NHÂN */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
          <h3 className="text-lg font-black text-slate-900 mb-8 flex items-center gap-3 border-b border-slate-50 pb-5 uppercase tracking-wider">
            <UserCircle className="text-[#009FE3]" /> Thông tin cá nhân
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
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <h3 className="text-lg font-black text-slate-900 mb-8 flex items-center gap-3 border-b border-slate-50 pb-5 uppercase tracking-wider">
              <BriefcaseBusiness className="text-[#009FE3]" /> Công việc & Đào tạo
            </h3>
            <div className="space-y-4">
              <InfoRow label="Đơn vị công tác" value={displayDept} icon={<Building2 size={14} className="mt-1" />} />
              <InfoRow label="Chức vụ / Vị trí" value={displayRole} />
              <InfoRow label="Trình độ học vấn" value={employee.educationLevel} />
              <InfoRow label="Tình trạng" value={employee.workingStatus} />
              <InfoRow label="Ngày vào trường" value={employee.joinDate} icon={<Calendar size={14} className="mt-1" />} />
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <h3 className="text-lg font-black text-slate-900 mb-8 flex items-center gap-3 border-b border-slate-50 pb-5 uppercase tracking-wider">
              <Users className="text-[#009FE3]" /> Hợp đồng lao động
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
  <div className="flex justify-between items-center border-b border-slate-50 last:border-0 pb-4 last:pb-0">
    <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest ml-1">{label}</span>
    <div className="flex items-center gap-2 text-slate-900 font-bold text-right max-w-[60%]">
      {icon && <span className="text-slate-300">{icon}</span>}
      <span className="break-words">{value || "---"}</span>
    </div>
  </div>
);

export default PrincipalEmployeeDetail;
