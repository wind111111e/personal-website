import { motion } from "framer-motion";

const education = [
  {
    school: "墨尔本大学",
    degree: "计算机科学与技术（硕士）",
    period: "2024.02 – 2026.01",
  },
  {
    school: "澳门科技大学",
    degree: "计算机科学与技术（本科）",
    period: "2019.09 – 2023.06",
  },
];

export const Education = () => {
  return (
    <section id="education" className="py-24 px-4 scroll-mt-24">
      <div className="max-w-4xl mx-auto">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-bold text-center mb-16"
        >
          教育经历
        </motion.h2>

        <div className="space-y-8">
          {education.map((edu, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/10 pb-8 last:border-0"
            >
              <div>
                <h3 className="text-xl font-bold text-white mb-2">{edu.school}</h3>
                <p className="text-gray-400">{edu.degree}</p>
              </div>
              <div className="mt-2 md:mt-0 font-mono text-[#3FA9FF] w-fit drop-shadow-[0_0_8px_rgba(63,169,255,0.5)]">
                {edu.period}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
