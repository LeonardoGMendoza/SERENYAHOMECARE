'use client';
import { useRef, useEffect, useState } from 'react';
import styles from '../styles/Carousel.module.css';

export default function Carousel({ items, autoPlay = true, interval = 3000 }) {
  const scrollRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false); // Trava o carrossel enquanto vídeo toca
  const [hasTrackedView, setHasTrackedView] = useState(false);

  useEffect(() => {
    // Detecta clique em iframes (YouTube/Instagram) para pausar o carrossel
    const handleBlur = () => {
      if (document.activeElement && document.activeElement.tagName === 'IFRAME') {
        setIsPlaying(true);
      }
    };
    // Libera o carrossel quando clica fora do iframe
    const handleFocus = () => setIsPlaying(false);
    
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const handleInteraction = () => {
    setIsPaused(true);
    if (!hasTrackedView) {
      setHasTrackedView(true);
      fetch('/api/stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'videoView' })
      }).catch(err => console.error('Falha ao registrar view de video', err));
    }
  };

  useEffect(() => {
    if (!autoPlay || isPaused || isPlaying) return;
    
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const autoScroll = setInterval(() => {
      if (scrollContainer) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;
        // Se chegou no fim, volta pro começo
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollContainer.scrollLeft = 0;
        } else {
          scrollContainer.scrollLeft += 320;
        }
      }
    }, interval);

    return () => clearInterval(autoScroll);
  }, [autoPlay, interval, isPaused, isPlaying]);

  const scrollLeftBtn = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft -= 320;
    }
  };

  const scrollRightBtn = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft += 320;
    }
  };

  useEffect(() => {
    // Carrega o script oficial do Instagram de forma segura e sem duplicar
    const loadInstagramScript = () => {
      if (window.instgrm) {
        window.instgrm.Embeds.process();
      } else if (!document.getElementById('instagram-embed-script')) {
        const s = document.createElement("script");
        s.id = 'instagram-embed-script';
        s.async = true;
        s.src = "//www.instagram.com/embed.js";
        s.onload = () => {
          if (window.instgrm) {
            window.instgrm.Embeds.process();
          }
        };
        document.body.appendChild(s);
      }
    };
    
    // Pequeno delay para garantir que o DOM (blockquotes) já esteja montado
    const timeoutId = setTimeout(loadInstagramScript, 500);

    return () => clearTimeout(timeoutId);
  }, [items]);

  return (
    <div 
      className={styles.carouselContainer}
      onMouseEnter={handleInteraction}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleInteraction}
      onTouchEnd={() => {
        // No celular, volta a rodar após soltar o dedo (com leve atraso para não atrapalhar o clique no vídeo)
        setTimeout(() => setIsPaused(false), 2500);
      }}
    >
      <button className={`${styles.navBtn} ${styles.leftBtn}`} onClick={scrollLeftBtn} aria-label="Anterior">
        ‹
      </button>
      
      <div className={styles.carouselTrack} ref={scrollRef}>
        {items.map((item, index) => (
          <div key={index} className={styles.carouselItem}>
            {item.type === 'video' ? (
              <video 
                src={item.src} 
                controls={item.controls !== false}
                autoPlay={item.autoPlay}
                muted={item.muted}
                loop={item.loop}
                className={styles.mediaElement}
                poster={item.poster}
                onPlay={() => setIsPlaying(true)}
                onPause={() => {
                  setIsPlaying(false);
                  setIsPaused(false);
                }}
                onEnded={() => {
                  setIsPlaying(false);
                  setIsPaused(false);
                }}
              />
            ) : item.type === 'instagram' ? (
              <div style={{ width: '100%', height: '400px', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', background: 'white' }}>
                <blockquote 
                  className="instagram-media" 
                  data-instgrm-permalink={`${item.src}?utm_source=ig_embed&amp;utm_campaign=loading`} 
                  data-instgrm-version="14" 
                  style={{ background: '#FFF', border: '0', borderRadius: '3px', boxShadow: 'none', margin: '0', maxWidth: '300px', minWidth: '300px', padding: '0', width: '100%' }}
                >
                </blockquote>
              </div>
            ) : item.type === 'youtube' ? (
              <iframe
                src={item.src}
                title={`Video ${index}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className={styles.mediaElement}
              ></iframe>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.src} alt={item.alt || `Imagem ${index}`} className={styles.mediaElement} />
            )}
            
            {item.caption && (
              <div className={styles.caption}>
                {item.caption}
              </div>
            )}
          </div>
        ))}
      </div>

      <button className={`${styles.navBtn} ${styles.rightBtn}`} onClick={scrollRightBtn} aria-label="Próximo">
        ›
      </button>
    </div>
  );
}
