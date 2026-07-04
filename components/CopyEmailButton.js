"use client";

import { useState } from 'react';

export default function CopyEmailButton({ email }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button 
      onClick={handleCopy}
      className="btn btn-primary" 
      style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', cursor: 'pointer', border: 'none' }}
    >
      {copied ? '✅ E-mail Copiado!' : '✉️ Copiar E-mail'}
    </button>
  );
}
