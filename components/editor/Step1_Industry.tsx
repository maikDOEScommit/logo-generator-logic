import { motion } from 'framer-motion';
import { industries } from '@/lib/data';
import Section from '@/components/ui/Section';
import SelectionCard from '@/components/ui/SelectionCard';

interface Props {
  industry: string | null;
  setIndustry: (industry: string) => void;
  onNext: () => void;
}

const Step1_Industry = ({ industry, setIndustry, onNext }: Props) => (
  <motion.div key="step1" className="space-y-8 animate-fade-in">
    <h1 className="text-4xl font-bold">Tell us about your <span className="text-black custom-brand-underline">brand</span>!</h1>
    <Section title="What industry are you in?">
      {Object.entries(industries).map(([key, value]) => (
        <SelectionCard key={key} isSelected={industry === key} onClick={() => setIndustry(key)}>
          <p className="font-bold">{value.name}</p>
        </SelectionCard>
      ))}
    </Section>
    <button onClick={onNext} disabled={!industry} className="w-full bg-black text-white font-bold py-2.5 px-6 rounded-xl shadow-xl shadow-black/30 transition-all duration-300 transform hover:scale-110 hover:shadow-2xl hover:shadow-black/40 hover:rotate-1 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group border border-white/20 lg:mt-8">
      <span className="relative z-10">Continue</span>
      <div className="absolute inset-0 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-[-100%] group-hover:translate-x-[100%] group-hover:transition-transform group-hover:duration-700"></div>
    </button>
  </motion.div>
);
export default Step1_Industry;