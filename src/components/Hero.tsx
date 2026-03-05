import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import ParticleHero from "./ParticleHero";

export const Hero = () => {
  return (
    <section className="h-screen flex flex-col justify-center items-center relative overflow-hidden bg-black">
      {/* 粒子背景 */}
      <ParticleHero />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center z-10 space-y-6 px-4 pointer-events-none select-none"
      >
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
          鲍晗
        </h1>
        <h2 className="text-2xl md:text-3xl font-medium text-gray-300">
          AI 产品经理
        </h2>
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto font-light">
          将大模型能力转化为可规模化业务价值
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-10 z-10"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <ChevronDown className="w-8 h-8 text-gray-400" />
        </motion.div>
      </motion.div>
    </section>
  );
};