import React from 'react';
import { User, Message } from '../types';
import { Search, MessageSquarePlus } from 'lucide-react';

interface ChatListProps {
  currentUser: User;
  messages: Message[];
  users: User[]; // List of potential users to chat with (e.g., following)
  onSelectUser: (user: User) => void;
}

export const ChatList: React.FC<ChatListProps> = ({ currentUser, messages, users, onSelectUser }) => {
  // 1. Get unique user IDs interacted with
  const interactedUserIds = Array.from(new Set(
    messages
      .filter(m => m.senderId === currentUser.id || m.receiverId === currentUser.id)
      .map(m => m.senderId === currentUser.id ? m.receiverId : m.senderId)
  ));

  // 2. Get the actual User objects and their last message
  const activeChats = interactedUserIds.map(userId => {
    const user = users.find(u => u.id === userId);
    if (!user) return null;

    const userMessages = messages.filter(
      m => (m.senderId === currentUser.id && m.receiverId === userId) || 
           (m.senderId === userId && m.receiverId === currentUser.id)
    ).sort((a, b) => b.timestamp - a.timestamp);

    return {
      user,
      lastMessage: userMessages[0]
    };
  }).filter(Boolean).sort((a, b) => b!.lastMessage.timestamp - a!.lastMessage.timestamp);

  // 3. Get other users (suggested) who are NOT in active chats
  const suggestedUsers = users.filter(u => 
    u.id !== currentUser.id && !interactedUserIds.includes(u.id)
  );

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString('ar-EG', { hour: 'numeric', minute: 'numeric' });
    }
    return date.toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden min-h-[600px] animate-fade-in">
      <div className="p-4 border-b border-gray-100 bg-white sticky top-0 z-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">الرسائل</h2>
          <button className="p-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors">
            <MessageSquarePlus size={20} />
          </button>
        </div>
        <div className="relative">
          <input 
            type="text" 
            placeholder="بحث في المحادثات..." 
            className="w-full bg-gray-100 border-transparent focus:bg-white focus:border-blue-500 focus:ring-0 rounded-xl px-4 py-2.5 pl-10 pr-10 text-sm transition-colors outline-none"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        </div>
      </div>

      <div className="divide-y divide-gray-50 overflow-y-auto h-[calc(600px-80px)]">
        {/* Active Conversations */}
        {activeChats.length > 0 && (
          <div className="p-2">
            <h3 className="text-xs font-bold text-gray-400 px-2 mb-2 mt-2">المحادثات الأخيرة</h3>
            {activeChats.map((chat) => (
              <div 
                key={chat!.user.id}
                onClick={() => onSelectUser(chat!.user)}
                className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors group"
              >
                <div className="relative">
                  <img 
                    src={chat!.user.avatar} 
                    alt={chat!.user.name} 
                    className="w-12 h-12 rounded-full object-cover border border-gray-100 group-hover:border-blue-200 transition-colors"
                  />
                  {/* Online indicator simulation */}
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="font-bold text-gray-900 text-sm truncate">{chat!.user.name}</h4>
                    <span className="text-[10px] text-gray-400 flex-shrink-0">{formatTime(chat!.lastMessage.timestamp)}</span>
                  </div>
                  <p className="text-xs text-gray-500 truncate dir-auto">
                    {chat!.lastMessage.senderId === currentUser.id ? 'أنت: ' : ''}
                    {chat!.lastMessage.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Suggested Users */}
        {suggestedUsers.length > 0 && (
          <div className="p-2">
            <h3 className="text-xs font-bold text-gray-400 px-2 mb-2 mt-4">أشخاص قد تعرفهم</h3>
            {suggestedUsers.map((user) => (
              <div 
                key={user.id}
                onClick={() => onSelectUser(user)}
                className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors"
              >
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="w-10 h-10 rounded-full object-cover border border-gray-100"
                />
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">{user.name}</h4>
                  <p className="text-xs text-gray-400">انقر للبدء بالمحادثة</p>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {activeChats.length === 0 && suggestedUsers.length === 0 && (
            <div className="text-center py-10 text-gray-400">
                لا توجد محادثات متاحة
            </div>
        )}
      </div>
    </div>
  );
};