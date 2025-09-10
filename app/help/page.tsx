'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { 
  Search, 
  ChevronDown, 
  ChevronRight, 
  HelpCircle, 
  MessageCircle, 
  Mail, 
  Phone,
  BookOpen,
  Zap,
  Palette,
  Download,
  CreditCard,
  Users,
  Settings,
  Shield,
  Clock
} from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  // Getting Started
  {
    id: '1',
    question: 'How do I create my first logo?',
    answer: 'Simply click "Create Brand!" on our homepage, select your industry, choose your brand personality, pick an icon and colors, then hit "Create Logo". Our AI will generate multiple variations for you to choose from.',
    category: 'getting-started'
  },
  {
    id: '2',
    question: 'Do I need design experience to use Lola Gen 2.0?',
    answer: 'Not at all! Our platform is designed for everyone. Just answer a few simple questions about your brand, and our AI will handle the complex design work for you.',
    category: 'getting-started'
  },
  {
    id: '3',
    question: 'How long does it take to create a logo?',
    answer: 'The entire process takes less than 2 minutes! You can have professional logo variations ready in under 50 seconds after answering our quick questionnaire.',
    category: 'getting-started'
  },

  // Design & Customization
  {
    id: '4',
    question: 'Can I customize my logo after it\'s created?',
    answer: 'Yes! You can edit colors, fonts, layouts, and icons even after your logo is generated. Use our built-in editor to make adjustments until it\'s perfect.',
    category: 'design'
  },
  {
    id: '5',
    question: 'How many logo variations will I get?',
    answer: 'You\'ll receive multiple logo variations based on your selections. Each variation explores different combinations of your chosen elements to give you the best options.',
    category: 'design'
  },
  {
    id: '6',
    question: 'Can I change the font style?',
    answer: 'Absolutely! We offer 4 typography categories (Modern, Elegant, Bold, Heritage) with multiple font options in each category. You can switch between them anytime.',
    category: 'design'
  },

  // Downloads & Files
  {
    id: '7',
    question: 'What file formats do I get?',
    answer: 'This depends on your package: Basic includes PNG files, Professional adds SVG and CMYK versions, and Premium includes Adobe AI files and brand guidelines.',
    category: 'downloads'
  },
  {
    id: '8',
    question: 'Can I use my logo commercially?',
    answer: 'Yes! All our Professional and Premium packages include commercial use licenses. The Basic package is for personal use only.',
    category: 'downloads'
  },
  {
    id: '9',
    question: 'What resolution are the logo files?',
    answer: 'Our PNG files are high-resolution at 3000x3000px, perfect for both digital use and printing. SVG files are vector-based and scale infinitely.',
    category: 'downloads'
  },

  // Pricing & Billing
  {
    id: '10',
    question: 'How much does it cost to create a logo?',
    answer: 'We offer three packages: Basic ($29), Professional ($59), and Premium ($99). Each includes different file formats and usage rights. You only pay when you\'re ready to download.',
    category: 'pricing'
  },
  {
    id: '11',
    question: 'Is there a free trial?',
    answer: 'You can create and preview your logo completely free! You only pay when you want to download the high-resolution files.',
    category: 'pricing'
  },
  {
    id: '12',
    question: 'Do you offer refunds?',
    answer: 'Yes, we offer a 30-day money-back guarantee. If you\'re not satisfied with your logo files, contact our support team for a full refund.',
    category: 'pricing'
  },

  // Technical Support
  {
    id: '13',
    question: 'My logo download isn\'t working. What should I do?',
    answer: 'First, check your internet connection and try again. If the problem persists, clear your browser cache or try a different browser. Contact support if you still have issues.',
    category: 'technical'
  },
  {
    id: '14',
    question: 'Can I access my logos on different devices?',
    answer: 'Yes! If you create an account, your logos are saved in the cloud and accessible from any device. You can sign in from anywhere to access your designs.',
    category: 'technical'
  },
  {
    id: '15',
    question: 'What browsers do you support?',
    answer: 'Lola Gen 2.0 works best on modern browsers including Chrome, Firefox, Safari, and Edge. We recommend using the latest version for the best experience.',
    category: 'technical'
  }
];

const categories = [
  { id: 'all', name: 'All Topics', icon: BookOpen, count: faqData.length },
  { id: 'getting-started', name: 'Getting Started', icon: Zap, count: faqData.filter(item => item.category === 'getting-started').length },
  { id: 'design', name: 'Design & Customization', icon: Palette, count: faqData.filter(item => item.category === 'design').length },
  { id: 'downloads', name: 'Downloads & Files', icon: Download, count: faqData.filter(item => item.category === 'downloads').length },
  { id: 'pricing', name: 'Pricing & Billing', icon: CreditCard, count: faqData.filter(item => item.category === 'pricing').length },
  { id: 'technical', name: 'Technical Support', icon: Settings, count: faqData.filter(item => item.category === 'technical').length }
];

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  const filteredFAQs = faqData.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFAQ = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
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
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-6"
          >
            <HelpCircle className="w-16 h-16 text-blue-400 mx-auto mb-4" />
          </motion.div>
          
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6 leading-tight py-2">
            Help Center
          </h1>
          <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-3xl mx-auto">
            Get instant answers to your questions about creating amazing logos with Lola Gen 2.0
          </p>

          {/* Search Bar */}
          <motion.div 
            className="relative max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for help articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Categories */}
      <motion.section 
        className="pb-12 px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category, index) => (
              <motion.button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`p-6 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                  selectedCategory === category.id
                    ? 'border-blue-500 bg-gradient-to-br from-blue-500/20 to-purple-600/20 shadow-lg shadow-blue-500/25'
                    : 'border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <category.icon className={`w-8 h-8 ${selectedCategory === category.id ? 'text-blue-400' : 'text-white/60'}`} />
                  <span className={`text-sm px-2 py-1 rounded-full ${selectedCategory === category.id ? 'bg-blue-400/20 text-blue-300' : 'bg-white/10 text-white/50'}`}>
                    {category.count}
                  </span>
                </div>
                <h3 className="text-left font-semibold text-white mb-1">{category.name}</h3>
                <p className="text-left text-sm text-white/60">
                  {category.id === 'all' && 'Browse all available help topics'}
                  {category.id === 'getting-started' && 'Learn the basics of logo creation'}
                  {category.id === 'design' && 'Customize and perfect your design'}
                  {category.id === 'downloads' && 'Download and use your logo files'}
                  {category.id === 'pricing' && 'Understand our pricing and packages'}
                  {category.id === 'technical' && 'Solve technical issues and bugs'}
                </p>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.section>

      {/* FAQ Section */}
      <motion.section 
        className="pb-20 px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              {selectedCategory === 'all' ? 'Frequently Asked Questions' : 
               categories.find(cat => cat.id === selectedCategory)?.name}
            </h2>
            <p className="text-white/60">
              {filteredFAQs.length} {filteredFAQs.length === 1 ? 'article' : 'articles'} found
              {searchQuery && ` for "${searchQuery}"`}
            </p>
          </div>

          <div className="space-y-4">
            <AnimatePresence>
              {filteredFAQs.map((faq, index) => (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => toggleFAQ(faq.id)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
                  >
                    <h3 className="font-semibold text-white pr-4">{faq.question}</h3>
                    {expandedFAQ === faq.id ? (
                      <ChevronDown className="w-5 h-5 text-white/60 flex-shrink-0" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-white/60 flex-shrink-0" />
                    )}
                  </button>
                  
                  <AnimatePresence>
                    {expandedFAQ === faq.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-white/10"
                      >
                        <div className="px-6 py-4">
                          <p className="text-white/80 leading-relaxed">{faq.answer}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredFAQs.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Search className="w-16 h-16 text-white/20 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No articles found</h3>
              <p className="text-white/60 mb-6">
                Try adjusting your search terms or browse a different category.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium transition-all transform hover:scale-105"
              >
                Show All Articles
              </button>
            </motion.div>
          )}
        </div>
      </motion.section>

      {/* Contact Support Section */}
      <motion.section 
        className="pb-20 px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-600/10 backdrop-blur-sm border border-white/20 rounded-xl p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Still need help?</h2>
            <p className="text-white/70 mb-6 max-w-2xl mx-auto">
              Can&apos;t find what you&apos;re looking for? Our support team is here to help you create the perfect logo.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a
                href="mailto:support@lologen.com"
                className="flex items-center gap-3 p-4 bg-white/5 hover:bg-white/10 border border-white/20 rounded-lg transition-all transform hover:scale-105"
              >
                <Mail className="w-6 h-6 text-blue-400" />
                <div className="text-left">
                  <div className="font-semibold text-white">Email Support</div>
                  <div className="text-sm text-white/60">support@lologen.com</div>
                </div>
              </a>
              
              <a
                href="#"
                className="flex items-center gap-3 p-4 bg-white/5 hover:bg-white/10 border border-white/20 rounded-lg transition-all transform hover:scale-105"
              >
                <MessageCircle className="w-6 h-6 text-green-400" />
                <div className="text-left">
                  <div className="font-semibold text-white">Live Chat</div>
                  <div className="text-sm text-white/60">Available 24/7</div>
                </div>
              </a>
              
              <div className="flex items-center gap-3 p-4 bg-white/5 border border-white/20 rounded-lg">
                <Clock className="w-6 h-6 text-purple-400" />
                <div className="text-left">
                  <div className="font-semibold text-white">Response Time</div>
                  <div className="text-sm text-white/60">Within 2 hours</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      <Footer />
    </div>
  );
}