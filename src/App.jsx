import React, { useEffect } from 'react';
import { Phone, PaintBucket, Briefcase, Sparkles, ChevronRight, Instagram, Facebook, Paintbrush, Mail } from 'lucide-react';
import './App.css';

function App() {
  // Trigger animations on scroll
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      // Ensure element starts invisible before animation
      el.style.opacity = '0';
      observer.observe(el);
    });
    
    return () => observer.disconnect();
  }, []);

  return (
    <div className="app-container">
      {/* Navbar */}
      <nav className="navbar glass-panel">
        <div className="container nav-content">
          <div className="logo-container">
            <PaintBucket className="logo-icon text-gradient-accent" size={32} />
            <span className="logo-text heading-md">Bhavesh Enterprise</span>
          </div>
          <ul className="nav-links">
            <li><a href="#brands">Brands</a></li>
            <li><a href="#materials">Materials</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
          <a href="tel:+919824061453" className="btn btn-accent nav-contact-btn">
            <Phone size={18} /> Call +91 9824061453
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero section-padding">
        <div className="hero-bg-glow"></div>
        <div className="container hero-content">
          <div className="hero-text animate-on-scroll">
            <div className="badge glass-panel">💎 Premium Authorised Dealers</div>
            <h1 className="heading-xl">
              Transform Your Space With <span className="text-gradient">Vibrant Colors</span> & <span className="text-gradient-accent">Strong Foundations</span>
            </h1>
            <p className="text-body-lg hero-subtext">
              We are your trusted agency for AsianPaints, Berger Paints, and top-tier construction materials. Build and beautify with confidence.
            </p>
            <div className="hero-actions">
              <a href="#materials" className="btn btn-primary">
                Explore Materials <ChevronRight size={20} />
              </a>
              <a href="#contact" className="btn btn-outline">
                Contact Us
              </a>
            </div>
          </div>
          <div className="hero-visual animate-on-scroll delay-200">
            {/* Abstract representation of paint and building */}
            <div className="abstract-card main-card glass-panel">
               <Paintbrush size={64} className="text-gradient-accent accent-icon" />
               <h3 className="heading-md">AsianPaints & Berger</h3>
               <p className="text-body-lg mt-2">Full catalog available instantly.</p>
            </div>
          </div>
        </div>
      </header>

      {/* Brands / Partners Section */}
      <section id="brands" className="brands-section section-padding">
        <div className="container text-center animate-on-scroll">
          <h2 className="heading-lg mb-4">Our Premium Partners</h2>
          <p className="text-body-lg mb-8 mx-auto max-w-2xl">We supply 100% authentic products directly from industry-leading manufacturers.</p>
          
          <div className="grid grid-cols-2 partners-grid">
            <div className="partner-card glass-panel flex-col-center">
               <div className="partner-logo placeholder-asianpaints">AsianPaints</div>
               <p className="text-body-lg mt-4">Authorized Dealership</p>
            </div>
            <div className="partner-card glass-panel flex-col-center">
               <div className="partner-logo placeholder-berger">Berger Paints</div>
               <p className="text-body-lg mt-4">Authorized Dealership</p>
            </div>
          </div>
        </div>
      </section>

      {/* Products & Services Section */}
      <section id="materials" className="materials-section section-padding">
        <div className="container animate-on-scroll">
          <div className="section-header">
            <h2 className="heading-lg">Products & Services</h2>
            <p className="text-body-lg mt-2">Comprehensive painting solutions and material supply for every need.</p>
          </div>
          
          <div className="grid grid-cols-3 materials-grid">
            <div className="material-card glass-panel hover-lift">
              <div className="icon-wrapper"><Briefcase size={32} className="text-gradient-blue" /></div>
              <h3 className="heading-md mt-4">Industrial Paints</h3>
              <p className="text-secondary mt-2">High-performance coatings and protective paints for industrial applications.</p>
            </div>
            <div className="material-card glass-panel hover-lift">
              <div className="icon-wrapper"><Sparkles size={32} className="text-gradient-accent" /></div>
              <h3 className="heading-md mt-4">Decorative Paints</h3>
              <p className="text-secondary mt-2">Vibrant and durable decorative colors to beautify your home or office space.</p>
            </div>
            <div className="material-card glass-panel hover-lift">
              <div className="icon-wrapper"><PaintBucket size={32} className="text-gradient" /></div>
              <h3 className="heading-md mt-4">Apply Supply Services</h3>
              <p className="text-secondary mt-2">End-to-end supply and professional application services for a flawless finish.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact-section section-padding">
        <div className="container text-center animate-on-scroll">
          <div className="contact-box glass-panel">
            <h2 className="heading-lg mb-2">Ready to Build & Paint?</h2>
            <p className="text-body-lg mb-8">Get in touch for wholesale quotes and product catalogs.</p>
            
            <div className="contact-number-display mb-8">
               <div className="mb-4">
                 <span className="text-gradient-accent huge-number">+91 9824061453</span>
               </div>
               <div>
                 <span className="text-body-lg" style={{ fontSize: '1.5rem', fontWeight: '500' }}>bnshah2008@gmail.com</span>
               </div>
            </div>
            
            <div className="contact-actions flex-center gap-4">
              <a href="tel:+919824061453" className="btn btn-accent btn-large">
                <Phone size={24} /> Call Now
              </a>
              <a href="https://wa.me/919824061453" className="btn btn-primary btn-large" target="_blank" rel="noreferrer">
                WhatsApp Us
              </a>
              <a href="mailto:bnshah2008@gmail.com" className="btn btn-outline btn-large">
                <Mail size={24} /> Email Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer border-top animate-on-scroll">
        <div className="container footer-content">
          <div className="footer-brand">
            <div className="logo-container">
              <span className="heading-md">Bhavesh Enterprise</span>
            </div>
            <p className="text-secondary mt-2">Your authorized paint and building material supplier.</p>
          </div>
          <div className="footer-social">
            <a href="#" className="social-icon"><Instagram /></a>
            <a href="#" className="social-icon"><Facebook /></a>
          </div>
        </div>
        <div className="footer-bottom text-center text-secondary border-top mt-8 pt-4">
          <p>&copy; {new Date().getFullYear()} Bhavesh Enterprise. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
