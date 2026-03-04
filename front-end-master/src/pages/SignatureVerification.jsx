import React, { useState } from "react";
import { ShieldCheck, Upload, CheckCircle2, XCircle, FileText, Loader2 } from "lucide-react";
import axiosClient from "../api/axiosClient";

const SignatureVerification = () => {
    const [file, setFile] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [dragOver, setDragOver] = useState(false);

    const handleVerify = async (pdfFile) => {
        if (!pdfFile) return;
        setLoading(true);
        setResult(null);
        try {
            const formData = new FormData();
            formData.append("file", pdfFile);
            const res = await axiosClient.post("/personnel-requests/verify-signature", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setResult(res.data);
        } catch (err) {
            setResult({ valid: false, message: err.response?.data?.message || "Verification failed" });
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const selected = e.target.files?.[0];
        if (selected) {
            setFile(selected);
            handleVerify(selected);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        const dropped = e.dataTransfer.files?.[0];
        if (dropped && dropped.type === "application/pdf") {
            setFile(dropped);
            handleVerify(dropped);
        }
    };

    const handleReset = () => {
        setFile(null);
        setResult(null);
    };

    return (
        <div className="p-6 lg:p-10 bg-[#F8FAFC] min-h-screen">
            <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500">
                {/* Header */}
                <div className="space-y-2">
                    <h1 className="text-3xl font-black text-slate-950 flex items-center gap-4 tracking-tight">
                        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                            <ShieldCheck size={28} />
                        </div>
                        Xac minh chu ky so
                    </h1>
                    <p className="text-gray-500 font-medium ml-1">
                        Tai len file PDF da ky de kiem tra tinh xac thuc va toan ven cua tai lieu.
                    </p>
                </div>

                {/* Upload Area */}
                <div
                    className={`bg-white p-12 rounded-[2.5rem] shadow-sm border-2 border-dashed transition-all cursor-pointer
                        ${dragOver ? "border-emerald-400 bg-emerald-50/30" : "border-slate-200 hover:border-slate-300"}`}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById("pdf-upload").click()}
                >
                    <input
                        id="pdf-upload"
                        type="file"
                        accept=".pdf"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                    <div className="flex flex-col items-center gap-4 text-center">
                        {file ? (
                            <>
                                <div className="p-4 bg-blue-50 rounded-2xl">
                                    <FileText size={36} className="text-blue-500" />
                                </div>
                                <div>
                                    <p className="font-black text-slate-800 text-lg">{file.name}</p>
                                    <p className="text-xs text-gray-400 font-medium mt-1">
                                        {(file.size / 1024).toFixed(1)} KB
                                    </p>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="p-4 bg-slate-50 rounded-2xl">
                                    <Upload size={36} className="text-gray-300" />
                                </div>
                                <div>
                                    <p className="font-black text-gray-400 text-sm uppercase tracking-widest">
                                        Keo tha file PDF vao day
                                    </p>
                                    <p className="text-xs text-gray-300 font-medium mt-1">
                                        hoac nhan de chon file
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="flex items-center justify-center gap-3 py-8">
                        <Loader2 className="animate-spin h-8 w-8 text-[#009FE3]" />
                        <p className="text-gray-400 font-black text-[10px] uppercase tracking-[0.2em]">
                            Dang xac minh chu ky...
                        </p>
                    </div>
                )}

                {/* Result */}
                {result && !loading && (
                    <div className={`p-8 rounded-[2.5rem] shadow-sm border ${
                        result.valid
                            ? "bg-emerald-50 border-emerald-200"
                            : "bg-rose-50 border-rose-200"
                    }`}>
                        <div className="flex items-start gap-5">
                            <div className={`p-4 rounded-2xl shrink-0 ${
                                result.valid ? "bg-emerald-100" : "bg-rose-100"
                            }`}>
                                {result.valid
                                    ? <CheckCircle2 size={32} className="text-emerald-600" />
                                    : <XCircle size={32} className="text-rose-600" />
                                }
                            </div>
                            <div className="space-y-3 flex-1">
                                <h3 className={`text-xl font-black ${
                                    result.valid ? "text-emerald-800" : "text-rose-800"
                                }`}>
                                    {result.valid ? "Chu ky hop le" : "Chu ky khong hop le"}
                                </h3>
                                <p className={`text-sm font-medium ${
                                    result.valid ? "text-emerald-600" : "text-rose-600"
                                }`}>
                                    {result.message}
                                </p>

                                {result.valid && (
                                    <div className="mt-4 space-y-2 bg-white/60 p-5 rounded-2xl">
                                        {result.signerName && (
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest w-28">Nguoi ky</span>
                                                <span className="text-sm font-bold text-gray-700">{result.signerName}</span>
                                            </div>
                                        )}
                                        {result.signDate && (
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest w-28">Ngay ky</span>
                                                <span className="text-sm font-bold text-gray-700">
                                                    {new Date(result.signDate).toLocaleString("vi-VN")}
                                                </span>
                                            </div>
                                        )}
                                        {result.reason && (
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest w-28">Ly do</span>
                                                <span className="text-sm font-bold text-gray-700">{result.reason}</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={handleReset}
                                className="px-8 py-3 bg-white hover:bg-slate-50 text-gray-500 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all shadow-sm border border-slate-200"
                            >
                                Xac minh file khac
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SignatureVerification;
