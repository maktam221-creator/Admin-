export interface User {
  id: string;
  name: string;
  avatar: string;
}

export interface Comment {
  id: string;
  user: User;
  text: string;
  timestamp: number;
}

export interface Post {
  id: string;
  user: User;
  content: string;
  image?: string; // Base64 or URL
  likes: number;
  isLiked: boolean;
  comments: Comment[];
  shares: number;
  timestamp: number;
}

export interface CreatePostPayload {
  content: string;
  image?: File | null;
}