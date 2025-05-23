import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

// Properly extend Next-Auth types to include role
declare module 'next-auth' {
  interface User {
    id: string
    role?: string
  }
  
  interface Session {
    user: {
      name?: string | null
      email?: string | null
      image?: string | null
      role?: string
    }
  }
}

// Define admin users - use actual admin email
const ADMIN_EMAILS = [
  'info@fais.world',
  process.env.ADMIN_EMAIL,
].filter(Boolean)

export const authOptions: NextAuthOptions = {
  providers: [
    // Credentials provider for username/password login
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        
        // Check if credentials match the admin credentials
        if (
          credentials.email === process.env.ADMIN_EMAIL && 
          credentials.password === process.env.ADMIN_PASSWORD
        ) {
          return {
            id: 'admin-id',
            name: 'Admin',
            email: credentials.email,
            role: 'admin'
          }
        }
        
        return null
      }
    }),
  ],
  callbacks: {
    // Make sure session includes the role
    async session({ session, token }) {
      if (token.role) {
        session.user.role = token.role as string
      }
      return session
    },
    // Store role in token
    async jwt({ token, user }) {
      if (user?.role) {
        token.role = user.role
      } else if (token.email && ADMIN_EMAILS.includes(token.email as string)) {
        token.role = 'admin'
      }
      return token
    }
  },
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
}
