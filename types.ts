
export interface User {
  id: string;
  name: string;
  avatar: string;
  username?: string;
  bio?: string;
  country?: string;
  gender?: string;
  qualification?: string;
  job?: string;
  followers: number;
  following: number;
  email?: string;
  phone?: string;
  notificationPreferences?: {
    likes: boolean;
    comments: boolean;
    follows: boolean;
  };
  privacySettings?: {
    isPrivate: boolean;
    showActivityStatus: boolean;
  };
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
  originalPost?: Post;
}

export interface CreatePostPayload {
  content: string;
  image?: File | null;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: number;
}
