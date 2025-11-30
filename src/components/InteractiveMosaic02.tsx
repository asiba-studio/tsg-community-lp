'use client'

import { useRef, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import p5 from "p5";

export interface P5SketchProps {
  preload?: (p5: p5) => void;
  setup?: (p5: p5, canvasParentRef: Element) => void;
  draw?: (p5: p5) => void;
  windowResized?: (p5: p5) => void;
  [key: string]: any;
}

// Next.jsでp5を使うための動的インポート設定（SSR無効化）
// ローカル環境でreact-p5がインストールされている前提です
const Sketch = dynamic(() => import("react-p5"), {
  loading: () => <div className="w-full h-full bg-gray-100" />,
  ssr: false,
}) as React.ComponentType<P5SketchProps>;

export type MosaicSize = 'small' | 'medium' | 'large';

interface InteractiveMosaic02Props {
  width?: string | number;
  height?: string | number;
  showTitle?: boolean;
  className?: string;
  style?: React.CSSProperties;
  imageUrl: string;
  mosaicSize?: MosaicSize;
  targetFPS?: number;
  /**
   * アスペクト比 (幅 / 高さ)
   * 例: 正方形=1, 2350x1000=2.35
   * heightが指定されていない場合の高さ計算に使用されます
   */
  aspectRatio?: number;
}

function getMosaicIntensity(size: MosaicSize): [number, number, number] {
  switch (size) {
    case 'small':
      return [8.0, 4.0, 0.1];
    case 'medium':
      return [12.0, 6.0, 0.1];
    case 'large':
      return [24.0, 12.0, 0.2];
    default:
      return [12.0, 6.0, 0.1];
  }
}

export default function InteractiveMosaic02({
  width = '100%',
  height,
  showTitle = false,
  imageUrl,
  className = '',
  style = {},
  mosaicSize = 'medium',
  targetFPS = 30,
  aspectRatio = 1 // デフォルトは正方形 (1:1)
}: InteractiveMosaic02Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 400 });

  // 画像とシェーダー用の変数
  const loadedImageRef = useRef<p5.Image | null>(null);
  const imageLoadedRef = useRef(false);
  const mosaicShaderRef = useRef<p5.Shader | null>(null);
  const mosaicCounterRef = useRef(100.0);
  const prevMouseXRef = useRef(0);
  const prevMouseYRef = useRef(0);

  // パフォーマンス最適化用の変数
  const lastUpdateTimeRef = useRef(0);
  const needsRedrawRef = useRef(true);
  const frameIntervalRef = useRef(1000 / targetFPS);
  const isMouseInCanvasRef = useRef(false);
  const prevMosaicCounterRef = useRef(100.0);

  const mosaicCounterBase = 100.0;
  const mosaicCounterMin = -50.0;
  const mosaicIntensity = getMosaicIntensity(mosaicSize);

  useEffect(() => {
    frameIntervalRef.current = 1000 / targetFPS;
  }, [targetFPS]);

  // サイズ更新ロジック (aspectRatio propを使用)
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const titleHeight = showTitle ? 40 : 0;

        const availableWidth = Math.max(rect.width, 100);
        let finalWidth = availableWidth;
        let finalHeight;

        if (height) {
          if (typeof height === 'string' && height.includes('%')) {
            const parentHeight = rect.height || 400;
            finalHeight = (parentHeight * parseInt(height.replace('%', ''), 10) / 100) - titleHeight;
          } else {
            finalHeight = (typeof height === 'string' ? parseInt(height.replace('px', ''), 10) : height) - titleHeight;
          }
        } else {
          // height未指定時はアスペクト比から計算
          finalHeight = finalWidth / aspectRatio;
        }

        const newDimensions = {
          width: Math.max(finalWidth, 100),
          height: Math.max(finalHeight, 100)
        };

        if (newDimensions.width !== dimensions.width || newDimensions.height !== dimensions.height) {
          setDimensions(newDimensions);
          needsRedrawRef.current = true;
        }
      }
    };

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: observedWidth, height: observedHeight } = entry.contentRect;
        const titleHeight = showTitle ? 40 : 0;

        let finalWidth = Math.max(observedWidth, 100);
        let finalHeight;

        if (height) {
          if (typeof height === 'string' && height.includes('%')) {
            finalHeight = (observedHeight * parseInt(height.replace('%', ''), 10) / 100) - titleHeight;
          } else {
            finalHeight = (typeof height === 'string' ? parseInt(height.replace('px', ''), 10) : height) - titleHeight;
          }
        } else {
          // aspectRatioを使用
          finalHeight = finalWidth / aspectRatio;
        }

        const newDimensions = {
          width: Math.max(finalWidth, 100),
          height: Math.max(finalHeight, 100)
        };

        if (newDimensions.width !== dimensions.width || newDimensions.height !== dimensions.height) {
          setDimensions(newDimensions);
          needsRedrawRef.current = true;
        }
      }
    });

    if (containerRef.current) {
      updateDimensions();
      resizeObserver.observe(containerRef.current);
    }

    const timer = setTimeout(updateDimensions, 100);

    return () => {
      resizeObserver.disconnect();
      clearTimeout(timer);
    };
  }, [showTitle, aspectRatio, height, dimensions.width, dimensions.height]);

  const preload = (p5: p5) => {
    loadedImageRef.current = p5.loadImage(imageUrl, () => {
      imageLoadedRef.current = true;
      needsRedrawRef.current = true;
    }, (error: any) => {
      console.error("画像の読み込みに失敗しました:", error);
    });
  };

  const setup = (p5: p5, canvasParentRef: Element) => {
    const canvas = p5.createCanvas(dimensions.width, dimensions.height, (p5 as any).WEBGL);
    canvas.parent(canvasParentRef);

    p5.frameRate(targetFPS);

    const vert = `
      attribute vec3 aPosition;
      attribute vec2 aTexCoord;
      varying vec2 vTexCoord;

      void main() {
        vTexCoord = aTexCoord;
        vec4 positionVec4 = vec4(aPosition, 1.0);
        positionVec4.xy = positionVec4.xy * 2.0 - 1.0;
        gl_Position = positionVec4;
      }
    `;

    const frag = `
      precision mediump float;

      uniform sampler2D u_texture;
      uniform vec2 u_resolution;
      uniform float u_mosaicFactor;
      uniform vec3 u_mosaicSizes;
      varying vec2 vTexCoord;

      vec4 mosaic(sampler2D tex, vec2 uv, float intensity) {
        if (intensity <= 0.1) {
          return texture2D(tex, uv);
        }
        
        vec2 mosaicSize = vec2(intensity);
        vec2 gridCoord = floor(uv * u_resolution / mosaicSize);
        vec2 cellCenter = (gridCoord + 0.5) * mosaicSize / u_resolution;
        
        return texture2D(tex, cellCenter);
      }

      void main() {
        vec2 uv = vTexCoord;
        uv.y = 1.0 - uv.y;
        
        float x = uv.x;
        float baseIntensity;
        
        if (x < 0.33) {
          baseIntensity = u_mosaicSizes.x;
        } else if (x < 0.67) {
          baseIntensity = u_mosaicSizes.y;  
        } else {
          baseIntensity = u_mosaicSizes.z;
        }

        vec4 originalColor = texture2D(u_texture, uv);
        vec4 mosaicColor = mosaic(u_texture, uv, baseIntensity);
        
        vec4 finalColor = mix(originalColor, mosaicColor, u_mosaicFactor);
        
        float lineAlpha = 0.0;
        float distToLine1 = abs(x - 0.33) * u_resolution.x;
        float distToLine2 = abs(x - 0.67) * u_resolution.x;
        
        if (distToLine1 < 0.5 || distToLine2 < 0.5) {
          lineAlpha = 0.7 * u_mosaicFactor;
        }
        
        if (lineAlpha > 0.0) {
          finalColor = mix(finalColor, vec4(0.5, 0.5, 0.5, 1.0), lineAlpha);
        }
        
        gl_FragColor = finalColor;
      }
    `;

    try {
      mosaicShaderRef.current = p5.createShader(vert, frag);
    } catch (error) {
      console.error("シェーダーの作成に失敗しました:", error);
    }

    p5.noStroke();
    p5.background(245);
    mosaicCounterRef.current = mosaicCounterBase;
    needsRedrawRef.current = true;
  };

  const draw = (p5: p5) => {
    const currentTime = p5.millis();

    if (currentTime - lastUpdateTimeRef.current < frameIntervalRef.current) {
      return;
    }

    if (!loadedImageRef.current || !imageLoadedRef.current || !mosaicShaderRef.current) {
      return;
    }

    const isMouseInCanvas = p5.mouseX >= 0 && p5.mouseX <= p5.width &&
      p5.mouseY >= 0 && p5.mouseY <= p5.height;

    const mouseMovement = Math.abs(p5.mouseX - prevMouseXRef.current) + Math.abs(p5.mouseY - prevMouseYRef.current);
    const hasMovement = isMouseInCanvas && mouseMovement > 1.0;

    const stateChanged = isMouseInCanvas !== isMouseInCanvasRef.current || hasMovement;

    let counterChanged = false;
    const prevCounter = mosaicCounterRef.current;

    if (isMouseInCanvas) {
      if (hasMovement) {
        mosaicCounterRef.current -= 15.0;
      } else {
        mosaicCounterRef.current -= 5.0;
      }
    } else {
      mosaicCounterRef.current += 7.0;
    }

    mosaicCounterRef.current = p5.constrain(mosaicCounterRef.current, mosaicCounterMin, mosaicCounterBase);
    counterChanged = Math.abs(mosaicCounterRef.current - prevCounter) > 0.5;

    if (!needsRedrawRef.current && !stateChanged && !counterChanged) {
      return;
    }

    prevMouseXRef.current = p5.mouseX;
    prevMouseYRef.current = p5.mouseY;
    isMouseInCanvasRef.current = isMouseInCanvas;
    prevMosaicCounterRef.current = mosaicCounterRef.current;
    lastUpdateTimeRef.current = currentTime;
    needsRedrawRef.current = false;

    p5.background(245);
    p5.shader(mosaicShaderRef.current);

    const mosaicFactor = p5.constrain(mosaicCounterRef.current, 0.0, 100.0) / 100.0;

    mosaicShaderRef.current.setUniform('u_texture', loadedImageRef.current);
    mosaicShaderRef.current.setUniform('u_resolution', [dimensions.width, dimensions.height]);
    mosaicShaderRef.current.setUniform('u_mosaicFactor', mosaicFactor);
    mosaicShaderRef.current.setUniform('u_mosaicSizes', mosaicIntensity);

    p5.noStroke();
    p5.fill(255);
    p5.rect(-p5.width / 2, -p5.height / 2, p5.width, p5.height);
  };

  const windowResized = (p5: p5) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const titleHeight = showTitle ? 40 : 0;

      let newWidth = Math.max(rect.width, 100);
      let newHeight;

      if (height) {
        if (typeof height === 'string' && height.includes('%')) {
          newHeight = (rect.height * parseInt(height.replace('%', ''), 10) / 100) - titleHeight;
        } else {
          newHeight = (typeof height === 'string' ? parseInt(height.replace('px', ''), 10) : height) - titleHeight;
        }
      } else {
        newHeight = newWidth / aspectRatio;
      }

      p5.resizeCanvas(newWidth, newHeight);
      setDimensions({ width: newWidth, height: newHeight });
      needsRedrawRef.current = true;
    }
  };

  const calculatedHeight = height || `${dimensions.height + (showTitle ? 40 : 0)}px`;

  const getSizeText = (size: MosaicSize): string => {
    switch (size) {
      case 'small': return '細かい';
      case 'medium': return '中程度';
      case 'large': return '粗い';
      default: return '中程度';
    }
  };

  const containerStyle: React.CSSProperties = {
    width,
    height: calculatedHeight,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    ...style
  };

  return (
    <div
      ref={containerRef}
      className={className}
      style={containerStyle}
    >
      {showTitle && (
        <div style={{
          padding: '8px 12px',
          background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          fontSize: '14px',
          fontWeight: '600',
          flexShrink: 0,
          height: '40px',
          display: 'flex',
          alignItems: 'center'
        }}>
          モザイク効果（{getSizeText(mosaicSize)}）
        </div>
      )}
      <div style={{ flex: 1, position: 'relative', minHeight: 0 }}>
        <Sketch
          preload={preload}
          setup={setup}
          draw={draw}
          windowResized={windowResized}
        />
      </div>
    </div>
  );
}