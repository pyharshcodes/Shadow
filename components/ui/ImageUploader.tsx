'use client';

import React, { useState, useRef } from 'react';
import { Upload, X, Check, Image as ImageIcon } from 'lucide-react';

interface ImageUploaderProps {
  value?: string | null;
  onChange: (url: string) => void;
  label?: string;
}

export function ImageUploader({ value, onChange, label = 'Upload Image' }: ImageUploaderProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      onChange(data.url);
    } catch (err: any) {
      setError(err.message || 'Failed to upload image');
    } finally {
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400">
          {label}
        </label>
      )}

      {value ? (
        <div className="relative rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900 aspect-[16/9] max-h-48 group">
          <img
            src={value}
            alt="Uploaded preview"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded bg-zinc-800 text-white text-xs font-mono hover:bg-zinc-750"
            >
              Change
            </button>
            <button
              type="button"
              onClick={() => onChange('')}
              className="p-1.5 rounded bg-rose-500/80 text-white hover:bg-rose-500"
              aria-label="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="rounded-xl border border-dashed border-zinc-800 hover:border-zinc-600 bg-zinc-900/50 p-6 text-center cursor-pointer transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-zinc-850 flex items-center justify-center text-zinc-400 mx-auto mb-2">
            <Upload className="w-5 h-5" />
          </div>
          <p className="text-xs font-mono text-zinc-300">
            {loading ? 'Uploading...' : 'Click to upload image'}
          </p>
          <p className="text-[10px] text-zinc-500 mt-1">
            JPEG, PNG, WebP or AVIF (Max 10MB)
          </p>
        </div>
      )}

      {error && (
        <p className="text-xs text-rose-400 font-mono mt-1">{error}</p>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
