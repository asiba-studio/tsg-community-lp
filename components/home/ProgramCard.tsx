// components/ProgramCard.tsx

"use client";

import HalftoneHoverImage from "components/HalftoneHoverImage";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface ProgramCardProps {
    imageUrl: string;
    halftoneImageUrl: string;
    title: string;
    children: React.ReactNode;
    dateTime: string;
    location: string;
    reportSlug?: string; // nullable
}

export default function ProgramCard({
    imageUrl,
    halftoneImageUrl,
    title,
    children,
    dateTime,
    location,
    reportSlug,
}: ProgramCardProps) {
    const [isHovered, setIsHovered] = useState(false);

    const cardContent = (
        <div
            className="flex flex-wrap gap-2 gap-y-4 md:gap-4 relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="w-full md:w-44">
                <div className="hidden lg:block w-full">
                    <HalftoneHoverImage
                        normalSrc={imageUrl}
                        halftoneSrc={halftoneImageUrl}
                        alt="program image"
                    />
                </div>
                <div className="block lg:hidden">
                    <Image
                        src={imageUrl}
                        alt="program image"
                        width={1000}
                        height={1000}
                        className="w-full object-cover"
                        quality={80}
                        sizes="100vw"
                    />
                </div>
            </div>
            <div className="text-lg">|||</div>
            <div className="flex-1">
                <div className="font-bold text-lg">
                    {title}
                    {reportSlug && isHovered && (
                        <span className="ml-2 bg-primary px-2 py-1 mt-1">
                            ：レポートを見る→
                        </span>
                    )}
                </div>
                <div className="pt-3 md:pt-6">
                    {children}
                </div>
                <div className="w-full text-sm font-bold text-right mt-6">
                    {dateTime} @{location}
                </div>
            </div>

            {/* ホバー時の緑色ボックス */}
            {reportSlug && isHovered && (
                <div className="absolute inset-0 z-100 flex items-center justify-center pointer-events-none">
                    <div className="px-6 py-3 w-1/2 font-bold pointer-events-auto">
                        <Image
                            src="/gifs/green-mosaic.gif"
                            unoptimized
                            alt="green mosaic"
                            width={500}
                            height={140}
                            className="w-full -z-10 "
                        />
                    </div>
                </div>
            )}
        </div>
    );

    // reportSlugがある場合はLinkでラップ

    if (reportSlug) {
        return (
            <Link
                href={`/articles/${reportSlug}`}
                className="group block no-underline overflow-hidden hover:opacity-100"
            >
                {cardContent}
            </Link>
        );
    }

    return cardContent;
}
