import './globals.css';
import Script from 'next/script'
import { Footer } from '@/components/layout';
import { Metadata } from 'next';

export const metadata: Metadata = {
    // 基本情報
    title: {
        template: '%s | TSG Creative Lab.',
        default: 'TSG Creative Lab.'
    },
    description: 'Creative-Lab.は「何を、どのようにつくるか」だけでなく、「これから、どう生きていきたいか?」という問いを起点に、自分のクリエイションと生き方を結び直す場です。',

    // 言語・地域設定
    // metadataBase: new URL('https://your-domain.com'), // 実際のドメインに変更

    // OGP設定
    // 全体のOGP設定
    openGraph: {
        siteName: 'Creative Lab.',
        locale: 'ja_JP',
        type: 'website',
        title: 'Creative Lab. - クリエイティブラボ',
        description: 'Creative-Lab.は「何を、どのようにつくるか」だけでなく、「これから、どう生きていきたいか?」という問いを起点に、自分のクリエイションと生き方を結び直す場です。',
        url: 'https://your-domain.com',
        images: [
            {
                url: '/images/og/default-og.jpg', // デフォルトOGP画像
                width: 1200,
                height: 630,
                alt: 'Creative Lab. - 次世代クリエイター育成プログラム',
            },
        ],
    },

    // Twitter設定
    twitter: {
        card: 'summary_large_image',
        creator: '@asiba_studio',
        title: 'TSG Creative Lab.',
        description: 'Creative-Lab.は「何を、どのようにつくるか」だけでなく、「これから、どう生きていきたいか?」という問いを起点に、自分のクリエイションと生き方を結び直す場です。',
        images: ['/images/og/default-og.jpg'], // TwitterでもデフォルトOGP画像を使用
    },

    // アイコン設定
    icons: {
        icon: [
            { url: '/favicon.svg', type: 'image/svg+xml' },
        ],
        apple: [
            // { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
        ],
        // shortcut: '/favicon.ico', 
    },

    // PWA用マニフェスト（必要に応じて）
    manifest: '/manifest.json',

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

    // 検証用（必要に応じて）
    verification: {
        google: 'your-google-verification-code', // Google Search Consoleの認証コード
        // yandex: 'your-yandex-verification-code',
        // yahoo: 'your-yahoo-verification-code',
    },
};

export default function RootLayout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="ja">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
                <link href="https://fonts.googleapis.com/css2?family=Zen+Kaku+Gothic+New:wght@300;400;500;700;900&display=swap" rel="stylesheet" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500;600;700;800&display=swap" rel="stylesheet" />

                <Script
                    id="adobe-fonts"
                    strategy="beforeInteractive"
                >
                    {`
                        (function(d) {
                            var config = {
                                kitId: 'qpe7cyw', // ← 正しいKit IDに変更
                                scriptTimeout: 3000,
                                async: true
                            },
                            h=d.documentElement,t=setTimeout(function(){h.className=h.className.replace(/\\bwf-loading\\b/g,"")+" wf-inactive";},config.scriptTimeout),tk=d.createElement("script"),f=false,s=d.getElementsByTagName("script")[0],a;h.className+=" wf-loading";tk.src='https://use.typekit.net/'+config.kitId+'.js';tk.async=true;tk.onload=tk.onreadystatechange=function(){a=this.readyState;if(f||a&&a!="complete"&&a!="loaded")return;f=true;clearTimeout(t);try{Typekit.load(config)}catch(e){}};s.parentNode.insertBefore(tk,s)
                        })(document);
                    `}
                </Script>
            </head>
            <body className="font-sans">
                <div>
                    <main className='min-h-screen flex flex-col'>{children}</main>
                    <Footer />
                </div>
            </body>
        </html>
    );
}