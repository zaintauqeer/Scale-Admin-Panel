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
})