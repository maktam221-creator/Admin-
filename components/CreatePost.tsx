import React, { useState, useRef } from 'react';
import { Image as ImageIcon, X, Sparkles } from 'lucide-react';
import { Button } from './Button';
import { enhancePostText } from '../services/geminiService';

interface CreatePostProps {
  currentUserAvatar: string;
  onPostCreate: (text: string, image: string | null) => void;
}

export const CreatePost: React.FC<CreatePostProps> = ({ currentUserAvatar, onPostCreate }) => {
  const [text, setText] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAiEnhance = async () => {
    if (!text.trim()) return;
    setIsEnhancing(true);
    const enhanced = await enhancePostText(text);
    setText(enhanced);
    setIsEnhancing(false);
  };

  const handleSubmit = () => {
    if (!text.trim() && !image) return;
    onPostCreate(text, image);
    setText('');
    setImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 mb-6 transition-colors">
      <div className="flex gap-3">
        <img 
          src={currentUserAvatar} 
          alt="Current User" 
          className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-600"
        />
        <div className="flex-1">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="بماذا تفكر اليوم؟"
            className="w-full p-2 text-base border-none resize-none focus:ring-0 outline-none min-h-[80px] placeholder-gray-400 bg-transparent text-gray-900 dark:text-white"
            rows={3}
          />
          
          {image && (
            <div className="relative mt-2 rounded-lg overflow-hidden inline-block group">
              <img src={image} alt="Upload preview" className="max-h-48 w-auto object-cover rounded-lg" />
              <button 
                onClick={removeImage}
                className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white p-1 rounded-full transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          )}

          <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handleImageUpload}
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-3 py-1.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors text-sm"
              >
                <ImageIcon size={18} className="text-green-600 dark:text-green-400" />
                <span>صورة</span>
              </button>
              
              <button 
                onClick={handleAiEnhance}
                disabled={!text.trim() || isEnhancing}
                className="flex items-center gap-2 px-3 py-1.5 text-gray-600 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-full transition-colors text-sm disabled:opacity-50"
              >
                <Sparkles size={18} className="text-purple-600 dark:text-purple-400" />
                <span>{isEnhancing ? 'جاري التحسين...' : 'تحسين النص'}</span>
              </button>
            </div>

            <Button 
              onClick={handleSubmit}
              disabled={!text.trim() && !image}
              className="px-6"
            >
              نشر
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};