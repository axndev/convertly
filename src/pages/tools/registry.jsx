import React from 'react';
import ToolShell from '@/components/tools/ToolShell';
import { TOOL_BY_SLUG } from '@/lib/toolCatalog';
import ImageResizerTool from '@/components/tools/ImageResizerTool';
import ImageTransformTool from '@/components/tools/ImageTransformTool';
import ExifViewerTool from '@/components/tools/ExifViewerTool';
import MetadataRemoverTool from '@/components/tools/MetadataRemoverTool';
import ColorPickerTool from '@/components/tools/ColorPickerTool';
import FaviconTool from '@/components/tools/FaviconTool';
import Base64Tool from '@/components/tools/Base64Tool';
import UrlCodecTool from '@/components/tools/UrlCodecTool';
import JsonFormatterTool from '@/components/tools/JsonFormatterTool';
import HashTool from '@/components/tools/HashTool';
import MimeCheckerTool from '@/components/tools/MimeCheckerTool';
import FileSizeTool from '@/components/tools/FileSizeTool';
import WordCounterTool from '@/components/tools/WordCounterTool';
import TextDiffTool from '@/components/tools/TextDiffTool';

const ELEMENTS = {
  'image-resizer': <ImageResizerTool />,
  'image-rotator': <ImageTransformTool mode="rotate" />,
  'image-flipper': <ImageTransformTool mode="flip" />,
  'image-metadata-viewer': <ExifViewerTool />,
  'metadata-remover': <MetadataRemoverTool />,
  'color-picker': <ColorPickerTool />,
  'favicon-generator': <FaviconTool />,
  'base64-encoder-decoder': <Base64Tool variant="text" />,
  'image-to-base64': <Base64Tool variant="image" />,
  'base64-to-image': <Base64Tool variant="decode-image" />,
  'url-encoder-decoder': <UrlCodecTool />,
  'json-formatter': <JsonFormatterTool />,
  'hash-generator': <HashTool />,
  'mime-type-checker': <MimeCheckerTool />,
  'file-size-converter': <FileSizeTool />,
  'word-counter': <WordCounterTool />,
  'text-diff-checker': <TextDiffTool />,
};

export const TOOL_ROUTES = Object.entries(ELEMENTS)
  .filter(([slug]) => TOOL_BY_SLUG[slug])
  .map(([slug, element]) => ({
    slug,
    element: <ToolShell tool={TOOL_BY_SLUG[slug]}>{element}</ToolShell>,
  }));