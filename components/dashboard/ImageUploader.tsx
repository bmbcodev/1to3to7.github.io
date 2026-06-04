"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { safeUpload, isLocalMode, localSet, localGet, localInsert } from "@/lib/safeSupabase";
import { GoldButton } from "@/components/ui/GoldButton";
import { Upload } from "lucide-react";

interface ImageUploaderProps {
  label: string;
  settingKey: string;
  currentUrl?: string;
  onSuccess: () => void;
}

export function ImageUploader({ label, settingKey, currentUrl, onSuccess }: ImageUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState(currentUrl || "");
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback((accepted: File[]) => {
    if (accepted.length > 0) {
      setFile(accepted[0]);
      setPreview(URL.createObjectURL(accepted[0]));
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
  });

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    try {
      const fileName = `${Date.now()}_${file.name.replace(/\s/g, "_")}`;
      const { publicUrl } = await safeUpload("uploads", `settings/${fileName}`, file);

      if (!isLocalMode()) {
        const { data: existing } = await supabase.from("site_settings").select("id").eq("key", settingKey).single();
        if (existing) {
          await supabase.from("site_settings").update({ value: publicUrl, updated_at: new Date().toISOString() }).eq("key", settingKey);
        } else {
          await supabase.from("site_settings").insert({ key: settingKey, value: publicUrl });
        }
      }
      localSet(`setting:${settingKey}`, publicUrl);

      setFile(null);
      onSuccess();
    } catch (err) {
      console.error(err);
      alert("Upload saved locally. Configure Supabase for cloud storage.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-body text-gray-300">{label}</label>
      <div {...getRootProps()} className="border-2 border-dashed border-gold/20 rounded-xl p-6 text-center cursor-pointer hover:border-gold/50 transition-colors">
        <input {...getInputProps()} />
        <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
        <p className="text-sm text-gray-400 font-body">Drop image here or click</p>
      </div>
      {preview && (
        <div className="relative h-40 w-40 rounded-xl overflow-hidden mx-auto border border-gold/20">
          <Image src={preview} alt={label} fill className="object-cover" sizes="160px" />
        </div>
      )}
      {file && (
        <GoldButton onClick={handleUpload} loading={uploading} className="!px-4 !py-2 !text-sm">
          Upload {label}
        </GoldButton>
      )}
    </div>
  );
}
