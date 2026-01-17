import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent } from "../components/Card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
  Legend,
  PieChart,
  Pie
} from "recharts";
import { FileText, Download, Users, Briefcase, GraduationCap, TrendingUp, Loader2 } from "lucide-react";

const PrincipalReports = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const mainColor = "#009FE3";
  const token = localStorage.getItem("token");

  const COLORS = ["#009FE3", "#10B981", "#F59E0B", "#8B5CF6", "#EC4899"];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/reports/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch principal stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
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
      link.setAttribute("download", `Bao_cao_tong_hop_${new Date().toLocaleDateString()}.xlsx`);
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
        <p className="text-gray-500 font-medium">Đang tải dữ liệu báo cáo...</p>
      </div>
    );
  }

  const topCards = [
    { label: "Tổng nhân sự toàn trường", value: stats?.totalEmployees, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Đang hoạt động", value: stats?.activeEmployees, icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Cơ cấu Khoa", value: stats?.facultyDistribution?.length || 0, icon: Briefcase, color: "text-orange-600", bg: "bg-orange-50" },
    { label: "Trình độ cao nhất", value: stats?.educationDistribution?.[0]?.name || "N/A", icon: GraduationCap, color: "text-purple-600", bg: "bg-purple-50" },
  ];

  return (
    <div className="p-6 lg:p-10 space-y-8 animate-in fade-in duration-500 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <FileText className="w-8 h-8 text-[#009FE3]" />
            Báo cáo Tổng hợp Toàn trường
          </h1>
          <p className="text-gray-500 mt-1">Dữ liệu thống kê nhân sự đồng bộ từ các khoa và phòng ban</p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 bg-[#009FE3] hover:bg-[#009FE3] text-white px-5 py-2.5 rounded-xl shadow-md transition-all font-semibold"
        >
          <Download className="w-5 h-5" />
          Tải báo cáo Excel
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {topCards.map((card, idx) => (
          <div key={idx} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className={`${card.bg} ${card.color} w-12 h-12 flex items-center justify-center rounded-2xl shrink-0`}>
              <card.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{card.label}</p>
              <p className="text-2xl font-bold text-gray-800">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-[#009FE3]" />
            Phân bổ nhân sự theo Khoa
          </h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.facultyDistribution}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" fill={mainColor} radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-purple-500" />
            Cơ cấu Trình độ chuyên môn
          </h2>
          <div className="h-[300px]">
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
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrincipalReports;
