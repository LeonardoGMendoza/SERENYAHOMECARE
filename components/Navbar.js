'use client';
import { useState } from 'react';
import Link from 'next/link';
import styles from '../styles/Navbar.module.css';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const whatsappLink = "https://wa.me/5511914339705";

  return (
    <header className={styles.header}>
      <div className={`container ${styles.nav}`}>
        <Link href="/" className={styles.logo}>
          SERENYA <span>HOME CARE</span>
        </Link>
        
        <ul className={styles.menu}>
          <li className={styles.menuItem}><Link href="#quem-somos">Quem Somos</Link></li>
          <li className={styles.menuItem}><Link href="#servicos">Serviços</Link></li>
          <li className={styles.menuItem}><Link href="#planos">Planos Premium</Link></li>
        </ul>

        <Link href={whatsappLink} target="_blank" className={styles.contactBtn}>
          Fale Conosco
        </Link>
        
        <button className={styles.mobileMenuBtn} onClick={() => setIsOpen(!isOpen)}>
          ☰
        </button>
      </div>
      
      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div style={{ backgroundColor: 'var(--white)', padding: '20px', borderTop: '1px solid #eee' }}>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <li><Link href="#quem-somos" onClick={() => setIsOpen(false)}>Quem Somos</Link></li>
            <li><Link href="#servicos" onClick={() => setIsOpen(false)}>Serviços</Link></li>
            <li><Link href="#planos" onClick={() => setIsOpen(false)}>Planos Premium</Link></li>
            <li>
              <Link href={whatsappLink} target="_blank" onClick={() => setIsOpen(false)} style={{ color: 'var(--sage-green)', fontWeight: 'bold' }}>
                WhatsApp
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
