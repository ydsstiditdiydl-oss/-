import React, { useState } from 'react';
import { 
  X, 
  Save, 
  RotateCcw, 
  Sparkles, 
  User, 
  Calendar, 
  Music, 
  Mail, 
  Heart,
  Check
} from 'lucide-react';
import { AppData } from '../types';
import { INITIAL_APP_DATA } from '../data/defaultData';

interface SettingsModalProps {
  data: AppData;
  onSaveData: (newData: AppData) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ data, onSaveData, onClose }) => {
  const [formData, setFormData] = useState<AppData>({ ...data });
  const [activeTab, setActiveTab] = useState<'general' | 'music' | 'letters' | 'reasons'>('general');
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveData(formData);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 900);
  };

  const handleReset = () => {
    if (window.confirm('هل أنت متأكد من رغبتك في استعادة الإعدادات والنصوص الافتراضية؟')) {
      setFormData({ ...INITIAL_APP_DATA });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#120716] border border-rose-500/40 rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] flex flex-col justify-between shadow-2xl relative text-right">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-rose-950/60 pb-4 shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-rose-400" />
            <h2 className="text-xl font-bold text-white">إعدادات المحتوى والتخصيص</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs Bar */}
        <div className="flex items-center gap-2 border-b border-rose-950/40 py-3 overflow-x-auto no-scrollbar shrink-0 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('general')}
            className={`px-3.5 py-1.5 rounded-full transition-colors whitespace-nowrap ${
              activeTab === 'general' ? 'bg-rose-950 text-rose-200 border border-rose-500/40 font-bold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            الأسماء والتواريخ
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('music')}
            className={`px-3.5 py-1.5 rounded-full transition-colors whitespace-nowrap ${
              activeTab === 'music' ? 'bg-rose-950 text-rose-200 border border-rose-500/40 font-bold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            الموسيقى والغلاف
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('letters')}
            className={`px-3.5 py-1.5 rounded-full transition-colors whitespace-nowrap ${
              activeTab === 'letters' ? 'bg-rose-950 text-rose-200 border border-rose-500/40 font-bold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            الرسائل والخواطر
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('reasons')}
            className={`px-3.5 py-1.5 rounded-full transition-colors whitespace-nowrap ${
              activeTab === 'reasons' ? 'bg-rose-950 text-rose-200 border border-rose-500/40 font-bold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            الأسباب الـ 100
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form id="settings-form" onSubmit={handleSubmit} className="overflow-y-auto py-4 space-y-4 my-2 pr-1">
          {activeTab === 'general' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-rose-300 mb-1">اسمها أو لقبها المحبب</label>
                <input
                  type="text"
                  required
                  value={formData.herName}
                  onChange={(e) => setFormData({ ...formData, herName: e.target.value })}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2 text-white text-sm focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-rose-300 mb-1">تاريخ ميلادها</label>
                  <input
                    type="date"
                    required
                    value={formData.herBirthDate}
                    onChange={(e) => setFormData({ ...formData, herBirthDate: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2 text-white text-sm focus:border-rose-500 focus:outline-none"
                  />
                  <span className="text-[11px] text-neutral-500 mt-1 block">الافتراضي: 9 نوفمبر 2010</span>
                </div>

                <div>
                  <label className="block text-xs font-medium text-rose-300 mb-1">تاريخ ميلادي</label>
                  <input
                    type="date"
                    required
                    value={formData.myBirthDate}
                    onChange={(e) => setFormData({ ...formData, myBirthDate: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2 text-white text-sm focus:border-rose-500 focus:outline-none"
                  />
                  <span className="text-[11px] text-neutral-500 mt-1 block">الافتراضي: 22 أبريل 2010</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-rose-300 mb-1">تاريخ بداية حكايتنا (Our Story)</label>
                <input
                  type="date"
                  required
                  value={formData.meetingDate}
                  onChange={(e) => setFormData({ ...formData, meetingDate: e.target.value })}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2 text-white text-sm focus:border-rose-500 focus:outline-none"
                />
                <span className="text-[11px] text-neutral-500 mt-1 block">الافتراضي: 26 سبتمبر 2026</span>
              </div>
            </div>
          )}

          {activeTab === 'music' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-rose-300 mb-1">رابط يوتيوب (YouTube URL)</label>
                <input
                  type="url"
                  value={formData.youtubeUrl || ''}
                  onChange={(e) => {
                    const newUrl = e.target.value;
                    const match = newUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
                    const newVideoId = match ? match[1] : (formData.youtubeVideoId || '');
                    setFormData({
                      ...formData,
                      youtubeUrl: newUrl,
                      youtubeVideoId: newVideoId,
                      songCoverUrl: newVideoId ? `https://i.ytimg.com/vi/${newVideoId}/hqdefault.jpg` : formData.songCoverUrl
                    });
                  }}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2 text-white text-sm focus:border-rose-500 focus:outline-none text-left"
                  dir="ltr"
                  placeholder="https://youtu.be/..."
                />
                <span className="text-[11px] text-neutral-500 mt-1 block">الأغنية الحالية: عمرو دياب - وعدتك (تعمل تلقائياً عند فتح القفل وتتكرر Loop)</span>
              </div>

              <div>
                <label className="block text-xs font-medium text-rose-300 mb-1">عنوان الأغنية</label>
                <input
                  type="text"
                  value={formData.songTitle}
                  onChange={(e) => setFormData({ ...formData, songTitle: e.target.value })}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2 text-white text-sm focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-rose-300 mb-1">اسم الفنان / المغني</label>
                <input
                  type="text"
                  value={formData.songArtist}
                  onChange={(e) => setFormData({ ...formData, songArtist: e.target.value })}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2 text-white text-sm focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-rose-300 mb-1">رابط صورة الغلاف</label>
                <input
                  type="url"
                  value={formData.songCoverUrl}
                  onChange={(e) => setFormData({ ...formData, songCoverUrl: e.target.value })}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2 text-white text-sm focus:border-rose-500 focus:outline-none text-left"
                  dir="ltr"
                />
              </div>
            </div>
          )}

          {activeTab === 'letters' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-rose-300 mb-1">نص الرسالة السرية (Secret Letter)</label>
                <textarea
                  rows={5}
                  value={formData.secretLetterContent}
                  onChange={(e) => setFormData({ ...formData, secretLetterContent: e.target.value })}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-white text-sm focus:border-rose-500 focus:outline-none resize-none font-amiri"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-rose-300 mb-1">نص المفاجأة النهائية الكبرى (Final Surprise)</label>
                <textarea
                  rows={5}
                  value={formData.finalSurpriseMessage}
                  onChange={(e) => setFormData({ ...formData, finalSurpriseMessage: e.target.value })}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-white text-sm focus:border-rose-500 focus:outline-none resize-none font-amiri"
                />
              </div>
            </div>
          )}

          {activeTab === 'reasons' && (
            <div className="space-y-3">
              <span className="text-xs text-neutral-400 block font-amiri">
                يمكنك مراجعة وتعديل أي سبب من الأسباب الـ 100:
              </span>
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {formData.reasons100.map((r, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-xs font-mono text-rose-400 w-8 shrink-0">#{idx + 1}</span>
                    <input
                      type="text"
                      value={r}
                      onChange={(e) => {
                        const updated = [...formData.reasons100];
                        updated[idx] = e.target.value;
                        setFormData({ ...formData, reasons100: updated });
                      }}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-white focus:border-rose-500 focus:outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </form>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-rose-950/60 pt-4 shrink-0">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs text-neutral-400 hover:text-rose-400 hover:bg-neutral-900 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>استعادة الافتراضي</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs text-neutral-400 hover:text-white"
            >
              إلغاء
            </button>
            <button
              type="submit"
              form="settings-form"
              className="flex items-center gap-1.5 px-6 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 text-white text-xs font-semibold shadow-lg shadow-rose-950 hover:scale-103 transition-transform"
            >
              {saveSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>تم الحفظ بنجاح!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>حفظ التعديلات</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
