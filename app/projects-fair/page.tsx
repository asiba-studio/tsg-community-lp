import React from 'react';
import Image from 'next/image';
import { Header } from 'components/layout';
import HeroSection from 'components/home/HeroSection';

const projects = [
    {
        id: 1,
        title: "可聴化する遺伝子",
        team: "Luna",
        keywords: "#テクノロジー活用・AI",
        term: "両ターム",
        boose: "45",
        image: "/images/projects-fair/pj-01.png",
        show: true
    },
    {
        id: 2,
        title: "Curatemyself〜自分を展示する〜",
        team: "Marcy Miwa",
        keywords: "#食・文化・伝統",
        term: "両ターム",
        boose: "45",
        image: "/images/projects-fair/pj-02.png",
        show: true
    },
    {
        id: 3,
        title: "包まれるまち",
        team: "地域の菓子パケ研究所 志澤 舞",
        keywords: "#食・文化・伝統",
        term: "両ターム",
        boose: "45",
        image: "/images/projects-fair/pj-03.png",
        show: true
    },
    {
        id: 4,
        title: "脳が混乱する「身体拡張」スプーンレース",
        team: "福田 正智",
        keywords: "#テクノロジー活用・AI",
        term: "両ターム",
        boose: "45",
        image: "/images/projects-fair/pj-04.png",
        show: true
    },
    {
        id: 5,
        title: "あなたのだれかのすき・きらい",
        team: "にゅ〜書道開発委員会",
        keywords: "#学び・教育",
        term: "両ターム",
        boose: "45",
        image: "/images/projects-fair/pj-05.png",
        show: true
    },
    {
        id: 6,
        title: "都市を、つついてみる:くちばしで捉える街の素材",
        team: "大日 菜々子",
        keywords: "#自然・環境・一次産業",
        term: "両ターム",
        boose: "45",
        image: "/images/projects-fair/pj-06.png",
        show: true
    },
    {
        id: 7,
        title: "作品に必ずコメントが返ってくる新たな作品投稿SNS「FeedBacks」",
        team: "阿部 大空",
        keywords: "#テクノロジー活用・AI",
        term: "両ターム",
        boose: "19",
        image: "/images/projects-fair/pj-07.png",
        show: true
    },
    {
        id: 8,
        title: "",
        team: "上杉 未宇",
        show: false
    },
    {
        id: 9,
        title: "",
        team: "豊田 英杜",
        show: false
    },
    {
        id: 10,
        title: "",
        team: "森岡 陽",
        show: false
    }
];

export const metadata = {
    title: 'Projects Fair | Creative-LAB.',
    description: 'Creative-LAB. 最終成果展（PROJECTS FAIR SPRING 2026）',
    openGraph: {
        title: 'Projects Fair | Creative-LAB.',
        description: 'Creative-LAB. 最終成果展（PROJECTS FAIR SPRING 2026）',
        images: [
            {
                url: '/images/og/default-og.jpg',
                width: 1200,
                height: 630,
                alt: 'Projects Fair | Creative-LAB.',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Projects Fair | Creative-LAB.',
        description: 'Creative-LAB. 最終成果展（PROJECTS FAIR SPRING 2026）',
        images: ['/images/og/default-og.jpg'],
    },
};

export default function ProjectsFairPage() {
    return (
        <main className="w-full pb-50">


            {/* Hero Section */}
            <section className="hidden md:block w-full aspect-[1300/680]">
                <HeroSection />
            </section>
            <section className="block md:hidden w-full">
                <Image src="/images/common/keyvisual-mobile.jpg" alt="Key Visual" width={1200} height={1500} className="w-full object-cover" quality={60} sizes="100vw" />
            </section>

            {/* Navigation */}
            <div className="h-1 md:border-t md:border-border" />
            <Header />

            <div className="w-full p-3 lg:p-[4vw] flex flex-col items-center">
                <div className='w-full'>

                    <div className="w-full space-y-18 md:space-y-32 md:px-[2vw] py-20 text-fluid-base md:mt-12 mt-6">
                        <div>
                            <h1 className="font-en font-bold text-5xl md:text-6xl relative inline-block">
                                Projects Fair
                                <Image
                                    src="/gifs/green-mosaic.gif"
                                    unoptimized
                                    alt="green mosaic"
                                    width={500}
                                    height={140}
                                    className="absolute inset-0 w-full h-full scale-x-[1.5] object-contain -z-10"
                                    quality={80}
                                    sizes="(max-width: 768px) 50vw, 30vw"
                                />
                            </h1>
                            <div className='mt-12 md:mt-20 space-y-3 max-w-5xl text-fluid-base'>
                                <p>
                                    Creative-LAB.の3期生による最終成果展を開催します。</p>
                                <p>
                                    Creative-LAB.は、建築・デザイン・アートなどのクリエイティブ領域に関心を持つ若者／学生（15〜25歳前後を対象）に向けた、 実験的な学びの機会と対話の場を提供しています。 「自分の中にある”つくるため”の問いに向き合いながら、 自らの”生き方”を重ねていく」ことを目標にし、若手クリエイターによるメンタリング機会や、 思考の幅を広げ、問いを磨くためのワークショップ、 自ら問いを持ち実践をする若手クリエイターによる連続レクチャーを2ヶ月間限定で提供するコミュニティです。
                                    新たな表現や手段を獲得した3期生による、【最終成果展】を有楽町のTiBにて開催します。
                                </p>
                            </div>


                        </div>

                        {/* Projects Section */}
                        <section>
                            <h2 className='font-en text-fluid-4xl font-semibold'>Projects</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-[2vw] gap-y-6 md:gap-y-12 py-10">
                                {projects.filter(p => p.show).map(project => (
                                    <div key={project.id} className="group block no-underline overflow-hidden hover:opacity-100">
                                        <article>
                                            {/* Cover Image */}
                                            <div className="relative w-full h-auto bg-gray-100">
                                                <div className="relative aspect-video inset-0 flex items-center justify-center text-gray-300">
                                                    {project.image ? (
                                                        <Image
                                                            src={project.image}
                                                            alt={project.title}
                                                            fill
                                                            className="object-cover"
                                                            sizes="100vw, 50vw"
                                                            unoptimized={true}
                                                        />
                                                    ) : (
                                                        <span className="text-sm font-bold">No Image</span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Info */}
                                            <div className="mt-2 md:mt-4">
                                                <p className="font-medium text-fluid-base">
                                                    {project.team}
                                                </p>
                                                <h3 className="font-bold mt-1 text-fluid-lg">
                                                    {project.title}
                                                </h3>
                                                <span className="text-gray-400 mt-2 leading-none font-medium text-fluid-sm">
                                                    {project.keywords}
                                                </span>
                                            </div>
                                        </article>
                                    </div>
                                ))}
                            </div>
                            <div className="space-y-2 mt-2 md:mt-10">
                                {projects.filter(p => !p.show).map(project => (
                                    <div key={project.id} className='flex flex-row gap-6 items-baseline'>
                                        <p className="font-medium text-fluid-base">
                                            {project.team}
                                        </p>
                                        <p className="text-gray-700 leading-none font-medium text-fluid-base">
                                            to be announced…
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Outline Section */}
                        <section>
                            <h2>イベント概要</h2>
                            <ul className="space-y-4 custom-ul py-10 pl-[1.5vw]">
                                <li>
                                    <span className="font-bold">イベント名：</span>Creative-LAB. 最終成果展（PROJECTS FAIR SPRING 2026）
                                </li>
                                <li>
                                    <span className="font-bold">日時：</span>2026年3月15日（日）10:00〜19:00（予定）
                                </li>
                                <li>
                                    <span className="font-bold">会場：</span>Tokyo Innovation Base 1F{' '}
                                    <a href="https://tib.metro.tokyo.lg.jp/" target="_blank" rel="noopener noreferrer" className="transition-colors">
                                        WEB
                                    </a>
                                </li>
                                <li>
                                    <span className="font-bold">開催方法：</span>リアル開催（会場のみでの開催）
                                </li>
                                <li>
                                    <span className="font-bold">対象者：</span>どなたでも参加可能
                                </li>
                                <li>
                                    <span className="font-bold">参加費：</span>無料（入退場自由）
                                </li>
                                <li>
                                    <span className="font-bold">参加方法：</span>事前登録制 別途入場にはTiB専用アプリが必要になります。
                                    <a href="https://tib.metro.tokyo.lg.jp/posts/pxFOffuM" target="_blank" rel="noopener noreferrer" className="transition-colors">
                                        こちら
                                    </a>
                                    よりご確認いただき事前登録のご協力をお願いいたします。
                                </li>
                                <li>
                                    <span className="font-bold">主催：</span>東京都
                                </li>
                                <li>
                                    <span className="font-bold">運営：</span>TOKYO STARTUP GATEWAY 運営事務局（NPO法人ETIC.） 一般社団法人ASIBA
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h2>会場へのアクセス</h2>
                            <ul className="space-y-2 custom-ul py-10 pl-[1.5vw]">
                                <li>Tokyo Innovation Base</li>
                                <li>〒100-0005 東京都千代田区丸の内3-8-3</li>
                                <li>JR山手線・京浜東北線「有楽町駅」京橋口｜徒歩1分</li>
                                <li>東京メトロ有楽町線「有楽町駅」D9出口すぐ</li>
                                <li>東京メトロ有楽町線「銀座一丁目駅」1出口｜徒歩3分</li>
                                <li>
                                    <a href="https://www.google.co.jp/maps/place/Tokyo+Innovation+Base/@35.676286,139.763566,17z/data=!3m1!4b1!4m5!3m4!1s0x60188b6663611767:0x3c2b3b3b3b3b3b3b!8m2!3d35.676286!4d139.765355" target="_blank" rel="noopener noreferrer" className="transition-colors">
                                        google map
                                    </a>
                                </li>
                            </ul>
                        </section>

                        {/* Admin Section */}
                        <section>
                            <h2>運営</h2>
                            <div className="py-10 pl-[1.5vw] space-y-16 max-w-3xl">
                                <div>
                                    <div className="w-70 py-10">
                                        <Image src="/images/projects-fair/logo-tsg-color-yoko.svg" alt="Logo TSG" width={500} height={300} className="w-full h-full" />
                                    </div>
                                    <h3 className="font-bold text-fluid-lg mb-4">運営：TOKYO STARTUP GATEWAY</h3>
                                    <p className="leading-relaxed text-fluid-sm">
                                        TOKYO STARTUP GATEWAY（TSG）は、東京都が主催するスタートアップ支援プログラム。「起業って特別な人がするもの？」そんなことはありません。 小さなアイデアと一歩踏み出す気持ちがあれば、誰でも挑戦できます。必要なのは、400文字のアイデアだけ。あとは、メンタリングやワークショップでサポートしながら、アイデア実現への道を一緒に進んでいきます。さらに、同じ想いを持つ仲間と出会える“起業同期”のコミュニティもあるので、ひとりで悩む必要はありません。ここから、たくさんの挑戦が生まれています。
                                    </p>
                                </div>

                                <div>
                                    <div className="w-70 py-10">
                                        <Image src="/images/projects-fair/logo-etic.png" alt="Logo Etic" width={500} height={300} className="w-full h-full" />
                                    </div>
                                    <h3 className="font-bold text-fluid-lg mb-4">運営事務局：特定非営利活動法人エティック</h3>
                                    <p className="leading-relaxed text-fluid-sm">
                                        1993年設立、2000年3月にNPO法人化。2017年に認定NPO法人取得。「変革の現場に挑む機会を通して、アントレプレナーシップ（起業家精神）溢れる人材を育みます。そして、創造的で活力に溢れ、ともに支え合い、課題が自律的に解決されていく社会・地域を実現していきます。」をミッションに、ローカルイノベーション、企業共創、人材マッチングなど様々な事業を展開しています。
                                    </p>
                                </div>

                                <div>
                                    <div className="w-70 py-10">
                                        <Image src="/images/logo/logo-asiba.png" alt="Logo ASIBA" width={500} height={300} className="w-full h-full" />
                                    </div>
                                    <h3 className="font-bold text-fluid-lg mb-4">運営事務局：一般社団法人ASIBA</h3>
                                    <p className="leading-relaxed text-fluid-sm">
                                        ASIBAは、建築・デザイン・アート領域に問いと実践を往復する「クリエイティブ・アントレプレナー」を育み、誰もが自分の可能性や才能を諦めずに、クリエイションに挑戦できる社会を目指すオープンプラットフォームです。(参考：
                                        <a href="https://asiba.or.jp/" target="_blank" rel="noopener noreferrer" className="transition-colors">
                                            https://asiba.or.jp/
                                        </a>
                                        )
                                    </p>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </main>
    )
}
