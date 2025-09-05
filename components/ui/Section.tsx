import { motion } from 'framer-motion';

const Section = ({ title, children, helpText }: { title: string, children: React.ReactNode, helpText?: string }) => (
  <motion.div
    className="w-full"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.1, duration: 0.4 }}
  >
    <h2 className="text-xl font-bold mb-4 text-white">{title}</h2>
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {children}
    </div>
    {helpText && <div className="text-xs text-white/60 mt-4">{helpText}</div>}
  </motion.div>
);
export default Section;