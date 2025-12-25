import { useState } from "react";
import {
  Bell,
  CalendarDays,
  Newspaper,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const LecturerDashboard = () => {
  const [slide, setSlide] = useState(0);

  const slides = [
    {
      id: 1,
      title: "Chào mừng đến với Cổng thông tin Giảng viên",
      image:
        "https://images.unsplash.com/photo-1523050854058-8df90110c9f1",
    },
    {
      id: 2,
      title: "Nâng cao chất lượng đào tạo và nghiên cứu",
      image:
        "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f",
    },
    {
      id: 3,
      title: "Trường Đại học Kiến trúc Hà Nội",
      image:
        "https://images.unsplash.com/photo-1503676260728-1c00da094a0b",
    },
  ];

  const notifications = [
    "Họp khoa vào 14h00 ngày 20/12/2025",
    "Cập nhật kế hoạch giảng dạy học kỳ II",
    "Nộp báo cáo nghiên cứu khoa học trước 30/12",
  ];

  const news = [
    {
      title: "Thông báo tuyển sinh cao học năm 2025",
      date: "15/12/2025",
    },
    {
      title: "Hội thảo khoa học quốc gia về Kiến trúc xanh",
      date: "10/12/2025",
    },
  ];

  const schedule = [
    {
      date: "Thứ 2 (20/12)",
      content: "Giảng dạy môn Kiến trúc công trình – P301",
    },
    {
      date: "Thứ 4 (22/12)",
      content: "Họp hội đồng khoa học",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#f9fafb]">
      {/* ===== HEADER ===== */}
      <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-[#009FE3]">
          Dashboard Giảng viên
        </h1>
        <div className="text-sm text-gray-600">
          Xin chào, <strong>Giảng viên Nguyễn Văn A</strong>
        </div>
      </header>

      {/* ===== MAIN ===== */}
      <main className="flex-1 p-6 space-y-6">
        {/* ===== SLIDESHOW ===== */}
        <div className="relative rounded-lg overflow-hidden shadow bg-white">
          <img
            src={slides[slide].image}
            alt=""
            className="w-full h-64 object-cover"
          />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <h2 className="text-white text-2xl font-bold">
              {slides[slide].title}
            </h2>
          </div>

          <button
            onClick={() =>
              setSlide((slide - 1 + slides.length) % slides.length)
            }
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/70 p-2 rounded-full"
          >
            <ChevronLeft />
          </button>

          <button
            onClick={() => setSlide((slide + 1) % slides.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/70 p-2 rounded-full"
          >
            <ChevronRight />
          </button>
        </div>

        {/* ===== GRID ===== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* THÔNG BÁO */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center gap-2 mb-3 text-[#009FE3]">
              <Bell size={18} />
              <h3 className="font-semibold">Thông báo</h3>
            </div>
            <ul className="space-y-2 text-sm text-gray-600">
              {notifications.map((n, i) => (
                <li key={i} className="border-b pb-2 last:border-none">
                  {n}
                </li>
              ))}
            </ul>
          </div>

          {/* TIN TỨC */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center gap-2 mb-3 text-[#009FE3]">
              <Newspaper size={18} />
              <h3 className="font-semibold">Tin tức</h3>
            </div>
            <ul className="space-y-3 text-sm text-gray-600">
              {news.map((item, i) => (
                <li key={i}>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-xs text-gray-400">{item.date}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* LỊCH CÔNG TÁC */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center gap-2 mb-3 text-[#009FE3]">
              <CalendarDays size={18} />
              <h3 className="font-semibold">Lịch công tác</h3>
            </div>
            <ul className="space-y-3 text-sm text-gray-600">
              {schedule.map((s, i) => (
                <li key={i}>
                  <p className="font-medium">{s.date}</p>
                  <p className="text-gray-500">{s.content}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="bg-white border-t text-center py-3 text-sm text-gray-500">
        © 2025 Trường Đại học Kiến trúc Hà Nội – Hệ thống quản lý giảng viên
      </footer>
    </div>
  );
};

export default LecturerDashboard;
