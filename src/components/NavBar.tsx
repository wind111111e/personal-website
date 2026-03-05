import React from "react";

const sections = [
  { id: "capabilities", label: "核心能力" },
  { id: "education", label: "教育经历" },
  { id: "experience", label: "实习经历" },
  { id: "projects", label: "作品展示" },
  { id: "contact", label: "联系我" },
];

export default function NavBar() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black">
      <div className="mx-auto max-w-7xl px-4">
        <div className="h-16 flex items-center justify-between">
          <div className="text-white/90 font-semibold tracking-wide">
            HanBAO <span className="opacity-60">|</span> <span className="opacity-80">AI PM</span>
          </div>
          <nav className="flex items-center gap-8 text-sm">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                {s.label}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
