import './globals.css';
import { Footer } from '@/components/footer';
import Script from 'next/script';
import TypekitLoader from './TypekitLoader';

export const metadata = {
    title: {
        template: '%s | Netlify',
        default: 'Netlify Starter'
    }
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
                <link rel="preconnect" href="https://use.typekit.net" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500;600;700;800&display=swap" rel="stylesheet" />
            </head>
            <body>
                <div>
                    <TypekitLoader />
                    <main>{children}</main>
                    <Footer />
                </div>
            </body>
        </html>
    );
}
