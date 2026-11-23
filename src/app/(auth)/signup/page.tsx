"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Scissors, Lock, Mail, User, Image as ImageIcon, UploadCloud, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { uploadToImgBB } from "@/lib/uploadImage";
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

export default function SignUpPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && session?.user) {
      const user = session.user as any;
      const targetUrl =
        user?.role === "admin" ? "/dashboard/admin" : "/dashboard/customer";
      router.replace(targetUrl);
    }
  }, [session, isPending, router]);

  if (!isPending && session?.user) {
    return (
      <div className="flex min-h-[calc(100vh-12rem)] items-center justify-center px-4 py-12">
        <Card className="w-full max-w-lg border-border/80 shadow-lg p-8 text-center space-y-4">
          <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-amber-100 text-amber-800 animate-pulse">
            <Scissors className="size-6" />
          </div>
          <CardTitle className="text-xl font-serif">Already Logged In</CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Redirecting to your dashboard...
          </CardDescription>
          <div className="flex justify-center pt-2">
            <Loader2 className="size-5 animate-spin text-amber-700" />
          </div>
        </Card>
      </div>
    );
  }
  const [uploadingImage, setUploadingImage] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const [password, setPassword] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const isMinLength = password.length >= 6;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const isPasswordValid = isMinLength && hasUpperCase && hasLowerCase;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const url = await uploadToImgBB(file);
      setImageUrl(url);
      toast.success("Profile photo uploaded successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to upload image. You can enter an Image URL directly.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isPasswordValid) {
      toast.error("Please satisfy all password complexity rules before proceeding.");
      return;
    }

    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const finalImage = imageUrl || (formData.get("image") as string) || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80";

    try {

      const { data, error } = await authClient.signUp.email({
        name,
        email,
        password,
        image: finalImage,
      });

      if (error) {
        toast.error(error.message || "Failed to create account. Please try again.");
        setLoading(false);
        return;
      }

      toast.success("Account created successfully! Welcome to SalonBook.");
      window.location.href = "/dashboard/customer";
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred during signup.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      const res = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard/customer",
      });
      if (res?.data?.url) {
        window.location.href = res.data.url;
        return;
      }
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
    <div className="flex min-h-[calc(100vh-12rem)] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-lg border-border/80 shadow-lg">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
            <Scissors className="size-6" />
          </div>
          <CardTitle className="text-2xl font-serif">Create Your Account</CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Join SalonBook to easily reserve services, view booking status, and unlock exclusive treatments.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp} className="space-y-4">
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
                  <span>Sign up with Google</span>
                </Button>
              </Field>

              <div className="relative my-2 text-center text-xs after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-card px-2 text-muted-foreground">
                  Or register with email
                </span>
              </div>

              <Field>
                <FieldLabel htmlFor="name">Full Name</FieldLabel>
                <div className="relative">
                  <User className="absolute left-3 top-3 size-4 text-muted-foreground" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Jane Doe"
                    required
                    className="pl-9"
                  />
                </div>
              </Field>

              <Field>
                <FieldLabel htmlFor="email">Email Address</FieldLabel>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 size-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="jane@example.com"
                    required
                    className="pl-9"
                  />
                </div>
              </Field>

              <Field>
                <FieldLabel htmlFor="image">Profile Image</FieldLabel>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 cursor-pointer rounded-md border border-input bg-background px-3 py-2 text-xs font-medium hover:bg-muted transition-colors">
                      <UploadCloud className="size-4 text-amber-600" />
                      <span>{uploadingImage ? "Uploading to ImgBB..." : "Upload Photo"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                        disabled={uploadingImage}
                      />
                    </label>
                    <span className="text-xs text-muted-foreground">or provide Image URL below:</span>
                  </div>

                  <div className="relative">
                    <ImageIcon className="absolute left-3 top-3 size-4 text-muted-foreground" />
                    <Input
                      id="image"
                      name="image"
                      type="url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://example.com/avatar.jpg"
                      className="pl-9"
                    />
                  </div>
                </div>
              </Field>

              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 size-4 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a strong password"
                    required
                    className="pl-9"
                  />
                </div>

                <div className="mt-2.5 rounded-lg border border-border/70 bg-muted/40 p-3 space-y-1 text-xs">
                  <p className="font-medium text-foreground mb-1">Password Requirements:</p>
                  <div className="flex items-center gap-2">
                    {isMinLength ? (
                      <CheckCircle2 className="size-3.5 text-emerald-600" />
                    ) : (
                      <XCircle className="size-3.5 text-muted-foreground" />
                    )}
                    <span className={isMinLength ? "text-emerald-700 font-medium" : "text-muted-foreground"}>
                      Minimum 6 characters
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {hasUpperCase ? (
                      <CheckCircle2 className="size-3.5 text-emerald-600" />
                    ) : (
                      <XCircle className="size-3.5 text-muted-foreground" />
                    )}
                    <span className={hasUpperCase ? "text-emerald-700 font-medium" : "text-muted-foreground"}>
                      At least one uppercase letter (A-Z)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {hasLowerCase ? (
                      <CheckCircle2 className="size-3.5 text-emerald-600" />
                    ) : (
                      <XCircle className="size-3.5 text-muted-foreground" />
                    )}
                    <span className={hasLowerCase ? "text-emerald-700 font-medium" : "text-muted-foreground"}>
                      At least one lowercase letter (a-z)
                    </span>
                  </div>
                </div>
              </Field>

              <Field className="pt-2">
                <Button
                  type="submit"
                  disabled={loading || uploadingImage || !isPasswordValid}
                  className="w-full bg-amber-700 hover:bg-amber-800 text-white font-medium"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    "Create Customer Account"
                  )}
                </Button>
                <FieldDescription className="text-center text-xs mt-3">
                  Already have an account?{" "}
                  <Link href="/login" className="font-semibold text-amber-700 hover:underline">
                    Sign In
                  </Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
