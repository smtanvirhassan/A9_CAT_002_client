export async function uploadToImgBB(file: File): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY || "b9c4c79e67d2643a12a7d4f9bf35a643";
  
  const formData = new FormData();
  formData.append("image", file);

  try {
    const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error?.message || "Failed to upload image to ImgBB");
    }

    return data.data.url;
  } catch (err: any) {
    console.error("ImgBB upload error:", err);
    throw new Error(err.message || "Failed to upload image");
  }
}
