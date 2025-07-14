import { SimpleButton } from "@/components/button"

export default function ApplicationSection() {

    return (

        <div className="w-full space-y-10">


            {/* Application Section */}
            <section>
                <h2>募集要項</h2>
                <ol className="space-y-2 custom-ol pt-10 px-5">
                    <li>TSGの応募条件を満たしていること</li>
                    <li>建築・デザイン・アートといった、クリエイションに向き合いながら、起業やビジネスを考えている若者/学生</li>
                    <li>
                        以下のプログラム日程に参加できること
                        <div className="mt-2 ml-6 grid grid-cols-[auto_0.97fr] gap-x-4 gap-y-2">
                            <span>#1. 8月24日(日)</span>
                            <span>ラボ合同キックオフ</span>

                            <span>#2. 8月30日(土)～8月31日(日)</span>
                            <span>フィールドワーク合宿</span>

                            <span>#3. 9月28日(日)</span>
                            <span>レクチャー & Meetup #01</span>

                            <span>#4. 10月11日(土)～10月13日(月)</span>
                            <span>制作集中期間</span>

                            <span>#5. 11月2日(日)</span>
                            <span>レクチャー&Meetup #02</span>

                            <span>#6. 11月30日(日)</span>
                            <span>プロジェクト・フェア</span>
                        </div>
                        <p className="text-sm mt-4 ml-6">
                            ※可能な限り全日程へのご参加をお願いしておりますが、難しい場合はご相談ください。
                        </p>
                    </li>
                </ol>
                <div className="w-full flex justify-end pt-4 pb-10">
                    <SimpleButton icon="right" className="font-zen">お申し込み</SimpleButton>
                </div>
            </section>

            {/* Special Notes Section*/}
            <section>
                <h2>特記事項</h2>
                <ul className="space-y-2 custom-ul py-10 px-5">
                    <li>申込みをいただいた後、事務局で募集要項を満たしているかを確認し、
                        8月10日頃、最終的な参加可否をメールにてご連絡いたします。</li>
                    <li>定員を超えるお申込みがあった場合、
                        応募条件を満たしている方を対象として選考により参加者を決定します。</li>
                    <li>参加費用は無料ですが、会場までの交通費等はご自身でご負担いただきます。</li>
                    <li>参加者の状況に合わせて、プログラムの内容は多少変更することがあります。予めご了承ください。</li>
                </ul>
            </section>

            {/* Organization Section*/}
            <section>
                <h2>運営団体</h2>
                <ul className="space-y-2 custom-ul py-10 px-5">
                    <li>主催：東京都</li>
                    <li>企画運営事務局：認定NPO法人ETIC.</li>
                    <li>企画パートナー：一般社団法人ASIBA（共同代表 森原正希）</li>
                </ul>
            </section>

        </div>

    )

}