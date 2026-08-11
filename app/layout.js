import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-main",
  subsets: ["latin"],
});

export const metadata = {
  title: "Serenya Home Care | Cuidamos de vidas, acolhemos histórias",
  description: "Atendimento Domiciliar Especializado para Crianças, Idosos e Pessoas com Necessidades Especiais. Plantões 12h, 24h e Cuidados Paliativos.",
  icons: {
    icon: "/serenya-logo.jpg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={`${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
