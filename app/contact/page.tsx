"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { isLocalMode, localInsert } from "@/lib/safeSupabase";
import { getOrCreateFingerprint } from "@/lib/fingerprint";
import { useVisitorTracker } from "@/hooks/useVisitorTracker";
import { useHeartbeat } from "@/hooks/useHeartbeat";
import { GlassCard } from "@/components/ui/GlassCard";
import { GoldButton } from "@/components/ui/GoldButton";
import { PageTransition } from "@/components/ui/PageTransition";
import { ConversationView } from "@/components/contact/ConversationView";
import { MapPin, Phone, Mail, Send, CheckCircle } from "lucide-react";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  subject: z.string().optional(),
  body: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactForm = z.infer<typeof contactSchema>;

export default function ContactPage() {
  useVisitorTracker();
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [logoUrl, setLogoUrl] = useState("");

  useHeartbeat();

  useEffect(() => {
    async function loadLogo() {
      try {
        const { data } = await supabase.from("site_settings").select("value").eq("key", "logo_url").single();
        if (data?.value) setLogoUrl(data.value);
      } catch {}
    }
    loadLogo();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactForm) => {
    setError("");
    try {
      const fingerprint = getOrCreateFingerprint();
      const msgData = { name: data.name, email: data.email, subject: data.subject || null, body: data.body, fingerprint };

      if (!isLocalMode()) {
        const { error: insertError } = await supabase.from("messages").insert(msgData);
        if (insertError && !insertError.message?.includes("Failed to fetch")) throw insertError;
      }
      localInsert("messages", msgData);

      setSubmitted(true);
      reset();
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err: unknown) {
      console.error(err);
      localInsert("messages", { name: data.name, email: data.email, subject: data.subject || null, body: data.body, fingerprint: getOrCreateFingerprint() });
      setSubmitted(true);
      reset();
      setTimeout(() => setSubmitted(false), 5000);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            {logoUrl && (
              <div className="mb-6 flex justify-center">
                <Image
                  src={logoUrl}
                  alt="BIA CO"
                  width={80}
                  height={80}
                  className="object-contain opacity-80"
                />
              </div>
            )}
            <h1 className="text-4xl md:text-5xl font-heading font-bold bg-gradient-to-r from-gold to-yellow-300 bg-clip-text text-transparent mb-4">
              Get In Touch
            </h1>
            <p className="text-gray-400 font-body max-w-xl mx-auto">
              Have a project in mind? Let&rsquo;s discuss how I can help bring your ideas to life.
            </p>
          </motion.div>

          <ConversationView />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {[
                { icon: MapPin, label: "Location", value: "Kigali, Rwanda" },
                { icon: Phone, label: "Phone", value: "+250 783 444 370 / +250 795 914 094" },
                { icon: Mail, label: "Email", value: "bmbcodev@gmail.com" },
              ].map((item) => (
                <GlassCard key={item.label} className="p-5 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-body uppercase tracking-wider">{item.label}</p>
                    <p className="text-white font-body">{item.value}</p>
                  </div>
                </GlassCard>
              ))}

              {logoUrl && (
                <GlassCard className="p-5 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    <Image
                      src={logoUrl}
                      alt="BIA CO"
                      width={48}
                      height={48}
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-body uppercase tracking-wider">Brand</p>
                    <p className="text-white font-body font-semibold">BIA CO</p>
                    <p className="text-gold/60 text-xs italic">&ldquo;Bwangu Nk&rsquo;Intore&rdquo;</p>
                  </div>
                </GlassCard>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <GlassCard className="p-6">
                {submitted ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <CheckCircle className="w-16 h-16 text-green-400 mb-4" />
                    <h3 className="text-xl font-heading font-semibold text-white mb-2">Message Sent!</h3>
                    <p className="text-gray-400 font-body">Thank you for reaching out. I&rsquo;ll get back to you soon.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {error && (
                      <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{error}</div>
                    )}

                    <div>
                      <input
                        {...register("name")}
                        placeholder="Your Name *"
                        className="w-full px-4 py-3 bg-white/5 border border-gold/20 rounded-xl text-white font-body placeholder:text-gray-500 focus:outline-none focus:border-gold/50"
                      />
                      {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
                    </div>

                    <div>
                      <input
                        {...register("email")}
                        type="email"
                        placeholder="Your Email *"
                        className="w-full px-4 py-3 bg-white/5 border border-gold/20 rounded-xl text-white font-body placeholder:text-gray-500 focus:outline-none focus:border-gold/50"
                      />
                      {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
                    </div>

                    <div>
                      <input
                        {...register("subject")}
                        placeholder="Subject"
                        className="w-full px-4 py-3 bg-white/5 border border-gold/20 rounded-xl text-white font-body placeholder:text-gray-500 focus:outline-none focus:border-gold/50"
                      />
                    </div>

                    <div>
                      <textarea
                        {...register("body")}
                        rows={5}
                        placeholder="Your Message *"
                        className="w-full px-4 py-3 bg-white/5 border border-gold/20 rounded-xl text-white font-body placeholder:text-gray-500 focus:outline-none focus:border-gold/50 resize-none"
                      />
                      {errors.body && <p className="text-red-400 text-xs mt-1">{errors.body.message}</p>}
                    </div>

                    <GoldButton type="submit" loading={isSubmitting} className="w-full">
                      <Send className="w-4 h-4 mr-2 inline" /> Send Message
                    </GoldButton>
                  </form>
                )}
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
