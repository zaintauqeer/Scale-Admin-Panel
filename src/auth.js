import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import getUserFromDb from "./getUserFromDb"
// Your own logic for dealing with plaintext password strings; be careful!


export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        identifier: {},
        password: {},
      },
      authorize: async (credentials) => {
        if (
          !credentials ||
          typeof credentials.identifier !== "string" ||
          typeof credentials.password !== "string"
        ) {
          throw new Error("Invalid credentials input.");
        }

        const user = await getUserFromDb(credentials.identifier, credentials.password);

        if (!user) {
          throw new Error("Invalid credentials.");
        }

        return user;
      }


    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.token = user.token; // 👈 save JWT token in the token payload
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.token = token.token; // 👈 expose it in session
        session.user.role = token.role
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login", // Ensure this matches your login page route
  },
})