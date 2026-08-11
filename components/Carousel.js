'use client';
import { useRef } from 'react';
import styles from '../styles/Carousel.module.css';

export default function Carousel({ items }) {
  const scrollRef = useRef(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <div className={styles.carouselContainer}>
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
                height="480"
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
