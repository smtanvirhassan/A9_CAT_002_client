"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { User, Mail, Phone, UploadCloud, Loader2, Save, Shield } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { getTokenFromClient } from "@/lib/getTokenFromClient";
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
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

export default function AdminProfilePage() {
  const { data: session } = authClient.useSession();
  const sessionUser = session?.user as any;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      try {
        const token = await getTokenFromClient();
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

        const res = await fetch(`${apiUrl}/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          setName(data.name || "");
          setEmail(data.email || "");
          setImage(data.image || "");
          setPhone(data.phone || "");
        } else if (sessionUser) {
          setName(sessionUser.name || "");
          setEmail(sessionUser.email || "");
          setImage(sessionUser.image || "");
        }
      } catch (err) {
        console.error("Error fetching admin profile:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [sessionUser]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const url = await uploadToImgBB(file);
      setImage(url);
      toast.success("Admin avatar uploaded to ImgBB!");
    } catch (err: any) {
      toast.error(err.message || "Failed to upload photo");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = await getTokenFromClient();
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

      const res = await fetch(`${apiUrl}/users/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: name.trim(),
          image: image.trim(),
          phone: phone.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.msg || "Failed to update profile.");
        return;
      }

      toast.success("Admin profile updated successfully!");
    } catch (err: any) {
      toast.error(err.message || "An error occurred while saving profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-semibold text-foreground">
          Administrator Profile
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Manage your administrator credentials, display name, and salon notification telephone.
        </p>
      </div>

      <Card className="border-border/80 shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-700">
            <Shield className="size-4" />
            <span>Administrator Credentials</span>
          </div>
          <CardTitle className="text-lg">Staff Details</CardTitle>
          <CardDescription className="text-xs">
            Changes made here update your public staff profile across the salon system.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-12 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
              <Loader2 className="size-4 animate-spin text-amber-600" />
              Loading admin profile...
            </div>
          ) : (
            <form onSubmit={handleSaveProfile} className="space-y-5">
              <div className="flex items-center gap-5 pb-4 border-b border-border/60">
                <div className="relative size-20 shrink-0 overflow-hidden rounded-full border-2 border-purple-400 bg-muted">
                  {image ? (
                    <Image
                      src={image}
                      alt={name || "Admin"}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center bg-purple-100 text-purple-800 font-bold text-xl">
                      {(name || "A").charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium cursor-pointer hover:bg-muted transition-colors">
                    <UploadCloud className="size-4 text-purple-700" />
                    <span>{uploadingImage ? "Uploading..." : "Upload Staff Avatar"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={uploadingImage}
                    />
                  </label>
                  <p className="text-[11px] text-muted-foreground">
                    Uploads directly to ImgBB or specify hosted URL below.
                  </p>
                </div>
              </div>

              <FieldGroup className="space-y-4">
                <Field>
                  <FieldLabel htmlFor="name">Display Name</FieldLabel>
                  <div className="relative">
                    <User className="absolute left-3 top-3 size-4 text-muted-foreground" />
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
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
                      value={email}
                      disabled
                      className="pl-9 bg-muted/50 cursor-not-allowed"
                    />
                  </div>
                </Field>

                <Field>
                  <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 size-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 234-5678"
                      className="pl-9"
                    />
                  </div>
                </Field>

                <Field>
                  <FieldLabel htmlFor="image">Profile Image URL</FieldLabel>
                  <Input
                    id="image"
                    type="url"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                  />
                </Field>

                <div className="pt-3">
                  <Button
                    type="submit"
                    disabled={saving || uploadingImage}
                    className="bg-amber-700 hover:bg-amber-800 text-white font-medium px-6"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="mr-2 size-4 animate-spin" />
                        Saving Changes...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 size-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </FieldGroup>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
