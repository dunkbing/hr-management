import React from "react";

const Avatar = ({ src, name, size = "md", className = "", ...props }) => {
    const getInitials = (fullName) => {
        if (!fullName) return "?";
        const parts = fullName.split(" ");
        if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
        return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    };

    const getColorFromName = (fullName) => {
        if (!fullName) return "#94a3b8"; // default gray
        let hash = 0;
        for (let i = 0; i < fullName.length; i++) {
            hash = fullName.charCodeAt(i) + ((hash << 5) - hash);
        }

        // Các màu sắc đẹp (Tailwind-like)
        const colors = [
            "#3B82F6", // Blue
            "#10B981", // Emerald
            "#F59E0B", // Amber
            "#EF4444", // Red
            "#8B5CF6", // Purple
            "#EC4899", // Pink
            "#06B6D4", // Cyan
            "#FB923C", // Orange
        ];

        const index = Math.abs(hash) % colors.length;
        return colors[index];
    };

    const sizeClasses = {
        sm: "w-8 h-8 text-xs",
        md: "w-10 h-10 text-sm",
        lg: "w-12 h-12 text-base",
        xl: "w-16 h-16 text-xl",
        "2xl": "w-24 h-24 text-3xl",
    };

    const selectedSize = sizeClasses[size] || sizeClasses.md;

    if (src) {
        return (
            <img
                src={src}
                alt={name}
                className={`${selectedSize} rounded-full object-cover border border-gray-100 ${className}`}
                {...props}
            />
        );
    }

    return (
        <div
            className={`${selectedSize} rounded-full flex items-center justify-center font-bold text-white uppercase shadow-sm border border-white/20 ${className}`}
            style={{ backgroundColor: getColorFromName(name) }}
            {...props}
        >
            {getInitials(name)}
        </div>
    );
};

export default Avatar;
