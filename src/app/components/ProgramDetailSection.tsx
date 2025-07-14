import { SimpleButton } from "@/components/button"

export default function ProgramDetailSection() {
    return (
        <div>
            <h2>
                <img src="/gifs/program.gif" className="h-16 mb-10" alt="" />
                <span className="sr-only">Program</span>
            </h2>
            <div className="w-full gap-6 px-[2.5vw]">
                <ul className="custom-ul space-y-6">
                    <li className="space-y-1">
                        <p className="font-bold font-zen">クリエイティブ領域に特化した、若者向けのコミュニティです。</p>
                        <p className="text-sm">建築・デザイン・アートといった、クリエイションに向き合いながら、
                            起業やビジネスを考えている若者/学生向け（15歳〜25歳前後を対象）のコミュニティです。
                            自己表現と真剣に向き合いながら、他者との対話や越境も大切にする場を作ります。
                        </p>
                    </li>
                    <li className="space-y-1">
                        <p className="font-bold font-zen">「つくること」だけでなく「生き方」にもフォーカス</p>
                        <p className="text-sm">Creative Lab.は「何を、どのようにつくるか」だけでなく、
                            「これから、どう生きていきたいか？」という問いを起点に、自分のクリエイションと生き方を結び直す場です。
                            社会の中で自分だけのモノづくりをしながら生きている人々や、同世代の仲間との対話と挑戦を通じて、
                            本当に選びたい生き方やまなざしを見つけるプロセスを後押しします。
                        </p>
                    </li>
                    <li className="space-y-1">
                        <p className="font-bold font-zen"> クリエイティブ・モードに入るために「MEs」を活用</p>
                        <p className="text-sm">オンラインであっても、互いのクリエイティビティに触れ合い、
                            自然とコラボレーションが生まれる状態を作るために、3Dデジタルコラボレーションツール「MEs」を導入します。
                            モノづくりに没入する時間こそ最も重要だからこそ、仲間のクリエイションに触れながら、
                            自然にフロー状態へと導かれるクリエイティブな環境をつくります。
                        </p>
                        <img src={'/images/mes.jpg'} alt="MEs o,ltd." className="mt-4"/>
                        <div className="w-full flex justify-end">
                            <SimpleButton icon="right" href="https://www.o-me.io/" external>https://www.o-me.io/</SimpleButton>
                        </div>
                    </li>
                </ul>
            </div>

            <div className="w-full gap-6 px-[2.5vw] pt-20">
                <h3 className="font-zen font-bold pb-10">実施内容</h3>
                <ol className="leading-base space-y-10">
                    <li className="pl-6 font-bold">Phase 1 世界を広げる
                        <ul className="custom-ul ml-10">
                            <li className="mt-4">
                                <div className="font-bold">ラボ合同キックオフ</div>
                                <div className="text-sm leading-snug">6種類のラボの参加者が一堂に会す合同キックオフ。実施事項は以下の通りです。<br/>
                                    ・3か月間のプログラム内容共有と目標設定<br />
                                    ・自分のアイデアをビジュアルに表現し、フィードバックを得るギャラリーウォーク<br/>
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
                    </li>
                    <li className="pl-6 font-bold">Phase 2 真っすぐにつくる
                        <ul className="custom-ul ml-10">
                            <li className="mt-4">
                                <div className="font-bold">レクチャー & Meetup #01</div>
                                <div className="text-sm leading-snug">Phase 1「世界を広げる」からPhase 2「真っすぐにつくる」へ。レクチャー＆Meetupでの実施事項は以下の通りです。<br />
                                    ・1か月間の振り返り<br />
                                    ・ギャラリーウォークとチーム組成<br />
                                    ・「つくり方」についてのレクチャー
                                </div>
                                <div className="w-full text-sm text-right mt-2">2025.09.28 13:00-17:00 @都内（未定）</div>
                            </li>
                            <li>
                                <div className="font-bold">制作集中期間</div>
                                <div className="text-sm leading-snug">
                                    とにかくつくる！メンター陣とともに自分のアウトプットを極限まで高めます。
                                </div>
                                <div className="w-full text-sm text-right mt-2">2025.10.11-13 @総武線亀戸駅より徒歩10分</div>
                            </li>
                        </ul>   
                    </li>
                    <li className="pl-6 font-bold">Phase 3 自分に向き合う
                        <ul className="custom-ul ml-10">
                            <li className="mt-4">
                                <div className="font-bold">レクチャー&Meetup #02</div>
                                <div className="text-sm leading-snug">
                                    Phase 2「真っすぐにつくる」からPhase 3「自分と向き合う」へ。レクチャー＆Meetupでの実施事項は以下の通りです。<br />
                                    ・1か月間の振り返り<br />
                                    ・「生き方」についてのレクチャー
                                </div>
                                <div className="w-full text-sm text-right mt-2">2025.11.02 13:00-17:00 @都内（未定）</div>
                            </li>
                            <li>
                                <div className="font-bold">成果発表会・展示会「プロジェクト・フェア」</div>
                                <div className="text-sm leading-snug">
                                    ラボを通じて磨いてきたアウトプットを発表・体験してもらうことで、共に歩んでくれる仲間を見つけたり、
                                    次のステージへと進む足がかりを作ります。個々のプロジェクトの可能性を探り、事業やプロジェクトをさらに磨き上げる機会となります。
                                </div>
                                <div className="w-full text-sm text-right mt-2">2025.11.30（終日） @都内（未定）</div>
                            </li>
                        </ul>   
                    </li>
                </ol>
            </div>

            <div className="w-full gap-6 px-[2.5vw] pt-20">
                <h3 className="font-zen font-bold pb-10">オンライン・任意参加のコンテンツ</h3>
                <ul className="custom-ul ml-10 space-y-8">
                            <li>
                                <div className="font-bold">オープンレクチャー</div>
                                <div className="text-sm leading-snug">
                                    プログラム前半を中心に、合計3回程度のオープンレクチャーセッションをオンラインで実施します。
                                </div>
                            </li>
                            <li>
                                <div className="font-bold">メンタリング</div>
                                <div className="text-sm leading-snug">
                                    グッドデザイン・ニューホープ賞、未踏アドバンストをはじめ、クリエイティブ領域で受賞歴があり、
                                    実際に起業家として活躍している若手メンター陣によるメンタリングを行います。
                                </div>
                            </li>
                            <li>
                                <div className="font-bold">オンライン・ギャラリーウォーク</div>
                                <div className="text-sm leading-snug">
                                    ラボの後半には、それぞれの制作物をメタバース空間「MEs」に展示し、
                                    互いにフィードバックを行う「オンライン・ギャラリーウォーク」を実施し、
                                    切磋琢磨しながらクリエイティブ・モードを深めていきます。
                                </div>
                            </li>
                        </ul>   
            </div>


        </div>
    )
}