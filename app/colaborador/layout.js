'use client';
import { SessionProvider } from 'next-auth/react';

export default function ColaboradorLayout({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}
