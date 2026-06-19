'use client'

import { useRef, useEffect, useState } from "react";

export type MosaicSize = 'small' | 'medium' | 'large';

// ブロックサイズ（px）: [左エリア, 中央エリア, 右エリア]
function getMosaicBlockSize(size: MosaicSize): [number, number, number] {
  switch (size) {
    case 'small':  return [8, 4, 1];
    case 'medium': return [12, 6, 1];
    case 'large':  return [24, 12, 2];
    default:       return [12, 6, 1];
  }
}

interface InteractiveMosaic02Props {
  width?: string | number;
  height?: string | number;
  showTitle?: boolean;   // API互換のため残す
  className?: string;
  style?: React.CSSProperties;
  imageUrl: string;
  mosaicSize?: MosaicSize;
  targetFPS?: number;    // API互換のため残す
  aspectRatio?: number;
}

export default function InteractiveMosaic02({
  width = '100%',
  height,
  imageUrl,
  className = '',
  style = {},
  mosaicSize = 'medium',
  aspectRatio = 1,
}: InteractiveMosaic02Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const isHoveredRef = useRef(false);
  const mosaicSizeRef = useRef(mosaicSize);

  const [loadError, setLoadError] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 800, height: 800 });
  const lastDimsRef = useRef({ width: 800, height: 800 });

  useEffect(() => { mosaicSizeRef.current = mosaicSize; }, [mosaicSize]);

  // canvas に描画する関数
  const drawCanvas = () => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img || !img.complete) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    if (isHoveredRef.current) {
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(img, 0, 0, w, h);
      return;
    }

    const [sizeL, sizeC, sizeR] = getMosaicBlockSize(mosaicSizeRef.current);
    const x1 = Math.floor(w * 0.33);
    const x2 = Math.floor(w * 0.67);

    const sections = [
      { x: 0,  sw: x1,     blockSize: sizeL },
      { x: x1, sw: x2 - x1, blockSize: sizeC },
      { x: x2, sw: w - x2,  blockSize: sizeR },
    ];

    for (const s of sections) {
      if (s.sw <= 0) continue;
      const srcX = (s.x / w) * img.naturalWidth;
      const srcW = (s.sw / w) * img.naturalWidth;

      if (s.blockSize <= 1) {
        ctx.imageSmoothingEnabled = true;
        ctx.drawImage(img, srcX, 0, srcW, img.naturalHeight, s.x, 0, s.sw, h);
      } else {
        const pw = Math.max(1, Math.ceil(s.sw / s.blockSize));
        const ph = Math.max(1, Math.ceil(h / s.blockSize));
        const tmp = document.createElement('canvas');
        tmp.width = pw;
        tmp.height = ph;
        tmp.getContext('2d')!.drawImage(img, srcX, 0, srcW, img.naturalHeight, 0, 0, pw, ph);
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(tmp, s.x, 0, s.sw, h);
      }
    }
  };

  // 画像のロード（crossOrigin → フォールバック）
  useEffect(() => {
    setLoadError(false);
    imageRef.current = null;

    if (!imageUrl) return;

    const loadWith = (crossOrigin: boolean, onFail: () => void) => {
      const img = new window.Image();
      if (crossOrigin) img.crossOrigin = 'anonymous';
      img.onload = () => {
        imageRef.current = img;
        drawCanvas();
      };
      img.onerror = onFail;
      img.src = imageUrl;
    };

    // crossOrigin あり → なし → エラー の順で試行
    loadWith(true, () => loadWith(false, () => setLoadError(true)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageUrl]);

  // dimensions または mosaicSize が変わったときに再描画
  useEffect(() => {
    drawCanvas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dimensions, mosaicSize]);

  // ResizeObserver
  useEffect(() => {
    const update = (w: number) => {
      const next = {
        width: Math.max(Math.round(w), 100),
        height: Math.max(Math.round(w / aspectRatio), 100),
      };
      if (next.width !== lastDimsRef.current.width || next.height !== lastDimsRef.current.height) {
        lastDimsRef.current = next;
        setDimensions(next);
      }
    };

    const ro = new ResizeObserver(entries => {
      for (const e of entries) update(e.contentRect.width);
    });

    if (containerRef.current) {
      ro.observe(containerRef.current);
      update(containerRef.current.getBoundingClientRect().width);
    }

    return () => ro.disconnect();
  }, [aspectRatio]);

  const containerStyle: React.CSSProperties = {
    width,
    height: height || `${dimensions.height}px`,
    overflow: 'hidden',
    ...style,
  };

  if (loadError) {
    return (
      <div ref={containerRef} className={className} style={containerStyle}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imageUrl} alt="" className="w-full h-full object-cover" />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={className}
      style={containerStyle}
      onMouseEnter={() => { isHoveredRef.current = true; drawCanvas(); }}
      onMouseLeave={() => { isHoveredRef.current = false; drawCanvas(); }}
    >
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        style={{ width: '100%', height: '100%', display: 'block' }}
      />
    </div>
  );
}
