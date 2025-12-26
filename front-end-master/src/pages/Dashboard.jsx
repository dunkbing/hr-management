import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Users,
  School,
  Network,
  UserCog,
  Clock,
  ArrowUpRight,
  MoreVertical,
  Calendar,
  LayoutDashboard,
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

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalFaculties: 0,
    totalDepartments: 0,
    totalPositions: 0,
    monthlyGrowth: [],
    recentUsers: [],
  });
  const [loading, setLoading] = useState(true);
  const mainColor = "#009FE3";
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username") || "Quản trị viên";

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/dashboard/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
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
      title: "Tổng nhân sự",
      value: stats.totalUsers,
      icon: Users,
      trend: "+12%",
      color: "from-blue-500 to-blue-600",
      lightColor: "bg-blue-50",
    },
    {
      title: "Số lượng Khoa",
      value: stats.totalFaculties,
      icon: School,
      trend: "Ổn định",
      color: "from-emerald-500 to-emerald-600",
      lightColor: "bg-emerald-50",
    },
    {
      title: "Phòng ban",
      value: stats.totalDepartments,
      icon: Network,
      trend: "+2 mới",
      color: "from-orange-500 to-orange-600",
      lightColor: "bg-orange-50",
    },
    {
      title: "Chức vụ",
      value: stats.totalPositions,
      icon: UserCog,
      trend: "Cập nhật",
      color: "from-purple-500 to-purple-600",
      lightColor: "bg-purple-50",
    },
  ];

  return (
    <div className="p-6 lg:p-10 bg-[#F8FAFC] min-h-screen space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 flex items-center gap-3">
            <LayoutDashboard className="w-8 h-8 text-[#009FE3]" />
            Tổng quan Hệ thống
          </h1>
          <p className="text-gray-500 mt-1 font-medium">
            👋 Chào mừng quay trở lại, <span className="text-[#009FE3] font-bold">{username}</span>.
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
            className="group relative bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="flex justify-between items-start">
              <div className={`${card.lightColor} p-4 rounded-2xl`}>
                <card.icon className={`w-7 h-7 bg-gradient-to-br ${card.color} bg-clip-text text-transparent`} />
              </div>
              <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                {card.trend}
              </span>
            </div>
            <div className="mt-5">
              <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">{card.title}</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{card.value}</p>
            </div>
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-slate-50 to-transparent -z-0 opacity-50 rounded-bl-[100px]" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Growth Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Tốc độ gia tăng nhân sự</h2>
              <p className="text-gray-400 text-sm font-medium mt-1">Dữ liệu 6 tháng gần nhất</p>
            </div>
            <button className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
              <MoreVertical className="w-5 h-5 text-slate-400" />
            </button>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.monthlyGrowth} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94A3B8", fontSize: 12, fontWeight: 600 }}
                  dy={10}
                />
                <YAxis hide />
                <Tooltip
                  cursor={{ fill: "#F1F5F9" }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border-none">
                          <p className="text-xs font-bold text-slate-400 mb-1 uppercase tracking-tight">{payload[0].payload.month}</p>
                          <p className="text-lg font-black">{payload[0].value} nhân sự mới</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar
                  dataKey="count"
                  radius={[12, 12, 4, 4]}
                  barSize={40}
                >
                  {stats.monthlyGrowth.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={index === stats.monthlyGrowth.length - 1 ? "#009FE3" : "#CBD5E1"}
                      className="transition-all duration-300 hover:fill-[#009FE3]"
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Personnel */}
        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-semibold text-gray-800">Nhân sự mới gia nhập</h2>
            <button className="text-[#009FE3] text-sm font-semibold hover:underline">Xem tất cả</button>
          </div>
          <div className="space-y-6">
            {stats.recentUsers?.length > 0 ? (
              stats.recentUsers.map((user, idx) => (
                <div key={idx} className="flex items-center gap-4 group cursor-pointer">
                  <div className="relative">
                    <img
                      src={user.avatar || "https://i.pravatar.cc/100?u=" + user.userId}
                      alt={user.fullName}
                      className="w-12 h-12 rounded-2xl object-cover ring-2 ring-slate-50 group-hover:ring-[#009FE3] transition-all"
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-800 truncate group-hover:text-[#009FE3] transition-colors">
                      {user.fullName}
                    </p>
                    <p className="text-xs font-medium text-slate-400 capitalize">{user.roleName || "Nhân viên"}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-300 flex items-center gap-1 justify-end">
                      <Clock className="w-3 h-3" />
                      Mới
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10">
                <p className="text-slate-400 font-medium italic">Chưa có dữ liệu mới</p>
              </div>
            )}

            <button className="w-full mt-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-600 font-bold hover:bg-slate-100 transition-all flex items-center justify-center gap-2 group">
              Thêm nhân sự mới
              <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
