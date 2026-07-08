import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Usuários fixos do dashboard (para login com credenciais locais)
const USERS = [
  { id: '1', name: 'Sandra Luciane', email: 'sandra@serenya.com', password: '123', role: 'diretora', image: '/sandra.jpg' },
  { id: '2', name: 'Rosecler', email: 'rosecler@serenya.com', password: '123', role: 'diretora', image: '/rosecler.jpg' },
];

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || 'dummy-id',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'dummy-secret',
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Senha', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        // 1. Verificar na lista de diretores fixos
        const user = USERS.find(u => u.email === credentials.email);
        if (user && credentials.password === user.password) {
          return { id: user.id, name: user.name, email: user.email, role: user.role, image: user.image };
        }

        // 2. Verificar no banco de dados (cuidadoras/outros com senha)
        const dbUser = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: { pacientesDesignados: true }
        });

        if (dbUser) {
          const isValid = await bcrypt.compare(credentials.password, dbUser.password);
          if (isValid) {
            return {
              id: String(dbUser.id),
              name: dbUser.name,
              email: dbUser.email,
              role: dbUser.role,
              pacientesDesignados: dbUser.pacientesDesignados
            };
          }
        }
        
        return null;
      },
    }),
  ],
  pages: {
    signIn: '/dashboard/login',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        const allowedEmails = [
          'sandra.nakata092@gmail.com',
          'cuidadosserenya@gmail.com'
        ];

        if (allowedEmails.includes(user.email)) {
          user.role = 'diretora';
          return true;
        }

        // Consultar no banco se é cuidadora cadastrada
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email },
          include: { pacientesDesignados: true }
        });

        if (dbUser) {
          user.role = dbUser.role;
          user.pacientesDesignados = dbUser.pacientesDesignados;
          return true;
        }

        return false; // Bloqueia login de qualquer outro Gmail
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.image = user.image;
        token.id = user.id;
        token.pacientesDesignados = user.pacientesDesignados || [];
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.image = token.image;
        session.user.pacientesDesignados = token.pacientesDesignados || [];

        // Buscar atualizações do paciente designado em tempo real
        if (token.role !== 'diretora' && token.email) {
          try {
            const dbUser = await prisma.user.findUnique({
              where: { email: token.email },
              include: { pacientesDesignados: true }
            });
            if (dbUser) {
              session.user.pacientesDesignados = dbUser.pacientesDesignados || [];
            }
          } catch (e) {
            console.error('Erro ao buscar paciente em tempo real na sessão:', e);
          }
        }
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || 'serenya-dev-secret',
  session: { strategy: 'jwt' },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
