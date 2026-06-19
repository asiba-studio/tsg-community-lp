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
  objectFit?: 'cover' | 'contain';
  background?: string;
}

export default function InteractiveMosaic02({
  width = '100%',
  height,
  imageUrl,
  className = '',
  style = {},
  mosaicSize = 'medium',
  aspectRatio = 1,
  objectFit = 'cover',
  background = '#ffffff',
}: InteractiveMosaic02Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const isHoveredRef = useRef(false);
  const mosaicSizeRef = useRef(mosaicSize);
  const objectFitRef = useRef(objectFit);
  const backgroundRef = useRef(background);

  const [loadError, setLoadError] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 800, height: 800 });
  const lastDimsRef = useRef({ width: 800, height: 800 });

  useEffect(() => { mosaicSizeRef.current = mosaicSize; }, [mosaicSize]);
  useEffect(() => { objectFitRef.current = objectFit; }, [objectFit]);
  useEffect(() => { backgroundRef.current = background; }, [background]);

  // canvas に描画する関数
  const drawCanvas = () => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img || !img.complete) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    // 背景塗りつぶし
    ctx.fillStyle = backgroundRef.current;
    ctx.fillRect(0, 0, w, h);

    // contain / cover に応じた描画領域を算出
    let drawX = 0, drawY = 0, drawW = w, drawH = h;
    if (objectFitRef.current === 'contain') {
      const imgAspect = img.naturalWidth / img.naturalHeight;
      const canvasAspect = w / h;
      if (imgAspect > canvasAspect) {
        drawW = w;
        drawH = Math.round(w / imgAspect);
        drawX = 0;
        drawY = Math.round((h - drawH) / 2);
      } else {
        drawH = h;
        drawW = Math.round(h * imgAspect);
        drawX = Math.round((w - drawW) / 2);
        drawY = 0;
      }
    }

    if (isHoveredRef.current) {
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(img, drawX, drawY, drawW, drawH);
      return;
    }

    const [sizeL, sizeC, sizeR] = getMosaicBlockSize(mosaicSizeRef.current);
    const ax1 = drawX + Math.floor(drawW * 0.33);
    const ax2 = drawX + Math.floor(drawW * 0.67);

    const sections = [
      { x: drawX, sw: ax1 - drawX,       blockSize: sizeL },
      { x: ax1,   sw: ax2 - ax1,          blockSize: sizeC },
      { x: ax2,   sw: drawX + drawW - ax2, blockSize: sizeR },
    ];

    for (const s of sections) {
      if (s.sw <= 0) continue;
      const srcX = ((s.x - drawX) / drawW) * img.naturalWidth;
      const srcW = (s.sw / drawW) * img.naturalWidth;

      if (s.blockSize <= 1) {
        ctx.imageSmoothingEnabled = true;
        ctx.drawImage(img, srcX, 0, srcW, img.naturalHeight, s.x, drawY, s.sw, drawH);
      } else {
        const pw = Math.max(1, Math.ceil(s.sw / s.blockSize));
        const ph = Math.max(1, Math.ceil(drawH / s.blockSize));
        const tmp = document.createElement('canvas');
        tmp.width = pw;
        tmp.height = ph;
        tmp.getContext('2d')!.drawImage(img, srcX, 0, srcW, img.naturalHeight, 0, 0, pw, ph);
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(tmp, s.x, drawY, s.sw, drawH);
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
