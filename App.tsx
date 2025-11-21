
import React, { useState, useRef, useEffect } from 'react';
import { PostCard } from './components/PostCard';
import { CreatePost } from './components/CreatePost';
import { ChatWindow } from './components/ChatWindow';
import { ChatList } from './components/ChatList';
import { Post, User, Message } from './types';
import { 
  Bell, Menu, Home, User as UserIcon, Search, 
  UserPlus, UserMinus, Check, Heart, MessageCircle, Share2, 
  MapPin, Briefcase, GraduationCap, Camera, X, MessageSquare, ChevronRight,
  Filter, Settings, LogOut, Moon, Shield, Lock, Info, ChevronLeft, Smartphone, Mail, Eye, EyeOff, Globe, HelpCircle, Ban, Flag,
  ArrowRight, Edit2, Trash2, Repeat, AlertTriangle
} from 'lucide-react';

// Initial Mock Data for Current User
const INITIAL_USER: User = {
  id: 'curr_user_1',
  name: 'أحمد محمد',
  avatar: 'https://picsum.photos/id/64/200/200',
  username: 'ahmed_mo',
  email: 'ahmed.mo@example.com',
  phone: '+20 100 000 0000',
  bio: 'مطور واجهات أمامية شغوف بالتكنولوجيا والذكاء الاصطناعي.',
  country: 'مصر',
  gender: 'ذكر',
  job: 'مطور برمجيات',
  qualification: 'بكالوريوس علوم حاسب',
  followers: 1250,
  following: 234,
  notificationPreferences: {
    likes: true,
    comments: true,
    follows: true
  },
  privacySettings: {
    isPrivate: false,
    showActivityStatus: true
  }
};

// Initial Mock Users for Demo purposes
const MOCK_USERS: User[] = [
    { id: 'user_2', name: 'سارة علي', avatar: 'https://picsum.photos/id/65/200/200', followers: 530, following: 120, username: 'sara_ali', bio: 'مصممة جرافيك' },
    { id: 'u3', name: 'خالد عمر', avatar: 'https://picsum.photos/id/91/200/200', followers: 210, following: 300, username: 'khaled_o', bio: 'مهندس مدني' },
    { id: 'u4', name: 'يوسف أحمد', avatar: 'https://picsum.photos/id/77/200/200', followers: 89, following: 150, username: 'yousef_a', bio: 'طالب' },
    { id: 'user_3', name: 'Tech News Ar', avatar: 'https://picsum.photos/id/180/200/200', followers: 15400, following: 20, username: 'technews', bio: 'أخبار التقنية' },
];

// Notification Interface
interface Notification {
  id: string;
  user: User;
  type: 'like' | 'comment' | 'follow';
  content?: string;
  timestamp: number;
  read: boolean;
}

// Mock Notifications
const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    user: MOCK_USERS[0],
    type: 'like',
    timestamp: Date.now() - 1000 * 60 * 15, // 15 mins ago
    read: false
  },
  {
    id: 'n2',
    user: MOCK_USERS[1],
    type: 'comment',
    content: 'منشور رائع ومفيد جداً!',
    timestamp: Date.now() - 1000 * 60 * 60 * 2, // 2 hours ago
    read: false
  },
  {
    id: 'n3',
    user: MOCK_USERS[2],
    type: 'follow',
    timestamp: Date.now() - 1000 * 60 * 60 * 24, // 1 day ago
    read: true
  }
];

// Initial Mock Posts
const INITIAL_POSTS: Post[] = [
  {
    id: 'p1',
    user: INITIAL_USER,
    content: 'أعمل حالياً على مشروع جديد باستخدام React و Tailwind. النتيجة مبهرة حتى الآن! 🚀💻',
    likes: 15,
    isLiked: false,
    comments: [],
    shares: 2,
    timestamp: Date.now() - 3600000,
  },
  {
    id: 'p2',
    user: MOCK_USERS[0],
    content: 'صورة من رحلتي الأخيرة إلى الإسكندرية. الجو كان رائعاً! 🌊☀️',
    image: 'https://picsum.photos/id/1040/800/600',
    likes: 42,
    isLiked: true,
    comments: [
      { id: 'c1', user: INITIAL_USER, text: 'صورة جميلة جداً!', timestamp: Date.now() - 1800000 }
    ],
    shares: 5,
    timestamp: Date.now() - 7200000,
  },
  {
    id: 'p3',
    user: MOCK_USERS[3],
    content: 'جوجل تطلق نموذجاً جديداً للذكاء الاصطناعي يتفوق على المنافسين في فهم اللغة العربية.',
    likes: 340,
    isLiked: false,
    comments: [],
    shares: 120,
    timestamp: Date.now() - 86400000,
  }
];

const INITIAL_MESSAGES: Message[] = [
  { id: 'm1', senderId: 'user_2', receiverId: 'curr_user_1', content: 'مرحباً أحمد، كيف حالك؟', timestamp: Date.now() - 1000 * 60 * 60 },
  { id: 'm2', senderId: 'curr_user_1', receiverId: 'user_2', content: 'أهلاً سارة، أنا بخير الحمد لله. ماذا عنك؟', timestamp: Date.now() - 1000 * 60 * 55 },
  { id: 'm3', senderId: 'user_2', receiverId: 'curr_user_1', content: 'بخير، كنت أريد استشارتك في تصميم.', timestamp: Date.now() - 1000 * 60 * 50 },
];

type ViewState = 'home' | 'profile' | 'user_profile' | 'settings' | 'chat';
type SettingsView = 'main' | 'account' | 'security' | 'privacy' | 'notifications';
type SearchFilterType = 'content' | 'author' | 'date';

function App() {
  // --- State ---
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USER);
  const [users, setUsers] = useState<User[]>([INITIAL_USER, ...MOCK_USERS]);
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [view, setView] = useState<ViewState>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilter, setSearchFilter] = useState<SearchFilterType>('content');
  const [showSearchFilterMenu, setShowSearchFilterMenu] = useState(false);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  
  // Notifications
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Chat
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [currentChatUser, setCurrentChatUser] = useState<User | null>(null);

  // Navigation & Social
  const [viewedUser, setViewedUser] = useState<User | null>(null);
  const [blockedUsers, setBlockedUsers] = useState<User[]>([]);
  const [followedUsersIds, setFollowedUsersIds] = useState<string[]>(['user_2', 'user_3']); // Initial follows

  // Settings
  const [settingsView, setSettingsView] = useState<SettingsView>('main');

  // --- Modals State ---
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [editFormData, setEditFormData] = useState<Partial<User>>({});
  const [showUnfollowModal, setShowUnfollowModal] = useState(false);
  const [userToUnfollow, setUserToUnfollow] = useState<User | null>(null);
  const [showFollowModal, setShowFollowModal] = useState(false);
  const [userToFollow, setUserToFollow] = useState<User | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [userToBlock, setUserToBlock] = useState<User | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [postToReport, setPostToReport] = useState<Post | null>(null);

  // --- Helpers ---
  const showToast = (message: string) => {
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-20 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-full shadow-lg z-50 animate-in fade-in slide-in-from-bottom-5 text-sm font-medium';
    toast.innerText = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };

  const updateUserStats = (userId: string, update: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...update } : u));
    if (currentUser.id === userId) setCurrentUser(prev => ({ ...prev, ...update }));
    if (viewedUser?.id === userId) setViewedUser(prev => ({ ...prev!, ...update }));
  };

  // --- Handlers: Navigation ---
  const handleUserClick = (user: User) => {
    if (user.id === currentUser.id) {
      setView('profile');
    } else {
      setViewedUser(user);
      setView('user_profile');
    }
    window.scrollTo(0, 0);
  };

  const handleBackToFeed = () => {
    setView('home');
    setViewedUser(null);
    window.scrollTo(0, 0);
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    showToast("تم تسجيل الخروج بنجاح");
    // In a real app, this would clear tokens and redirect
    window.location.reload();
  };

  // --- Handlers: Posts ---
  const handleCreatePost = (text: string, image: string | null) => {
    const newPost: Post = {
      id: `p_${Date.now()}`,
      user: currentUser,
      content: text,
      image: image || undefined,
      likes: 0,
      isLiked: false,
      comments: [],
      shares: 0,
      timestamp: Date.now(),
    };
    setPosts([newPost, ...posts]);
    showToast("تم نشر المنشور بنجاح! 🎉");
  };

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const newIsLiked = !post.isLiked;
        return {
          ...post,
          likes: newIsLiked ? post.likes + 1 : post.likes - 1,
          isLiked: newIsLiked
        };
      }
      return post;
    }));
  };

  const handleComment = (postId: string, text: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [...post.comments, {
            id: `c_${Date.now()}`,
            user: currentUser,
            text,
            timestamp: Date.now()
          }]
        };
      }
      return post;
    }));
    showToast("تم إضافة تعليقك");
  };

  const handleShare = async (postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    
    const shareData = {
      title: 'Meydan',
      text: post.content,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        showToast("تمت المشاركة بنجاح");
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(`${post.content}\n\n${window.location.href}`);
      showToast("تم نسخ الرابط للحافظة");
    }
  };

  const handleDelete = (postId: string) => {
    setPostToDelete(postId);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (postToDelete) {
      setPosts(posts.filter(p => p.id !== postToDelete));
      showToast("تم حذف المنشور");
      setShowDeleteModal(false);
      setPostToDelete(null);
    }
  };

  const handleEditPost = (postId: string, newContent: string) => {
    setPosts(posts.map(p => p.id === postId ? { ...p, content: newContent } : p));
    showToast("تم تعديل المنشور");
  };

  const handleRepost = (postId: string) => {
    const originalPost = posts.find(p => p.id === postId);
    if (!originalPost) return;
    
    const newPost: Post = {
      id: `p_${Date.now()}`,
      user: currentUser,
      content: "", 
      likes: 0,
      isLiked: false,
      comments: [],
      shares: 0,
      timestamp: Date.now(),
      originalPost: originalPost.originalPost || originalPost
    };
    
    setPosts([newPost, ...posts]);
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, shares: p.shares + 1 } : p));
    showToast("تم إعادة النشر");
  };

  // --- Handlers: Profile Actions ---
  const handleFollowClick = (user: User) => {
    setUserToFollow(user);
    setShowFollowModal(true);
  };

  const confirmFollow = () => {
    if (userToFollow) {
      setFollowedUsersIds([...followedUsersIds, userToFollow.id]);
      
      // Update followers count for the target user
      updateUserStats(userToFollow.id, { followers: userToFollow.followers + 1 });
      // Update following count for current user
      updateUserStats(currentUser.id, { following: currentUser.following + 1 });
      
      showToast(`تمت متابعة ${userToFollow.name}`);
      setShowFollowModal(false);
      setUserToFollow(null);
    }
  };

  const handleUnfollowClick = (user: User) => {
    setUserToUnfollow(user);
    setShowUnfollowModal(true);
  };

  const confirmUnfollow = () => {
    if (userToUnfollow) {
      setFollowedUsersIds(followedUsersIds.filter(id => id !== userToUnfollow.id));
      
      updateUserStats(userToUnfollow.id, { followers: Math.max(0, userToUnfollow.followers - 1) });
      updateUserStats(currentUser.id, { following: Math.max(0, currentUser.following - 1) });
      
      showToast(`تم إلغاء متابعة ${userToUnfollow.name}`);
      setShowUnfollowModal(false);
      setUserToUnfollow(null);
    }
  };

  const handleEditProfile = () => {
    setEditFormData(currentUser);
    setShowEditProfileModal(true);
  };

  const saveProfileChanges = () => {
    setCurrentUser({ ...currentUser, ...editFormData } as User);
    setUsers(users.map(u => u.id === currentUser.id ? { ...u, ...editFormData } : u));
    setShowEditProfileModal(false);
    showToast("تم تحديث الملف الشخصي");
  };

  // --- Handlers: Moderation ---
  const handleBlockClick = (user: User) => {
    setUserToBlock(user);
    setShowBlockModal(true);
  };

  const confirmBlock = () => {
    if (userToBlock) {
      setBlockedUsers([...blockedUsers, userToBlock]);
      setPosts(posts.filter(p => p.user.id !== userToBlock.id));
      showToast(`تم حظر ${userToBlock.name}`);
      setShowBlockModal(false);
      setUserToBlock(null);
      if (view === 'user_profile' || view === 'chat') {
        setView('home');
      }
    }
  };

  const handleUnblock = (userId: string) => {
    setBlockedUsers(blockedUsers.filter(u => u.id !== userId));
    showToast("تم إلغاء الحظر");
  };

  const handleReportClick = (post: Post) => {
    setPostToReport(post);
    setShowReportModal(true);
  };

  const confirmReport = () => {
    showToast("تم استلام بلاغك وسنراجعه قريباً");
    setShowReportModal(false);
    setPostToReport(null);
  };

  // --- Handlers: Chat ---
  const handleChatClick = () => {
    setCurrentChatUser(null);
    setView('chat');
  };

  const handleMessageUser = (user: User) => {
    setCurrentChatUser(user);
    setView('chat');
  };

  const handleSendMessage = (text: string) => {
    if (!currentChatUser) return;

    const newMessage: Message = {
      id: `m_${Date.now()}`,
      senderId: currentUser.id,
      receiverId: currentChatUser.id,
      content: text,
      timestamp: Date.now()
    };

    setMessages([...messages, newMessage]);

    // Simulated Reply
    setTimeout(() => {
      const reply: Message = {
        id: `m_${Date.now() + 1}`,
        senderId: currentChatUser.id,
        receiverId: currentUser.id,
        content: 'شكراً لرسالتك، سأرد عليك قريباً!',
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, reply]);
    }, 3000);
  };

  // --- Filtering ---
  const filteredPosts = posts.filter(post => {
    // 1. Filter out blocked users
    if (blockedUsers.some(u => u.id === post.user.id)) return false;

    // 2. Search Filter
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    if (searchFilter === 'content') {
      return post.content?.toLowerCase().includes(query);
    } else if (searchFilter === 'author') {
      return post.user.name.toLowerCase().includes(query);
    } else if (searchFilter === 'date') {
      // Simple date filtering logic (e.g., searching for "Jan", "2024")
      const dateStr = new Date(post.timestamp).toLocaleDateString('ar-EG', { month: 'long', year: 'numeric', day: 'numeric' });
      return dateStr.includes(query);
    }
    return true;
  });

  // --- Render Sections ---
  const renderSettingsContent = () => {
    switch (settingsView) {
      case 'account':
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-2 mb-4 text-blue-600 cursor-pointer" onClick={() => setSettingsView('main')}>
              <ChevronRight />
              <span className="font-bold">العودة</span>
            </div>
            <h3 className="text-lg font-bold border-b pb-2">معلومات الحساب</h3>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg flex justify-between items-center">
                <span className="text-gray-600">الاسم</span>
                <span className="font-medium">{currentUser.name}</span>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg flex justify-between items-center">
                <span className="text-gray-600">اسم المستخدم</span>
                <span className="font-medium">@{currentUser.username}</span>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg flex justify-between items-center">
                <span className="text-gray-600">البريد الإلكتروني</span>
                <span className="font-medium">{currentUser.email}</span>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg flex justify-between items-center">
                <span className="text-gray-600">رقم الهاتف</span>
                <span className="font-medium">{currentUser.phone}</span>
              </div>
              <button onClick={handleEditProfile} className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">تعديل المعلومات</button>
            </div>
          </div>
        );
      case 'security':
        return (
          <div className="space-y-6 animate-fade-in">
             <div className="flex items-center gap-2 mb-4 text-blue-600 cursor-pointer" onClick={() => setSettingsView('main')}>
              <ChevronRight />
              <span className="font-bold">العودة</span>
            </div>
            <h3 className="text-lg font-bold border-b pb-2">الأمان وكلمة المرور</h3>
            <div className="space-y-4">
              <button className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg">
                <span className="flex items-center gap-3">
                  <Lock size={20} className="text-gray-500" />
                  تغيير كلمة المرور
                </span>
                <ChevronLeft size={18} className="text-gray-400" />
              </button>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="flex items-center gap-3">
                  <Shield size={20} className="text-gray-500" />
                  المصادقة الثنائية
                </span>
                <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                  <input type="checkbox" name="toggle" id="2fa" className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer"/>
                  <label htmlFor="2fa" className="toggle-label block overflow-hidden h-5 rounded-full bg-gray-300 cursor-pointer"></label>
                </div>
              </div>
            </div>
          </div>
        );
      case 'privacy':
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-2 mb-4 text-blue-600 cursor-pointer" onClick={() => setSettingsView('main')}>
              <ChevronRight />
              <span className="font-bold">العودة</span>
            </div>
            <h3 className="text-lg font-bold border-b pb-2">الخصوصية</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="flex items-center gap-3">
                  <Lock size={20} className="text-gray-500" />
                  حساب خاص
                </span>
                <input 
                  type="checkbox" 
                  checked={currentUser.privacySettings?.isPrivate}
                  onChange={() => {/* Toggle logic */}}
                  className="w-5 h-5 text-blue-600"
                />
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="flex items-center gap-3">
                  <Eye size={20} className="text-gray-500" />
                  حالة النشاط
                </span>
                <input 
                  type="checkbox" 
                  checked={currentUser.privacySettings?.showActivityStatus}
                  onChange={() => {/* Toggle logic */}}
                  className="w-5 h-5 text-blue-600"
                />
              </div>
              
              <div className="mt-6">
                <h4 className="font-bold mb-3 text-sm text-gray-500">المستخدمون المحظورون</h4>
                {blockedUsers.length === 0 ? (
                  <p className="text-sm text-gray-400">لا يوجد مستخدمين محظورين.</p>
                ) : (
                  <div className="space-y-2">
                    {blockedUsers.map(u => (
                      <div key={u.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100">
                        <div className="flex items-center gap-2">
                          <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full" />
                          <span className="text-sm font-medium">{u.name}</span>
                        </div>
                        <button 
                          onClick={() => handleUnblock(u.id)}
                          className="text-xs bg-white text-red-600 px-3 py-1 rounded border border-red-200 hover:bg-red-50"
                        >
                          إلغاء الحظر
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      case 'notifications':
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-2 mb-4 text-blue-600 cursor-pointer" onClick={() => setSettingsView('main')}>
              <ChevronRight />
              <span className="font-bold">العودة</span>
            </div>
            <h3 className="text-lg font-bold border-b pb-2">إعدادات الإشعارات</h3>
            <div className="space-y-4">
              {Object.entries(currentUser.notificationPreferences || {}).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="flex items-center gap-3 capitalize">
                    <Bell size={20} className="text-gray-500" />
                    {key === 'likes' ? 'الإعجابات' : key === 'comments' ? 'التعليقات' : 'المتابعات'}
                  </span>
                  <input 
                    type="checkbox" 
                    checked={value}
                    onChange={() => {/* Toggle logic */}}
                    className="w-5 h-5 text-blue-600"
                  />
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return (
          <div className="space-y-2 animate-fade-in">
            <button onClick={() => setSettingsView('account')} className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 rounded-xl border border-gray-100 transition-all">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-full"><UserIcon size={20} /></div>
                <div className="text-right">
                  <h4 className="font-bold text-gray-800">الحساب</h4>
                  <p className="text-xs text-gray-500">معلوماتك الشخصية</p>
                </div>
              </div>
              <ChevronLeft className="text-gray-400" />
            </button>
            <button onClick={() => setSettingsView('security')} className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 rounded-xl border border-gray-100 transition-all">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-50 text-green-600 rounded-full"><Shield size={20} /></div>
                <div className="text-right">
                  <h4 className="font-bold text-gray-800">الأمان</h4>
                  <p className="text-xs text-gray-500">كلمة المرور والحماية</p>
                </div>
              </div>
              <ChevronLeft className="text-gray-400" />
            </button>
            <button onClick={() => setSettingsView('privacy')} className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 rounded-xl border border-gray-100 transition-all">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 text-purple-600 rounded-full"><Lock size={20} /></div>
                <div className="text-right">
                  <h4 className="font-bold text-gray-800">الخصوصية</h4>
                  <p className="text-xs text-gray-500">من يرى منشوراتك</p>
                </div>
              </div>
              <ChevronLeft className="text-gray-400" />
            </button>
             <button onClick={() => setSettingsView('notifications')} className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 rounded-xl border border-gray-100 transition-all">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-50 text-orange-600 rounded-full"><Bell size={20} /></div>
                <div className="text-right">
                  <h4 className="font-bold text-gray-800">الإشعارات</h4>
                  <p className="text-xs text-gray-500">تخصيص التنبيهات</p>
                </div>
              </div>
              <ChevronLeft className="text-gray-400" />
            </button>
          </div>
        );
    }
  };

  // --- Main Render ---
  return (
    <div className="min-h-screen bg-[#f3f4f6] font-sans pb-20 md:pb-0">
      {/* Top Navigation */}
      <nav className="bg-white sticky top-0 z-40 shadow-sm border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between gap-2 md:gap-4">
          
          {/* Right Side Group: Menu + Logo */}
          <div className="flex items-center gap-2 flex-shrink-0">
             {/* Hamburger Menu (Mobile) - Positioned First for RTL to be on Right */}
             <button 
               onClick={() => setIsSideMenuOpen(true)}
               className="p-2 text-gray-600 hover:bg-gray-100 rounded-full md:hidden"
             >
               <Menu size={22} />
             </button>

             {/* Logo */}
             <div className="flex items-center gap-2 cursor-pointer" onClick={handleBackToFeed}>
              <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                M
              </div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                Meydan
              </h1>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md relative mx-2">
            <input
              type="text"
              placeholder={`بحث في ${searchFilter === 'author' ? 'المستخدمين' : searchFilter === 'date' ? 'التاريخ' : 'المحتوى'}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-100 border-transparent focus:bg-white focus:border-blue-500 focus:ring-0 rounded-full px-4 py-2 pl-10 pr-12 transition-all text-sm"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <button 
              onClick={() => setShowSearchFilterMenu(!showSearchFilterMenu)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-blue-600 rounded-full hover:bg-gray-200 transition-colors"
            >
              <Filter size={16} />
            </button>
            
            {showSearchFilterMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowSearchFilterMenu(false)} />
                <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-100 z-20 overflow-hidden py-1">
                   <button onClick={() => { setSearchFilter('content'); setShowSearchFilterMenu(false); }} className={`w-full text-right px-4 py-2 text-sm hover:bg-gray-50 ${searchFilter === 'content' ? 'text-blue-600 bg-blue-50' : 'text-gray-700'}`}>المحتوى</button>
                   <button onClick={() => { setSearchFilter('author'); setShowSearchFilterMenu(false); }} className={`w-full text-right px-4 py-2 text-sm hover:bg-gray-50 ${searchFilter === 'author' ? 'text-blue-600 bg-blue-50' : 'text-gray-700'}`}>الكاتب</button>
                   <button onClick={() => { setSearchFilter('date'); setShowSearchFilterMenu(false); }} className={`w-full text-right px-4 py-2 text-sm hover:bg-gray-50 ${searchFilter === 'date' ? 'text-blue-600 bg-blue-50' : 'text-gray-700'}`}>التاريخ</button>
                </div>
              </>
            )}
          </div>

          {/* Left Side: Actions */}
          <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
             {/* Notifications */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-full relative transition-colors"
              >
                <Bell size={22} />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                )}
              </button>
               {/* Notification Dropdown */}
               {showNotifications && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowNotifications(false)} />
                  <div className="absolute left-0 md:-left-20 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 z-20 overflow-hidden animate-in fade-in slide-in-from-top-2">
                    <div className="p-3 border-b border-gray-50 flex justify-between items-center">
                      <h3 className="font-bold text-sm text-gray-800">الإشعارات</h3>
                      <button className="text-xs text-blue-600 hover:underline">تحديد الكل كمقروء</button>
                    </div>
                    <div className="max-h-[300px] overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-gray-500 text-sm">لا توجد إشعارات جديدة</div>
                      ) : (
                        notifications.map(notif => (
                          <div key={notif.id} className={`p-3 flex items-start gap-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 ${!notif.read ? 'bg-blue-50/50' : ''}`}>
                            <img src={notif.user.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                            <div className="flex-1">
                              <p className="text-sm text-gray-800">
                                <span className="font-bold">{notif.user.name}</span>
                                {notif.type === 'like' && ' أعجب بمنشورك'}
                                {notif.type === 'comment' && ' علق على منشورك'}
                                {notif.type === 'follow' && ' بدأ بمتابعتك'}
                              </p>
                              <span className="text-xs text-gray-400 mt-1 block">منذ {Math.floor((Date.now() - notif.timestamp) / 60000)} دقيقة</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Desktop Hamburger Menu */}
            <button 
               onClick={() => setIsSideMenuOpen(true)}
               className="hidden md:flex p-2 text-gray-600 hover:bg-gray-100 rounded-full"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </nav>

      {/* Side Menu (Drawer) - Anchored to Right */}
      {isSideMenuOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-40 transition-opacity" 
            onClick={() => setIsSideMenuOpen(false)}
          />
          <div className="fixed top-0 right-0 h-full w-[280px] bg-white z-50 shadow-2xl transform transition-transform duration-300 overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">القائمة</h2>
              <button onClick={() => setIsSideMenuOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6 cursor-pointer" onClick={() => { setView('profile'); setIsSideMenuOpen(false); }}>
                <img src={currentUser.avatar} alt={currentUser.name} className="w-12 h-12 rounded-full object-cover border border-gray-200" />
                <div>
                  <h3 className="font-bold text-gray-900">{currentUser.name}</h3>
                  <span className="text-sm text-gray-500">عرض الملف الشخصي</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <button 
                  onClick={() => { setView('settings'); setSettingsView('main'); setIsSideMenuOpen(false); }}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors"
                >
                  <Settings size={20} />
                  الإعدادات والخصوصية
                </button>
                <button 
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors"
                >
                  <Moon size={20} />
                  الوضع الليلي
                </button>
                 <button 
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors"
                >
                  <HelpCircle size={20} />
                  المساعدة والدعم
                </button>
                <div className="h-px bg-gray-100 my-2"></div>
                <button 
                  onClick={() => { setIsSideMenuOpen(false); handleLogout(); }}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-red-50 text-red-600 transition-colors font-medium"
                >
                  <LogOut size={20} />
                  تسجيل الخروج
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Main Content */}
      <main className="max-w-5xl mx-auto p-4 flex gap-6">
        {/* View Routing */}
        {view === 'settings' ? (
           <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-6 min-h-[500px]">
             <h2 className="text-2xl font-bold text-gray-800 mb-6">الإعدادات</h2>
             {renderSettingsContent()}
           </div>
        ) : view === 'chat' ? (
          <div className="w-full flex gap-4 h-[calc(100vh-100px)]">
             {/* Chat List (Desktop) or Mobile List view */}
             <div className={`w-full md:w-1/3 ${currentChatUser && 'hidden md:block'}`}>
                <ChatList 
                  currentUser={currentUser}
                  messages={messages}
                  users={users}
                  onSelectUser={handleMessageUser}
                />
             </div>
             {/* Chat Window */}
             {currentChatUser ? (
                <div className="w-full md:w-2/3">
                  <ChatWindow 
                    currentUser={currentUser}
                    otherUser={currentChatUser}
                    messages={messages.filter(m => 
                      (m.senderId === currentUser.id && m.receiverId === currentChatUser.id) ||
                      (m.senderId === currentChatUser.id && m.receiverId === currentUser.id)
                    )}
                    onSendMessage={handleSendMessage}
                    onBack={() => setCurrentChatUser(null)}
                  />
                </div>
             ) : (
                <div className="hidden md:flex w-2/3 bg-white rounded-xl border border-gray-100 items-center justify-center text-gray-400 flex-col gap-4">
                   <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                      <MessageSquare size={40} className="text-gray-300" />
                   </div>
                   <p>اختر محادثة للبدء</p>
                </div>
             )}
          </div>
        ) : (
          <>
            {/* Left Sidebar (Desktop) */}
            <aside className="hidden md:block w-64 flex-shrink-0 space-y-4">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center sticky top-20">
                <div className="relative w-20 h-20 mx-auto mb-4 group cursor-pointer" onClick={() => setView('profile')}>
                  <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full rounded-full object-cover border-2 border-gray-100 group-hover:border-blue-400 transition-all" />
                  <div className="absolute inset-0 bg-black/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <UserIcon className="text-white" size={24} />
                  </div>
                </div>
                <h2 className="font-bold text-lg text-gray-900 mb-1">{currentUser.name}</h2>
                <p className="text-gray-500 text-sm mb-4 line-clamp-1">{currentUser.bio}</p>
                
                <div className="flex justify-center gap-6 mb-6 py-4 border-t border-b border-gray-50">
                  <div className="text-center">
                    <span className="block font-bold text-gray-900 text-lg">{currentUser.followers}</span>
                    <span className="text-xs text-gray-500">متابعون</span>
                  </div>
                  <div className="text-center">
                    <span className="block font-bold text-gray-900 text-lg">{currentUser.following}</span>
                    <span className="text-xs text-gray-500">يتابع</span>
                  </div>
                </div>
                
                <button onClick={() => setView('profile')} className="text-blue-600 text-sm font-medium hover:underline">عرض الملف الشخصي</button>
              </div>
            </aside>

            {/* Center Feed */}
            <div className="flex-1 min-w-0">
              {view === 'home' && (
                <>
                  <CreatePost currentUserAvatar={currentUser.avatar} onPostCreate={handleCreatePost} />
                  <div className="space-y-4">
                    {filteredPosts.map(post => (
                      <PostCard 
                        key={post.id} 
                        post={post} 
                        currentUserAvatar={currentUser.avatar}
                        currentUserId={currentUser.id}
                        onLike={handleLike}
                        onComment={handleComment}
                        onShare={handleShare}
                        onDelete={handleDelete}
                        onEdit={handleEditPost}
                        onRepost={handleRepost}
                        onUserClick={handleUserClick}
                        onBlock={handleBlockClick}
                        onReport={handleReportClick}
                      />
                    ))}
                    {filteredPosts.length === 0 && (
                       <div className="text-center py-10 text-gray-500">
                         <Search size={48} className="mx-auto mb-3 text-gray-300" />
                         <p>لا توجد منشورات تطابق بحثك.</p>
                       </div>
                    )}
                  </div>
                </>
              )}

              {(view === 'profile' || view === 'user_profile') && (
                <div className="animate-fade-in">
                   {/* Profile Header */}
                   <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6 relative">
                      <div className="h-32 bg-gradient-to-r from-blue-400 to-purple-500"></div>
                      <div className="px-6 pb-6">
                        <div className="flex flex-col md:flex-row items-start md:items-end justify-between -mt-12 mb-6 gap-4">
                          <div className="flex items-end gap-4">
                             <img 
                               src={view === 'profile' ? currentUser.avatar : viewedUser?.avatar} 
                               alt="Profile" 
                               className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white object-cover bg-white"
                             />
                             <div className="mb-2">
                               <h2 className="text-2xl font-bold text-gray-900">{view === 'profile' ? currentUser.name : viewedUser?.name}</h2>
                               <p className="text-gray-500">@{view === 'profile' ? currentUser.username : viewedUser?.username}</p>
                             </div>
                          </div>
                          <div className="flex gap-2 w-full md:w-auto">
                            {view === 'profile' ? (
                              <button 
                                onClick={handleEditProfile}
                                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                              >
                                <Edit2 size={18} />
                                تعديل الملف
                              </button>
                            ) : (
                              <>
                                <button 
                                  onClick={() => handleMessageUser(viewedUser!)}
                                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors"
                                >
                                  <Mail size={18} />
                                  مراسلة
                                </button>
                                {followedUsersIds.includes(viewedUser!.id) ? (
                                   <button 
                                     onClick={() => handleUnfollowClick(viewedUser!)}
                                     className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2 bg-gray-100 text-gray-800 hover:bg-red-50 hover:text-red-600 hover:border-red-200 border border-transparent rounded-lg font-medium transition-all group"
                                   >
                                      <UserMinus size={18} />
                                      <span className="group-hover:hidden">تتابعه</span>
                                      <span className="hidden group-hover:inline">إلغاء المتابعة</span>
                                   </button>
                                ) : (
                                  <button 
                                    onClick={() => handleFollowClick(viewedUser!)}
                                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-medium transition-colors shadow-sm"
                                  >
                                    <UserPlus size={18} />
                                    متابعة
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                           {/* Bio & Details */}
                           <div className="space-y-2 text-sm text-gray-600">
                              <p className="text-base text-gray-800 leading-relaxed mb-3">
                                {view === 'profile' ? currentUser.bio : viewedUser?.bio}
                              </p>
                              
                              {(view === 'profile' ? currentUser.country : viewedUser?.country) && (
                                <div className="flex items-center gap-2">
                                  <MapPin size={16} className="text-gray-400" />
                                  <span>يقيم في <strong>{view === 'profile' ? currentUser.country : viewedUser?.country}</strong></span>
                                </div>
                              )}
                              {(view === 'profile' ? currentUser.job : viewedUser?.job) && (
                                <div className="flex items-center gap-2">
                                  <Briefcase size={16} className="text-gray-400" />
                                  <span>يعمل كـ <strong>{view === 'profile' ? currentUser.job : viewedUser?.job}</strong></span>
                                </div>
                              )}
                               {(view === 'profile' ? currentUser.qualification : viewedUser?.qualification) && (
                                <div className="flex items-center gap-2">
                                  <GraduationCap size={16} className="text-gray-400" />
                                  <span>المؤهل: <strong>{view === 'profile' ? currentUser.qualification : viewedUser?.qualification}</strong></span>
                                </div>
                              )}
                           </div>
                           
                           {/* Stats */}
                           <div className="flex gap-4 justify-start md:justify-end h-fit">
                              <div className="px-4 py-2 bg-gray-50 rounded-lg text-center min-w-[80px]">
                                <span className="block font-bold text-lg text-gray-900">
                                  {view === 'profile' ? currentUser.followers : viewedUser?.followers}
                                </span>
                                <span className="text-xs text-gray-500">متابعون</span>
                              </div>
                              <div className="px-4 py-2 bg-gray-50 rounded-lg text-center min-w-[80px]">
                                <span className="block font-bold text-lg text-gray-900">
                                  {view === 'profile' ? currentUser.following : viewedUser?.following}
                                </span>
                                <span className="text-xs text-gray-500">يتابع</span>
                              </div>
                              <div className="px-4 py-2 bg-gray-50 rounded-lg text-center min-w-[80px]">
                                <span className="block font-bold text-lg text-gray-900">
                                  {posts.filter(p => p.user.id === (view === 'profile' ? currentUser.id : viewedUser?.id)).length}
                                </span>
                                <span className="text-xs text-gray-500">منشورات</span>
                              </div>
                           </div>
                        </div>
                      </div>
                   </div>

                   {/* Create Post in Profile (Only for Own Profile) */}
                   {view === 'profile' && (
                      <div className="mb-6">
                        <CreatePost currentUserAvatar={currentUser.avatar} onPostCreate={handleCreatePost} />
                      </div>
                   )}

                   {/* User's Posts */}
                   <h3 className="font-bold text-lg text-gray-800 mb-4">المنشورات</h3>
                   <div className="space-y-4">
                      {posts
                        .filter(p => p.user.id === (view === 'profile' ? currentUser.id : viewedUser?.id))
                        .map(post => (
                          <PostCard 
                            key={post.id} 
                            post={post} 
                            currentUserAvatar={currentUser.avatar}
                            currentUserId={currentUser.id}
                            onLike={handleLike}
                            onComment={handleComment}
                            onShare={handleShare}
                            onDelete={handleDelete}
                            onEdit={handleEditPost}
                            onRepost={handleRepost}
                            onUserClick={handleUserClick}
                            onBlock={handleBlockClick}
                            onReport={handleReportClick}
                          />
                      ))}
                      {posts.filter(p => p.user.id === (view === 'profile' ? currentUser.id : viewedUser?.id)).length === 0 && (
                        <div className="text-center py-12 bg-white rounded-xl border border-gray-100 border-dashed">
                          <p className="text-gray-400">لا توجد منشورات لعرضها</p>
                        </div>
                      )}
                   </div>
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 z-50 flex justify-around py-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <button 
          onClick={() => setView('home')}
          className={`flex flex-col items-center gap-1 ${view === 'home' ? 'text-blue-600' : 'text-gray-500'}`}
        >
          <Home size={24} fill={view === 'home' ? "currentColor" : "none"} />
          <span className="text-[10px] font-medium">الرئيسية</span>
        </button>
        
        <button 
          onClick={() => setView('profile')}
          className={`flex flex-col items-center gap-1 ${view === 'profile' ? 'text-blue-600' : 'text-gray-500'}`}
        >
          <div className={`rounded-full p-0.5 ${view === 'profile' ? 'ring-2 ring-blue-600' : ''}`}>
             <img src={currentUser.avatar} alt="" className="w-6 h-6 rounded-full" />
          </div>
          <span className="text-[10px] font-medium">الملف الشخصي</span>
        </button>
        
        <button 
          onClick={() => { setView('chat'); setCurrentChatUser(null); }}
          className={`flex flex-col items-center gap-1 ${view === 'chat' ? 'text-blue-600' : 'text-gray-500'}`}
        >
          <MessageSquare size={24} fill={view === 'chat' ? "currentColor" : "none"} />
          <span className="text-[10px] font-medium">الرسائل</span>
        </button>
      </div>

      {/* --- Modals --- */}

      {/* Edit Profile Modal */}
      {showEditProfileModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h3 className="font-bold text-lg">تعديل الملف الشخصي</h3>
              <button onClick={() => setShowEditProfileModal(false)} className="text-gray-500 hover:bg-gray-100 p-1 rounded-full"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
               {/* Image Upload Placeholder */}
               <div className="flex flex-col items-center mb-4">
                 <div className="relative group cursor-pointer">
                   <img src={editFormData.avatar || currentUser.avatar} alt="" className="w-24 h-24 rounded-full object-cover border-4 border-gray-50" />
                   <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                     <Camera className="text-white" />
                   </div>
                 </div>
                 <button className="text-blue-600 text-sm font-medium mt-2">تغيير الصورة</button>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">الاسم</label>
                    <input 
                      type="text" 
                      value={editFormData.name || ''}
                      onChange={e => setEditFormData({...editFormData, name: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                   <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">الوظيفة</label>
                    <input 
                      type="text" 
                      value={editFormData.job || ''}
                      onChange={e => setEditFormData({...editFormData, job: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
               </div>
               
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">النبذة التعريفية (Bio)</label>
                  <textarea 
                    value={editFormData.bio || ''}
                    onChange={e => setEditFormData({...editFormData, bio: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none h-24"
                  />
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">الدولة</label>
                    <input 
                      type="text" 
                      value={editFormData.country || ''}
                      onChange={e => setEditFormData({...editFormData, country: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                   <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">المؤهل</label>
                    <input 
                      type="text" 
                      value={editFormData.qualification || ''}
                      onChange={e => setEditFormData({...editFormData, qualification: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
               </div>
            </div>
            <div className="p-5 border-t border-gray-100 flex gap-3 justify-end bg-gray-50 sticky bottom-0">
              <button onClick={() => setShowEditProfileModal(false)} className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-200 rounded-lg transition-colors">إلغاء</button>
              <button onClick={saveProfileChanges} className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm">حفظ التغييرات</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
              <Trash2 size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">حذف المنشور؟</h3>
            <p className="text-gray-500 mb-6">لا يمكن التراجع عن هذا الإجراء. هل أنت متأكد من رغبتك في الحذف؟</p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteModal(false)} className="flex-1 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors">إلغاء</button>
              <button onClick={confirmDelete} className="flex-1 py-2.5 text-white bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors">حذف</button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
             <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 text-orange-600">
              <LogOut size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">تسجيل الخروج</h3>
            <p className="text-gray-500 mb-6">هل أنت متأكد من أنك تريد تسجيل الخروج من حسابك؟</p>
            <div className="flex gap-3">
              <button onClick={() => setShowLogoutModal(false)} className="flex-1 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors">إلغاء</button>
              <button onClick={confirmLogout} className="flex-1 py-2.5 text-white bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors">خروج</button>
            </div>
          </div>
        </div>
      )}

      {/* Follow Confirmation Modal */}
      {showFollowModal && userToFollow && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
             <img src={userToFollow.avatar} alt="" className="w-16 h-16 rounded-full mx-auto mb-4 border-4 border-blue-50" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">متابعة {userToFollow.name}؟</h3>
            <p className="text-gray-500 mb-6">ستظهر منشوراتهم في صفحتك الرئيسية.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowFollowModal(false)} className="flex-1 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors">إلغاء</button>
              <button onClick={confirmFollow} className="flex-1 py-2.5 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors">متابعة</button>
            </div>
          </div>
        </div>
      )}

      {/* Unfollow Confirmation Modal */}
      {showUnfollowModal && userToUnfollow && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
             <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-600">
              <UserMinus size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">إلغاء متابعة {userToUnfollow.name}؟</h3>
            <p className="text-gray-500 mb-6">لن تظهر منشوراتهم في صفحتك الرئيسية بعد الآن.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowUnfollowModal(false)} className="flex-1 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors">تراجع</button>
              <button onClick={confirmUnfollow} className="flex-1 py-2.5 text-white bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors">إلغاء المتابعة</button>
            </div>
          </div>
        </div>
      )}

      {/* Block Confirmation Modal */}
      {showBlockModal && userToBlock && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
             <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
              <Ban size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">حظر {userToBlock.name}؟</h3>
            <p className="text-gray-500 mb-6 text-sm">لن يتمكنوا من رؤية ملفك الشخصي أو منشوراتك، ولن تتمكن من رؤية محتواهم.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowBlockModal(false)} className="flex-1 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors">إلغاء</button>
              <button onClick={confirmBlock} className="flex-1 py-2.5 text-white bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors">حظر</button>
            </div>
          </div>
        </div>
      )}

      {/* Report Confirmation Modal */}
      {showReportModal && postToReport && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
             <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 text-orange-600">
              <AlertTriangle size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">الإبلاغ عن منشور؟</h3>
            <p className="text-gray-500 mb-6 text-sm">هل يعارض هذا المنشور معايير مجتمعنا؟ سيتم مراجعته من قبل المشرفين.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowReportModal(false)} className="flex-1 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors">إلغاء</button>
              <button onClick={confirmReport} className="flex-1 py-2.5 text-white bg-orange-500 hover:bg-orange-600 rounded-lg font-medium transition-colors">إبلاغ</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;
