import dns from "dns";
import { betterAuth } from "better-auth";
import { MongoClient, type Db } from "mongodb";
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

function getClient(): MongoClient {
  const current = global._mongoClient as any;
  const isDead =
    !current ||
    !current.topology ||
    (typeof current.topology.isDestroyed === "function" && current.topology.isDestroyed()) ||
    (typeof current.topology.isClosed === "function" && current.topology.isClosed()) ||
    current.topology.s?.state === "closed" ||
    current.topology.s?.state === "closing";

  if (isDead) {
    if (current && typeof current.close === "function") {
      try {
        current.close().catch(() => {});
      } catch (e) {}
    }
    const newClient = new MongoClient(uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    });
    newClient.connect().catch(() => {});
    global._mongoClient = newClient;
  }
  return global._mongoClient!;
}

const clientProxy = new Proxy({} as MongoClient, {
  get(_target, prop) {
    const c = getClient();
    const val = (c as any)[prop];
    if (typeof val === "function") {
      return val.bind(c);
    }
    return val;
  },
});

const dbProxy = new Proxy({} as Db, {
  get(_target, prop) {
    const d = getClient().db("salonbook");
    const val = (d as any)[prop];
    if (typeof val === "function") {
      return val.bind(d);
    }
    return val;
  },
});

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
  database: mongodbAdapter(dbProxy, {
    client: clientProxy,
    transaction: false,
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
