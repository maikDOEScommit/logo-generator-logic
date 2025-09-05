import { Heart, Zap, Github, Twitter, Mail } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-b from-gray-900/50 to-black border-t border-white/10 mt-20">
      {/* Decorative gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
      
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Zap className="text-white" size={18} />
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Lola Gen 2.0
              </h3>
            </div>
            <p className="text-white/70 text-lg leading-relaxed mb-6 max-w-md">
              Create stunning logos in seconds with AI-powered design. 
              Professional quality, instant results.
            </p>
            <div className="flex items-center gap-2 text-white/60">
              <span>Made with</span>
              <Heart className="text-red-400" size={16} />
              <span>for creators worldwide</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-lg">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { name: 'Home', href: '/' },
                { name: 'How it Works', href: '/how-it-works' },
                { name: 'Pricing', href: '#' },
                { name: 'Examples', href: '#' },
              ].map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href} 
                    className="text-white/60 hover:text-white transition-colors duration-200 flex items-center group"
                  >
                    <span className="w-0 h-px bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-4 transition-all duration-200 mr-0 group-hover:mr-2"></span>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-lg">Support</h4>
            <ul className="space-y-3">
              {[
                { name: 'Help Center', href: '#' },
                { name: 'Contact Us', href: '#' },
                { name: 'Privacy Policy', href: '#' },
                { name: 'Terms of Service', href: '#' },
              ].map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href} 
                    className="text-white/60 hover:text-white transition-colors duration-200 flex items-center group"
                  >
                    <span className="w-0 h-px bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-4 transition-all duration-200 mr-0 group-hover:mr-2"></span>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social Links & Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-12 mt-12 border-t border-white/10">
          <div className="flex items-center gap-6 mb-4 md:mb-0">
            {[
              { icon: Twitter, href: '#', label: 'Twitter' },
              { icon: Github, href: '#', label: 'GitHub' },
              { icon: Mail, href: '#', label: 'Email' },
            ].map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                className="w-10 h-10 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110 group"
                aria-label={label}
              >
                <Icon className="text-white/60 group-hover:text-white" size={18} />
              </a>
            ))}
          </div>
          
          <div className="text-center md:text-right">
            <p className="text-white/50 text-sm">
              © 2024 Lola Gen 2.0. All rights reserved.
            </p>
            <p className="text-white/40 text-xs mt-1">
              Crafted with precision and passion
            </p>
          </div>
        </div>
      </div>

      {/* Subtle bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/50 to-transparent pointer-events-none"></div>
    </footer>
  );
};