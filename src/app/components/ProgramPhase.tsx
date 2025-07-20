import MosaicIcon from "@/components/MosaicIcon";
import Toggle from "@/components/Toggle";
import InteractiveMosaic from "@/components/InteractiveMosaic";

export function ProgramPhase1() {

    return (

        <div className="w-full flex flex-col">
            <div className="flex flex-wrap gap-10 items-end">
                <h3>
                    <img src="/gifs/phase1.gif" className="h-[1.8em] mb-0" alt="" />
                    <span className="sr-only mb-0">Phase1</span>
                </h3>
                <div className="flex-1 flex items-end gap-10 mb-0.5 pr-3 font-medium text-lg">
                    <div className="leading-none font-zen">世界を広げる</div>
                    <div className="font-en leading-none">Expand The World</div>
                </div>

            </div>

            <div className="grid grid-cols-3 w-full gap-15 px-[3vw] py-14">
                <div className=""><MosaicIcon number={1} /></div>
                <div className=""><MosaicIcon number={2} /></div>
                <div className=""><MosaicIcon number={3} /></div>
            </div>

            <div className="w-full px-[3vw] py-14">
                <h4 className="text-base">Phase 1 Program</h4>
                <ul className="custom-ul ml-[5%] space-y-6">
                    <li className="mt-6">
                        <div className="font-bold">ラボ合同キックオフ</div>
                        <div className="text-sm leading-snug">6種類のラボの参加者が一堂に会す合同キックオフ。実施事項は以下の通りです。<br />
                            ・3か月間のプログラム内容共有と目標設定<br />
                            ・自分のアイデアをビジュアルに表現し、フィードバックを得るギャラリーウォーク<br />
                            ・「オリジンシート」「ライフグラフ」を用いたリフレクション
                        </div>
                        <div className="w-full text-sm text-right mt-2">2025.08.24 13:00-17:00 @Tokyo Innovation Base</div>
                    </li>
                    <li>
                        <div className="font-bold">フィールドワーク合宿</div>
                        <div className="text-sm leading-snug">「見る」「感じる」「つくる」を繰り返す1泊2日のフィールドワーク合宿。
                            クリエイターにとって、「心の機敏さ」「じっくり見る体験」は欠かせない感覚です。世界の微細な違和感に気づくこと。
                            誰もが見過ごす風景の中に、自分だけの発見を見つけ出すこと。クリエイションの原点に立ち返る合宿です。<br />
                            ※プログラムに宿泊を含むか否かは8月上旬には決定いたします。宿泊を含まない場合、遠方の方の参加は柔軟に対応させていただきます。
                            宿泊有無に関わらず2日間のプログラムは実施いたします。

                        </div>
                        <div className="w-full text-sm text-right mt-2">2025.08.30-31 @総武線亀戸駅より徒歩10分</div>
                    </li>
                </ul>

            </div>

            <div>
                <InteractiveMosaic 
                    imageUrl="/images/mes.jpg"
                />
            </div>




                    

        </div>
    );
}


export function ProgramPhase2() {

    return (

        <div className="w-full flex flex-col gap-4">
            <div className="flex flex-wrap justify-end gap-10 items-end">
                <h3>
                    <img src="/gifs/phase2.gif" className="h-[1.8em] mb-0" alt="" />
                    <span className="sr-only mb-0">Phase2</span>
                </h3>
                <div className="flex-1 flex gap-10 mb-0.5 pr-3 font-bold text-lg">
                    <div className="leading-none font-zen">真っす　ぐにつ　くる</div>
                    <div className="font-en leading-none">Mak　eStr　aight</div>
                </div>

            </div>

            <div className="grid grid-cols-3 gap-15 px-[3vw]  py-10">
                <div className=""><MosaicIcon number={4} /></div>
                <div className=""><MosaicIcon number={5} /></div>
                <div className=""><MosaicIcon number={6} /></div>
            </div>

            <div className="mx-10">
                <Toggle
                    trigger={<span className="font-medium font-en">Phase 2 Program</span>}
                >
                    <div className="flex flex-col gap-4 px-[2.5vw]  py-8 my-4 bg-gray-100 font-zen">
                        <div className="flex flex-col gap-1 font-medium font-xs">
                            <div className="flex flex-row items-center gap-2">
                                <div className="w-3.5 h-3.5 bg-gray-900"></div>
                                <h4 className="font-sm font-medium">レクチャー & Meetup #01</h4>
                            </div>
                            <div className="pl-12 leading-relaxed">
                                Phase 1「世界を広げる」からPhase 2「真っすぐにつくる」へ
                            </div>
                            <div className="font-en w-full flex justify-end mt-1">
                                2025.09.28  @TBD in Tokyo
                            </div>
                        </div>
                        <div className="flex flex-col gap-1 font-medium font-xs">
                            <div className="flex flex-row items-center gap-2">
                                <div className="w-3.5 h-3.5 bg-gray-900"></div>
                                <h4 className="font-sm font-medium">制作集中期間</h4>
                            </div>
                            <div className="pl-12 leading-relaxed">
                                とにかくつくる！メンター陣とともに自分のアウトプットを極限まで高めます。
                            </div>
                            <div className="font-en w-full flex justify-end mt-1">
                                2025.10.11-13  @Kameido, Tokyo
                            </div>
                        </div>
                    </div>
                </Toggle>
            </div>



        </div>
    );
}

export function ProgramPhase3() {

    return (

        <div className="w-full flex flex-col gap-4">
            <div className="flex flex-wrap justify-end gap-10 items-end">
                <h3>
                    <img src="/gifs/phase3.gif" className="h-[1.8em] mb-0" alt="" />
                    <span className="sr-only mb-0">Phase3</span>
                </h3>
                <div className="flex-1 flex gap-10 mb-0.5 pr-3 font-bold text-lg">
                    <div className="leading-none font-zen">自分と向　き合　う</div>
                    <div className="font-en leading-none">Fac　eYou　rself</div>
                </div>

            </div>

            <div className="grid grid-cols-3 gap-15 px-[3vw] py-10">
                <div className=""><MosaicIcon number={7} /></div>
                <div className=""><MosaicIcon number={8} /></div>
                <div className=""><MosaicIcon number={9} /></div>
                <div className="col-start-3"><MosaicIcon number={10} /></div>
            </div>



            <div className="mx-10">
                <Toggle
                    trigger={<span className="font-medium font-en">Phase 3 Program</span>}
                >
                    <div className="flex flex-col gap-4 px-[2.5vw] py-8 my-4 bg-gray-100 font-zen">
                        <div className="flex flex-col gap-1 font-medium font-xs">
                            <div className="flex flex-row items-center gap-2">
                                <div className="w-3.5 h-3.5 bg-gray-900"></div>
                                <h4 className="font-sm font-medium">レクチャー&Meetup #02</h4>
                            </div>
                            <div className="pl-12 leading-relaxed">
                                Phase 2「真っすぐにつくる」からPhase 3「自分と向き合う」へ
                            </div>
                            <div className="font-en w-full flex justify-end mt-1">
                                2025.11.02  @TBD in Tokyo
                            </div>
                        </div>
                        <div className="flex flex-col gap-1 font-medium font-xs">
                            <div className="flex flex-row items-center gap-2">
                                <div className="w-3.5 h-3.5 bg-gray-900"></div>
                                <h4 className="font-sm font-medium">成果発表会・展示会「プロジェクト・フェア」</h4>
                            </div>
                            <div className="pl-12 leading-relaxed">
                                ラボを通じて磨いてきたアウトプットを発表・体験してもらうことで、共に歩んでくれる仲間を見つけたり、
                                次のステージへと進む足がかりを作ります。
                                個々のプロジェクトの可能性を探り、事業やプロジェクトをさらに磨き上げる機会となります。
                            </div>
                            <div className="font-en w-full flex justify-end mt-1">
                                2025.11.30  @TBD in Tokyo
                            </div>
                        </div>
                    </div>
                </Toggle>
            </div>
        </div>
    );
}





