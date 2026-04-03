export function TopBar({ setOpen }) {
  const { toggle, isDark } = useTheme();
  const { user, role } = useAuth();

  return (
    <header className="sticky top-0 z-50 px-6 py-3">

      <div className="grid grid-cols-3 items-center max-w-7xl mx-auto 
        backdrop-blur-xl bg-white/5 border border-white/10 
        rounded-2xl px-6 py-3 shadow-[0_8px_30px_rgba(0,0,0,0.3)]">

        {/* LEFT */}
        <div className="flex items-center gap-4">
          <button
            className="lg:hidden p-2 rounded-md hover:bg-white/10 transition"
            onClick={() => setOpen(p => !p)}
          >
            <Menu size={20} />
          </button>

          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="logo" className="w-8 h-8 rounded-md" />
            <span className="font-semibold text-white text-lg">ScholrERP</span>
          </div>
        </div>

        {/* 🔥 PERFECT CENTER */}
        <div className="flex justify-center items-center gap-10 text-sm">

          {[
            "Dashboard",
            "Profile",
            "Results",
            "Notices",
            "Leave",
            "Fees",
            "Placements",
            "Helpdesk"
          ].map((item, i) => (
            <span
              key={i}
              className="text-white/60 hover:text-white transition cursor-pointer relative group"
            >
              {item}

              {/* underline */}
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-gradient-to-r from-blue-500 to-purple-500 transition-all group-hover:w-full" />
            </span>
          ))}

        </div>

        {/* RIGHT */}
        <div className="flex items-center justify-end gap-4">

          {/* Theme Toggle */}
          <button
            onClick={toggle}
            className="w-10 h-10 rounded-lg border border-white/10 flex items-center justify-center hover:bg-white/10 transition"
          >
            {isDark ? <Moon size={16} /> : <Sun size={16} />}
          </button>

          {/* USER */}
          <div className="flex items-center gap-3 cursor-pointer">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-sm font-bold text-white">
              {user?.name?.[0]}
            </div>

            <div className="hidden md:block">
              <p className="text-sm text-white font-medium">{user?.name}</p>
              <p className="text-xs text-white/40 capitalize">{role}</p>
            </div>
          </div>

        </div>

      </div>
    </header>
  );
}