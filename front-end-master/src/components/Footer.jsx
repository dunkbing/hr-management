import React from "react";
import { MapPin, Phone, Mail, Globe, Facebook, ExternalLink } from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-white border-t border-slate-100 py-12 px-6 lg:px-10 mt-auto">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Brand Section */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-[#009FE3] rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-100">
                                HAU
                            </div>
                            <div>
                                <h3 className="font-black text-gray-800 leading-tight uppercase tracking-tighter">
                                    Đại học <br /> Kiến trúc Hà Nội
                                </h3>
                            </div>
                        </div>
                        <p className="text-sm text-slate-500 leading-relaxed font-medium">
                            Hệ thống quản lý nhân sự hiện đại, nâng cao hiệu quả quản trị và phát triển đội ngũ cán bộ giảng viên.
                        </p>
                        <div className="flex items-center gap-4">
                            <a href="https://www.facebook.com/DHKIENTRUCHN" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-[#009FE3] hover:text-white transition-all shadow-sm">
                                <Facebook size={20} />
                            </a>
                            <a href="http://www.hau.edu.vn/" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-[#009FE3] hover:text-white transition-all shadow-sm">
                                <Globe size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-6">
                        <h4 className="font-black text-xs uppercase tracking-[0.2em] text-gray-400 border-b border-slate-50 pb-4">Liên hệ</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 group text-sm text-slate-600 font-medium">
                                <MapPin size={18} className="text-[#009FE3] shrink-0 mt-0.5" />
                                <span>Km 10, Đường Trần Phú, <br />Quận Hà Đông, Hà Nội</span>
                            </li>
                            <li className="flex items-center gap-3 group text-sm text-slate-600 font-medium">
                                <Phone size={18} className="text-[#009FE3] shrink-0" />
                                <span>024.3854 1616</span>
                            </li>
                            <li className="flex items-center gap-3 group text-sm text-slate-600 font-medium">
                                <Mail size={18} className="text-[#009FE3] shrink-0" />
                                <span>daotao@hau.edu.vn</span>
                            </li>
                        </ul>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-6">
                        <h4 className="font-black text-xs uppercase tracking-[0.2em] text-gray-400 border-b border-slate-50 pb-4">Tiện ích</h4>
                        <ul className="space-y-3">
                            <li><a href="http://www.hau.edu.vn/Tin-tuc_v_8" target="_blank" rel="noreferrer" className="text-sm text-slate-500 font-bold hover:text-[#009FE3] transition-colors flex items-center gap-2 group">Tin tức sự kiện <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" /></a></li>
                            <li><a href="http://www.hau.edu.vn/Dao-tao_v_10" target="_blank" rel="noreferrer" className="text-sm text-slate-500 font-bold hover:text-[#009FE3] transition-colors flex items-center gap-2 group">Thông tin đào tạo <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" /></a></li>
                            <li><a href="http://www.hau.edu.vn/Nghien-cuu-khoa-hoc_v_11" target="_blank" rel="noreferrer" className="text-sm text-slate-500 font-bold hover:text-[#009FE3] transition-colors flex items-center gap-2 group">Nghiên cứu khoa học <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" /></a></li>
                        </ul>
                    </div>

                    {/* Map Preview */}
                    <div className="space-y-6">
                        <h4 className="font-black text-xs uppercase tracking-[0.2em] text-gray-400 border-b border-slate-50 pb-4">Bản đồ</h4>
                        <div className="rounded-[2rem] overflow-hidden border border-slate-100 shadow-xl shadow-blue-50/50 group cursor-pointer relative h-32">
                            <img
                                src="https://api.mapbox.com/styles/v1/mapbox/light-v10/static/pin-s-l+009FE3(105.7891,20.9808)/105.7891,20.9808,15/300x200@2x?access_token=pk.eyJ1IjoibWFwYm94YXBpIiwiYSI6ImNrZnd4ZzN4ZzBnb2gycm8xeXo0eXo0eXoifQ.vXo0eXo0eXo0eXo0eXo0"
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                alt="HAU Map"
                            />
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors flex items-center justify-center">
                                <a
                                    href="https://www.google.com/maps/dir//Tr%C1%B0%E1%BB%9Dng+%C4%90%E1%BA%A1i+h%E1%BB%8Dc+Ki%E1%BA%BFn+tr%C1%BA%BA%A1c+H%C3%A0+N%E1%BB%99i"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl text-[10px] font-black uppercase text-[#009FE3] shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    Xem trên Maps
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">

                    <p className="text-xs font-bold text-slate-400">
                        Phiên bản 2.1.0
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
