import './globals.css';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';

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
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet" />
            </head>
            <body>
                <div>
                    <main>{children}</main>
                    <Footer />
                </div>
            </body>
        </html>
    );
}
