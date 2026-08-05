import Link from "next/link";
import Image from "next/image";
import HalftoneHoverImage from "components/HalftoneHoverImage";
import { Article } from "lib/types";

export default function ArticleCard({ article }: { article: Article }) {
    const hasCover = Boolean(article.coverImage);
    const normalSrc = hasCover ? article.coverImage : '/images/home-community/placeholder.png';
    const halftoneSrc = hasCover ? article.coverImageHalftone : '/images/home-community/placeholder-halftone.png';

    return (
        <Link href={`/articles/${article.slug}`} className="block no-underline hover:opacity-100">
            <div className="w-full aspect-square relative overflow-hidden">
                {halftoneSrc ? (
                    <HalftoneHoverImage
                        normalSrc={normalSrc}
                        halftoneSrc={halftoneSrc}
                        alt={article.title}
                    />
                ) : (
                    <Image
                        src={normalSrc}
                        alt={article.title}
                        fill
                        className="object-cover"
                    />
                )}
            </div>
            <div className="space-y-3 mt-3">
                {(article.lpSubtitle || article.subtitle) && (
                    <div className="font-bold text-sm leading-normal">{article.lpSubtitle || article.subtitle}</div>
                )}
                <div className="text-base leading-normal">{article.title}</div>
            </div>
        </Link>
    );
}
