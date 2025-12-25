import { ArrowLeft, Mail, Phone, Briefcase, User, BookOpen } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";

const FacultyEmployeeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Fake data (sau này gọi API bằng id)
  const employee = {
    id: 1,
    name: "Nguyễn Văn A",
    role: "Giảng viên chính",
    department: "Bộ môn Kết cấu",
    status: "Đang làm việc",
    email: "nguyenvana@hau.edu.vn",
    phone: "0987654321",
    avatar: "https://ui-avatars.com/api/?name=Nguyen+Van+A&size=200",
    gender: "Nam",
    birthday: "1985-12-20",
    education: "Tiến sĩ Kỹ thuật",
    major: "Kỹ thuật xây dựng",
    startDate: "2013-09-12",
    contractType: "Hợp đồng dài hạn",
    seniority: "12 năm",
    manager: "PGS.TS Trần Minh Đức",
  };

  const statusColor = {
    "Đang làm việc": "bg-green-100 text-green-700",
    "Nghỉ phép": "bg-yellow-100 text-yellow-700",
    "Công tác": "bg-blue-100 text-blue-700",
  };

  return (
    <div className="p-6">

      {/* Nút quay lại */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-700 hover:text-black mb-4"
      >
        <ArrowLeft size={18} /> Quay lại danh sách
      </button>

      {/* Header thông tin */}
      <div className="bg-white shadow rounded-2xl p-6 flex items-center gap-6 mb-8">
        <img
          src={employee.avatar}
          className="w-28 h-28 rounded-full border shadow"
          alt={employee.name}
        />

        <div className="flex-1">
          <h1 className="text-3xl font-bold">{employee.name}</h1>

          <p className="text-gray-600 text-lg">{employee.role}</p>

          <p className="text-gray-500 mt-1">{employee.department}</p>

          <span
            className={`inline-block mt-3 px-3 py-1 rounded-full text-sm ${statusColor[employee.status]}`}
          >
            {employee.status}
          </span>

          <div className="flex items-center gap-4 mt-4 text-gray-700">
            <div className="flex items-center gap-2">
              <Mail size={18} /> {employee.email}
            </div>
            <div className="flex items-center gap-2">
              <Phone size={18} /> {employee.phone}
            </div>
          </div>
        </div>
      </div>

      {/* Thông tin chi tiết */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Cột trái */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-4">Thông tin cá nhân</h2>
          <DetailItem label="Họ tên" value={employee.name} />
          <DetailItem label="Giới tính" value={employee.gender} />
          <DetailItem label="Ngày sinh" value={employee.birthday} />
          <DetailItem label="Trình độ học vấn" value={employee.education} />
          <DetailItem label="Chuyên ngành" value={employee.major} />
          <DetailItem label="Ngày vào trường" value={employee.startDate} />
          <DetailItem label="Loại hợp đồng" value={employee.contractType} />
        </div>

        {/* Cột phải */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-4">Thông tin công tác</h2>
          <DetailItem label="Bộ môn" value={employee.department} />
          <DetailItem label="Chức danh" value={employee.role} />
          <DetailItem label="Thâm niên" value={employee.seniority} />
          <DetailItem label="Trạng thái" value={employee.status} />
          <DetailItem label="Quản lý trực tiếp" value={employee.manager} />
        </div>
      </div>

      {/* Tabs nâng cao */}
      <div className="mt-8 space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Briefcase size={20} /> Hồ sơ công tác
          </h2>
          <ul className="list-disc ml-6 text-gray-700 space-y-1">
            <li>Giảng dạy môn Kết cấu thép 1,2</li>
            <li>Tham gia nghiên cứu đề tài cấp bộ — 2023</li>
            <li>Hướng dẫn 12 đồ án tốt nghiệp</li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <User size={20} /> Khen thưởng & Kỷ luật
          </h2>

          <div className="space-y-3">
            <TimelineItem
              year="2024"
              content="Bằng khen giảng viên xuất sắc cấp trường"
            />
            <TimelineItem
              year="2023"
              content="Hoàn thành xuất sắc nhiệm vụ năm học"
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <BookOpen size={20} /> Hoạt động gần đây
          </h2>

          <ul className="list-disc ml-6 text-gray-700 space-y-1">
            <li>Tham gia hội thảo kỹ thuật xây dựng — 01/2025</li>
            <li>Đi công tác tại Nhật Bản — 12/2024</li>
            <li>Chấm đồ án tốt nghiệp — 11/2024</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const DetailItem = ({ label, value }) => (
  <div className="mb-3">
    <p className="text-gray-500 text-sm">{label}</p>
    <p className="font-medium">{value}</p>
  </div>
);

const TimelineItem = ({ year, content }) => (
  <div className="flex gap-4 items-start">
    <div className="font-bold text-blue-600 w-14">{year}</div>
    <div className="text-gray-700">{content}</div>
  </div>
);

export default FacultyEmployeeDetail;
