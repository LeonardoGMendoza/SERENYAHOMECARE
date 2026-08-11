'use client';
import { useRef, useEffect, useState } from 'react';
import styles from '../styles/Carousel.module.css';

export default function Carousel({ items, autoPlay = true, interval = 3000 }) {
  const scrollRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const [hasTrackedView, setHasTrackedView] = useState(false);

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
    if (!autoPlay || isPaused) return;
    
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const autoScroll = setInterval(() => {
      if (scrollContainer) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;
        // Se chegou no fim, volta pro começo
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollContainer.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollContainer.scrollBy({ left: 320, behavior: 'smooth' });
        }
      }
    }, interval);

    return () => clearInterval(autoScroll);
  }, [autoPlay, interval, isPaused]);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  return (
    <div 
      className={styles.carouselContainer}
      onMouseEnter={handleInteraction}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleInteraction}
      onTouchEnd={() => setIsPaused(false)}
    >
      <button className={`${styles.navBtn} ${styles.leftBtn}`} onClick={scrollLeft} aria-label="Anterior">
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
              />
            ) : item.type === 'instagram' ? (
              <iframe
                src={`${item.src}/embed`}
                width="100%"
                height="400"
                frameBorder="0"
                scrolling="no"
                allowtransparency="true"
                className={styles.mediaElement}
                style={{ background: 'white' }}
              ></iframe>
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

      <button className={`${styles.navBtn} ${styles.rightBtn}`} onClick={scrollRight} aria-label="Próximo">
        ›
      </button>
    </div>
  );
}
