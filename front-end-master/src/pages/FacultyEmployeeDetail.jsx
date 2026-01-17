import { useState, useEffect } from "react";
import { ArrowLeft, Mail, Phone, Briefcase, User, BookOpen, Calendar, Award } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const FacultyEmployeeDetail = () => {
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
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:8080/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployee(res.data);
    } catch (err) {
      console.error("Error details:", err);
      setError("Không thể tải thông tin nhân sự. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  if (error) return (
    <div className="p-6 text-center">
      <div className="text-red-500 mb-4">{error}</div>
      <button onClick={() => navigate(-1)} className="text-blue-600 hover:underline">
        Quay lại
      </button>
    </div>
  );

  if (!employee) return null;

  // Helpers for display
  const statusColor = {
    true: "bg-green-100 text-green-700",
    false: "bg-red-100 text-red-700"
  };

  const statusLabel = {
    true: "Đang làm việc",
    false: "Đã nghỉ"
  };

  // Calculate seniority
  const calculateSeniority = (joinDate) => {
    if (!joinDate) return "---";
    const start = new Date(joinDate);
    const now = new Date();
    const diffTime = Math.abs(now - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const years = Math.floor(diffDays / 365);
    if (years < 1) return "Dưới 1 năm";
    return `${years} năm`;
  };

  // Determine contract type (heuristic)
  const getContractType = (start, end) => {
    if (!start) return "Chưa có hợp đồng";
    if (!end) return "Hợp đồng không xác định thời hạn";
    return "Hợp đồng có thời hạn";
  };

  // Safe avatar
  const avatarUrl = employee.avatar && employee.avatar.startsWith("data:")
    ? employee.avatar
    : `https://ui-avatars.com/api/?name=${employee.fullName || employee.username}&size=200&background=random`;

  return (
    <div className="p-6 max-w-5xl mx-auto">

      {/* Nút quay lại */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6 transition font-medium"
      >
        <ArrowLeft size={20} /> Quay lại danh sách
      </button>

      {/* Header thông tin */}
      <div className="bg-white shadow-sm border border-gray-100 rounded-3xl p-8 flex flex-col md:flex-row items-center md:items-start gap-8 mb-8 relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -z-0 opacity-50 translate-x-1/2 -translate-y-1/2"></div>

        <div className="relative z-10 shrink-0">
          <img
            src={avatarUrl}
            className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
            alt={employee.fullName}
          />
        </div>

        <div className="flex-1 relative z-10 text-center md:text-left">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{employee.fullName}</h1>

          <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
            <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm font-semibold">
              {employee.roleName || "Chưa có chức vụ"}
            </span>
            <span className={`px-3 py-1 rounded-lg text-sm font-semibold ${statusColor[employee.isActive]}`}>
              {statusLabel[employee.isActive]}
            </span>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 text-gray-600 mt-2">
            <div className="flex items-center gap-2">
              <Mail size={16} className="text-gray-400" /> {employee.email || "---"}
            </div>
            <div className="flex items-center gap-2">
              <Phone size={16} className="text-gray-400" /> {employee.phone || "---"}
            </div>
            <div className="flex items-center gap-2">
              <Briefcase size={16} className="text-gray-400" /> {employee.departmentName || employee.facultyName || "---"}
            </div>
          </div>
        </div>
      </div>

      {/* Thông tin chi tiết grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Cột trái: Thông tin cá nhân */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2 border-b pb-3">
            <User size={20} className="text-blue-500" /> Thông tin cá nhân
          </h2>
          <div className="space-y-4">
            <DetailItem label="Họ và tên" value={employee.fullName} />
            <DetailItem label="Giới tính" value={employee.gender || "---"} />
            <DetailItem label="Ngày sinh" value={employee.dob || "---"} />
            <DetailItem label="CCCD/CMND" value={employee.cccd || "---"} />
            <DetailItem label="Dân tộc" value={employee.ethnicity || "---"} />
            <DetailItem label="Quốc tịch" value={employee.nationality || "---"} />
          </div>
        </div>

        {/* Cột phải: Thông tin công việc */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2 border-b pb-3">
            <Briefcase size={20} className="text-indigo-500" /> Thông tin công tác
          </h2>
          <div className="space-y-4">
            <DetailItem label="Đơn vị công tác" value={employee.departmentName || employee.facultyName || "---"} />
            <DetailItem label="Chức vụ" value={employee.positionName || employee.roleName || "---"} />
            <DetailItem label="Trình độ học vấn" value={employee.educationLevel || "---"} />
            <DetailItem label="Ngày vào trường" value={employee.joinDate || "---"} />
            <DetailItem label="Thâm niên" value={calculateSeniority(employee.joinDate)} />
            <DetailItem label="Loại hợp đồng" value={getContractType(employee.contractStart, employee.contractEnd)} />
            {employee.contractStart && (
              <DetailItem label="Thời hạn hợp đồng" value={`${employee.contractStart} - ${employee.contractEnd || "Nay"}`} />
            )}
          </div>
        </div>
      </div>

      {/* Tabs nâng cao: Placeholder for future modules */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 opacity-60">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-500">
            <Award size={20} /> Khen thưởng & Kỷ luật
          </h2>
          <p className="text-sm text-gray-400 italic">Dữ liệu chưa được cập nhật...</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 opacity-60">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-500">
            <Calendar size={20} /> Hoạt động gần đây
          </h2>
          <p className="text-sm text-gray-400 italic">Dữ liệu chưa được cập nhật...</p>
        </div>
      </div>
    </div>
  );
};

const DetailItem = ({ label, value }) => (
  <div className="flex justify-between items-center py-1 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition px-2 rounded-lg">
    <p className="text-gray-500 text-sm font-medium">{label}</p>
    <p className="font-semibold text-gray-800 text-right text-sm">{value}</p>
  </div>
);

export default FacultyEmployeeDetail;
