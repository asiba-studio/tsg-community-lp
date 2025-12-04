import MosaicIcon from "components/MosaicIcon";
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
                            title="LAB.合同キックオフ"
                            dateTime="2026.01.18 13:00-18:00"
                            location="TiB(Tokyo Innovation Base)"
                        >
                            <div className="text-fluid-sm leading-snug">
                                LAB.の参加者が一堂に会し、LAB.メンバー同士の関係性構築や、プログラムの使い方、2か月後のゴール設定などを行います。<br></br>
                                ※下記への参加が難しい方は、オンライン・フォローアップにご参加ください。日程は後ほどご連絡いたします。
                            </div>
                        </ProgramCard>
                    </li>
                    <li>
                        <ProgramCard
                            imageUrl="/images/home/program-1-2.png"
                            title="Workshop #1: Virtual Creation+メンタリング"
                            dateTime="2026.01.24 13:00-17:00"
                            location="都内（対面開催・調整中）"
                        >
                            <p className="text-fluid-sm leading-snug">
                                ゲスト：a春（O株式会社CEO/Artist）
                            </p>
                        </ProgramCard>
                    </li>
                    <li>
                        <ProgramCard
                            imageUrl="/images/home/program-2-2.png"
                            title="Open Lecture #1"
                            dateTime="2026.01.30 19:00-21:00"
                            location="都内（対面開催・調整中）"
                        >
                            <p className="text-fluid-sm leading-snug">
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
                    <div className="leading-none font-zen">自分と向き合う</div>
                    <div className="font-en leading-none">Face Yourself</div>
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
                            title="Workshop #2: Prototyping+メンタリング"
                            dateTime="2026.02.14 13:00-17:00"
                            location="都内（対面開催・調整中）"
                        >
                            <div className="text-fluid-sm leading-snug">
                                ゲスト：中條麟太郎（東京大学大学院学際情報学府）
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
                    <div className="leading-none font-zen">真っすぐにつくる</div>
                    <div className="font-en leading-none">Make Straight</div>
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
                            title="Open Lecture #2+メンタリング"
                            dateTime="2026.02.28 13:00-17:00"
                            location="都内（対面開催・調整中）"
                        >
                            <div className="text-fluid-sm leading-snug">
                            </div>
                        </ProgramCard>
                    </li>
                    <li>
                        <ProgramCard
                            imageUrl="/images/home/program-3-2.png"
                            title="成果発表会・展示会「プロジェクト・フェア」"
                            dateTime="2026.03.14 終日"
                            location="TiB (Tokyo Innovation Base)"
                        >
                            <p className="text-fluid-sm leading-snug">
                                LAB.プログラムを通じて磨いてきたアウトプットを発表・体験してもらうことで、
                                共に歩んでくれる仲間を見つけたり、次のステージへと進む足がかりを作ります。
                                個々のプロジェクトの可能性を探り、事業やプロジェクトをさらに磨き上げる機会となります。
                            </p>
                        </ProgramCard>
                    </li>
                </ul>
            </div>

        </div>
    );
}





