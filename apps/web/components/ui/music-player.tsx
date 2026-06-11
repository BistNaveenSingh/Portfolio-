'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipForward, SkipBack, Volume2, Music } from 'lucide-react';

const tracks = [
  { src: '/music/Main Theme.mp3', label: 'Main Theme' },
  { src: '/music/Main Theme 2.mp3', label: 'Main Theme 2' },
  { src: '/music/Main Theme 3.mp3', label: 'Main Theme 3' },
];

function getTrack(index: number) {
  return tracks[index % tracks.length]!;
}

export default function MusicPlayer() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const handleNextRef = useRef<() => void>(() => {});

  const handleNext = useCallback(() => {
    setCurrentTrack((prev) => (prev + 1) % tracks.length);
    setIsPlaying(true);
  }, []);

  useEffect(() => {
    handleNextRef.current = handleNext;
  }, [handleNext]);

  useEffect(() => {
    const audio = new Audio(getTrack(currentTrack).src);
    audio.volume = volume;
    audio.loop = false;
    audio.onended = () => handleNextRef.current();
    audioRef.current = audio;

    const playPromise = audio.play();
    if (playPromise) {
      playPromise.catch(() => setIsPlaying(false));
    }

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, [currentTrack, volume]);

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      const promise = audioRef.current.play();
      if (promise) {
        promise.then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      } else {
        setIsPlaying(true);
      }
    }
  }, [isPlaying]);

  const handlePrev = useCallback(() => {
    setCurrentTrack((prev) => (prev - 1 + tracks.length) % tracks.length);
    setIsPlaying(true);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2 bg-neutral-900/90 backdrop-blur-md border border-white/10 rounded-full px-4 py-2 shadow-xl"
          >
            <button
              onClick={handlePrev}
              className="text-white/60 hover:text-white transition-colors p-1"
              title="Previous track"
            >
              <SkipBack size={16} />
            </button>

            <button
              onClick={togglePlay}
              className="text-white hover:text-blue-400 transition-colors p-1"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>

            <button
              onClick={handleNext}
              className="text-white/60 hover:text-white transition-colors p-1"
              title="Next track"
            >
              <SkipForward size={16} />
            </button>

            <div className="w-px h-5 bg-white/10 mx-1" />

            <span className="text-xs text-white/70 font-medium min-w-[80px] truncate">
              {getTrack(currentTrack).label}
            </span>

            <div className="flex items-center gap-1.5 ml-1">
              <Volume2 size={12} className="text-white/50" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-16 h-1 accent-blue-500 cursor-pointer"
                title="Volume"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileTap={{ scale: 0.9 }}
        className="w-12 h-12 rounded-full bg-neutral-900/90 backdrop-blur-md border border-white/10 shadow-xl flex items-center justify-center text-white hover:bg-neutral-800 transition-colors"
        title="Toggle music player"
      >
        <Music size={18} />
      </motion.button>
    </div>
  );
}
