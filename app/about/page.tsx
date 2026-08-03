import React from 'react';
import { Header } from '@/components/layout';

export default function AboutPage() {
    return (
        <div>
            <Header />
            <div className="container mx-auto px-4 py-30 max-w-3xl">

                <h1 className="text-3xl font-bold mb-8">Community Design-LAB. とは</h1>
                <div className="space-y-6 text-lg leading-relaxed text-text-primary">
                    <p>
                        「やりたい」を起点に、人が集まる理由をつくる。持続可能で、面白く、魅力的なコミュニティをつくるための3ヶ月間のラボプログラム。
                    </p>
                    <p>
                        具体的な運営ノウハウや集客テクニックを学ぶだけでなく、コミュニティづくりの実践者から学びながら、自らの世界観や問いを深め、実際に場づくりに挑戦していきます。
                    </p>
                </div>
            </div>
        </div>
    );
}
