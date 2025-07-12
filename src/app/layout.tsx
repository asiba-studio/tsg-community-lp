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
            <body>
                <div>
                    <div>
                        <main>{children}</main>
                        <Footer />
                    </div>
                </div>
            </body>
        </html>
    );
}
