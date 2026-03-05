import { motion } from "framer-motion";

const experiences = [
  {
    company: "字节跳动",
    role: "AI 产品经理｜智能语音客服",
    period: "2025.08 - 2025.11",
    items: [
      "引入“小模型主识别 + 大模型补充判断”的协同机制优化意图识别体系，意图召回率+5.6pp，识别准确率+1.2pp。",
      "优化订单绑定流程，通过调研10+竞品提出在用户进线前展示订单列表引导绑定的策略，订单绑定准确率+12.6pp。",
      "搭建实时巡检 workflow，实现风险话术识别与差异化处理，IVR风险率-1.56pp，VOIP风险率-1.23%。",
    ],
  },
  {
    company: "百度",
    role: "AI 产品经理｜文心一言",
    period: "2024.12 - 2025.07",
    items: [
      "主导构建Agent专项评估体系，设计需求分析、工具调用、反思三大评估维度，并制定主客观任务评分标准。",
      "负责20+模型版本评估，根据问题分布和case分析提出模型优化策略。X1模型思考满意度+9.2pp，回复满意度+4.6pp。",
      "构建数字人带货说服场景体系并设计说服策略数据，上线后用户转化率+2.7pp，GMV+7.6pp。",
    ],
  },
  {
    company: "作业帮",
    role: "AI 产品经理｜笔记生成类产品",
    period: "2024.10 - 2024.12",
    items: [
      "调研 Coconote、Otter.ai 等竞品并据此输出3项策略建议，其中2项优化方案落地。",
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
                  <div className="relative group">
                    {/* Card Background with Glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="relative bg-[#0B1026]/60 backdrop-blur-md border border-blue-500/20 rounded-2xl p-6 md:p-8 hover:border-blue-500/40 transition-all duration-300 shadow-[0_0_30px_rgba(0,0,0,0.2)]">
                      {/* Year Badge */}
                      <div className="inline-block px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-200 text-xs font-semibold mb-4 shadow-[0_0_10px_rgba(59,130,246,0.2)]">
                        {exp.period}
                      </div>

                      <h3 className="text-2xl font-bold text-white mb-2">{exp.company}</h3>
                      <h4 className="text-lg text-blue-400 font-medium mb-6">{exp.role}</h4>
                      
                      <ul className="space-y-3">
                        {exp.items.map((item, i) => (
                          <li key={i} className="flex items-start gap-3 text-gray-300 text-sm leading-relaxed">
                            <span className="mt-2 w-1.5 h-1.5 rounded-full bg-blue-400/60 flex-shrink-0 shadow-[0_0_5px_rgba(96,165,250,0.5)]" />
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
