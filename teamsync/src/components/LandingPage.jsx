import React, { useState } from 'react';

/**
 * LandingPage Component
 * ----------------------------------------------------
 * Evaluation 1 Rubric Alignment:
 * 1. Semantic HTML5: <header>, <nav>, <main>, <section>, <article>, <footer>
 * 2. CSS Styling: Clean class-based styling, responsive layout, CSS variables
 * 3. JavaScript / React Basics: JSX, Functional Component, Props, State (useState), Array.map()
 * 4. DOM Manipulation: Dynamic class toggling, interactive FAQ accordion, tab navigation
 */
function LandingPage({ onLogin, onOpenAuth }) {
  // State for the interactive FAQ accordion
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  // State for interactive feature preview tab
  const [activePreviewTab, setActivePreviewTab] = useState('kanban');

  // Toggle FAQ accordion item (DOM state manipulation)
  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  // Helper function for smooth scrolling to sections
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Key Features Data (JavaScript Objects Array)
  const features = [
    {
      id: 'f-1',
      icon: '📝',
      title: 'Task Management',
      description: 'Organize tasks across To Do, In Progress, Review, and Done with real-time status transitions.'
    },
    {
      id: 'f-2',
      icon: '📊',
      title: 'Project Analytics',
      description: 'Track overall project health, task completion percentages, and sprint deadlines at a glance.'
    },
    {
      id: 'f-3',
      icon: '👥',
      title: 'Team Collaboration',
      description: 'Assign tasks to team members, balance workloads, and track departmental capacity easily.'
    },
    {
      id: 'f-4',
      icon: '📅',
      title: 'Calendar & Deadlines',
      description: 'Visual monthly calendar with scheduled deliverables and upcoming milestone reminders.'
    }
  ];

  // How It Works Steps
  const steps = [
    {
      stepNumber: '01',
      title: 'Create Your Project',
      description: 'Set up your project goals, due dates, category, and assign a project manager.'
    },
    {
      stepNumber: '02',
      title: 'Add & Assign Tasks',
      description: 'Break down your milestones into tasks with priorities, assignees, and deadlines.'
    },
    {
      stepNumber: '03',
      title: 'Track & Deliver',
      description: 'Update task progress across projects and export productivity reports.'
    }
  ];

  // Tech Stack & Evaluation Rubrics Data
  const techStack = [
    {
      tech: 'HTML5 Semantic Elements',
      icon: '🌐',
      description: 'Proper use of header, nav, main, section, article, and footer tags.'
    },
    {
      tech: 'CSS3 & Responsive Layout',
      icon: '🎨',
      description: 'Flexbox, CSS Grid, Custom Properties (variables), and clean themes.'
    },
    {
      tech: 'JavaScript (ES6+)',
      icon: '⚡',
      description: 'Arrow functions, array methods (.map, .filter), destructuring, and events.'
    },
    {
      tech: 'React Fundamentals',
      icon: '⚛️',
      description: 'Functional components, JSX syntax, Props, useState, and useEffect hooks.'
    }
  ];

  // FAQ Data for interactive accordion
  const faqs = [
    {
      question: 'What is TeamSync?',
      answer: 'TeamSync is a collaborative project management web application built to help teams organize tasks, monitor progress, and meet sprint deadlines efficiently.'
    },
    {
      question: 'What technologies are used in this project?',
      answer: 'TeamSync is built using React 19 (Functional Components, Hooks), modern JavaScript (ES6+), HTML5 semantic structure, and vanilla CSS3 with responsive styling and theming.'
    },
    {
      question: 'Can I add, edit, and track tasks?',
      answer: 'Yes! You can create new projects, add tasks with custom priorities and assignees, update them across stages (To Do -> In Progress -> Review -> Done), and view detailed statistics.'
    },
    {
      question: 'Is TeamSync responsive on mobile and desktop?',
      answer: 'Yes, the layout is designed using CSS Grid and Flexbox with responsive media queries to ensure smooth viewing on screens of all sizes.'
    }
  ];

  return (
    <div className="landing-page">
      {/* FIXED CLASSY BACKGROUND GRAPHIC SHOWING TEAM GROWTH & PROGRESS */}
      <div className="landing-fixed-bg" aria-hidden="true">
        {/* High-res Team Growth & Upward Progress Artwork */}
        <img
          src="/team_growth_bg.jpg"
          alt=""
          className="landing-bg-artwork"
        />
        {/* Ambient Gradient Overlay to preserve crystal-clear text contrast */}
        <div className="landing-bg-overlay" />
        {/* Subtle Ambient Light Glows */}
        <div className="landing-ambient-glow glow-top" />
        <div className="landing-ambient-glow glow-bottom" />
        {/* Subtle Grid Architecture Layer */}
        <div className="landing-grid-pattern" />
      </div>

      {/* 1. SEMANTIC HEADER & NAVIGATION BAR */}
      <header className="landing-header">
        <div className="landing-container landing-header-content">
          <div className="landing-brand">
            <div className="brand-icon-box">✓</div>
            <span className="brand-logo-text">TeamSync</span>
          </div>

          {/* Navigation Links */}
          <nav className="landing-nav">
            <button className="landing-nav-link" onClick={() => scrollToSection('features')}>
              Features
            </button>
            <button className="landing-nav-link" onClick={() => scrollToSection('how-it-works')}>
              How It Works
            </button>
            <button className="landing-nav-link" onClick={() => scrollToSection('tech-stack')}>
              Tech Stack
            </button>
            <button className="landing-nav-link" onClick={() => scrollToSection('faq')}>
              FAQ
            </button>
          </nav>

          {/* Authentication & App Action Buttons */}
          <div className="landing-header-actions">
            <button
              className="btn-landing-secondary"
              onClick={() => onOpenAuth('login')}
            >
              Sign In
            </button>
            <button
              className="btn-landing-primary"
              onClick={() => onOpenAuth('register')}
            >
              Sign Up
            </button>
          </div>
        </div>
      </header>

      {/* 2. MAIN CONTENT */}
      <main>
        {/* HERO SECTION */}
        <section className="landing-hero-section">
          <div className="landing-container">
            <h1 className="landing-hero-title">
              Manage Projects & Collaborate with <span>TeamSync</span>
            </h1>

            <p className="landing-hero-subtitle">
              A simple, responsive, and intuitive task management platform built with React,
              JavaScript, and semantic HTML & CSS.
            </p>

            <div className="landing-hero-cta-group">
              <button className="btn-hero-primary" onClick={onLogin}>
                <span>Open Demo Workspace</span>
                <span>🚀</span>
              </button>
              <button className="btn-hero-secondary" onClick={() => onOpenAuth('register')}>
                <span>Get Started Free</span>
                <span>→</span>
              </button>
            </div>

            {/* Interactive Live Preview Card */}
            <div className="landing-preview-card">
              <div className="preview-card-header">
                <div className="preview-window-dots">
                  <span className="dot red"></span>
                  <span className="dot yellow"></span>
                  <span className="dot green"></span>
                </div>
                <div className="preview-tabs">
                  <button
                    className={`preview-tab-btn ${activePreviewTab === 'kanban' ? 'active' : ''}`}
                    onClick={() => setActivePreviewTab('kanban')}
                  >
                    📝 Tasks View
                  </button>
                  <button
                    className={`preview-tab-btn ${activePreviewTab === 'stats' ? 'active' : ''}`}
                    onClick={() => setActivePreviewTab('stats')}
                  >
                    📊 Analytics View
                  </button>
                </div>
              </div>

              <div className="preview-card-body">
                {activePreviewTab === 'kanban' ? (
                  <div className="preview-kanban-grid">
                    <div className="preview-column">
                      <div className="preview-col-header">
                        <span className="col-tag todo">TO DO (2)</span>
                      </div>
                      <div className="preview-task-item">
                        <h4>Design Landing Page</h4>
                        <span className="task-sub">High Priority • Due Friday</span>
                      </div>
                      <div className="preview-task-item">
                        <h4>Setup Project Structure</h4>
                        <span className="task-sub">Medium • Product Team</span>
                      </div>
                    </div>

                    <div className="preview-column">
                      <div className="preview-col-header">
                        <span className="col-tag progress">IN PROGRESS (1)</span>
                      </div>
                      <div className="preview-task-item active">
                        <h4>Build React Components</h4>
                        <span className="task-sub">In Progress • Sarah J.</span>
                      </div>
                    </div>

                    <div className="preview-column">
                      <div className="preview-col-header">
                        <span className="col-tag done">DONE (2)</span>
                      </div>
                      <div className="preview-task-item done">
                        <h4>HTML & CSS Wireframes</h4>
                        <span className="task-sub">Completed • Team</span>
                      </div>
                      <div className="preview-task-item done">
                        <h4>JavaScript Logic Setup</h4>
                        <span className="task-sub">Completed • David K.</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="preview-stats-grid">
                    <div className="preview-stat-box">
                      <span className="stat-num">4</span>
                      <span className="stat-title">Active Projects</span>
                    </div>
                    <div className="preview-stat-box">
                      <span className="stat-num">18</span>
                      <span className="stat-title">Total Tasks</span>
                    </div>
                    <div className="preview-stat-box">
                      <span className="stat-num">88%</span>
                      <span className="stat-title">On-Time Delivery</span>
                    </div>
                    <div className="preview-stat-box">
                      <span className="stat-num">6</span>
                      <span className="stat-title">Team Members</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 3. CORE FEATURES SECTION */}
        <section id="features" className="landing-section">
          <div className="landing-container">
            <div className="section-header">
              <span className="section-badge">Core Features</span>
              <h2 className="section-title">Everything You Need to Manage Teamwork</h2>
              <p className="section-subtitle">
                Designed with modular React components for smooth interaction and easy task tracking.
              </p>
            </div>

            <div className="features-grid">
              {features.map((feature) => (
                <article key={feature.id} className="feature-card">
                  <div className="feature-icon">{feature.icon}</div>
                  <h3 className="feature-card-title">{feature.title}</h3>
                  <p className="feature-card-desc">{feature.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 4. HOW IT WORKS SECTION */}
        <section id="how-it-works" className="landing-section bg-subtle-section">
          <div className="landing-container">
            <div className="section-header">
              <span className="section-badge">Simple Workflow</span>
              <h2 className="section-title">How TeamSync Works</h2>
              <p className="section-subtitle">
                A 3-step streamlined process from project kickoff to successful completion.
              </p>
            </div>

            <div className="steps-grid">
              {steps.map((step) => (
                <div key={step.stepNumber} className="step-card">
                  <div className="step-number-badge">{step.stepNumber}</div>
                  <h3 className="step-card-title">{step.title}</h3>
                  <p className="step-card-desc">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. TECH STACK & ARCHITECTURE HIGHLIGHTS */}
        <section id="tech-stack" className="landing-section">
          <div className="landing-container">
            <div className="section-header">
              <span className="section-badge">Technical Stack</span>
              <h2 className="section-title">Technologies & Concepts Implemented</h2>
              <p className="section-subtitle">
                Built with modern web standards: HTML5, CSS3, JavaScript, DOM Manipulation, and React.
              </p>
            </div>

            <div className="tech-stack-grid">
              {techStack.map((item, idx) => (
                <div key={idx} className="tech-card">
                  <span className="tech-icon">{item.icon}</span>
                  <h3 className="tech-title">{item.tech}</h3>
                  <p className="tech-desc">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. INTERACTIVE FAQ ACCORDION SECTION */}
        <section id="faq" className="landing-section bg-subtle-section">
          <div className="landing-container">
            <div className="section-header">
              <span className="section-badge">Questions & Answers</span>
              <h2 className="section-title">Frequently Asked Questions</h2>
              <p className="section-subtitle">
                Click any question below to toggle its answer (demonstrates React state & DOM manipulation).
              </p>
            </div>

            <div className="faq-container">
              {faqs.map((faq, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div
                    key={index}
                    className={`faq-item ${isOpen ? 'open' : ''}`}
                    onClick={() => toggleFaq(index)}
                  >
                    <div className="faq-question-row">
                      <h4 className="faq-question-text">{faq.question}</h4>
                      <span className="faq-toggle-icon">{isOpen ? '−' : '+'}</span>
                    </div>
                    {isOpen && (
                      <div className="faq-answer-row">
                        <p>{faq.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 7. CALL TO ACTION BANNER */}
        <section className="landing-cta-banner">
          <div className="landing-container cta-banner-content">
            <h2>Ready to Explore TeamSync?</h2>
            <p>Jump right into the interactive dashboard with preloaded mock project data.</p>
            <div className="cta-banner-buttons">
              <button className="btn-hero-primary" onClick={onLogin}>
                Open Demo Workspace 🚀
              </button>
              <button className="btn-hero-secondary" onClick={() => onOpenAuth('login')}>
                Sign In
              </button>
              <button className="btn-hero-primary" onClick={() => onOpenAuth('register')}>
                Sign Up Free →
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* 8. SEMANTIC FOOTER */}
      <footer className="landing-footer">
        <div className="landing-container footer-content">
          <div className="footer-brand">
            <div className="brand-icon-box">✓</div>
            <span className="brand-logo-text">TeamSync</span>
            <p className="footer-tagline">
              Collaborative Project & Task Management Platform
            </p>
          </div>

          <div className="footer-links-group">
            <h4>Quick Navigation</h4>
            <ul>
              <li><button onClick={() => scrollToSection('features')}>Features</button></li>
              <li><button onClick={() => scrollToSection('how-it-works')}>How It Works</button></li>
              <li><button onClick={() => scrollToSection('tech-stack')}>Tech Stack</button></li>
              <li><button onClick={() => scrollToSection('faq')}>FAQ</button></li>
            </ul>
          </div>

          <div className="footer-links-group">
            <h4>Project Actions</h4>
            <ul>
              <li><button onClick={onLogin}>Demo Dashboard</button></li>
              <li><button onClick={() => onOpenAuth('login')}>Login</button></li>
              <li><button onClick={() => onOpenAuth('register')}>Register</button></li>
            </ul>
          </div>
        </div>

        <div className="landing-container footer-bottom">
          <p>© {new Date().getFullYear()} TeamSync. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
