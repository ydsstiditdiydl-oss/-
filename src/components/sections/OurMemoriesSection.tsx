import React, { useState, useRef } from 'react';
import { Image as ImageIcon, Plus, X, ChevronRight, ChevronLeft, Calendar, Upload, Heart } from 'lucide-react';
import { AppData, MemoryPhoto } from '../../types';

interface OurMemoriesSectionProps {
  data: AppData;
  onAddMemory: (memory: MemoryPhoto) => void;
  onDeleteMemory?: (id: string) => void;
}

export const OurMemoriesSection: React.FC<OurMemoriesSectionProps> = ({ data, onAddMemory }) => {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Form states
  const [newTitle, setNewTitle] = useState<string>('');
  const [newDate, setNewDate] = useState<string>('');
  const [newCaption, setNewCaption] = useState<string>('');
  const [newImageData, setNewImageData] = useState<string>('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setNewImageData(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImageData || !newTitle) return;

    const randomRotation = (Math.random() * 6 - 3); // -3 to +3 deg
    const newMemory: MemoryPhoto = {
      id: 'mem-' + Date.now(),
      title: newTitle,
      date: newDate || new Date().toISOString().split('T')[0],
      imageUrl: newImageData,
      caption: newCaption || 'ذكرى لا تُنسى في قلبي ❤️',
      rotation: Number(randomRotation.toFixed(1))
    };

    onAddMemory(newMemory);
    setShowAddModal(false);
    setNewTitle('');
    setNewDate('');
    setNewCaption('');
    setNewImageData('');
  };

  const handleNext = () => {
    if (selectedPhotoIndex === null) return;
    setSelectedPhotoIndex((selectedPhotoIndex + 1) % data.memories.length);
  };

  const handlePrev = () => {
    if (selectedPhotoIndex === null) return;
    setSelectedPhotoIndex((selectedPhotoIndex - 1 + data.memories.length) % data.memories.length);
  };

  return (
    <div className="space-y-10 py-6 max-w-5xl mx-auto px-4 animate-fadeIn">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs font-medium">
          <ImageIcon className="w-3.5 h-3.5 text-rose-400" />
          <span>ألبوم الصور واللحظات الخاصة</span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-pink-300 to-rose-400">
          Our Memories
        </h1>
        <p className="font-amiri text-lg text-rose-200/80 max-w-xl mx-auto">
          كل صورة هنا تحمل ابتسامتكِ، وتحكي جزءاً من دقات قلبي.
        </p>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-rose-900/40 hover:bg-rose-800/60 border border-rose-500/40 text-rose-200 text-sm font-medium transition-all duration-300 shadow-md shadow-rose-950"
        >
          <Plus className="w-4 h-4 text-rose-400" />
          <span>إضافة صورة حقيقية للألبوم</span>
        </button>
      </div>

      {/* Polaroid Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-4">
        {data.memories.map((mem, idx) => (
          <div
            key={mem.id}
            onClick={() => setSelectedPhotoIndex(idx)}
            style={{ transform: `rotate(${mem.rotation || 0}deg)` }}
            className="group cursor-pointer bg-neutral-900 border border-neutral-700/60 hover:border-rose-400 p-3 pb-5 rounded-lg shadow-xl hover:shadow-2xl hover:shadow-rose-950/50 hover:scale-105 hover:z-20 transition-all duration-300 relative flex flex-col justify-between"
          >
            {/* Realistic Tape Top */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-4 bg-white/20 backdrop-blur-sm -rotate-2 border border-white/10 shadow-sm pointer-events-none" />

            {/* Photo Image Frame */}
            <div className="aspect-square w-full bg-neutral-950 rounded-sm overflow-hidden mb-3 border border-neutral-800 relative">
              <img
                src={mem.imageUrl}
                alt={mem.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-2">
                <span className="text-[11px] text-white bg-black/60 px-2 py-0.5 rounded-full backdrop-blur-xs">
                  تكبير الصورة 🔍
                </span>
              </div>
            </div>

            {/* Polaroid Handwriting Description */}
            <div className="text-center px-1 space-y-1">
              <h4 className="font-amiri text-base font-bold text-neutral-100 truncate">
                {mem.title}
              </h4>
              <p className="font-amiri text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                {mem.caption}
              </p>
              <span className="inline-block font-mono text-[10px] text-rose-400/80 pt-1">
                {mem.date}
              </span>
            </div>
          </div>
        ))}

        {/* Empty Add Slot */}
        <button
          onClick={() => setShowAddModal(true)}
          className="border-2 border-dashed border-rose-500/30 hover:border-rose-400 rounded-lg p-6 min-h-[260px] flex flex-col items-center justify-center gap-3 text-rose-300 hover:text-white bg-rose-950/10 hover:bg-rose-950/30 transition-all duration-300 group"
        >
          <div className="w-12 h-12 rounded-full bg-rose-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Upload className="w-6 h-6 text-rose-400" />
          </div>
          <span className="text-sm font-medium">اضغط لرفع صورة جديدة</span>
          <span className="text-xs text-neutral-400">ستُحفظ في الألبوم مباشرة</span>
        </button>
      </div>

      {/* Full-Screen Lightbox Modal */}
      {selectedPhotoIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-lg flex items-center justify-center p-4">
          <button
            onClick={() => setSelectedPhotoIndex(null)}
            className="absolute top-5 left-5 z-50 p-2 rounded-full bg-neutral-900/80 text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navigation Arrows */}
          <button
            onClick={handlePrev}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-neutral-900/80 text-white hover:bg-rose-900/80 transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
          <button
            onClick={handleNext}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-neutral-900/80 text-white hover:bg-rose-900/80 transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Active Polaroid in Fullscreen */}
          <div className="max-w-2xl w-full bg-neutral-900 border border-neutral-700 p-4 sm:p-6 rounded-2xl shadow-2xl flex flex-col items-center animate-scaleIn">
            <div className="w-full max-h-[65vh] overflow-hidden rounded-lg bg-black mb-4">
              <img
                src={data.memories[selectedPhotoIndex].imageUrl}
                alt={data.memories[selectedPhotoIndex].title}
                referrerPolicy="no-referrer"
                className="w-full h-full max-h-[65vh] object-contain mx-auto"
              />
            </div>

            <div className="text-center space-y-2 w-full">
              <div className="flex items-center justify-center gap-2">
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                <h3 className="font-amiri text-2xl font-bold text-white">
                  {data.memories[selectedPhotoIndex].title}
                </h3>
              </div>
              <p className="font-amiri text-base text-rose-200/90 max-w-lg mx-auto">
                {data.memories[selectedPhotoIndex].caption}
              </p>
              <div className="text-xs text-neutral-400 font-mono flex items-center justify-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-rose-400" />
                <span>{data.memories[selectedPhotoIndex].date}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Memory Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-neutral-950 border border-rose-500/40 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-rose-950 pb-3">
              <h3 className="text-lg font-bold text-white">إضافة صورة جديدة للألبوم</h3>
              <button onClick={() => setShowAddModal(false)} className="text-neutral-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSaveMemory} className="space-y-4">
              {/* File Upload Area */}
              <div>
                <label className="block text-xs font-medium text-rose-300 mb-1.5">اختر الصورة من جهازك</label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-rose-500/40 hover:border-rose-400 rounded-2xl p-4 text-center cursor-pointer bg-neutral-900/50 hover:bg-neutral-900 transition-colors"
                >
                  {newImageData ? (
                    <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black">
                      <img src={newImageData} alt="preview" className="w-full h-full object-cover" />
                      <span className="absolute bottom-2 right-2 bg-black/70 text-rose-300 text-[10px] px-2 py-0.5 rounded-full">
                        تم اختيار الصورة (اضغط للتغيير)
                      </span>
                    </div>
                  ) : (
                    <div className="py-6 space-y-2">
                      <Upload className="w-8 h-8 text-rose-400 mx-auto" />
                      <span className="block text-xs text-neutral-300">اضغط لرفع صورة من معرض الصور</span>
                      <span className="block text-[10px] text-neutral-500">PNG, JPG, WEBP</span>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-rose-300 mb-1">عنوان الصورة</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: ضحكتكِ في يوم مشمس"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2.5 text-white text-sm focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-rose-300 mb-1">التاريخ</label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2.5 text-white text-sm focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-rose-300 mb-1">وصف أو كلام لطيف</label>
                <textarea
                  rows={2}
                  placeholder="ما أجمل شيء في هذه الصورة؟"
                  value={newCaption}
                  onChange={(e) => setNewCaption(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2.5 text-white text-sm focus:border-rose-500 focus:outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-sm text-neutral-400 hover:text-white"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={!newImageData || !newTitle}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 text-white font-medium text-sm disabled:opacity-50"
                >
                  حفظ في الألبوم
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
