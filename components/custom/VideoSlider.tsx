/**
 * VideoSlider — slider full-width con auto-play entre videos.
 *
 * Auto-play silenciado del video activo, los demás pausados.
 * Dots clickeables debajo. Sin overlay, sin texto.
 *
 * Uso:
 *   <VideoSlider videos={[{ src: '/videos/video-1.mp4' }, ...]} />
 *
 * Estructura esperada del array:
 *   videos: { src: string; poster?: string }[]
 *
 * Cuando agregues más videos, simplemente sumá objetos al array.
 */

'use client';

import { useEffect, useRef, useState } from 'react';

export interface VideoSlide {
  src: string;
  poster?: string;
}

interface VideoSliderProps {
  videos: VideoSlide[];
  /** Segundos entre cada slide. Default 7. */
  interval?: number;
  /** Altura del slider. Default 80vh. */
  className?: string;
}

export default function VideoSlider({
  videos,
  interval = 7,
  className = 'h-[60vh] sm:h-[70vh] md:h-[80vh]',
}: VideoSliderProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const interactedRef = useRef(false);

  // Auto-play: cada `interval` segundos avanza al siguiente slide (loop).
  useEffect(() => {
    if (videos.length <= 1) return;
    const id = setInterval(() => {
      setActiveIdx((i) => (i + 1) % videos.length);
    }, interval * 1000);
    return () => clearInterval(id);
  }, [videos.length, interval]);

  // Fallback al primer user gesture si el autoplay nativo fue bloqueado.
  useEffect(() => {
    const onUserGesture = () => {
      if (interactedRef.current) return;
      interactedRef.current = true;
      const active = videoRefs.current[activeIdx];
      active?.play().catch(() => {
        /* ignore */
      });
    };
    window.addEventListener('pointerdown', onUserGesture, { once: true, passive: true });
    window.addEventListener('keydown', onUserGesture, { once: true });
    window.addEventListener('scroll', onUserGesture, { once: true, passive: true });
    return () => {
      window.removeEventListener('pointerdown', onUserGesture);
      window.removeEventListener('keydown', onUserGesture);
      window.removeEventListener('scroll', onUserGesture);
    };
  }, [activeIdx]);

  // Sincronizar play/pause en cada cambio de slide.
  useEffect(() => {
    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      if (i === activeIdx) {
        v.currentTime = 0;
        v.play().catch(() => {
          /* autoplay bloqueado en este switch, sin drama */
        });
      } else {
        v.pause();
      }
    });
  }, [activeIdx]);

  if (!videos.length) return null;

  return (
    <section
      className={`relative w-full ${className} bg-[var(--ink)] overflow-hidden`}
      aria-roledescription="carousel"
      aria-label="Videos de la colección"
    >
      {/* Slides apilados. El activo tiene opacity-100 + z-10, los demás
          opacity-0 + z-0. autoPlay+muted garantiza reproducción cross-browser. */}
      {videos.map((video, idx) => (
        <video
          key={video.src}
          ref={(el) => {
            videoRefs.current[idx] = el;
          }}
          src={video.src}
          poster={video.poster}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            idx === activeIdx ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        />
      ))}

      {/* Dots — minimal luxury, abajo centrados */}
      {videos.length > 1 && (
        <div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2"
          role="tablist"
          aria-label="Selector de slide"
        >
          {videos.map((_, idx) => (
            <button
              key={idx}
              type="button"
              role="tab"
              aria-selected={idx === activeIdx}
              aria-label={`Ir al video ${idx + 1}`}
              onClick={() => setActiveIdx(idx)}
              className={`h-0.5 transition-all duration-500 ${
                idx === activeIdx
                  ? 'w-10 bg-white'
                  : 'w-5 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}