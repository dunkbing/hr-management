import React, { useState, useEffect } from "react";
import { User, Mail, Calendar, IdCard, GraduationCap, Briefcase, Camera, Loader2, CheckCircle2, Building } from "lucide-react";
import axiosClient from "../api/axiosClient";

const LecturerProfile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await axiosClient.get("/users/me");
            setUser(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = async () => {
            setSaving(true);
            try {
                await axiosClient.put(`/users/${user.userId}`, {
                    ...user,
                    avatar: reader.result
                });
                setUser({ ...user, avatar: reader.result });
                setMessage("Cập nhật ảnh đại diện thành công!");
                setTimeout(() => setMessage(""), 3000);
            } catch (err) {
                console.error(err);
                alert("Không thể cập nhật ảnh đại diện.");
            } finally {
                setSaving(false);
            }
        };
        reader.readAsDataURL(file);
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[500px] gap-4">
            <Loader2 className="animate-spin h-12 w-12 text-[#009FE3]" />
            <p className="text-gray-400 font-black text-[10px] uppercase tracking-widest">Đang xác thực thông tin...</p>
        </div>
    );

    return (
        <div className="p-6 lg:p-10 bg-[#F8FAFC] min-h-screen">
            <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-700">

                {/* Profile Card Header */}
                <div className="bg-white rounded-[3rem] shadow-xl shadow-blue-50/50 border border-slate-100 overflow-hidden relative">
                    <div className="h-48 bg-gradient-to-r from-[#009FE3] to-[#006ca3] flex items-center justify-center">
                        <div className="absolute top-0 left-0 w-full h-full opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                    </div>

                    <div className="p-8 md:p-12 -mt-24 flex flex-col items-center text-center space-y-6">
                        <div className="relative group">
                            <div className="w-40 h-40 rounded-full border-8 border-white bg-slate-100 shadow-xl overflow-hidden relative">
                                {user?.avatar ? (
                                    <img src={user.avatar} className="w-full h-full object-cover" alt="Avatar" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                        <User size={64} />
                                    </div>
                                )}
                                {saving && (
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                        <Loader2 className="animate-spin text-white" />
                                    </div>
                                )}
                            </div>
                            <label
                                className="absolute bottom-2 right-2 p-3 bg-white hover:bg-blue-50 text-[#009FE3] rounded-full shadow-lg border border-slate-100 cursor-pointer transition-all active:scale-90"
                                title="Thay đổi ảnh đại diện"
                            >
                                <Camera size={20} />
                                <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} disabled={saving} />
                            </label>
                        </div>

                        <div className="space-y-2">
                            <h1 className="text-4xl font-black text-slate-950 tracking-tight uppercase tracking-tight">{user?.fullName}</h1>
                            <div className="flex flex-wrap justify-center gap-3">
                                <span className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100">
                                    {user?.roleName || "Giảng viên"}
                                </span>
                                <span className="bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                                    {user?.positionName || "Cán bộ"}
                                </span>
                            </div>
                        </div>

                        {message && (
                            <div className="bg-emerald-50 text-emerald-600 px-6 py-3 rounded-2xl font-bold flex items-center gap-2 text-sm animate-bounce">
                                <CheckCircle2 size={18} />
                                {message}
                            </div>
                        )}
                    </div>

                    <div className="px-12 pb-12 grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-8">
                            <h3 className="text-lg font-black text-slate-900 border-b-4 border-blue-50/50 pb-3 mb-8 uppercase tracking-wider">Thông tin cá nhân</h3>
                            <ProfileItem icon={Mail} label="Địa chỉ Email" value={user?.email} />
                            <ProfileItem icon={Calendar} label="Ngày sinh" value={user?.dob} />
                            <ProfileItem icon={IdCard} label="Số CCCD" value={user?.cccd} />
                        </div>
                        <div className="space-y-8">
                            <h3 className="text-lg font-black text-slate-900 border-b-4 border-emerald-50/50 pb-3 mb-8 uppercase tracking-wider">Thông tin công tác</h3>
                            <ProfileItem icon={Building} label="Khoa trực thuộc" value={user?.facultyName} />
                            <ProfileItem icon={Briefcase} label="Phòng ban" value={user?.departmentName || "N/A"} />
                            <ProfileItem icon={GraduationCap} label="Trình độ học vấn" value={user?.educationLevel} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ProfileItem = ({ icon: Icon, label, value }) => (
    <div className="flex items-start gap-4 group">
        <div className="p-3 bg-slate-50 text-slate-400 rounded-xl group-hover:bg-[#e0f3fc] group-hover:text-[#009FE3] transition-colors shadow-inner">
            <Icon size={20} />
        </div>
        <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] mb-1.5 ml-0.5">{label}</p>
            <p className="text-base font-bold text-slate-900">{value || "Chưa cập nhật"}</p>
        </div>
    </div>
);

export default LecturerProfile;
