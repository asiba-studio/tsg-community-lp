import './globals.css';
import { Footer } from 'components/layout';
import { Metadata } from 'next';
import { SpeedInsights } from '@vercel/speed-insights/next'
import { GoogleAnalytics } from '@next/third-parties/google'

export const metadata: Metadata = {
    metadataBase: new URL('https://tsg-community.asiba.or.jp'), // ドメインを正しく設定
    title: {
        template: '%s | ASIBA Creative Lab.', // ASIBAを冠する
        default: 'TSG Creative Lab. | ASIBA'
    },
    description: 'Creative-Lab.は「何を、どのようにつくるか」だけでなく、「これから、どう生きていきたいか?」という問いを起点に、自分のクリエイションと生き方を結び直す場です。',
    openGraph: {
        siteName: 'ASIBA Creative Lab.',
        locale: 'ja_JP',
        type: 'website',
        title: 'ASIBA Creative Lab. - つくることは、生きること。',
        description: 'Creative-Lab.は「何を、どのようにつくるか」だけでなく、「これから、どう生きていきたいか?」という問いを起点に、自分のクリエイションと生き方を結び直す場です。',
        url: 'https://tsg-community.asiba.or.jp',
        images: [{ url: '/images/og/default-og.jpg', width: 1200, height: 630 }],
    },
    twitter: {
        card: 'summary_large_image',
        creator: '@asiba_studio',
        title: 'ASIBA Creative Lab.',
        description: 'Creative-Lab.は「何を、どのようにつくるか」だけでなく、「これから、どう生きていきたいか?」という問いを起点に、自分のクリエイションと生き方を結び直す場です。',
        images: ['/images/og/default-og.jpg'],
    },
    icons: {
        icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
    },
    // PWA用マニフェスト（必要に応じて）
    // manifest: '/manifest.json',

    // 検索エンジン設定
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },

    // その他の設定
    category: 'education', // サイトのカテゴリ
    keywords: ['クリエイティブ', 'プログラム', '育成', 'Creative Lab', 'デザイン', 'アート'],
};

export default function RootLayout({
    children
}: {
    children: React.ReactNode
}) {
    // 構造化データの定義
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Organization",
                "@id": "https://asiba.or.jp/#organization", // 共通ID
                "name": "ASIBA Studio",
                "url": "https://asiba.or.jp",
                "logo": "https://asiba.or.jp/icon.png"
            },
            {
                "@type": "WebSite",
                "@id": "https://tsg-community.asiba.or.jp/#website",
                "url": "https://tsg-community.asiba.or.jp",
                "name": "TSG Creative Lab.",
                "publisher": { "@id": "https://asiba.or.jp/#organization" },
                "inLanguage": "ja"
            },
            {
                "@type": "WebPage",
                "@id": "https://tsg-community.asiba.or.jp/#webpage",
                "url": "https://tsg-community.asiba.or.jp",
                "name": "TSG Creative Lab.",
                "isPartOf": { "@id": "https://tsg-community.asiba.or.jp/#website" },
                "description": metadata.description
            }
        ]
    };
    return (
        <html lang="ja">
            <head>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
                <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;700;900&display=swap" rel="stylesheet" />
            </head>
            <body className="font-sans">
                <div>
                    <main className='min-h-screen flex flex-col'>{children}</main>
                    <Footer />
                </div>
                <SpeedInsights />
            </body>
            <GoogleAnalytics gaId="G-7WM09XRQ9L" />
        </html>
    );
}