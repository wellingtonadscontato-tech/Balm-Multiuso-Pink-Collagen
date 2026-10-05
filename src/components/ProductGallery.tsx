import React from 'react';
import { productConfig } from '../config/productConfig';
export const ArtworkImage = ({ id, eager = false }: { id: number; eager?: boolean }) => {
  const art = productConfig.gallery.find(a => a.id === id)!;
  return <img src={art.src} alt={art.alt} loading={eager ? 'eager' : 'lazy'} className="w-full h-auto rounded-3xl shadow-sm" onError={e => { const image = e.currentTarget; if (image.src !== art.fallbackSrc) image.src = art.fallbackSrc; }} />;
};
export const ArtworkSection = ({ id }: { id: number }) => <section className="px-4 py-8 sm:py-12 bg-rose-50/40"><div className="max-w-lg mx-auto"><ArtworkImage id={id} /></div></section>;
export const ProductGallery = () => <ArtworkImage id={1} eager />;
