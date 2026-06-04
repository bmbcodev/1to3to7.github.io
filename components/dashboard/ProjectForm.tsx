"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { supabase } from "@/lib/supabase";
import { safeUpload, isLocalMode, localInsert, localSet, localList } from "@/lib/safeSupabase";
import { GoldButton } from "@/components/ui/GoldButton";
import { X, Upload } from "lucide-react";
import Image from "next/image";
import type { Project } from "@/types";

interface ProjectFormProps {
  project?: Project | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function ProjectForm({ project, onSuccess, onCancel }: ProjectFormProps) {
  const [title, setTitle] = useState(project?.title || "");
  const [description, setDescription] = useState(project?.description || "");
  const [longDescription, setLongDescription] = useState(project?.long_description || "");
  const [category, setCategory] = useState(project?.category || "");
  const [status, setStatus] = useState<"active" | "archived" | "draft">(project?.status || "active");
  const [tags, setTags] = useState(project?.tags?.join(", ") || "");
  const [demoUrl, setDemoUrl] = useState(project?.demo_url || "");
  const [githubUrl, setGithubUrl] = useState(project?.github_url || "");
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState(project?.cover_image || "");
  const [additionalImages, setAdditionalImages] = useState<File[]>([]);
  const [additionalPreviews, setAdditionalPreviews] = useState<string[]>(project?.images || []);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const onCoverDrop = useCallback((accepted: File[]) => {
    if (accepted.length > 0) {
      setCoverImage(accepted[0]);
      setCoverPreview(URL.createObjectURL(accepted[0]));
    }
  }, []);

  const onAdditionalDrop = useCallback((accepted: File[]) => {
    const newFiles = [...additionalImages, ...accepted.slice(0, 10)];
    setAdditionalImages(newFiles);
    const newPreviews = newFiles.map((f) => URL.createObjectURL(f));
    setAdditionalPreviews(newPreviews);
  }, [additionalImages]);

  const { getRootProps: coverRoot, getInputProps: coverInput } = useDropzone({
    onDrop: onCoverDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
  });

  const { getRootProps: additionalRoot, getInputProps: additionalInput } = useDropzone({
    onDrop: onAdditionalDrop,
    accept: { "image/*": [] },
    maxFiles: 10,
  });

  const uploadFile = async (file: File, path: string): Promise<string> => {
    const fileName = `${Date.now()}_${file.name.replace(/\s/g, "_")}`;
    const { publicUrl } = await safeUpload("uploads", `${path}/${fileName}`, file);
    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) { setError("Title is required"); return; }
    setUploading(true);
    setError("");

    try {
      let coverUrl = project?.cover_image || "";
      if (coverImage) {
        coverUrl = await uploadFile(coverImage, "project-covers");
      }

      let imageUrls: string[] = [];
      if (additionalImages.length > 0) {
        for (const file of additionalImages) {
          const url = await uploadFile(file, "project-images");
          imageUrls.push(url);
        }
      } else {
        imageUrls = project?.images || [];
      }

      const projectData = {
        title,
        description: description || null,
        long_description: longDescription || null,
        category: category || null,
        status,
        tags: tags ? tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
        demo_url: demoUrl || null,
        github_url: githubUrl || null,
        cover_image: coverUrl || null,
        images: imageUrls,
        updated_at: new Date().toISOString(),
      };

      if (!isLocalMode()) {
        if (project?.id) {
          const { error: updateError } = await supabase.from("projects").update(projectData).eq("id", project.id);
          if (updateError && !updateError.message?.includes("Failed to fetch")) throw updateError;
        } else {
          const { error: insertError } = await supabase.from("projects").insert(projectData);
          if (insertError && !insertError.message?.includes("Failed to fetch")) throw insertError;
        }
      }
      const projects = localList<any>("projects");
      if (project?.id) {
        const idx = projects.findIndex((p: any) => p.id === project.id);
        if (idx !== -1) projects[idx] = { ...projects[idx], ...projectData };
        localSet("projects", projects);
      } else {
        localInsert("projects", projectData);
      }

      onSuccess();
    } catch (err: unknown) {
      console.error(err);
      setError("Project saved locally. Configure Supabase for cloud storage.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-body text-gray-300 mb-1">Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 bg-white/5 border border-gold/20 rounded-xl text-white font-body placeholder:text-gray-500 focus:outline-none focus:border-gold/50"
            placeholder="Project Title"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-body text-gray-300 mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-4 py-2 bg-white/5 border border-gold/20 rounded-xl text-white font-body placeholder:text-gray-500 focus:outline-none focus:border-gold/50 resize-none"
            placeholder="Short description"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-body text-gray-300 mb-1">Long Description</label>
          <textarea
            value={longDescription}
            onChange={(e) => setLongDescription(e.target.value)}
            rows={6}
            className="w-full px-4 py-2 bg-white/5 border border-gold/20 rounded-xl text-white font-body placeholder:text-gray-500 focus:outline-none focus:border-gold/50 resize-none"
            placeholder="Full project description..."
          />
        </div>

        <div>
          <label className="block text-sm font-body text-gray-300 mb-1">Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2 bg-white/5 border border-gold/20 rounded-xl text-white font-body placeholder:text-gray-500 focus:outline-none focus:border-gold/50"
            placeholder="Web Dev, AI, Automotive..."
          />
        </div>

        <div>
          <label className="block text-sm font-body text-gray-300 mb-1">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as typeof status)}
            className="w-full px-4 py-2 bg-bg border border-gold/20 rounded-xl text-white font-body focus:outline-none focus:border-gold/50"
          >
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-body text-gray-300 mb-1">Tags (comma separated)</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full px-4 py-2 bg-white/5 border border-gold/20 rounded-xl text-white font-body placeholder:text-gray-500 focus:outline-none focus:border-gold/50"
            placeholder="react, tailwind, typescript"
          />
        </div>

        <div>
          <label className="block text-sm font-body text-gray-300 mb-1">Demo URL</label>
          <input
            type="url"
            value={demoUrl}
            onChange={(e) => setDemoUrl(e.target.value)}
            className="w-full px-4 py-2 bg-white/5 border border-gold/20 rounded-xl text-white font-body placeholder:text-gray-500 focus:outline-none focus:border-gold/50"
            placeholder="https://..."
          />
        </div>

        <div>
          <label className="block text-sm font-body text-gray-300 mb-1">GitHub URL</label>
          <input
            type="url"
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            className="w-full px-4 py-2 bg-white/5 border border-gold/20 rounded-xl text-white font-body placeholder:text-gray-500 focus:outline-none focus:border-gold/50"
            placeholder="https://github.com/..."
          />
        </div>

        <div>
          <label className="block text-sm font-body text-gray-300 mb-2">Cover Image</label>
          <div {...coverRoot()} className="border-2 border-dashed border-gold/20 rounded-xl p-6 text-center cursor-pointer hover:border-gold/50 transition-colors">
            <input {...coverInput()} />
            <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-gray-400 font-body">Drop cover image here</p>
          </div>
          {coverPreview && (
            <div className="relative mt-2 h-32 w-full rounded-xl overflow-hidden">
              <Image src={coverPreview} alt="Cover preview" fill className="object-cover" sizes="400px" />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-body text-gray-300 mb-2">Additional Images (up to 10)</label>
          <div {...additionalRoot()} className="border-2 border-dashed border-gold/20 rounded-xl p-6 text-center cursor-pointer hover:border-gold/50 transition-colors">
            <input {...additionalInput()} />
            <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-gray-400 font-body">Drop images here</p>
            <p className="text-xs text-gray-500 mt-1">{additionalImages.length} selected</p>
          </div>
          {additionalPreviews.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mt-2">
              {additionalPreviews.slice(0, 6).map((preview, idx) => (
                <div key={idx} className="relative h-20 rounded-xl overflow-hidden">
                  <Image src={preview} alt={`Additional ${idx}`} fill className="object-cover" sizes="100px" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-3">
        <GoldButton type="submit" loading={uploading}>
          {project ? "Update Project" : "Create Project"}
        </GoldButton>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 text-gray-400 font-body border border-gold/20 rounded-full hover:bg-white/5 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
