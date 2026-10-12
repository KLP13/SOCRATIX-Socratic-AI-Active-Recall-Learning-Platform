import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useMastery } from "../src/context/MasteryContext";

export const SocratixNavbar: React.FC = () => {
  const location = useLocation();
  const { xp, resetDemo, nodes } = useMastery();

  const isBstMastered = nodes.bst.status === "mastery";

  const navLinks = [
    { name: "Home", path: "/socratix" },
    { name: "Workspace", path: "/workspace" },
    { name: "Mastery", path: "/mastery" },
    { name: "Quiz", path: "/quiz" },
    { name: "Educator", path: "/educator" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 sm:px-8">
        {/* Brand Logo & Nav items */}
        <div className="flex items-center gap-8">
          <Link
            to="/socratix"
            className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-slate-900 transition hover:opacity-90 group"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white font-bold shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              Σ
            </span>
            <div className="flex flex-col">
              <span className="font-serif text-2xl font-black text-slate-900 leading-tight">Socratix</span>
              <span className="text-[9px] font-semibold uppercase tracking-widest text-blue-600 -mt-1">Active Recall AI</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => {
              const isActive =
                location.pathname === link.path ||
                (link.path === "/socratix" && location.pathname === "/");

              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative py-5 text-sm font-medium transition-colors ${
                    isActive
                      ? "text-blue-600 font-semibold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Actions: XP Badge, Status, Reset */}
        <div className="flex items-center gap-3">
          {/* XP Badge */}
          <div className="flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50/80 px-3.5 py-1 text-xs font-bold text-amber-800 shadow-xs">
            <span className="text-amber-500">⚡</span>
            <span>{xp} XP</span>
          </div>

          {/* BST Status Pill */}
          <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
            <span className={`h-2 w-2 rounded-full ${isBstMastered ? "bg-emerald-500 animate-pulse" : "bg-rose-500"}`} />
            <span>BST: {isBstMastered ? "Mastered 🟢" : "Misconception 🔴"}</span>
          </div>

          {/* Reset Demo Button */}
          <button
            type="button"
            onClick={resetDemo}
            title="Reset demo state to initial for pitching to judges"
            className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 active:scale-95 cursor-pointer"
          >
            Reset Demo
          </button>
        </div>
      </div>
    </header>
  );
};

export default SocratixNavbar;
