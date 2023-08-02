export interface Notification {
  message: string;
  status: "success" | "error" | "warning" | "info";
}

export interface User {
  ref: string | undefined;
  ts: string | undefined;
  email: string | undefined;
  email_verified: boolean | undefined;
  family_name: string | undefined;
  given_name: string | undefined;
  locale: string | undefined;
  name: string;
  nickname: string | undefined;
  picture: string | undefined;
  sub: string;
  updated_at: string | undefined;
}

export interface MessageRequest {
  text: string;
  user: string;
  namespace: string;
  context: string;
  withRetrieval?: boolean;
  withFunctions?: boolean;
  withAudio?: boolean;
}

export interface ChatMessage {
  ref?: string;
  ts?: string;
  content: string;
  role: "user" | "assistant" | "system" | "function";
  conversation: string;
}

export interface Namespace {
  messages: string[];
  title: string;
  user: string;
  ref: string;
  ts: string;
}

export interface UploadRequest {
  size: number;
  user: string;
  namespace: string;
  bucket: "image" | "audio" | "video" | "assets" | "code";
  file: File; // Assuming File is the standard web API File interface
}

export interface Upload {
  user: string;
  name: string;
  key: string;
  namespace: string;
  bucket: "image" | "audio" | "video" | "assets" | "code";
  size: number;
  contentType: string;
  lastModified: number;
  url?: string;
}
