import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"

// Define admin users - in production, this should come from a database
const ADMIN_EMAILS = [
  // Add your admin email addresses here
  "admin@fais.com",
  // You can add more admin emails as needed
]

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
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // For demo purposes - in production, verify against your database
        if (credentials?.email === "admin@fais.com" && credentials?.password === "admin123") {
          return {
            id: "1",
            email: "admin@fais.com",
            name: "Admin User",
            role: "admin"
          }
        }
        return null
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
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
    async signIn({ user, account, profile }) {
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
  },
  secret: process.env.NEXTAUTH_SECRET,
}
