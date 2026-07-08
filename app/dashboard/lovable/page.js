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
          <h2 className={styles.waitTitle}>Em breve disponível!</h2>
          <p className={styles.waitText}>
            Aguardando o link da ferramenta do seu parceiro para ativar a integração.
            Assim que o link for fornecido, o sistema aparecerá aqui diretamente, sem precisar sair do painel.
          </p>
          <div className={styles.waitBadge}>🔒 Integração segura via iframe</div>
        </div>
      </div>
    </DashLayout>
  );
}
