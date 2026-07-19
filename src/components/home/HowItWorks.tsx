import SectionHeading from '../ui/SectionHeading';
import StepCard from './StepCard';

const STEPS = [
  {
    num: '01',
    icon: '☯',
    title: 'Enter Your Details',
    desc: 'Your birth date, time, and place — the ancient keys to your destiny.',
  },
  {
    num: '02',
    icon: '🔮',
    title: 'Reveal Your Chart',
    desc: 'Our AI computes your Four Pillars, Five Elements, and Day Master instantly.',
  },
  {
    num: '03',
    icon: '📜',
    title: 'Receive Your Report',
    desc: 'Get a complete 20+ page PDF with deep insights and life guidance.',
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 md:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <SectionHeading
          label="The Path"
          title="How It Works"
          subtitle="Ancient wisdom meets modern technology"
          className="mb-12"
        />
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {STEPS.map(step => (
            <StepCard key={step.num} {...step} />
          ))}
        </div>
      </div>
    </section>
  );
}
