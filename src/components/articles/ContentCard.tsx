// src/components/ContentCard.tsx
import Link from 'next/link';
import Image from 'next/image';
import { formatDateDot } from '@/lib/date';
import { ContentItem } from '@/lib/types'; // 統一した型をインポート
import InteractiveMosaic02, { MosaicSize } from '../InteractiveMosaic02';

interface Props {
    content: ContentItem; // 型を統一
    featured?: boolean;
    basePath: '/articles' | '/news' | '/open-talks';
    description?: boolean;
    enableMosaic?: boolean;
    mosaicSize?: MosaicSize;
}

export default function ContentCard({
    content,
    featured = false,
    basePath,
    description = false,
    enableMosaic = true,
    mosaicSize = 'medium'
}: Props) {

    let href = `${basePath}/${content.slug}`;
    if (content.link) {
        href = content.link;
    }

    // 【重要】Contentfulの画像URL対応
    // Contentfulの画像URLが "//images.ctfassets.net/..." のように返ってくる場合の対策
    const imageUrl = content.coverImage.startsWith('//')
        ? `https:${content.coverImage}`
        : content.coverImage;

    return (
        <Link
            href={href}
            className="group block no-underline overflow-hidden hover:opacity-100"
            target={content.link ? '_blank' : '_self'}
        >
            <article>
                {/* Cover Image Area */}
                <div className="relative w-full aspect-square">
                    {/* ↑ aspect-square (1x1) を親divに強制指定します。
                      Contentfulから来る画像が1x1でない場合でもレイアウト崩れを防ぐためです。
                      もし画像自体が厳密に1x1なら aspect-auto でも構いません。
                    */}

                    {enableMosaic ? (
                        <InteractiveMosaic02
                            imageUrl={imageUrl} // 正規化したURLを渡す
                            width="100%"
                            mosaicSize={mosaicSize}
                        />
                    ) : (
                        <Image
                            src={imageUrl} // 正規化したURLを渡す
                            alt={content.title}
                            width={750}
                            height={750}
                            className="w-full h-full object-cover" // h-fullに変更してaspect比に追従
                            priority={featured}
                            quality={80}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    )}

                    {/* Tags */}
                    {content.tags && content.tags.length > 0 && (
                        <div className="absolute bottom-1.5 left-2 flex flex-col gap-1 z-10">
                            {content.tags.slice(0, 3).map((tag) => (
                                <span
                                    key={tag}
                                    className="text-gray-500 leading-none font-en font-medium 
                                        text-fluid-sm transition-colors duration-200 
                                        group-hover:text-gray-100 bg-white/10 backdrop-blur-[2px] px-1 rounded-sm"
                                // ↑ 視認性向上のため、背景ぼかしなどを少し入れるとContentfulの様々な画像に対応しやすいです
                                >
                                    # {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Date */}
                    {basePath !== '/open-talks' && (
                        <div className="
                            absolute bottom-1.5 right-2 
                            text-gray-500 font-en font-medium 
                            leading-none text-fluid-sm 
                            transition-colors duration-200 
                            group-hover:text-gray-100
                            z-10
                        ">
                            {formatDateDot(content.date)}
                        </div>
                    )}
                </div>

                {/* Info */}
                <div>
                    {/* Subtitle */}
                    {content.subtitle && (
                        <p className="font-medium text-fluid-base mt-1">
                            {content.subtitle}
                        </p>
                    )}

                    {/* Title */}
                    <h3 className="font-bold mt-2 text-fluid-lg">
                        {content.title}
                    </h3>

                    {/* Description - RichText由来のexcerptを表示 */}
                    {description && content.excerpt && (
                        <p className="text-fluid-sm text-gray-600 mt-6 w-2/3 line-clamp-3">
                            {/* line-clampで行数制限をかけると安全です */}
                            {content.excerpt}
                        </p>
                    )}
                </div>
            </article>
        </Link>
    );
}