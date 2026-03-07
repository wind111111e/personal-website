import { motion } from "framer-motion";
import { Layout, Gamepad2, Video, Sparkles, Headphones, Zap } from "lucide-react";
import { Link } from "react-router-dom";

type Project = {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  image?: string;
  link?: string;
  action?: () => void;
  tags: string[];
};

const projects: Project[] = [
  {
    id: "personal-site",
    title: "个人网站",
    description: "通过 Vibe Coding 快速构建的个人网站，展示个人经历、能力与项目作品。",
    icon: Layout,
    image: "/personal-site.png",
    color: "from-purple-500 to-blue-500",
    action: () => window.scrollTo({ top: 0, behavior: "smooth" }),
    tags: ["Trae", "React", "Three.js"],
  },
  {
    id: "puzzle-game",
    title: "密室逃脱",
    description: "一款悬疑解谜类游戏，玩家需要探索房间获取钥匙逃出密室。",
    icon: Gamepad2,
    image: "/puzzle-game.png",
    color: "from-red-500 to-orange-500",
    link: "/game/anna-diary",
    tags: ["Unity", "Chatgpt"],
  },
  {
    id: "customer-service",
    title: "服装商家智能客服",
    description: "帮助电商顾客自动解答商品咨询、订单查询、退换货等常见问题。",
    icon: Headphones,
    image: "/customer-service.png",
    color: "from-blue-500 to-cyan-500",
    tags: ["Coze", "Rag", "Vector DB"],
    link: "/customer-service",
  },
];

export const ProjectShowcase = () => {
  return (
    <section id="projects" className="py-24 px-4 scroll-mt-24">
      <div className="max-w-7xl mx-auto">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-bold text-center mb-16"
        >
          作品展示
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => {
            const CardContent = (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative h-full rounded-xl cursor-pointer overflow-hidden p-[1px] bg-white/5 border border-white/10 hover:border-transparent transition-colors duration-300"
              >
                {/* 1. 流动霓虹边框 (Animated Border) */}
                <div className="absolute inset-[-200%] opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0">
                  <div className="absolute inset-0 animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0_340deg,#a855f7_360deg)]" />
                  <div className="absolute inset-0 animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_180deg,transparent_0_340deg,#3b82f6_360deg)] delay-[-2s]" />
                </div>

                {/* 2. 默认背景：深色半透明玻璃质感 */}
                <div className="absolute inset-[1px] bg-[#0c1220] rounded-xl z-10 transition-colors duration-300 group-hover:bg-[#0f1629]" />
                
                {/* 3. 外层柔光 (Ambient Glow) */}
                <div className="absolute -inset-8 bg-blue-500/20 opacity-0 group-hover:opacity-100 blur-3xl transition-opacity duration-700 -z-10" />

                {/* 4. 卡片内容 */}
                <div className="relative h-full flex flex-col z-20 overflow-hidden rounded-xl">
                  {/* 图片占位区域 */}
                  <div className="h-48 w-full flex items-center justify-center relative overflow-hidden rounded-t-xl">
                    <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-10`} />
                    <div className="absolute inset-0 bg-black/20" />
                    {project.image ? (
                      <img 
                        src={project.image} 
                        alt={project.title} 
                        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300" 
                      />
                    ) : (
                      <project.icon className="w-16 h-16 text-white/80 drop-shadow-lg" />
                    )}
                  </div>

                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold mb-3 text-white/90 group-hover:text-white transition-colors duration-300">
                      {project.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed mb-4 flex-grow group-hover:text-gray-300 transition-colors duration-300">
                      {project.description}
                    </p>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mt-auto">
                      {project.tags.map((tag, i) => (
                        <span 
                          key={i}
                          className="px-2 py-1 text-xs font-medium rounded-full bg-white/5 text-gray-500 border border-white/5 transition-colors duration-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            );

            return project.link ? (
              <Link key={project.id} to={project.link} className="block h-full">
                {CardContent}
              </Link>
            ) : (
              <div 
                key={project.id} 
                className="h-full"
                onClick={project.action}
              >
                {CardContent}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
