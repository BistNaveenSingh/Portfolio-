'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import ScrollExpandMedia from '@/components/ui/scroll-expansion-hero';
import { Boxes } from '@/components/ui/background-boxes';
import {
  MessageCircle,
  Link as LinkIcon,
  GitBranch,
  Code2,
  Link as Instagram,
  Share2,
  MessageSquare,
} from 'lucide-react';
import { ScatteredProjects } from '@/components/ui/scattered-projects';

const currentMedia = {
  src: 'https://images.unsplash.com/photo-1726066012698-bb7a3abce786?q=80&w=1280&auto=format&fit=crop',
  background: 'https://images.unsplash.com/photo-1654618977232-a6c6dea9d1e8?q=80&w=1920&auto=format&fit=crop',
  title: 'Bist Naveen Singh',
  date: 'Full-Stack Software Engineer',
  scrollToExpand: 'Scroll down to expand profile',
  about: {
    intro:
      "I'm a passionate full-stack developer currently pursuing my Diploma in Computer Science Engineering (2023-2026) and B.Tech in Computer Science (2026-2029) at CMR Technical Campus. I specialize in building modern web applications with React.js, Node.js, and MongoDB. With a strong foundation in data structures and core computer science concepts, I'm committed to creating scalable, efficient solutions.",
    projects:
      "I've built several full-stack projects including a Student Solution Platform for sharing study resources, a responsive portfolio website, and an expense tracker application. Each project has strengthened my understanding of REST APIs, authentication systems, and deployment practices using platforms like Vercel and Render.",
    vision:
      "I'm driven by the challenge of solving complex problems through clean code and thoughtful architecture. Let's connect if you'd like to collaborate on projects, discuss technology, or explore opportunities to build something amazing together!",
  },
};

const ProfileImage = ({ src }: { src?: string }) => {
  return (
    <div className='flex items-center justify-center'>
      <div className='w-56 h-56 rounded-full bg-[#1a1a1a] flex items-center justify-center overflow-hidden flex-shrink-0 shadow-lg'>
        {src ? (
          <img
            src={src}
            alt='Profile'
            className='w-full h-full object-cover'
          />
        ) : (
          <div className='text-center'>
            <div className='text-neutral-500 text-sm'>Add your photo here</div>
          </div>
        )}
      </div>
    </div>
  );
};

const SocialLinks = () => {
  const socialPlatforms = [
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      url: 'https://wa.me/916302908404',
      color: 'hover:text-green-400',
    },
    {
      name: 'LinkedIn',
      icon: LinkIcon,
      url: 'https://www.linkedin.com/in/bist-naveen-singh-538004342/',
      color: 'hover:text-blue-400',
    },
    {
      name: 'GitHub',
      icon: GitBranch,
      url: 'https://github.com/bunnynaveen363',
      color: 'hover:text-slate-300',
    },
    {
      name: 'LeetCode',
      icon: Code2,
      url: 'https://leetcode.com/bunnynaveen363',
      color: 'hover:text-yellow-400',
    },
    {
      name: 'Instagram',
      icon: Instagram,
      url: 'https://instagram.com',
      color: 'hover:text-pink-400',
    },
    {
      name: 'Twitter',
      icon: Share2,
      url: 'https://twitter.com',
      color: 'hover:text-blue-300',
    },
    {
      name: 'Discord',
      icon: MessageSquare,
      url: 'https://discord.com',
      color: 'hover:text-indigo-400',
    },
  ];

  return (
    <div className='max-w-4xl mx-auto px-4 py-16 text-white'>
      <h2 className='text-3xl font-bold mb-3 tracking-tight'>
        Let&apos;s Connect
      </h2>
      <p className='text-lg text-neutral-400 mb-12'>Find Me Online</p>

      <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6'>
        {socialPlatforms.map((platform) => {
          const Icon = platform.icon;
          return (
            <a
              key={platform.name}
              href={platform.url}
              target='_blank'
              rel='noopener noreferrer'
              className={`flex flex-col items-center justify-center p-4 rounded-lg bg-white/5 border border-white/10 transition-all duration-300 ${platform.color} hover:bg-white/10 hover:border-white/30`}
              title={platform.name}
            >
              <Icon className='w-8 h-8 mb-2' />
              <span className='text-xs font-medium text-center text-neutral-300'>
                {platform.name}
              </span>
            </a>
          );
        })}
      </div>

      <p className='text-center text-neutral-400 text-sm mt-12'>
        Let&apos;s collaborate, learn, and build amazing things together!
      </p>
    </div>
  );
};

import { CubeCard } from "./cube-card";
import MusicPlayer from "./music-player";

type RotateDir = "up" | "down" | "left" | "right";

interface SkillCell {
  type: "skill";
  id: string;
  imageSrc: string;
  imageAlt: string;
  title: string;
  backDescription: string;
  buttonText: string;
  rotate: RotateDir;
}

interface DecoCell {
  type: "deco";
  id: string;
  gradient: string;
  label: string;
}

type GridCell = SkillCell | DecoCell;

const gridCells: GridCell[] = [
  {
    type: "skill",
    id: "frontend",
    imageSrc: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=400&h=400&auto=format&fit=crop",
    imageAlt: "Frontend Development",
    title: "Frontend",
    backDescription: "React.js, Next.js, Tailwind CSS — pixel-perfect, responsive UIs.",
    buttonText: "View Projects",
    rotate: "down",
  },
  {
    type: "skill",
    id: "backend",
    imageSrc: "https://images.unsplash.com/photo-1623282033815-40b05d96c903?q=80&w=400&h=400&auto=format&fit=crop",
    imageAlt: "Backend Development",
    title: "Backend",
    backDescription: "Node.js, Express, REST APIs — secure & scalable server architectures.",
    buttonText: "Learn More",
    rotate: "right",
  },
  {
    type: "skill",
    id: "typescript",
    imageSrc: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=400&h=400&auto=format&fit=crop",
    imageAlt: "TypeScript",
    title: "TypeScript",
    backDescription: "Strict static typing, interfaces, and scalable modern TS architecture.",
    buttonText: "View Code",
    rotate: "up",
  },
  {
    type: "skill",
    id: "database",
    imageSrc: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=400&h=400&auto=format&fit=crop",
    imageAlt: "Database Management",
    title: "Database",
    backDescription: "MongoDB, schema design, aggregation pipelines & data optimization.",
    buttonText: "Learn More",
    rotate: "left",
  },
  {
    type: "skill",
    id: "cloud",
    imageSrc: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=400&h=400&auto=format&fit=crop",
    imageAlt: "Cloud Computing",
    title: "Cloud",
    backDescription: "Google Cloud, Azure, Oracle OCI — deployment & serverless computing.",
    buttonText: "View Creds",
    rotate: "up",
  },
  {
    type: "skill",
    id: "api",
    imageSrc: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=400&h=400&auto=format&fit=crop",
    imageAlt: "API Design",
    title: "API Design",
    backDescription: "RESTful architecture, JWT Auth, Postman testing & WebSockets.",
    buttonText: "View APIs",
    rotate: "left",
  },
  {
    type: "skill",
    id: "devops",
    imageSrc: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?q=80&w=400&h=400&auto=format&fit=crop",
    imageAlt: "DevOps",
    title: "DevOps",
    backDescription: "Git, Vercel, Render deployments, CI/CD pipelines & containerization.",
    buttonText: "View Deployments",
    rotate: "up",
  },
  {
    type: "skill",
    id: "dsa",
    imageSrc: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=400&h=400&auto=format&fit=crop",
    imageAlt: "DSA",
    title: "DSA",
    backDescription: "Strong CS fundamentals — algorithmic challenges & optimized logic.",
    buttonText: "View Profile",
    rotate: "down",
  },
  {
    type: "skill",
    id: "uiux",
    imageSrc: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=400&h=400&auto=format&fit=crop",
    imageAlt: "UI/UX Design",
    title: "UI/UX",
    backDescription: "Modern design systems, user research & intuitive experiences.",
    buttonText: "View Designs",
    rotate: "right",
  },
];

function CubeFront({ imageSrc, imageAlt, title }: { imageSrc: string; imageAlt: string; title: string }) {
  return (
    <div className="relative h-full w-full">
      <img src={imageSrc} alt={imageAlt} className="w-full h-full object-cover" />
      <div className="absolute top-0 left-0 w-full h-10 bg-gradient-to-b from-blue-500/30 to-transparent pointer-events-none" />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="bg-black/70 px-2 py-1 rounded">
          <h3 className="text-xs font-semibold text-white drop-shadow-lg">{title}</h3>
        </div>
      </div>
    </div>
  );
}

function CubeBack({ title, description, buttonText }: { title: string; description: string; buttonText: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full px-4 py-3 bg-black">
      <h3 className="text-[10px] font-bold text-white mb-1.5 tracking-widest uppercase text-center">{title}</h3>
      <div className="h-[1px] w-8 bg-white/20 mb-1.5"></div>
      <p className="text-[10px] text-neutral-400 text-center leading-relaxed line-clamp-4">
        {description}
      </p>
      <button className="mt-2 bg-white text-black px-3 py-1 rounded-none text-[9px] whitespace-nowrap font-semibold hover:bg-neutral-200 transition-colors">
        {buttonText}
      </button>
    </div>
  );
}

const CUBE_SIZE = 200;

const Skills = () => {
  return (
    <div className='max-w-4xl mx-auto px-4 py-20 text-white'>
      <div className='text-center mb-16 pointer-events-auto'>
        <p className='text-sm font-semibold text-slate-400 mb-4 uppercase tracking-[0.3em]'>WHAT I DO</p>
        <h2 className='text-3xl md:text-4xl font-bold mb-4 tracking-[0.2em] uppercase text-white'>
          SKILLS
        </h2>
        <div className='h-[1px] w-full max-w-[100px] mx-auto bg-gradient-to-r from-transparent via-white/50 to-transparent'></div>
      </div>

      <div className="grid grid-cols-3 gap-2 max-w-[616px] mx-auto pointer-events-auto">
        {gridCells.map((cell) =>
          cell.type === "skill" ? (
            <CubeCard
              key={cell.id}
              size={CUBE_SIZE}
              rotateDirection={cell.rotate}
              frontContent={
                <CubeFront imageSrc={cell.imageSrc} imageAlt={cell.imageAlt} title={cell.title} />
              }
              backContent={
                <CubeBack title={cell.title} description={cell.backDescription} buttonText={cell.buttonText} />
              }
            />
          ) : (
            <div
              key={cell.id}
              className={`w-[${CUBE_SIZE}px] h-[${CUBE_SIZE}px] rounded-none bg-gradient-to-br ${cell.gradient} border border-black shadow-[0_0_10px_rgba(255,255,255,0.15)] flex items-center justify-center`}
              style={{ width: CUBE_SIZE, height: CUBE_SIZE }}
            >
              <span className="text-2xl text-white/10">{cell.label}</span>
            </div>
          )
        )}
      </div>
    </div>
  );
};

const Certifications = () => {
  const certifications = [
    {
      title: 'Google Cloud Associate Cloud Engineer',
      subtitle: 'Associate Cloud Engineer',
      issuer: 'Google Cloud',
      year: '2024',
      iconUrl: 'https://www.vectorlogo.zone/logos/google_cloud/google_cloud-icon.svg',
      credentialUrl: '#',
    },
    {
      title: 'Microsoft Azure Fundamentals',
      subtitle: 'AZ-900 Certified',
      issuer: 'Microsoft',
      year: '2024',
      iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg',
      credentialUrl: '#',
    },
    {
      title: 'Oracle OCI AI Foundations',
      subtitle: 'Foundations Associate 2025',
      issuer: 'Oracle',
      year: '2025',
      iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/50/Oracle_logo.svg',
      credentialUrl: '#',
    },
    {
      title: 'Full Stack Web Development',
      subtitle: 'Complete Certification',
      issuer: 'CMR Technical Campus',
      year: '2023',
      iconUrl: 'https://img.icons8.com/color/96/university.png',
      credentialUrl: '#',
    },
    {
      title: 'Data Structures & Algorithms',
      subtitle: 'Advanced Mastery',
      issuer: 'LeetCode',
      year: '2023',
      iconUrl: 'https://cdn.simpleicons.org/leetcode/FFA116',
      credentialUrl: '#',
    },
    {
      title: 'React.js Advanced Development',
      subtitle: 'Professional Level',
      issuer: 'Udemy',
      year: '2023',
      iconUrl: 'https://cdn.simpleicons.org/udemy/A435F0',
      credentialUrl: '#',
    },
  ];

  return (
    <div className='max-w-6xl mx-auto px-4 py-20 text-white'>
      <div className='text-center mb-16 pointer-events-auto'>
        <h2 className='text-2xl md:text-3xl font-bold mb-4 tracking-[0.2em] uppercase text-white'>
          CERTIFICATIONS & BADGES
        </h2>
        <div className='h-[1px] w-full max-w-md mx-auto bg-gradient-to-r from-transparent via-white/30 to-transparent'></div>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4 md:px-0'>
        {certifications.map((cert, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 60, scale: 0.85, rotateX: -15 }}
            whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
            whileHover={{ y: -8, scale: 1.03, transition: { duration: 0.3 } }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ type: 'spring', stiffness: 120, damping: 14, delay: index * 0.08 }}
            style={{ perspective: '800px' }}
            className='flex flex-col items-center text-center p-8 rounded-2xl bg-[#0a0a0a] border border-white/[0.04] hover:bg-[#151515] transition-colors duration-300 pointer-events-auto h-64 justify-center'
          >
            {/* Icon */}
            <div className='mb-6 flex items-center justify-center h-12 w-12'>
              {cert.issuer === 'Oracle' ? (
                <div className='bg-white rounded-lg p-1 w-10 h-10 flex items-center justify-center shadow-sm'>
                  <img src={cert.iconUrl} alt={cert.issuer} className='w-full object-contain' />
                </div>
              ) : (
                <img src={cert.iconUrl} alt={cert.issuer} className='h-8 w-8 object-contain' />
              )}
            </div>
            
            {/* Content */}
            <h3 className='text-[15px] font-bold text-white mb-2 tracking-wide'>
              {cert.title}
            </h3>
            <p className='text-xs text-neutral-400 mb-6 font-light'>
              {cert.subtitle}
            </p>
            
            {/* Footer verify link */}
            <div className='mt-auto'>
              <a
                href={cert.credentialUrl}
                className='inline-flex items-center text-blue-500 hover:text-blue-400 text-xs font-bold tracking-widest uppercase transition-colors group/link'
              >
                VERIFY
                <span className='ml-1 opacity-80'>→</span>
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const MediaContent = () => {
  return (
    <div className='w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] bg-[#1a1a1a] mt-32 pb-32 pointer-events-auto'>
      <div className='max-w-3xl mx-auto px-8 md:px-12 py-24 text-white bg-[#222222] relative -mt-32 z-20 rounded-none border-none'>
        <h2 className='text-2xl font-bold mb-8 tracking-wide text-white'>
          About Me
        </h2>
        
        <div className='flex flex-col md:flex-row gap-12 items-center md:items-start'>
          <div className='flex-1'>
            <p className='text-[15px] leading-relaxed mb-6 text-neutral-400 font-light'>
              {currentMedia.about.intro}
            </p>

            <p className='text-[15px] leading-relaxed mb-6 text-neutral-400 font-light'>
              {currentMedia.about.projects}
            </p>

            <p className='text-[15px] leading-relaxed text-neutral-400 font-light'>
              {currentMedia.about.vision}
            </p>
          </div>

          <div className='flex-shrink-0'>
            <ProfileImage />
          </div>
        </div>
      </div>
    </div>
  );
};

const Demo = () => {
  useEffect(() => {
    window.scrollTo(0, 0);

    const resetEvent = new Event('resetSection');
    window.dispatchEvent(resetEvent);
  }, []);

  return (
    <div className='min-h-screen bg-black select-none font-sans antialiased text-white'>
      <ScrollExpandMedia
        mediaSrc={currentMedia.src}
        bgImageSrc={currentMedia.background}
        title={currentMedia.title}
        date={currentMedia.date}
        scrollToExpand={currentMedia.scrollToExpand}
      >
        <MediaContent />
      </ScrollExpandMedia>

      {/* Certifications Section */}
      <section className='relative w-full min-h-screen bg-[#1a1a1e] overflow-hidden flex items-center justify-center'>
        {/* Background Animation */}
        <div className='absolute inset-0 w-full h-full'>
          <Boxes />
          <div className='absolute inset-0 bg-gradient-to-b from-[#1a1a1e]/30 via-[#1a1a1e]/50 to-[#1a1a1e]/80 z-10 pointer-events-none' />
        </div>

        {/* Content */}
        <div className='relative z-20 w-full pointer-events-none'>
          <Certifications />
        </div>
      </section>

      {/* Skills Section */}
      <section className='relative w-full min-h-screen bg-[#1e1f22] overflow-hidden flex items-center justify-center'>
        {/* Background Animation */}
        <div className='absolute inset-0 w-full h-full'>
          <Boxes />
          <div className='absolute inset-0 bg-gradient-to-b from-[#1e1f22]/30 via-[#1e1f22]/50 to-[#1e1f22]/80 z-10 pointer-events-none' />
        </div>

        {/* Content */}
        <div className='relative z-20 w-full pointer-events-none py-10'>
          <Skills />
        </div>
      </section>

      {/* Scattered Projects Section */}
      <section className='relative w-full min-h-screen bg-[#1a1a1e] overflow-hidden flex items-center justify-center'>
        <div className='relative z-20 w-full pointer-events-none py-10'>
          <ScatteredProjects />
        </div>
      </section>

      <section className='relative w-full min-h-screen bg-black overflow-hidden'>
        <SocialLinks />
      </section>

      <MusicPlayer />
    </div>
  );
};

export default Demo;
