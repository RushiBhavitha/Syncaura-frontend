import React from 'react';
import ctaTeamMeeting from "../../assets/cta-team-meeting.png";

const CTABanner = () => {
  return (
    <section className="w-full py-8 md:py-16" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="max-w-8xl mx-auto px-4 md:px-6 lg:px-24">
        <div className="relative h-[300px] md:h-80 lg:h-87 overflow-hidden rounded-xl md:rounded-lg">
          {/* Background Image */}
          <div className="absolute inset-0" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <div className="w-full h-full bg-gradient-to-r from-blue-600/20 to-blue-600/10 flex items-center justify-center">
              <img
                src={ctaTeamMeeting}
                alt="Team meeting"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/50" />

          {/* Content */}
          <div className="relative h-full flex flex-col items-center justify-center text-center px-6 md:px-6 py-12 md:py-20 space-y-5 md:space-y-6">
            <h2 className="text-[28px] md:text-3xl lg:text-5xl font-bold text-white max-w-2xl leading-tight">
              Work smarter, faster, together
            </h2>
            <p className="text-[15px] md:text-base lg:text-lg text-white/90 max-w-xl">
              Manage tasks, chat, meet, and track performance all in one place.
            </p>
            
            {/* Buttons - SIDE BY SIDE on mobile! */}
            <div className="flex gap-3 md:gap-4 w-full max-w-md">
              <button className="flex-1 px-6 py-3 bg-white text-gray-900 text-sm font-medium  hover:opacity-90 transition-colors">
                Get started
              </button>
              <button className="flex-1 px-6 py-3 border-2 border-white bg-transparent text-white text-sm font-medium  hover:bg-white/10 transition-colors">
                Learn more
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTABanner;