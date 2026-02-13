import React from 'react';
import { motion } from 'framer-motion';
import { Card3D } from '../components/Card3D';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 md:px-8">
      {/* Radial glow background */}
      <div className="absolute inset-0 bg-radial-green opacity-30 blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-aegis-green/10 rounded-full blur-[100px]"></div>

      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left side - Text content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-center md:text-left"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-serif text-6xl md:text-7xl lg:text-8xl font-black mb-6 leading-[0.9]"
            >
              AEGIS<br />
              <span className="text-gradient-green">BANK</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl lg:text-3xl font-serif text-aegis-white/80 mb-4 leading-tight"
            >
              Le bouclier financier d'une nouvelle génération.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-base md:text-lg text-aegis-white/60 mb-8 space-y-1"
            >
              <p>Protège ton argent.</p>
              <p>Construis ton futur.</p>
              <p>Reste libre.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
            >
              <button className="btn-premium bg-aegis-green text-aegis-black shadow-glow-green">
                Télécharger l'app
              </button>
              <button className="btn-premium bg-white/10 text-white border border-white/20 hover:bg-white/20 hover:shadow-glow-blue">
                Découvrir
              </button>
            </motion.div>
          </motion.div>

          {/* Right side - 3D Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: 'easeOut' }}
            className="relative h-[400px] md:h-[500px]"
          >
            {/* Glow effect behind card */}
            <div className="absolute inset-0 bg-aegis-green/20 rounded-3xl blur-[60px] scale-90"></div>

            {/* 3D Card */}
            <div className="relative h-full drop-shadow-2xl">
              <Card3D variant="core" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-6 h-10 rounded-full border-2 border-aegis-green/50 flex items-start justify-center p-2"
        >
          <motion.div className="w-1.5 h-1.5 bg-aegis-green rounded-full"></motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};
