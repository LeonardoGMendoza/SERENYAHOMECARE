'use client';
import { useState } from 'react';
import Link from 'next/link';
import styles from '../styles/Navbar.module.css';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const waLink = "https://wa.me/5511974995342?text=Olá!%20Vim%20pelo%20site%20da%20Serenya%20e%20gostaria%20de%20mais%20informações.";

  return (
    <header className={styles.header}>
      <div className={`container ${styles.nav}`}>
        <Link href="/" className={styles.logo}>
          <img src="/serenya-logo.jpg" alt="Serenya" />
          SERENYA <span>HOME CARE</span>
        </Link>

        <ul className={styles.menu}>
          <li><Link href="#sobre">Sobre</Link></li>
          <li><Link href="#servicos">Serviços</Link></li>
          <li><Link href="#planos">Planos</Link></li>
          <li><Link href="#parceria">Parceria</Link></li>
          <li><Link href="#redes">Redes Sociais</Link></li>
          <li><Link href="#contato">Contato</Link></li>
        </ul>

        <Link href={waLink} target="_blank" className={styles.contactBtn}>
          💬 WhatsApp
        </Link>

        <button className={styles.mobileBtn} onClick={() => setIsOpen(!isOpen)} aria-label="Menu">
          {isOpen ? '✕' : '☰'}
        </button>
      </div>

      {isOpen && (
        <div className={styles.mobileDropdown}>
          <ul>
            <li><Link href="#sobre" onClick={() => setIsOpen(false)}>Sobre</Link></li>
            <li><Link href="#servicos" onClick={() => setIsOpen(false)}>Serviços</Link></li>
            <li><Link href="#planos" onClick={() => setIsOpen(false)}>Planos</Link></li>
            <li><Link href="#parceria" onClick={() => setIsOpen(false)}>Parceria</Link></li>
            <li><Link href="#redes" onClick={() => setIsOpen(false)}>Redes Sociais</Link></li>
            <li><Link href="#contato" onClick={() => setIsOpen(false)}>Contato</Link></li>
          </ul>
          <Link href={waLink} target="_blank" className={styles.mobileWa} onClick={() => setIsOpen(false)}>
            💬 Falar no WhatsApp
          </Link>
        </div>
      )}
    </header>
  );
}
