import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showLogo, setShowLogo] = useState(true);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminCredentials, setAdminCredentials] = useState({
    email: '',
    password: ''
  });
  
  const inputRef = useRef(null);
  const botIconUrl = '/images/new image.jpg';

  // Logo timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLogo(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Success redirect
  useEffect(() => {
    let timer;
    if (showSuccess) {
      timer = setTimeout(() => {
        localStorage.setItem('bitChatbotUser', JSON.stringify({
          name: formData.name,
          email: formData.email,
        }));
        navigate('/chat');
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [showSuccess, formData, navigate]);

  // Auto-focus and scroll into view to prevent keyboard hiding input
  useEffect(() => {
    if (inputRef.current && currentStep < 2 && !showAdminLogin) {
      inputRef.current.focus();
      // Scroll input into view when keyboard appears on mobile
      setTimeout(() => {
        inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    }
  }, [currentStep, showAdminLogin]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAdminChange = (e) => {
    setAdminCredentials({ ...adminCredentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!isStepValid()) return;
    
    setError('');
    setIsLoading(true);

    try {
      if (!formData.name || !formData.email) {
        setError('Please fill in all fields');
        setIsLoading(false);
        return;
      }
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError('Please enter a valid email address');
        setIsLoading(false);
        return;
      }

      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Login failed');
      }

      setShowSuccess(true);
    } catch (err) {
      console.error(err);
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    setError('');

    if (adminCredentials.email === 'bit.admin.chat.sathy@bitsathy.ac.in' && 
        adminCredentials.password === 'bit.chat.sathy@123') {
      localStorage.setItem('bitChatbotAdmin', 'true');
      navigate('/admin');
    } else {
      setError('Incorrect admin credentials');
    }
  };

  const handleNext = () => {
    if (!isStepValid()) return;

    if (currentStep < 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setError(''); // Clear error when going back
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0: return formData.name.trim().length > 0;
      case 1: return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
      default: return false;
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && isStepValid()) {
      if (currentStep < 1) {
        handleNext();
      } else {
        handleSubmit();
      }
    }
  };

  const renderStep = () => {
    const inputClass = "w-full px-4 sm:px-6 py-3 sm:py-4 bg-white/10 border-2 border-white/20 rounded-xl sm:rounded-2xl text-white text-base sm:text-lg placeholder:text-white/40 focus:outline-none focus:border-indigo-500 focus:bg-white/15 focus:ring-4 focus:ring-indigo-500/20 transition-all duration-300";
    
    switch (currentStep) {
      case 0:
        return (
          <div>
            <label htmlFor="name-input" className="block text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-white">
              What's your name?
            </label>
            <input 
              id="name-input"
              ref={inputRef}
              type="text" 
              name="name" 
              placeholder="Enter your full name" 
              value={formData.name} 
              onChange={handleChange} 
              onKeyPress={handleKeyPress}
              className={inputClass} 
              autoComplete="name"
            />
          </div>
        );
      case 1:
        return (
          <div>
            <label htmlFor="email-input" className="block text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-white">
              Email address
            </label>
            <input 
              id="email-input"
              ref={inputRef}
              type="email" 
              name="email" 
              placeholder="your.email@example.com" 
              value={formData.email} 
              onChange={handleChange} 
              onKeyPress={handleKeyPress}
              className={inputClass} 
              autoComplete="email"
            />
          </div>
        );
      default: return null;
    }
  };



  return (
    <div className="relative min-h-screen overflow-hidden">
      {showLogo && (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 z-50">
          <img 
            src={botIconUrl} 
            alt="BIT AI Assistant Logo" 
            className="h-20 w-20 sm:h-24 sm:w-24 rounded-full mb-6"
          />
          <div 
            className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-wider text-white px-4 text-center"
            style={{
              background: 'linear-gradient(to right, rgb(99, 102, 241), rgb(139, 92, 246), rgb(236, 72, 153))',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            BIT AI Assistant
          </div>
        </div>
      )}

      {showAdminLogin && !showLogo && (
        <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-auto z-40">
          <header className="fixed top-0 left-0 right-0 h-16 sm:h-20 bg-slate-900/95 border-b border-indigo-500/20 z-50 shadow-lg backdrop-blur-sm">
            <div className="h-full px-4 sm:px-8 flex items-center justify-between max-w-7xl mx-auto">
              <div className="flex items-center gap-2 sm:gap-3">
                <img src={botIconUrl} alt="BIT AI Assistant Logo" className="h-8 w-8 sm:h-10 sm:w-10 rounded-full" />
                <div 
                  className="text-2xl sm:text-3xl font-black text-white"
                  style={{
                    background: 'linear-gradient(to right, rgb(99, 102, 241), rgb(139, 92, 246), rgb(236, 72, 153))',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  BIT AI Assistant
                </div>
              </div>
            </div>
          </header>

          <div className="min-h-screen flex items-center justify-center px-4 pt-24 pb-8">
            <div className="w-full max-w-md">
              <div className="bg-slate-900/95 border border-white/20 rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-2xl">
                <div className="text-center mb-6 sm:mb-8">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">Admin Login</h2>
                  <p className="text-sm sm:text-base text-white/65">Enter your admin credentials</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label htmlFor="admin-email" className="block text-lg font-bold mb-3 text-white">
                      Admin Email
                    </label>
                    <input 
                      id="admin-email"
                      type="email" 
                      name="email" 
                      placeholder="admin@bitsathy.ac.in" 
                      value={adminCredentials.email} 
                      onChange={handleAdminChange}
                      className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-white/10 border-2 border-white/20 rounded-xl sm:rounded-2xl text-white text-base sm:text-lg placeholder:text-white/40 focus:outline-none focus:border-indigo-500 focus:bg-white/15 focus:ring-4 focus:ring-indigo-500/20 transition-all duration-300"
                      autoComplete="email"
                    />
                  </div>

                  <div>
                    <label htmlFor="admin-password" className="block text-lg font-bold mb-3 text-white">
                      Password
                    </label>
                    <input 
                      id="admin-password"
                      type="password" 
                      name="password" 
                      placeholder="Enter admin password" 
                      value={adminCredentials.password} 
                      onChange={handleAdminChange}
                      className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-white/10 border-2 border-white/20 rounded-xl sm:rounded-2xl text-white text-base sm:text-lg placeholder:text-white/40 focus:outline-none focus:border-indigo-500 focus:bg-white/15 focus:ring-4 focus:ring-indigo-500/20 transition-all duration-300"
                      autoComplete="current-password"
                    />
                  </div>

                  <div className="flex gap-3 sm:gap-4 pt-4">
                    <button 
                      type="button" 
                      onClick={() => {
                        setShowAdminLogin(false);
                        setAdminCredentials({ email: '', password: '' });
                        setError('');
                      }}
                      className="flex-1 px-4 sm:px-6 py-3 sm:py-4 bg-white/10 border-2 border-white/25 rounded-xl sm:rounded-2xl text-white text-base sm:text-lg font-bold hover:bg-white/15 active:bg-white/20 active:scale-95 transition-all"
                    >
                      Back
                    </button>
                    <button 
                      type="button"
                      onClick={handleAdminLogin}
                      className="flex-1 px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-xl sm:rounded-2xl text-white text-base sm:text-lg font-bold hover:shadow-2xl active:scale-95 transition-all"
                    >
                      Login
                    </button>
                  </div>

                  {error && (
                    <div className="mt-4 sm:mt-6 px-4 sm:px-5 py-3 sm:py-4 bg-red-500/20 border border-red-500/50 rounded-xl sm:rounded-2xl text-red-200 text-center text-sm sm:text-base">
                      {error}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {!showLogo && !showAdminLogin && (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          <header className="fixed top-0 left-0 right-0 h-16 sm:h-20 bg-slate-900/95 border-b border-indigo-500/20 z-50 shadow-lg backdrop-blur-sm">
            <div className="h-full px-4 sm:px-8 flex items-center justify-between max-w-7xl mx-auto">
              <div className="flex items-center gap-2 sm:gap-3">
                <img src={botIconUrl} alt="BIT AI Assistant Logo" className="h-8 w-8 sm:h-10 sm:w-10 rounded-full" />
                <div 
                  className="text-2xl sm:text-3xl font-black text-white"
                  style={{
                    background: 'linear-gradient(to right, rgb(99, 102, 241), rgb(139, 92, 246), rgb(236, 72, 153))',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  BIT AI Assistant
                </div>
              </div>
              <button
                onClick={() => setShowAdminLogin(true)}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm font-semibold hover:bg-white/15 active:scale-95 transition-all"
              >
                Admin Login
              </button>
            </div>
          </header>

          <div className="pt-20 sm:pt-24 pb-32 sm:pb-40 px-4 overflow-y-auto">
            <div className="w-full max-w-6xl mx-auto">
              
              <div className="text-center mb-8 sm:mb-12">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black mb-3 sm:mb-4 text-white px-2">
                  Welcome to BIT AI Assistant
                </h1>
                <h2 
                  className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-semibold text-white mb-8 sm:mb-12 px-2"
                  style={{
                    background: 'linear-gradient(to right, rgb(165, 180, 252), rgb(249, 168, 212))',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  Bannari Amman Institute of Technology
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
                  {[
                    { 
                      icon: '💬', 
                      title: 'Instant Support', 
                      desc: 'Get immediate answers to your queries about admissions, courses, and campus facilities 24/7.' 
                    },
                    { 
                      icon: '🎓', 
                      title: 'Academic Guidance', 
                      desc: 'Explore programs, curriculum details, and receive personalized academic counseling.' 
                    },
                    { 
                      icon: '🚀', 
                      title: 'Smart Assistant', 
                      desc: 'AI-powered chatbot designed specifically for BIT community needs and inquiries.' 
                    }
                  ].map((f, i) => (
                    <div 
                      key={i} 
                      className="bg-white/5 border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 hover:bg-white/10 hover:border-indigo-500/60 transition-all duration-500 active:scale-95"
                    >
                      <div className="text-4xl sm:text-5xl lg:text-6xl mb-3 sm:mb-4 leading-none flex items-center justify-center">
                        {f.icon}
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-white">{f.title}</h3>
                      <p className="text-sm sm:text-base text-white/75 leading-relaxed">{f.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="max-w-xl mx-auto mb-8">
                <div className="bg-slate-900/95 border border-white/20 rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-2xl">
                  
                  <div className="text-center mb-6 sm:mb-8">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">Get Started</h2>
                    <p className="text-sm sm:text-base text-white/65">Fill in your details to begin your journey</p>
                  </div>

                  <div className="flex gap-2 sm:gap-3 mb-6 sm:mb-8 justify-center">
                    {[0, 1].map((s) => (
                      <div 
                        key={s} 
                        className={`h-1.5 w-12 sm:w-14 rounded-full transition-all duration-300 ${
                          currentStep >= s ? 'bg-gradient-to-r from-indigo-500 to-violet-500' : 'bg-white/15'
                        }`}
                      />
                    ))}
                  </div>

                  <div className="mb-6 sm:mb-8">{renderStep()}</div>

                  <div className="flex gap-3 sm:gap-4">
                    {currentStep > 0 && (
                      <button 
                        type="button" 
                        onClick={handlePrevious}
                        className="flex-1 px-4 sm:px-6 py-3 sm:py-4 bg-white/10 border-2 border-white/25 rounded-xl sm:rounded-2xl text-white text-base sm:text-lg font-bold hover:bg-white/15 active:bg-white/20 active:scale-95 transition-all"
                      >
                        Back
                      </button>
                    )}
                    {currentStep < 1 ? (
                      <button 
                        type="button" 
                        onClick={handleNext} 
                        disabled={!isStepValid()}
                        className="flex-1 px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-xl sm:rounded-2xl text-white text-base sm:text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-2"
                      >
                        Next
                      </button>
                    ) : (
                      <button 
                        type="button"
                        onClick={handleSubmit}
                        disabled={!isStepValid() || isLoading} 
                        className="flex-1 px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-xl sm:rounded-2xl text-white text-base sm:text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-95 transition-all"
                      >
                        {isLoading ? ( 
                          <>
                            <div className="w-4 sm:w-5 h-4 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Submitting...</span>
                          </>
                        ) : 'Submit'}
                      </button>
                    )}
                  </div>

                  {error && (
                    <div className="mt-4 sm:mt-6 px-4 sm:px-5 py-3 sm:py-4 bg-red-500/20 border border-red-500/50 rounded-xl sm:rounded-2xl text-red-200 text-center text-sm sm:text-base">
                      {error}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {showSuccess && (
            <div className="fixed top-20 sm:top-24 left-1/2 -translate-x-1/2 max-w-[90vw] sm:max-w-md bg-green-500 text-white px-6 sm:px-12 py-4 sm:py-6 rounded-xl sm:rounded-2xl shadow-2xl font-bold z-50 flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base">
              <span className="text-xl flex-shrink-0">✓</span> 
              <span>Registration successful! Redirecting...</span>
            </div>
          )}

          

          <style>{`
            @media (min-width: 375px) {
              .xs\\:grid-cols-3 {
                grid-template-columns: repeat(3, minmax(0, 1fr));
              }
            }
          `}</style>
        </div>
      )}
    </div>
  );
};

export default LandingPage;