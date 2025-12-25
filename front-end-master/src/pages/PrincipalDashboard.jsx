// src/pages/PrincipalDashboard.jsx
import React from "react";
import { Card, CardContent } from "../components/Card";
import { Users, Building2, BarChart3, Bell, CheckCircle } from "lucide-react";
import { BarChart, Bar, Tooltip, ResponsiveContainer, CartesianGrid, XAxis, YAxis } from "recharts";

const PrincipalDashboard = () => {
  const mainColor = "#009FE3";

  const barDataFaculty = [
    { khoa: "CNTT", nhanSu: 45 },
    { khoa: "Kinh tế", nhanSu: 38 },
    { khoa: "Xây dựng", nhanSu: 30 },
    { khoa: "Ngoại ngữ", nhanSu: 25 },
    { khoa: "Kiến trúc", nhanSu: 50 },
    { khoa: "QTKD", nhanSu: 18 },
    { khoa: "Điện tử", nhanSu: 50 },
  ];

  const barDataDepartment = [
    { phong: "Phòng TCHC", nhanSu: 32 },
    { phong: "Phòng Đào tạo", nhanSu: 14 },
    { phong: "Phòng Kế toán", nhanSu: 10 },
    { phong: "Phòng IT", nhanSu: 18 },
    { phong: "Phòng Thư viện", nhanSu: 12 },
  ];

  const barColor = "#5BB0FF"; // Xanh dương nhạt đậm hơn một chút

  const pendingApprovals = [
    { name: "Lê Minh Đức", type: "Điều chuyển", faculty: "CNTT", date: "29/10/2025" },
    { name: "Nguyễn Thu Hằng", type: "Nghỉ việc", faculty: "Kinh tế", date: "30/10/2025" },
  ];

  const activityLogs = [
    "Admin cập nhật hồ sơ Nguyễn Văn A – 31/10/2025",
    "Trưởng khoa CNTT gửi đề xuất điều chuyển – 30/10/2025",
    "Hiệu trưởng phê duyệt đề xuất nghỉ việc – 29/10/2025",
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold" style={{ color: mainColor }}>
        Dashboard Hiệu trưởng
      </h1>

      {/* Thống kê tổng quan */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-md">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="bg-[#D0E9F9] p-3 rounded-full">
              <Users size={28} style={{ color: mainColor }} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Tổng nhân sự</p>
              <p className="text-2xl font-semibold">256</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-full">
              <Building2 size={28} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Tổng khoa/phòng</p>
              <p className="text-2xl font-semibold">10</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="bg-yellow-100 p-3 rounded-full">
              <BarChart3 size={28} className="text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Đề xuất chờ phê duyệt</p>
              <p className="text-2xl font-semibold">5</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <CheckCircle size={28} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Đã phê duyệt tháng này</p>
              <p className="text-2xl font-semibold">12</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Biểu đồ cột */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Nhân sự theo khoa */}
        <Card className="shadow-md">
          <CardContent className="p-4">
            <h2 className="font-semibold text-gray-700 mb-2">Số nhân sự theo khoa</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={barDataFaculty}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="khoa" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="nhanSu" radius={[6, 6, 0, 0]} fill={barColor} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Nhân sự theo phòng ban */}
        <Card className="shadow-md">
          <CardContent className="p-4">
            <h2 className="font-semibold text-gray-700 mb-2">Số nhân sự theo phòng ban</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={barDataDepartment}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="phong" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="nhanSu" radius={[6, 6, 0, 0]} fill={barColor} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Đề xuất cần phê duyệt */}
      <Card className="shadow-md">
        <CardContent className="p-4">
          <h2 className="font-semibold text-gray-700 mb-2">Đề xuất cần phê duyệt</h2>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border-b p-2">Nhân sự</th>
                <th className="border-b p-2">Loại đề xuất</th>
                <th className="border-b p-2">Khoa</th>
                <th className="border-b p-2">Ngày gửi</th>
                <th className="border-b p-2">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {pendingApprovals.map((item, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="p-2">{item.name}</td>
                  <td className="p-2">{item.type}</td>
                  <td className="p-2">{item.faculty}</td>
                  <td className="p-2">{item.date}</td>
                  <td className="p-2 flex gap-3">
                    <button className="text-green-600 flex items-center gap-1 font-semibold">
                      <CheckCircle size={16} /> Duyệt
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Nhật ký hoạt động */}
      <Card className="shadow-md">
        <CardContent className="p-4">
          <h2 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <Bell size={16} style={{ color: mainColor }} /> Nhật ký hoạt động
          </h2>
          <ul className="list-disc list-inside text-gray-700">
            {activityLogs.map((log, i) => (
              <li key={i}>{log}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrincipalDashboard;
