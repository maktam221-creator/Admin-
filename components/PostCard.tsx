import React, { useState, useCallback } from 'react';
import { Heart, MessageCircle, Share2, Send, MoreHorizontal } from 'lucide-react';
import { Post, Comment } from '../types';
import { Button } from './Button';

interface PostCardProps {
  post: Post;
  currentUserAvatar: string;
  onLike: (postId: string) => void;
  onComment: (postId: string, text: string) => void;
  onShare: (postId: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({ 
  post, 
  currentUserAvatar,
  onLike, 
  onComment,
  onShare
}) => {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    onComment(post.id, newComment);
    setNewComment('');
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
    <article className="bg-white rounded-xl shadow-sm border border-gray-100 mb-4 overflow-hidden animate-fade-in">
      {/* Post Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img 
            src={post.user.avatar} 
            alt={post.user.name} 
            className="w-10 h-10 rounded-full object-cover border border-gray-200"
          />
          <div>
            <h3 className="font-bold text-gray-900 text-sm md:text-base">{post.user.name}</h3>
            <p className="text-xs text-gray-500">{formatDate(post.timestamp)}</p>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Post Content */}
      <div className="px-4 pb-2">
        <p className="text-gray-800 text-base leading-relaxed whitespace-pre-wrap" dir="auto">
          {post.content}
        </p>
      </div>

      {/* Post Image */}
      {post.image && (
        <div className="mt-2 w-full">
          <img 
            src={post.image} 
            alt="Post content" 
            className="w-full h-auto max-h-[500px] object-cover bg-gray-50"
          />
        </div>
      )}

      {/* Post Stats */}
      <div className="px-4 py-2 flex items-center justify-between text-xs text-gray-500 border-b border-gray-50">
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
          <span className="font-medium text-sm">أعجبني</span>
        </button>
        
        <button 
          onClick={() => setShowComments(!showComments)}
          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-gray-50 transition-colors text-gray-600"
        >
          <MessageCircle size={20} />
          <span className="font-medium text-sm">تعليق</span>
        </button>
        
        <button 
          onClick={() => onShare(post.id)}
          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-gray-50 transition-colors text-gray-600"
        >
          <Share2 size={20} />
          <span className="font-medium text-sm">مشاركة</span>
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
                />
                <div className="bg-white p-3 rounded-2xl rounded-tr-none shadow-sm border border-gray-100 flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-gray-900">{comment.user.name}</span>
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