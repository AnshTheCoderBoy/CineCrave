import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import BlurCarousel from '@/components/BlurCarousel';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const NotForAllAgePage: React.FC = () => {
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation();
  const { ref: buttonsRef, isVisible: buttonsVisible } = useScrollAnimation();
  const { ref: carouselsRef, isVisible: carouselsVisible } = useScrollAnimation();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Page Header */}
        <section ref={titleRef} className="bg-gradient-to-r from-primary/20 to-secondary/20 py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className={`text-4xl font-bold text-foreground mb-4 transition-all duration-800 ${
              titleVisible ? 'animate-fade-in-up' : 'scroll-hidden'
            }`}>Not for all age</h1>
            <p className={`text-muted-foreground text-lg transition-all duration-800 ${
              titleVisible ? 'animate-fade-in-up' : 'scroll-hidden'
            }`}>Mature content from Asian cinema</p>
          </div>
        </section>

        {/* Navigation Buttons */}
        <section ref={buttonsRef} className="py-6">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className={`grid grid-cols-3 gap-4 max-w-2xl mx-auto transition-all duration-800 ${
              buttonsVisible ? 'animate-fade-in-up' : 'scroll-hidden'
            }`}>
              <Link to="/category/japanese" className="group">
                <div className="bg-gradient-to-br from-red-500/20 to-red-700/20 hover:from-red-500/30 hover:to-red-700/30 rounded-xl p-4 text-center transition-all duration-300 hover:scale-105 border border-red-500/30">
                  <div className="text-2xl mb-2">🇯🇵</div>
                  <div className="text-sm font-semibold text-foreground group-hover:text-red-400 transition-colors">Japanese</div>
                </div>
              </Link>
              <Link to="/category/chinese" className="group">
                <div className="bg-gradient-to-br from-yellow-500/20 to-red-600/20 hover:from-yellow-500/30 hover:to-red-600/30 rounded-xl p-4 text-center transition-all duration-300 hover:scale-105 border border-yellow-500/30">
                  <div className="text-2xl mb-2">🇨🇳</div>
                  <div className="text-sm font-semibold text-foreground group-hover:text-yellow-400 transition-colors">Chinese</div>
                </div>
              </Link>
              <Link to="/category/korean" className="group">
                <div className="bg-gradient-to-br from-blue-500/20 to-red-500/20 hover:from-blue-500/30 hover:to-red-500/30 rounded-xl p-4 text-center transition-all duration-300 hover:scale-105 border border-blue-500/30">
                  <div className="text-2xl mb-2">🇰🇷</div>
                  <div className="text-sm font-semibold text-foreground group-hover:text-blue-400 transition-colors">Korean</div>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Category Carousels */}
        <section className="py-8 space-y-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <BlurCarousel 
              category="Japanese" 
              displayName="Japanese Cinema" 
              icon="🇯🇵" 
              flagCode="JP"
            />
            <BlurCarousel 
              category="Chinese" 
              displayName="Chinese Cinema" 
              icon="🇨🇳" 
              flagCode="CN"
            />
            <BlurCarousel 
              category="Korean" 
              displayName="Korean Cinema" 
              icon="🇰🇷" 
              flagCode="KR"
            />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2026 CineCrave | Data by TMDb | Crafted with ❤️ by Anshul Wadbudhe</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default NotForAllAgePage;