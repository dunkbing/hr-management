import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Users,
  FilePlus2,
  ClipboardList,
  CheckCircle2,
  Calendar,
  School,
  Clock,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";

const FacultyDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalFaculties: 1,
    totalDepartments: 0,
    totalPositions: 0,
    monthlyGrowth: [],
    recentUsers: [],
  });
  const [loading, setLoading] = useState(true);
  const mainColor = "#009FE3";
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username") || "Trưởng khoa";

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/dashboard/faculty-stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch faculty stats", err);
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
    {
      title: "Nhân sự của Khoa",
      value: stats.totalUsers,
      icon: Users,
      color: "from-blue-500 to-blue-600",
      lightColor: "bg-blue-50",
    },
    {
      title: "Đề xuất đã gửi",
      value: 0, // Mock pending real data
      icon: FilePlus2,
      color: "from-emerald-500 to-emerald-600",
      lightColor: "bg-emerald-50",
    },
    {
      title: "Đang chờ duyệt",
      value: 0, // Mock pending real data
      icon: ClipboardList,
      color: "from-orange-500 to-orange-600",
      lightColor: "bg-orange-50",
    },
    {
      title: "Đã phê duyệt",
      value: 0, // Mock pending real data
      icon: CheckCircle2,
      color: "from-purple-500 to-purple-600",
      lightColor: "bg-purple-50",
    },
  ];

  return (
    <div className="p-6 lg:p-10 bg-[#F8FAFC] min-h-screen space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 flex items-center gap-3">
            <School className="w-8 h-8 text-[#009FE3]" />
            Dashboard Khoa
          </h1>
          <p className="text-gray-500 mt-1 font-medium">
            👋 Xin chào, <span className="text-[#009FE3] font-semibold">{username}</span>. Chúc một ngày làm việc hiệu quả!
          </p>
        </div>
        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
          <Calendar className="w-5 h-5 text-slate-400" />
          <span className="text-sm font-semibold text-slate-600">
            {new Date().toLocaleDateString("vi-VN", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => (
          <div
            key={idx}
            className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl transition-all"
          >
            <div className={`${card.lightColor} w-12 h-12 flex items-center justify-center rounded-2xl mb-4`}>
              <card.icon className={`w-6 h-6 bg-gradient-to-br ${card.color} bg-clip-text text-transparent`} />
            </div>
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">{card.title}</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Growth Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-6 tracking-tight">Biến động nhân sự khoa (6 tháng)</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.monthlyGrowth}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#94A3B8", fontSize: 12 }} />
                <Tooltip
                  cursor={{ fill: "#F8FAFC" }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="count" fill={mainColor} radius={[8, 8, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Staff */}
        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Nhân sự mới trong Khoa</h2>
          <div className="space-y-5">
            {stats.recentUsers?.map((user, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <img
                  src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}&background=random`}
                  className="w-10 h-10 rounded-xl object-cover"
                  alt={user.fullName}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-800 truncate">{user.fullName}</p>
                  <p className="text-xs text-slate-400 font-medium">{user.roleName || "Giảng viên"}</p>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-500">
                  <Clock className="w-3 h-3" /> Mới
                </div>
              </div>
            ))}
            {!stats.recentUsers?.length && (
              <p className="text-center text-slate-400 py-10 font-medium italic">Không có dữ liệu nhân sự mới</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;
