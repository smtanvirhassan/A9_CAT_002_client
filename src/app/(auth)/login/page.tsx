"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Scissors, Lock, Mail, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const { data, error } = await authClient.signIn.email({
        email,
        password,
      });

      if (error) {
        toast.error(error.message || "Failed to sign in. Please verify your credentials.");
        setLoading(false);
        return;
      }

      toast.success("Welcome back to SalonBook!");

      const session = await authClient.getSession();
      const user = session?.data?.user as any;

      if (callbackUrl && callbackUrl !== "/") {
        router.push(callbackUrl);
      } else if (user?.role === "admin") {
        router.push("/dashboard/admin");
      } else {
        router.push("/dashboard/customer");
      }
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred during login.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      const res = await authClient.signIn.social({
        provider: "google",
        callbackURL: callbackUrl || "/dashboard/customer",
      });
      if (res?.error) {
        toast.error(res.error.message || "Google authentication failed.");
        setGoogleLoading(false);
      }
    } catch (err: any) {
      toast.error(err.message || "Google authentication failed.");
      setGoogleLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md border-border/80 shadow-lg">
      <CardHeader className="text-center space-y-2">
        <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
          <Scissors className="size-6" />
        </div>
        <CardTitle className="text-2xl font-serif">Welcome Back</CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          Sign in to manage your appointments, view treatment history, or pay securely.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleEmailLogin} className="space-y-4">
          <FieldGroup>
            <Field>
              <Button
                variant="outline"
                type="button"
                onClick={handleGoogleLogin}
                disabled={googleLoading || loading}
                className="w-full flex items-center justify-center gap-2 border-border"
              >
                {googleLoading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <svg className="size-4" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      fill="#EA4335"
                    />
                  </svg>
                )}
                <span>Continue with Google</span>
              </Button>
            </Field>

            <div className="relative my-2 text-center text-xs after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
              <span className="relative z-10 bg-card px-2 text-muted-foreground">
                Or continue with email
              </span>
            </div>

            <Field>
              <FieldLabel htmlFor="email">Email Address</FieldLabel>
              <div className="relative">
                <Mail className="absolute left-3 top-3 size-4 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                  className="pl-9"
                />
              </div>
            </Field>

            <Field>
              <div className="flex items-center justify-between">
                <FieldLabel htmlFor="password">Password</FieldLabel>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 size-4 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  className="pl-9"
                />
              </div>
            </Field>

            <Field className="pt-2">
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-amber-700 hover:bg-amber-800 text-white font-medium"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
              <FieldDescription className="text-center text-xs mt-3">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="font-semibold text-amber-700 hover:underline">
                  Create Account
                </Link>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-12rem)] items-center justify-center px-4 py-12">
      <Suspense fallback={<div className="p-8 text-center text-xs text-muted-foreground">Loading login...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
