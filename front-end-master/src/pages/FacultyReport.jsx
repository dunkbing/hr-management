import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Download,
  Users,
  GraduationCap,
  Briefcase,
  PieChart as PieIcon,
  BarChart as BarIcon,
  Loader2,
  TrendingUp,
  Activity
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
  ResponsiveContainer,
  CartesianGrid,
  Legend
} from "recharts";

const FacultyReport = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const mainColor = "#009FE3";
  const token = localStorage.getItem("token");

  const COLORS = ["#009FE3", "#10B981", "#8B5CF6", "#F59E0B", "#EC4899"];

  useEffect(() => {
    const fetchFacultyStats = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/reports/faculty-stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch faculty stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFacultyStats();
  }, [token]);

  const handleExport = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/reports/export", {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Bao_cao_nhan_su_khoa_${new Date().toLocaleDateString()}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Export failed", err);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-10 h-10 text-[#009FE3] animate-spin" />
        <p className="text-gray-500 font-medium">Đang chuẩn bị báo cáo khoa...</p>
      </div>
    );
  }

  const summaryCards = [
    { title: "Tổng nhân sự khoa", value: stats?.totalEmployees, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Giảng viên cơ hữu", value: stats?.activeEmployees, icon: Activity, color: "text-emerald-600", bg: "bg-emerald-50" },
    { title: "Trình độ cao nhất", value: stats?.educationDistribution?.[0]?.name || "Chưa xác định", icon: GraduationCap, color: "text-purple-600", bg: "bg-purple-50" },
    { title: "Hiệu suất công việc", value: "95%", icon: TrendingUp, color: "text-orange-600", bg: "bg-orange-50" },
  ];

  return (
    <div className="p-6 lg:p-10 bg-[#F8FAFC] min-h-screen space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <BarIcon className="w-8 h-8 text-[#009FE3]" />
            Báo cáo Phân tích Nhân sự Khoa
          </h1>
          <p className="text-gray-500 mt-1 font-medium">Báo cáo chi tiết về cơ cấu và chất lượng đội ngũ giảng viên</p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 bg-[#009FE3] hover:bg-[#0087c2] text-white px-6 py-3 rounded-2xl shadow-lg transition-all font-semibold"
        >
          <Download className="w-5 h-5" />
          Xuất dữ liệu khoa
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryCards.map((card, idx) => (
          <div key={idx} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <div className={`${card.bg} ${card.color} w-12 h-12 flex items-center justify-center rounded-2xl mb-4`}>
              <card.icon className="w-6 h-6" />
            </div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{card.title}</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center">
          <div className="flex items-center gap-3 self-start mb-6">
            <PieIcon className="w-5 h-5 text-gray-400" />
            <h2 className="text-lg font-bold text-gray-800">Cơ cấu trình độ giảng viên</h2>
          </div>
          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats?.educationDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats?.educationDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <Activity className="w-5 h-5 text-gray-400" />
            <h2 className="text-lg font-bold text-gray-800">Trạng thái làm việc</h2>
          </div>
          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.statusDistribution}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="value" fill={mainColor} radius={[8, 8, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyReport;
