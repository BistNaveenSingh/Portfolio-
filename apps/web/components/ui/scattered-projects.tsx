'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';

const projects = [
  {
    id: 1, title: 'Student Solution Platform', category: 'Full-Stack App',
    description: 'A platform for students to share study resources, featuring user authentication and REST APIs.',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop',
    rotation: -8, top: '5%', left: '5%', z: 10,
  },
  {
    id: 2, title: 'Responsive Portfolio', category: 'Frontend',
    description: 'A modern, interactive portfolio with immersive animations and dynamic UI components.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop',
    rotation: 12, top: '2%', left: '55%', z: 20,
  },
  {
    id: 3, title: 'Expense Tracker', category: 'Web Application',
    description: 'Track daily expenses with visual charts, MongoDB integration, and responsive design.',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=800&auto=format&fit=crop',
    rotation: -4, top: '35%', left: '15%', z: 30,
  },
  {
    id: 4, title: 'E-Commerce Dashboard', category: 'Full-Stack',
    description: 'A comprehensive dashboard for managing sales, users, and inventory with real-time data.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop',
    rotation: 7, top: '30%', left: '50%', z: 15,
  },
  {
    id: 5, title: 'Chat Application', category: 'Real-Time',
    description: 'Real-time messaging app with WebSockets, user presence indicators, and message history.',
    image: 'https://images.unsplash.com/photo-1611746872915-64382b5c76da?q=80&w=800&auto=format&fit=crop',
    rotation: -11, top: '60%', left: '3%', z: 25,
  },
  {
    id: 6, title: 'Task Manager API', category: 'Backend',
    description: 'RESTful API with JWT authentication, role-based access control, and MongoDB integration.',
    image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?q=80&w=800&auto=format&fit=crop',
    rotation: 5, top: '58%', left: '40%', z: 12,
  },
  {
    id: 7, title: 'Weather Dashboard', category: 'API Integration',
    description: 'Live weather data visualization with geolocation, forecasts, and interactive maps.',
    image: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?q=80&w=800&auto=format&fit=crop',
    rotation: -6, top: '55%', left: '68%', z: 18,
  },
];

const DISC_SIZE = 650;
const ORBIT_RADIUS = 270;
const CARD_W = 200;
const CARD_H = 240;
const SPIN_SPEED = 0.004;
const HEADER_GAP = 40;

const DISCO_COLORS = [
  '#ff00ff', '#ff3366', '#ff6600', '#ffcc00', '#00ff88',
  '#00ffcc', '#00ffff', '#3366ff', '#6633ff', '#cc33ff',
  '#ff0099', '#ff6633', '#ffdd00', '#33ff88', '#00ffee',
  '#33ccff', '#6666ff', '#9933ff', '#ff33cc', '#ff9900',
];

export const ScatteredProjects = () => {
  const [isAttached, setIsAttached] = useState(true);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const hoveredIdRef = useRef<number | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const discRef = useRef<HTMLDivElement>(null);
  const angleRef = useRef(0);
  const rafRef = useRef<number>(0);
  const mountedRef = useRef(false);

  const getCx = () => (containerRef.current?.clientWidth ?? 1000) / 2;
  const getCy = () => HEADER_GAP + DISC_SIZE / 2;

  // ── Orbit animation loop ──
  const runOrbit = useCallback(() => {
    const animate = () => {
      // If a card is hovered, freeze orbit but keep the loop alive
      if (hoveredIdRef.current !== null) {
        rafRef.current = requestAnimationFrame(animate);
        return;
      }

      const cx = getCx();
      const cy = getCy();
      angleRef.current += SPIN_SPEED;

      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        const a = angleRef.current + (i / projects.length) * Math.PI * 2;
        const x = cx + Math.cos(a) * ORBIT_RADIUS - CARD_W / 2;
        const y = cy + Math.sin(a) * ORBIT_RADIUS - CARD_H / 2;
        const rot = a * 180 / Math.PI;
        const depth = Math.sin(a);

        el.style.transition = 'none';
        el.style.left = `${x}px`;
        el.style.top = `${y}px`;
        el.style.transform = `rotate(${rot}deg) scale(0.5)`;
        el.style.zIndex = String(Math.round(depth * 10 + 20));
        el.style.filter = 'brightness(1)';
      });

      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
  }, []);

  // ── Handle attach/detach + initial mount ──
  useEffect(() => {
    if (isAttached) {
      if (!mountedRef.current) {
        // First mount → start orbit immediately
        mountedRef.current = true;
        runOrbit();
        return () => cancelAnimationFrame(rafRef.current);
      }

      // Toggled back to attached → transition cards into orbit, then start loop
      const cx = getCx();
      const cy = getCy();

      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        const a = angleRef.current + (i / projects.length) * Math.PI * 2;
        const x = cx + Math.cos(a) * ORBIT_RADIUS - CARD_W / 2;
        const y = cy + Math.sin(a) * ORBIT_RADIUS - CARD_H / 2;

        el.style.transition = 'left 0.9s cubic-bezier(0.22,1,0.36,1), top 0.9s cubic-bezier(0.22,1,0.36,1), transform 0.9s cubic-bezier(0.22,1,0.36,1), filter 0.4s ease';
        el.style.left = `${x}px`;
        el.style.top = `${y}px`;
        el.style.transform = `rotate(${(a * 180 / Math.PI)}deg) scale(0.5)`;
        el.style.filter = 'brightness(1)';
      });

      const t = setTimeout(() => runOrbit(), 1000);
      return () => { clearTimeout(t); cancelAnimationFrame(rafRef.current); };
    } else {
      // Scatter cards
      mountedRef.current = true;
      cancelAnimationFrame(rafRef.current);
      hoveredIdRef.current = null;

      cardRefs.current.forEach((el) => {
        if (!el) return;
        el.style.transition = 'left 0.9s cubic-bezier(0.22,1,0.36,1), top 0.9s cubic-bezier(0.22,1,0.36,1), transform 0.9s cubic-bezier(0.22,1,0.36,1), filter 0.4s ease';
      });

      requestAnimationFrame(() => {
        cardRefs.current.forEach((el, i) => {
          if (!el) return;
          const p = projects[i];
          if (!p) return;
          el.style.left = p.left;
          el.style.top = p.top;
          el.style.transform = `rotate(${p.rotation}deg) scale(1)`;
          el.style.zIndex = String(p.z);
          el.style.filter = 'brightness(1)';
        });
      });
    }
  }, [isAttached, runOrbit]);

  // ── Orbit-mode hover: pause disc, lift card out ──
  const handleOrbitHoverStart = useCallback((projectId: number) => {
    hoveredIdRef.current = projectId;
    setHoveredId(projectId);

    if (discRef.current) discRef.current.style.animationPlayState = 'paused';

    const idx = projects.findIndex(p => p.id === projectId);
    const el = cardRefs.current[idx];
    if (el) {
      el.style.transition = 'transform 0.5s cubic-bezier(0.22,1,0.36,1)';
      el.style.transform = 'rotate(0deg) scale(1.15) translateY(-80px)';
      el.style.zIndex = '100';
    }

    cardRefs.current.forEach((otherEl, i) => {
      if (!otherEl || i === idx) return;
      otherEl.style.transition = 'filter 0.4s ease';
      otherEl.style.filter = 'brightness(0.3)';
    });
  }, []);

  const handleOrbitHoverEnd = useCallback(() => {
    const prevId = hoveredIdRef.current;
    setHoveredId(null);

    if (discRef.current) discRef.current.style.animationPlayState = 'running';

    if (prevId !== null) {
      const idx = projects.findIndex(p => p.id === prevId);
      const el = cardRefs.current[idx];
      if (el) {
        const cx = getCx();
        const cy = getCy();
        const a = angleRef.current + (idx / projects.length) * Math.PI * 2;
        const x = cx + Math.cos(a) * ORBIT_RADIUS - CARD_W / 2;
        const y = cy + Math.sin(a) * ORBIT_RADIUS - CARD_H / 2;

        el.style.transition = 'transform 0.5s cubic-bezier(0.22,1,0.36,1)';
        el.style.left = `${x}px`;
        el.style.top = `${y}px`;
        el.style.transform = `rotate(${(a * 180 / Math.PI)}deg) scale(0.5)`;
        el.style.zIndex = '20';
      }
    }

    cardRefs.current.forEach(el => {
      if (!el) return;
      el.style.transition = 'filter 0.4s ease';
      el.style.filter = 'brightness(1)';
    });

    // Resume orbit after card returns
    setTimeout(() => { hoveredIdRef.current = null; }, 550);
  }, []);

  // ── Scatter-mode hover effect ──
  useEffect(() => {
    if (isAttached) return;

    cardRefs.current.forEach((el, i) => {
      if (!el) return;
      const p = projects[i];
      if (!p) return;
      const isHovered = hoveredId === p.id;

      el.style.transition = 'transform 0.45s cubic-bezier(0.22,1,0.36,1), filter 0.4s ease';

      if (isHovered) {
        el.style.transform = 'rotate(0deg) scale(1.12) translateY(-40px)';
        el.style.zIndex = '100';
        el.style.filter = 'brightness(1)';
      } else {
        el.style.transform = `rotate(${p.rotation}deg) scale(1)`;
        el.style.zIndex = String(p.z);
        el.style.filter = hoveredId !== null ? 'brightness(0.45)' : 'brightness(1)';
      }
    });
  }, [hoveredId, isAttached]);

  return (
    <div className='max-w-7xl mx-auto px-4 py-24 text-white relative flex flex-col items-center'>
      {/* Header */}
      <div className='text-center mb-8 pointer-events-auto z-[60] relative'>
        <p className='text-sm font-semibold text-slate-400 mb-4 uppercase tracking-[0.3em]'>RECENT WORK</p>
        <h2 className='text-3xl md:text-5xl font-bold mb-4 tracking-[0.2em] uppercase text-white'>PROJECTS</h2>
        <div className='h-[1px] w-full max-w-[150px] mx-auto bg-gradient-to-r from-transparent via-white/50 to-transparent mb-8' />

        <button
          onClick={() => {
            hoveredIdRef.current = null;
            setHoveredId(null);
            if (discRef.current) discRef.current.style.animationPlayState = 'running';
            setIsAttached(prev => !prev);
          }}
          className='pointer-events-auto px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest
                     border border-white/20 bg-white/5 text-white/80
                     hover:bg-white/10 hover:border-white/40 hover:text-white
                     transition-all duration-300 backdrop-blur-sm'
        >
          {isAttached ? '⊕ Scatter Cards' : '⊗ Attach to Disc'}
        </button>
      </div>

      {/* Container for disc + cards */}
      <div ref={containerRef} className='relative w-full pointer-events-auto overflow-visible'
        style={{ minHeight: DISC_SIZE + HEADER_GAP + 250 }}>

        {/* ── Vinyl Disc ── */}
        <div
          ref={discRef}
          className='absolute rounded-full pointer-events-none'
          style={{
            left: '50%', top: `${HEADER_GAP}px`,
            width: `${DISC_SIZE}px`, height: `${DISC_SIZE}px`,
            animation: 'vinylSpin 25s linear infinite',
            opacity: isAttached ? 1 : 0.08,
            transition: 'opacity 0.8s ease',
          }}
        >
          {/* Disc surface */}
          <div className='absolute inset-0 rounded-full' style={{
            background: 'radial-gradient(circle, #1a1a1a 28%, #0d0d0d 50%, #111 72%, #0a0a0a 100%)',
            boxShadow: 'inset 0 0 80px rgba(0,0,0,0.9), 0 0 60px rgba(0,0,0,0.6)',
            border: '3px solid rgba(255,255,255,0.04)',
          }} />

          {/* Grooves */}
          {[0.30, 0.38, 0.46, 0.54, 0.62, 0.70, 0.78, 0.84, 0.90, 0.95].map((r, i) => (
            <div key={`g-${i}`} className='absolute rounded-full' style={{
              top: `${(1 - r) * 50}%`, left: `${(1 - r) * 50}%`,
              width: `${r * 100}%`, height: `${r * 100}%`,
              border: '1px solid rgba(255,255,255,0.025)',
            }} />
          ))}

          {/* Center label */}
          <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center'
            style={{
              width: '140px', height: '140px',
              background: 'radial-gradient(circle, #2a2a2a 0%, #1a1a1a 55%, #111 100%)',
              border: '2px solid rgba(255,255,255,0.08)',
              boxShadow: 'inset 0 0 25px rgba(0,0,0,0.6)',
            }}>
            <div className='rounded-full' style={{
              width: '24px', height: '24px', background: '#080808',
              border: '2px solid rgba(255,255,255,0.12)',
            }} />
          </div>

          {/* Shine */}
          <div className='absolute inset-0 rounded-full' style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 30%, transparent 65%, rgba(255,255,255,0.02) 100%)',
          }} />

          {/* ── Disco Lights around the edge ── */}
          {Array.from({ length: 20 }).map((_, i) => {
            const a = (i / 20) * Math.PI * 2;
            const r = DISC_SIZE / 2 - 8;
            const x = DISC_SIZE / 2 + Math.cos(a) * r - 5;
            const y = DISC_SIZE / 2 + Math.sin(a) * r - 5;
            return (
              <div key={`d-${i}`} style={{
                position: 'absolute',
                left: `${x.toFixed(4)}px`,
                top: `${y.toFixed(4)}px`,
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: DISCO_COLORS[i],
                boxShadow: `0 0 6px ${DISCO_COLORS[i]}, 0 0 14px ${DISCO_COLORS[i]}, 0 0 28px ${DISCO_COLORS[i]}50`,
                animation: 'discoPulse 2s ease-in-out infinite',
                animationDelay: `${(i * 0.1).toFixed(1)}s`,
              }} />
            );
          })}

          {/* Outer glow ring */}
          <div className='absolute rounded-full' style={{
            inset: '-6px',
            border: '2px solid transparent',
            boxShadow: '0 0 20px rgba(255,0,255,0.15), 0 0 40px rgba(0,255,255,0.1), 0 0 60px rgba(255,255,0,0.08)',
            animation: 'discoGlow 4s ease-in-out infinite',
            borderRadius: '50%',
          }} />
        </div>

        {/* ── Project Cards ── */}
        {projects.map((project, i) => (
          <div
            key={project.id}
            ref={(el) => { cardRefs.current[i] = el; }}
            className='absolute cursor-pointer'
            onMouseEnter={() => isAttached ? handleOrbitHoverStart(project.id) : setHoveredId(project.id)}
            onMouseLeave={() => isAttached ? handleOrbitHoverEnd() : setHoveredId(null)}
            style={{ width: `${CARD_W}px` }}
          >
            <div className='w-full rounded-xl overflow-hidden' style={{
              background: '#131313',
              border: '1px solid rgba(255,255,255,0.07)',
              boxShadow: hoveredId === project.id
                ? '0 25px 50px rgba(0,0,0,0.6), 0 0 20px rgba(255,255,255,0.04)'
                : '0 4px 15px rgba(0,0,0,0.5)',
              transition: 'box-shadow 0.4s ease, border-color 0.4s ease',
              borderColor: hoveredId === project.id ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.07)',
            }}>
              <div className='h-28 overflow-hidden relative'>
                <div className='absolute inset-0 bg-black/20 z-10' />
                <img src={project.image} alt={project.title} className='w-full h-full object-cover' style={{
                  filter: hoveredId === project.id ? 'grayscale(0) saturate(1.1)' : 'grayscale(100%)',
                  opacity: hoveredId === project.id ? 1 : 0.7,
                  transform: hoveredId === project.id ? 'scale(1.06)' : 'scale(1)',
                  transition: 'filter 0.45s ease, opacity 0.45s ease, transform 0.5s ease',
                }} />
              </div>
              <div className='p-3.5'>
                <p className='text-[9px] text-blue-400 font-bold uppercase tracking-widest mb-1'>{project.category}</p>
                <h3 className='text-sm font-bold text-white mb-1 tracking-wide'>{project.title}</h3>
                <p className='text-[10px] text-neutral-400 font-light leading-relaxed line-clamp-2'>{project.description}</p>
                <div className='mt-2.5 flex items-center justify-between'>
                  <span className='text-[9px] text-white/40 uppercase tracking-widest'>Details</span>
                  <div className='h-[1px] flex-1 mx-2 bg-white/10' />
                  <span className='text-white text-xs'>→</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className='text-center text-neutral-500 text-xs mt-8 relative z-40 uppercase tracking-widest pointer-events-none'>
        {isAttached ? 'Hover a card to inspect · Click Scatter to spread them out' : 'Hover to draw a card · Click Attach to return to disc'}
      </p>

      <style>{`
        @keyframes vinylSpin {
          from { transform: translateX(-50%) rotate(0deg); }
          to { transform: translateX(-50%) rotate(360deg); }
        }
        @keyframes discoPulse {
          0%, 100% { opacity: 0.3; transform: scale(0.6); }
          50% { opacity: 1; transform: scale(1.4); }
        }
        @keyframes discoGlow {
          0%, 100% { box-shadow: 0 0 20px rgba(255,0,255,0.2), 0 0 40px rgba(0,255,255,0.1), 0 0 60px rgba(255,255,0,0.08); }
          33% { box-shadow: 0 0 20px rgba(0,255,255,0.2), 0 0 40px rgba(255,255,0,0.1), 0 0 60px rgba(255,0,255,0.08); }
          66% { box-shadow: 0 0 20px rgba(255,255,0,0.2), 0 0 40px rgba(255,0,255,0.1), 0 0 60px rgba(0,255,255,0.08); }
        }
      `}</style>
    </div>
  );
};
