import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card3D } from '../components/Card3D';

interface CardData {
  id: string;
  name: string;
  variant: 'core' | 'aurora' | 'obsidian';
  description: string;
  features: string[];
  gradient: string;
}

const cards: CardData[] = [
  {
    id: 'core',
    name: 'AEGIS CORE',
    variant: 'core',
    description: 'La protection essentielle',
    features: ['Paiements sans frais', 'Cashback 1%', 'Notifications temps réel'],
    gradient: 'from-aegis-green to-emerald-600',
  },
  {
    id: 'aurora',
    name: 'AEGIS AURORA',
    variant: 'aurora',
    description: 'L\'élégance premium',
    features: ['Cashback 3%', 'Assurance voyage', 'Concierge 24/7'],
    gradient: 'from-aegis-purple via-aegis-blue to-cyan-500',
  },
  {
    id: 'obsidian',
    name: 'AEGIS OBSIDIAN',
    variant: 'obsidian',
    description: 'L\'excellence absolue',
    features: ['Cashback 5%', 'Accès VIP exclusifs', 'Gestionnaire dédié'],
    gradient: 'from-gray-800 via-gray-900 to-black',
  },
];

export const PremiumCardsSection: React.FC = () => {
  const [activeCard, setActiveCard] = useState<string | null>(null);

  return (
    <section className="relative py-24 px-4 md:px-8 overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-aegis-purple/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-aegis-blue/10 rounded-full blur-[120px]"></div>

      <div className="container mx-auto max-w-7xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">
            Choisis ton <span className="text-gradient-purple">niveau</span>
          </h2>
          <p className="text-aegis-white/60 text-lg max-w-2xl mx-auto">
            Trois cartes premium pour trois niveaux d'ambition
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              onHoverStart={() => setActiveCard(card.id)}
              onHoverEnd={() => setActiveCard(null)}
              className="relative group"
            >
              <div
                className={`glass-card p-6 h-full transition-all duration-500 ${
                  activeCard === card.id ? 'bg-white/10 shadow-glow-green scale-105' : ''
                }`}
              >
                {/* 3D Card Preview */}
                <div className="relative h-48 mb-6">
                  <Card3D variant={card.variant} />

                  {/* Glow effect */}
                  <div
                    className={`absolute inset-0 rounded-2xl blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 bg-gradient-to-br ${card.gradient}`}
                  ></div>
                </div>

                {/* Card Info */}
                <div className="space-y-4">
                  <h3 className="font-serif text-2xl font-bold">{card.name}</h3>
                  <p className="text-aegis-white/60">{card.description}</p>

                  <ul className="space-y-2">
                    {card.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-aegis-white/80">
                        <svg
                          className="w-5 h-5 text-aegis-green flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-full py-3 rounded-full font-bold text-sm uppercase tracking-wider transition-all duration-300 bg-gradient-to-r ${card.gradient} text-white shadow-lg`}
                  >
                    Découvrir
                  </motion.button>
                </div>
              </div>

              {/* Decorative corner accent */}
              <div className="absolute -top-2 -right-2 w-16 h-16 bg-gradient-to-br from-aegis-green/20 to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
