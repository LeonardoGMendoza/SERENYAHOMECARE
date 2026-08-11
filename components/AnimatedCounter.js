'use client';
import { useState, useEffect, useRef } from 'react';

export default function AnimatedCounter({ end, duration = 2000, suffix = '' }) {
  const [count, setCount] = useState(0);
  const elementRef = useRef(null);
  
  useEffect(() => {
    let startTime = null;
    let observer = null;
    let animationFrame = null;
    
    // O valor final, removendo pontuações para converter em número caso venha como "1000"
    const target = parseInt(end.toString().replace(/\D/g, ''), 10);
    if (isNaN(target)) {
      setCount(end); // Se não for número, mostra o texto final
      return;
    }

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      
      const percentage = Math.min(progress / duration, 1);
      // Easing function (easeOutQuart) para suavizar o final
      const easeProgress = 1 - Math.pow(1 - percentage, 4);
      
      setCount(Math.floor(target * easeProgress));

      if (progress < duration) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };

    // Usar IntersectionObserver para só começar a contar quando aparecer na tela
    if (elementRef.current) {
      observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          animationFrame = requestAnimationFrame(animate);
          observer.disconnect(); // Só anima uma vez
        }
      }, { threshold: 0.1 });
      
      observer.observe(elementRef.current);
    }

    return () => {
      if (observer) observer.disconnect();
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [end, duration]);

  // Formata o número (ex: 1000 vira 1.000)
  const formattedCount = count.toLocaleString('pt-BR');

  return (
    <span ref={elementRef}>
      {formattedCount}{suffix}
    </span>
  );
}
