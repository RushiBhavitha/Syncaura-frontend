import React from 'react';
import heroTeam from "../../assets/hero-team.png";

const Hero = () => {
  const scrollToFeatures = (e) => {
    e.preventDefault();
    const element = document.getElementById('features');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="w-full pt-6 md:pt-16 pb-6 md:pb-8" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Text Content */}
          <div className="space-y-4 md:space-y-6">
            {/* Mobile: Single line | Desktop: Line break */}
            <h1 className="text-[28px] md:text-4xl lg:text-5xl font-bold leading-tight" style={{ color: 'var(--text-primary)' }}>
              <span className="md:hidden">Welcome to Flowbit</span>
              <span className="hidden md:inline">Welcome to<br />Flowbit</span>
            </h1>

            <p className="text-[14px] md:text-lg lg:text-xl leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              <span className="md:hidden">Flowbit brings projects, tasks, chat, meetings, documents and performance insights into one seamless workspace. Create your first project and start organizing your workflow today.
            </span><span className="hidden md:inline">Flowbit brings projects, tasks, chat, <br />meetings, documents and performance <br /> insights into one seamless workspace. <br />Create your first project and start organizing <br /> your workflow today.
            </span></p>

            {/* Buttons - Exact Figma Layout */}
            <div className="flex justify-center md:justify-start gap-3 pt-6">
  <button
    className="px-8 md:px-5 py-2.5 text-sm font-medium hover:opacity-90 transition-opacity"
    style={{ 
      backgroundColor: 'var(--accent-color)',
      color: 'var(--bg-primary)'
    }}
  >
    Get started
  </button>

  <button
    onClick={scrollToFeatures}
    className="px-8 md:px-5 py-2.5 border text-sm font-medium hover:opacity-70 transition-opacity"
    style={{ 
      borderColor: 'var(--border-color)',
      color: 'var(--text-primary)'
    }}
  >
    Features
  </button>
</div>

          </div>

          {/* Image */}
          <div className="flex justify-center md:justify-start mt-6 md:mt-0">
            <div className="w-full max-w-sm md:max-w-xl">
              <img
                src={heroTeam}
                alt="Team collaboration illustration"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;