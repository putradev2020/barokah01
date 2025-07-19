import React, { useState, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Header from './components/Header';
import Footer from './components/Footer';
import FloatingSocialButtons from './components/FloatingSocialButtons';
import AdminLogin from './components/AdminLogin';
import Landing from './components/Landing';
import Services from './components/Services';
import Gallery from './components/Gallery';
import BookingForm from './components/BookingForm';
import CheckStatus from './components/CheckStatus';
import AdminDashboard from './components/AdminDashboard';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import LoadingScreen from './components/LoadingScreen';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isLoading, setIsLoading] = useState(true);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  useEffect(() => {
    // Check admin authentication
    const adminAuth = localStorage.getItem('admin_authenticated');
    setIsAdminAuthenticated(adminAuth === 'true');
    
    // Initialize AOS
    AOS.init({
      disable: false,
      startEvent: 'DOMContentLoaded',
      initClassName: 'aos-init',
      animatedClassName: 'aos-animate',
      useClassNames: false,
      disableMutationObserver: false,
      debounceDelay: 50,
      throttleDelay: 99,
      offset: 120,
      delay: 0,
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      mirror: false,
      anchorPlacement: 'top-bottom',
    });

    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 4000); // 4 seconds loading

    return () => clearTimeout(timer);
  }, []);

  // Refresh AOS when page changes
  useEffect(() => {
    AOS.refresh();
  }, [currentPage]);

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminLogin = (isAuthenticated: boolean) => {
    setIsAdminAuthenticated(isAuthenticated);
    if (isAuthenticated) {
      setCurrentPage('admin');
    }
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('admin_authenticated');
    localStorage.removeItem('admin_username');
    setIsAdminAuthenticated(false);
    setCurrentPage('home');
  };
  const renderCurrentPage = () => {
    // Show admin login if trying to access admin page without authentication
    if (currentPage === 'admin' && !isAdminAuthenticated) {
      return <AdminLogin onLogin={handleAdminLogin} />;
    }
    
    switch (currentPage) {
      case 'home':
        return <Landing onNavigate={handleNavigate} />;
      case 'services':
        return <Services onNavigate={handleNavigate} />;
      case 'gallery':
        return <Gallery />;
      case 'booking':
        return <BookingForm onNavigate={handleNavigate} />;
      case 'check-status':
        return <CheckStatus onNavigate={handleNavigate} />;
      case 'admin':
        return <AdminDashboard onNavigate={handleNavigate} onLogout={handleAdminLogout} />;
      case 'testimonials':
        return <Testimonials onNavigate={handleNavigate} />;
      case 'contact':
        return <Contact onNavigate={handleNavigate} />;
      default:
        return <Landing onNavigate={handleNavigate} />;
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-white">
      <Header currentPage={currentPage} onNavigate={handleNavigate} />
      <main>
        {renderCurrentPage()}
      </main>
      <Footer onNavigate={handleNavigate} />
      <FloatingSocialButtons />
    </div>
  );
}

export default App;