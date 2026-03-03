import React from 'react';
import { Header } from '@/components/layout';

export default function AboutPage() {
    return (
        <div>
            <Header />
            <div className="container mx-auto px-4 py-30 max-w-3xl">

                <h1 className="text-3xl font-bold mb-8">Creative-LAB. とは</h1>
                <div className="space-y-6 text-lg leading-relaxed text-gray-800">
                    <p>
                        建築・デザイン・アートなどのクリエイティブを志す若者を対象に、自ら「つくること」を通して、「生き方」を探していくための3ヶ月のオープンなラボプログラム。
                    </p>
                    <p>
                        新たな表現や手段を獲得した3期生による、【最終成果展】を開催します。
                    </p>
                </div>
            </div>
        </div>
    );
}
