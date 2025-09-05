'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Palette, Download, CheckCircle, Star, Users, Clock } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const HowItWorksPage = () => {
  const steps = [
    {
      id: 1,
      icon: <Users className="w-8 h-8" />,
      title: "Tell us about your brand",
      description: "Select your industry and brand personality. Our AI understands what makes your business unique.",
      details: "Choose from 12+ industries and personality traits that best represent your vision.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      id: 2,
      icon: <Palette className="w-8 h-8" />,
      title: "Customize your design",
      description: "Pick your perfect combination of icons, fonts, layouts, and colors that match your style.",
      details: "24 curated icons, 4 font categories, multiple layouts, and smart color suggestions.",
      color: "from-purple-500 to-pink-500"
    },
    {
      id: 3,
      icon: <Zap className="w-8 h-8" />,
      title: "Generate instantly",
      description: "Watch as our AI creates your professional logo in seconds, not hours.",
      details: "Advanced algorithms ensure perfect balance, readability, and visual impact.",
      color: "from-green-500 to-emerald-500"
    },
    {
      id: 4,
      icon: <Download className="w-8 h-8" />,
      title: "Download & use",
      description: "Get your high-quality logo files ready for immediate use across all platforms.",
      details: "Multiple formats, various sizes, and mockups for real-world applications.",
      color: "from-orange-500 to-red-500"
    }
  ];

  const features = [
    { icon: <Clock className="w-6 h-6" />, title: "Lightning Fast", desc: "Create logos in under 60 seconds" },
    { icon: <Star className="w-6 h-6" />, title: "Professional Quality", desc: "Designs that rival expensive agencies" },
    { icon: <CheckCircle className="w-6 h-6" />, title: "Always Perfect", desc: "AI ensures balanced, readable results" },
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20">
        {/* Hero Section */}
        <section className="relative py-24 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                How it{' '}
                <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                  Works
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-white/70 max-w-3xl mx-auto mb-8">
                From idea to professional logo in 4 simple steps. 
                Our AI-powered process makes logo creation effortless.
              </p>
            </motion.div>
          </div>

          {/* Background decoration */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-purple-600/10 rounded-full blur-3xl"></div>
        </section>

        {/* Steps Section */}
        <section className="py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid gap-16 md:gap-24">
              {steps.map((step, index) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  viewport={{ once: true }}
                  className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12`}
                >
                  {/* Content */}
                  <div className="flex-1 space-y-6">
                    <div className="flex items-center gap-4">
                      <div className={`p-4 rounded-2xl bg-gradient-to-r ${step.color} text-white shadow-lg`}>
                        {step.icon}
                      </div>
                      <div className="text-3xl font-bold text-white/20">
                        0{step.id}
                      </div>
                    </div>
                    
                    <h3 className="text-3xl md:text-4xl font-bold text-white">
                      {step.title}
                    </h3>
                    
                    <p className="text-xl text-white/70 leading-relaxed">
                      {step.description}
                    </p>
                    
                    <p className="text-white/50">
                      {step.details}
                    </p>

                    {index < steps.length - 1 && (
                      <div className="flex items-center gap-2 text-white/40 pt-4">
                        <span className="text-sm">Next</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    )}
                  </div>

                  {/* Visual */}
                  <div className="flex-1 flex justify-center">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className={`w-80 h-80 rounded-3xl bg-gradient-to-br ${step.color} p-1`}
                    >
                      <div className="w-full h-full rounded-3xl bg-gray-900/80 flex items-center justify-center backdrop-blur-sm">
                        <div className={`p-8 rounded-2xl bg-gradient-to-br ${step.color} text-white shadow-2xl`}>
                          <div className="scale-150">
                            {step.icon}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 px-4 bg-white/5 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-12 text-white">
                Why Choose Our AI?
              </h2>
              
              <div className="grid md:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    viewport={{ once: true }}
                    className="p-8 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/15 transition-all duration-300"
                  >
                    <div className="text-blue-400 mb-4 flex justify-center">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-white/70">
                      {feature.desc}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white">
                Ready to create your logo?
              </h2>
              <p className="text-xl text-white/70">
                Join thousands of creators who trust our AI-powered logo generator.
              </p>
              <motion.a
                href="/"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white px-12 py-4 rounded-lg text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Start Creating Now
              </motion.a>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default HowItWorksPage;