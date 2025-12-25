import React, { useState } from "react";
import { Card, CardContent } from "../components/Card";
import {
  Users,
  Building2,
  Briefcase,
  BarChart3,
  Bell,
  Settings,
  Calendar,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const Dashboard = () => {
  const username = localStorage.getItem("username") || "Quản trị viên";
  const [selectedYear, setSelectedYear] = useState("2025");

  const mainColor = "#009FE3";

  const dataByYear = {
    "2023": [
      { month: "T1", employees: 55 },
      { month: "T2", employees: 70 },
      { month: "T3", employees: 65 },
      { month: "T4", employees: 75 },
      { month: "T5", employees: 85 },
      { month: "T6", employees: 90 },
      { month: "T7", employees: 80 },
      { month: "T8", employees: 95 },
      { month: "T9", employees: 88 },
      { month: "T10", employees: 68 },
      { month: "T11", employees: 60 },
      { month: "T12", employees: 50 },
    ],
    "2024": [
      { month: "T1", employees: 60 },
      { month: "T2", employees: 75 },
      { month: "T3", employees: 65 },
      { month: "T4", employees: 80 },
      { month: "T5", employees: 90 },
      { month: "T6", employees: 110 },
      { month: "T7", employees: 85 },
      { month: "T8", employees: 100 },
      { month: "T9", employees: 95 },
      { month: "T10", employees: 70 },
      { month: "T11", employees: 60 },
      { month: "T12", employees: 55 },
    ],
    "2025": [
      { month: "T1", employees: 65 },
      { month: "T2", employees: 80 },
      { month: "T3", employees: 75 },
      { month: "T4", employees: 85 },
      { month: "T5", employees: 100 },
      { month: "T6", employees: 120 },
      { month: "T7", employees: 95 },
      { month: "T8", employees: 110 },
      { month: "T9", employees: 105 },
      { month: "T10", employees: 85 },
      { month: "T11", employees: 75 },
      { month: "T12", employees: 65 },
    ],
  };

  const chartData = dataByYear[selectedYear];

  const notifications = [
    { title: "Nhắc nhở cuộc họp", desc: "Cuộc họp với phòng IT lúc 14:00 hôm nay.", color: "bg-blue-500" },
    { title: "Thông báo nghỉ lễ", desc: "Văn phòng sẽ nghỉ vào thứ Sáu, ngày 7 tháng 4.", color: "bg-green-500" },
    { title: "Nhân viên mới", desc: "Nguyễn Văn An đã gia nhập công ty.", color: "bg-yellow-500" },
    { title: "Cập nhật chính sách", desc: "Vui lòng xem lại tài liệu chính sách nhân sự mới nhất.", color: "bg-purple-500" },
  ];

  return (
    <div className="space-y-8 p-6 bg-gray-50 min-h-screen">
      {/* Tiêu đề */}
      <h1 className="text-2xl font-bold text-gray-800">
        👋 Xin chào, <span style={{ color: mainColor }}>{username}</span>! Đây là trang quản trị.
      </h1>

      {/* Thống kê nhanh */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-md hover:shadow-lg transition">
          <CardContent className="flex items-center space-x-4 p-6">
            <div className="bg-[#D0E9F9] p-3 rounded-full">
              <Users size={28} style={{ color: mainColor }} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Tổng số người dùng</p>
              <p className="text-2xl font-semibold text-gray-800">125</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition">
          <CardContent className="flex items-center space-x-4 p-6">
            <div className="bg-green-100 p-3 rounded-full">
              <Building2 className="text-green-600" size={28} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Tổng số khoa</p>
              <p className="text-2xl font-semibold text-gray-800">8</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition">
          <CardContent className="flex items-center space-x-4 p-6">
            <div className="bg-yellow-100 p-3 rounded-full">
              <Briefcase className="text-yellow-600" size={28} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Tổng số phòng ban</p>
              <p className="text-2xl font-semibold text-gray-800">15</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition">
          <CardContent className="flex items-center space-x-4 p-6">
            <div className="bg-red-100 p-3 rounded-full">
              <BarChart3 className="text-red-600" size={28} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Chức danh</p>
              <p className="text-2xl font-semibold text-gray-800">12</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Biểu đồ thống kê */}
      <Card className="shadow-md">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-700">
              Thống kê số lượng nhân viên theo tháng
            </h2>
            <div className="flex items-center gap-2">
              <Calendar className="text-gray-500 w-4 h-4" />
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="border border-gray-300 rounded-lg text-sm px-3 py-1 focus:outline-none"
                style={{ borderColor: mainColor, boxShadow: `0 0 0 2px ${mainColor}33` }}
              >
                <option value="2023">Năm 2023</option>
                <option value="2024">Năm 2024</option>
                <option value="2025">Năm 2025</option>
              </select>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" />
              <Tooltip />
              <Bar dataKey="employees" fill={mainColor} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Hoạt động và cấu hình */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-md">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <Bell className="mr-2" style={{ color: mainColor }} /> Hoạt động gần đây
            </h2>
            <ul className="space-y-3 text-gray-700">
              <li>📅 Nhân viên Nguyễn Văn A vừa được thêm vào phòng Kế Toán.</li>
              <li>🧾 Báo cáo tháng 10 đã được tạo.</li>
              <li>👥 Phòng IT đã bổ sung 2 nhân sự mới.</li>
              <li>🏆 Khen thưởng nhân viên xuất sắc quý III.</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <Settings className="mr-2 text-green-600" /> Cấu hình hệ thống
            </h2>
            <p className="text-gray-700">
              Quản trị viên có thể thay đổi cài đặt chung, quản lý người dùng và phân quyền truy cập tại đây.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Thông báo gần đây */}
      <Card className="shadow-md">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-5 h-5" style={{ color: mainColor }} />
            <h2 className="font-semibold text-gray-700 text-lg">Thông báo gần đây</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {notifications.map((note, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition"
              >
                <span className={`mt-1 w-3 h-3 ${note.color} rounded-full`}></span>
                <div>
                  <p className="font-semibold text-gray-800">{note.title}</p>
                  <p className="text-gray-500 text-sm">{note.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
