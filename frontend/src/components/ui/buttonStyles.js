const primary = "group inline-flex items-center justify-center gap-2 rounded-full bg-[#E9573F] font-bold text-white shadow-[0_5px_0_#C94F46] transition duration-200 hover:-translate-y-0.5 hover:bg-[#D94F3B] hover:shadow-[0_6px_0_#C94F46] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29201D] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60";

const sizes = {
    compact: "min-h-9 px-4 py-2 text-xs sm:text-sm",
    medium: "min-h-10 px-5 py-2.5 text-sm",
    inline: "min-h-11 px-5 py-2.5 text-sm",
    form: "min-h-12 px-5 py-3 text-sm",
};

export const buttonStyles = ({ size = "medium", className = "" } = {}) =>
    `${primary} ${sizes[size] || sizes.medium} ${className}`.trim();
