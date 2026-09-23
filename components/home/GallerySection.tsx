'use client';

import React, { useState } from 'react';
import { Camera, Image as ImageIcon } from 'lucide-react';

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  caption?: string | null;
}

export function GallerySection({ images }: { images: GalleryItem[] }) {
  const [selectedCat, setSelectedCat] = useState<string>('All');
  const [lightboxImage, setLightboxImage] = useState<GalleryItem | null>(null);

  const categories = ['All', ...Array.from(new Set(images.map((img) => img.category)))];

  const filteredImages = selectedCat === 'All'
    ? images
    : images.filter((img) => img.category === selectedCat);

  return (
    <section className="py-24 sm:py-32 bg-background relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <span className="text-xs font-mono tracking-ultra-wide uppercase text-accent font-bold block mb-3">
              VISUAL ENVIRONMENT
            </span>
            <h2 className="text-4xl sm:text-5xl font-display font-black tracking-tight uppercase text-white leading-none">
              THE SHADOW GALLERY
            </h2>
            <p className="mt-3 text-zinc-400 text-base max-w-xl">
              An unvarnished look into the facility, equipment calibrations, and daily training sessions.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`px-4 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider transition-colors ${
                  selectedCat === cat
                    ? 'bg-accent text-zinc-950 font-bold'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {filteredImages.length === 0 ? (
          <div className="p-12 text-center rounded-xl border border-zinc-850 text-zinc-500">
            No images in this category yet. Upload new photos via the admin dashboard.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredImages.map((img) => (
              <div
                key={img.id}
                onClick={() => setLightboxImage(img)}
                className="group relative rounded-xl overflow-hidden bg-zinc-950 border border-zinc-850 hover:border-zinc-700 aspect-[4/3] cursor-pointer shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <img
                  src={img.imageUrl}
                  alt={img.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                  <span className="text-xs font-mono text-accent uppercase font-bold tracking-wider mb-1">
                    {img.category}
                  </span>
                  <h3 className="text-lg font-display uppercase font-bold text-white tracking-wide">
                    {img.title}
                  </h3>
                  {img.caption && (
                    <p className="text-xs text-zinc-300 font-sans mt-1 line-clamp-2">
                      {img.caption}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Lightbox Modal */}
        {lightboxImage && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
            onClick={() => setLightboxImage(null)}
          >
            <div className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center">
              <img
                src={lightboxImage.imageUrl}
                alt={lightboxImage.title}
                className="max-w-full max-h-[80vh] object-contain rounded-lg border border-zinc-800 shadow-2xl"
              />
              <div className="mt-4 text-center">
                <h3 className="text-xl font-display font-bold uppercase text-white tracking-wider">
                  {lightboxImage.title}
                </h3>
                {lightboxImage.caption && (
                  <p className="text-sm text-zinc-400 font-sans mt-1">
                    {lightboxImage.caption}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
