import React, { useState, useRef, useEffect } from 'react';
import { Send, ArrowRight, Phone, Video, Mic, MicOff, VideoOff, PhoneOff, Minimize2, Maximize2 } from 'lucide-react';
import { User, Message } from '../types';

interface ChatWindowProps {
  currentUser: User;
  otherUser: User;
  messages: Message[];
  onSendMessage: (text: string) => void;
  onBack: () => void;
}

type CallStatus = 'idle' | 'calling' | 'connected' | 'ended';
type CallType = 'audio' | 'video';

export const ChatWindow: React.FC<ChatWindowProps> = ({ 
  currentUser, 
  otherUser, 
  messages, 
  onSendMessage,
  onBack
}) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Call State
  const [callStatus, setCallStatus] = useState<CallStatus>('idle');
  const [callType, setCallType] = useState<CallType>('audio');
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Call Timer Logic
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (callStatus === 'connected') {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callStatus]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };

  const formatTime = (timestamp: number) => {
    return new Intl.DateTimeFormat('ar-EG', {
      hour: 'numeric',
      minute: 'numeric',
    }).format(new Date(timestamp));
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startCall = (type: CallType) => {
    setCallType(type);
    setCallStatus('calling');
    setCallDuration(0);
    setIsMinimized(false);
    
    // Simulate connection after 2.5 seconds
    setTimeout(() => {
      setCallStatus(prev => prev === 'calling' ? 'connected' : prev);
    }, 2500);
  };

  const endCall = () => {
    setCallStatus('ended');
    setTimeout(() => {
      setCallStatus('idle');
      setCallDuration(0);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] md:h-[600px] bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in relative">
      
      {/* Call Overlay */}
      {callStatus !== 'idle' && (
        <div className={`absolute inset-0 z-50 bg-gray-900 text-white transition-all duration-300 flex flex-col ${isMinimized ? 'top-auto left-auto right-4 bottom-20 w-64 h-36 rounded-xl shadow-2xl border border-gray-700' : ''}`}>
          {/* Minimized Header */}
          {isMinimized && (
             <div className="absolute top-2 right-2 z-20 flex gap-2">
               <button onClick={() => setIsMinimized(false)} className="p-1 hover:bg-white/20 rounded-full"><Maximize2 size={16} /></button>
             </div>
          )}

          {/* Main Call Content */}
          <div className={`flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden ${isMinimized ? 'scale-75' : ''}`}>
             {/* Background Effect for Video */}
             {callType === 'video' && !isMinimized && (
                <div className="absolute inset-0 opacity-20">
                   <img src={otherUser.avatar} alt="" className="w-full h-full object-cover blur-3xl" />
                </div>
             )}

             {/* User Avatar / Video Placeholder */}
             <div className={`relative ${isMinimized ? 'mb-2' : 'mb-8'}`}>
                {callType === 'video' && callStatus === 'connected' ? (
                  <div className="w-32 h-32 md:w-48 md:h-48 bg-gray-800 rounded-2xl flex items-center justify-center border border-gray-700 overflow-hidden">
                     <img src={otherUser.avatar} alt="" className="w-full h-full object-cover" />
                     {/* Simulated Small Self View */}
                     {!isMinimized && (
                       <div className="absolute bottom-2 right-2 w-12 h-16 bg-black rounded-lg border border-white/20"></div>
                     )}
                  </div>
                ) : (
                  <div className="relative">
                    <img src={otherUser.avatar} alt="" className={`rounded-full object-cover border-4 border-gray-800 shadow-2xl ${isMinimized ? 'w-16 h-16' : 'w-32 h-32 animate-pulse'}`} />
                    {callStatus === 'calling' && (
                      <span className="absolute inset-0 rounded-full border-4 border-blue-500/50 animate-ping"></span>
                    )}
                  </div>
                )}
             </div>

             {/* Status & Timer */}
             <div className="text-center z-10">
               <h3 className={`font-bold ${isMinimized ? 'text-sm' : 'text-2xl mb-2'}`}>{otherUser.name}</h3>
               <p className={`text-blue-200 ${isMinimized ? 'text-xs' : 'text-lg'}`}>
                 {callStatus === 'calling' ? 'جاري الاتصال...' : 
                  callStatus === 'ended' ? 'تم إنهاء المكالمة' : 
                  formatDuration(callDuration)}
               </p>
             </div>
          </div>

          {/* Controls (Hidden if minimized) */}
          {!isMinimized && (
            <div className="p-8 pb-12 flex items-center justify-center gap-6 z-10">
               <button 
                 onClick={() => setIsMuted(!isMuted)}
                 className={`p-4 rounded-full transition-all ${isMuted ? 'bg-white text-gray-900' : 'bg-white/10 hover:bg-white/20'}`}
               >
                 {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
               </button>
               
               {callType === 'video' && (
                 <button 
                   onClick={() => setIsCameraOff(!isCameraOff)}
                   className={`p-4 rounded-full transition-all ${isCameraOff ? 'bg-white text-gray-900' : 'bg-white/10 hover:bg-white/20'}`}
                 >
                   {isCameraOff ? <VideoOff size={24} /> : <Video size={24} />}
                 </button>
               )}

               <button 
                 onClick={endCall}
                 className="p-4 bg-red-600 hover:bg-red-700 rounded-full transition-all shadow-lg transform hover:scale-110"
               >
                 <PhoneOff size={28} />
               </button>

                {callStatus === 'connected' && (
                  <button 
                    onClick={() => setIsMinimized(true)}
                    className="absolute top-6 left-6 p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-full"
                  >
                    <Minimize2 size={24} />
                  </button>
                )}
            </div>
          )}
        </div>
      )}

      {/* Chat Header */}
      <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="md:hidden p-1 hover:bg-gray-100 rounded-full text-gray-600"
          >
            <ArrowRight size={20} />
          </button>
          <div className="relative">
            <img 
              src={otherUser.avatar} 
              alt={otherUser.name} 
              className="w-10 h-10 rounded-full object-cover border border-gray-100"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-sm">{otherUser.name}</h3>
            <span className="text-xs text-green-600">نشط الآن</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => startCall('audio')}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
            title="اتصال صوتي"
          >
            <Phone size={20} />
          </button>
          <button 
            onClick={() => startCall('video')}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
            title="مكالمة فيديو"
          >
            <Video size={20} />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 scrollbar-thin scrollbar-thumb-gray-200">
        <div className="text-center py-4">
          <p className="text-xs text-gray-400">بداية المحادثة مع {otherUser.name}</p>
        </div>
        
        {messages.map((msg) => {
          const isMe = msg.senderId === currentUser.id;
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex items-end gap-2 max-w-[80%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                {!isMe && (
                  <img 
                    src={otherUser.avatar} 
                    alt={otherUser.name} 
                    className="w-6 h-6 rounded-full object-cover mb-1"
                  />
                )}
                <div>
                  <div 
                    className={`px-4 py-2 rounded-2xl text-sm leading-relaxed shadow-sm ${
                      isMe 
                        ? 'bg-blue-600 text-white rounded-br-none' 
                        : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
                    }`}
                  >
                    {msg.content}
                  </div>
                  <span className={`text-[10px] text-gray-400 mt-1 block ${isMe ? 'text-left' : 'text-right'}`}>
                    {formatTime(msg.timestamp)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 border-t border-gray-100 bg-white">
        <form onSubmit={handleSend} className="flex items-center gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="اكتب رسالة..."
            className="flex-1 px-4 py-2.5 bg-gray-100 border-transparent focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-full outline-none transition-all text-sm"
          />
          <button 
            type="submit" 
            disabled={!newMessage.trim()}
            className="p-2.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors shadow-sm flex items-center justify-center"
          >
            <Send size={18} className={newMessage.trim() ? 'mr-0.5' : ''} />
          </button>
        </form>
      </div>
    </div>
  );
};