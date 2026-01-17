import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Users,
  School,
  Network,
  Bell,
  CheckCircle,
  LayoutDashboard,
  Calendar,
  Search,
} from "lucide-react";
import {
  BarChart,
  Bar,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Cell,
} from "recharts";

const PrincipalDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalFaculties: 0,
    totalDepartments: 0,
    totalPositions: 0,
    monthlyGrowth: [],
  });
  const [loading, setLoading] = useState(true);
  const mainColor = "#009FE3";
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/dashboard/stats", {
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#009FE3]"></div>
      </div>
    );
  }

  const statCards = [
    { title: "Tổng nhân sự toàn trường", value: stats.totalUsers, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Số lượng Khoa", value: stats.totalFaculties, icon: School, color: "text-emerald-600", bg: "bg-emerald-50" },
    { title: "Phòng ban / Đơn vị", value: stats.totalDepartments, icon: Network, color: "text-orange-600", bg: "bg-orange-50" },
    { title: "Đề xuất chờ duyệt", value: 5, icon: Bell, color: "text-purple-600", bg: "bg-purple-50" },
  ];

  return (
    <div className="p-6 lg:p-10 bg-[#F8FAFC] min-h-screen space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 flex items-center gap-3">
            <LayoutDashboard className="w-8 h-8 text-[#009FE3]" />
            Bảng Điều Khiển Ban Giám Hiệu
          </h1>
          <p className="text-gray-500 mt-1 font-medium">Hệ thống quản lý nhân sự - Đại học Kiến trúc Hà Nội</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
          <Calendar className="w-5 h-5 text-slate-400" />
          <span className="text-sm font-semibold text-slate-600">
            {new Date().toLocaleDateString("vi-VN", { day: "2-digit", month: "long", year: "numeric" })}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => (
          <div key={idx} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl transition-all">
            <div className={`${card.bg} ${card.color} w-12 h-12 flex items-center justify-center rounded-2xl mb-4`}>
              <card.icon className="w-6 h-6" />
            </div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">{card.title}</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Tình hình nhân sự (6 tháng gần đây)</h2>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.monthlyGrowth}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#94A3B8", fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94A3B8", fontSize: 12 }} />
                <Tooltip cursor={{ fill: "#F8FAFC" }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="count" fill="#009FE3" radius={[10, 10, 0, 0]} barSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Approvals (Simplified) */}
        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-800 tracking-tight">Cần phê duyệt</h2>
            <span className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-bold">5 MỚI</span>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-[#009FE3] transition-colors cursor-pointer">
                <div className="flex justify-between items-start mb-2">
                  <p className="font-bold text-slate-800 text-sm">Đề xuất bổ sung giảng viên</p>
                  <span className="text-[10px] font-bold text-slate-400">Hôm nay</span>
                </div>
                <p className="text-xs text-slate-500 mb-3">Khoa Kiến trúc - Tăng cường nhân lực HK2</p>
                <div className="flex gap-2">
                  <button className="flex-1 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors">Chi tiết</button>
                  <button className="flex-1 py-2 bg-[#009FE3] text-white rounded-xl text-xs font-bold hover:bg-[#009FE3] transition-colors">Duyệt nhanh</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrincipalDashboard;
