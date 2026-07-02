'use client';
import DashLayout from '../../../components/DashLayout';

export default function LeadsPage() {
  return (
    <DashLayout>
      <div style={{ background: 'white', padding: '30px', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
        <h1 style={{ fontSize: '1.6rem', marginBottom: '10px' }}>Leads (Novos Contatos)</h1>
        <p style={{ color: '#888' }}>Módulo em construção. Em breve conectaremos ao banco de dados PostgreSQL real.</p>
      </div>
    </DashLayout>
  );
}
