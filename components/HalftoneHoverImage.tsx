'use client'

import Image from "next/image";
import { ReactNode, useEffect, useRef, useState } from "react";

interface HalftoneHoverImageProps {
    normalSrc: string;
    halftoneSrc: string;
    alt: string;
    aspectRatio?: number; // width / height（固定比率）
    sizeClassName?: string; // ブレークポイントごとに高さ/比率を変えたい場合はこちら（例: "h-dvh lg:h-auto lg:aspect-[1440/756]"）。指定時はaspectRatioのinline styleより優先される
    className?: string;
    overlay?: ReactNode; // 切り替えの影響を受けない固定オーバーレイ（例: タイトル）
    sizes?: string; // 実際の表示幅に合わせて呼び出し側で指定する（例: フルブリードのheroなら "100vw"）
}

// PC: hover中のみハーフトーン→通常画像（hover終了で戻る）。Mobile/Tablet: 画面内に入ったタイミングで一度だけ通常画像に切り替わる（appear）。
// PC/Mobileの分岐はCSS（lg:group-hover。カーソルが使える前提のためmd:ではなくlg:を境目にする）のみで行い、isRevealedの状態はmobile/tablet用のスクロール検知にのみ使う。
// InteractiveMosaic02（canvasでのリアルタイムモザイク処理）の後継として、
// MicroCMSのlp_settings（cover_square/cover_sq_halftone等）用に想定。
export default function HalftoneHoverImage({
    normalSrc,
    halftoneSrc,
    alt,
    aspectRatio = 1,
    sizeClassName,
    className = '',
    overlay,
    sizes = "(max-width: 768px) 50vw, 25vw",
}: HalftoneHoverImageProps) {
    const [isRevealed, setIsRevealed] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsRevealed(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.3 }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={containerRef}
            className={`group relative w-full overflow-hidden ${sizeClassName ?? ''} ${className}`}
            style={sizeClassName ? undefined : { aspectRatio }}
        >
            <Image
                src={halftoneSrc}
                alt={alt}
                fill
                className={`object-cover transition-opacity duration-700 ${isRevealed ? 'opacity-0' : 'opacity-100'} lg:opacity-100 lg:group-hover:opacity-0`}
                sizes={sizes}
            />
            <Image
                src={normalSrc}
                alt={alt}
                fill
                className={`object-cover transition-opacity duration-700 ${isRevealed ? 'opacity-100' : 'opacity-0'} lg:opacity-0 lg:group-hover:opacity-100`}
                sizes={sizes}
            />
            {overlay && (
                <div className="absolute inset-0 pointer-events-none">
                    {overlay}
                </div>
            )}
        </div>
    );
}
