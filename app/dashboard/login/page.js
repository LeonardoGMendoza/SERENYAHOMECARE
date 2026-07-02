'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import styles from './login.module.css';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      setError('Email ou senha incorretos. Tente novamente.');
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className={styles.page}>
      {/* Fundo animado */}
      <div className={styles.bg}>
        <div className={styles.blob1} />
        <div className={styles.blob2} />
      </div>

      <div className={styles.card}>
        {/* Logo */}
        <div className={styles.logo}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/serenya-logo.jpg" alt="Serenya" className={styles.logoImg} />
          <div>
            <div className={styles.logoName}>SERENYA</div>
            <div className={styles.logoSub}>HOME CARE — Painel de Gestão</div>
          </div>
        </div>

        <h1 className={styles.title}>Área Restrita</h1>
        <p className={styles.subtitle}>Acesso exclusivo para a Diretoria</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Email</label>
            <input
              type="email"
              className={styles.input}
              placeholder="seu@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Senha</label>
            <input
              type="password"
              className={styles.input}
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <div className={styles.error}>⚠️ {error}</div>}

          <button type="submit" className={styles.btn} disabled={loading}>
            {loading ? '🔄 Entrando...' : '🔐 Entrar no Painel'}
          </button>
        </form>

        <a href="/" className={styles.backLink}>← Voltar ao site</a>
      </div>
    </div>
  );
}
