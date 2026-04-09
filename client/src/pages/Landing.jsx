import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { getCurrentCohort } from '../api/client';
import { 
  ChevronRight, Code2, Server, Terminal,
  CheckCircle2, ArrowRight, UserCircle2, 
  ChevronDown, BookOpen, Clock, Trophy, 
  Workflow, GitPullRequest, Code, MessageSquare
} from 'lucide-react';

void motion;

const formatCohortDate = (value) => {
  if (!value) {
    return 'April 27, 2026';
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return 'April 27, 2026';
  }

  return parsedDate.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

const HeroSection = ({ cohort }) => {
  const startDate = formatCohortDate(cohort?.startDate);
  const remainingSpots = cohort?.remainingSpots ?? 5;
  const monthlyTuitionSingle = cohort?.monthlyTuitionSingle ?? 500;

  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div 
          initial="hidden" animate="visible" variants={fadeIn}
          className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-8"
        >
          <span className="flex w-2 h-2 bg-brand-mint rounded-full animate-pulse"></span>
          <span className="text-white/80 text-sm font-sans">Cohort 1 Now Open · {startDate} · {remainingSpots} spots only</span>
        </motion.div>
        
        <motion.h1 
          initial="hidden" animate="visible" variants={fadeIn}
          className="text-5xl md:text-7xl font-extrabold font-heading tracking-tight mb-8"
        >
          <span className="block mb-2">Stop Being a Student.</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-teal to-brand-mint">
            Start Being an Engineer.
          </span>
        </motion.h1>
        
        <motion.p 
          initial="hidden" animate="visible" variants={fadeIn}
          className="text-lg md:text-xl text-white/60 mb-10 max-w-2xl mx-auto font-sans leading-relaxed"
        >
          PataSpace Academy trains Kenyan developers to build real software using real tools — the same way engineers at Safaricom, Google, and Amazon work every day.
        </motion.p>
        
        <motion.div 
          initial="hidden" animate="visible" variants={fadeIn}
          className="flex flex-col sm:flex-row justify-center items-center gap-4"
        >
          <Link to="/apply" className="w-full sm:w-auto flex items-center justify-center px-8 py-4 bg-brand-mint text-brand-dark rounded-xl font-bold hover:bg-brand-mint/90 transition-all hover:scale-105 group">
            Apply for Cohort 1
            <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a href="#tracks" className="w-full sm:w-auto flex items-center justify-center px-8 py-4 bg-white/5 text-white border border-white/10 rounded-xl font-bold hover:bg-white/10 transition-all">
            See the Curriculum
          </a>
        </motion.div>

        <motion.div 
          initial="hidden" animate="visible" variants={fadeIn}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-white/10"
        >
          {[
            { label: 'Duration', value: '12 Weeks' },
            { label: 'Available', value: '2 Tracks' },
            { label: 'Tuition', value: `KES ${monthlyTuitionSingle}/mo` },
            { label: 'Format', value: '100% Hands-on' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl font-bold font-heading text-white">{stat.value}</div>
              <div className="text-sm text-white/50 font-sans mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

const ProblemSolutionSection = () => {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-black/20" id="problem">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 lg:gap-24">
          
          {/* Problem */}
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
          >
            <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-heading mb-6 text-white/50">
              The Problem:<br/><span className="text-white">Kenyan graduates are being left behind.</span>
            </motion.h2>
            <div className="space-y-6">
              {[
                { title: 'Attachment Traps', desc: 'Serving tea and filing papers instead of writing code.' },
                { title: 'Theory Overload', desc: 'Degrees filled with algorithms on paper, but zero live deployments.' },
                { title: 'The Experience Paradox', desc: '"Need 3 years of experience" for entry-level jobs.' }
              ].map((item, i) => (
                <motion.div key={i} variants={fadeIn} className="p-6 rounded-2xl bg-white/5 border border-white/10">
                  <h3 className="text-xl font-bold text-white mb-2 font-heading">{item.title}</h3>
                  <p className="text-white/60 font-sans">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Solution */}
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
          >
            <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-heading mb-6 text-brand-mint">
              The PataSpace Solution:<br/><span className="text-white">We train engineers, not students.</span>
            </motion.h2>
            <div className="space-y-6">
              {[
                { icon: <GitPullRequest className="text-brand-mint" />, title: 'GitHub PR Workflow', desc: 'Every task is a branch. Every review is a Pull Request.' },
                { icon: <CheckCircle2 className="text-brand-mint" />, title: 'Deployed Projects', desc: 'Code means nothing if it’s not live. We deploy every level.' },
                { icon: <Trophy className="text-brand-mint" />, title: 'Boss Battles', desc: 'Prove mastery with major capstone projects to advance.' }
              ].map((item, i) => (
                <motion.div key={i} variants={fadeIn} className="p-6 rounded-2xl bg-brand-card border border-brand-mint/20 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity group-hover:scale-110 transform">
                     {item.icon}
                  </div>
                  <div className="flex items-center space-x-4 mb-2">
                    <div className="p-2 bg-brand-mint/10 rounded-lg">{item.icon}</div>
                    <h3 className="text-xl font-bold text-white font-heading">{item.title}</h3>
                  </div>
                  <p className="text-white/60 font-sans">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

const TracksSection = () => {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8" id="tracks">
      <div className="max-w-7xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="text-center mb-16">
          <h2 className="text-4xl font-heading font-bold mb-4">Choose Your Track</h2>
          <p className="text-white/60 font-sans max-w-2xl mx-auto">
            12 weeks of intense specialization. <span className="text-brand-gold">Both Tracks (Full Stack)</span> available in the pricing tier based on approval.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Backend */}
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
            className="flex flex-col p-8 rounded-3xl bg-brand-card border border-brand-teal/30 hover:border-brand-teal transition-colors"
          >
            <div className="flex items-start justify-between mb-8">
              <div>
                <h3 className="text-3xl font-heading font-bold flex items-center gap-3">
                  <Server className="w-8 h-8 text-brand-teal" />
                  Backend Track
                </h3>
                <p className="text-brand-teal font-sans mt-2">C# · ASP.NET Core · PostgreSQL · Render</p>
              </div>
            </div>
            
            <div className="space-y-4 mb-8 flex-grow">
              <p className="text-white/60 font-sans text-sm">W1: GitHub foundation, W2-3 C# basics, W4 Boss Battle Console App, W5 OOP, W6 LINQ, W7 Boss Battle Banking System, W8-9 ASP.NET API + EF + JWT, W10 Boss Battle REST API, W11 AI Week, W12 Final Project.</p>
              <div className="bg-brand-teal/10 p-4 rounded-xl border border-brand-teal/20">
                <span className="text-brand-teal text-sm font-bold block mb-1">Outcome:</span>
                <span className="text-white font-sans text-sm">Live REST API – authenticated, deployed, documented.</span>
              </div>
            </div>

            <Link to="/apply?track=backend" className="w-full text-center py-4 rounded-xl font-bold bg-brand-teal/10 text-brand-teal hover:bg-brand-teal hover:text-white transition-colors">
              Apply for Backend &rarr;
            </Link>
          </motion.div>

          {/* Frontend */}
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
            className="flex flex-col p-8 rounded-3xl bg-brand-card border border-brand-mint/30 hover:border-brand-mint transition-colors"
          >
            <div className="flex items-start justify-between mb-8">
              <div>
                <h3 className="text-3xl font-heading font-bold flex items-center gap-3">
                  <Code2 className="w-8 h-8 text-brand-mint" />
                  Frontend Track
                </h3>
                <p className="text-brand-mint font-sans mt-2">React · TypeScript · HTML/CSS · Vercel</p>
              </div>
            </div>
            
            <div className="space-y-4 mb-8 flex-grow">
              <p className="text-white/60 font-sans text-sm">W1 foundation, W2 HTML, W3 CSS/Flexbox/Grid, W4 Boss Battle static website, W5 JavaScript ES6+, W6 DOM + Fetch, W7 Boss Battle interactive app, W8 TypeScript, W9 React, W10 Boss Battle React app, W11 AI Week, W12 Final Project.</p>
              <div className="bg-brand-mint/10 p-4 rounded-xl border border-brand-mint/20">
                <span className="text-brand-mint text-sm font-bold block mb-1">Outcome:</span>
                <span className="text-white font-sans text-sm">Live React application – TypeScript, API integration, deployed.</span>
              </div>
            </div>

            <Link to="/apply?track=frontend" className="w-full text-center py-4 rounded-xl font-bold bg-brand-mint/10 text-brand-mint hover:bg-brand-mint hover:text-brand-dark transition-colors">
              Apply for Frontend &rarr;
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const HowItWorksSection = () => {
  const steps = [
    { num: "01", title: "Attend Sessions", desc: "2 live sessions/week (Monday 8:30PM teaching, Saturday 8:30PM Q&A). Recorded." },
    { num: "02", title: "Build & Push", desc: "Every task → real code → GitHub → Pull Request." },
    { num: "03", title: "Mentor Reviews", desc: "PR reviewed within 48h with inline comments (approve / changes requested)." },
    { num: "04", title: "Level Up", desc: "PR approved → next module unlocks; Boss Battles passed → next level." },
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-black/20" id="how-it-works">
      <div className="max-w-7xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="text-center mb-16">
          <h2 className="text-4xl font-heading font-bold mb-4">The Engineering Workflow</h2>
          <p className="text-white/60 font-sans">How we transform you into a professional.</p>
        </motion.div>

        <div className="relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-brand-teal to-brand-mint -translate-y-1/2 z-0"></div>
          
          <div className="grid md:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, i) => (
              <motion.div 
                key={i} 
                initial="hidden" whileInView="visible" viewport={{ once: true }} 
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { delay: i * 0.1 } } }}
                className="bg-brand-dark/90 p-6 rounded-2xl border border-white/10 text-center relative"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-teal to-brand-mint flex items-center justify-center font-bold text-xl text-brand-dark mx-auto mb-6 shadow-[0_0_20px_rgba(30,150,252,0.3)]">
                  {step.num}
                </div>
                <h3 className="text-xl font-heading font-bold mb-3">{step.title}</h3>
                <p className="text-white/60 font-sans text-sm">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const AboutSection = () => {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8" id="about">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
            <motion.div variants={fadeIn} className="mb-8">
              <span className="text-brand-gold font-sans font-bold uppercase tracking-widest text-sm mb-2 block">Our Origin</span>
              <h2 className="text-4xl font-heading font-bold">Built in Kutus. Built for Kenya.</h2>
            </motion.div>
            
            <motion.blockquote variants={fadeIn} className="border-l-4 border-brand-teal pl-6 py-2 mb-8 bg-brand-teal/5 rounded-r-xl">
              <p className="text-xl font-sans italic text-white/90">"I noticed brilliant students graduating with top grades, but completely empty GitHub portfolios. They couldn't build. PataSpace Academy is here to fix that."</p>
              <footer className="mt-4 font-bold text-brand-teal font-sans">— Sam Muriithi, Founder</footer>
            </motion.blockquote>
            
            <motion.ul variants={fadeIn} className="space-y-4 mb-8 font-sans text-white/70">
              <li className="flex items-center gap-3"><CheckCircle2 className="text-brand-mint w-5 h-5" /> Real code & deployments over theory</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="text-brand-mint w-5 h-5" /> Enterprise GitHub workflow</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="text-brand-mint w-5 h-5" /> Mentorship, not just instruction</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="text-brand-mint w-5 h-5" /> Accessible: KES 500/month</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="text-brand-mint w-5 h-5" /> Faith-driven foundation</li>
            </motion.ul>

            <motion.div variants={fadeIn} className="bg-gradient-to-r from-brand-teal/20 to-brand-mint/20 border border-brand-teal/30 p-6 rounded-2xl">
              <h3 className="text-xl font-heading font-bold text-white mb-2">Our Mission</h3>
              <p className="text-white/80 font-sans italic">"We are not just building a platform. We are building the builders."</p>
            </motion.div>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="grid sm:grid-cols-2 gap-6">
            <div className="bg-brand-card border border-white/10 rounded-2xl p-6 text-center transform hover:-translate-y-2 transition-transform">
              <div className="w-24 h-24 mx-auto bg-gray-800 rounded-full mb-4 flex items-center justify-center border-2 border-brand-teal text-4xl text-white/20">
                <UserCircle2 size={48} />
              </div>
              <h3 className="text-xl font-bold font-heading mb-1">Sam Muriithi</h3>
              <div className="text-brand-teal text-xs font-sans font-bold mb-3 uppercase tracking-wider">Founder & Lead Mentor</div>
              <p className="text-white/50 text-sm font-sans">2nd year Software Engineering. Builder of PataSpace Housing.</p>
            </div>
            
            <div className="bg-brand-card border border-white/10 rounded-2xl p-6 text-center transform hover:-translate-y-2 transition-transform sm:mt-12">
              <div className="w-24 h-24 mx-auto bg-gray-800 rounded-full mb-4 flex items-center justify-center border-2 border-brand-mint text-4xl text-white/20">
                <UserCircle2 size={48} />
              </div>
              <h3 className="text-xl font-bold font-heading mb-1">Roy Engineer</h3>
              <div className="text-brand-mint text-xs font-sans font-bold mb-3 uppercase tracking-wider">Frontend Mentor</div>
              <p className="text-white/50 text-sm font-sans">Specialises in React, TypeScript, and modern web architectures.</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const PricingSection = ({ cohort }) => {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-black/20" id="pricing">
      <div className="max-w-7xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="text-center mb-16">
          <h2 className="text-4xl font-heading font-bold mb-4">Invest in Your Skills</h2>
          <p className="text-white/60 font-sans max-w-2xl mx-auto">
            World-class mentorship at a price built for Kenyan students.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Single Track */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="bg-brand-card border border-white/10 rounded-3xl p-8 flex flex-col">
            <h3 className="text-2xl font-bold font-heading mb-2">Single Track</h3>
            <p className="text-white/50 font-sans text-sm mb-6">Frontend OR Backend.</p>
            <div className="mb-6">
              <span className="text-4xl font-bold text-white">KES 500</span>
              <span className="text-white/50"> /mo</span>
            </div>
            <ul className="space-y-4 mb-8 flex-grow font-sans text-sm text-white/70">
              <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-brand-mint" /> 1 live session/week</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-brand-mint" /> Mentor PR reviews</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-brand-mint" /> Track Boss Battles</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-brand-mint" /> GitHub training</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-brand-mint" /> Certificate of Completion</li>
            </ul>
            <Link to="/apply" className="block w-full py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-center font-bold rounded-xl transition-colors">Apply Now</Link>
          </motion.div>

          {/* Full Stack - Popular */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="bg-brand-card border-2 border-brand-mint rounded-3xl p-8 flex flex-col relative transform lg:-translate-y-4 shadow-[0_0_30px_rgba(2,195,154,0.15)]">
            <div className="absolute top-0 right-8 -translate-y-1/2 bg-brand-mint text-brand-dark px-3 py-1 text-xs font-bold uppercase rounded-full tracking-wider">Most Popular</div>
            <h3 className="text-2xl font-bold font-heading mb-2">Full Stack</h3>
            <p className="text-white/50 font-sans text-sm mb-6">Master both ends of the stack.</p>
            <div className="mb-6">
              <span className="text-4xl font-bold text-brand-mint">KES 800</span>
              <span className="text-white/50"> /mo</span>
            </div>
            <ul className="space-y-4 mb-8 flex-grow font-sans text-sm text-white/70">
              <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-brand-mint" /> 2 live sessions/week</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-brand-mint" /> API integration projects</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-brand-mint" /> Priority PR reviews</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-brand-mint" /> PataBot AI Copilot</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-brand-mint" /> Full 12-week curriculum</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-brand-mint" /> Job referral pipeline</li>
            </ul>
            <Link to="/apply?track=both" className="block w-full py-3 px-4 bg-brand-mint hover:bg-brand-mint/90 text-brand-dark text-center font-bold rounded-xl transition-colors">Apply For Full Stack</Link>
          </motion.div>

          {/* Student Builder */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="bg-brand-card border border-brand-gold/30 rounded-3xl p-8 flex flex-col relative">
            <div className="absolute top-0 right-8 -translate-y-1/2 bg-brand-gold/20 text-brand-gold border border-brand-gold px-3 py-1 text-xs font-bold uppercase rounded-full tracking-wider">Invite Only</div>
            <h3 className="text-2xl font-bold font-heading mb-2">Student Builder</h3>
            <p className="text-white/50 font-sans text-sm mb-6">Top performers hired to build PataSpace.</p>
            <div className="mb-6">
              <span className="text-4xl font-bold text-brand-gold">KES 0</span>
            </div>
            <ul className="space-y-4 mb-8 flex-grow font-sans text-sm text-white/70">
              <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-brand-gold" /> Production code for PataSpace</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-brand-gold" /> Direct mentorship from founder</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-brand-gold" /> Wall of Fame</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-brand-gold" /> Fast-track to mentor</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-brand-gold" /> B2B partner access</li>
            </ul>
            <button disabled className="block w-full py-3 px-4 bg-white/5 border border-white/10 text-white/30 text-center font-bold rounded-xl cursor-not-allowed">Earned, Not Bought</button>
          </motion.div>
        </div>

        <p className="text-center text-white/40 font-sans text-sm mt-10 max-w-3xl mx-auto">
          A non-refundable <span className="text-white/70">KES {cohort?.commitmentFee ?? 500} Commitment Fee</span> is required to lock your cohort spot (applied to Month 1 tuition). Paid monthly via M-Pesa. KES {cohort?.lateFee ?? 100} late fee after 7-day grace period.
        </p>
      </div>
    </section>
  );
};

const TestimonialsSection = () => {
  const testimonials = [
    { text: "The GitHub PR workflow totally changed how I code. I'm actually writing tests and reviewing code like a real developer.", author: "Aisha K." },
    { text: "Boss battles are terrifying but passing one is the best feeling. PataSpace is worth 10x the monthly fee.", author: "Brian M." },
    { text: "I tried bootcamps that cost 50,000 KES but learned more here in 4 weeks because I was forced to actually build and deploy.", author: "Denis L." },
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-heading font-bold text-center mb-16">Stories from the Frontline</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="bg-white/5 p-8 rounded-2xl border border-white/10 relative">
              <MessageSquare className="absolute top-4 left-4 w-12 h-12 text-white/5 rotate-180" />
              <p className="text-white/80 font-sans italic mb-6 relative z-10">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-teal to-brand-mint flex items-center justify-center font-bold text-brand-dark">
                  {t.author.charAt(0)}
                </div>
                <div className="font-bold text-white font-sans">{t.author}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FAQSection = () => {
  const faqs = [
    { q: "Do I need prior coding experience?", a: "No, the curriculum starts from zero. However, absolute beginners must put in extra hours during the first 3 weeks." },
    { q: "What equipment do I need?", a: "A laptop or desktop PC and a stable internet connection. A phone is not sufficient for coding." },
    { q: "How are sessions conducted?", a: "Via Google Meet. Mondays at 8:30PM EAT for teaching, and Saturdays at 8:30PM EAT for live Q&A and code reviews." },
    { q: "What if I miss a session?", a: "All sessions are recorded. You must watch the recording and submit your required PR before the next session to stay on track." },
    { q: "How does GitHub PR submission work?", a: "You write code locally, push it to your GitHub branch, and open a Pull Request. A mentor reviews your PR within 48h and either approves or requests changes." },
    { q: "Can I switch tracks?", a: "No mid-cohort switching is allowed. You can, however, take the other track in the next cohort at an alumni discount." },
    { q: "What is a Boss Battle?", a: "A major capstone project at the end of a module. You must pass the Boss Battle PR review to unlock the next level of the curriculum." },
    { q: "What do I get at the end?", a: "A verifiable certificate, a very strong GitHub portfolio with live deployments, access to the alumni network, job referrals, and potentially an offer to become a paid mentor." },
  ];

  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-black/20" id="faq">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-4xl font-heading font-bold text-center mb-12">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-white/10 rounded-xl bg-white/5 overflow-hidden">
              <button 
                onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
                className="w-full text-left px-6 py-4 font-bold font-sans flex justify-between items-center text-white/90 focus:outline-none"
              >
                {faq.q}
                <ChevronDown className={`w-5 h-5 transition-transform ${openIndex === i ? 'rotate-180 text-brand-mint' : 'text-white/50'}`} />
              </button>
              {openIndex === i && (
                <div className="px-6 py-4 bg-black/20 text-white/60 font-sans text-sm border-t border-white/5">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CTASection = ({ cohort }) => {
  const startDate = formatCohortDate(cohort?.startDate);
  const remainingSpots = cohort?.remainingSpots ?? 5;
  const monthlyTuitionSingle = cohort?.monthlyTuitionSingle ?? 500;

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-t from-brand-mint/5 to-transparent"></div>
      <div className="max-w-4xl mx-auto text-center relative z-10 border border-brand-mint/20 bg-brand-card p-12 rounded-3xl shadow-[0_0_50px_rgba(2,195,154,0.1)]">
        <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
          Your GitHub profile is empty.<br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-teal to-brand-mint">Fix that in 12 weeks.</span>
        </h2>
        <p className="text-white/60 font-sans text-lg mb-10 max-w-2xl mx-auto">
          KES {monthlyTuitionSingle}/month, real mentorship, real code, real certificate. Cohort 1 starts {startDate} – only {remainingSpots} spots remaining.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link to="/apply" className="w-full sm:w-auto px-8 py-4 bg-brand-mint text-brand-dark font-bold rounded-xl hover:bg-brand-mint/90 transition-transform hover:scale-105 flex items-center justify-center">
            Apply for Cohort 1 &rarr;
          </Link>
          <a href="https://wa.me/254794939181" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto px-8 py-4 bg-white text-brand-dark font-bold rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
            💬 WhatsApp Us
          </a>
        </div>
        <p className="text-white/40 text-sm font-sans mt-8">
          Pay via M-Pesa · KES 500 commitment fee reserves your spot · Limited to 5 students
        </p>
      </div>
    </section>
  );
};

const Landing = () => {
  const [cohort, setCohort] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadCohort = async () => {
      try {
        const currentCohort = await getCurrentCohort();

        if (isMounted) {
          setCohort(currentCohort);
        }
      } catch (error) {
        console.error('Unable to load current cohort', error);
      }
    };

    loadCohort();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="w-full">
      <Helmet>
        <title>PataSpace Academy | Start Being an Engineer</title>
        <meta name="description" content="PataSpace Academy trains Kenyan developers to build real software using real tools." />
      </Helmet>
      
      <HeroSection cohort={cohort} />
      <ProblemSolutionSection />
      <TracksSection />
      <HowItWorksSection />
      <AboutSection />
      <PricingSection cohort={cohort} />
      <TestimonialsSection />
      <FAQSection />
      <CTASection cohort={cohort} />
      
    </div>
  );
};

export default Landing;
