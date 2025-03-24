import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

// This is a simple credentials provider with hardcoded admin user
// In production, you should use a proper database integration
export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Admin credentials (secure these in environment variables for production)
        const adminUser = process.env.ADMIN_USER || 'admin';
        const adminPass = process.env.ADMIN_PASS || 'fais-admin-123';
        
        if (credentials.username === adminUser && credentials.password === adminPass) {
          return {
            id: '1',
            name: 'Administrator',
            email: 'admin@fais.world',
            role: 'admin'
          }
        }
        return null;
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.role = token.role;
      return session;
    }
  },
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  secret: process.env.NEXTAUTH_SECRET || 'your-secret-key-change-this-in-production',
});
