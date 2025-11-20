import React, { useState, useEffect } from 'react';
import { PostCard } from './components/PostCard';
import { CreatePost } from './components/CreatePost';
import { Post, User } from './types';
import { Layout, Bell, Menu } from 'lucide-react';

// Mock Current User
const CURRENT_USER: User = {
  id: 'curr_user_1',
  name: 'أحمد محمد',
  avatar: 'https://picsum.photos/id/64/200/200',
};

// Initial Mock Data
const INITIAL_POSTS: Post[] = [
  {
    id: '1',
    user: {
      id: 'user_2',
      name: 'سارة علي',
      avatar: 'https://picsum.photos/id/65/200/200'
    },
    content: 'صباح الخير يا أصدقاء! 🌞\nأتمنى لكم يوماً مليئاً بالإنجازات والسعادة.',
    image: 'https://picsum.photos/id/28/800/600',
    likes: 42,
    isLiked: false,
    comments: [
      {
        id: 'c1',
        user: { id: 'u3', name: 'خالد عمر', avatar: 'https://picsum.photos/id/91/200/200' },
        text: 'صباح النور والسرور!',
        timestamp: Date.now() - 3600000
      }
    ],
    shares: 5,
    timestamp: Date.now() - 7200000,
  },
  {
    id: '2',
    user: {
      id: 'user_3',
      name: 'Tech News Ar',
      avatar: 'https://picsum.photos/id/180/200/200'
    },
    content: 'تم إطلاق تحديث جديد للغة TypeScript يضيف مميزات رائعة للمطورين. ما رأيكم في التحديثات الأخيرة؟ 💻🚀',
    likes: 128,
    isLiked: true,
    comments: [],
    shares: 24,
    timestamp: Date.now() - 86400000,
  }
];

const App: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);

  const handleCreatePost = (text: string, image: string | null) => {
    const newPost: Post = {
      id: Date.now().toString(),
      user: CURRENT_USER,
      content: text,
      image: image || undefined,
      likes: 0,
      isLiked: false,
      comments: [],
      shares: 0,
      timestamp: Date.now(),
    };
    setPosts([newPost, ...posts]);
  };

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1,
          isLiked: !post.isLiked
        };
      }
      return post;
    }));
  };

  const handleComment = (postId: string, text: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const newComment = {
          id: Date.now().toString(),
          user: CURRENT_USER,
          text,
          timestamp: Date.now()
        };
        return {
          ...post,
          comments: [...post.comments, newComment]
        };
      }
      return post;
    }));
  };

  const handleShare = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return { ...post, shares: post.shares + 1 };
      }
      return post;
    }));
    alert('تم نسخ رابط المنشور للحافظة (محاكاة)');
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
              <Layout size={20} />
            </div>
            <h1 className="text-xl font-bold text-gray-800">منصتي</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors">
              <Bell size={20} />
            </button>
            <button className="md:hidden w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors">
              <Menu size={20} />
            </button>
            <img 
              src={CURRENT_USER.avatar} 
              alt="Profile" 
              className="w-10 h-10 rounded-full border-2 border-white shadow-sm cursor-pointer hidden md:block"
            />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        
        {/* Welcome Widget (Mobile Only mostly) */}
        <div className="md:hidden mb-6">
          <h2 className="text-lg font-bold text-gray-800">مرحباً، {CURRENT_USER.name} 👋</h2>
          <p className="text-gray-500 text-sm">إليك آخر المستجدات من مجتمعك.</p>
        </div>

        <CreatePost 
          currentUserAvatar={CURRENT_USER.avatar}
          onPostCreate={handleCreatePost}
        />

        <div className="space-y-4">
          {posts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              currentUserAvatar={CURRENT_USER.avatar}
              onLike={handleLike}
              onComment={handleComment}
              onShare={handleShare}
            />
          ))}
          
          {posts.length === 0 && (
            <div className="text-center py-10 text-gray-500">
              لا توجد منشورات حالياً. كن أول من ينشر!
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;