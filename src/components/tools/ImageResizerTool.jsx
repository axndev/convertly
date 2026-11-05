import React from 'react';
import ConverterWorkspace from '@/components/converter/ConverterWorkspace';

export default function ImageResizerTool() {
  return (
    <ConverterWorkspace
      mode="resize"
      target="same"
      settingsOpen
      hint="Add images to resize — JPG, PNG, WebP, AVIF, HEIC, HEIF, BMP, GIF, TIFF, SVG, JFIF or ICO."
      capabilities={{ resize: true, quality: false, background: false, maxSize: false }}
      ctaLabel="Resize images"
    />
  );
}