import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { mongooseConnect } from "@/lib/mongoose";
import { Profile } from "@/models/Profile";
import bcrypt from "bcryptjs";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "Email" },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Password",
        },
      },
      async authorize(credentials) {
        await mongooseConnect();
        const user = await Profile.findOne({ email: credentials.email });

        if (!user) throw new Error("No user found with this email");

        const isValidPassword = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isValidPassword) throw new Error("Invalid credentials");

        return { id: user._id.toString(), email: user.email };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  secret: process.env.NEXTAUTH_SECRET, // Ensure you have this in .env
});
