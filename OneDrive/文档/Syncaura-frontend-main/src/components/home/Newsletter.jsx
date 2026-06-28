import React, { useState } from 'react';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!email) {
      setStatus('Please enter an email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus('Please enter a valid email address');
      return;
    }

    setStatus('Subscribed successfully!');
    setEmail('');
    
    setTimeout(() => {
      setStatus('');
    }, 3000);
  };

  return (
    <section id="contact" className="w-full py-12 md:py-20 border-t" style={{ 
      backgroundColor: 'var(--bg-primary)',
      borderColor: 'var(--border-color)'
    }}>
      <div className="max-w-2xl mx-auto px-4 md:px-6 text-center">
        <h2 className="text-[34px] md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4" style={{ color: 'var(--text-primary)' }}>
          Stay in the loop
        </h2>
        <p className="text-[15px] md:text-base mb-6 md:mb-8 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          Get updates on new features, tips, and stories from teams using Flowbit.
        </p>
        
        {/* Form - Side by side */}
        <div className="flex gap-3 max-w-lg mx-auto mb-3 md:mb-4">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 px-4 py-3 border  focus:outline-none focus:ring-2 text-sm"
            style={{ 
              backgroundColor: 'var(--bg-primary)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)'
            }}
          />
          <button 
            onClick={handleSubmit}
            className="px-6 py-3 text-sm font-medium hover:opacity-90 transition-opacity whitespace-nowrap" 
            style={{ 
              backgroundColor: 'var(--accent-color)',
              color: "var(--bg-primary)"
            }}
          >
            Subscribe
          </button>
        </div>
        
        {status && (
          <p className="text-sm mb-2" style={{ 
            color: status.includes('Subscribed successfully') || status.includes('Thank you') ? '#22c55e' : '#ef4444' 
          }}>
            {status}
          </p>
        )}
        
        <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          By subscribing, you agree to our Terms and Privacy Policy.
        </p>
      </div>
    </section>
  );
};

export default Newsletter;