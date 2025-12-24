import React, { useState } from 'react';
import { 
  Link as LinkIcon, 
  UploadCloud, 
  Image as ImageIcon, 
  Save, 
  X, 
  AlertCircle,
  Loader2,
  FileVideo,
  Trash2
} from 'lucide-react';
import { ISermon } from '../../types';
import MediaDropzone from '../ui/MediaDropzone';
import { cn } from '@/lib/utils';

interface SermonFormProps {
  initialData?: Partial<ISermon>;
  onSubmit: (data: Partial<ISermon>) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

type VideoSource = 'url' | 'upload';

const SermonForm: React.FC<SermonFormProps> = ({ 
  initialData, 
  onSubmit, 
  onCancel, 
  isLoading = false 
}) => {
  // Form State
  const [formData, setFormData] = useState<Partial<ISermon>>({
    title: '',
    speaker: '',
    date: new Date().toISOString().split('T')[0],
    duration: '',
    description: '',
    thumbnail: '',
    videoUrl: '',
    featured: false,
    ...initialData
  });

  // UI State
  const [videoSource, setVideoSource] = useState<VideoSource>(
    initialData?.videoUrl && !initialData.videoUrl.startsWith('data:') ? 'url' : 'upload'
  );
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [videoFile, setVideoFile] = useState<File | null>(null);

  // Validation Helpers
  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const isValidDuration = (duration: string) => {
    if (!duration) return true; // Optional field
    // Allow HH:MM:SS or MM:SS
    return /^(\d{1,2}:)?\d{1,2}:\d{2}$/.test(duration);
  };

  // Validation Logic
  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    // Title Validation
    if (!formData.title?.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    }

    // Speaker Validation
    if (!formData.speaker?.trim()) {
      newErrors.speaker = "Speaker name is required";
    } else if (formData.speaker.length < 3) {
      newErrors.speaker = "Speaker name must be at least 3 characters";
    }

    // Date Validation
    if (!formData.date) {
      newErrors.date = "Date is required";
    } else {
      const date = new Date(formData.date);
      if (isNaN(date.getTime())) {
        newErrors.date = "Invalid date format";
      }
    }

    // Duration Validation
    if (formData.duration && !isValidDuration(formData.duration)) {
      newErrors.duration = "Invalid duration format (use MM:SS or HH:MM:SS)";
    }

    // Thumbnail Validation
    if (!formData.thumbnail) {
      newErrors.thumbnail = "Thumbnail image is required";
    }
    
    // Video Source Validation
    if (videoSource === 'url') {
      if (!formData.videoUrl?.trim()) {
        newErrors.videoUrl = "Video URL is required";
      } else if (!isValidUrl(formData.videoUrl)) {
        newErrors.videoUrl = "Invalid URL format";
      }
    }

    if (videoSource === 'upload' && !videoFile && !formData.videoUrl) {
      newErrors.videoFile = "Video file is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Video File Drop
  const handleVideoDrop = (files: File[]) => {
    const file = files[0];
    if (!file) return;

    // Strict File Validation
    const validTypes = ['video/mp4', 'video/webm', 'video/ogg'];
    const maxSize = 500 * 1024 * 1024; // 500MB

    if (!validTypes.includes(file.type)) {
      setErrors(prev => ({ ...prev, videoFile: 'Invalid file type. Only MP4, WebM, and OGG are allowed.' }));
      return;
    }

    if (file.size > maxSize) {
      setErrors(prev => ({ ...prev, videoFile: 'File size exceeds 500MB limit.' }));
      return;
    }

    setVideoFile(file);
    setErrors(prev => ({ ...prev, videoFile: '' }));
    
    // Simulate Upload Progress
    setIsUploading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + 5;
      });
    }, 200);

    // Convert to Base64 (Simulating upload completion)
    const reader = new FileReader();
    reader.onload = (e) => {
      clearInterval(interval);
      setUploadProgress(100);
      setTimeout(() => {
        setIsUploading(false);
        setFormData(prev => ({ ...prev, videoUrl: e.target?.result as string }));
      }, 500);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit(formData);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-white z-10">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {initialData?.id ? 'Edit Sermon' : 'New Sermon Entry'}
          </h2>
          <p className="text-sm text-gray-500 mt-1">Manage sermon details, video source, and media assets.</p>
        </div>
        <button 
          onClick={onCancel}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-8">
        <form id="sermon-form" onSubmit={handleSubmit} className="space-y-8">
          
          {/* Section 1: Basic Information */}
          <section className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center border-b border-gray-100 pb-2">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mr-3">
                1
              </div>
              Basic Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Sermon Title <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className={cn(
                    "w-full px-4 py-2.5 rounded-lg border focus:ring-2 outline-none transition-all",
                    errors.title 
                      ? "border-red-300 focus:border-red-500 focus:ring-red-200" 
                      : "border-gray-200 focus:border-blue-500 focus:ring-blue-100"
                  )}
                  placeholder="e.g. Walking in Divine Authority"
                />
                {errors.title && <p className="text-xs text-red-500 flex items-center"><AlertCircle className="w-3 h-3 mr-1"/>{errors.title}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Speaker <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={formData.speaker}
                  onChange={e => setFormData({ ...formData, speaker: e.target.value })}
                  className={cn(
                    "w-full px-4 py-2.5 rounded-lg border focus:ring-2 outline-none transition-all",
                    errors.speaker 
                      ? "border-red-300 focus:border-red-500 focus:ring-red-200" 
                      : "border-gray-200 focus:border-blue-500 focus:ring-blue-100"
                  )}
                  placeholder="e.g. Apostle John Doe"
                />
                {errors.speaker && <p className="text-xs text-red-500 flex items-center"><AlertCircle className="w-3 h-3 mr-1"/>{errors.speaker}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Date Preached <span className="text-red-500">*</span></label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={e => setFormData({ ...formData, date: e.target.value })}
                  className={cn(
                    "w-full px-4 py-2.5 rounded-lg border focus:ring-2 outline-none transition-all",
                    errors.date 
                      ? "border-red-300 focus:border-red-500 focus:ring-red-200" 
                      : "border-gray-200 focus:border-blue-500 focus:ring-blue-100"
                  )}
                />
                {errors.date && <p className="text-xs text-red-500 flex items-center"><AlertCircle className="w-3 h-3 mr-1"/>{errors.date}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Duration</label>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={e => setFormData({ ...formData, duration: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  placeholder="e.g. 45 min"
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-medium text-gray-700">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none"
                  placeholder="Brief summary of the sermon..."
                />
              </div>
            </div>
          </section>

          {/* Section 2: Video Source */}
          <section className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center border-b border-gray-100 pb-2">
              <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center mr-3">
                2
              </div>
              Video Source
            </h3>

            <div className="bg-gray-50 p-1 rounded-lg inline-flex mb-4">
              <button
                type="button"
                onClick={() => setVideoSource('url')}
                className={cn(
                  "px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center",
                  videoSource === 'url' 
                    ? "bg-white text-gray-900 shadow-sm" 
                    : "text-gray-500 hover:text-gray-900"
                )}
              >
                <LinkIcon className="w-4 h-4 mr-2" />
                External URL
              </button>
              <button
                type="button"
                onClick={() => setVideoSource('upload')}
                className={cn(
                  "px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center",
                  videoSource === 'upload' 
                    ? "bg-white text-gray-900 shadow-sm" 
                    : "text-gray-500 hover:text-gray-900"
                )}
              >
                <UploadCloud className="w-4 h-4 mr-2" />
                Upload File
              </button>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 transition-all">
              {videoSource === 'url' ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Video URL <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="url"
                        value={formData.videoUrl}
                        onChange={e => setFormData({ ...formData, videoUrl: e.target.value })}
                        className={cn(
                          "w-full pl-10 pr-4 py-2.5 rounded-lg border focus:ring-2 outline-none transition-all",
                          errors.videoUrl 
                            ? "border-red-300 focus:border-red-500 focus:ring-red-200" 
                            : "border-gray-200 focus:border-purple-500 focus:ring-purple-100"
                        )}
                        placeholder="https://youtube.com/watch?v=..."
                      />
                    </div>
                    {errors.videoUrl && <p className="text-xs text-red-500 flex items-center"><AlertCircle className="w-3 h-3 mr-1"/>{errors.videoUrl}</p>}
                    <p className="text-xs text-gray-500">Supported: YouTube, Vimeo, or direct MP4 links.</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <label className="text-sm font-medium text-gray-700 block">Upload Video File <span className="text-red-500">*</span></label>
                  
                  {!videoFile && !formData.videoUrl ? (
                    <div className="space-y-2">
                      <MediaDropzone
                        onDrop={handleVideoDrop}
                        accept={{ 'video/mp4': [], 'video/webm': [] }}
                        maxSize={500 * 1024 * 1024} // 500MB limit for demo
                        className={errors.videoFile ? "border-red-300 bg-red-50" : ""}
                      />
                      {errors.videoFile && <p className="text-xs text-red-500 flex items-center"><AlertCircle className="w-3 h-3 mr-1"/>{errors.videoFile}</p>}
                    </div>
                  ) : (
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FileVideo className="w-6 h-6 text-purple-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {videoFile ? videoFile.name : 'Existing Video File'}
                          </p>
                          <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                            <div 
                              className="bg-purple-600 h-1.5 rounded-full transition-all duration-300"
                              style={{ width: `${uploadProgress}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between items-center mt-1">
                            <span className="text-xs text-gray-500">
                              {isUploading ? 'Uploading...' : 'Ready'}
                            </span>
                            <span className="text-xs font-medium text-purple-600">{uploadProgress}%</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setVideoFile(null);
                            setFormData(prev => ({ ...prev, videoUrl: '' }));
                            setUploadProgress(0);
                          }}
                          className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>

          {/* Section 3: Thumbnail */}
          <section className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center border-b border-gray-100 pb-2">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center mr-3">
                3
              </div>
              Thumbnail Image
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-medium text-gray-700">Cover Image <span className="text-red-500">*</span></label>
                <MediaDropzone
                  onDrop={(files) => {
                    const file = files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (e) => setFormData(prev => ({ ...prev, thumbnail: e.target?.result as string }));
                      reader.readAsDataURL(file);
                      setErrors(prev => ({ ...prev, thumbnail: '' }));
                    }
                  }}
                  accept={{ 'image/jpeg': [], 'image/png': [], 'image/webp': [] }}
                  initialPreview={formData.thumbnail}
                  onClear={() => setFormData(prev => ({ ...prev, thumbnail: '' }))}
                  className={errors.thumbnail ? "border-red-300 bg-red-50" : ""}
                />
                {errors.thumbnail && <p className="text-xs text-red-500 flex items-center"><AlertCircle className="w-3 h-3 mr-1"/>{errors.thumbnail}</p>}
              </div>
              
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Preview</h4>
                  <div className="aspect-video bg-slate-900 rounded-lg overflow-hidden relative group">
                    {formData.thumbnail ? (
                      <>
                        <img 
                          src={formData.thumbnail} 
                          alt="Thumbnail preview" 
                          className="w-full h-full object-cover opacity-80"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                            <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-white border-b-[6px] border-b-transparent ml-1"></div>
                          </div>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                           <p className="text-white text-xs font-bold truncate">{formData.title || 'Sermon Title'}</p>
                           <p className="text-gray-300 text-[10px] truncate">{formData.speaker || 'Speaker Name'}</p>
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
                        <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                        <span className="text-xs">No image selected</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={e => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                  />
                  <label htmlFor="featured" className="ml-2 text-sm text-gray-700 select-none cursor-pointer">
                    Feature this sermon on home page
                  </label>
                </div>
              </div>
            </div>
          </section>

        </form>
      </div>

      {/* Footer Actions */}
      <div className="px-8 py-6 border-t border-gray-100 bg-gray-50 flex justify-end space-x-4 z-10">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          form="sermon-form"
          disabled={isLoading || isUploading}
          className="px-6 py-2.5 rounded-lg bg-slate-900 text-white font-medium hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading || isUploading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {isUploading ? 'Uploading Media...' : 'Saving...'}
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Sermon
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default SermonForm;
