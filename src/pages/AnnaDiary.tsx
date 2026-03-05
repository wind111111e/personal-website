import { motion } from "framer-motion";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export const AnnaDiary = () => {
  const [activeTab, setActiveTab] = useState<"game" | "video">("game");

  return (
    <div className="min-h-screen text-white pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center relative"
        >
          <Link 
            to="/" 
            className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors flex items-center gap-2 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="hidden sm:inline">返回首页</span>
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 text-transparent bg-clip-text">
            Anna's Diary
          </h1>
        </motion.div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/5 p-1 rounded-full backdrop-blur-sm border border-white/10">
            <button
              onClick={() => setActiveTab("game")}
              className={`px-8 py-2 rounded-full transition-all duration-300 ${
                activeTab === "game"
                  ? "bg-red-500/20 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.3)]"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Game
            </button>
            <button
              onClick={() => setActiveTab("video")}
              className={`px-8 py-2 rounded-full transition-all duration-300 ${
                activeTab === "video"
                  ? "bg-red-500/20 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.3)]"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              YouTube Video
            </button>
          </div>
        </div>

        {/* Content Area */}
        <motion.div
          layout
          className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden shadow-2xl mb-12"
        >
          {activeTab === "game" ? (
            <div className="aspect-[16/9] w-full max-h-[600px] relative">
              <iframe
                src="https://feit-comp30019.github.io/2024s2-project-2-unisoft/5d654e3cc32b52622aa22dddfc3e0c190d9dcecc/"
                className="w-full h-full border-0"
                allow="autoplay; fullscreen; gyroscope; accelerometer"
                title="Anna's Diary Game"
              />
            </div>
          ) : (
            <div className="aspect-[16/9] w-full max-h-[600px] flex items-center justify-center bg-black/50">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/jP71lqpeXeE"
                title="Anna's Diary Gameplay"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="border-0"
              />
            </div>
          )}
        </motion.div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-3xl mx-auto space-y-6 text-gray-300 leading-relaxed"
        >
          <div className="bg-white/5 rounded-xl p-8 border border-white/10 hover:border-red-500/30 transition-colors duration-300">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="w-1 h-8 bg-red-500 rounded-full" />
              游戏介绍
            </h3>
            
            <p className="mb-4">
              这是一款结合心理悬疑与解谜元素的探索类逃脱游戏。玩家会收到一封神秘的邀请函，前往一座阴森的老房子，但在进入之后却发现自己被困在其中。游戏的核心玩法是探索房子的每一个角落，寻找线索，揭开隐藏在屋中的秘密，并在限定时间内逃离这座木屋。
            </p>
            
            <p className="mb-4">
              玩家需要完成一系列任务，包括点燃壁炉、搬动椅子、擦拭镜子、整理餐具等，同时收集散落在房间中的五页日记，逐步揭开安娜被遗弃的悲惨过往。根据日记中的线索，玩家可以破解保险箱的密码，从而获得逃离木屋的钥匙。
            </p>
            
            <p>
              与此同时，玩家还可以选择通过修复音乐盒来拯救安娜的灵魂。这是一项额外任务，它将带来更深层次的道德抉择，并影响游戏结局的变化。
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
