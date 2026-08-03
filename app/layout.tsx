import './globals.css';
import { Footer } from 'components/layout';
import { Metadata } from 'next';
import { SpeedInsights } from '@vercel/speed-insights/next'
import { GoogleAnalytics } from '@next/third-parties/google'

export const metadata: Metadata = {
    metadataBase: new URL('https://tsg-community.asiba.or.jp'), // ドメインを正しく設定
    title: {
        template: '%s | ASIBA Community Design-LAB.', // ASIBAを冠する
        default: 'TSG Community Design-LAB. | ASIBA'
    },
    description: 'Community Design-LAB.は、「やりたい」を起点に人が集まる理由をつくる、持続可能で、面白く、魅力的なコミュニティをつくるための3ヶ月間のラボプログラムです。',
    openGraph: {
        siteName: 'ASIBA Community Design-LAB.',
        locale: 'ja_JP',
        type: 'website',
        title: 'ASIBA Community Design-LAB. - 「やりたい」を起点に、人が集まる理由をつくる。',
        description: 'Community Design-LAB.は、「やりたい」を起点に人が集まる理由をつくる、持続可能で、面白く、魅力的なコミュニティをつくるための3ヶ月間のラボプログラムです。',
        url: 'https://tsg-community.asiba.or.jp',
        images: [{ url: '/images/og/default-og.jpg', width: 1200, height: 630 }],
    },
    twitter: {
        card: 'summary_large_image',
        creator: '@asiba_studio',
        title: 'ASIBA Community Design-LAB.',
        description: 'Community Design-LAB.は、「やりたい」を起点に人が集まる理由をつくる、持続可能で、面白く、魅力的なコミュニティをつくるための3ヶ月間のラボプログラムです。',
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
    keywords: ['コミュニティ', 'プログラム', '育成', 'Community Design', '場づくり', 'まちづくり'],
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
                "name": "TSG Community Design-LAB.",
                "publisher": { "@id": "https://asiba.or.jp/#organization" },
                "inLanguage": "ja"
            },
            {
                "@type": "WebPage",
                "@id": "https://tsg-community.asiba.or.jp/#webpage",
                "url": "https://tsg-community.asiba.or.jp",
                "name": "TSG Community Design-LAB.",
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