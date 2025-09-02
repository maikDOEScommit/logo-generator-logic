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
    <h1 className="text-4xl font-bold">Erzählen Sie uns von Ihrer Marke</h1>
    <Section title="In welcher Branche sind Sie tätig?">
      {Object.entries(industries).map(([key, value]) => (
        <SelectionCard key={key} isSelected={industry === key} onClick={() => setIndustry(key)}>
          <p className="font-bold">{value.name}</p>
        </SelectionCard>
      ))}
    </Section>
    <button onClick={onNext} disabled={!industry} className="w-full bg-primary text-primary-foreground font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed">
      Weiter
    </button>
  </motion.div>
);
export default Step1_Industry;