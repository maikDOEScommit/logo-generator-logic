'use client';

import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { motion } from 'framer-motion';
import { 
  Palette, Code, Heart, Zap, Leaf, Coffee, Camera, Music, 
  Star, Shield, Sun, Moon, Flame, Building, Rocket, 
  Lightbulb, Gamepad2, Mountain, TreePine, Flower2 
} from 'lucide-react';
import Link from 'next/link';

export default function ExamplesPage() {
  const logoExamples = [
    {
      name: 'TechFlow',
      slogan: 'Innovation Simplified',
      icon: Zap,
      colors: ['#3B82F6', '#FFFFFF', '#1E40AF'],
      industry: 'Technology',
      layout: 'horizontal'
    },
    {
      name: 'GreenLeaf',
      slogan: 'Sustainable Living',
      icon: Leaf,
      colors: ['#10B981', '#FFFFFF', '#065F46'],
      industry: 'Eco-Friendly',
      layout: 'vertical'
    },
    {
      name: 'Cafe Luna',
      slogan: 'Artisan Coffee',
      icon: Coffee,
      colors: ['#92400E', '#F59E0B', '#FFFFFF'],
      industry: 'Food & Beverage',
      layout: 'horizontal'
    },
    {
      name: 'Creative Studio',
      slogan: 'Where Ideas Come to Life',
      icon: Palette,
      colors: ['#8B5CF6', '#A78BFA', '#FFFFFF'],
      industry: 'Design Agency',
      layout: 'vertical'
    },
    {
      name: 'CodeCraft',
      slogan: 'Building the Future',
      icon: Code,
      colors: ['#1F2937', '#6B7280', '#FFFFFF'],
      industry: 'Software Development',
      layout: 'horizontal'
    },
    {
      name: 'HeartCare',
      slogan: 'Compassionate Healthcare',
      icon: Heart,
      colors: ['#EF4444', '#FCA5A5', '#FFFFFF'],
      industry: 'Healthcare',
      layout: 'circle'
    },
    {
      name: 'Snap Studio',
      slogan: 'Capturing Moments',
      icon: Camera,
      colors: ['#374151', '#9CA3AF', '#FFFFFF'],
      industry: 'Photography',
      layout: 'vertical'
    },
    {
      name: 'SoundWave',
      slogan: 'Music for Everyone',
      icon: Music,
      colors: ['#7C3AED', '#C4B5FD', '#FFFFFF'],
      industry: 'Music & Audio',
      layout: 'horizontal'
    },
    {
      name: 'StarPoint',
      slogan: 'Excellence in Service',
      icon: Star,
      colors: ['#F59E0B', '#FCD34D', '#1F2937'],
      industry: 'Consulting',
      layout: 'circle'
    },
    {
      name: 'SafeGuard',
      slogan: 'Your Security Partner',
      icon: Shield,
      colors: ['#1E40AF', '#3B82F6', '#FFFFFF'],
      industry: 'Security',
      layout: 'vertical'
    },
    {
      name: 'Sunrise Ventures',
      slogan: 'New Beginnings',
      icon: Sun,
      colors: ['#F97316', '#FDBA74', '#FFFFFF'],
      industry: 'Investment',
      layout: 'horizontal'
    },
    {
      name: 'Moonlight Spa',
      slogan: 'Relax & Rejuvenate',
      icon: Moon,
      colors: ['#6366F1', '#A5B4FC', '#FFFFFF'],
      industry: 'Wellness',
      layout: 'circle'
    }
  ];

  const industries = [
    { name: 'All', filter: 'all' },
    { name: 'Technology', filter: 'Technology' },
    { name: 'Healthcare', filter: 'Healthcare' },
    { name: 'Food & Beverage', filter: 'Food & Beverage' },
    { name: 'Design', filter: 'Design Agency' },
    { name: 'Consulting', filter: 'Consulting' }
  ];

  const [selectedFilter, setSelectedFilter] = React.useState('all');
  const [filteredLogos, setFilteredLogos] = React.useState(logoExamples);

  React.useEffect(() => {
    if (selectedFilter === 'all') {
      setFilteredLogos(logoExamples);
    } else {
      setFilteredLogos(logoExamples.filter(logo => logo.industry === selectedFilter));
    }
  }, [selectedFilter, logoExamples]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const renderLogo = (logo: typeof logoExamples[0], index: number) => {
    const IconComponent = logo.icon;
    
    return (
      <motion.div
        key={logo.name}
        variants={itemVariants}
        className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:scale-105 hover:shadow-2xl group shadow-lg"
      >
        <div className="bg-white rounded-xl p-8 mb-6 flex items-center justify-center min-h-[200px] shadow-xl">
          {logo.layout === 'horizontal' ? (
            <div className="flex items-center gap-4">
              <IconComponent size={48} color={logo.colors[0]} />
              <div className="text-left">
                <h3 className="text-2xl font-bold" style={{ color: logo.colors[0] }}>
                  {logo.name}
                </h3>
                <p className="text-sm" style={{ color: logo.colors[2] || '#666' }}>
                  {logo.slogan}
                </p>
              </div>
            </div>
          ) : logo.layout === 'circle' ? (
            <div className="relative flex items-center justify-center">
              <div 
                className="absolute inset-0 opacity-20 rounded-full flex items-center justify-center"
                style={{ backgroundColor: logo.colors[0] }}
              >
                <div className="w-32 h-32 rounded-full border-4" style={{ borderColor: logo.colors[0] }}></div>
              </div>
              <div className="relative z-10 text-center">
                <IconComponent size={40} color={logo.colors[0]} className="mx-auto mb-2" />
                <h3 className="text-lg font-bold" style={{ color: logo.colors[0] }}>
                  {logo.name}
                </h3>
                <p className="text-xs" style={{ color: logo.colors[2] || '#666' }}>
                  {logo.slogan}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <IconComponent size={48} color={logo.colors[0]} className="mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2" style={{ color: logo.colors[0] }}>
                {logo.name}
              </h3>
              <p className="text-sm" style={{ color: logo.colors[2] || '#666' }}>
                {logo.slogan}
              </p>
            </div>
          )}
        </div>
        
        <div className="text-center">
          <div className="flex justify-center gap-1 mb-3">
            {logo.colors.map((color, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full border-2 border-gray-200 shadow-sm"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <span className="text-gray-600 text-sm font-medium">{logo.industry}</span>
          <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:scale-105 transition-transform">
              Create Similar
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Header />
      
      {/* Hero Section */}
      <motion.section 
        className="pt-32 pb-20 px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6 leading-tight py-2">
            Logo Examples
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-12 max-w-4xl mx-auto">
            Get inspired by our collection of professional logos created with Lola Gen 2.0. 
            From tech startups to cozy cafes, find the perfect style for your brand.
          </p>
        </div>
      </motion.section>

      {/* Filter Section */}
      <motion.section 
        className="pb-12 px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {industries.map((industry) => (
              <button
                key={industry.filter}
                onClick={() => setSelectedFilter(industry.filter)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  selectedFilter === industry.filter
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                    : 'bg-white/80 text-gray-700 hover:bg-white hover:text-gray-900 shadow-sm'
                }`}
              >
                {industry.name}
              </button>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Examples Grid */}
      <motion.section 
        className="pb-20 px-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredLogos.map((logo, index) => renderLogo(logo, index))}
          </div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section 
        className="pb-20 px-4"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-12 border border-gray-200 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <h3 className="text-4xl font-bold text-gray-800 mb-2">50,000+</h3>
                <p className="text-gray-600">Logos Created</p>
              </div>
              <div>
                <h3 className="text-4xl font-bold text-gray-800 mb-2">4.9/5</h3>
                <p className="text-gray-600">Customer Rating</p>
              </div>
              <div>
                <h3 className="text-4xl font-bold text-gray-800 mb-2">100+</h3>
                <p className="text-gray-600">Industries Served</p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        className="pb-20 px-4"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-blue-100/80 to-purple-100/80 backdrop-blur-lg rounded-2xl p-12 border border-gray-200 shadow-xl">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Ready to create your logo?
            </h2>
            <p className="text-xl text-gray-700 mb-8">
              Join thousands of businesses who trust Lola Gen 2.0 for their branding needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/">
                <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-bold transition-all transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25">
                  Start Creating
                </button>
              </Link>
              <Link href="/pricing">
                <button className="bg-white/80 hover:bg-white text-gray-800 px-8 py-4 rounded-xl text-lg font-bold transition-all transform hover:scale-105 border border-gray-300 shadow-md">
                  View Pricing
                </button>
              </Link>
            </div>
          </div>
        </div>
      </motion.section>
      
      <Footer />
    </div>
  );
}