import React, { useState } from 'react';
import {
  Check,
  ArrowRight,
  Rocket,
  Sparkles,
  CheckSquare,
  BarChart3,
  Users,
  Calendar,
  Zap,
  Globe,
  Palette,
  Code2,
  Plus,
  Minus,
  Layers,
  FolderKanban,
  Target,
  ShieldCheck,
  Clock,
  TrendingUp,
  Award,
  ChevronRight
} from 'lucide-react';

/**
 * LandingPage Component
 * ----------------------------------------------------
 * High-end enterprise SaaS landing page with Lucide React icons,
 * interactive feature previews, and modern design aesthetics.
 */
function LandingPage({ onLogin, onOpenAuth }) {
  // State for the interactive FAQ accordion
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  // State for interactive feature preview tab
  const [activePreviewTab, setActivePreviewTab] = useState('kanban');

  // Toggle FAQ accordion item
  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  // Smooth scroll helper
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Key Features Data
  const features = [
    {
      id: 'f-1',
      icon: CheckSquare,
      color: '#4F46E5',
      bg: '#EEF2FF',
      title: 'Kanban & Task Management',
      description: 'Organize deliverables across To Do, In Progress, Review, and Done with instantaneous state transitions and subtask checklists.'
    },
    {
      id: 'f-2',
      icon: BarChart3,
      color: '#059669',
      bg: '#ECFDF5',
      title: 'Real-time Project Analytics',
      description: 'Track overall velocity, task completion percentages, and sprint deadlines with visual metrics and health indicators.'
    },
    {
      id: 'f-3',
      icon: Users,
      color: '#2563EB',
      bg: '#EFF6FF',
      title: 'Team Workload Balancing',
      description: 'Assign tasks to team members, monitor individual capacities, and prevent burnout across cross-functional squads.'
    },
    {
      id: 'f-4',
      icon: Calendar,
      color: '#D97706',
      bg: '#FEF3C7',
      title: 'Calendar & Sprint Deadlines',
      description: 'Visual interactive monthly calendar with scheduled milestones, scheduled deliverables, and deadline tracking.'
    }
  ];

  // How It Works Steps
  const steps = [
    {
      stepNumber: '01',
      icon: FolderKanban,
      title: 'Create Your Project',
      description: 'Define your project goals, due dates, priority tiers, and assign dedicated project managers.'
    },
    {
      stepNumber: '02',
      icon: Layers,
      title: 'Break Down & Assign Tasks',
      description: 'Organize work into actionable tickets with priorities, assignees, subtasks, and target completion dates.'
    },
    {
      stepNumber: '03',
      icon: Target,
      title: 'Track Velocity & Deliver',
      description: 'Monitor real-time progress across boards, export productivity reports, and hit sprint goals on schedule.'
    }
  ];

  // Tech Stack Data
  const techStack = [
    {
      tech: 'HTML5 Semantic Architecture',
      icon: Globe,
      color: '#3B82F6',
      description: 'Clean, accessible structure with semantic header, nav, main, section, article, and footer tags.'
    },
    {
      tech: 'Modern CSS3 Design System',
      icon: Palette,
      color: '#8B5CF6',
      description: 'Flexbox, CSS Grid, custom HSL design tokens, glassmorphism, and responsive dark/light themes.'
    },
    {
      tech: 'JavaScript (ES6+)',
      icon: Zap,
      color: '#F59E0B',
      description: 'Arrow functions, array methods (.map, .filter), destructuring, and robust event handling.'
    },
    {
      tech: 'React 19 Core Fundamentals',
      icon: Code2,
      color: '#10B981',
      description: 'Modular functional components, controlled state (useState), lifecycle hooks, and clean props flow.'
    }
  ];

  // FAQ Data
  const faqs = [
    {
      question: 'What is TeamSync?',
      answer: 'TeamSync is an enterprise project and task management web application built to help modern teams coordinate deliverables, balance member workloads, and hit sprint deadlines efficiently.'
    },
    {
      question: 'What technologies power TeamSync?',
      answer: 'TeamSync is built with React 19, modern ES6+ JavaScript, HTML5 semantic structure, and Vanilla CSS with a responsive design system, Lucide React icons, and localStorage persistence.'
    },
    {
      question: 'Can I start with a clean workspace or explore with sample data?',
      answer: 'Both! When you sign up, you start with a clean empty slate to add your own initiatives, or you can click "✨ Load Demo Sample Data" anytime to preview preloaded projects, tasks, and analytics.'
    },
    {
      question: 'Is TeamSync responsive across mobile, tablet, and desktop?',
      answer: 'Yes! The user interface is engineered with CSS Grid and Flexbox layouts with adaptive breakpoints to ensure a seamless experience on any screen size.'
    }
  ];

  return (
    <div className="landing-page">
      {/* Ambient Visual Background Graphic */}
      <div className="landing-fixed-bg" aria-hidden="true">
        <img
          src="/team_growth_bg.jpg"
          alt=""
          className="landing-bg-artwork"
        />
        <div className="landing-bg-overlay" />
        <div className="landing-ambient-glow glow-top" />
        <div className="landing-ambient-glow glow-bottom" />
        <div className="landing-grid-pattern" />
      </div>

      {/* 1. SEMANTIC HEADER & NAVIGATION BAR */}
      <header className="landing-header">
        <div className="landing-container landing-header-content">
          <div className="landing-brand">
            <div className="brand-icon-box">
              <Check size={18} strokeWidth={3} />
            </div>
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

          {/* Authentication Action Buttons */}
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
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <span>Get Started</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </header>

      {/* 2. MAIN CONTENT */}
      <main>
        {/* HERO SECTION */}
        <section className="landing-hero-section">
          <div className="landing-container">
            <div className="landing-hero-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={14} style={{ color: 'var(--primary)' }} />
              <span>Next-Generation Enterprise Work Management</span>
            </div>

            <h1 className="landing-hero-title">
              Manage Projects & Accelerate Delivery with <span>TeamSync</span>
            </h1>

            <p className="landing-hero-subtitle">
              The modern workspace for sprint planning, task tracking, and seamless team collaboration.
              Designed with React 19, ES6+ JavaScript, and responsive architecture.
            </p>

            <div className="landing-hero-cta-group">
              <button className="btn-hero-primary" onClick={onLogin} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <Rocket size={16} />
                <span>Open Demo Workspace</span>
              </button>
              <button className="btn-hero-secondary" onClick={() => onOpenAuth('register')} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <span>Create Free Account</span>
                <ArrowRight size={15} />
              </button>
            </div>

            {/* Metric Highlights Strip */}
            <div className="landing-metrics-strip" style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: '28px',
              marginBottom: '40px',
              color: 'var(--text-muted)',
              fontSize: '0.86rem',
              fontWeight: 600
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={16} style={{ color: 'var(--primary)' }} />
                <span>Enterprise Grade</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Zap size={16} style={{ color: '#F59E0B' }} />
                <span>Instant 1-Click Launch</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <TrendingUp size={16} style={{ color: '#10B981' }} />
                <span>99.4% On-Time Delivery</span>
              </div>
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
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    <CheckSquare size={14} />
                    <span>Tasks View</span>
                  </button>
                  <button
                    className={`preview-tab-btn ${activePreviewTab === 'stats' ? 'active' : ''}`}
                    onClick={() => setActivePreviewTab('stats')}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    <BarChart3 size={14} />
                    <span>Analytics View</span>
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
                        <span className="task-sub">In Progress • Rohan V.</span>
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
              <span className="section-badge">Core Capabilities</span>
              <h2 className="section-title">Everything You Need to Manage Teamwork</h2>
              <p className="section-subtitle">
                Engineered with modular React components for fluid interactions and comprehensive team coordination.
              </p>
            </div>

            <div className="features-grid">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <article key={feature.id} className="feature-card">
                    <div className="feature-icon" style={{ background: feature.bg, color: feature.color, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={24} strokeWidth={2.2} />
                    </div>
                    <h3 className="feature-card-title">{feature.title}</h3>
                    <p className="feature-card-desc">{feature.description}</p>
                  </article>
                );
              })}
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
                A 3-step streamlined workflow from initial kickoff to successful sprint delivery.
              </p>
            </div>

            <div className="steps-grid">
              {steps.map((step) => {
                const Icon = step.icon;
                return (
                  <div key={step.stepNumber} className="step-card">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                      <div className="step-number-badge">{step.stepNumber}</div>
                      <div style={{ padding: '8px', borderRadius: '8px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex' }}>
                        <Icon size={20} />
                      </div>
                    </div>
                    <h3 className="step-card-title">{step.title}</h3>
                    <p className="step-card-desc">{step.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 5. TECH STACK & ARCHITECTURE HIGHLIGHTS */}
        <section id="tech-stack" className="landing-section">
          <div className="landing-container">
            <div className="section-header">
              <span className="section-badge">Technical Stack</span>
              <h2 className="section-title">Technologies & Architecture</h2>
              <p className="section-subtitle">
                Built strictly following clean web engineering standards: HTML5, CSS3, ES6+ JavaScript, and React.
              </p>
            </div>

            <div className="tech-stack-grid">
              {techStack.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="tech-card">
                    <div className="tech-icon" style={{ display: 'inline-flex', padding: '10px', borderRadius: '10px', background: 'var(--bg-subtle)', color: item.color, marginBottom: '12px' }}>
                      <Icon size={24} />
                    </div>
                    <h3 className="tech-title">{item.tech}</h3>
                    <p className="tech-desc">{item.description}</p>
                  </div>
                );
              })}
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
                Click any question below to explore details about features, data persistence, and architecture.
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
                      <span className="faq-toggle-icon" style={{ display: 'flex', alignItems: 'center' }}>
                        {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                      </span>
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

        {/* 7. CLEAN & SIMPLE CTA SECTION */}
        <section className="landing-cta-section">
          <div className="landing-container">
            <div className="landing-cta-card">
              <h2 className="cta-title">
                Ready to Get Started with TeamSync?
              </h2>

              <p className="cta-subtitle">
                Jump into the interactive demo workspace or create your free account in seconds.
              </p>

              <div className="cta-actions-group">
                <button className="btn-hero-primary" onClick={onLogin} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  <Rocket size={16} />
                  <span>Open Demo Workspace</span>
                </button>

                <button className="btn-hero-secondary" onClick={() => onOpenAuth('register')} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  <span>Sign Up Free</span>
                  <ArrowRight size={15} />
                </button>

                <button className="btn-landing-secondary" onClick={() => onOpenAuth('login')} style={{ padding: '14px 20px', borderRadius: '10px' }}>
                  Sign In
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 8. PROFESSIONAL ENTERPRISE FOOTER */}
      <footer className="landing-footer">
        <div className="landing-container">
          <div className="footer-main-grid">
            {/* Column 1: Brand & Live Status */}
            <div className="footer-brand-col">
              <div className="footer-brand-header">
                <div className="brand-icon-box">
                  <Check size={18} strokeWidth={3} />
                </div>
                <span className="brand-logo-text">TeamSync</span>
              </div>

              <p className="footer-brand-desc">
                High-performance project orchestration and task intelligence built for modern teams.
              </p>

              <div className="footer-status-pill">
                <span className="status-indicator-dot" />
                <span className="status-text">All Systems Operational</span>
              </div>
            </div>

            {/* Column 2: Platform Capabilities */}
            <div className="footer-links-col">
              <h4 className="footer-col-title">Platform</h4>
              <ul className="footer-links-list">
                <li><button onClick={() => scrollToSection('features')}>Kanban Boards</button></li>
                <li><button onClick={() => scrollToSection('features')}>Task Management</button></li>
                <li><button onClick={() => scrollToSection('features')}>Team Workloads</button></li>
                <li><button onClick={() => scrollToSection('features')}>Sprint Analytics</button></li>
                <li><button onClick={() => scrollToSection('how-it-works')}>Workflow Guide</button></li>
              </ul>
            </div>

            {/* Column 3: Tech Stack & Architecture */}
            <div className="footer-links-col">
              <h4 className="footer-col-title">Architecture</h4>
              <ul className="footer-links-list">
                <li><button onClick={() => scrollToSection('tech-stack')}>React 19 Engine</button></li>
                <li><button onClick={() => scrollToSection('tech-stack')}>Modern ES6+ JavaScript</button></li>
                <li><button onClick={() => scrollToSection('tech-stack')}>HTML5 Semantic Structure</button></li>
                <li><button onClick={() => scrollToSection('tech-stack')}>CSS3 Responsive System</button></li>
                <li><button onClick={() => scrollToSection('faq')}>Architecture FAQ</button></li>
              </ul>
            </div>

            {/* Column 4: Workspace Access */}
            <div className="footer-links-col">
              <h4 className="footer-col-title">Workspace</h4>
              <ul className="footer-links-list">
                <li>
                  <button onClick={onLogin} className="footer-highlight-link">
                    ⚡ Demo Workspace
                  </button>
                </li>
                <li><button onClick={() => onOpenAuth('login')}>Sign In</button></li>
                <li><button onClick={() => onOpenAuth('register')}>Create Free Account</button></li>
                <li><button onClick={() => scrollToSection('faq')}>Help & FAQ</button></li>
              </ul>
            </div>
          </div>

          {/* Footer Bottom Row */}
          <div className="footer-bottom-row">
            <div className="footer-copyright">
              © {new Date().getFullYear()} TeamSync Platform. All rights reserved.
            </div>

            <div className="footer-tech-tag">
              Engineered with <span>React 19</span> & <span>Vanilla CSS</span>
            </div>

            <div className="footer-legal-links">
              <span>Privacy Policy</span>
              <span className="dot-divider">•</span>
              <span>Terms of Service</span>
              <span className="dot-divider">•</span>
              <span>Security</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
