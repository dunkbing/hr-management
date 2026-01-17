import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FileText,
  Download,
  Users,
  UserCheck,
  UserMinus,
  TrendingUp,
  PieChart as PieIcon,
  BarChart as BarIcon,
  Loader2,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  CartesianGrid,
} from "recharts";

const Reports = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const mainColor = "#009FE3";
  const token = localStorage.getItem("token");

  const COLORS = [mainColor, "#10B981", "#F59E0B", "#8B5CF6", "#EC4899", "#3B82F6", "#F43F5E"];

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/reports/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(res.data);
    } catch (err) {
      console.error("Failed to fetch report stats", err);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const response = await axios.get("http://localhost:8080/api/reports/export", {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Bao_cao_nhan_su_${new Date().toLocaleDateString()}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Export failed", err);
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <Loader2 className="w-12 h-12 text-[#009FE3] animate-spin" />
        <p className="text-gray-500 font-medium">Đang chuẩn bị dữ liệu báo cáo...</p>
      </div>
    );
  }

  const summaryCards = [
    { title: "Tổng nhân sự", value: stats?.totalEmployees, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Đang làm việc", value: stats?.activeEmployees, icon: UserCheck, color: "text-emerald-600", bg: "bg-emerald-50" },
    { title: "Đã nghỉ việc", value: stats?.inactiveEmployees, icon: UserMinus, color: "text-rose-600", bg: "bg-rose-50" },
    { title: "Tỷ lệ hoạt động", value: stats?.totalEmployees ? `${Math.round((stats.activeEmployees / stats.totalEmployees) * 100)}%` : "0%", icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-50" },
  ];

  return (
    <div className="p-6 lg:p-10 bg-[#F8FAFC] min-h-screen space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <FileText className="w-8 h-8 text-[#009FE3]" />
            Báo cáo & Thống kê chuyên sâu
          </h1>
          <p className="text-gray-500 mt-1 font-medium">Phân tích dữ liệu nhân sự thời gian thực</p>
        </div>
        <button
          onClick={handleExport}
          disabled={exporting}
          className="flex items-center gap-2 bg-[#009FE3] hover:bg-[#009FE3] text-white px-6 py-3 rounded-2xl shadow-lg shadow-blue-200 transition-all font-semibold disabled:opacity-50"
        >
          {exporting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
          Xuất báo cáo Excel
        </button>
      </div>

      {/* Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryCards.map((card, idx) => (
          <div key={idx} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 ring-1 ring-slate-900/5">
            <div className={`${card.bg} ${card.color} w-12 h-12 flex items-center justify-center rounded-2xl mb-4`}>
              <card.icon className="w-6 h-6" />
            </div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{card.title}</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gender Distribution */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center">
          <div className="flex items-center gap-3 self-start mb-6">
            <PieIcon className="w-5 h-5 text-gray-400" />
            <h2 className="text-lg font-bold text-gray-800">Cơ cấu giới tính</h2>
          </div>
          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats?.genderDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats?.genderDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <BarIcon className="w-5 h-5 text-gray-400" />
            <h2 className="text-lg font-bold text-gray-800">Trạng thái công tác</h2>
          </div>
          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.statusDistribution}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                <Tooltip
                  cursor={{ fill: '#F8FAFC' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" fill={mainColor} radius={[8, 8, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Education Level */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col lg:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-5 h-5 text-gray-400" />
            <h2 className="text-lg font-bold text-gray-800">Phân loại theo trình độ đào tạo</h2>
          </div>
          <div className="w-full h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.educationDistribution} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                <XAxis type="number" axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={150} tick={{ fill: '#1E293B', fontWeight: 500 }} />
                <Tooltip
                  cursor={{ fill: '#F8FAFC' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" fill="#8B5CF6" radius={[0, 8, 8, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
