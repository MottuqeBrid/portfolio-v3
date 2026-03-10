"use client";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import { useState } from "react";

// const imgData: {
//   publicUrl: string;
// };
export default function Page() {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");

  const handleUpload = async () => {
    if (!file) return;

    const fileName = `${Date.now()}-${file.name}`;

    const { data, error } = await supabase.storage
      .from("portfolio")
      .upload(fileName, file);

    if (error) {
      console.log("Upload error:", error);
    } else {
      console.log("Uploaded:", data);
      const { data: imgData } = await supabase.storage
        .from("portfolio")
        .getPublicUrl(fileName);

      console.log(imgData);
      console.log(imgData.publicUrl);
      setImageUrl(imgData.publicUrl);
    }
  };

  return (
    <div className="p-5">
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
      />

      <button
        onClick={handleUpload}
        className="bg-blue-500 text-white px-4 py-2 mt-3"
      >
        Upload
      </button>
      {imageUrl && (
        <Image
          src={imageUrl || "/images/1.png"}
          alt="Uploaded Image"
          width={500}
          height={300}
        />
      )}
      <Image
        src={
          "https://ulqrzcefdbtlzmxjxwod.supabase.co/storage/v1/object/public/portfolio/1773150280137-ai-generated-7923261.jpg"
        }
        alt="Uploaded Image"
        placeholder="blur"
        blurDataURL="/logo.png"
        width={500}
        height={300}
      />
    </div>
  );
}
