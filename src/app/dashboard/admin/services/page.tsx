"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Scissors,
  Plus,
  Pencil,
  Trash2,
  UploadCloud,
  Check,
  X,
  Loader2,
  Clock,
  Search,
  Power,
} from "lucide-react";
import { toast } from "sonner";
import { getTokenFromClient } from "@/lib/getTokenFromClient";
import { uploadToImgBB } from "@/lib/uploadImage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { IService } from "@/lib/types/service";

const categories = [
  "Haircut & Styling",
  "Hair Coloring",
  "Hair Treatment",
  "Facial & Skincare",
  "Makeup",
  "Manicure & Pedicure",
  "Spa & Massage",
];

export default function ManageServicesPage() {
  const [services, setServices] = useState<IService[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<IService | null>(null);

  const [serviceName, setServiceName] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [status, setStatus] = useState<"active" | "inactive">("active");

  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

      const res = await fetch(`${apiUrl}/services?status=all`);
      if (res.ok) {
        const data = await res.json();
        setServices(data);
      }
    } catch (err) {
      console.error("Failed to load services:", err);
      toast.error("Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const openAddModal = () => {
    setEditingService(null);
    setServiceName("");
    setCategory(categories[0]);
    setDescription("");
    setPrice("");
    setDuration("");
    setImageUrl("");
    setStatus("active");
    setIsModalOpen(true);
  };

  const openEditModal = (service: IService) => {
    setEditingService(service);
    setServiceName(service.serviceName);
    setCategory(service.category);
    setDescription(service.description);
    setPrice(service.price.toString());
    setDuration(service.duration.toString());
    setImageUrl(service.image);
    setStatus(service.status);
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const url = await uploadToImgBB(file);
      setImageUrl(url);
      toast.success("Service image uploaded successfully to ImgBB!");
    } catch (err: any) {
      toast.error(err.message || "Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();

    const numPrice = Number(price);
    const numDuration = Number(duration);

    if (isNaN(numPrice) || numPrice <= 0) {
      toast.error("Price must be a positive number");
      return;
    }

    if (isNaN(numDuration) || numDuration <= 0) {
      toast.error("Duration must be a positive number in minutes");
      return;
    }

    if (!imageUrl) {
      toast.error("Please upload a service image file");
      return;
    }

    setSaving(true);
    try {
      const token = await getTokenFromClient();
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

      const payload = {
        serviceName: serviceName.trim(),
        category,
        description: description.trim(),
        price: numPrice,
        duration: numDuration,
        image: imageUrl.trim(),
        status,
      };

      let res;
      if (editingService) {
        res = await fetch(`${apiUrl}/services/${editingService._id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`${apiUrl}/services`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.msg || "Failed to save service");
        return;
      }

      toast.success(
        editingService ? "Service updated successfully!" : "New service added successfully!"
      );
      setIsModalOpen(false);
      fetchServices();
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (service: IService) => {
    const newStatus = service.status === "active" ? "inactive" : "active";
    try {
      const token = await getTokenFromClient();
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

      const res = await fetch(`${apiUrl}/services/${service._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        toast.error("Failed to update status");
        return;
      }

      toast.success(`Service marked as ${newStatus}`);
      fetchServices();
    } catch (err) {
      toast.error("Failed to toggle service status");
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this service?")) {
      return;
    }

    try {
      const token = await getTokenFromClient();
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

      const res = await fetch(`${apiUrl}/services/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        toast.error("Failed to delete service");
        return;
      }

      toast.success("Service deleted successfully");
      fetchServices();
    } catch (err) {
      toast.error("Failed to delete service");
    }
  };

  const filteredServices = services.filter((s) =>
    s.serviceName.toLowerCase().includes(search.toLowerCase()) ||
    s.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-semibold text-foreground">
            Manage Salon Services
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Create, modify, toggle active availability, and upload photos for catalog services.
          </p>
        </div>
        <Button onClick={openAddModal} variant="amber" className="text-sm font-semibold">
          <Plus className="mr-1.5 size-4" />
          Add New Service
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
        <Input
          placeholder="Filter by name or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 text-xs bg-card"
        />
      </div>

      {loading ? (
        <div className="rounded-xl border border-border/80 bg-card p-12 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
          <Loader2 className="size-4 animate-spin text-amber-600" />
          Loading services catalog...
        </div>
      ) : filteredServices.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
          <Scissors className="mx-auto size-10 text-muted-foreground/60 mb-3" />
          <p className="text-sm font-semibold text-foreground">No services found</p>
          <Button onClick={openAddModal} variant="outline" size="sm" className="mt-4 text-xs">
            Create First Service
          </Button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border/80 bg-card shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border/80 bg-muted/40 uppercase tracking-wider text-[11px] text-muted-foreground">
              <tr>
                <th className="px-5 py-3.5">Service</th>
                <th className="px-4 py-3.5">Category</th>
                <th className="px-4 py-3.5">Price</th>
                <th className="px-4 py-3.5">Duration</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredServices.map((service) => (
                <tr key={service._id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-muted border border-border">
                        <Image
                          src={service.image}
                          alt={service.serviceName}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground text-sm line-clamp-1">{service.serviceName}</p>
                        <p className="text-muted-foreground text-[11px] line-clamp-1">{service.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="rounded-full bg-muted px-2.5 py-0.5 text-[11px] text-muted-foreground font-medium">
                      {service.category}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 font-bold text-foreground text-sm">
                    ${service.price}
                  </td>
                  <td className="px-4 py-3.5 text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="size-3 text-amber-600" />
                      {service.duration} mins
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <button
                      onClick={() => handleToggleStatus(service)}
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider transition-colors ${
                        service.status === "active"
                          ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                          : "bg-stone-200 text-stone-700 hover:bg-stone-300"
                      }`}
                      title="Click to toggle status"
                    >
                      <Power className="size-2.5" />
                      {service.status}
                    </button>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditModal(service)}
                        className="size-8 p-0 text-muted-foreground hover:text-amber-800"
                      >
                        <Pencil className="size-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteService(service._id)}
                        className="size-8 p-0 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h2 className="text-lg font-serif font-bold text-foreground">
                {editingService ? "Update Salon Service" : "Add New Salon Service"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-full p-1 text-muted-foreground hover:bg-muted"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleSaveService} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-foreground mb-1">
                  Service Name *
                </label>
                <Input
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  placeholder="e.g. Signature Blowout & Styling"
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-foreground mb-1">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-xs shadow-sm focus:outline-none focus:ring-1 focus:ring-amber-600"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-foreground mb-1">
                    Price ($) *
                  </label>
                  <Input
                    type="number"
                    step="1"
                    min="1"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="75"
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium text-foreground mb-1">
                    Duration (Minutes) *
                  </label>
                  <Input
                    type="number"
                    step="5"
                    min="5"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="60"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-foreground mb-1">
                  Service Image (File Upload) *
                </label>
                <div className="flex flex-col gap-2">
                  <label className="flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-input bg-muted/20 p-4 cursor-pointer hover:bg-muted/40 transition-colors">
                    <UploadCloud className="size-5 text-amber-700" />
                    <span className="font-medium text-foreground">
                      {uploadingImage ? "Uploading to ImgBB..." : "Click to Upload Service Photo"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={uploadingImage}
                    />
                  </label>

                  {imageUrl && (
                    <div className="relative h-28 w-full rounded-lg overflow-hidden border border-border">
                      <Image src={imageUrl} alt="Uploaded service" fill className="object-cover" />
                      <span className="absolute top-2 right-2 rounded bg-black/70 px-2 py-0.5 text-[10px] text-white">
                        Uploaded ✓
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block font-medium text-foreground mb-1">
                  Description *
                </label>
                <Textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe treatment procedures, client benefits, and premium products used..."
                  required
                  className="resize-none"
                />
              </div>

              <div>
                <label className="block font-medium text-foreground mb-1">
                  Service Status *
                </label>
                <div className="flex items-center gap-4 pt-1">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      checked={status === "active"}
                      onChange={() => setStatus("active")}
                    />
                    <span>Active (Publicly bookable)</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      checked={status === "inactive"}
                      onChange={() => setStatus("inactive")}
                    />
                    <span>Inactive (Hidden)</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={saving || uploadingImage}
                  className="bg-amber-700 hover:bg-amber-800 text-white font-medium px-4"
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-1.5 size-3.5 animate-spin" />
                      Saving...
                    </>
                  ) : editingService ? (
                    "Save Changes"
                  ) : (
                    "Create Service"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
