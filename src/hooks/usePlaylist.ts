import { useState, useRef, useEffect, useCallback } from 'react';
import type { Track, PlayMode } from '../types/config';
import { playlist as defaultPlaylist } from '../config/_base/playlist';

export function usePlaylist() {
  const [tracks] = useState<Track[]>(defaultPlaylist);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playMode, setPlayMode] = useState<PlayMode>('list');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = tracks[currentIndex] || null;

  useEffect(() => {
    const audio = new Audio();
    audio.loop = false;
    audio.volume = 0.4;
    audioRef.current = audio;

    const handleEnded = () => {
      if (playMode === 'single') {
        audio.currentTime = 0;
        audio.play().catch(() => {});
        return;
      }
      if (playMode === 'shuffle') {
        let nextIdx: number;
        do {
          nextIdx = Math.floor(Math.random() * tracks.length);
        } while (nextIdx === currentIndex && tracks.length > 1);
        setCurrentIndex(nextIdx);
        return;
      }
      setCurrentIndex(prev => (prev + 1) % tracks.length);
    };

    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
    };
  }, [playMode, tracks.length]);

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

  const togglePlayMode = useCallback(() => {
    setPlayMode(prev => {
      if (prev === 'list') return 'single';
      if (prev === 'single') return 'shuffle';
      return 'list';
    });
  }, []);

  return { tracks, currentTrack, currentIndex, isPlaying, setIsPlaying, play, pause, togglePlay, next, prev, playMode, togglePlayMode, audioRef };
}