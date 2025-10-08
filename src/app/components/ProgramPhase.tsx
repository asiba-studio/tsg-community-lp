import MosaicIcon from "@/components/MosaicIcon";
import ProgramCard from "./ProgramCard";
import Image from "next/image";





export function ProgramPhase1() {

    return (

        <div className="w-full flex flex-col">
            <div className="flex flex-wrap gap-4 md:gap-20 items-baseline">
                <h3 className="font-en font-bold text-4xl leading-none relative">
                    <Image
                        src="/gifs/green-mosaic.gif"
                        alt="green mosaic"
                        width={500}
                        height={500}
                        className="absolute inset-0 w-full scale-x-[1.2] object-cover -z-10"
                        quality={80}
                        sizes="(max-width: 768px) 50vw, 30vw"
                    />
                    Phase 1
                </h3>
                <div className="w-auto flex flex-col items-baseline md:flex-row gap-2 md:gap-10 pl-8 md:pl-0 pr-3 font-medium text-sm md:text-base">
                    <div className="leading-none font-zen">世界を広げる</div>
                    <div className="font-en leading-none">Expand The World</div>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 w-full md:w-3/4 gap-4 md:gap-6 md:px-0 py-10">
                <div className=""><MosaicIcon number={1} /></div>
                <div className=""><MosaicIcon number={2} /></div>
                <div className=""><MosaicIcon number={3} /></div>
            </div>

            <div className="w-full px-0 py-10">
                <h4 className="hidden">Phase 1 Program</h4>
                <ul className="px-[3%] space-y-8">
                    <li>
                        <ProgramCard
                            imageUrl="/images/home/program-1-1.png"
                            title="#1 LAB.合同キックオフ"
                            dateTime="2025.08.24 13:00-17:00"
                            location="TiB(Tokyo Innovation Base)"
                            reportSlug="report-day1"
                        >
                            <div className="text-fluid-sm leading-snug">
                                6種類のラボの参加者が一堂に会す合同キックオフ。実施事項は以下の通りです。
                            </div>
                            <ul className="text-fluid-sm leading-snug pt-4 ml-4 list-disc">
                                <li>3か月間のプログラム内容共有と目標設定</li>
                                <li>自分のアイデアをビジュアルに表現し、フィードバックを得るギャラリーウォーク</li>
                                <li>「オリジンシート」「ライフグラフ」を用いたリフレクション</li>
                            </ul>
                        </ProgramCard>
                    </li>
                    <li>
                        <ProgramCard
                            imageUrl="/images/home/program-1-2.png"
                            title="#2 フィールドワーク"
                            dateTime="2025.08.31 10:30-15:30"
                            location="SHIMOKITA COLLEGE"
                        >
                            <p className="text-fluid-sm leading-snug">
                            「見る」「感じる」「つくる」を繰り返す1day フィールドワーク。
                            クリエイターにとって、「心の機敏さ」「じっくり見る体験」は欠かせない感覚です。
                            世界の微細な違和感に気づくこと。誰もが見過ごす風景の中に、自分だけの発見を見つけ出すこと。クリエイションの原点に立ち返ります。
                            </p>
                        </ProgramCard>
                    </li>
                </ul>
            </div>
        </div>
    );
}


export function ProgramPhase2() {

    return (

        <div className="w-full flex flex-col">
            <div className="flex flex-wrap gap-4 md:gap-20 items-baseline">
                <h3 className="font-en font-bold text-4xl leading-none relative">
                    <Image
                        src="/gifs/green-mosaic.gif"
                        alt="green mosaic"
                        width={500}
                        height={500}
                        className="absolute inset-0 w-full scale-x-[1.2] object-cover -z-10"
                        quality={80}
                        sizes="(max-width: 768px) 50vw, 30vw"
                    />
                    Phase 2
                </h3>
                <div className="w-auto flex flex-col items-baseline md:flex-row gap-2 md:gap-10 pl-8 md:pl-0 pr-3 font-medium text-sm md:text-base">
                    <div className="leading-none font-zen">真っすぐにつくる</div>
                    <div className="font-en leading-none">Make Straight</div>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 w-full md:w-3/4 gap-4 md:gap-6 md:px-0 py-10">
                <div className=""><MosaicIcon number={4} /></div>
                <div className=""><MosaicIcon number={5} /></div>
                <div className=""><MosaicIcon number={6} /></div>
            </div>



            <div className="w-full px-0 py-10">
                <h4 className="hidden">Phase 2 Program</h4>
                <ul className="px-[3%] space-y-8">
                    <li>
                        <ProgramCard
                            imageUrl="/images/home/program-2-1.png"
                            title="#3 レクチャー & Meetup"
                            dateTime="2025.09.28 13:00-15:00"
                            location="東京大学工学部14号館"
                        >
                            <div className="text-fluid-sm leading-snug">
                                Phase 1「世界を広げる」からPhase 2「真っすぐにつくる」へ
                            </div>
                        </ProgramCard>
                    </li>
                    <li>
                        <ProgramCard
                            imageUrl="/images/home/program-2-2.png"
                            title="#4 制作集中DAY"
                            dateTime="2025.10.11 13:00-17:00"
                            location="インターナショナル・デザイン・リエゾンセンター"
                        >
                            <div className="text-fluid-sm leading-snug">
                                とにかくつくる！メンター陣とともに自分のアウトプットを極限まで高めます。
                            </div>
                        </ProgramCard>
                    </li>
                </ul>
            </div>

        </div>
    );
}

export function ProgramPhase3() {

    return (

        <div className="w-full flex flex-col">
            <div className="flex flex-wrap gap-4 md:gap-20 items-baseline">
                <h3 className="font-en font-bold text-4xl leading-none relative">
                    <Image
                        src="/gifs/green-mosaic.gif"
                        alt="green mosaic"
                        width={500}
                        height={500}
                        className="absolute inset-0 w-full scale-x-[1.2] object-cover -z-10"
                        quality={80}
                        sizes="(max-width: 768px) 50vw, 30vw"
                    />
                    Phase 3
                </h3>
                <div className="w-auto flex flex-col items-baseline md:flex-row gap-2 md:gap-10 pl-8 md:pl-0 pr-3 font-medium text-sm md:text-base">
                    <div className="leading-none font-zen">自分と向き合う</div>
                    <div className="font-en leading-none">Face Yourself</div>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 w-full gap-4 md:gap-6 md:px-0 py-10">
                <div className=""><MosaicIcon number={7} /></div>
                <div className=""><MosaicIcon number={8} /></div>
                <div className=""><MosaicIcon number={9} /></div>
                <div className=""><MosaicIcon number={10} /></div>
            </div>

            <div className="w-full px-0 py-10">
                <h4 className="hidden">Phase 3 Program</h4>
                <ul className="px-[3%] space-y-8">
                    <li>
                        <ProgramCard
                            imageUrl="/images/home/program-3-1.png"
                            title="#5 レクチャー&Meetup"
                            dateTime="2025.11.02 13:00-17:00"
                            location="都内某所"
                        >
                            <div className="text-fluid-sm leading-snug">
                                Phase 2「真っすぐにつくる」からPhase 3「自分と向き合う」へ
                            </div>
                        </ProgramCard>
                    </li>
                    <li>
                        <ProgramCard
                            imageUrl="/images/home/program-3-2.png"
                            title="#6 成果発表会・展示会「プロジェクト・フェア」"
                            dateTime="2025.11.30"
                            location="TiB (Tokyo Innovation Base)"
                        >
                            <p className="text-fluid-sm leading-snug">
                                ラボを通じて磨いてきたアウトプットを発表・体験してもらうことで、共に歩んでくれる仲間を見つけたり、
                                次のステージへと進む足がかりを作ります。
                                個々のプロジェクトの可能性を探り、事業やプロジェクトをさらに磨き上げる機会となります。
                            </p>
                        </ProgramCard>
                    </li>
                </ul>
            </div>

        </div>
    );
}





