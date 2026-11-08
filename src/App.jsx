import React, { useState, useEffect, useRef } from 'react';
import {
  FaGithub, FaLinkedin, FaInstagram, FaWhatsapp, FaEnvelope,
  FaArrowRight, FaPlus, FaMinus, FaGraduationCap, FaBriefcase,
  FaRobot, FaTimes, FaPaperPlane, FaFilePdf, FaBars,  FaReact, 
  FaNodeJs, FaJava, FaDocker, FaGitAlt
} from 'react-icons/fa';
import { 
  SiKotlin, SiKubernetes, SiPostgresql, SiExpress, SiTypescript,
  SiMongodb, SiMysql, SiJetpackcompose, SiJavascript 
} from 'react-icons/si';
import { motion, AnimatePresence } from 'framer-motion';

// Local images for fallback
import profilePic from './assets/samwel-profile.jpg';
import nexusImg from './assets/nexus.jpeg';
import chatstansImg from './assets/chatstans.png';
import vfriImg from './assets/vfri.png';
import chemshaaImg from './assets/chemshaa.png';
const App = () => {
  // --- States ---
  const [openFaq, setOpenFaq] = useState(1);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [projects, setProjects] = useState([]);

  // AI Chat States
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', content: "Hi! I'm Samwel's AI assistant. Ask me anything about his skills, projects, or experience." },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Newsletter States
    // Contact Form States
  const [contactData, setContactData] = useState({ name: '', email: '', message: '' });
  const [contactStatus, setContactStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Effects ---
  // Fetch Projects from MongoDB via Backend
  useEffect(() => {
    fetch('https://samwel-portfolio-backend-api.onrender.com/api/projects')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setProjects(data);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch projects from database", err);
      });
  }, []);

  // Auto scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // --- Handlers ---
  const handleSendMessage = async () => {
    const text = chatInput.trim();
    if (!text || isLoading) return;

    setChatInput('');
    setChatMessages((prev) => [...prev, { role: 'user', content: text }]);
    setIsLoading(true);

    try {
      const res = await fetch('https://samwel-portfolio-backend-api.onrender.com/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to get response');

      setChatMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      setChatMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, something went wrong. Please try again later.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

    const handleContactSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setContactStatus({ type: '', message: '' });

    try {
      const res = await fetch('https://samwel-portfolio-backend-api.onrender.com/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send message');

      setContactStatus({ type: 'success', message: 'Message sent! I will get back to you soon.' });
      setContactData({ name: '', email: '', message: '' }); // Clear form
    } catch (err) {
      setContactStatus({ type: 'error', message: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to get fallback image
  const getProjectImage = (project) => {
    if (project.imageUrl) return project.imageUrl;
    
    const title = project.title.toLowerCase();
    if (title.includes('nexus')) return nexusImg;
    if (title.includes('chatstans')) return chatstansImg;
    if (title.includes('victoria')) return vfriImg;
    if (title.includes('chemshaa')) return chemshaaImg;
    
    return profilePic; // Ultimate fallback
  };

  return (
    <div className="bg-[#f9f9f9] text-slate-800 overflow-x-hidden selection:bg-[#f4b316] selection:text-white">
      
      {/* ---- Navbar ---- */}
      <nav className="fixed w-full top-0 bg-white/90 backdrop-blur-md z-40 py-4 px-8 shadow-sm">
        <div className="flex justify-between items-center w-full">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="bg-[#1e4635] text-white p-2 rounded-full"><FaBriefcase size={14} /></div>
            <h1 className="text-xl font-bold tracking-tight">Samwel.</h1>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-8 text-sm font-medium">
            <a href="#about" className="hover:text-[#1e4635] transition">About</a>
            <a href="#skills" className="hover:text-[#1e4635] transition">Skills</a>
            <a href="#projects" className="hover:text-[#1e4635] transition">Projects</a>
            <a href="#journey" className="hover:text-[#1e4635] transition">Journey</a>
            <a href="#faq" className="hover:text-[#1e4635] transition">FAQs</a>
          </div>

          {/* Desktop Contact Button & Mobile Menu Toggle */}
          <div className="flex items-center gap-4">
            <a href="#contact" className="hidden md:flex bg-[#1e4635] hover:bg-[#153427] text-white px-5 py-2 rounded-full text-sm font-medium transition items-center gap-2">
              Contact Me <FaArrowRight size={12} />
            </a>
            
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-slate-800 p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg border-t border-slate-100 flex flex-col py-4 px-8 space-y-4 text-sm font-medium">
            <a href="#about" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#1e4635] transition">About</a>
            <a href="#skills" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#1e4635] transition">Skills</a>
            <a href="#projects" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#1e4635] transition">Projects</a>
            <a href="#journey" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#1e4635] transition">Journey</a>
            <a href="#faq" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#1e4635] transition">FAQs</a>
            <a href="#contact" onClick={() => setIsMobileMenuOpen(false)} className="bg-[#1e4635] text-white px-5 py-2 rounded-full text-center transition mt-2">
              Contact Me
            </a>
          </div>
        )}
      </nav>

      {/* ---- Hero ---- */}
      <section className="pt-32 pb-16 px-8 max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between min-h-screen">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="md:w-1/2 space-y-6">
          <div className="inline-flex items-center gap-2 border border-slate-300 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <span className="w-2 h-2 rounded-full bg-[#f4b316]"></span> Hello There!
          </div>
          <h2 className="text-5xl md:text-6xl font-bold leading-[1.1] serif text-slate-900">
            I'm <span className="text-[#f4b316] italic">Samwel Abwao</span>,<br />
            Software Engineer<br />
            Based in Kenya.
          </h2>
          <p className="text-slate-600 text-lg max-w-md pt-2">
            I build production-ready web and Android applications. Specializing in React, Node.js, and Kotlin with a passion for clean architecture.
          </p>
          <div className="flex items-center gap-4 pt-4">
            <a href="#projects" className="bg-[#1e4635] text-white px-6 py-3 rounded-full font-medium hover:bg-[#153427] transition flex items-center gap-2">
              View My Portfolio
            </a>
            <a href="#contact" className="border border-slate-300 px-6 py-3 rounded-full font-medium hover:border-[#1e4635] transition flex items-center gap-2">
              Hire Me <FaArrowRight size={12} />
            </a>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="md:w-1/2 flex justify-center mt-12 md:mt-0 relative">
          <div className="absolute inset-0 bg-[#f4b316] rounded-[40%_60%_70%_30%/40%_50%_60%_50%] scale-90 md:scale-110 -z-10 opacity-80 translate-x-4 translate-y-4"></div>
          <div className="w-80 h-80 md:w-[400px] md:h-[450px] rounded-[40%_60%_70%_30%/40%_50%_60%_50%] overflow-hidden border-4 border-white shadow-2xl relative">
            <img src={profilePic} alt="Samwel Abwao" className="w-full h-full object-cover" />
            <div className="absolute bottom-8 -left-6 bg-[#1e4635] text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 shadow-lg">
              <FaBriefcase size={12} className="text-[#f4b316]" /> Software Engineer
            </div>
          </div>
        </motion.div>
      </section>

      {/* ---- Marquee ---- */}
      <div className="bg-[#f4b316] py-4 overflow-hidden border-y border-[#d99b06] rotate-[-1deg] scale-105 my-8">
        {/* We duplicate the list to create a seamless infinite loop */}
        <div className="flex whitespace-nowrap animate-marquee text-[#1e4635] font-bold text-xl uppercase tracking-widest serif items-center">
          
          {/* First Set of Skills */}
          <span className="mx-6 flex items-center gap-3">React.js <FaReact /></span>
          <span className="mx-6 flex items-center gap-3">Node.js <FaNodeJs /></span>
          <span className="mx-6 flex items-center gap-3">Express.js <SiExpress /></span>
          <span className="mx-6 flex items-center gap-3">TypeScript <SiTypescript /></span>
          <span className="mx-6 flex items-center gap-3">JavaScript <SiJavascript /></span>
          <span className="mx-6 flex items-center gap-3">Java <FaJava /></span>
          <span className="mx-6 flex items-center gap-3">Kotlin <SiKotlin /></span>
          <span className="mx-6 flex items-center gap-3">Jetpack Compose <SiJetpackcompose /></span>
          <span className="mx-6 flex items-center gap-3">PostgreSQL <SiPostgresql /></span>
          <span className="mx-6 flex items-center gap-3">MongoDB <SiMongodb /></span>
          <span className="mx-6 flex items-center gap-3">MySQL <SiMysql /></span>
          <span className="mx-6 flex items-center gap-3">Docker <FaDocker /></span>
          <span className="mx-6 flex items-center gap-3">Kubernetes <SiKubernetes /></span>
          <span className="mx-6 flex items-center gap-3">Git <FaGitAlt /></span>
          <span className="mx-6 flex items-center gap-3">GitHub <FaGithub /></span>

          {/* Second Set (Duplicated for the seamless infinite scroll effect) */}
          <span className="mx-6 flex items-center gap-3">React.js <FaReact /></span>
          <span className="mx-6 flex items-center gap-3">Node.js <FaNodeJs /></span>
          <span className="mx-6 flex items-center gap-3">Express.js <SiExpress /></span>
          <span className="mx-6 flex items-center gap-3">TypeScript <SiTypescript /></span>
          <span className="mx-6 flex items-center gap-3">JavaScript <SiJavascript /></span>
          <span className="mx-6 flex items-center gap-3">Java <FaJava /></span>
          <span className="mx-6 flex items-center gap-3">Kotlin <SiKotlin /></span>
          <span className="mx-6 flex items-center gap-3">Jetpack Compose <SiJetpackcompose /></span>
          <span className="mx-6 flex items-center gap-3">PostgreSQL <SiPostgresql /></span>
          <span className="mx-6 flex items-center gap-3">MongoDB <SiMongodb /></span>
          <span className="mx-6 flex items-center gap-3">MySQL <SiMysql /></span>
          <span className="mx-6 flex items-center gap-3">Docker <FaDocker /></span>
          <span className="mx-6 flex items-center gap-3">Kubernetes <SiKubernetes /></span>
          <span className="mx-6 flex items-center gap-3">Git <FaGitAlt /></span>
          <span className="mx-6 flex items-center gap-3">GitHub <FaGithub /></span>

        </div>
      </div>

      {/* ---- About (Dark Green) ---- */}
      <section id="about" className="bg-[#1e4635] text-white py-24 mt-16">
        <div className="max-w-6xl mx-auto px-8 flex flex-col md:flex-row items-center gap-16">
          <div className="md:w-1/3 flex justify-center relative">
            <div className="w-72 h-72 rounded-full border-8 border-[#f4b316] overflow-hidden shadow-2xl relative z-10">
              <img src={profilePic} alt="Samwel" className="w-full h-full object-cover" />
            </div>
          </div>
          <div className="md:w-2/3 space-y-6">
            <div className="inline-flex items-center gap-2 text-[#f4b316] font-semibold text-sm uppercase tracking-wider">
              <span className="w-8 h-[2px] bg-[#f4b316]"></span> About Me
            </div>
            <h3 className="text-4xl font-bold serif leading-tight">Who is Samwel Abwao?</h3>
            <p className="text-slate-300 leading-relaxed text-lg max-w-xl">
              I am a Software Engineering student at Multimedia University of Kenya (MMU) and an alumnus of Alliance High School. I specialize in building robust web applications, native Android solutions, and managing cloud infrastructure. I recently completed a software development internship at Momentum Labs CLG, where I collaborated with international teams to deploy production-ready applications.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-6 border-t border-[#3a5c4d]">
              <div><h4 className="text-3xl font-bold text-[#f4b316] serif">6+</h4><p className="text-sm text-slate-400">Projects Built</p></div>
              <div><h4 className="text-3xl font-bold text-[#f4b316] serif">10+</h4><p className="text-sm text-slate-400">Tech Stack Tools</p></div>
              <div><h4 className="text-3xl font-bold text-[#f4b316] serif">100%</h4><p className="text-sm text-slate-400">Dedication</p></div>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Skills ---- */}
      <section id="skills" className="py-24 bg-[#fdfaed]">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          
          <div className="text-center mb-16">
            <div className="text-[#f4b316] font-semibold text-sm uppercase tracking-wider mb-2">~ My Arsenal</div>
            <h3 className="text-4xl font-bold serif">Technologies I <span className="text-[#f4b316] italic">Work With</span></h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4 max-w-6xl mx-auto">
            {/* Frontend */}
            <div className="bg-white p-4 md:p-6 rounded-2xl shadow-md border border-[#f4b316]/20 flex flex-col items-center justify-center gap-3 hover:-translate-y-1 transition duration-300">
              <FaReact className="text-4xl text-[#61DAFB]" />
              <span className="font-bold text-sm text-slate-700">React.js</span>
            </div>
            <div className="bg-white p-4 md:p-6 rounded-2xl shadow-md border border-[#f4b316]/20 flex flex-col items-center justify-center gap-3 hover:-translate-y-1 transition duration-300">
              <SiTypescript className="text-4xl text-[#3178C6]" />
              <span className="font-bold text-sm text-slate-700">TypeScript</span>
            </div>
            <div className="bg-white p-4 md:p-6 rounded-2xl shadow-md border border-[#f4b316]/20 flex flex-col items-center justify-center gap-3 hover:-translate-y-1 transition duration-300">
              <SiJavascript className="text-4xl text-[#F7DF1E]" />
              <span className="font-bold text-sm text-slate-700">JavaScript</span>
            </div>

            {/* Backend */}
            <div className="bg-white p-4 md:p-6 rounded-2xl shadow-md border border-[#f4b316]/20 flex flex-col items-center justify-center gap-3 hover:-translate-y-1 transition duration-300">
              <FaNodeJs className="text-4xl text-[#339933]" />
              <span className="font-bold text-sm text-slate-700">Node.js</span>
            </div>
            <div className="bg-white p-4 md:p-6 rounded-2xl shadow-md border border-[#f4b316]/20 flex flex-col items-center justify-center gap-3 hover:-translate-y-1 transition duration-300">
              <SiExpress className="text-4xl text-slate-800" />
              <span className="font-bold text-sm text-slate-700">Express.js</span>
            </div>
            <div className="bg-white p-4 md:p-6 rounded-2xl shadow-md border border-[#f4b316]/20 flex flex-col items-center justify-center gap-3 hover:-translate-y-1 transition duration-300">
              <FaJava className="text-4xl text-[#007396]" />
              <span className="font-bold text-sm text-slate-700">Java</span>
            </div>
            <div className="bg-white p-4 md:p-6 rounded-2xl shadow-md border border-[#f4b316]/20 flex flex-col items-center justify-center gap-3 hover:-translate-y-1 transition duration-300">
              <SiKotlin className="text-4xl text-[#7F52FF]" />
              <span className="font-bold text-sm text-slate-700">Kotlin</span>
            </div>
            <div className="bg-white p-4 md:p-6 rounded-2xl shadow-md border border-[#f4b316]/20 flex flex-col items-center justify-center gap-3 hover:-translate-y-1 transition duration-300">
              <SiJetpackcompose className="text-4xl text-[#4285F4]" />
              <span className="font-bold text-sm text-slate-700">Jetpack Compose</span>
            </div>

            {/* Databases */}
            <div className="bg-white p-4 md:p-6 rounded-2xl shadow-md border border-[#f4b316]/20 flex flex-col items-center justify-center gap-3 hover:-translate-y-1 transition duration-300">
              <SiPostgresql className="text-4xl text-[#4169E1]" />
              <span className="font-bold text-sm text-slate-700">PostgreSQL</span>
            </div>
            <div className="bg-white p-4 md:p-6 rounded-2xl shadow-md border border-[#f4b316]/20 flex flex-col items-center justify-center gap-3 hover:-translate-y-1 transition duration-300">
              <SiMongodb className="text-4xl text-[#47A248]" />
              <span className="font-bold text-sm text-slate-700">MongoDB</span>
            </div>
            <div className="bg-white p-4 md:p-6 rounded-2xl shadow-md border border-[#f4b316]/20 flex flex-col items-center justify-center gap-3 hover:-translate-y-1 transition duration-300">
              <SiMysql className="text-4xl text-[#4479A1]" />
              <span className="font-bold text-sm text-slate-700">MySQL</span>
            </div>

            {/* DevOps & Tools */}
            <div className="bg-white p-4 md:p-6 rounded-2xl shadow-md border border-[#f4b316]/20 flex flex-col items-center justify-center gap-3 hover:-translate-y-1 transition duration-300">
              <FaDocker className="text-4xl text-[#2496ED]" />
              <span className="font-bold text-sm text-slate-700">Docker</span>
            </div>
            <div className="bg-white p-4 md:p-6 rounded-2xl shadow-md border border-[#f4b316]/20 flex flex-col items-center justify-center gap-3 hover:-translate-y-1 transition duration-300">
              <SiKubernetes className="text-4xl text-[#326CE5]" />
              <span className="font-bold text-sm text-slate-700">Kubernetes</span>
            </div>
            <div className="bg-white p-4 md:p-6 rounded-2xl shadow-md border border-[#f4b316]/20 flex flex-col items-center justify-center gap-3 hover:-translate-y-1 transition duration-300">
              <FaGitAlt className="text-4xl text-[#F05032]" />
              <span className="font-bold text-sm text-slate-700">Git</span>
            </div>
            <div className="bg-white p-4 md:p-6 rounded-2xl shadow-md border border-[#f4b316]/20 flex flex-col items-center justify-center gap-3 hover:-translate-y-1 transition duration-300">
              <FaGithub className="text-4xl text-[#181717]" />
              <span className="font-bold text-sm text-slate-700">GitHub</span>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Education & Experience ---- */}
      <section id="journey" className="py-24 max-w-6xl mx-auto px-8">
        <div className="text-center mb-16">
          <div className="text-[#f4b316] font-semibold text-sm uppercase tracking-wider mb-2">~ Education & Work</div>
          <h3 className="text-4xl font-bold serif">My Academic and<br />Professional Journey</h3>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Education */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-[#f4b316] text-white p-3 rounded-full"><FaGraduationCap size={24} /></div>
              <h4 className="text-2xl font-bold">Education</h4>
            </div>
            <div className="space-y-8 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
              <div className="relative pl-8">
                <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-[#f4b316] border-4 border-white shadow"></div>
                <p className="text-sm text-slate-500 font-medium mb-1">2024 - 2028 (Expected)</p>
                <h5 className="text-lg font-bold text-slate-800">BSc. Software Engineering</h5>
                <p className="text-slate-500">Multimedia University of Kenya</p>
              </div>
              <div className="relative pl-8">
                <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-slate-300 border-4 border-white shadow"></div>
                <p className="text-sm text-slate-500 font-medium mb-1">2020 - 2023</p>
                <h5 className="text-lg font-bold text-slate-800">Kenya Certificate of Secondary Education</h5>
                <p className="text-slate-500">Alliance High School</p>
              </div>
            </div>
          </div>

          {/* Experience */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-[#1e4635] text-white p-3 rounded-full"><FaBriefcase size={24} /></div>
              <h4 className="text-2xl font-bold">Work Experience</h4>
            </div>
            <div className="space-y-8 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
              <div className="relative pl-8">
                <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-[#1e4635] border-4 border-white shadow"></div>
                <p className="text-sm text-slate-500 font-medium mb-1">June 2026 - August 2026</p>
                <h5 className="text-lg font-bold text-slate-800">Software Development Intern</h5>
                <p className="text-slate-500">Momentum Labs CLG</p>
                <a href="/momentum-certificate.pdf" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 mt-3 text-sm font-medium text-[#1e4635] hover:text-[#f4b316] transition">
                  <FaFilePdf /> View Certificate
                </a>
              </div>
              <div className="relative pl-8">
                <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-slate-300 border-4 border-white shadow"></div>
                <p className="text-sm text-slate-500 font-medium mb-1">Ongoing</p>
                <h5 className="text-lg font-bold text-slate-800">Freelance Developer</h5>
                <p className="text-slate-500">Web & Android Development</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Projects ---- */}
      <section id="projects" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-8">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-12 text-center md:text-left">
            <div>
              <div className="text-[#f4b316] font-semibold text-sm uppercase tracking-wider mb-2">~ My Portfolio</div>
              <h3 className="text-4xl font-bold serif">My Latest <span className="text-[#f4b316] italic">Projects</span></h3>
            </div>
            <a href="https://github.com/AbwaoSam" target="_blank" rel="noreferrer" className="mt-6 md:mt-0 bg-[#1e4635] text-white px-6 py-2 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-[#153427] transition w-fit">
              View All Projects <FaArrowRight size={12} />
            </a>
          </div>
          <div className="grid md:grid-cols-2 gap-10">
            {projects.map((project) => (
              <motion.div whileHover={{ y: -5 }} key={project._id || project.id} className="group cursor-pointer">
                <div className="overflow-hidden rounded-2xl mb-5 relative">
                  <img src={getProjectImage(project)} alt={project.title} className="w-full h-72 object-cover transform group-hover:scale-105 transition duration-500" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition"></div>
                </div>
                <div className="flex gap-2 mb-3">
                  {project.tags && project.tags.map((tag, idx) => (
                    <span key={idx} className="bg-[#f4b316]/20 text-[#d99b06] px-3 py-1 rounded-full text-xs font-semibold">{tag}</span>
                  ))}
                </div>
                <div className="flex justify-between items-center">
                  <h4 className="text-2xl font-bold text-slate-800 group-hover:text-[#1e4635] transition">{project.title}</h4>
                  <a href={project.link} target="_blank" rel="noreferrer" className="bg-[#1e4635] text-white p-2 rounded-full hover:bg-[#f4b316] transition">
                    <FaArrowRight size={14} className="-rotate-45" />
                  </a>
                </div>
                <p className="text-slate-500 mt-2">{project.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- FAQ ---- */}
      <section id="faq" className="bg-[#1e4635] py-24 text-white">
        <div className="max-w-3xl mx-auto px-8">
          <div className="text-center mb-12">
            <div className="text-[#f4b316] font-semibold text-sm uppercase tracking-wider mb-2">~ FAQs</div>
            <h3 className="text-4xl font-bold serif">Questions? <span className="text-[#f4b316] italic">Look here.</span></h3>
          </div>
          <div className="space-y-4">
            {[
              { id: 1, q: 'What is your primary tech stack?', a: 'For web development, I use React.js, Node.js, Express, and TypeScript. For Android, I use Kotlin, Jetpack Compose, and Room. I also have experience with Docker, Kubernetes, and PostgreSQL.' },
              { 
                id: 2, 
                q: 'Can I download your resume/CV for information?', 
                a: (
                  <>
                    Certainly! You can <a href="/Samwel__Abwao_CV.pdf" target="_blank" rel="noreferrer" className="font-bold underline hover:text-white transition">download my CV directly here</a>. It provides a comprehensive overview of my education, work experience, and technical achievements.
                  </>
                )
              },
              { id: 3, q: 'Are you available for freelance or full-time work?', a: 'Yes, I am currently open to software engineering internships, freelance projects, and junior developer roles.' },
              { id: 4, q: 'How do I navigate through your portfolio projects?', a: "You can scroll up to the 'Projects' section or visit my GitHub profile directly via the links provided in the navigation bar." },
            ].map((faq) => (
              <div key={faq.id} className={`rounded-xl transition-all duration-300 ${openFaq === faq.id ? 'bg-[#f4b316] text-[#1e4635]' : 'bg-[#2a5a45] hover:bg-[#346e55]'}`}>
                <button onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)} className="w-full flex justify-between items-center p-6 text-left font-semibold text-lg">
                  {faq.q}
                  <span>{openFaq === faq.id ? <FaMinus /> : <FaPlus />}</span>
                </button>
                {openFaq === faq.id && <div className="px-6 pb-6 text-[#1e4635]/80 font-medium">{faq.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Footer ---- */}
      <footer id="contact" className="bg-white pt-20 pb-10 px-8">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-12 border-b border-slate-200 pb-16 items-start">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-[#1e4635] text-white p-2 rounded-full"><FaBriefcase size={14} /></div>
              <h1 className="text-2xl font-bold tracking-tight">Samwel.</h1>
            </div>
            <p className="text-slate-500 max-w-sm mb-6">Software Engineer specializing in Web Development, Android Development, Databases, and DevOps. Building solutions for the modern web.</p>
            <div className="flex gap-4">
              <a href="https://github.com/AbwaoSam" target="_blank" rel="noreferrer" className="bg-[#f4b316] text-white p-3 rounded-full hover:bg-[#1e4635] transition"><FaGithub /></a>
              <a href="https://www.linkedin.com/in/samwel-abwao-1bb0b2310/" target="_blank" rel="noreferrer" className="bg-[#f4b316] text-white p-3 rounded-full hover:bg-[#1e4635] transition"><FaLinkedin /></a>
              <a href="https://www.instagram.com/_aboiau_amuel/" target="_blank" rel="noreferrer" className="bg-[#f4b316] text-white p-3 rounded-full hover:bg-[#1e4635] transition"><FaInstagram /></a>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-6">Contact Info</h4>
            <ul className="space-y-4 text-slate-500">
              <li>
                <a 
                  href="mailto:samhuit770@gmail.com" 
                  className="flex items-center gap-3 hover:text-[#1e4635] transition group"
                >
                  <FaEnvelope className="text-[#f4b316] group-hover:scale-110 transition" /> 
                  samhuit770@gmail.com
                </a>
              </li>
              <li>
                <a 
                  href="https://wa.me/254768795336" 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center gap-3 hover:text-[#1e4635] transition group"
                >
                  <FaWhatsapp className="text-[#f4b316] group-hover:scale-110 transition" /> 
                  +254 768 795 336
                </a>
              </li>
              <li>
                <a 
                  href="https://www.google.com/maps/place/Nairobi,+Kenya" 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-sm mt-4 block hover:text-[#1e4635] transition"
                >
                  Nairobi, Kenya
                </a>
              </li>
            </ul>
          </div>
          {/* Contact Form */}
          <div>
            <h4 className="font-bold text-lg mb-6">Send a Message</h4>
            <form onSubmit={handleContactSubmit} className="flex flex-col gap-3">
              <input 
                type="text" 
                placeholder="Your Name" 
                required
                value={contactData.name}
                onChange={(e) => setContactData({...contactData, name: e.target.value})}
                className="bg-slate-100 px-4 py-2 rounded-lg outline-none text-sm text-slate-700 w-full focus:ring-2 focus:ring-[#1e4635]/30" 
              />
              <input 
                type="email" 
                placeholder="Your Email" 
                required
                value={contactData.email}
                onChange={(e) => setContactData({...contactData, email: e.target.value})}
                className="bg-slate-100 px-4 py-2 rounded-lg outline-none text-sm text-slate-700 w-full focus:ring-2 focus:ring-[#1e4635]/30" 
              />
              <textarea 
                placeholder="How can I help you?" 
                required
                rows="3"
                value={contactData.message}
                onChange={(e) => setContactData({...contactData, message: e.target.value})}
                className="bg-slate-100 px-4 py-2 rounded-lg outline-none text-sm text-slate-700 w-full resize-none focus:ring-2 focus:ring-[#1e4635]/30" 
              />
              
              <button 
                type="submit"
                disabled={isSubmitting}
                className="bg-[#1e4635] text-white px-4 py-2 rounded-lg hover:bg-[#f4b316] hover:text-[#1e4635] font-medium transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'} <FaPaperPlane size={14} />
              </button>

              {contactStatus.message && (
                <p className={`text-xs mt-1 font-medium ${contactStatus.type === 'error' ? 'text-red-500' : 'text-green-600'}`}>
                  {contactStatus.message}
                </p>
              )}
            </form>
          </div>
        </div>
        <div className="max-w-6xl mx-auto pt-8 text-center text-slate-400 text-sm flex flex-col md:flex-row justify-between items-center">
          <p>© {new Date().getFullYear()} Samwel O. Abwao. All rights reserved.</p>
        </div>
      </footer>

      {/* ---- AI Chat Floating Button ---- */}
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-6 right-6 bg-[#1e4635] text-white p-4 rounded-full shadow-2xl hover:bg-[#f4b316] transition z-50"
        aria-label="Open AI Assistant"
      >
        <FaRobot size={24} />
      </button>

      {/* ---- AI Chat Panel ---- */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-slate-200 overflow-hidden"
          >
            <div className="bg-[#1e4635] text-white p-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <FaRobot size={20} />
                <span className="font-semibold">Samwel's AI Assistant</span>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="hover:text-[#f4b316] transition">
                <FaTimes size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-[#1e4635] text-white rounded-br-none' : 'bg-white text-slate-700 border border-slate-200 rounded-bl-none shadow-sm'}`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white text-slate-400 border border-slate-200 p-3 rounded-2xl rounded-bl-none text-sm">
                    Thinking...
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="p-3 bg-white border-t border-slate-200 flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about Samwel..."
                className="flex-1 bg-slate-100 rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1e4635]/30"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !chatInput.trim()}
                className="bg-[#1e4635] text-white p-2.5 rounded-full hover:bg-[#f4b316] transition disabled:opacity-50"
              >
                <FaPaperPlane size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;