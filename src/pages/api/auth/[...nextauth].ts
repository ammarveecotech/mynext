import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import AppleProvider from 'next-auth/providers/apple';
import CredentialsProvider from 'next-auth/providers/credentials';
import { MongoClient } from 'mongodb';

// Add a type declaration for our session
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    }
  }
}

// Connect to MongoDB
const connectToDatabase = async () => {
  const client = await MongoClient.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mynext_db');
  return client;
};

export const authOptions: NextAuthOptions = {
  providers: [
    // Temporary simplified auth for testing
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // This is a simplified dummy auth - replace with real auth logic
        if (credentials?.username === "user" && credentials?.password === "password") {
          return { 
            id: "1", 
            name: "Test User", 
            email: "user@example.com" 
          };
        }
        return null;
      }
    }),
    // Google authentication provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    // Apple authentication provider
    AppleProvider({
      clientId: process.env.APPLE_ID!,
      clientSecret: process.env.APPLE_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // Only needed for OAuth providers like Google
      if (account?.provider === 'google' && user?.email) {
        try {
          // Connect to MongoDB
          const client = await connectToDatabase();
          const db = client.db();
          
          // Check if email exists in core_model_users collection
          const userExists = await db.collection('core_model_users').findOne({ 
            email: user.email 
          });
          
          await client.close();
          
          // Return true if user exists in database, false otherwise
          return !!userExists;
        } catch (error) {
          console.error('Error checking user:', error);
          return false;
        }
      }
      
      // For credentials provider, return true to allow sign in
      return true;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub ?? '';
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    }
  },
  pages: {
    signIn: '/signin',
    error: '/signin',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET || 'a-temporary-secret-for-development',
  debug: process.env.NODE_ENV === 'development',
};

export default NextAuth(authOptions); 