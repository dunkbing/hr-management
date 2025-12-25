// src/pages/FacultyDashboard.jsx
import React from "react";
import { Card, CardContent } from "../components/Card";
import {
  Users,
  FilePlus2,
  ClipboardList,
  CheckCircle2,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const FacultyDashboard = () => {
  const mainColor = "#009FE3";

  const stats = [
    { icon: Users, label: "Tổng nhân sự khoa tôi", value: 32, bg: "bg-blue-100" },
    { icon: FilePlus2, label: "Đề xuất đã gửi", value: 4, bg: "bg-yellow-100" },
    { icon: ClipboardList, label: "Đang chờ duyệt", value: 2, bg: "bg-orange-100" },
    { icon: CheckCircle2, label: "Đã được phê duyệt", value: 1, bg: "bg-green-100" },
  ];

  const chartBar = [
    { role: "Giảng viên", count: 18 },
    { role: "Trợ giảng", count: 6 },
    { role: "Nghiên cứu viên", count: 5 },
    { role: "Khác", count: 3 },
  ];

  const chartLine = [
    { month: "T6", staff: 29 },
    { month: "T7", staff: 30 },
    { month: "T8", staff: 32 },
    { month: "T9", staff: 31 },
    { month: "T10", staff: 32 },
    { month: "T11", staff: 32 },
  ];

  const recentProposals = [
    {
      type: "Thêm nhân sự",
      date: "25/10/2025",
      status: "Đang chờ duyệt",
      note: "Bổ sung giảng viên mới",
      color: "text-orange-500",
    },
    {
      type: "Cập nhật chức vụ",
      date: "27/10/2025",
      status: "Đã duyệt",
      note: "Thăng chức GV chính",
      color: "text-green-600",
    },
  ];

  return (
    <div className="space-y-8 p-6 bg-gray-50 min-h-screen">

      <h1 className="text-2xl font-bold text-gray-800">
        👋 Xin chào, <span style={{ color: mainColor }}>Trưởng khoa</span>
      </h1>

      {/* QUICK STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item, i) => {
          const Icon = item.icon;
          return (
            <Card key={i} className="shadow-md hover:shadow-lg transition">
              <CardContent className="flex items-center space-x-4 p-6">
                <div className={`${item.bg} p-3 rounded-full`}>
                  <Icon size={28} style={{ color: mainColor }} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{item.label}</p>
                  <p className="text-2xl font-semibold">{item.value}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-md">
          <CardContent className="p-6">
            <h2 className="font-semibold mb-4">Phân bố nhân sự theo chức vụ</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartBar}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="role" />
                <Tooltip />
                <Bar dataKey="count" fill={mainColor} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardContent className="p-6">
            <h2 className="font-semibold mb-4">Biến động nhân sự 6 tháng</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartLine}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <Tooltip />
                <Line type="monotone" dataKey="staff" stroke={mainColor} strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* RECENT PROPOSALS */}
      <Card className="shadow-md">
        <CardContent className="p-6">
          <h2 className="font-semibold text-lg mb-4">Đề xuất gần nhất</h2>

          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="p-3 text-left">Loại đề xuất</th>
                <th className="p-3 text-left">Ngày gửi</th>
                <th className="p-3 text-left">Trạng thái</th>
                <th className="p-3 text-left">Ghi chú</th>
              </tr>
            </thead>

            <tbody>
              {recentProposals.map((item, i) => (
                <tr key={i} className="border-b hover:bg-gray-50">
                  <td className="p-3">{item.type}</td>
                  <td className="p-3">{item.date}</td>
                  <td className={`p-3 font-semibold ${item.color}`}>{item.status}</td>
                  <td className="p-3">{item.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

    </div>
  );
};

export default FacultyDashboard;
