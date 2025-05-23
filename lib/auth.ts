import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"

// Properly extend Next-Auth types to include role
declare module "next-auth" {
  interface User {
    id: string;
    role?: string;
  }
  
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
    }
  }
}

// Define admin users - replace these with actual admin emails
const ADMIN_EMAILS = [
  "info@fais.world",
  process.env.ADMIN_EMAIL,
].filter(Boolean);

// Check if we're in development or preview mode
const isDevOrPreview = 
  process.env.NODE_ENV === 'development' ||
  process.env.VERCEL_ENV === 'preview';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        // Example authentication logic - replace with your actual logic
        if (
          credentials.email === process.env.ADMIN_EMAIL && 
          credentials.password === process.env.ADMIN_PASSWORD
        ) {
          return {
            id: "admin-id",
            name: "Admin",
            email: credentials.email,
            role: "admin" // Include the role field
          };
        }
        
        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      // For development or preview mode, always set admin role
      if (isDevOrPreview) {
        token.role = "admin"
      } else if (user) {
        token.role = user.role || (ADMIN_EMAILS.includes(user.email!) ? "admin" : "user")
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!
        session.user.role = token.role as string
      }
      return session
    },
    async signIn({ user, account }) {
      // For development or preview mode, always allow sign-in
      if (isDevOrPreview) {
        return true
      }
      
      // Allow sign-in only for admin users
      if (user.email && ADMIN_EMAILS.includes(user.email)) {
        return true
      }
      
      // For credentials provider, we already checked in authorize
      if (account?.provider === "credentials") {
        return true
      }
      
      return false
    }
  },
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET || 'dev-secret-do-not-use-in-production',
}
