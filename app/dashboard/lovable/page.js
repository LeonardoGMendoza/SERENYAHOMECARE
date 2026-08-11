'use client';
import DashLayout from '../../../components/DashLayout';
import styles from './lovable.module.css';

export default function LovablePage() {
  return (
    <DashLayout>
      <div className={styles.container}>
        <div className={styles.topBar}>
          <div>
            <h1 className={styles.title}>🔗 Lovable</h1>
            <p className={styles.subtitle}>Ferramenta integrada desenvolvida pela sua equipe.</p>
          </div>
        </div>

        <div className={styles.waitCard}>
          <div className={styles.waitIcon}>🚀</div>
          <h2 className={styles.waitTitle}>Painel de Recrutamento</h2>
          <p className={styles.waitText}>
            A ferramenta Lovable do seu sócio é o formulário público. 
            Os resultados dos candidatos aparecerão aqui assim que a integração do banco de dados for concluída.
          </p>
        </div>
      </div>
    </DashLayout>
  );
}
