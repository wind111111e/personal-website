import { motion } from "framer-motion";
import StarBorder from "./ui/star-border";

const experiences = [
  {
    company: "字节跳动",
    role: "AI 产品经理｜智能语音客服",
    period: "2025.08 - 2025.11",
    items: [
      "引入“小模型主识别 + 大模型补充判断”的协同机制优化意图识别体系，意图召回率+5.6pp，识别准确率+1.2pp。",
      "优化订单绑定流程，通过调研10+竞品提出在用户进线前展示订单列表引导绑定的策略，订单绑定准确率+12.6pp。",
      "搭建实时巡检 workflow，针对不同风险类型制定命中风险后的差异化处理策略，实现风险话术识别与差异化处理，风险发生率-1.5pp。",
    ],
  },
  {
    company: "百度",
    role: "AI 产品经理｜文心一言",
    period: "2024.12 - 2025.07",
    items: [
      "主导构建Agent专项评估体系，设计需求分析、工具调用、反思三大评估维度，并制定主客观任务评分标准。",
      "负责20+模型版本评估，根据问题分布和case分析提出模型优化策略。X1模型思考满意度+9.2pp，回复满意度+4.6pp。",
      "定义数字人带货说服场景体系，构建对话任务与策略增强样本，设计对抗式多轮对话的评测范式，上线后用户转化率+2.7pp，GMV+7.6pp。",
    ],
  },
  {
    company: "作业帮",
    role: "AI 产品经理｜笔记生成类产品",
    period: "2024.10 - 2024.12",
    items: [
      "调研 Coconote、Otter.ai 等竞品为上线新功能提供参考，其中2项优化方案落地。",
      "重构会员权益与订阅入口展示策略，会员订阅转化率+2.7pp，年包占比+5.1pp。",
      "搭建用户自主触发的笔记生成流程，制定语音分段规则，笔记满意度+1.6pp，重新生成率-4.3pp。",
    ],
  },
];

export const Experience = () => {
  return (
    <section id="experience" className="py-24 px-4 overflow-hidden relative scroll-mt-24">
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-bold text-center mb-16"
        >
          实习经历
        </motion.h2>

        <div className="relative">
          {/* Center Line with Glow */}
          <div className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-blue-500/50 to-transparent transform md:-translate-x-1/2 shadow-[0_0_15px_rgba(59,130,246,0.5)]" />

          <div className="space-y-16">
            {experiences.map((exp, index) => (
              <div key={index} className={`flex flex-col md:flex-row items-start relative ${
                index % 2 === 0 ? "md:flex-row-reverse" : ""
              }`}>
                
                {/* Timeline Node */}
                <div className="absolute left-[20px] md:left-1/2 transform -translate-x-1/2 flex items-center justify-center z-10 mt-6 md:mt-8">
                   <div className="w-4 h-4 rounded-full bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,1)] ring-4 ring-black" />
                </div>

                {/* Content Card */}
                <motion.div
                  initial={{ opacity: 0, x: index % 2 === 0 ? 100 : -100 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ 
                    duration: 0.6, 
                    delay: index * 0.2,
                    ease: "easeOut" 
                  }}
                  className={`ml-12 md:ml-0 md:w-1/2 ${
                    index % 2 === 0 ? "md:pl-16" : "md:pr-16"
                  }`}
                >
                  <div className="group relative h-full rounded-2xl overflow-hidden p-[1px] bg-white/5 border border-white/10 hover:border-transparent transition-colors duration-300">
                    {/* 1. 流动霓虹边框 (Animated Border) */}
                    <div className="absolute inset-[-200%] opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0">
                      <div className="absolute inset-0 animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0_340deg,#a855f7_360deg)]" />
                      <div className="absolute inset-0 animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_180deg,transparent_0_340deg,#3b82f6_360deg)] delay-[-2s]" />
                    </div>

                    {/* 2. 默认背景：深色半透明玻璃质感 */}
                    <div className="absolute inset-[1px] bg-[#0c1220] rounded-2xl z-10 transition-colors duration-300 group-hover:bg-[#0f1629]" />
                    
                    {/* 3. 外层柔光 (Ambient Glow) */}
                    <div className="absolute -inset-8 bg-blue-500/20 opacity-0 group-hover:opacity-100 blur-3xl transition-opacity duration-700 -z-10" />

                    {/* 4. 卡片内容 */}
                    <div className="relative z-20 w-full h-full flex flex-col p-6 md:p-8">
                      {/* 内部微光 */}
                      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl" />

                      {/* Year Badge */}
                      <div className="inline-block px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-semibold mb-4 shadow-[0_0_10px_rgba(59,130,246,0.1)] relative z-20 w-fit">
                        {exp.period}
                      </div>

                      <h3 className="text-2xl font-bold text-white mb-2 relative z-20">{exp.company}</h3>
                      <h4 className="text-lg text-blue-400 font-medium mb-6 relative z-20">{exp.role}</h4>
                      
                      <ul className="space-y-3 relative z-20">
                        {exp.items.map((item, i) => (
                          <li key={i} className="flex items-start gap-3 text-gray-400 group-hover:text-gray-300 transition-colors duration-300 text-sm leading-relaxed">
                            <span className="mt-2 w-1.5 h-1.5 rounded-full bg-blue-500/50 flex-shrink-0 shadow-[0_0_5px_rgba(59,130,246,0.5)]" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
                
                {/* Spacer */}
                <div className="hidden md:block md:w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
