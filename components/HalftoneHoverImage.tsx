'use client'

import Image from "next/image";

interface HalftoneHoverImageProps {
    normalSrc: string;
    halftoneSrc: string;
    alt: string;
    aspectRatio?: number; // width / height
    className?: string;
}

// ホバー前はハーフトーン画像、ホバー後は通常画像を表示するシンプルな切り替えコンポーネント。
// InteractiveMosaic02（canvasでのリアルタイムモザイク処理）の後継として、
// MicroCMSのlp_settings（cover_square/cover_sq_halftone等）用に想定。
export default function HalftoneHoverImage({
    normalSrc,
    halftoneSrc,
    alt,
    aspectRatio = 1,
    className = '',
}: HalftoneHoverImageProps) {
    return (
        <div
            className={`relative w-full overflow-hidden group ${className}`}
            style={{ aspectRatio }}
        >
            <Image
                src={halftoneSrc}
                alt={alt}
                fill
                className="object-cover transition-opacity duration-300 opacity-100 group-hover:opacity-0"
                sizes="(max-width: 768px) 50vw, 25vw"
            />
            <Image
                src={normalSrc}
                alt={alt}
                fill
                className="object-cover transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                sizes="(max-width: 768px) 50vw, 25vw"
            />
        </div>
    );
}
