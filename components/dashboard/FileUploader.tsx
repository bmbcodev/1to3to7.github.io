"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { supabase } from "@/lib/supabase";
import { safeUpload, isLocalMode, localInsert } from "@/lib/safeSupabase";
import { GoldButton } from "@/components/ui/GoldButton";
import { Upload, FileIcon } from "lucide-react";

interface FileUploaderProps {
  onSuccess: () => void;
}

export function FileUploader({ onSuccess }: FileUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const onDrop = useCallback((accepted: File[]) => {
    if (accepted.length > 0) {
      setFile(accepted[0]);
      setName(accepted[0].name);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    noClick: false,
    noKeyboard: false,
  });

  const getFileType = (f: File): string => {
    if (f.type.startsWith("image/")) return "image";
    if (f.type.startsWith("video/")) return "video";
    if (f.type.startsWith("audio/")) return "audio";
    if (f.type === "application/pdf") return "pdf";
    if (f.type.includes("zip") || f.type.includes("rar") || f.type.includes("tar") || f.type.includes("7z") || f.name.endsWith(".zip") || f.name.endsWith(".rar")) return "zip";
    if (f.type.includes("spreadsheet") || f.type.includes("excel") || f.name.endsWith(".xlsx") || f.name.endsWith(".xls") || f.name.endsWith(".csv")) return "spreadsheet";
    if (f.type.includes("document") || f.type.includes("word") || f.name.endsWith(".doc") || f.name.endsWith(".docx")) return "document";
    return "other";
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !name.trim()) { setError("File and name are required"); return; }
    setUploading(true);
    setError("");

    try {
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const fileName = `${Date.now()}_${sanitizedName}`;
      const filePath = `files/${fileName}`;

      const { publicUrl } = await safeUpload("uploads", filePath, file);
      const fileType = getFileType(file);

      if (!isLocalMode()) {
        const { error: dbError } = await supabase.from("files").insert({
          name, description: description || null, file_url: publicUrl,
          file_type: fileType, file_size: file.size, storage_path: filePath,
        });
        if (dbError && !dbError.message?.includes("Failed to fetch")) throw dbError;
      }
      localInsert("files", {
        name, description: description || null, file_url: publicUrl,
        file_type: fileType, file_size: file.size, storage_path: filePath,
      });

      setFile(null);
      setName("");
      setDescription("");
      onSuccess();
    } catch (err: unknown) {
      console.error(err);
      const msg = err instanceof Error ? err.message : "";
      if (msg.includes("bucket") || msg.includes("storage")) {
        setError("Storage bucket not found. File saved locally instead.");
      } else {
        setError("Upload failed. File saved locally.");
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleUpload} className="space-y-4 max-w-lg">
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{error}</div>
      )}

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
          isDragActive
            ? "border-gold bg-gold/5 scale-[1.02]"
            : "border-gold/20 hover:border-gold/50 hover:bg-white/[0.02]"
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="w-10 h-10 mx-auto text-gray-400 mb-3" />
        <p className="text-sm text-gray-400 font-body">
          {isDragActive ? "Drop file here..." : "Drop any file here or click to browse"}
        </p>
        <p className="text-[10px] text-gray-500 mt-1 font-body">Any file type accepted</p>
        {file && (
          <div className="mt-3 flex items-center justify-center gap-2">
            <FileIcon className="w-4 h-4 text-gold" />
            <p className="text-gold text-sm font-body">{file.name}</p>
            <span className="text-gray-500 text-xs">({(file.size / 1024).toFixed(1)} KB)</span>
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-body text-gray-300 mb-1">File Name *</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 bg-white/5 border border-gold/20 rounded-xl text-white font-body focus:outline-none focus:border-gold/50"
          placeholder="My File"
        />
      </div>

      <div>
        <label className="block text-sm font-body text-gray-300 mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          className="w-full px-4 py-2 bg-white/5 border border-gold/20 rounded-xl text-white font-body focus:outline-none focus:border-gold/50 resize-none"
          placeholder="Optional description"
        />
      </div>

      <GoldButton type="submit" loading={uploading}>
        <Upload className="w-4 h-4 mr-1.5 inline" /> Upload File
      </GoldButton>
    </form>
  );
}
