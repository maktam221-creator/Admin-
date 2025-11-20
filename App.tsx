
import React, { useState, useRef, useEffect } from 'react';
import { PostCard } from './components/PostCard';
import { CreatePost } from './components/CreatePost';
import { Post, User } from './types';
import { 
  Bell, Menu, Home, User as UserIcon, AlertTriangle, Search, 
  UserPlus, UserMinus, Check, Heart, MessageCircle, Share2, 
  MapPin, Briefcase, GraduationCap, Camera, X 
} from 'lucide-react';

// Initial Mock Data for Current User
const INITIAL_USER: User = {
  id: 'curr_user_1',
  name: 'أحمد محمد',
  avatar: 'https://picsum.photos/id/64/200/200',
  username: 'ahmed_mo',
  bio: 'مطور واجهات أمامية شغوف بالتكنولوجيا والذكاء الاصطناعي.',
  country: 'مصر',
  gender: 'ذكر',
  job: 'مطور برمجيات',
  qualification: 'بكالوريوس علوم حاسب'
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
    user: { id: 'user_2', name: 'سارة علي', avatar: 'https://picsum.photos/id/65/200/200' },
    type: 'like',
    timestamp: Date.now() - 1000 * 60 * 15, // 15 mins ago
    read: false
  },
  {
    id: 'n2',
    user: { id: 'u3', name: 'خالد عمر', avatar: 'https://picsum.photos/id/91/200/200' },
    type: 'comment',
    content: 'منشور رائع ومفيد جداً!',
    timestamp: Date.now() - 1000 * 60 * 60 * 2, // 2 hours ago
    read: false
  },
  {
    id: 'n3',
    user: { id: 'u4', name: 'يوسف أحمد', avatar: 'https://picsum.photos/id/77/200/200' },
    type: 'follow',
    timestamp: Date.now() - 1000 * 60 * 60 * 5, // 5 hours ago
    read: true
  }
];

// Initial Mock Data for Posts
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
  // Main State
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USER);
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [view, setView] = useState<'home' | 'profile' | 'user_profile'>('home');
  const [viewedUser, setViewedUser] = useState<User | null>(null);
  
  // Interaction State
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // Notifications State
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Follow logic states
  const [followedUsers, setFollowedUsers] = useState<string[]>([]);
  const [showFollowModal, setShowFollowModal] = useState(false);
  const [showUnfollowModal, setShowUnfollowModal] = useState(false);

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
      setShowFollowModal(false);
      showToast(`بدأت متابعة ${viewedUser.name}`);
    }
  };

  const confirmUnfollow = () => {
    if (viewedUser) {
      setFollowedUsers(followedUsers.filter(id => id !== viewedUser.id));
      setShowUnfollowModal(false);
      showToast(`ألغيت متابعة ${viewedUser.name}`);
    }
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
      
      // Update posts by current user to reflect changes
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

  // View Filtering
  const postsForView = view === 'profile' 
    ? posts.filter(post => post.user.id === currentUser.id)
    : view === 'user_profile' && viewedUser
      ? posts.filter(post => post.user.id === viewedUser.id)
      : posts;

  const displayPosts = postsForView.filter(post => 
    post.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f3f4f6] pb-24 md:pb-0 relative">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center gap-3 md:gap-4">
          <div 
            className="flex items-center cursor-pointer shrink-0"
            onClick={() => setView('home')}
          >
            <h1 className="text-2xl font-extrabold text-blue-600 tracking-tight font-sans">Meydan</h1>
          </div>

          <div className="flex-1 relative max-w-md mx-1">
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="بحث..."
              className="w-full bg-gray-100 text-gray-800 text-sm rounded-full py-2 pr-10 pl-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
          </div>
          
          <div className="hidden md:flex items-center gap-2 shrink-0">
            <button 
              onClick={() => setView('home')}
              className={`p-2.5 rounded-xl transition-all ${
                view === 'home' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50'
              }`}
              title="الرئيسية"
            >
              <Home size={22} fill={view === 'home' ? "currentColor" : "none"} />
            </button>
            <button 
              onClick={() => setView('profile')}
              className={`p-2.5 rounded-xl transition-all ${
                view === 'profile' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50'
              }`}
              title="الملف الشخصي"
            >
              <UserIcon size={22} fill={view === 'profile' ? "currentColor" : "none"} />
            </button>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="relative">
              <button 
                onClick={toggleNotifications}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors relative ${
                  showNotifications ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Bell size={18} fill={showNotifications ? "currentColor" : "none"} />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-white rounded-full flex items-center justify-center"></span>
                )}
              </button>

              {showNotifications && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)}></div>
                  <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-[0_4px_20px_-5px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="p-3 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                      <h3 className="font-bold text-gray-800 text-sm">الإشعارات</h3>
                      {unreadNotificationsCount > 0 && (
                        <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                          {unreadNotificationsCount} جديد
                        </span>
                      )}
                    </div>
                    <div className="max-h-[360px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200">
                      {notifications.length > 0 ? (
                        notifications.map(notification => (
                          <div 
                            key={notification.id} 
                            className={`p-3 flex gap-3 hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-50 last:border-0 ${
                              !notification.read ? 'bg-blue-50/30' : ''
                            }`}
                          >
                            <div className="relative shrink-0">
                              <img 
                                src={notification.user.avatar} 
                                alt={notification.user.name}
                                className="w-10 h-10 rounded-full object-cover border border-gray-100" 
                              />
                              <div className={`absolute -bottom-1 -right-1 p-1 rounded-full border border-white flex items-center justify-center ${
                                notification.type === 'like' ? 'bg-red-100 text-red-500' :
                                notification.type === 'comment' ? 'bg-blue-100 text-blue-500' :
                                'bg-green-100 text-green-500'
                              }`}>
                                {notification.type === 'like' && <Heart size={10} fill="currentColor" />}
                                {notification.type === 'comment' && <MessageCircle size={10} fill="currentColor" />}
                                {notification.type === 'follow' && <UserPlus size={10} />}
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-gray-800 leading-snug">
                                <span className="font-bold ml-1">{notification.user.name}</span>
                                {notification.type === 'like' && 'أعجب بمنشورك.'}
                                {notification.type === 'comment' && 'علق على منشورك: "'}
                                {notification.type === 'follow' && 'بدأ بمتابعتك.'}
                                {notification.type === 'comment' && notification.content && (
                                  <span className="text-gray-500 truncate block font-normal mt-0.5 italic">
                                    {notification.content.length > 30 ? notification.content.substring(0, 30) + '...' : notification.content}"
                                  </span>
                                )}
                              </p>
                              <p className="text-[10px] text-gray-400 mt-1">{getTimeAgo(notification.timestamp)}</p>
                            </div>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 shrink-0"></div>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="p-8 text-center">
                          <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-300">
                            <Bell size={24} />
                          </div>
                          <p className="text-gray-400 text-sm">لا توجد إشعارات حالياً</p>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            <button className="md:hidden w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors">
              <Menu size={18} />
            </button>
            <button onClick={() => setView('profile')} className="hidden md:block">
              <img 
                src={currentUser.avatar} 
                alt="Profile" 
                className={`w-9 h-9 rounded-full border-2 shadow-sm transition-colors ${
                  view === 'profile' ? 'border-blue-500' : 'border-white'
                }`}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        
        {/* Current User Profile View */}
        {view === 'profile' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6 animate-fade-in">
            <div className="h-32 bg-gradient-to-r from-blue-600 to-blue-400"></div>
            <div className="px-6 pb-6">
              <div className="relative flex justify-between items-end -mt-12 mb-6">
                <div className="relative group">
                  <img 
                    src={currentUser.avatar} 
                    alt={currentUser.name}
                    className="w-24 h-24 rounded-full border-4 border-white bg-white object-cover"
                  />
                  <button 
                    onClick={handleEditProfileClick}
                    className="absolute bottom-0 right-0 p-1.5 bg-blue-600 text-white rounded-full border-2 border-white shadow-sm hover:bg-blue-700 transition-colors"
                  >
                    <Camera size={14} />
                  </button>
                </div>
                <button 
                  onClick={handleEditProfileClick}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium text-sm transition-colors"
                >
                  تعديل الملف الشخصي
                </button>
              </div>
              
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{currentUser.name}</h2>
                <p className="text-gray-500">@{currentUser.username || 'user'} • {currentUser.job || 'عضو في ميدان'}</p>
                
                {currentUser.bio && (
                  <p className="mt-3 text-gray-700 text-sm leading-relaxed">{currentUser.bio}</p>
                )}

                <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-600">
                  {currentUser.country && (
                    <div className="flex items-center gap-1">
                      <MapPin size={16} className="text-gray-400" />
                      <span>{currentUser.country}</span>
                    </div>
                  )}
                  {currentUser.qualification && (
                    <div className="flex items-center gap-1">
                      <GraduationCap size={16} className="text-gray-400" />
                      <span>{currentUser.qualification}</span>
                    </div>
                  )}
                  {currentUser.gender && (
                    <div className="flex items-center gap-1">
                      <UserIcon size={16} className="text-gray-400" />
                      <span>{currentUser.gender}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-6 mt-6 py-4 border-t border-gray-50">
                <div className="text-center">
                  <div className="font-bold text-gray-900">{posts.filter(p => p.user.id === currentUser.id).length}</div>
                  <div className="text-xs text-gray-500">منشور</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-gray-900">{1200 + followedUsers.length}</div>
                  <div className="text-xs text-gray-500">متابِع</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-gray-900">{234 + followedUsers.length}</div>
                  <div className="text-xs text-gray-500">متابَع</div>
                </div>
              </div>
            </div>
            <div className="px-6 pb-4">
                <h3 className="font-bold text-gray-800 text-lg border-b pb-2">منشوراتي</h3>
            </div>
          </div>
        )}

        {/* Other User Profile View */}
        {view === 'user_profile' && viewedUser && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6 animate-fade-in">
            <div className="h-32 bg-gradient-to-r from-purple-600 to-blue-600"></div>
            <div className="px-6 pb-6">
              <div className="relative flex justify-between items-end -mt-12 mb-6">
                <div className="relative">
                  <img 
                    src={viewedUser.avatar} 
                    alt={viewedUser.name}
                    className="w-24 h-24 rounded-full border-4 border-white bg-white object-cover"
                  />
                </div>
                <button 
                  onClick={isViewedUserFollowed ? handleUnfollowClick : handleFollowClick}
                  className={`px-6 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${
                    isViewedUserFollowed 
                      ? 'bg-gray-100 text-green-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 border border-transparent'
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                  }`}
                >
                  {isViewedUserFollowed ? (
                    <>
                      <Check size={16} />
                      <span>تتابعه</span>
                    </>
                  ) : (
                    <>
                      <UserPlus size={16} />
                      متابعة
                    </>
                  )}
                </button>
              </div>
              
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{viewedUser.name}</h2>
                <p className="text-gray-500">@{viewedUser.id.split('_')[0]} • عضو في ميدان</p>
              </div>

              <div className="flex gap-6 mt-6 py-4 border-t border-gray-50">
                <div className="text-center">
                  <div className="font-bold text-gray-900">{posts.filter(p => p.user.id === viewedUser.id).length}</div>
                  <div className="text-xs text-gray-500">منشور</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-gray-900">56</div>
                  <div className="text-xs text-gray-500">متابِع</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-gray-900">112</div>
                  <div className="text-xs text-gray-500">متابَع</div>
                </div>
              </div>
            </div>
            <div className="px-6 pb-4">
                <h3 className="font-bold text-gray-800 text-lg border-b pb-2">منشورات {viewedUser.name}</h3>
            </div>
          </div>
        )}

        {view === 'home' && !searchQuery && (
          <>
            <div className="md:hidden mb-6">
              <h2 className="text-lg font-bold text-gray-800">مرحباً، {currentUser.name} 👋</h2>
              <p className="text-gray-500 text-sm">إليك آخر المستجدات من مجتمعك.</p>
            </div>
            <CreatePost 
              currentUserAvatar={currentUser.avatar}
              onPostCreate={handleCreatePost}
            />
          </>
        )}

        {searchQuery && (
           <div className="mb-4 flex items-center gap-2 text-gray-600 text-sm">
             <Search size={16} />
             <span>نتائج البحث عن: <strong>{searchQuery}</strong></span>
             {displayPosts.length === 0 && <span className="text-red-500">(لا توجد نتائج)</span>}
           </div>
        )}

        <div className="space-y-4">
          {displayPosts.map(post => (
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
              onUserClick={handleUserClick}
            />
          ))}
          
          {displayPosts.length === 0 && (
            <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
              <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-3">
                <Search size={24} />
              </div>
              <p className="text-gray-500">
                {searchQuery ? 'لم يتم العثور على منشورات مطابقة' : 'لا توجد منشورات لعرضها'}
              </p>
              {view !== 'home' && !searchQuery && (
                <button 
                  onClick={() => setView('home')} 
                  className="text-blue-600 text-sm font-medium mt-2 hover:underline"
                >
                  اذهب للرئيسية
                </button>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-2 flex items-center justify-around z-40 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <button 
          onClick={() => setView('home')}
          className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
            view === 'home' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <Home size={24} fill={view === 'home' ? "currentColor" : "none"} />
          <span className="text-[10px] font-bold">الرئيسية</span>
        </button>
        
        <div className="w-px h-8 bg-gray-100"></div>

        <button 
          onClick={() => setView('profile')}
          className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
            view === 'profile' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <UserIcon size={24} fill={view === 'profile' ? "currentColor" : "none"} />
          <span className="text-[10px] font-bold">حسابي</span>
        </button>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 md:bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-gray-900/90 backdrop-blur-sm text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-3 text-sm font-medium">
            <Check size={16} className="text-green-400" />
            {toastMessage}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {postToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">حذف المنشور؟</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                هل أنت متأكد من رغبتك في حذف هذا المنشور نهائياً؟ لا يمكن التراجع عن هذا الإجراء.
              </p>
            </div>
            <div className="flex border-t border-gray-100">
              <button 
                onClick={() => setPostToDelete(null)}
                className="flex-1 py-3.5 text-gray-600 font-medium hover:bg-gray-50 transition-colors text-sm"
              >
                إلغاء
              </button>
              <div className="w-px bg-gray-100"></div>
              <button 
                onClick={confirmDelete}
                className="flex-1 py-3.5 text-red-600 font-bold hover:bg-red-50 transition-colors text-sm"
              >
                نعم، حذف
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Follow Confirmation Modal */}
      {showFollowModal && viewedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                <UserPlus size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">متابعة {viewedUser.name}؟</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                هل تود متابعة هذا المستخدم لرؤية منشوراته في صفحتك الرئيسية؟
              </p>
            </div>
            <div className="flex border-t border-gray-100">
              <button 
                onClick={() => setShowFollowModal(false)}
                className="flex-1 py-3.5 text-gray-600 font-medium hover:bg-gray-50 transition-colors text-sm"
              >
                إلغاء
              </button>
              <div className="w-px bg-gray-100"></div>
              <button 
                onClick={confirmFollow}
                className="flex-1 py-3.5 text-blue-600 font-bold hover:bg-blue-50 transition-colors text-sm"
              >
                تأكيد المتابعة
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Unfollow Confirmation Modal */}
      {showUnfollowModal && viewedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
                <UserMinus size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">إلغاء متابعة {viewedUser.name}؟</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                هل أنت متأكد من رغبتك في إلغاء متابعة هذا المستخدم؟
              </p>
            </div>
            <div className="flex border-t border-gray-100">
              <button 
                onClick={() => setShowUnfollowModal(false)}
                className="flex-1 py-3.5 text-gray-600 font-medium hover:bg-gray-50 transition-colors text-sm"
              >
                تراجع
              </button>
              <div className="w-px bg-gray-100"></div>
              <button 
                onClick={confirmUnfollow}
                className="flex-1 py-3.5 text-red-600 font-bold hover:bg-red-50 transition-colors text-sm"
              >
                نعم، إلغاء المتابعة
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-gray-800 text-lg">تعديل الملف الشخصي</h3>
              <button 
                onClick={() => setShowEditProfileModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-200 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto scrollbar-thin">
              {/* Avatar Upload */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  <img 
                    src={editFormData.avatar || currentUser.avatar} 
                    alt="Avatar Preview" 
                    className="w-24 h-24 rounded-full object-cover border-4 border-gray-100"
                  />
                  <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="text-white" size={24} />
                  </div>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  className="hidden" 
                  accept="image/*"
                  onChange={handleProfileImageChange}
                />
                <p className="text-xs text-gray-500 mt-2">اضغط لتغيير الصورة</p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">الاسم</label>
                    <input 
                      type="text" 
                      value={editFormData.name || ''}
                      onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">اسم المستخدم (بدون @)</label>
                    <input 
                      type="text" 
                      value={editFormData.username || ''}
                      onChange={(e) => setEditFormData({...editFormData, username: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">الوظيفة</label>
                    <input 
                      type="text" 
                      value={editFormData.job || ''}
                      onChange={(e) => setEditFormData({...editFormData, job: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                      placeholder="مثال: مهندس برمجيات"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">الدولة</label>
                    <input 
                      type="text" 
                      value={editFormData.country || ''}
                      onChange={(e) => setEditFormData({...editFormData, country: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                      placeholder="مثال: مصر"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">المؤهل العلمي</label>
                    <input 
                      type="text" 
                      value={editFormData.qualification || ''}
                      onChange={(e) => setEditFormData({...editFormData, qualification: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">النوع</label>
                    <select 
                      value={editFormData.gender || ''}
                      onChange={(e) => setEditFormData({...editFormData, gender: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm bg-white"
                    >
                      <option value="">اختر...</option>
                      <option value="ذكر">ذكر</option>
                      <option value="أنثى">أنثى</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">نبذة تعريفية</label>
                  <textarea 
                    value={editFormData.bio || ''}
                    onChange={(e) => setEditFormData({...editFormData, bio: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm min-h-[80px] resize-none"
                    placeholder="اكتب شيئاً عن نفسك..."
                  />
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
              <button 
                onClick={() => setShowEditProfileModal(false)}
                className="px-5 py-2 text-gray-600 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors"
              >
                إلغاء
              </button>
              <button 
                onClick={saveProfileChanges}
                className="px-5 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-bold transition-colors shadow-sm"
              >
                حفظ التغييرات
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
