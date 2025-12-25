// src/pages/PrincipalReports.jsx
import React from "react";
import { Card, CardContent } from "../components/Card";

const PrincipalReports = () => {
  const mainColor = "#009FE3";

  const stats = [
    { label: "Tổng số nhân sự", value: 523 },
    { label: "Nhân sự mới trong tháng", value: 12 },
    { label: "Đề xuất gửi lên hiệu trưởng", value: 8 },
    { label: "Nhân sự nghỉ việc trong tháng", value: 3 },
  ];

  const latestRequests = [
    { name: "Lê Quốc Huy", type: "Điều chuyển", faculty: "CNTT", date: "12/11/2025" },
    { name: "Nguyễn Thu Hà", type: "Nghỉ việc", faculty: "Kinh tế", date: "10/11/2025" },
    { name: "Phạm Hữu Nam", type: "Xin thăng chức", faculty: "Kiến trúc", date: "08/11/2025" },
    { name: "Vũ Ngọc Nhật", type: "Điều chuyển", faculty: "Xây dựng", date: "05/11/2025" },
    { name: "Trần Thị Thủy", type: "Nghỉ thai sản", faculty: "Quản lý đô thị", date: "04/11/2025" },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* TITLE */}
      <h1 className="text-2xl font-bold" style={{ color: mainColor }}>
        Báo cáo tổng hợp
      </h1>

      {/* TOP STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((item, i) => (
          <Card key={i} className="shadow-md border-l-4" style={{ borderColor: mainColor }}>
            <CardContent>
              <p className="text-gray-600">{item.label}</p>
              <p className="text-2xl font-bold mt-1" style={{ color: mainColor }}>
                {item.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* TWO MOCK CHARTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow">
          <CardContent>
            <h2 className="font-semibold mb-3">Nhân sự theo khoa</h2>
            <div className="h-40 bg-gray-200 rounded flex items-center justify-center text-gray-500">
              (Biểu đồ cột)
            </div>
          </CardContent>
        </Card>

        <Card className="shadow">
          <CardContent>
            <h2 className="font-semibold mb-3">Tăng trưởng nhân sự theo tháng</h2>
            <div className="h-40 bg-gray-200 rounded flex items-center justify-center text-gray-500">
              (Biểu đồ đường)
            </div>
          </CardContent>
        </Card>
      </div>

      {/* LATEST REQUESTS TABLE */}
      <Card className="shadow">
        <CardContent>
          <h2 className="font-semibold mb-3">5 đề xuất gần nhất</h2>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border-b p-2">Nhân sự</th>
                <th className="border-b p-2">Loại</th>
                <th className="border-b p-2">Khoa</th>
                <th className="border-b p-2">Ngày</th>
              </tr>
            </thead>
            <tbody>
              {latestRequests.map((item, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="p-2">{item.name}</td>
                  <td className="p-2">{item.type}</td>
                  <td className="p-2">{item.faculty}</td>
                  <td className="p-2">{item.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrincipalReports;
