import React, { useState, useEffect } from "react";
import {
  Bell,
  Send,
  ClipboardList,
  Calendar,
  ChevronRight,
  ArrowUpRight,
  User as UserIcon,
  ChevronLeft,
  Info
} from "lucide-react";
import axiosClient from "../api/axiosClient";
import { useNavigate } from "react-router-dom";

const LecturerDashboard = () => {
  const [stats, setStats] = useState({ pending: 0, approved: 0, total: 0 });
  const [user, setUser] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const slides = [
    {
      title: "Chào mừng bạn đến với HAU HRMS",
      desc: "Hệ thống quản lý nhân sự hiện đại, minh bạch và hiệu quả dành cho cán bộ giảng viên Trường Đại học Kiến trúc Hà Nội.",
      image: "/slides/campus.png",
      tag: "Trang chủ"
    },
    {
      title: "Đẩy mạnh Chuyển đổi số",
      desc: "Ứng dụng công nghệ hiện đại vào quản lý và giảng dạy, hướng tới xây dựng đại học thông minh.",
      image: "/slides/digital.png",
      tag: "Công nghệ"
    },
    {
      title: "Nghiên cứu & Sáng tạo",
      desc: "Phòng thí nghiệm hiện đại và môi trường học thuật chuyên sâu thúc đẩy những sáng kiến kiến trúc đột phá.",
      image: "/slides/research.png",
      tag: "Nghiên cứu"
    },
    {
      title: "Kết nối Cộng đồng Giảng viên",
      desc: "Xây dựng môi trường làm việc đoàn kết, năng động với nhiều hoạt động văn hóa, nghệ thuật đặc sắc.",
      image: "/slides/events.png",
      tag: "Hoạt động"
    },
    {
      title: "Vinh danh Giảng viên Tiêu biểu",
      desc: "Sự ghi nhận xứng đáng cho những đóng góp xuất sắc trong sự nghiệp giáo dục và phát triển nhà trường.",
      image: "/slides/award.png",
      tag: "Vinh danh"
    }
  ];

  useEffect(() => {
    fetchData();
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const fetchData = async () => {
    try {
      const uRes = await axiosClient.get("/users/me");
      setUser(uRes.data);

      const rRes = await axiosClient.get("/personnel-requests/my");
      const data = rRes.data;
      setStats({
        pending: data.filter(r => r.status.startsWith('PENDING')).length,
        approved: data.filter(r => r.status === 'APPROVED').length,
        total: data.length
      });
    } catch (err) {
      console.error(err);
    }
  };

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="p-6 lg:p-10 bg-[#F8FAFC] min-h-screen">
      <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-700">

        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">
              Chào buổi sáng, {user?.fullName?.split(' ').pop()}! 👋
            </h1>
            <p onClick={() => navigate("/lecturer/my-requests")} className="text-slate-500 mt-1 font-medium italic cursor-pointer hover:underline decoration-blue-400">
              Hôm nay bạn có {stats.pending} yêu cầu đang chờ phê duyệt.
            </p>
          </div>
          <button
            onClick={() => navigate("/lecturer/submit-request")}
            className="flex items-center gap-2 bg-[#009FE3] hover:bg-[#0087c2] text-white px-8 py-4 rounded-[1.5rem] shadow-xl shadow-blue-100 transition-all font-bold group"
          >
            <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            Gửi yêu cầu mới
          </button>
        </div>

        {/* Slideshow Section */}
        <div className="relative h-[350px] rounded-[3rem] overflow-hidden shadow-2xl group/slide">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
            >
              <img src={slide.image} className="w-full h-full object-cover" alt={slide.title} />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex flex-col justify-center p-12 md:p-20">
                <span className="bg-blue-500 text-white text-[10px] font-black px-3 py-1 rounded-full w-fit mb-4 uppercase tracking-widest">{slide.tag}</span>
                <h2 className="text-3xl md:text-5xl font-black text-white max-w-2xl leading-tight mb-4">{slide.title}</h2>
                <p className="text-white/90 text-base md:text-lg max-w-xl leading-relaxed font-medium">{slide.desc}</p>
              </div>
            </div>
          ))}

          {/* Controls */}
          <button onClick={prevSlide} className="absolute left-6 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full text-white opacity-0 group-hover/slide:opacity-100 transition-opacity">
            <ChevronLeft size={24} />
          </button>
          <button onClick={nextSlide} className="absolute right-6 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full text-white opacity-0 group-hover/slide:opacity-100 transition-opacity">
            <ChevronRight size={24} />
          </button>

          {/* Indicators */}
          <div className="absolute bottom-8 left-12 md:left-20 z-20 flex gap-3">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`h-2 rounded-full transition-all ${i === currentSlide ? 'w-10 bg-blue-500' : 'w-2 bg-white/50 hover:bg-white'}`}
              />
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <StatCard
            title="Đang chờ duyệt"
            value={stats.pending}
            icon={Calendar}
            color="blue"
            onClick={() => navigate("/lecturer/my-requests")}
          />
          <StatCard
            title="Đã được chấp thuận"
            value={stats.approved}
            icon={ClipboardList}
            color="emerald"
            onClick={() => navigate("/lecturer/my-requests")}
          />
          <StatCard
            title="Tổng số yêu cầu"
            value={stats.total}
            icon={Bell}
            color="slate"
            onClick={() => navigate("/lecturer/my-requests")}
          />
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3">
                  <div className="p-2 bg-blue-50 text-[#009FE3] rounded-xl">
                    <Bell size={20} />
                  </div>
                  Thông báo từ Nhà trường
                </h2>
                <button
                  onClick={() => navigate("/lecturer/dashboard")}
                  className="text-xs font-black text-[#009FE3] hover:underline uppercase tracking-widest"
                >
                  Xem tất cả
                </button>
              </div>

              <div className="space-y-4">
                <AnnouncementItem
                  title="Cập nhật quy chế đào tạo học kỳ II"
                  date="25/12/2025"
                  category="Đào tạo"
                />
                <AnnouncementItem
                  title="Thông báo nghỉ lễ Tết Nguyên Đán 2026"
                  date="22/12/2025"
                  category="Hành chính"
                />
                <AnnouncementItem
                  title="Hội thảo khoa học về Quy hoạch đô thi bền vững"
                  date="20/12/2025"
                  category="Nghiên cứu"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Info size={20} className="text-blue-500" />
                Lối tắt nhanh
              </h2>
              <div className="space-y-3">
                <QuickLink
                  icon={UserIcon}
                  label="Hồ sơ cá nhân"
                  onClick={() => navigate("/lecturer/profile")}
                />
                <QuickLink
                  icon={ClipboardList}
                  label="Lịch sử yêu cầu"
                  onClick={() => navigate("/lecturer/my-requests")}
                />
                <QuickLink
                  icon={Send}
                  label="Đề xuất mới"
                  onClick={() => navigate("/lecturer/submit-request")}
                />
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#009FE3] to-[#006ca3] rounded-[2.5rem] p-10 text-white shadow-xl shadow-blue-100 relative overflow-hidden group">
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-700"></div>
              <h3 className="font-bold text-lg mb-2 z-10 relative">Hỗ trợ kỹ thuật</h3>
              <p className="text-blue-50 text-sm mb-8 leading-relaxed z-10 relative">Gặp khó khăn khi sử dụng hệ thống? Liên hệ ngay với phòng CNTT.</p>
              <button
                onClick={() => navigate("/lecturer/submit-request")}
                className="w-full bg-white/20 hover:bg-white text-white hover:text-[#009FE3] backdrop-blur-md py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all border border-white/30 z-10 relative"
              >
                Gửi yêu cầu hỗ trợ
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, color, onClick }) => {
  const themedColors = {
    blue: { icon: "#3B82F6", bg: "bg-blue-500 shadow-blue-100 bg-opacity-10" },
    emerald: { icon: "#10B981", bg: "bg-emerald-500 shadow-emerald-100 bg-opacity-10" },
    slate: { icon: "#F59E0B", bg: "bg-amber-500 shadow-amber-100 bg-opacity-10" }
  };

  const currentTheme = themedColors[color] || themedColors.blue;

  return (
    <div
      onClick={onClick}
      className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-2 transition-all cursor-pointer group"
    >
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 ${currentTheme.bg}`}>
        <Icon size={32} color={currentTheme.icon} />
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{title}</p>
        <div className="flex items-end justify-between mt-2">
          <h3 className="text-4xl font-black text-slate-800">{value}</h3>
          <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-[#009FE3] group-hover:text-white transition-all shadow-inner">
            <ArrowUpRight size={20} />
          </div>
        </div>
      </div>
    </div>
  );
};

const AnnouncementItem = ({ title, date, category }) => (
  <div className="flex items-center justify-between p-5 hover:bg-slate-50 rounded-[1.5rem] transition-all cursor-pointer group border border-transparent hover:border-slate-100">
    <div className="flex items-center gap-6">
      <div className="w-1.5 h-12 bg-[#009FE3] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <div>
        <h4 className="font-bold text-gray-700 group-hover:text-[#009FE3] transition-colors leading-snug">{title}</h4>
        <div className="flex items-center gap-4 mt-2">
          <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{date}</span>
          <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
          <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded-md">{category}</span>
        </div>
      </div>
    </div>
    <div className="p-2 bg-slate-100 rounded-full opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1">
      <ChevronRight className="w-4 h-4 text-[#009FE3]" />
    </div>
  </div>
);

const QuickLink = ({ icon: Icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center justify-between p-5 bg-slate-50/50 border border-slate-50 hover:bg-[#009FE3] hover:border-[#009FE3] rounded-[1.5rem] transition-all group"
  >
    <div className="flex items-center gap-4">
      <div className="p-2 bg-white rounded-lg shadow-sm text-[#009FE3] group-hover:text-[#009FE3] transition-colors">
        <Icon size={18} color="#009FE3" />
      </div>
      <span className="text-sm font-bold text-gray-600 group-hover:text-white transition-colors">{label}</span>
    </div>
    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-white group-hover:translate-x-1 transition-all" />
  </button>
);

export default LecturerDashboard;
