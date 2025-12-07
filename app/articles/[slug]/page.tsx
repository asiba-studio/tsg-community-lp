import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Metadata } from 'next';
import React from 'react';
import { documentToReactComponents, Options } from '@contentful/rich-text-react-renderer';
import { BLOCKS, INLINES, MARKS } from '@contentful/rich-text-types';
import { getArticles } from 'lib/api';
import { Header, Menu } from 'components/layout';
import InteractiveMosaic02 from 'components/InteractiveMosaic02';
import { formatDateDot } from 'lib/date';
import { ContentList } from 'components/articles';

interface Props {
    params: Promise<{ slug: string }>;
}

async function getArticle(slug: string) {
    const articles = await getArticles();
    return articles.find((a) => a.slug === slug);
}

async function getRelatedPosts(currentSlug: string) {
    const articles = await getArticles();
    return articles
        .filter((a) => a.slug !== currentSlug)
        .slice(0, 3);
}

const customRenderOptions: Partial<Options> = {

    // 1. 📝 テキストノードの処理 (ラインブレイク対応)
    renderText: (text: string) => {
        // Shift + Enter (\n) を <br /> に変換するロジックは共通
        return text.split('\n').map((item, i) => (
            <React.Fragment key={i}>
                {item}
                {i < text.split('\n').length - 1 && <br />}
            </React.Fragment>
        ));
    },

    // 2. 🧱 ブロックノードの定義 (BLOCKS)
    renderNode: {
        [BLOCKS.PARAGRAPH]: (node: any, children: any) => (
            <p className="text-gray-700 leading-relaxed tracking-wide mb-6 text-sm md:text-base text-text-primary">{children}</p>
        ),
        [BLOCKS.HEADING_1]: (node: any, children: any) => (
            <h2 className="text-4xl font-bold mt-16 mb-6 border-l-4 border-red-500 pl-4">{children}</h2>
        ),
        [BLOCKS.HEADING_2]: (node: any, children: any) => (
            <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-10 mt-5 lg:mt-40 pb-2 leading-normal">{children}</h2>
        ),
        [BLOCKS.HEADING_3]: (node: any, children: any) => (
            <h3 className="text-xl font-bold mt-18 mb-5 font-sans">{children}</h3>
        ),
        [BLOCKS.HEADING_4]: (node: any, children: any) => (
            <h4 className="text-lg md:text-xl font-semibold text-text-primary mb-5 mt-5 leading-normal">{children}</h4>
        ),
        [BLOCKS.UL_LIST]: (node: any, children: any) => (
            <ul className="list-disc pl-5 mb-6 space-y-2">{children}</ul>
        ),
        [BLOCKS.OL_LIST]: (node: any, children: any) => (
            <ol className="list-decimal pl-5 mb-6 space-y-2">{children}</ol>
        ),
        [BLOCKS.LIST_ITEM]: (node: any, children: any) => (
            <li className="text-gray-700">{children}</li>
        ),
        [BLOCKS.QUOTE]: (node: any, children: any) => (
            <blockquote className="border-l-4 border-[#00ff00] pl-6 py-3 my-6 italic bg-gray-50 text-gray-600">
                {children}
            </blockquote>
        ),
        [BLOCKS.HR]: () => (
            <hr className="my-12 border-t border-gray-300" />
        ),
        [BLOCKS.TABLE]: (node: any, children: any) => (
            <div className="overflow-x-auto my-8 border border-gray-200 rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">{children}</table>
            </div>
        ),
        [BLOCKS.TABLE_ROW]: (node: any, children: any) => <tr className="divide-x divide-gray-200">{children}</tr>,
        [BLOCKS.TABLE_HEADER_CELL]: (node: any, children: any) => (
            <th className="px-6 py-3 bg-gray-100 text-left text-xs font-medium text-gray-700 uppercase">{children}</th>
        ),
        [BLOCKS.TABLE_CELL]: (node: any, children: any) => (
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{children}</td>
        ),

        // --- 🖼️ 埋め込みアセット (画像) ---
        [BLOCKS.EMBEDDED_ASSET]: (node: any) => {
            const target = node.data.target;
            if (!target || !target.fields) return null;

            // 【修正】withAllLocales: true の影響で、埋め込みアセットのフィールドもローカライズされたオブジェクトになっています
            // { ja: { ... }, en-US: { ... } } の形式から値を取り出すヘルパー
            const getLocalizedValue = (field: any) => {
                return field?.['ja'] || field?.['en-US'] || field;
            };

            const fileField = getLocalizedValue(target.fields.file);
            const titleField = getLocalizedValue(target.fields.title);

            // ファイル情報がない場合は何も表示しない
            if (!fileField || !fileField.url) return null;

            const imageUrl = fileField.url.startsWith('//') ? `https:${fileField.url}` : fileField.url;
            const width = fileField.details?.image?.width || 800;
            const height = fileField.details?.image?.height || 600;

            // ----------------------------------------------------
            // 💡 特殊コマンドの解析ロジック
            // ----------------------------------------------------
            let displayCaption = titleField;
            // デフォルトはやや広めの幅を設定
            let customWidthClass = 'max-w-4xl';
            let showCaption = false;

            // 抽象サイズと Tailwind max-w クラスのマッピング
            const sizeMap: { [key: string]: string } = {
                'xs': 'max-w-xs',
                'sm': 'max-w-sm',
                'md': 'max-w-xl',      // 例: md は xl にマッピング
                'lg': 'max-w-3xl',
                'full': 'w-full max-w-none', // full の場合は max-w を無効化
            };

            // 1. 幅コマンドの解析: [w:値]
            // 値は、アルファベット (sm, md) またはピクセル値 (250px)
            const widthMatch = titleField.match(/\[w:(sm|md|lg|full)\]/);
            if (widthMatch) {
                const value = widthMatch[1];

                // if/else if 形式で静的なクラス名を割り当てる
                if (value === 'sm') {
                    customWidthClass = 'max-w-50'; // 例: 顔写真など小さな画像
                } else if (value === 'md') {
                    customWidthClass = 'max-w-80'; // 例: 中程度の画像
                } else if (value === 'lg') {
                    customWidthClass = 'max-w-130'; // 例: 広めの画像
                } else if (value === 'full') {
                    customWidthClass = 'w-full max-w-none'; // 全幅（親要素いっぱい）
                }
                // デフォルトは 'max-w-4xl' のまま維持
            }

            // 2. キャプション表示コマンドの解析: [caption]
            if (titleField.includes('[caption]')) {
                showCaption = true;
            }

            // 3. キャプションからコマンド部分を削除
            // [w:...] と [caption] を削除
            displayCaption = titleField
                .replace(/\[w:(sm|md|lg|full)\]/g, '')
                .replace(/\[caption\]/g, '')
                .trim();

            // コンテナクラス: 幅クラスと中央寄せ（w-full/max-w-none 以外の場合）を適用
            // w-full が適用されている場合は、mx-auto は不要
            const isFullWidth = customWidthClass.includes('w-full');
            const containerClasses = `my-2 flex w-full ${customWidthClass}`;

            return (
                <div className={containerClasses}>
                    <Image
                        src={imageUrl}
                        width={width}
                        height={height}
                        alt={titleField || 'Embedded Image'}
                        className="w-full h-auto object-cover"
                        unoptimized={true}
                    />

                    {/* キャプション表示の制御 */}
                    {displayCaption && showCaption && (
                        <p className="text-sm text-gray-500 mt-2">{displayCaption}</p>
                    )}
                </div>
            );
        },

        // --- 外部リンク ---
        [INLINES.HYPERLINK]: (node: any, children: any) => {
            return <a href={node.data.uri} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline transition-colors">{children}</a>;
        },

        // --- 内部リンク (エントリー) ---
        [INLINES.ENTRY_HYPERLINK]: (node: any, children: any) => {
            // 内部リンクは、Contentful IDからNext.jsのパスに変換するロジックが必要です
            const entryId = node.data.target?.sys?.id;
            // 🚨 ここを実際のルーティングに合わせる
            const linkPath = `/articles/${entryId}`;

            return <a href={linkPath} className="text-green-600 hover:underline transition-colors">{children}</a>;
        },
        // INLINES.ASSET_HYPERLINK: (node: any, children: any) => { /* ダウンロードリンクなど */ },

        // --- 🔗 埋め込みエントリー ---
        // BLOCKS.EMBEDDED_ENTRY: (node: any) => { /* 内部リンクのカスタムコンポーネント定義 */ },
    },

    // 3. ✍️ テキストマークアップの定義
    renderMark: {
        [MARKS.BOLD]: children => <strong className="font-bold font-dnp">{children}</strong>,
        [MARKS.ITALIC]: children => <em className="italic">{children}</em>,
        [MARKS.UNDERLINE]: children => <u className="underline">{children}</u>,
        [MARKS.CODE]: children => <code className="bg-gray-100 p-1 rounded text-sm font-mono text-red-700">{children}</code>,
    },
};



export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const article = await getArticle(slug);

    if (!article) {
        return {
            title: 'Article Not Found',
        };
    }

    return {
        title: article.title,
        description: article.excerpt,
        openGraph: {
            title: article.title,
            description: article.excerpt,
            images: article.headerImage ? [
                {
                    url: article.headerImage,
                    width: 2350,
                    height: 1000,
                    alt: article.title,
                }
            ] : [],
            type: 'article',
            publishedTime: article.date,
            authors: [],
            tags: article.tags,
        },
        twitter: {
            card: 'summary_large_image',
            title: article.title,
            description: article.excerpt,
            images: article.headerImage ? [article.headerImage] : [],
        },
    };
}

export async function generateStaticParams() {
    const articles = await getArticles();
    return articles.map((article) => ({
        slug: article.slug,
    }));
}

export default async function ArticlePage({ params }: Props) {
    const { slug } = await params;
    const article = await getArticle(slug);

    if (!article) {
        notFound();
    }

    const relatedArticles = await getRelatedPosts(slug);
    const contentBody = article.body;

    return (
        <article className="w-full pb-50">
            <Header />

            {/* ヘッダー部分 */}
            <header className="mb-8">
                <div className="relative w-full -mt-5">
                    {/* カバー画像 (Header Image: 2350x1000) */}
                    {article.headerImage && (
                        <div>
                            {/* PC: Mosaic (aspect ratio 2.35) */}
                            <div className='hidden lg:block w-full'>
                                <InteractiveMosaic02
                                    imageUrl={article.headerImage}
                                    width="100%"
                                    mosaicSize='large'
                                    aspectRatio={2.35}
                                />
                            </div>
                            {/* Mobile: 通常画像 */}
                            <div className='block lg:hidden w-full aspect-[2.35/1] relative'>
                                <Image
                                    src={article.headerImage}
                                    alt={article.title}
                                    fill
                                    className="object-cover"
                                    priority
                                    unoptimized={true}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </header>

            <div className="w-full p-[14px] lg:p-[4vw] flex flex-col lg:flex-row gap-[8vw]">
                <div className='flex-1 flex justify-center'>
                    <div className='max-w-200 w-full'>

                        {/* 記事ヘッダー情報（SP用・本文上） */}
                        <section className='text-fluid-base'>
                            <h1 className='font-sans font-bold text-fluid-4xl leading-relaxed relative mb-8'>
                                {article.title}
                            </h1>
                            <div className='mb-4 leading-normal flex justify-end text-gray-500 font-en'>
                                {article.date ? formatDateDot(article.date) : ''}
                            </div>

                            {/* SPのみ表示する情報 */}
                            <div className="lg:hidden mb-10">
                                <div className='mb-6 leading-normal text-gray-700 font-medium'>
                                    {article.excerpt}
                                </div>
                                <div className='leading-normal flex justify-start gap-2 flex-wrap'>
                                    {article.tags && article.tags.length > 0 ? (
                                        article.tags.map((tag, index) => (
                                            <span key={index} className="text-gray-500 text-sm bg-gray-50 px-2 py-1 rounded">
                                                #{tag}
                                            </span>
                                        ))
                                    ) : null}
                                </div>
                            </div>
                        </section>

                        <Menu className='lg:hidden mt-4 mb-50 translate-x-[14px]' />

                        {/* 記事本文 (Rich Text) */}
                        <div className="prose prose-lg max-w-none mt-8 lg:mt-20">
                            {contentBody ? documentToReactComponents(contentBody, customRenderOptions) : (
                                <p className="text-gray-500 py-10 text-center">No content available</p>
                            )}
                        </div>

                        {article.link && (
                            <div className="mt-40 text-left">
                                <a
                                    href={article.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center bg-black text-white px-8 py-3 font-bold font-en hover:bg-gray-800 transition-colors duration-300"
                                >
                                    Read on Note
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                </a>
                            </div>
                        )}
                    </div>
                </div>

                {/* サイドバー（PC用） */}
                <div className='w-full lg:w-[20%]'>
                    <section className='h-[300vh] relative hidden lg:block'>
                        <div className='text-fluid-sm sticky top-44 h-screen'>
                            <div className='border border-border px-4 py-5 bg-white/50 backdrop-blur-sm'>
                                <div className='font-en underline mb-2 text-gray-500'>
                                    Title
                                </div>
                                <div className='mb-6 leading-normal font-bold'>
                                    {article.title}<br />
                                    {article.subtitle && <span className="text-gray-600 font-normal mt-1 block text-sm">{article.subtitle}</span>}
                                </div>

                                <div className='font-en underline mb-2 text-gray-500'>
                                    Date
                                </div>
                                <div className='mb-6 leading-normal font-en'>
                                    {article.date ? formatDateDot(article.date) : ''}
                                </div>

                                {article.excerpt && (
                                    <>
                                        <div className='font-en underline mb-2 text-gray-500'>
                                            Summary
                                        </div>
                                        <div className='mb-6 leading-normal text-gray-700 text-sm'>
                                            {article.excerpt}
                                        </div>
                                    </>
                                )}

                                <div className='font-en underline mb-2 text-gray-500'>
                                    Keywords
                                </div>
                                <div className='leading-normal font-en'>
                                    {article.tags && article.tags.length > 0 ? (
                                        article.tags.map((tag, index) => (
                                            <div key={index} className="mb-1 text-gray-600 hover:text-black transition-colors">
                                                # {tag}
                                            </div>
                                        ))
                                    ) : (
                                        <span className='text-gray-400'>-</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>

                    <Menu className='hidden lg:block translate-x-[4vw]' />

                    {/* 関連記事 */}
                    {relatedArticles.length > 0 && (
                        <section className="w-full section-spacing border-t border-border mt-40 lg:mt-100 pt-10">
                            <h2 className="font-en font-bold text-fluid-2xl leading-none relative inline-block mb-12">
                                Related Articles
                            </h2>
                            <div className="w-full">
                                <div className="hidden lg:block w-full">
                                    <ContentList
                                        contents={relatedArticles}
                                        basePath="/articles"
                                        columns={1}
                                        gap={80}
                                        enableMosaic={true}
                                        mosaicSize='small'
                                    />
                                </div>
                                <div className="block lg:hidden w-full">
                                    <ContentList
                                        contents={relatedArticles}
                                        basePath="/articles"
                                        columns={1}
                                        gap={60}
                                        enableMosaic={false}
                                    />
                                </div>
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </article >
    );
}