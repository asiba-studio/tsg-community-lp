import './globals.css';
import { Footer } from '@/components/footer';
import Script from 'next/script';

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
                {/* Adobe Fonts JavaScript */}
                <Script id="adobe-fonts" strategy="beforeInteractive">
                  {`
                    (function(d) {
                      var config = {
                        kitId: 'qpe7cyw',
                        scriptTimeout: 3000,
                        async: true
                      },
                      h=d.documentElement,t=setTimeout(function(){h.className=h.className.replace(/\\bwf-loading\\b/g,"")+" wf-inactive";},config.scriptTimeout),tk=d.createElement("script"),f=false,s=d.getElementsByTagName("script")[0],a;h.className+=" wf-loading";tk.src='https://use.typekit.net/'+config.kitId+'.js';tk.async=true;tk.onload=tk.onreadystatechange=function(){a=this.readyState;if(f||a&&a!="complete"&&a!="loaded")return;f=true;clearTimeout(t);try{Typekit.load(config)}catch(e){}};s.parentNode.insertBefore(tk,s)
                    })(document);
                  `}
                </Script>
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
