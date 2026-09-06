import React from 'react';
import { useDropzone, Accept } from 'react-dropzone';
import { Upload, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MediaDropzoneProps {
  onDrop: (files: File[]) => void;
  initialPreview?: string;
  onClear?: () => void;
  accept?: Accept;
  maxFiles?: number;
  maxSize?: number;
  className?: string;
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
  maxFiles = 1,
  maxSize,
  className = ''
}) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles,
    maxSize
  });

  if (initialPreview) {
    return (
      <div className={cn(
        "relative w-full h-48 rounded-xl border-2 border-dashed border-border overflow-hidden group",
        className
      )}>
        <img
          src={initialPreview}
          alt="Preview"
          className="w-full h-full object-contain"
        />
        <div className="absolute inset-0 bg-ink/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button
            type="button"
            onClick={onClear}
            className="bg-destructive text-destructive-foreground p-2 rounded-full shadow-2 hover:bg-destructive/90 transition-colors press-lift focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
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
      className={cn(
        "w-full h-48 rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-normal ease-standard",
        isDragActive
          ? "border-accent bg-accent-soft shadow-glow"
          : "border-input bg-muted/40 hover:border-accent/60 hover:bg-accent-soft/40",
        className
      )}
    >
      <input {...getInputProps()} />
      <div className="bg-accent-soft text-accent p-3 rounded-xl mb-3 transition-shadow duration-normal ease-standard hover:shadow-1">
        <Upload className="w-6 h-6" />
      </div>
      <p className="text-sm font-medium text-ink">
        {isDragActive ? 'Drop files here...' : 'Click or drag files to upload'}
      </p>
      <p className="text-xs text-muted-foreground mt-xs">
        Supports JPG, PNG, WebP
      </p>
    </div>
  );
};

export default MediaDropzone;
