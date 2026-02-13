import React from 'react';
import { motion } from 'framer-motion';
import { useCountUp } from '../hooks/useCountUp';

interface StatCardProps {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  decimals?: number;
  delay?: number;
}

const StatCard: React.FC<StatCardProps> = ({
  value,
  suffix = '',
  prefix = '',
  label,
  decimals = 0,
  delay = 0,
}) => {
  const { count, ref } = useCountUp(value, 2000, decimals);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className="glass-card p-8 group hover:bg-white/10 transition-all duration-300 hover:shadow-glow-green"
    >
      <div className="text-4xl md:text-5xl font-black text-gradient-green mb-3">
        {prefix}
        {decimals > 0 ? count.toFixed(decimals) : Math.floor(count).toLocaleString()}
        {suffix}
      </div>
      <p className="text-aegis-white/70 text-sm md:text-base font-medium">{label}</p>
    </motion.div>
  );
};

export const StatsSection: React.FC = () => {
  return (
    <section className="relative py-24 px-4 md:px-8 overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-aegis-blue/10 rounded-full blur-[120px]"></div>

      <div className="container mx-auto max-w-7xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">
            Une confiance <span className="text-gradient-green">vérifiée</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            value={52000}
            prefix="+"
            label="jeunes protégés"
            delay={0}
          />
          <StatCard
            value={4.9}
            suffix="★"
            label="satisfaction"
            decimals={1}
            delay={0.1}
          />
          <StatCard
            value={98}
            suffix="%"
            label="paiements validés en -2s"
            delay={0.2}
          />
          <StatCard
            value={0}
            label="frais cachés"
            delay={0.3}
          />
        </div>
      </div>
    </section>
  );
};
