
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
  Filter, Settings, LogOut, Moon, Sun, Shield, Lock, Info, ChevronLeft, Smartphone, Mail, Eye, EyeOff, Globe, HelpCircle, Ban, Flag,
  ArrowRight, Edit2, Trash2, Repeat, AlertTriangle, UserCheck
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
  
  // Dark Mode
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true';
    }
    return false;
  });

  // Notifications
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Chat
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [currentChatUser, setCurrentChatUser] = useState<User | null>(null);
  
  // Refs for Chat Notification Logic
  const currentChatUserRef = useRef<User | null>(null);
  const viewRef = useRef<ViewState>('home');

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
  const [showHelpModal, setShowHelpModal] = useState(false);

  // --- Effects ---
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [isDarkMode]);

  // Request Notification Permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Update Refs for Notifications
  useEffect(() => {
    currentChatUserRef.current = currentChatUser;
    viewRef.current = view;
  }, [currentChatUser, view]);

  // --- Helpers ---
  const showToast = (message: string) => {
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-20 left-1/2 -translate-x-1/2 bg-gray-800 dark:bg-gray-100 text-white dark:text-gray-900 px-4 py-2 rounded-full shadow-lg z-50 animate-in fade-in slide-in-from-bottom-5 text-sm font-medium';
    toast.innerText = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };

  const updateUserStats = (userId: string, update: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...update } : u));
    if (currentUser.id === userId) setCurrentUser(prev => ({ ...prev, ...update }));
    if (viewedUser?.id === userId) setViewedUser(prev => ({ ...prev!, ...update }));
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const sendPushNotification = (title: string, body: string, icon?: string) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon,
        // silent: false
      });
    }
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
      // NOTE: We do NOT remove posts from 'posts' state permanently.
      // The 'filteredPosts' logic will hide them. This allows unblocking to restore posts.
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

    // Capture sender for closure
    const sender = currentChatUser;

    // Simulated Reply
    setTimeout(() => {
      const reply: Message = {
        id: `m_${Date.now() + 1}`,
        senderId: sender.id,
        receiverId: currentUser.id,
        content: 'شكراً لرسالتك، سأرد عليك قريباً!',
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, reply]);

      // --- Push Notification Logic ---
      // Determine if the user is currently looking at this chat
      const isChattingWithSender = viewRef.current === 'chat' && currentChatUserRef.current?.id === sender.id;
      const isAppHidden = document.hidden;

      // If app is hidden OR user is not looking at this chat, send notification
      if (isAppHidden || !isChattingWithSender) {
        sendPushNotification(`رسالة جديدة من ${sender.name}`, reply.content, sender.avatar);
        
        if (!isAppHidden) {
          // If app is open but user is elsewhere (e.g. Home), show toast
           showToast(`💬 رسالة جديدة من ${sender.name}`);
        }
      }

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
            <h3 className="text-lg font-bold border-b pb-2 text-gray-800 dark:text-white dark:border-gray-700">معلومات الحساب</h3>
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-300">الاسم</span>
                <span className="font-medium text-gray-900 dark:text-white">{currentUser.name}</span>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-300">اسم المستخدم</span>
                <span className="font-medium text-gray-900 dark:text-white">@{currentUser.username}</span>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-300">البريد الإلكتروني</span>
                <span className="font-medium text-gray-900 dark:text-white">{currentUser.email}</span>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-300">رقم الهاتف</span>
                <span className="font-medium text-gray-900 dark:text-white">{currentUser.phone}</span>
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
            <h3 className="text-lg font-bold border-b pb-2 text-gray-800 dark:text-white dark:border-gray-700">الأمان وكلمة المرور</h3>
            <div className="space-y-4">
              <button className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors">
                <span className="flex items-center gap-3 text-gray-800 dark:text-white">
                  <Lock size={20} className="text-gray-500 dark:text-gray-400" />
                  تغيير كلمة المرور
                </span>
                <ChevronLeft size={18} className="text-gray-400" />
              </button>
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="flex items-center gap-3 text-gray-800 dark:text-white">
                  <Shield size={20} className="text-gray-500 dark:text-gray-400" />
                  المصادقة الثنائية
                </span>
                <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                  <input type="checkbox" name="toggle" id="2fa" className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer"/>
                  <label htmlFor="2fa" className="toggle-label block overflow-hidden h-5 rounded-full bg-gray-300 dark:bg-gray-600 cursor-pointer"></label>
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
            <h3 className="text-lg font-bold border-b pb-2 text-gray-800 dark:text-white dark:border-gray-700">الخصوصية</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="flex items-center gap-3 text-gray-800 dark:text-white">
                  <Lock size={20} className="text-gray-500 dark:text-gray-400" />
                  حساب خاص
                </span>
                <input 
                  type="checkbox" 
                  checked={currentUser.privacySettings?.isPrivate}
                  onChange={() => {
                    const newStatus = !currentUser.privacySettings?.isPrivate;
                    updateUserStats(currentUser.id, {
                      privacySettings: {
                        ...currentUser.privacySettings!,
                        isPrivate: newStatus
                      }
                    });
                    showToast(newStatus ? "تم تفعيل الحساب الخاص" : "تم تحويل الحساب إلى عام");
                  }}
                  className="w-5 h-5 text-blue-600 cursor-pointer"
                />
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="flex items-center gap-3 text-gray-800 dark:text-white">
                  <Eye size={20} className="text-gray-500 dark:text-gray-400" />
                  حالة النشاط
                </span>
                <input 
                  type="checkbox" 
                  checked={currentUser.privacySettings?.showActivityStatus}
                  onChange={() => {
                    const newStatus = !currentUser.privacySettings?.showActivityStatus;
                    updateUserStats(currentUser.id, {
                      privacySettings: {
                        ...currentUser.privacySettings!,
                        showActivityStatus: newStatus
                      }
                    });
                    showToast(newStatus ? "تم تفعيل حالة النشاط" : "تم إخفاء حالة النشاط");
                  }}
                  className="w-5 h-5 text-blue-600 cursor-pointer"
                />
              </div>
              
              {/* Blocked Users Section */}
              <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                <h4 className="font-bold mb-3 text-sm text-gray-800 dark:text-gray-200 flex items-center gap-2">
                  <Ban size={16} className="text-red-500" />
                  المستخدمون المحظورون
                </h4>
                {blockedUsers.length === 0 ? (
                  <div className="text-center py-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-dashed border-gray-200 dark:border-gray-600">
                     <p className="text-sm text-gray-400">لا يوجد مستخدمين محظورين.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {blockedUsers.map(u => (
                      <div key={u.id} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm">
                        <div className="flex items-center gap-3">
                          <img src={u.avatar} alt={u.name} className="w-10 h-10 rounded-full object-cover" />
                          <div>
                             <span className="text-sm font-bold text-gray-900 dark:text-white block">{u.name}</span>
                             <span className="text-xs text-gray-400 block">@{u.username}</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleUnblock(u.id)}
                          className="flex items-center gap-1 text-xs bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-3 py-1.5 rounded-full border border-red-100 dark:border-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                        >
                          <UserCheck size={14} />
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
            <h3 className="text-lg font-bold border-b pb-2 text-gray-800 dark:text-white dark:border-gray-700">إعدادات الإشعارات</h3>
            <div className="space-y-4">
              {Object.entries(currentUser.notificationPreferences || {}).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="flex items-center gap-3 capitalize text-gray-800 dark:text-white">
                    <Bell size={20} className="text-gray-500 dark:text-gray-400" />
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
            <button onClick={() => setSettingsView('account')} className="w-full flex items-center justify-between p-4 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-xl border border-gray-100 dark:border-gray-600 transition-all">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full"><UserIcon size={20} /></div>
                <div className="text-right">
                  <h4 className="font-bold text-gray-800 dark:text-white">الحساب</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">معلوماتك الشخصية</p>
                </div>
              </div>
              <ChevronLeft className="text-gray-400" />
            </button>
            <button onClick={() => setSettingsView('security')} className="w-full flex items-center justify-between p-4 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-xl border border-gray-100 dark:border-gray-600 transition-all">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full"><Shield size={20} /></div>
                <div className="text-right">
                  <h4 className="font-bold text-gray-800 dark:text-white">الأمان</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">كلمة المرور والحماية</p>
                </div>
              </div>
              <ChevronLeft className="text-gray-400" />
            </button>
            <button onClick={() => setSettingsView('privacy')} className="w-full flex items-center justify-between p-4 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-xl border border-gray-100 dark:border-gray-600 transition-all">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full"><Lock size={20} /></div>
                <div className="text-right">
                  <h4 className="font-bold text-gray-800 dark:text-white">الخصوصية</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">من يرى منشوراتك</p>
                </div>
              </div>
              <ChevronLeft className="text-gray-400" />
            </button>
             <button onClick={() => setSettingsView('notifications')} className="w-full flex items-center justify-between p-4 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-xl border border-gray-100 dark:border-gray-600 transition-all">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full"><Bell size={20} /></div>
                <div className="text-right">
                  <h4 className="font-bold text-gray-800 dark:text-white">الإشعارات</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">تخصيص التنبيهات</p>
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
    <div className="min-h-screen bg-[#f3f4f6] dark:bg-gray-900 font-sans pb-20 md:pb-0 transition-colors duration-300">
      {/* Top Navigation */}
      <nav className="bg-white dark:bg-gray-800 sticky top-0 z-40 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between gap-2 md:gap-4">
          
          {/* Right Side Group: Menu + Logo */}
          <div className="flex items-center gap-2 flex-shrink-0">
             {/* Hamburger Menu (Mobile) - Positioned First for RTL to be on Right */}
             <button 
               onClick={() => setIsSideMenuOpen(true)}
               className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full md:hidden"
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
              className="w-full bg-gray-100 dark:bg-gray-700 border-transparent focus:bg-white dark:focus:bg-gray-600 focus:border-blue-500 focus:ring-0 rounded-full px-4 py-2 pl-10 pr-12 transition-all text-sm dark:text-white dark:placeholder-gray-400"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
            <button 
              onClick={() => setShowSearchFilterMenu(!showSearchFilterMenu)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <Filter size={16} />
            </button>
            
            {showSearchFilterMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowSearchFilterMenu(false)} />
                <div className="absolute right-0 top-full mt-2 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 z-20 overflow-hidden py-1">
                   <button onClick={() => { setSearchFilter('content'); setShowSearchFilterMenu(false); }} className={`w-full text-right px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 ${searchFilter === 'content' ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' : 'text-gray-700 dark:text-gray-300'}`}>المحتوى</button>
                   <button onClick={() => { setSearchFilter('author'); setShowSearchFilterMenu(false); }} className={`w-full text-right px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 ${searchFilter === 'author' ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' : 'text-gray-700 dark:text-gray-300'}`}>الكاتب</button>
                   <button onClick={() => { setSearchFilter('date'); setShowSearchFilterMenu(false); }} className={`w-full text-right px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 ${searchFilter === 'date' ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' : 'text-gray-700 dark:text-gray-300'}`}>التاريخ</button>
                </div>
              </>
            )}
          </div>

          {/* Left Side: Actions */}
          <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
             
             {/* Desktop Navigation Buttons - Added here next to search */}
             <div className="hidden md:flex items-center gap-2">
               <button 
                 onClick={() => { setView('home'); window.scrollTo(0,0); }}
                 className={`p-2 rounded-full transition-colors relative group ${view === 'home' ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                 title="الرئيسية"
               >
                 <Home size={22} strokeWidth={view === 'home' ? 2.5 : 2} />
               </button>
               
               <button 
                 onClick={() => { setView('profile'); window.scrollTo(0,0); }}
                 className={`p-2 rounded-full transition-colors relative group ${view === 'profile' ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                 title="الملف الشخصي"
               >
                 <UserIcon size={22} strokeWidth={view === 'profile' ? 2.5 : 2} />
               </button>
             </div>

             {/* Notifications */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full relative transition-colors"
              >
                <Bell size={22} />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-gray-800"></span>
                )}
              </button>
               {/* Notification Dropdown */}
               {showNotifications && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowNotifications(false)} />
                  <div className="absolute left-0 md:-left-20 top-full mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 z-20 overflow-hidden animate-in fade-in slide-in-from-top-2">
                    <div className="p-3 border-b border-gray-50 dark:border-gray-700 flex justify-between items-center">
                      <h3 className="font-bold text-sm text-gray-800 dark:text-gray-200">الإشعارات</h3>
                      <button className="text-xs text-blue-600 dark:text-blue-400 hover:underline">تحديد الكل كمقروء</button>
                    </div>
                    <div className="max-h-[300px] overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-gray-500 dark:text-gray-400 text-sm">لا توجد إشعارات جديدة</div>
                      ) : (
                        notifications.map(notif => (
                          <div key={notif.id} className={`p-3 flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-50 dark:border-gray-700 last:border-0 ${!notif.read ? 'bg-blue-50/50 dark:bg-blue-900/20' : 'dark:bg-gray-800'}`}>
                            <img src={notif.user.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                            <div className="flex-1">
                              <p className="text-sm text-gray-800 dark:text-gray-200">
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
               className="hidden md:flex p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
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
          <div className="fixed top-0 right-0 h-full w-[280px] bg-white dark:bg-gray-800 z-50 shadow-2xl transform transition-transform duration-300 overflow-y-auto border-l border-gray-100 dark:border-gray-700">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">القائمة</h2>
              <button onClick={() => setIsSideMenuOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6 cursor-pointer" onClick={() => { setView('profile'); setIsSideMenuOpen(false); }}>
                <img src={currentUser.avatar} alt={currentUser.name} className="w-12 h-12 rounded-full object-cover border border-gray-200 dark:border-gray-600" />
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">{currentUser.name}</h3>
                  <span className="text-sm text-gray-500 dark:text-gray-400">عرض الملف الشخصي</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <button 
                  onClick={() => { setView('settings'); setSettingsView('main'); setIsSideMenuOpen(false); }}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
                >
                  <Settings size={20} />
                  الإعدادات والخصوصية
                </button>
                <button 
                  onClick={toggleDarkMode}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
                >
                  {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                  {isDarkMode ? 'الوضع النهاري' : 'الوضع الليلي'}
                </button>
                 <button 
                  onClick={() => { setShowHelpModal(true); setIsSideMenuOpen(false); }}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
                >
                  <HelpCircle size={20} />
                  المساعدة والدعم
                </button>
                <div className="h-px bg-gray-100 dark:bg-gray-700 my-2"></div>
                <button 
                  onClick={() => { setIsSideMenuOpen(false); handleLogout(); }}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors font-medium"
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
           <div className="w-full max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 min-h-[500px] transition-colors">
             <div className="flex items-center justify-between mb-6">
               <h2 className="text-2xl font-bold text-gray-800 dark:text-white">الإعدادات</h2>
               <button 
                 onClick={() => setView('home')} 
                 className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                 title="إغلاق"
               >
                 <X size={24} />
               </button>
             </div>
             {renderSettingsContent()}
           </div>
        ) : view === 'chat' ? (
             // Chat View
             <div className="w-full max-w-4xl mx-auto">
               {currentChatUser ? (
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
               ) : (
                 <ChatList 
                   currentUser={currentUser}
                   messages={messages}
                   users={users.filter(u => u.id !== currentUser.id)}
                   onSelectUser={handleMessageUser}
                   onClose={() => setView('home')}
                 />
               )}
             </div>
        ) : (
          <>
            {/* Right Sidebar (Desktop Profile) - Only show on home/profile */}
             <aside className="hidden md:block w-[280px] flex-shrink-0 space-y-4">
                {/* Profile Card */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 text-center sticky top-20 transition-colors">
                  <div className="relative inline-block mb-3">
                    <img src={currentUser.avatar} alt={currentUser.name} className="w-24 h-24 rounded-full object-cover border-4 border-gray-50 dark:border-gray-700 mx-auto" />
                    <div className="absolute bottom-1 right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white dark:border-gray-800"></div>
                  </div>
                  <h2 className="font-bold text-xl text-gray-900 dark:text-white mb-1">{currentUser.name}</h2>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">@{currentUser.username}</p>
                  
                  <div className="flex justify-center gap-6 mb-6 text-sm">
                    <div className="text-center">
                      <div className="font-bold text-gray-900 dark:text-white">{currentUser.followers}</div>
                      <div className="text-gray-400 text-xs">متابِع</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-gray-900 dark:text-white">{currentUser.following}</div>
                      <div className="text-gray-400 text-xs">متابَع</div>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 text-right mb-6">
                    {currentUser.job && <div className="flex items-center gap-2"><Briefcase size={16} /> {currentUser.job}</div>}
                    {currentUser.country && <div className="flex items-center gap-2"><MapPin size={16} /> {currentUser.country}</div>}
                  </div>

                  <button onClick={() => setView('profile')} className="w-full py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg font-medium hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors">
                    الملف الشخصي
                  </button>
                </div>
             </aside>

            {/* Feed / Main Content */}
            <div className="flex-1 min-w-0">
              {/* Profile View Header */}
              {(view === 'profile' || view === 'user_profile') && (
                 <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-visible mb-6 animate-fade-in transition-colors">
                    {/* Cover Photo - Increased height */}
                    <div className="h-48 bg-gradient-to-r from-blue-600 to-purple-600 relative rounded-t-xl">
                    </div>
                    
                    <div className="px-6 pb-6 relative">
                      {/* Avatar & Buttons Container */}
                      <div className="flex flex-col md:flex-row items-start md:items-end -mt-16 mb-4 gap-4">
                         {/* Avatar - Increased size and z-index */}
                         <div className="relative z-10">
                           <img 
                             src={view === 'profile' ? currentUser.avatar : viewedUser?.avatar} 
                             alt="Profile" 
                             className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 shadow-lg object-cover bg-white dark:bg-gray-800"
                           />
                         </div>

                         {/* Actions */}
                         <div className="flex-1 flex justify-end w-full md:w-auto mt-4 md:mt-0">
                           {view === 'profile' ? (
                             <button 
                               onClick={handleEditProfile}
                               className="px-6 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-bold text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-2 shadow-sm"
                             >
                               <Edit2 size={18} />
                               تعديل الملف
                             </button>
                           ) : (
                             <div className="flex gap-3 w-full md:w-auto">
                                <button 
                                  onClick={() => viewedUser && handleMessageUser(viewedUser)}
                                  className="flex-1 md:flex-none px-6 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-bold text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
                                >
                                  <MessageCircle size={18} />
                                  مراسلة
                                </button>
                                {viewedUser && followedUsersIds.includes(viewedUser.id) ? (
                                  <button 
                                    onClick={() => viewedUser && handleUnfollowClick(viewedUser)}
                                    className="flex-1 md:flex-none px-6 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-bold text-sm hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors flex items-center justify-center gap-2 group"
                                  >
                                    <UserCheck size={18} className="group-hover:hidden" />
                                    <UserMinus size={18} className="hidden group-hover:block" />
                                    <span className="group-hover:hidden">تتابعه</span>
                                    <span className="hidden group-hover:inline">إلغاء</span>
                                  </button>
                                ) : (
                                  <button 
                                    onClick={() => viewedUser && handleFollowClick(viewedUser)}
                                    className="flex-1 md:flex-none px-6 py-2.5 bg-blue-600 text-white rounded-lg font-bold text-sm hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-md shadow-blue-200 dark:shadow-none"
                                  >
                                    <UserPlus size={18} />
                                    متابعة
                                  </button>
                                )}
                             </div>
                           )}
                         </div>
                      </div>
                      
                      {/* Text Info */}
                      <div className="text-right">
                         <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                           {view === 'profile' ? currentUser.name : viewedUser?.name}
                         </h2>
                         <p className="text-gray-500 dark:text-gray-400 text-sm mb-4" dir="ltr">
                           @{view === 'profile' ? currentUser.username : viewedUser?.username}
                         </p>
                         <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                           {view === 'profile' ? currentUser.bio : viewedUser?.bio}
                         </p>
                         
                         {/* User Stats in Profile Header */}
                         <div className="flex flex-wrap gap-6 text-sm border-t border-gray-50 dark:border-gray-700 pt-4">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-gray-900 dark:text-white text-lg">{view === 'profile' ? currentUser.followers : viewedUser?.followers}</span>
                              <span className="text-gray-500 dark:text-gray-400">متابِع</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-gray-900 dark:text-white text-lg">{view === 'profile' ? currentUser.following : viewedUser?.following}</span>
                              <span className="text-gray-500 dark:text-gray-400">متابَع</span>
                            </div>
                            {(view === 'profile' ? currentUser.country : viewedUser?.country) && (
                              <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 mr-auto md:mr-0">
                                <MapPin size={16} />
                                <span>{view === 'profile' ? currentUser.country : viewedUser?.country}</span>
                              </div>
                            )}
                             {(view === 'profile' ? currentUser.job : viewedUser?.job) && (
                              <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                                <Briefcase size={16} />
                                <span>{view === 'profile' ? currentUser.job : viewedUser?.job}</span>
                              </div>
                            )}
                         </div>
                      </div>
                    </div>
                 </div>
              )}

              {/* Create Post (Home & Profile) */}
              {(view === 'home' || view === 'profile') && (
                 <CreatePost 
                   currentUserAvatar={currentUser.avatar}
                   onPostCreate={handleCreatePost}
                 />
              )}

              {/* Posts Feed */}
              <div className="space-y-4">
                {filteredPosts.length > 0 ? (
                  filteredPosts
                    .filter(post => {
                       if (view === 'profile') return post.user.id === currentUser.id;
                       if (view === 'user_profile') return post.user.id === viewedUser?.id;
                       return true;
                    })
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
                  ))
                ) : (
                  <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                    {searchQuery ? 'لا توجد نتائج للبحث' : 'لا توجد منشورات حالياً'}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-3 flex justify-between items-center z-40 safe-area-bottom transition-colors">
        <button 
          onClick={() => { setView('home'); window.scrollTo(0,0); }}
          className={`flex flex-col items-center gap-1 ${view === 'home' ? 'text-blue-600' : 'text-gray-400 dark:text-gray-500'}`}
        >
          <Home size={24} strokeWidth={view === 'home' ? 2.5 : 2} />
          <span className="text-[10px] font-medium">الرئيسية</span>
        </button>
        
        <button 
           onClick={() => { setView('profile'); window.scrollTo(0,0); }}
           className={`flex flex-col items-center gap-1 ${view === 'profile' ? 'text-blue-600' : 'text-gray-400 dark:text-gray-500'}`}
        >
          <UserIcon size={24} strokeWidth={view === 'profile' ? 2.5 : 2} />
          <span className="text-[10px] font-medium">ملفي</span>
        </button>

        <button 
           onClick={() => { setView('chat'); setCurrentChatUser(null); }}
           className={`flex flex-col items-center gap-1 ${view === 'chat' ? 'text-blue-600' : 'text-gray-400 dark:text-gray-500'}`}
        >
          <MessageSquare size={24} strokeWidth={view === 'chat' ? 2.5 : 2} />
          <span className="text-[10px] font-medium">الرسائل</span>
        </button>
      </nav>

      {/* --- MODALS --- */}
      
      {/* Help & Support Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg p-6 transform scale-100 animate-in zoom-in-95 flex flex-col max-h-[80vh]">
            <div className="flex justify-between items-center mb-6 border-b border-gray-100 dark:border-gray-700 pb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <HelpCircle size={24} className="text-blue-600" />
                المساعدة والدعم
              </h3>
              <button onClick={() => setShowHelpModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <X size={24} />
              </button>
            </div>
            
            <div className="overflow-y-auto flex-1 pr-2 custom-scrollbar">
              <h4 className="font-bold text-gray-800 dark:text-white mb-3">الأسئلة الشائعة</h4>
              <div className="space-y-3 mb-6">
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                  <details className="group">
                    <summary className="flex cursor-pointer items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white font-medium">
                      كيف يمكنني تغيير كلمة المرور؟
                      <span className="ml-2 shrink-0 transition duration-300 group-open:-rotate-180">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </span>
                    </summary>
                    <div className="p-4 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                      يمكنك تغيير كلمة المرور بالذهاب إلى الإعدادات > الأمان > تغيير كلمة المرور.
                    </div>
                  </details>
                </div>
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                  <details className="group">
                    <summary className="flex cursor-pointer items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white font-medium">
                      كيف يمكنني حظر مستخدم مزعج؟
                      <span className="ml-2 shrink-0 transition duration-300 group-open:-rotate-180">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </span>
                    </summary>
                    <div className="p-4 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                      من أي منشور للمستخدم، اضغط على النقاط الثلاث واختر "حظر المستخدم". يمكنك إدارة المحظورين من إعدادات الخصوصية.
                    </div>
                  </details>
                </div>
              </div>

              <h4 className="font-bold text-gray-800 dark:text-white mb-3">تواصل معنا</h4>
              <form onSubmit={(e) => { e.preventDefault(); showToast("تم إرسال رسالتك للدعم الفني"); setShowHelpModal(false); }} className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">الموضوع</label>
                  <input type="text" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">الرسالة</label>
                  <textarea className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none" rows={4} required></textarea>
                </div>
                <button type="submit" className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors">إرسال</button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center transform scale-100 animate-in zoom-in-95">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <LogOut size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">تسجيل الخروج</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">هل أنت متأكد أنك تريد تسجيل الخروج من الحساب؟</p>
            <div className="flex gap-3">
              <button onClick={() => setShowLogoutModal(false)} className="flex-1 py-2.5 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">إلغاء</button>
              <button onClick={confirmLogout} className="flex-1 py-2.5 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors">خروج</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Post Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
           <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center animate-in zoom-in-95">
             <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">حذف المنشور</h3>
             <p className="text-gray-500 dark:text-gray-400 mb-6">هل أنت متأكد؟ لا يمكن التراجع عن هذا الإجراء.</p>
             <div className="flex gap-3">
               <button onClick={() => setShowDeleteModal(false)} className="flex-1 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium">إلغاء</button>
               <button onClick={confirmDelete} className="flex-1 py-2 bg-red-600 text-white rounded-xl font-medium">حذف</button>
             </div>
           </div>
        </div>
      )}

      {/* Follow Modal */}
      {showFollowModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
           <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center animate-in zoom-in-95">
             <div className="w-16 h-16 mx-auto mb-4 rounded-full overflow-hidden border-2 border-blue-100 dark:border-blue-900">
                <img src={userToFollow?.avatar} alt="" className="w-full h-full object-cover" />
             </div>
             <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">متابعة {userToFollow?.name}؟</h3>
             <p className="text-gray-500 dark:text-gray-400 mb-6">ستظهر منشورات هذا المستخدم في صفحتك الرئيسية.</p>
             <div className="flex gap-3">
               <button onClick={() => setShowFollowModal(false)} className="flex-1 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium">إلغاء</button>
               <button onClick={confirmFollow} className="flex-1 py-2 bg-blue-600 text-white rounded-xl font-medium">متابعة</button>
             </div>
           </div>
        </div>
      )}

      {/* Unfollow Modal */}
      {showUnfollowModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
           <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center animate-in zoom-in-95">
             <div className="w-16 h-16 mx-auto mb-4 rounded-full overflow-hidden border-2 border-red-100 dark:border-red-900 grayscale">
                <img src={userToUnfollow?.avatar} alt="" className="w-full h-full object-cover" />
             </div>
             <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">إلغاء متابعة {userToUnfollow?.name}؟</h3>
             <p className="text-gray-500 dark:text-gray-400 mb-6">لن ترى منشورات هذا المستخدم في صفحتك الرئيسية بعد الآن.</p>
             <div className="flex gap-3">
               <button onClick={() => setShowUnfollowModal(false)} className="flex-1 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium">إلغاء</button>
               <button onClick={confirmUnfollow} className="flex-1 py-2 bg-red-600 text-white rounded-xl font-medium">إلغاء المتابعة</button>
             </div>
           </div>
        </div>
      )}
      
      {/* Block Modal */}
      {showBlockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
           <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center animate-in zoom-in-95">
             <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-4">
               <Ban size={32} />
             </div>
             <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">حظر {userToBlock?.name}</h3>
             <p className="text-gray-500 dark:text-gray-400 mb-6">لن يتمكن هذا المستخدم من رؤية ملفك الشخصي أو التفاعل معك. سيتم إخفاء محتواه من صفحتك.</p>
             <div className="flex gap-3">
               <button onClick={() => setShowBlockModal(false)} className="flex-1 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium">إلغاء</button>
               <button onClick={confirmBlock} className="flex-1 py-2 bg-red-600 text-white rounded-xl font-medium">حظر</button>
             </div>
           </div>
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
           <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center animate-in zoom-in-95">
             <div className="w-16 h-16 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-full flex items-center justify-center mx-auto mb-4">
               <Flag size={32} />
             </div>
             <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">الإبلاغ عن محتوى</h3>
             <p className="text-gray-500 dark:text-gray-400 mb-6">هل أنت متأكد أنك تريد الإبلاغ عن هذا المنشور؟ سيتم مراجعته من قبل الإدارة.</p>
             <div className="flex gap-3">
               <button onClick={() => setShowReportModal(false)} className="flex-1 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium">إلغاء</button>
               <button onClick={confirmReport} className="flex-1 py-2 bg-orange-600 text-white rounded-xl font-medium">إبلاغ</button>
             </div>
           </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in zoom-in-95 my-10">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">تعديل الملف الشخصي</h3>
              <button onClick={() => setShowEditProfileModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Avatar Upload Simulation */}
              <div className="flex flex-col items-center mb-4">
                <div className="relative group cursor-pointer">
                  <img src={editFormData.avatar || currentUser.avatar} alt="Avatar" className="w-24 h-24 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600" />
                  <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="text-white" />
                  </div>
                </div>
                <span className="text-xs text-blue-600 dark:text-blue-400 mt-2 font-medium">تغيير الصورة</span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">الاسم</label>
                <input 
                  type="text" 
                  value={editFormData.name || ''} 
                  onChange={e => setEditFormData({...editFormData, name: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">اسم المستخدم</label>
                <input 
                  type="text" 
                  value={editFormData.username || ''} 
                  onChange={e => setEditFormData({...editFormData, username: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
               <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">الدولة</label>
                <input 
                  type="text" 
                  value={editFormData.country || ''} 
                  onChange={e => setEditFormData({...editFormData, country: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">الوظيفة</label>
                <input 
                  type="text" 
                  value={editFormData.job || ''} 
                  onChange={e => setEditFormData({...editFormData, job: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">النبذة التعريفية</label>
                <textarea 
                  value={editFormData.bio || ''} 
                  onChange={e => setEditFormData({...editFormData, bio: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  rows={3}
                />
              </div>
              
              <button 
                onClick={saveProfileChanges}
                className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors mt-4 shadow-lg shadow-blue-200 dark:shadow-none"
              >
                حفظ التغييرات
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;
