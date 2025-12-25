import React, { useState } from "react";
import {
  Download,
  Filter,
  Users,
  FileSpreadsheet,
  FileBarChart,
} from "lucide-react";

import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";

const FacultyReport = () => {
  // =============================
  // FILTER STATES
  // =============================
  const [filter, setFilter] = useState({
    timeType: "month",
    month: "1",
    year: "2025",
    faculty: "all",
  });

  // =============================
  // DUMMY DATA
  // =============================
  const pieData = [
    { name: "CSDL", value: 12 },
    { name: "Mạng", value: 10 },
    { name: "Phần mềm", value: 8 },
    { name: "Hệ thống", value: 12 },
  ];

  const COLORS = ["#4F46E5", "#22C55E", "#FACC15", "#FB923C"];

  const lineData = [
    { month: "T1", value: 38 },
    { month: "T2", value: 39 },
    { month: "T3", value: 41 },
    { month: "T4", value: 42 },
  ];

  const teacherTable = [
    { id: 1, name: "Nguyễn Văn A", level: "Thạc sĩ", subject: "CSDL" },
    { id: 2, name: "Trần Thị B", level: "Tiến sĩ", subject: "Hệ thống" },
    { id: 3, name: "Lê Văn C", level: "Thạc sĩ", subject: "Mạng" },
  ];

  // =============================
  // EXPORT ACTION
  // =============================
  const exportReport = () => {
    alert("Xuất báo cáo PDF / Excel (tính năng mẫu)");
  };

  // =============================
  // UI
  // =============================
  return (
    <div className="p-8">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Báo cáo nhân sự khoa
          </h1>
          <p className="text-gray-500 mt-1">
            Tổng quan tình hình nhân sự · Phân tích · Trích xuất báo cáo
          </p>
        </div>

        <button
          onClick={exportReport}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
        >
          <Download size={18} />
          Xuất báo cáo
        </button>
      </div>

      {/* FILTER PANEL */}
      <div className="bg-white p-5 rounded-xl shadow mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Filter size={20} className="text-blue-600" />
          <h2 className="font-semibold text-lg">Bộ lọc báo cáo</h2>
        </div>

        <div className="grid grid-cols-4 gap-6">
          {/* TIME TYPE */}
          <div>
            <label className="text-sm text-gray-500">Loại thời gian</label>
            <select
              className="w-full border p-2 rounded mt-1"
              value={filter.timeType}
              onChange={(e) =>
                setFilter({ ...filter, timeType: e.target.value })
              }
            >
              <option value="month">Theo tháng</option>
              <option value="quarter">Theo quý</option>
              <option value="year">Theo năm</option>
            </select>
          </div>

          {/* MONTH */}
          {filter.timeType === "month" && (
            <div>
              <label className="text-sm text-gray-500">Tháng</label>
              <select
                className="w-full border p-2 rounded mt-1"
                value={filter.month}
                onChange={(e) =>
                  setFilter({ ...filter, month: e.target.value })
                }
              >
                {Array.from({ length: 12 }).map((_, i) => (
                  <option key={i + 1}>{i + 1}</option>
                ))}
              </select>
            </div>
          )}

          {/* QUARTER */}
          {filter.timeType === "quarter" && (
            <div>
              <label className="text-sm text-gray-500">Quý</label>
              <select className="w-full border p-2 rounded mt-1">
                <option>Quý 1</option>
                <option>Quý 2</option>
                <option>Quý 3</option>
                <option>Quý 4</option>
              </select>
            </div>
          )}

          {/* YEAR */}
          <div>
            <label className="text-sm text-gray-500">Năm</label>
            <select
              className="w-full border p-2 rounded mt-1"
              value={filter.year}
              onChange={(e) =>
                setFilter({ ...filter, year: e.target.value })
              }
            >
              <option>2024</option>
              <option>2025</option>
              <option>2026</option>
            </select>
          </div>

          {/* BỘ MÔN */}
          <div>
            <label className="text-sm text-gray-500">Bộ môn</label>
            <select
              className="w-full border p-2 rounded mt-1"
              value={filter.faculty}
              onChange={(e) =>
                setFilter({ ...filter, faculty: e.target.value })
              }
            >
              <option value="all">Tất cả</option>
              <option value="csdl">CSDL</option>
              <option value="mang">Mạng</option>
              <option value="pm">Phần mềm</option>
              <option value="ht">Hệ thống</option>
            </select>
          </div>
        </div>
      </div>

      {/* SEPARATOR */}
      <hr className="my-6" />

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-3 gap-6 mb-10">

        {/* PIE */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-semibold mb-4">Cơ cấu giảng viên theo bộ môn</h3>

          <PieChart width={260} height={260}>
            <Pie data={pieData} outerRadius={100} dataKey="value">
              {pieData.map((entry, i) => (
                <Cell key={i} fill={COLORS[i]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>

        {/* BAR */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-semibold mb-4">Biến động nhân sự theo năm</h3>

          <LineChart width={300} height={260} data={lineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#4F46E5" />
          </LineChart>
        </div>

        {/* INFO CARD */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-semibold mb-4">Tổng quan nhanh</h3>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Users className="text-indigo-600" size={36} />
              <div>
                <p className="text-gray-500 text-sm">Tổng giảng viên</p>
                <p className="text-xl font-bold">42</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <FileBarChart className="text-green-600" size={36} />
              <div>
                <p className="text-gray-500 text-sm">Tăng trưởng</p>
                <p className="text-xl font-bold">+3 / tháng</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <FileSpreadsheet className="text-yellow-600" size={36} />
              <div>
                <p className="text-gray-500 text-sm">Báo cáo cần nộp</p>
                <p className="text-xl font-bold">4 tài liệu</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="font-semibold mb-4 text-lg">
          Danh sách nhân sự theo bộ lọc
        </h3>

        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="p-3">Họ tên</th>
              <th className="p-3">Trình độ</th>
              <th className="p-3">Bộ môn</th>
            </tr>
          </thead>

          <tbody>
            {teacherTable.map((t) => (
              <tr key={t.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{t.name}</td>
                <td className="p-3">{t.level}</td>
                <td className="p-3">{t.subject}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FacultyReport;
