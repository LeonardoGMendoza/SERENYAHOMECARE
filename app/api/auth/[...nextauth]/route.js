import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

// Usuários fixos do dashboard
const USERS = [
  { id: '1', name: 'Sandra Luciane', email: 'sandra@serenya.com', password: '123', role: 'diretora', image: '/sandra.jpg' },
  { id: '2', name: 'Rosecler', email: 'rosecler@serenya.com', password: '123', role: 'diretora', image: '/rosecler.jpg' },
];

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Senha', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = USERS.find(u => u.email === credentials.email);
        if (!user) return null;
        
        // Comparação simples para testes (senha: 123)
        if (credentials.password !== user.password) return null;
        
        return { id: user.id, name: user.name, email: user.email, role: user.role, image: user.image };
      },
    }),
  ],
  pages: {
    signIn: '/dashboard/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.image = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role;
        session.user.image = token.image;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || 'serenya-dev-secret',
  session: { strategy: 'jwt' },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
