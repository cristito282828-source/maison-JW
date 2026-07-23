/**
 * HeaderBanner — cover de video full-width (estilo LV).
 *
 * Estructura:
 *   ┌─────────────────────────────────────────────┐
 *   │                                             │
 *   │   [cover de video / poster estático]       │ ← 60-80vh, video autoplay
 *   │   (loop muted)                              │
 *   │                                             │
 *   └─────────────────────────────────────────────┘
 *
 * Si existe /videos/maison-hero.mp4 → el browser reproduce el video.
 * Si NO existe → muestra solo el poster (degrade Maison dorado).
 * El componente NO falla en ningún caso — solo degrada visualmente.
 *
 * El video está muted + autoplay + loop + playsInline (necesario en iOS).
 * No tiene controls (cinematográfico, no interactivo).
 */

const VIDEO_SRC = '/videos/maison-hero.mp4';
const POSTER_JPG = '/videos/maison-hero-poster.jpg';
const POSTER_WEBP = '/videos/maison-hero-poster.webp';

export default function HeaderBanner() {
  return (
    <section className="bg-transparent">
      {/* ============ Cover de video (o poster fallback) ============ */}
      <div className="relative w-full h-[60vh] sm:h-[70vh] md:h-[80vh] bg-[var(--ink)] overflow-hidden">
        {/* Video con poster JPG como fallback (HTML5 standard) */}
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={POSTER_JPG}
          className="absolute inset-0 w-full h-full object-cover"
        >
          {/* WebP poster primero (los browsers que lo soporten lo prefieren) */}
          <source src={POSTER_WEBP} type="image/webp" />
          {/* Si existe mp4 → video real. Si no → browser ignora el source y muestra el poster. */}
          <source src={VIDEO_SRC} type="video/mp4" />
          {/* Fallback final: tag <img> con el poster JPG */}
          <img
            src={POSTER_JPG}
            alt="Maison — Joyería fina en Colombia"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </video>

        {/* Overlay sutil para que el contenido encima tenga legibilidad si lo agregamos */}
        {/* Mantengo intencionalmente sin overlay — el video/poster ya es dark luxury */}

        {/* Indicador sutil abajo (opcional, da feedback de "es video") */}
        {/* Lo dejo comentado para mantener limpio — activalo si querés feedback visual */}
        {/* <div className="absolute bottom-4 right-4 flex items-center gap-2 text-white/40 text-[10px] tracking-[0.3em] uppercase font-moderat pointer-events-none">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--gold)] animate-pulse" />
          Maison
        </div> */}
      </div>
    </section>
  );
}
