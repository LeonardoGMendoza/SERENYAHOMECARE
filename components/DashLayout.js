'use client';
import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './DashLayout.module.css';

const navItems = [
  { href: '/dashboard', icon: '📊', label: 'Visão Geral' },
  { href: '/dashboard/pacientes', icon: '🏥', label: 'Pacientes' },
  { href: '/dashboard/profissionais', icon: '👩‍⚕️', label: 'Profissionais' },
  { href: '/dashboard/leads', icon: '📋', label: 'Leads' },
];

export default function DashLayout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setSidebarOpen(false);
      else setSidebarOpen(true);
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/dashboard/login');
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
        <p>Verificando acesso...</p>
      </div>
    );
  }
  if (!session) return null;

  return (
    <div className={`${styles.shell} ${sidebarOpen ? '' : styles.collapsed}`}>
      {/* Overlay mobile */}
      {sidebarOpen && isMobile && (
        <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/serenya-logo.jpg" alt="Serenya" className={styles.sidebarLogo} />
          {sidebarOpen && (
            <div>
              <div className={styles.sidebarName}>SERENYA</div>
              <div className={styles.sidebarSub}>Painel de Gestão</div>
            </div>
          )}
          <button className={styles.toggleBtn} onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Menu">
            {sidebarOpen ? '✕' : '☰'}
          </button>
        </div>

        <nav className={styles.nav}>
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navItem} ${pathname === item.href ? styles.active : ''}`}
              onClick={() => isMobile && setSidebarOpen(false)}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              {sidebarOpen && <span className={styles.navLabel}>{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          {sidebarOpen && (
            <div className={styles.userInfo}>
              <div className={styles.userAvatar}>
                {session.user?.image ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={session.user.image} alt={session.user.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                ) : (
                  '👩‍⚕️'
                )}
              </div>
              <div>
                <div className={styles.userName}>{session.user.name}</div>
                <div className={styles.userRole}>Diretoria</div>
              </div>
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: sidebarOpen ? 'row' : 'column', gap: '8px', marginTop: '12px' }}>
            <Link href="/" className={styles.btnSm}>
              {sidebarOpen ? '← Site' : '←'}
            </Link>
            <button className={`${styles.btnSm} ${styles.btnDanger}`} onClick={() => signOut({ callbackUrl: '/dashboard/login' })}>
              {sidebarOpen ? 'Sair' : 'X'}
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className={styles.main}>
        <header className={styles.header}>
          {isMobile && (
            <button className={styles.menuBtn} onClick={() => setSidebarOpen(true)}>☰</button>
          )}
          <div className={styles.headerTitle}>
            {navItems.find(n => n.pathname === pathname)?.label || 'Dashboard'}
          </div>
          <div className={styles.headerRight}>
            <span className={styles.headerDate}>
              {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
            </span>
            <span className={styles.notifBell}>🔔</span>
          </div>
        </header>

        <main className={styles.content}>
          {children}
        </main>
      </div>
    </div>
  );
}
