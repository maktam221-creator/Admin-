import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, Send, MoreHorizontal, Trash2, Edit2, X, Check, Repeat, Ban, Flag } from 'lucide-react';
import { Post, User } from '../types';

interface PostCardProps {
  post: Post;
  currentUserAvatar: string;
  currentUserId: string;
  onLike: (postId: string) => void;
  onComment: (postId: string, text: string) => void;
  onShare: (postId: string) => void;
  onDelete: (postId: string) => void;
  onEdit: (postId: string, newContent: string) => void;
  onRepost: (postId: string) => void;
  onUserClick: (user: User) => void;
  onBlock: (user: User) => void;
  onReport: (post: Post) => void;
}

export const PostCard: React.FC<PostCardProps> = ({ 
  post, 
  currentUserAvatar,
  currentUserId,
  onLike, 
  onComment,
  onShare,
  onDelete,
  onEdit,
  onRepost,
  onUserClick,
  onBlock,
  onReport
}) => {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);

  const isOwner = currentUserId === post.user.id;
  const isRepost = !!post.originalPost;

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    onComment(post.id, newComment);
    setNewComment('');
  };

  const handleSaveEdit = () => {
    if (editContent.trim() && editContent !== post.content) {
      onEdit(post.id, editContent);
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditContent(post.content);
    setIsEditing(false);
  };

  const formatDate = (timestamp: number) => {
    return new Intl.DateTimeFormat('ar-EG', {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'short',
    }).format(new Date(timestamp));
  };

  return (
    <article className="bg-white rounded-xl shadow-sm border border-gray-100 mb-4 overflow-visible animate-fade-in relative">
      {/* Post Header */}
      <div className="p-4 flex items-center justify-between">
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => onUserClick(post.user)}
        >
          <img 
            src={post.user.avatar} 
            alt={post.user.name} 
            className="w-10 h-10 rounded-full object-cover border border-gray-200 group-hover:border-blue-400 transition-colors"
          />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-gray-900 text-sm md:text-base group-hover:text-blue-600 transition-colors">{post.user.name}</h3>
              {isRepost && (
                <span className="text-xs text-gray-500 flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded-full">
                  <Repeat size={12} />
                  عاد النشر
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500">{formatDate(post.timestamp)}</p>
          </div>
        </div>
        
        <div className="relative">
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-50 transition-colors"
          >
            <MoreHorizontal size={20} />
          </button>
          
          {showMenu && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setShowMenu(false)} 
              />
              <div className="absolute left-0 top-full mt-1 w-36 bg-white rounded-lg shadow-xl border border-gray-100 z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                {isOwner ? (
                  <>
                    <button 
                      onClick={() => { setIsEditing(true); setShowMenu(false); }}
                      className="w-full text-right px-4 py-2.5 text-sm hover:bg-gray-50 flex items-center gap-2 text-gray-700 transition-colors"
                    >
                      <Edit2 size={16} />
                      تعديل
                    </button>
                    <button 
                      onClick={() => { setShowMenu(false); onDelete(post.id); }}
                      className="w-full text-right px-4 py-2.5 text-sm hover:bg-red-50 text-red-600 flex items-center gap-2 transition-colors border-t border-gray-50"
                    >
                      <Trash2 size={16} />
                      حذف
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={() => { setShowMenu(false); onReport(post); }}
                      className="w-full text-right px-4 py-2.5 text-sm hover:bg-orange-50 text-orange-600 flex items-center gap-2 transition-colors"
                    >
                      <Flag size={16} />
                      إبلاغ
                    </button>
                    <button 
                      onClick={() => { setShowMenu(false); onBlock(post.user); }}
                      className="w-full text-right px-4 py-2.5 text-sm hover:bg-red-50 text-red-600 flex items-center gap-2 transition-colors border-t border-gray-50"
                    >
                      <Ban size={16} />
                      حظر المستخدم
                    </button>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Post Content */}
      <div className="px-4 pb-2">
        {isEditing ? (
          <div className="animate-in fade-in">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full p-3 min-h-[120px] border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none bg-blue-50/30 text-base"
              dir="auto"
              autoFocus
            />
            <div className="flex justify-end gap-2 mt-3">
              <button 
                onClick={handleCancelEdit}
                className="px-4 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg flex items-center gap-1 transition-colors"
              >
                <X size={16} />
                إلغاء
              </button>
              <button 
                onClick={handleSaveEdit}
                className="px-4 py-1.5 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded-lg flex items-center gap-1 transition-colors shadow-sm"
              >
                <Check size={16} />
                حفظ
              </button>
            </div>
          </div>
        ) : (
          <>
            {post.content && (
              <p className="text-gray-800 text-base leading-relaxed whitespace-pre-wrap mb-2" dir="auto">
                {post.content}
              </p>
            )}
            
            {/* Reposted Content */}
            {isRepost && post.originalPost && (
              <div className="border border-gray-200 rounded-xl p-3 bg-gray-50/50 mt-2 hover:bg-gray-50 transition-colors cursor-pointer">
                <div 
                  className="flex items-center gap-2 mb-2" 
                  onClick={(e) => {
                    e.stopPropagation();
                    onUserClick(post.originalPost!.user);
                  }}
                >
                  <img 
                    src={post.originalPost.user.avatar} 
                    alt={post.originalPost.user.name} 
                    className="w-8 h-8 rounded-full object-cover border border-gray-200"
                  />
                  <div>
                    <h4 className="font-bold text-sm text-gray-900">{post.originalPost.user.name}</h4>
                    <span className="text-[10px] text-gray-500">{formatDate(post.originalPost.timestamp)}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {post.originalPost.content}
                </p>
                {post.originalPost.image && (
                  <div className="mt-2 rounded-lg overflow-hidden">
                    <img 
                      src={post.originalPost.image} 
                      alt="Original post" 
                      className="w-full h-auto max-h-[300px] object-cover"
                    />
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Post Image (Normal Post) */}
      {post.image && !isRepost && !isEditing && (
        <div className="mt-2 w-full">
          <img 
            src={post.image} 
            alt="Post content" 
            className="w-full h-auto max-h-[500px] object-cover bg-gray-50"
          />
        </div>
      )}

      {/* Post Stats */}
      <div className="px-4 py-2 flex items-center justify-between text-xs text-gray-500 border-b border-gray-50 mt-2">
        <div className="flex gap-1">
          {post.likes > 0 && <span>{post.likes} إعجاب</span>}
        </div>
        <div className="flex gap-3">
          <span>{post.comments.length} تعليق</span>
          <span>{post.shares} مشاركة</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between px-2 py-1">
        <button 
          onClick={() => onLike(post.id)}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-gray-50 transition-colors ${
            post.isLiked ? 'text-red-500' : 'text-gray-600'
          }`}
        >
          <Heart size={20} fill={post.isLiked ? "currentColor" : "none"} />
          <span className="hidden sm:inline font-medium text-sm">أعجبني</span>
        </button>
        
        <button 
          onClick={() => setShowComments(!showComments)}
          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-gray-50 transition-colors text-gray-600"
        >
          <MessageCircle size={20} />
          <span className="hidden sm:inline font-medium text-sm">تعليق</span>
        </button>

        <button 
          onClick={() => onRepost(post.id)}
          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-gray-50 transition-colors text-gray-600"
        >
          <Repeat size={20} />
          <span className="hidden sm:inline font-medium text-sm">إعادة نشر</span>
        </button>
        
        <button 
          onClick={() => onShare(post.id)}
          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-gray-50 transition-colors text-gray-600"
        >
          <Share2 size={20} />
          <span className="hidden sm:inline font-medium text-sm">مشاركة</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="bg-gray-50 p-4 border-t border-gray-100">
          {/* Comment Input */}
          <form onSubmit={handleCommentSubmit} className="flex items-center gap-2 mb-4">
            <img 
              src={currentUserAvatar} 
              alt="You" 
              className="w-8 h-8 rounded-full object-cover"
            />
            <div className="flex-1 relative">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="اكتب تعليقاً..."
                className="w-full px-4 py-2 pl-10 rounded-full border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm"
              />
              <button 
                type="submit"
                disabled={!newComment.trim()}
                className="absolute left-2 top-1/2 -translate-y-1/2 text-blue-600 disabled:text-gray-400"
              >
                <Send size={16} />
              </button>
            </div>
          </form>

          {/* Comments List */}
          <div className="space-y-3">
            {post.comments.map((comment) => (
              <div key={comment.id} className="flex gap-2 items-start">
                <img 
                  src={comment.user.avatar} 
                  alt={comment.user.name} 
                  className="w-8 h-8 rounded-full object-cover mt-1"
                  onClick={() => onUserClick(comment.user)}
                />
                <div className="bg-white p-3 rounded-2xl rounded-tr-none shadow-sm border border-gray-100 flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span 
                      className="font-bold text-xs text-gray-900 cursor-pointer hover:text-blue-600"
                      onClick={() => onUserClick(comment.user)}
                    >
                      {comment.user.name}
                    </span>
                    <span className="text-[10px] text-gray-400">{formatDate(comment.timestamp)}</span>
                  </div>
                  <p className="text-sm text-gray-700">{comment.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </article>
  );
};