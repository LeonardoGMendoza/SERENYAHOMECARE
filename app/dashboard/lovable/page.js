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

        <div className={styles.iframeContainer}>
          <iframe 
            src="https://health-sync-hire.lovable.app/" 
            title="Health Sync Hire Lovable"
            className={styles.iframe}
            allowFullScreen
          />
        </div>
      </div>
    </DashLayout>
  );
}
