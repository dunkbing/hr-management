import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  CartesianGrid,
} from "recharts";
import { FileText } from "lucide-react";

const Reports = () => {
  const mainColor = "#009FE3"; // Màu chính
  const [year, setYear] = useState(2024);
  const [month, setMonth] = useState("Tất cả");

  // Dữ liệu biểu đồ cột: số lượng nhân viên theo phòng ban
  const departmentData = [
    { department: "Phòng IT", employees: 25 },
    { department: "Phòng Hành chính", employees: 30 },
    { department: "Phòng Kế toán", employees: 18 },
    { department: "Phòng Nhân sự", employees: 22 },
    { department: "Phòng Kỹ thuật", employees: 28 },
  ];

  // Dữ liệu biểu đồ tròn: giới tính
  const genderData = [
    { name: "Nam", value: 70 },
    { name: "Nữ", value: 50 },
  ];

  const COLORS = [mainColor, "#F472B6"];

  return (
    <div className="space-y-8 p-6 bg-gray-50 min-h-screen">
      {/* Tiêu đề */}
      <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
        <FileText className={`text-[${mainColor}] w-6 h-6`} />
        Báo cáo & Thống kê nhân sự
      </h1>

      {/* Bộ lọc */}
      <div className="flex flex-wrap gap-4 bg-white p-4 rounded-2xl shadow-sm">
        <div>
          <label className="text-sm font-medium text-gray-600">Chọn năm</label>
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className={`ml-2 border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-[${mainColor}] focus:outline-none`}
          >
            {[2022, 2023, 2024, 2025].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600">Chọn tháng</label>
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className={`ml-2 border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-[${mainColor}] focus:outline-none`}
          >
            <option>Tất cả</option>
            {Array.from({ length: 12 }, (_, i) => `Tháng ${i + 1}`).map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Biểu đồ thống kê nhân viên theo phòng ban */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="font-semibold text-gray-700 mb-4">
          Thống kê số lượng nhân viên theo phòng ban
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={departmentData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="department" />
            <Tooltip />
            <Bar dataKey="employees" fill={mainColor} radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Biểu đồ tròn giới tính */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="font-semibold text-gray-700 mb-4">
          Tỷ lệ giới tính trong công ty
        </h2>
        <div className="flex justify-center">
          <ResponsiveContainer width="60%" height={250}>
            <PieChart>
              <Pie
                data={genderData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {genderData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bảng tổng hợp */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="font-semibold text-gray-700 mb-4">Tổng hợp nhanh</h2>
        <table className="w-full text-sm border-t border-gray-200">
          <thead>
            <tr className="bg-gray-50 text-gray-600">
              <th className="text-left py-2 px-3">Phòng ban</th>
              <th className="text-left py-2 px-3">Số nhân viên</th>
              <th className="text-left py-2 px-3">Giới tính nam</th>
              <th className="text-left py-2 px-3">Giới tính nữ</th>
            </tr>
          </thead>
          <tbody>
            {departmentData.map((d, i) => (
              <tr key={i} className="border-t">
                <td className="py-2 px-3">{d.department}</td>
                <td className="py-2 px-3">{d.employees}</td>
                <td className="py-2 px-3">{Math.floor(d.employees * 0.6)}</td>
                <td className="py-2 px-3">{Math.ceil(d.employees * 0.4)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reports;
