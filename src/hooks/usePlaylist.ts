import { useState, useRef, useEffect, useCallback } from 'react';
import type { Track } from '../types/config';
import { playlist as defaultPlaylist } from '../config/_base/playlist';

export function usePlaylist() {
  const [tracks] = useState<Track[]>(defaultPlaylist);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = tracks[currentIndex] || null;

  useEffect(() => {
    const audio = new Audio();
    audio.loop = false;
    audio.volume = 0.4;
    audioRef.current = audio;

    const handleEnded = () => {
      setCurrentIndex(prev => (prev + 1) % tracks.length);
    };
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
    };
  }, []);

  useEffect(() => {
    if (audioRef.current && currentTrack) {
      audioRef.current.src = currentTrack.url;
      audioRef.current.load();
    }
  }, [currentIndex, currentTrack]);

  const play = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  }, []);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const togglePlay = useCallback(() => {
    isPlaying ? pause() : play();
  }, [isPlaying, play, pause]);

  const next = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % tracks.length);
  }, [tracks.length]);

  const prev = useCallback(() => {
    setCurrentIndex(prev => (prev - 1 + tracks.length) % tracks.length);
  }, [tracks.length]);

  return { tracks, currentTrack, currentIndex, isPlaying, setIsPlaying, play, pause, togglePlay, next, prev, audioRef };
}