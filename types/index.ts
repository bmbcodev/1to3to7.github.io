export interface SiteSettings {
  id: string;
  key: string;
  value: string;
  updated_at: string;
}

export interface Project {
  id: string;
  title: string;
  description: string | null;
  long_description: string | null;
  cover_image: string | null;
  images: string[];
  demo_url: string | null;
  github_url: string | null;
  category: string | null;
  status: "active" | "archived" | "draft";
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface ProjectFile {
  id: string;
  name: string;
  description: string | null;
  file_url: string;
  file_type: string | null;
  file_size: number | null;
  download_count: number;
  storage_path: string | null;
  created_at: string;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  body: string;
  fingerprint: string | null;
  is_read: boolean;
  created_at: string;
}

export interface Follower {
  id: string;
  fingerprint: string;
  created_at: string;
}

export interface Visitor {
  id: string;
  page: string;
  fingerprint: string | null;
  country: string | null;
  referrer: string | null;
  created_at: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string | null;
  sort_order: number;
  is_active: boolean;
  updated_at: string;
}

export interface ActivityLog {
  id: string;
  event_type: string;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

export interface Comment {
  id: string;
  project_id: string;
  name: string;
  body: string;
  created_at: string;
}

export interface Reaction {
  id: string;
  project_id: string;
  fingerprint: string;
  emoji: string;
  created_at: string;
}

export interface ReactionCount {
  emoji: string;
  count: number;
  reacted: boolean;
}

export interface MessageReply {
  id: string;
  message_id: string;
  sender: "founder" | "user";
  body: string;
  created_at: string;
}

export interface UserSession {
  id: string;
  fingerprint: string;
  name: string | null;
  last_seen: string;
  is_online: boolean;
}

export interface Conversation {
  message: Message;
  replies: MessageReply[];
  userSession: UserSession | null;
}
