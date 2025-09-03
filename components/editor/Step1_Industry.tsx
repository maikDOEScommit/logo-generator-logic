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
    <h1 className="text-4xl font-bold">Tell us about your brand</h1>
    <Section title="What industry are you in?">
      {Object.entries(industries).map(([key, value]) => (
        <SelectionCard key={key} isSelected={industry === key} onClick={() => setIndustry(key)}>
          <p className="font-bold">{value.name}</p>
        </SelectionCard>
      ))}
    </Section>
    <button onClick={onNext} disabled={!industry} className="w-full bg-gradient-to-r from-blue-500 via-purple-600 to-cyan-400 text-white font-bold py-3 px-4 rounded-lg transition-all transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none">
      Continue
    </button>
  </motion.div>
);
export default Step1_Industry;