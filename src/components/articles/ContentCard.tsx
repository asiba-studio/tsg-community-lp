// src/components/ContentCard.tsx
import Link from 'next/link';
import Image from 'next/image';
import { formatDateDot } from '@/lib/date';
import { Article, News, OpenTalk } from '@/lib/types';
import InteractiveMosaic02, { MosaicSize } from '../InteractiveMosaic02';

// 共通のプロパティを持つ型を定義
type ContentItem = Article | News | OpenTalk;

interface Props {
    content: ContentItem;
    featured?: boolean;
    basePath: '/articles' | '/news' | '/open-talks';
    description?: boolean;
    enableMosaic?: boolean; // モザイク処理の有無を制御
    mosaicSize?: MosaicSize; // モザイクサイズを制御
}

export default function ContentCard({ 
    content, 
    featured = false, 
    basePath, 
    description = false,
    enableMosaic = true, // デフォルトはモザイク処理あり
    mosaicSize = 'medium' // デフォルトは中程度のモザイク
}: Props) {

    let href = `${basePath}/${content.slug}`;
    if ('link' in content && content.link) {
        href = content.link;
    }


    return (
        <Link
            href={href}
            className="group block no-underline overflow-hidden hover:opacity-100"
            target={'link' in content && content.link ? '_blank' : '_self'}
        >
            <article>
                {/* Cover Image */}
                <div className="relative w-full">
                    {enableMosaic ? (
                        <InteractiveMosaic02
                            imageUrl={content.coverImage}
                            width="100%"
                            mosaicSize={mosaicSize}
                        />
                    ) : (
                        <Image
                            src={content.coverImage}
                            alt={content.title}
                            width={750}
                            height={750}
                            className="w-full h-auto object-cover"
                            priority={featured}
                            quality={80}
                            sizes="100vw"
                        />
                    )}

                    {/* Tags */}
                    <div className="absolute bottom-1.5 left-2 flex flex-col gap-1">
                        {content.tags?.slice(0, 3).map((tag) => (
                            <span
                                key={tag}
                                className="text-gray-500 leading-none font-en font-medium 
                                    text-fluid-sm transition-colors duration-200 
                                    group-hover:text-gray-100"
                            >
                                # {tag}
                            </span>
                        ))}
                    </div>

                    {/* Date */}
                    {basePath !== '/open-talks' && (
                        <div className="
                            absolute bottom-1.5 right-2 
                            text-gray-500 font-en font-medium 
                            leading-none text-fluid-sm 
                            transition-colors duration-200 
                            group-hover:text-gray-100
                        ">
                            {formatDateDot(content.date)}
                        </div>
                    )}
                </div>

                {/* Info */}
                <div>
                    {/* Subtitle */}
                    <p className="font-medium text-fluid-base mt-1">
                        {content.subtitle}
                    </p>

                    {/* Title */}
                    <h3 className="font-bold mt-2 text-fluid-lg">
                        {content.title}
                    </h3>

                    {/* Description - 条件付きで表示 */}
                    {description && content.excerpt && (
                        <p className="text-fluid-sm text-gray-600 mt-6 w-2/3">
                            {content.excerpt}
                        </p>
                    )}
                </div>
            </article>
        </Link>
    );
}