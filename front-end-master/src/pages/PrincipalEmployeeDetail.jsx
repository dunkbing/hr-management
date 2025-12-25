import { useParams, useNavigate } from "react-router-dom";
import {
  UserCircle,
  Building2,
  BriefcaseBusiness,
  Phone,
  Mail,
  ArrowLeft,
} from "lucide-react";

const PrincipalEmployeeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // DỮ LIỆU TẠM
  const sampleData = [
    {
      id: 1,
      code: "NV001",
      fullname: "Nguyễn Văn A",
      departmentName: "Khoa Công nghệ thông tin",
      position: "Giảng viên",
      dob: "1985-03-05",
      gender: "Nam",
      phone: "0987654321",
      email: "vana@hau.edu.vn",
    },
    {
      id: 2,
      code: "NV002",
      fullname: "Trần Thị B",
      departmentName: "Phòng Tổ chức Hành chính",
      position: "Chuyên viên",
      dob: "1990-07-14",
      gender: "Nữ",
      phone: "0912345678",
      email: "thib@hau.edu.vn",
    },
  ];

  const employee = sampleData.find((e) => e.id === parseInt(id));

  if (!employee)
    return <div className="p-6 text-red-500">Không tìm thấy nhân sự.</div>;

  return (
    <div className="p-6">
      {/* NÚT QUAY LẠI */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 transition rounded-lg text-gray-700 mb-5 shadow-sm"
      >
        <ArrowLeft size={18} />
        Quay lại
      </button>

      {/* TIÊU ĐỀ */}
      <h1 className="text-2xl font-bold mb-6 text-[#009FE3]">
        Thông tin nhân sự
      </h1>

      {/* CARD THÔNG TIN */}
      <div className="bg-white shadow-md rounded-xl p-6 border border-gray-100">
        {/* HEADER */}
        <div className="flex items-center gap-5 mb-6">
          <UserCircle size={70} className="text-gray-300" />
          <div>
            <h2 className="text-xl font-semibold">{employee.fullname}</h2>
            <p className="text-gray-500">{employee.position}</p>
            <p className="text-sm text-gray-400 mt-1">{employee.code}</p>
          </div>
        </div>

        {/* GRID THÔNG TIN */}
        <div className="grid grid-cols-2 gap-6">
          {/* THÔNG TIN CÁ NHÂN */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="font-semibold mb-3">Thông tin cá nhân</h3>
            <div className="space-y-1 text-gray-700">
              <p><strong>Ngày sinh: </strong>{employee.dob}</p>
              <p><strong>Giới tính: </strong>{employee.gender}</p>
              <p className="flex items-center gap-2 pt-1">
                <Phone size={16} /> {employee.phone}
              </p>
              <p className="flex items-center gap-2 pt-1">
                <Mail size={16} /> {employee.email}
              </p>
            </div>
          </div>

          {/* ĐƠN VỊ - CHỨC DANH */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="font-semibold mb-3">Đơn vị - Chức danh</h3>
            <div className="space-y-2 text-gray-700">
              <p className="flex items-center gap-2">
                <Building2 size={16} /> {employee.departmentName}
              </p>
              <p className="flex items-center gap-2">
                <BriefcaseBusiness size={16} /> {employee.position}
              </p>
            </div>
          </div>
        </div>

        {/* THÔNG TIN MỞ RỘNG */}
        <div className="mt-6">
          <h3 className="font-semibold mb-3">Thông tin mở rộng</h3>
          <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
            <ul className="list-disc ml-6 text-gray-700 leading-relaxed">
              <li>Quá trình công tác</li>
              <li>Hợp đồng lao động</li>
              <li>Khen thưởng - Kỷ luật</li>
              <li>Đánh giá cuối năm</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrincipalEmployeeDetail;
