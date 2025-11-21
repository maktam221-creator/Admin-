
import React, { useState, useRef, useEffect } from 'react';
import { PostCard } from './components/PostCard';
import { CreatePost } from './components/CreatePost';
import { ChatWindow } from './components/ChatWindow';
import { Post, User, Message } from './types';
import { 
  Bell, Menu, Home, User as UserIcon, AlertTriangle, Search, 
  UserPlus, UserMinus, Check, Heart, MessageCircle, Share2, 
  MapPin, Briefcase, GraduationCap, Camera, X, MessageSquare, ChevronRight,
  Filter, Settings, LogOut, Moon, Shield, Lock, Info, ChevronLeft, Smartphone, Mail, Eye, EyeOff, Globe, HelpCircle, Ban, Flag
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
    user: { id: 'user_2', name: 'سارة علي', avatar: 'https://picsum.photos/id/65/200/200', followers: 530, following: 120 },
    type: 'like',
    timestamp: Date.now() - 1000 * 60 * 15, // 15 mins ago
    read: false
  },
  {
    id: 'n2',
    user: { id: 'u3', name: 'خالد عمر', avatar: 'https://picsum.photos/id/91/200/200', followers: 210, following: 300 },
    type: 'comment',
    content: 'منشور رائع ومفيد جداً!',
    timestamp: Date.now() - 1000 * 60 * 60 * 2, // 2 hours ago
    read: false
  },
  {
    id: 'n3',
    user: { id: 'u4', name: 'يوسف أحمد', avatar: 'https://picsum.photos/id/77/200/200', followers: 89, following: 150 },
    type: 'follow',
    timestamp: Date.now() - 1000 * 60 * 60 * 5, // 5 hours ago
    read: true
  }
];

// Mock Messages
const INITIAL_MESSAGES: Message[] = [
  {
    id: 'm1',
    senderId: 'user_2',
    receiverId: 'curr_user_1',
    content: 'مرحباً أحمد، كيف حالك؟',
    timestamp: Date.now() - 1000 * 60 * 60 * 24
  },
  {
    id: 'm2',
    senderId: 'curr_user_1',
    receiverId: 'user_2',
    content: 'أهلاً سارة، أنا بخير الحمد لله. ماذا عنك؟',
    timestamp: Date.now() - 1000 * 60 * 60 * 23
  }
];

// Initial Mock Data for Posts
const INITIAL_POSTS: Post[] = [
  {
    id: '1',
    user: {
      id: 'user_2',
      name: 'سارة علي',
      avatar: 'https://picsum.photos/id/65/200/200',
      followers: 530,
      following: 120
    },
    content: 'صباح الخير يا أصدقاء! 🌞\nأتمنى لكم يوماً مليئاً بالإنجازات والسعادة.',
    image: 'https://picsum.photos/id/28/800/600',
    likes: 42,
    isLiked: false,
    comments: [
      {
        id: 'c1',
        user: { id: 'u3', name: 'خالد عمر', avatar: 'https://picsum.photos/id/91/200/200', followers: 210, following: 300 },
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
      avatar: 'https://picsum.photos/id/180/200/200',
      followers: 15400,
      following: 20
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
  // Main State
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USER);
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [view, setView] = useState<'home' | 'profile' | 'user_profile' | 'messages' | 'settings'>('home');
  const [viewedUser, setViewedUser] = useState<User | null>(null);
  
  // Settings State
  const [settingsView, setSettingsView] = useState<'main' | 'account' | 'security' | 'privacy' | 'notifications'>('main');
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });
  const [showPassword, setShowPassword] = useState(false);
  
  // Chat State
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [activeChatUser, setActiveChatUser] = useState<User | null>(null);
  
  // Interaction State
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [postToReport, setPostToReport] = useState<Post | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilter, setSearchFilter] = useState<'content' | 'author' | 'date'>('content');
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  
  // Notifications State
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Follow & Block logic states
  const [followedUsers, setFollowedUsers] = useState<string[]>([]);
  const [showFollowModal, setShowFollowModal] = useState(false);
  const [showUnfollowModal, setShowUnfollowModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [userToBlock, setUserToBlock] = useState<User | null>(null);

  // Edit Profile State
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [editFormData, setEditFormData] = useState<Partial<User>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;
  const isViewedUserFollowed = viewedUser ? followedUsers.includes(viewedUser.id) : false;

  // Helper Functions
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const getTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return 'منذ لحظات';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `منذ ${minutes} د`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `منذ ${hours} س`;
    return 'منذ يوم';
  };

  // Post Actions
  const handleCreatePost = (text: string, image: string | null) => {
    const newPost: Post = {
      id: Date.now().toString(),
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
    showToast('تم نشر المنشور بنجاح');
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
          user: currentUser,
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

  const handleShare = async (postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    setPosts(posts.map(p => {
      if (p.id === postId) {
        return { ...p, shares: p.shares + 1 };
      }
      return p;
    }));

    const shareData = {
      title: `منشور بواسطة ${post.user.name}`,
      text: post.content,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${shareData.text}\n\n${shareData.url}`);
        showToast('تم نسخ المنشور للحافظة بنجاح');
      }
    } catch (err) {
      console.log('Share cancelled or failed', err);
    }
  };

  const handleRepost = (postId: string) => {
    const postToRepost = posts.find(p => p.id === postId);
    if (!postToRepost) return;

    const sourcePost = postToRepost.originalPost || postToRepost;

    const newPost: Post = {
      id: Date.now().toString(),
      user: currentUser,
      content: '',
      originalPost: sourcePost,
      likes: 0,
      isLiked: false,
      comments: [],
      shares: 0,
      timestamp: Date.now(),
    };

    setPosts([newPost, ...posts]);
    setPosts(prevPosts => prevPosts.map(p => {
      if (p.id === sourcePost.id) {
        return { ...p, shares: p.shares + 1 };
      }
      return p;
    }));

    showToast('تم إعادة نشر المنشور بنجاح');
  };

  const handleDeleteClick = (postId: string) => {
    setPostToDelete(postId);
  };

  const confirmDelete = () => {
    if (postToDelete) {
      setPosts(posts.filter(post => post.id !== postToDelete));
      setPostToDelete(null);
      showToast('تم حذف المنشور بنجاح');
    }
  };

  const handleEditPost = (postId: string, newContent: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return { ...post, content: newContent };
      }
      return post;
    }));
    showToast('تم تعديل المنشور بنجاح');
  };

  const handleBlockClick = (user: User) => {
    setUserToBlock(user);
  };

  const confirmBlock = () => {
    if (userToBlock) {
      setPosts(posts.filter(p => p.user.id !== userToBlock.id));
      if (followedUsers.includes(userToBlock.id)) {
        setFollowedUsers(followedUsers.filter(id => id !== userToBlock.id));
        setCurrentUser(prev => ({ ...prev, following: prev.following - 1 }));
      }
      showToast(`تم حظر ${userToBlock.name}`);
      setUserToBlock(null);
      if (view === 'user_profile' && viewedUser?.id === userToBlock.id) {
        setView('home');
      }
    }
  };

  const handleReportClick = (post: Post) => {
    setPostToReport(post);
  };

  const confirmReport = () => {
    if (postToReport) {
      showToast('تم استلام البلاغ، شكراً لمساعدتك في الحفاظ على مجتمعنا آمنًا.');
      setPostToReport(null);
    }
  };

  // User Navigation & Follow
  const handleUserClick = (user: User) => {
    if (user.id === currentUser.id) {
      setView('profile');
      setViewedUser(null);
    } else {
      setViewedUser(user);
      setView('user_profile');
    }
    window.scrollTo(0, 0);
  };

  const handleFollowClick = () => setShowFollowModal(true);
  const handleUnfollowClick = () => setShowUnfollowModal(true);

  const confirmFollow = () => {
    if (viewedUser) {
      setFollowedUsers([...followedUsers, viewedUser.id]);
      setCurrentUser(prev => ({ ...prev, following: prev.following + 1 }));
      setViewedUser(prev => prev ? ({ ...prev, followers: prev.followers + 1 }) : null);
      setShowFollowModal(false);
      showToast(`بدأت متابعة ${viewedUser.name}`);
    }
  };

  const confirmUnfollow = () => {
    if (viewedUser) {
      setFollowedUsers(followedUsers.filter(id => id !== viewedUser.id));
      setCurrentUser(prev => ({ ...prev, following: prev.following - 1 }));
      setViewedUser(prev => prev ? ({ ...prev, followers: prev.followers - 1 }) : null);
      setShowUnfollowModal(false);
      showToast(`ألغيت متابعة ${viewedUser.name}`);
    }
  };

  // Chat Functions
  const handleOpenChat = (user: User) => {
    setActiveChatUser(user);
    setView('messages');
    window.scrollTo(0, 0);
  };

  const handleSendMessage = (text: string) => {
    if (!activeChatUser) return;
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      receiverId: activeChatUser.id,
      content: text,
      timestamp: Date.now()
    };
    setMessages([...messages, newMessage]);
  };

  // Profile Editing
  const handleEditProfileClick = () => {
    setEditFormData({ ...currentUser });
    setShowEditProfileModal(true);
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditFormData(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const saveProfileChanges = () => {
    if (editFormData) {
      const updatedUser = { ...currentUser, ...editFormData } as User;
      setCurrentUser(updatedUser);
      setPosts(posts.map(post => 
        post.user.id === currentUser.id ? { ...post, user: updatedUser } : post
      ));
      setShowEditProfileModal(false);
      showToast('تم تحديث الملف الشخصي بنجاح');
    }
  };

  // Notifications
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications && unreadNotificationsCount > 0) {
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    }
  };
  
  const toggleNotificationPreference = (key: 'likes' | 'comments' | 'follows') => {
    setCurrentUser(prev => ({
      ...prev,
      notificationPreferences: {
        ...prev.notificationPreferences!,
        [key]: !prev.notificationPreferences![key]
      }
    }));
  };
  
  const togglePrivacySetting = (key: 'isPrivate' | 'showActivityStatus') => {
    setCurrentUser(prev => ({
      ...prev,
      privacySettings: {
        ...prev.privacySettings!,
        [key]: !prev.privacySettings![key]
      }
    }));
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    // Fake password change logic
    setPasswordForm({ current: '', new: '', confirm: '' });
    showToast('تم تغيير كلمة المرور بنجاح');
    setSettingsView('main');
  };

  // Side Menu & Settings Navigation
  const handleLogoutClick = () => {
    setIsSideMenuOpen(false);
    setShowLogoutModal(true);
  };
  
  const confirmLogout = () => {
    setShowLogoutModal(false);
    showToast('تم تسجيل الخروج بنجاح');
    // Simulate logout
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const handleSettings = () => {
    setIsSideMenuOpen(false);
    setView('settings');
    setSettingsView('main');
  };

  // Filter Logic
  const displayPosts = posts.filter(post => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    if (searchFilter === 'content') return post.content?.toLowerCase().includes(query);
    if (searchFilter === 'author') return post.user.name.toLowerCase().includes(query);
    if (searchFilter === 'date') {
      const dateStr = new Date(post.timestamp).toLocaleDateString('ar-EG');
      return dateStr.includes(query);
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-100 pb-20 md:pb-0 font-sans text-right">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm sticky top-0 z-30 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-shrink-0">
            <h1 className="text-2xl font-bold text-blue-600 tracking-tight">Meydan</h1>
          </div>
          
          <div className="flex-1 max-w-md relative flex items-center gap-2">
            <div className="relative flex-1">
              <input 
                type="text" 
                placeholder={
                  searchFilter === 'author' ? "بحث عن كاتب..." : 
                  searchFilter === 'date' ? "بحث بالتاريخ..." : "بحث..."
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-100 border-transparent focus:bg-white focus:border-blue-500 focus:ring-0 rounded-full px-4 py-2 pl-10 pr-10 text-sm transition-colors outline-none"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <div className="absolute right-1 top-1/2 -translate-y-1/2">
                <button 
                  onClick={() => setShowFilterMenu(!showFilterMenu)}
                  className="p-1.5 hover:bg-gray-200 rounded-full text-gray-500 transition-colors"
                >
                  <Filter size={16} />
                </button>
                {showFilterMenu && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowFilterMenu(false)} />
                    <div className="absolute top-full right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-20">
                      <button 
                        onClick={() => { setSearchFilter('content'); setShowFilterMenu(false); }}
                        className={`w-full text-right px-4 py-2 text-sm hover:bg-gray-50 ${searchFilter === 'content' ? 'text-blue-600 font-bold' : 'text-gray-700'}`}
                      >
                        المحتوى
                      </button>
                      <button 
                        onClick={() => { setSearchFilter('author'); setShowFilterMenu(false); }}
                        className={`w-full text-right px-4 py-2 text-sm hover:bg-gray-50 ${searchFilter === 'author' ? 'text-blue-600 font-bold' : 'text-gray-700'}`}
                      >
                        الكاتب
                      </button>
                      <button 
                        onClick={() => { setSearchFilter('date'); setShowFilterMenu(false); }}
                        className={`w-full text-right px-4 py-2 text-sm hover:bg-gray-50 ${searchFilter === 'date' ? 'text-blue-600 font-bold' : 'text-gray-700'}`}
                      >
                        التاريخ
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <div className="relative">
              <button 
                onClick={toggleNotifications}
                className="relative p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors"
              >
                <Bell size={24} />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs flex items-center justify-center rounded-full border-2 border-white">
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowNotifications(false)} />
                  <div className="absolute left-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-20 animate-in fade-in zoom-in-95">
                    <div className="p-3 border-b border-gray-50 flex justify-between items-center">
                      <h3 className="font-bold text-gray-900">الإشعارات</h3>
                      <span className="text-xs text-gray-500">{unreadNotificationsCount} جديد</span>
                    </div>
                    <div className="max-h-[300px] overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center text-gray-400">لا توجد إشعارات جديدة</div>
                      ) : (
                        notifications.map(notification => (
                          <div key={notification.id} className={`p-3 flex gap-3 hover:bg-gray-50 transition-colors ${!notification.read ? 'bg-blue-50/50' : ''}`}>
                            <div className="relative">
                              <img src={notification.user.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                              <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-white text-[10px] ${
                                notification.type === 'like' ? 'bg-red-500' : 
                                notification.type === 'comment' ? 'bg-blue-500' : 'bg-green-500'
                              }`}>
                                {notification.type === 'like' ? <Heart size={10} fill="white" /> : 
                                 notification.type === 'comment' ? <MessageCircle size={10} /> : <UserIcon size={10} />}
                              </div>
                            </div>
                            <div className="flex-1">
                              <p className="text-sm text-gray-800">
                                <span className="font-bold">{notification.user.name}</span>
                                {notification.type === 'like' && ' أعجب بمنشورك'}
                                {notification.type === 'comment' && ' علق على منشورك'}
                                {notification.type === 'follow' && ' بدأ بمتابعتك'}
                              </p>
                              {notification.content && (
                                <p className="text-xs text-gray-500 mt-1 line-clamp-1">"{notification.content}"</p>
                              )}
                              <span className="text-[10px] text-gray-400 block mt-1">{getTimeAgo(notification.timestamp)}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="p-2 border-t border-gray-50 text-center">
                      <button 
                        onClick={() => {
                          handleSettings();
                          setSettingsView('notifications');
                          setShowNotifications(false);
                        }}
                        className="text-xs text-blue-600 hover:underline"
                      >
                        إعدادات الإشعارات
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
            
            <button 
              onClick={() => setView('messages')}
              className="hidden md:flex relative p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors"
            >
              <MessageSquare size={24} />
            </button>

            <button 
              onClick={() => setIsSideMenuOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* Side Menu (Drawer) */}
      {isSideMenuOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40 transition-opacity" onClick={() => setIsSideMenuOpen(false)} />
          <div className="fixed top-0 left-0 h-full w-72 bg-white shadow-2xl z-50 overflow-y-auto transition-transform animate-in slide-in-from-left duration-300">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-bold text-xl text-gray-800">القائمة</h2>
              <button onClick={() => setIsSideMenuOpen(false)} className="p-1 hover:bg-gray-100 rounded-full">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6" onClick={() => { setIsSideMenuOpen(false); setView('profile'); }}>
                <img src={currentUser.avatar} alt={currentUser.name} className="w-14 h-14 rounded-full object-cover border-2 border-blue-100" />
                <div>
                  <h3 className="font-bold text-lg">{currentUser.name}</h3>
                  <p className="text-sm text-gray-500">@{currentUser.username}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <button 
                  onClick={() => { setIsSideMenuOpen(false); setView('profile'); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  <UserIcon size={20} />
                  <span>الملف الشخصي</span>
                </button>
                <button 
                  onClick={handleSettings}
                  className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  <Settings size={20} />
                  <span>الإعدادات والخصوصية</span>
                </button>
                <button 
                  className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  <HelpCircle size={20} />
                  <span>المساعدة والدعم</span>
                </button>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-100">
                <button 
                  onClick={handleLogoutClick}
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <LogOut size={20} />
                  <span>تسجيل الخروج</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      <main className="max-w-2xl mx-auto py-6 px-4">
        {/* Views Logic */}
        {view === 'home' && (
          <>
            <CreatePost 
              currentUserAvatar={currentUser.avatar}
              onPostCreate={handleCreatePost}
            />
            
            {displayPosts.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                لا توجد منشورات تطابق بحثك.
              </div>
            ) : (
              displayPosts.map(post => (
                <PostCard 
                  key={post.id} 
                  post={post}
                  currentUserAvatar={currentUser.avatar}
                  currentUserId={currentUser.id}
                  onLike={handleLike}
                  onComment={handleComment}
                  onShare={handleShare}
                  onDelete={handleDeleteClick}
                  onEdit={handleEditPost}
                  onRepost={handleRepost}
                  onUserClick={handleUserClick}
                  onBlock={handleBlockClick}
                  onReport={handleReportClick}
                />
              ))
            )}
          </>
        )}

        {view === 'profile' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6 animate-fade-in">
            <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600 relative">
               <button 
                 onClick={handleEditProfileClick}
                 className="absolute top-4 left-4 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full backdrop-blur-sm transition-colors"
               >
                 <Settings size={20} />
               </button>
            </div>
            <div className="px-6 pb-6">
              <div className="relative flex justify-between items-end -mt-12 mb-4">
                <img 
                  src={currentUser.avatar} 
                  alt={currentUser.name} 
                  className="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover bg-white"
                />
                <button 
                  onClick={handleEditProfileClick}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium text-sm transition-colors"
                >
                  تعديل الملف
                </button>
              </div>
              
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-gray-900">{currentUser.name}</h2>
                <p className="text-gray-500 text-sm">@{currentUser.username}</p>
              </div>
              
              {currentUser.bio && (
                <p className="text-gray-700 mb-4 leading-relaxed">{currentUser.bio}</p>
              )}

              <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6">
                {currentUser.job && (
                  <div className="flex items-center gap-1">
                    <Briefcase size={16} className="text-gray-400" />
                    <span>{currentUser.job}</span>
                  </div>
                )}
                {currentUser.qualification && (
                  <div className="flex items-center gap-1">
                    <GraduationCap size={16} className="text-gray-400" />
                    <span>{currentUser.qualification}</span>
                  </div>
                )}
                {currentUser.country && (
                  <div className="flex items-center gap-1">
                    <MapPin size={16} className="text-gray-400" />
                    <span>{currentUser.country}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-6 border-t border-gray-100 pt-4">
                <div className="text-center cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                  <span className="block font-bold text-gray-900 text-lg">{posts.filter(p => p.user.id === currentUser.id).length}</span>
                  <span className="text-xs text-gray-500">منشور</span>
                </div>
                <div className="text-center cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                  <span className="block font-bold text-gray-900 text-lg">{currentUser.followers}</span>
                  <span className="text-xs text-gray-500">متابع</span>
                </div>
                <div className="text-center cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                  <span className="block font-bold text-gray-900 text-lg">{currentUser.following}</span>
                  <span className="text-xs text-gray-500">يتابع</span>
                </div>
              </div>
            </div>
            
            {/* Create Post inside Profile */}
            <div className="px-6 pb-6 border-t border-gray-100 bg-gray-50/50 pt-6">
               <h3 className="font-bold text-gray-800 mb-4">إنشاء منشور جديد</h3>
               <CreatePost 
                 currentUserAvatar={currentUser.avatar}
                 onPostCreate={handleCreatePost}
               />
            </div>

            {/* User's Posts */}
            <div className="bg-gray-50 px-4 py-6 border-t border-gray-200">
               <h3 className="font-bold text-gray-800 mb-4 px-2">منشوراتك</h3>
               {posts.filter(p => p.user.id === currentUser.id).length === 0 ? (
                 <div className="text-center py-8 text-gray-500 bg-white rounded-xl border border-gray-100">
                    لا توجد منشورات بعد
                 </div>
               ) : (
                 posts
                   .filter(p => p.user.id === currentUser.id)
                   .map(post => (
                     <PostCard 
                        key={post.id} 
                        post={post}
                        currentUserAvatar={currentUser.avatar}
                        currentUserId={currentUser.id}
                        onLike={handleLike}
                        onComment={handleComment}
                        onShare={handleShare}
                        onDelete={handleDeleteClick}
                        onEdit={handleEditPost}
                        onRepost={handleRepost}
                        onUserClick={handleUserClick}
                        onBlock={handleBlockClick}
                        onReport={handleReportClick}
                     />
                   ))
               )}
            </div>
          </div>
        )}

        {view === 'user_profile' && viewedUser && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6 animate-fade-in">
             <div className="h-32 bg-gradient-to-r from-purple-500 to-pink-600 relative">
               <button 
                 onClick={() => setView('home')}
                 className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full backdrop-blur-sm transition-colors"
               >
                 <Home size={20} />
               </button>
             </div>
             <div className="px-6 pb-6">
              <div className="relative flex justify-between items-end -mt-12 mb-4">
                <img 
                  src={viewedUser.avatar} 
                  alt={viewedUser.name} 
                  className="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover bg-white"
                />
                <div className="flex gap-2">
                   <button 
                     onClick={() => handleOpenChat(viewedUser)}
                     className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium text-sm transition-colors flex items-center gap-2"
                   >
                     <MessageCircle size={16} />
                     مراسلة
                   </button>
                   
                   {isViewedUserFollowed ? (
                      <button 
                        onClick={handleUnfollowClick}
                        className="px-4 py-2 bg-gray-100 hover:bg-red-50 text-gray-700 hover:text-red-600 rounded-lg font-medium text-sm transition-colors flex items-center gap-2 group"
                      >
                        <span className="group-hover:hidden flex items-center gap-2"><Check size={16} /> تتابعه</span>
                        <span className="hidden group-hover:flex items-center gap-2"><UserMinus size={16} /> إلغاء</span>
                      </button>
                   ) : (
                      <button 
                        onClick={handleFollowClick}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors flex items-center gap-2 shadow-sm"
                      >
                        <UserPlus size={16} />
                        متابعة
                      </button>
                   )}
                </div>
              </div>
              
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-gray-900">{viewedUser.name}</h2>
                <p className="text-gray-500 text-sm">@{viewedUser.username || 'user'}</p>
              </div>
              
              {viewedUser.bio && (
                <p className="text-gray-700 mb-4 leading-relaxed">{viewedUser.bio}</p>
              )}

              <div className="flex items-center gap-6 border-t border-gray-100 pt-4">
                 <div className="text-center p-2">
                  <span className="block font-bold text-gray-900 text-lg">{posts.filter(p => p.user.id === viewedUser.id).length}</span>
                  <span className="text-xs text-gray-500">منشور</span>
                </div>
                <div className="text-center p-2">
                  <span className="block font-bold text-gray-900 text-lg">{viewedUser.followers}</span>
                  <span className="text-xs text-gray-500">متابع</span>
                </div>
                <div className="text-center p-2">
                  <span className="block font-bold text-gray-900 text-lg">{viewedUser.following}</span>
                  <span className="text-xs text-gray-500">يتابع</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-4 py-6 border-t border-gray-200">
               <h3 className="font-bold text-gray-800 mb-4 px-2">المنشورات</h3>
               {posts.filter(p => p.user.id === viewedUser.id).length === 0 ? (
                 <div className="text-center py-8 text-gray-500 bg-white rounded-xl border border-gray-100">
                    لا توجد منشورات لهذا المستخدم
                 </div>
               ) : (
                 posts
                   .filter(p => p.user.id === viewedUser.id)
                   .map(post => (
                     <PostCard 
                        key={post.id} 
                        post={post}
                        currentUserAvatar={currentUser.avatar}
                        currentUserId={currentUser.id}
                        onLike={handleLike}
                        onComment={handleComment}
                        onShare={handleShare}
                        onDelete={handleDeleteClick}
                        onEdit={handleEditPost}
                        onRepost={handleRepost}
                        onUserClick={handleUserClick}
                        onBlock={handleBlockClick}
                        onReport={handleReportClick}
                     />
                   ))
               )}
            </div>
          </div>
        )}
        
        {view === 'messages' && (
          activeChatUser ? (
            <ChatWindow 
              currentUser={currentUser}
              otherUser={activeChatUser}
              messages={messages.filter(m => 
                (m.senderId === currentUser.id && m.receiverId === activeChatUser.id) ||
                (m.senderId === activeChatUser.id && m.receiverId === currentUser.id)
              )}
              onSendMessage={handleSendMessage}
              onBack={() => setActiveChatUser(null)}
            />
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 min-h-[400px] animate-fade-in">
               <div className="p-4 border-b border-gray-100">
                 <h2 className="font-bold text-lg">الرسائل</h2>
               </div>
               <div className="divide-y divide-gray-50">
                 {/* List of recent chats - mocked for now with just one entry if exists */}
                 {/* In a real app, you'd filter unique users from messages */}
                 <div 
                   onClick={() => handleOpenChat(INITIAL_POSTS[0].user)}
                   className="p-4 hover:bg-gray-50 cursor-pointer flex items-center gap-3 transition-colors"
                 >
                    <img src={INITIAL_POSTS[0].user.avatar} alt="" className="w-12 h-12 rounded-full object-cover" />
                    <div className="flex-1">
                       <div className="flex justify-between items-center mb-1">
                          <h3 className="font-bold text-gray-900">{INITIAL_POSTS[0].user.name}</h3>
                          <span className="text-xs text-gray-400">منذ يوم</span>
                       </div>
                       <p className="text-sm text-gray-500 line-clamp-1">انقر لبدء المحادثة...</p>
                    </div>
                    <ChevronLeft size={16} className="text-gray-300" />
                 </div>
               </div>
            </div>
          )
        )}

        {view === 'settings' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in min-h-[500px]">
            {settingsView === 'main' && (
              <>
                <div className="p-6 border-b border-gray-100 flex items-center gap-3">
                  <Settings className="text-blue-600" />
                  <h2 className="font-bold text-xl">الإعدادات</h2>
                </div>
                <div className="divide-y divide-gray-50">
                  <button onClick={() => setSettingsView('account')} className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors text-gray-700">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 p-2 rounded-lg text-blue-600"><UserIcon size={20} /></div>
                      <div className="text-right">
                        <span className="block font-bold">معلومات الحساب</span>
                        <span className="text-xs text-gray-500">تحديث بياناتك الشخصية</span>
                      </div>
                    </div>
                    <ChevronLeft size={18} className="text-gray-400" />
                  </button>
                  
                  <button onClick={() => setSettingsView('security')} className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors text-gray-700">
                    <div className="flex items-center gap-3">
                      <div className="bg-green-100 p-2 rounded-lg text-green-600"><Shield size={20} /></div>
                      <div className="text-right">
                        <span className="block font-bold">الأمان وكلمة المرور</span>
                        <span className="text-xs text-gray-500">حماية حسابك</span>
                      </div>
                    </div>
                    <ChevronLeft size={18} className="text-gray-400" />
                  </button>

                  <button onClick={() => setSettingsView('privacy')} className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors text-gray-700">
                    <div className="flex items-center gap-3">
                      <div className="bg-purple-100 p-2 rounded-lg text-purple-600"><Lock size={20} /></div>
                      <div className="text-right">
                        <span className="block font-bold">الخصوصية</span>
                        <span className="text-xs text-gray-500">من يمكنه رؤية منشوراتك</span>
                      </div>
                    </div>
                    <ChevronLeft size={18} className="text-gray-400" />
                  </button>

                  <button onClick={() => setSettingsView('notifications')} className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors text-gray-700">
                    <div className="flex items-center gap-3">
                      <div className="bg-yellow-100 p-2 rounded-lg text-yellow-600"><Bell size={20} /></div>
                      <div className="text-right">
                        <span className="block font-bold">الإشعارات</span>
                        <span className="text-xs text-gray-500">تخصيص التنبيهات</span>
                      </div>
                    </div>
                    <ChevronLeft size={18} className="text-gray-400" />
                  </button>
                </div>
              </>
            )}

            {settingsView === 'account' && (
              <>
                 <div className="p-4 border-b border-gray-100 flex items-center gap-3 bg-gray-50">
                  <button onClick={() => setSettingsView('main')} className="p-1 hover:bg-gray-200 rounded-full"><ArrowRight size={20} /></button>
                  <h2 className="font-bold text-lg">معلومات الحساب</h2>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-center mb-6">
                    <div className="relative">
                       <img src={currentUser.avatar} alt="" className="w-20 h-20 rounded-full object-cover border-4 border-gray-100" />
                       <button onClick={handleEditProfileClick} className="absolute bottom-0 right-0 bg-blue-600 text-white p-1.5 rounded-full hover:bg-blue-700"><Settings size={12} /></button>
                    </div>
                  </div>
                  <div className="grid gap-4">
                    <div className="bg-gray-50 p-3 rounded-lg flex items-center justify-between">
                      <span className="text-gray-500 text-sm">الاسم الكامل</span>
                      <span className="font-medium text-gray-900">{currentUser.name}</span>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg flex items-center justify-between">
                      <span className="text-gray-500 text-sm">اسم المستخدم</span>
                      <span className="font-medium text-gray-900">@{currentUser.username}</span>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg flex items-center justify-between">
                      <span className="text-gray-500 text-sm">البريد الإلكتروني</span>
                      <span className="font-medium text-gray-900">{currentUser.email}</span>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg flex items-center justify-between">
                      <span className="text-gray-500 text-sm">رقم الهاتف</span>
                      <span className="font-medium text-gray-900">{currentUser.phone}</span>
                    </div>
                    <button onClick={handleEditProfileClick} className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium transition-colors mt-4">
                      تعديل البيانات
                    </button>
                  </div>
                </div>
              </>
            )}

            {settingsView === 'security' && (
              <>
                <div className="p-4 border-b border-gray-100 flex items-center gap-3 bg-gray-50">
                  <button onClick={() => setSettingsView('main')} className="p-1 hover:bg-gray-200 rounded-full"><ArrowRight size={20} /></button>
                  <h2 className="font-bold text-lg">الأمان وكلمة المرور</h2>
                </div>
                <form onSubmit={handleChangePassword} className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">كلمة المرور الحالية</label>
                    <div className="relative">
                      <input 
                        type={showPassword ? "text" : "password"}
                        value={passwordForm.current}
                        onChange={e => setPasswordForm({...passwordForm, current: e.target.value})}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500"
                        placeholder="أدخل كلمة المرور الحالية"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">كلمة المرور الجديدة</label>
                    <input 
                      type={showPassword ? "text" : "password"}
                      value={passwordForm.new}
                      onChange={e => setPasswordForm({...passwordForm, new: e.target.value})}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500"
                      placeholder="أدخل كلمة المرور الجديدة"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">تأكيد كلمة المرور</label>
                    <input 
                      type={showPassword ? "text" : "password"}
                      value={passwordForm.confirm}
                      onChange={e => setPasswordForm({...passwordForm, confirm: e.target.value})}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500"
                      placeholder="أعد كتابة كلمة المرور"
                    />
                  </div>
                  
                  <div className="flex items-center gap-2 mt-2">
                    <input 
                      type="checkbox" 
                      id="showPass" 
                      checked={showPassword} 
                      onChange={() => setShowPassword(!showPassword)}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="showPass" className="text-sm text-gray-600">إظهار كلمة المرور</label>
                  </div>

                  <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium transition-colors mt-4">
                    حفظ التغييرات
                  </button>
                </form>
              </>
            )}

            {settingsView === 'privacy' && (
              <>
                <div className="p-4 border-b border-gray-100 flex items-center gap-3 bg-gray-50">
                  <button onClick={() => setSettingsView('main')} className="p-1 hover:bg-gray-200 rounded-full"><ArrowRight size={20} /></button>
                  <h2 className="font-bold text-lg">الخصوصية</h2>
                </div>
                <div className="p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-gray-900">حساب خاص</h3>
                      <p className="text-sm text-gray-500">لن يتمكن أحد غير متابعيك من رؤية منشوراتك</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={currentUser.privacySettings?.isPrivate}
                        onChange={() => togglePrivacySetting('isPrivate')}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-gray-900">حالة النشاط</h3>
                      <p className="text-sm text-gray-500">السماح للآخرين بمعرفة متى تكون متصلاً</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={currentUser.privacySettings?.showActivityStatus}
                        onChange={() => togglePrivacySetting('showActivityStatus')}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </>
            )}

            {settingsView === 'notifications' && (
              <>
                <div className="p-4 border-b border-gray-100 flex items-center gap-3 bg-gray-50">
                  <button onClick={() => setSettingsView('main')} className="p-1 hover:bg-gray-200 rounded-full"><ArrowRight size={20} /></button>
                  <h2 className="font-bold text-lg">إعدادات الإشعارات</h2>
                </div>
                <div className="p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-gray-900">الإعجابات</h3>
                      <p className="text-sm text-gray-500">تلقي إشعار عندما يعجب شخص بمنشورك</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={currentUser.notificationPreferences?.likes}
                        onChange={() => toggleNotificationPreference('likes')}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-gray-900">التعليقات</h3>
                      <p className="text-sm text-gray-500">تلقي إشعار عندما يعلق شخص على منشورك</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={currentUser.notificationPreferences?.comments}
                        onChange={() => toggleNotificationPreference('comments')}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-gray-900">المتابعات</h3>
                      <p className="text-sm text-gray-500">تلقي إشعار عندما يتابعك شخص جديد</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={currentUser.notificationPreferences?.follows}
                        onChange={() => toggleNotificationPreference('follows')}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

      </main>

      {/* Bottom Mobile Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 flex justify-between items-center md:hidden z-30 pb-5">
        <button 
          onClick={() => setView('home')}
          className={`flex flex-col items-center gap-1 ${view === 'home' ? 'text-blue-600' : 'text-gray-400'}`}
        >
          <Home size={24} strokeWidth={view === 'home' ? 2.5 : 2} />
        </button>
        <button 
           onClick={() => setView('messages')}
           className={`flex flex-col items-center gap-1 ${view === 'messages' ? 'text-blue-600' : 'text-gray-400'}`}
        >
           <MessageSquare size={24} strokeWidth={view === 'messages' ? 2.5 : 2} />
        </button>
        <button 
          onClick={() => setView('profile')}
          className={`flex flex-col items-center gap-1 ${view === 'profile' ? 'text-blue-600' : 'text-gray-400'}`}
        >
          <div className={`rounded-full border-2 p-0.5 ${view === 'profile' ? 'border-blue-600' : 'border-transparent'}`}>
            <img src={currentUser.avatar} alt="Profile" className="w-6 h-6 rounded-full object-cover" />
          </div>
        </button>
      </div>

      {/* Modals */}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in flex items-center gap-2 text-sm">
          <Check size={16} className="text-green-400" />
          {toastMessage}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {postToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl transform scale-100 transition-all">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-2">
                <AlertTriangle className="text-red-600" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900">حذف المنشور؟</h3>
              <p className="text-gray-500">هل أنت متأكد أنك تريد حذف هذا المنشور؟ لا يمكن التراجع عن هذا الإجراء.</p>
              <div className="flex gap-3 w-full mt-4">
                <button 
                  onClick={() => setPostToDelete(null)}
                  className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
                >
                  إلغاء
                </button>
                <button 
                  onClick={confirmDelete}
                  className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors"
                >
                  نعم، احذف
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Follow Confirmation Modal */}
      {showFollowModal && viewedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl text-center">
            <img src={viewedUser.avatar} alt={viewedUser.name} className="w-16 h-16 rounded-full mx-auto mb-4 object-cover border-2 border-gray-100" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">متابعة {viewedUser.name}؟</h3>
            <p className="text-gray-500 mb-6">ستظهر منشوراته في صفحتك الرئيسية.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowFollowModal(false)} className="flex-1 py-2.5 bg-gray-100 rounded-xl font-medium hover:bg-gray-200">إلغاء</button>
              <button onClick={confirmFollow} className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700">تأكيد</button>
            </div>
          </div>
        </div>
      )}

      {/* Unfollow Confirmation Modal */}
      {showUnfollowModal && viewedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-600">
               <UserMinus size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">إلغاء متابعة {viewedUser.name}؟</h3>
            <p className="text-gray-500 mb-6">لن تظهر منشوراته في صفحتك الرئيسية بعد الآن.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowUnfollowModal(false)} className="flex-1 py-2.5 bg-gray-100 rounded-xl font-medium hover:bg-gray-200">تراجع</button>
              <button onClick={confirmUnfollow} className="flex-1 py-2.5 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700">إلغاء المتابعة</button>
            </div>
          </div>
        </div>
      )}

      {/* Block User Confirmation Modal */}
      {userToBlock && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl text-center">
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
               <Ban size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">حظر {userToBlock.name}؟</h3>
            <p className="text-gray-500 mb-6">لن يتمكن هذا المستخدم من رؤية منشوراتك أو التفاعل معك، وسيتم إخفاء منشوراته من صفحتك.</p>
            <div className="flex gap-3">
              <button onClick={() => setUserToBlock(null)} className="flex-1 py-2.5 bg-gray-100 rounded-xl font-medium hover:bg-gray-200">إلغاء</button>
              <button onClick={confirmBlock} className="flex-1 py-2.5 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700">حظر المستخدم</button>
            </div>
          </div>
        </div>
      )}

      {/* Report Post Confirmation Modal */}
      {postToReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl text-center">
            <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4 text-orange-500">
               <Flag size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">إبلاغ عن منشور؟</h3>
            <p className="text-gray-500 mb-6">هل تعتقد أن هذا المنشور ينتهك معايير مجتمعنا؟ سيتم مراجعته من قبل المشرفين.</p>
            <div className="flex gap-3">
              <button onClick={() => setPostToReport(null)} className="flex-1 py-2.5 bg-gray-100 rounded-xl font-medium hover:bg-gray-200">إلغاء</button>
              <button onClick={confirmReport} className="flex-1 py-2.5 bg-orange-600 text-white rounded-xl font-medium hover:bg-orange-700">إبلاغ</button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl text-center">
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
               <LogOut size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">تسجيل الخروج</h3>
            <p className="text-gray-500 mb-6">هل أنت متأكد أنك تريد تسجيل الخروج من حسابك؟</p>
            <div className="flex gap-3">
              <button onClick={() => setShowLogoutModal(false)} className="flex-1 py-2.5 bg-gray-100 rounded-xl font-medium hover:bg-gray-200">إلغاء</button>
              <button onClick={confirmLogout} className="flex-1 py-2.5 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700">تسجيل الخروج</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditProfileModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h3 className="font-bold text-lg">تعديل الملف الشخصي</h3>
              <button onClick={() => setShowEditProfileModal(false)} className="p-1 hover:bg-gray-100 rounded-full"><X size={20} /></button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex justify-center mb-4">
                <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  <img 
                    src={editFormData.avatar} 
                    alt="Avatar" 
                    className="w-24 h-24 rounded-full object-cover border-2 border-gray-100 group-hover:opacity-80 transition-opacity" 
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="text-white drop-shadow-md" size={24} />
                  </div>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleProfileImageChange}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الاسم</label>
                <input 
                  type="text" 
                  value={editFormData.name || ''}
                  onChange={e => setEditFormData({...editFormData, name: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
                 <input 
                  type="email" 
                  value={editFormData.email || ''}
                  onChange={e => setEditFormData({...editFormData, email: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف</label>
                 <input 
                  type="text" 
                  value={editFormData.phone || ''}
                  onChange={e => setEditFormData({...editFormData, phone: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الدولة</label>
                  <input 
                    type="text" 
                    value={editFormData.country || ''}
                    onChange={e => setEditFormData({...editFormData, country: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الوظيفة</label>
                  <input 
                    type="text" 
                    value={editFormData.job || ''}
                    onChange={e => setEditFormData({...editFormData, job: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">المؤهل الدراسي</label>
                <input 
                  type="text" 
                  value={editFormData.qualification || ''}
                  onChange={e => setEditFormData({...editFormData, qualification: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">النبذة التعريفية</label>
                <textarea 
                  value={editFormData.bio || ''}
                  onChange={e => setEditFormData({...editFormData, bio: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  rows={3}
                />
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 flex justify-end gap-2 sticky bottom-0 bg-white">
               <button onClick={() => setShowEditProfileModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium">إلغاء</button>
               <button onClick={saveProfileChanges} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">حفظ التغييرات</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

function ArrowRight(props: any) {
  return <ChevronLeft {...props} className={`transform rotate-180 ${props.className || ''}`} />
}

export default App;
