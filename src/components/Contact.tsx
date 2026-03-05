import React from "react";

export const Contact = () => {
  return (
    <footer id="contact" className="bg-[#111111] pt-16 pb-12 mt-20">
      <div className="max-w-4xl mx-auto px-4 text-center">
        {/* 联系方式 - 单行极简 */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-12 text-sm md:text-base text-gray-400 font-light tracking-wide">
          <span className="hover:text-white transition-colors cursor-default">
            邮箱：1076253977@qq.com         
          </span>
          <span className="mx-6 text-gray-500">|</span>
          <span className="hover:text-white transition-colors cursor-default">
            电话：+86 15032562873                 
          </span>
          <span className="mx-6 text-gray-500">|</span>
          <span className="hover:text-white transition-colors cursor-default">
            微信：同电话
          </span>
        </div>
        
        <div className="mt-12 text-xs text-gray-600">
          © {new Date().getFullYear()} 鲍晗. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
