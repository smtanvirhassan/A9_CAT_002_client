import dns from "dns";
import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";

if (process.platform === "win32" && !process.env.VERCEL) {
  try {
    dns.setServers(["8.8.8.8", "1.1.1.1"]);
  } catch (e) {}
}

declare global {
  var _mongoClient: MongoClient | undefined;
}

const uri = process.env.MONGODB_URI as string;
let client: MongoClient;
if (!global._mongoClient) {
  global._mongoClient = new MongoClient(uri, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 10000,
  });
}
client = global._mongoClient;
const db = client.db("salonbook");

export const auth = betterAuth({
  baseURL:
    process.env.BETTER_AUTH_URL ||
    process.env.NEXT_PUBLIC_CLIENT_URL ||
    "https://client-one-psi.vercel.app",
  trustedOrigins: [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:*",
    "http://127.0.0.1:*",
    "https://client-one-psi.vercel.app",
    "https://*.vercel.app",
    "*.vercel.app",
  ],
  advanced: {
    trustedProxyHeaders: true,
  },
  database: mongodbAdapter(db, {
    client,
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "customer",
        required: false,
      },
      isBlocked: {
        type: "boolean",
        defaultValue: false,
        required: false,
      },
      phone: {
        type: "string",
        required: false,
      },
    },
  },
  plugins: [jwt()],
  session: {
    cookieCache: {
      enabled: true,
      strategy: "jwt",
      maxAge: 7 * 24 * 60 * 60,
    },
  },
});
