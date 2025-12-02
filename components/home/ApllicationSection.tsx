import { SimpleButton } from "components/button"
import Link from "next/link";

export default function ApplicationSection() {

    return (

        <div className="w-full space-y-10 px-[2vw] text-fluid-base">


            {/* Application Section */}
            <section>
                <h2>募集要項</h2>
                <ol className="space-y-2 custom-ol pt-10 pl-[1.5vw]">
                    <li>TSGの応募条件を満たしていること</li>
                    <li>建築・デザイン・アートといった、クリエイションに向き合いながら、起業やビジネスを考えている若者/学生（15歳〜25歳前後を対象）</li>
                    <li>以下のプログラム日程に参加できること
                        <div className="space-y-0 leading-normal my-2">
                            <span>2026年1月18日(日)　合同キックオフ</span><br></br>
                            <span>2026年1月24日(土)　Workshop #1: Virtual Creation＋メンタリング</span><br></br>
                            <span>2026年1月30日(金)　Open Lecture #1</span><br></br>
                            <span>2026年2月14日(土)　Workshop #2: Prototyping＋メンタリング</span><br></br>
                            <span>2026年2月28日(土)　Open Lecture #2＋メンタリング</span><br></br>
                            <span>2026年3月14日(土) 　成果発表会・展示会「プロジェクト・フェア」</span><br></br>
                        </div>
                        <span>※メンタリング付きのセッション（1/24, 2/14, 2/28）は原則参加をお願いします。</span>
                    </li>
                </ol>
            </section>

            {/* Special Notes Section*/}
            <section>
                <h2>特記事項</h2>
                <ul className="space-y-2 custom-ul py-10  pl-[1.5vw]">
                    <li>申込みをいただいた後、一部対象者には個別に面談を行います。選考により参加者を決定します。</li>
                    <li>本プログラムにご参加いただく場合、1月18日(日)の合同キックオフは【参加必須】となりますので、必ずスケジュールの確保をお願いいたします。</li>
                    <li>参加費用は無料ですが、会場までの交通費等はご自身でご負担いただきます。</li>
                    <li>参参加者の状況に合わせて、プログラムの内容は多少変更することがあります。予めご了承ください。</li>
                </ul>
            </section>

            {/* Organization Section*/}
            <section>
                <h2>運営団体</h2>
                <ul className="space-y-2 custom-ul py-10 pl-[1.5vw]">
                    <li>主催：東京都</li>
                    <li>企画運営事務局：
                        <Link href="https://etic.or.jp/" target="_blank" rel="noopener noreferrer" className="text-blue-600">NPO法人ETIC.</Link>
                    </li>
                    <li>企画パートナー：
                        <Link href="https://asiba.or.jp/" target="_blank" rel="noopener noreferrer" className="text-blue-600">一般社団法人ASIBA</Link>（共同代表 森原正希）
                    </li>
                </ul>
            </section>

            {/* CTA Section*/}
            <section id="application">
                <h2>お申し込み</h2>
                <ul className="space-y-2 custom-ul py-10 pl-[1.5vw]">
                    <li>Creative-LAB.への参加は、以下のリンクからアクセスいただきお申込みください。
                        <div className="mt-10 text-left">
                            <a
                                href={"https://tsg-etic.my.site.com/TSG/s/login/?language=ja&ec=302&startURL=%2FTSG%2Fs%2F2025%2Flab-creative%3F_gl%3D1*g3ickt*_gcl_au*MTY2OTAxNjI0Ni4xNzUzNTE4OTYx*_ga*MTI0NDA3NjA2OS4xNzUwOTI0MDY4*_ga_PN1SX1X1K9*czE3NTM1NDU3MDEkbzMkZzEkdDE3NTM1NDU5MTMkajU0JGwwJGgw"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center bg-black text-white px-8 py-3 font-bold font-sans hover:bg-gray-800 transition-colors duration-300"
                            >
                                お申し込みはこちら
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                            </a>
                        </div>
                    </li>
                </ul>
            </section>

        </div>
    )
}
