import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { Hero } from "./components/Hero";
import { CoreCapabilities } from "./components/CoreCapabilities";
import { Education } from "./components/Education";
import { Experience } from "./components/Experience";
import { ProjectShowcase } from "./components/ProjectShowcase";
import { AnnaDiary } from "./pages/AnnaDiary";
import { CustomerService } from "./pages/CustomerService";
import "./styles/theme.css";
import NavBar from "./components/NavBar";
import { Contact } from "./components/Contact";

function HomePage() {
  return (
    <div className="relative min-h-screen">
      <NavBar />
      <div className="relative z-10">
        <Hero />
        <CoreCapabilities />
        <Education />
        <Experience />
        <ProjectShowcase />
        <Contact />
      </div>
    </div>
  );
}

function AppContent() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  // 生成随机星空背景
  const starStyles = useMemo(() => {
    const count = 120; // 星星数量
    const stars = [];
    
    for (let i = 0; i < count; i++) {
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const size = Math.random() * 2 + 1; // 1-3px
      const opacity = Math.random() * 0.5 + 0.1;
      const delay = Math.random() * 5; // 随机动画延迟
      
      stars.push({
        left: `${x}%`,
        top: `${y}%`,
        width: `${size}px`,
        height: `${size}px`,
        opacity: opacity,
        animationDelay: `${delay}s`
      });
    }
    return stars;
  }, []);

  return (
    <div className="bg-black min-h-screen text-white relative">
      {/* Background Blobs (Global) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 bg-black">
        {/* Deep Space Background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#0B1026] via-[#000000] to-[#000000] opacity-80" />
        
        {/* Subtle Aurora Glow - Bottom Center */}
        <div className="absolute -bottom-[20%] left-[20%] right-[20%] h-[60%] rounded-[100%] bg-[#06B6D4] opacity-[0.08] blur-[180px]" />
        
        {/* Random Starfield */}
        <div className="absolute inset-0">
          {starStyles.map((star, i) => (
            <motion.div 
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                left: star.left,
                top: star.top,
                width: star.width,
                height: star.height,
              }}
              initial={{ opacity: star.opacity }}
              animate={{ opacity: [star.opacity, star.opacity * 0.2, star.opacity] }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 2
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/game/anna-diary" element={<AnnaDiary />} />
          <Route path="/customer-service" element={<CustomerService />} />
        </Routes>
      </div>
    </div>
  );
}

import { ScrollToTop } from "./components/ScrollToTop";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
