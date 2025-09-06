'use client';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Check, Crown, Zap, Download, Star, Shield, Rocket } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function PricingPage() {
  const plans = [
    {
      name: 'Starter',
      price: '$9',
      period: '/logo',
      description: 'Perfect for individuals and small projects',
      features: [
        'High-resolution PNG (3000x3000px)',
        'Transparent background version',
        'RGB color format',
        'Personal use license',
        'Instant download',
        '30-day money-back guarantee'
      ],
      icon: Download,
      popular: false,
      cta: 'Get Started',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      name: 'Professional',
      price: '$29',
      period: '/logo',
      description: 'Best for businesses and professionals',
      features: [
        'Everything in Starter',
        'Vector SVG file (infinitely scalable)',
        'CMYK version for printing',
        'Black & white variations',
        'Commercial use license',
        'Social media kit (Facebook, Instagram, etc.)',
        'Favicon for website',
        'Priority support'
      ],
      icon: Zap,
      popular: true,
      cta: 'Most Popular',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      name: 'Enterprise',
      price: '$99',
      period: '/logo',
      description: 'Complete branding solution for enterprises',
      features: [
        'Everything in Professional',
        'Adobe Illustrator AI file',
        'Brand guidelines PDF',
        'Business card templates',
        'Letterhead template',
        'Multiple color variations',
        'Extended commercial license',
        'Custom revisions (up to 3)',
        'Dedicated account manager'
      ],
      icon: Crown,
      popular: false,
      cta: 'Get Enterprise',
      gradient: 'from-orange-500 to-red-500'
    }
  ];

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <Header />
      
      {/* Hero Section */}
      <motion.section 
        className="pt-32 pb-20 px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6">
            Simple Pricing
          </h1>
          <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-3xl mx-auto">
            Create professional logos in minutes. No subscriptions, no hidden fees. 
            Pay once, own forever.
          </p>
          
          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-white/60 mb-16">
            <div className="flex items-center gap-2">
              <Shield size={20} />
              <span>Money-back guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <Download size={20} />
              <span>Instant download</span>
            </div>
            <div className="flex items-center gap-2">
              <Star size={20} />
              <span>4.9/5 rating</span>
            </div>
            <div className="flex items-center gap-2">
              <Rocket size={20} />
              <span>50,000+ logos created</span>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Pricing Cards */}
      <motion.section 
        className="pb-20 px-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                variants={itemVariants}
                className={`relative bg-white/10 backdrop-blur-lg rounded-2xl p-8 border transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                  plan.popular 
                    ? 'border-purple-500 shadow-purple-500/20 shadow-xl' 
                    : 'border-white/20 hover:border-white/40'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <div className={`w-16 h-16 bg-gradient-to-r ${plan.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                    <plan.icon className="text-white" size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-white/70 mb-4">{plan.description}</p>
                  <div className="flex items-baseline justify-center">
                    <span className="text-5xl font-bold text-white">{plan.price}</span>
                    <span className="text-white/70 ml-2">{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <Check className="text-green-400 flex-shrink-0 mt-0.5" size={18} />
                      <span className="text-white/90">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button className={`w-full py-4 px-6 rounded-xl font-bold text-white transition-all duration-300 transform hover:scale-105 ${
                  plan.popular
                    ? `bg-gradient-to-r ${plan.gradient} shadow-lg hover:shadow-xl`
                    : 'bg-white/20 hover:bg-white/30 backdrop-blur-sm'
                }`}>
                  {plan.cta}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* FAQ Section */}
      <motion.section 
        className="pb-20 px-4"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-white mb-16">
            Frequently Asked Questions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                question: "What file formats do I get?",
                answer: "Depending on your plan, you'll receive PNG, SVG, AI, and other formats. All files are high-resolution and optimized for both web and print use."
              },
              {
                question: "Can I use my logo commercially?",
                answer: "Yes! Professional and Enterprise plans include commercial use licenses. You can use your logo for business purposes without any restrictions."
              },
              {
                question: "What if I don't like my logo?",
                answer: "We offer a 30-day money-back guarantee. If you're not satisfied with your logo, we'll refund your purchase, no questions asked."
              },
              {
                question: "How quickly will I receive my files?",
                answer: "All downloads are instant! Once you complete your purchase, you'll immediately receive download links for all your files."
              },
              {
                question: "Can I modify my logo after purchase?",
                answer: "Yes! You'll receive vector files (SVG, AI) that can be easily modified. Enterprise customers also get up to 3 custom revisions included."
              },
              {
                question: "Do you offer bulk discounts?",
                answer: "Yes! Contact our sales team for bulk pricing if you need multiple logos for your organization or clients."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <h3 className="text-lg font-bold text-white mb-3">{faq.question}</h3>
                <p className="text-white/80 leading-relaxed">{faq.answer}</p>
              </motion.div>
            ))}
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
          <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-lg rounded-2xl p-12 border border-white/20">
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to create your perfect logo?
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Join thousands of satisfied customers who have created amazing logos with our platform.
            </p>
            <Link href="/">
              <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-12 py-4 rounded-xl text-xl font-bold transition-all transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25">
                Start Creating Now
              </button>
            </Link>
          </div>
        </div>
      </motion.section>
      
      <Footer />
    </div>
  );
}