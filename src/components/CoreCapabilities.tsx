import { motion } from "framer-motion";
import { Brain, LineChart, Code2, Bot } from "lucide-react";

const capabilities = [
  {
    id: "agent",
    title: "Agent 与流程设计",
    description: "基于 Coze 构建可协同的 Agent 结构与执行流程，实现复杂任务的系统化运行。",
    icon: Bot,
  },
  {
    id: "eval",
    title: "模型能力评估",
    description: "构建分层评测与标注体系，量化模型表现并校准能力边界。",
    icon: Brain,
  },
  {
    id: "data",
    title: "数据分析",
    description: "构建指标体系与 A/B 实验机制，通过数据发现问题、制定优化策略并验证改进效果。",
    icon: LineChart,
  },
  {
    id: "vibe",
    title: "Vibe Coding",
    description: "通过 AI 辅助工具快速构建可验证原型，实现从灵感到上线的高效迭代。",
    icon: Code2,
  },
];

export const CoreCapabilities = () => {
  return (
    <section id="capabilities" className="py-24 px-4 scroll-mt-24">
      <div className="max-w-7xl mx-auto">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-bold text-center mb-16"
        >
          核心能力
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {capabilities.map((cap, index) => (
            <motion.div
              key={cap.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative h-full rounded-xl overflow-hidden p-[1px] bg-white/5 border border-white/10 hover:border-transparent transition-colors duration-300"
            >
              {/* 1. 流动霓虹边框 (Animated Border) - 放在最底层，通过 p-[1px] 露出来 */}
              <div className="absolute inset-[-200%] opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0">
                 {/* 这里的 conic-gradient 创建旋转的光锥 */}
                 <div className="absolute inset-0 animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0_340deg,#a855f7_360deg)]" />
                 {/* 第二层光锥，颜色偏移，形成渐变流 */}
                 <div className="absolute inset-0 animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_180deg,transparent_0_340deg,#3b82f6_360deg)] delay-[-2s]" />
              </div>

              {/* 2. 默认背景：深色半透明玻璃质感 - 盖在中间，只留出1px边框 */}
              <div className="absolute inset-[1px] bg-[#0c1220] rounded-xl z-10 transition-colors duration-300 group-hover:bg-[#0f1629]" />
              
              {/* 3. 外层柔光 (Ambient Glow) - 极低透明度，大范围扩散 */}
              <div className="absolute -inset-8 bg-blue-500/20 opacity-0 group-hover:opacity-100 blur-3xl transition-opacity duration-700 -z-10" />

              {/* 4. 卡片内容 */}
              <div className="relative h-full p-6 flex flex-col transition-transform duration-300 z-20">
                <div className="mb-6 p-3 rounded-lg bg-white/5 w-fit group-hover:bg-blue-500/10 group-hover:text-blue-400 transition-colors duration-300 border border-white/5">
                  <cap.icon className="w-6 h-6 text-gray-400 group-hover:text-blue-400 transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white/90 group-hover:text-white transition-colors duration-300">
                  {cap.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                  {cap.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
