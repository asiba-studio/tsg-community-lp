import Link from "next/link";
import Image from "next/image";
import HalftoneHoverImage from "components/HalftoneHoverImage";
import { Article } from "lib/types";

export default function ArticleCard({ article }: { article: Article }) {
    return (
        <Link href={`/articles/${article.slug}`} className="block no-underline hover:opacity-100">
            <div className="w-full aspect-square relative overflow-hidden">
                {article.coverImageHalftone ? (
                    <HalftoneHoverImage
                        normalSrc={article.coverImage}
                        halftoneSrc={article.coverImageHalftone}
                        alt={article.title}
                    />
                ) : (
                    <Image
                        src={article.coverImage}
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
