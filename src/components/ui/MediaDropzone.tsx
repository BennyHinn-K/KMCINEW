import React from 'react';
import { useDropzone, Accept } from 'react-dropzone';
import { Upload, X } from 'lucide-react';

interface MediaDropzoneProps {
  onDrop: (files: File[]) => void;
  initialPreview?: string;
  onClear?: () => void;
  accept?: Accept;
  maxFiles?: number;
}

const MediaDropzone: React.FC<MediaDropzoneProps> = ({
  onDrop,
  initialPreview,
  onClear,
  accept = {
    'image/jpeg': [],
    'image/png': [],
    'image/webp': []
  },
  maxFiles = 1
}) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles
  });

  if (initialPreview) {
    return (
      <div className="relative w-full h-48 bg-gray-50 rounded-lg border-2 border-gray-200 border-dashed overflow-hidden group">
        <img 
          src={initialPreview} 
          alt="Preview" 
          className="w-full h-full object-contain"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button
            type="button"
            onClick={onClear}
            className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={`w-full h-48 rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors
        ${isDragActive ? 'border-amber-500 bg-amber-50' : 'border-gray-300 hover:border-amber-400 hover:bg-gray-50'}`}
    >
      <input {...getInputProps()} />
      <div className="bg-slate-100 p-3 rounded-full mb-3">
        <Upload className="w-6 h-6 text-slate-500" />
      </div>
      <p className="text-sm font-medium text-gray-700">
        {isDragActive ? 'Drop files here...' : 'Click or drag files to upload'}
      </p>
      <p className="text-xs text-gray-500 mt-1">
        Supports JPG, PNG, WebP
      </p>
    </div>
  );
};

export default MediaDropzone;
