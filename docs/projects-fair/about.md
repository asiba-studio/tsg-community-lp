# Projects Fair

## 実装について

以下の内容（Projects Fair）を一ページとして実装してください
参考のページは
/articles/[slug]/page.tsxです

ArticleページのBodyの部分やmetadataなどの配置が参考になります
（右にあるmetadata群のような、左右に分ける構成は不要です）





## Contents

### Hero

HeroSection.tsx をそのまま使う


### Projects

以下の形式でconst projects を定義

- id
- title
- team
- keywords
- term
- boose
- image
- show (default True)

1.
title: "可聴化する遺伝子"
team: "Luna"
keywords: "#テクノロジー活用・AI"
term: "両ターム"
boose: "45"
image: "/images/projects-fair/pj-01.png"

2.
title: "Curatemyself〜自分を展示する〜"
team: "Marcy Miwa"
keywords: "#食・文化・伝統"
term: "両ターム"
boose: "45"
image: "/images/projects-fair/pj-02.jpg"

3.
title: "包まれるまち"
team: "地域の菓子パケ研究所 志澤 舞"
keywords: "#食・文化・伝統"
term: "両ターム"
boose: "45"
image: "/images/projects-fair/pj-03.jpg"

4.
title: "脳が混乱する「身体拡張」スプーンレース"
team: "福田 正智"
keywords: "#テクノロジー活用・AI"
term: "両ターム"
boose: "45"
image: "/images/projects-fair/pj-04.jpg"

5.
title: "あなたのだれかのすき・きらい"
team: "にゅ〜書道開発委員会"
keywords: "#学び・教育"
term: "両ターム"
boose: "45"
image: "/images/projects-fair/pj-05.jpg"

6.
title: "都市を、つついてみる:くちばしで捉える街の素材"
team: "大日 菜々子"
keywords: "#自然・環境・一次産業"
term: "両ターム"
boose: "45"
image: "/images/projects-fair/pj-06.jpg"

7.
title: "作品に必ずコメントが返ってくる新たな作品投稿SNS「FeedBacks」"
team: "阿部 大空"
keywords: "#テクノロジー活用・AI"
term: "両ターム"
boose: "19"
image: "/images/projects-fair/pj-07.jpg"

8. 
title: ""
team: "上杉 未宇"
show: False

9.
title: ""
team: "豊田 英杜"
show: False

10.
title: ""
team: "森岡 陽"
show: False


### Outline

#### **イベント概要**

| イベント名 | Creative-LAB. 最終成果展（PROJECTS FAIR SPRING 2026） |
| :---- | :---- |
| **日時** | 2026年3月15日（日）10:00〜19:00（予定） |
| **会場** | Tokyo Innovation Base 1F [WEB](https://tib.metro.tokyo.lg.jp/) |
| **開催方法** | リアル開催（会場のみでの開催） |
| **対象者** | どなたでも参加可能 |
| **参加費** | 無料（入退場自由） |
| **参加方法** | 事前登録制 別途入場にはTiB専用アプリが必要になります。[こちら](https://tib.metro.tokyo.lg.jp/posts/pxFOffuM)よりご確認いただき事前登録のご協力をお願いいたします。 |
| **主催** | 東京都 |
| **運営** | TOKYO STARTUP GATEWAY 運営事務局（NPO法人ETIC.） 一般社団法人ASIBA |


#### **会場へのアクセス**

* Tokyo Innovation Base  
* 〒100-0005 東京都千代田区丸の内3-8-3  
* JR山手線・京浜東北線「有楽町駅」京橋口｜徒歩1分  
* 東京メトロ有楽町線「有楽町駅」D9出口すぐ  
* 東京メトロ有楽町線「銀座一丁目駅」1出口｜徒歩3分  
* [google map](https://www.google.co.jp/maps/place/Tokyo+Innovation+Base/@35.676286,139.763566,17z/data=!3m1!4b1!4m5!3m4!1s0x60188b6663611767:0x3c2b3b3b3b3b3b3b!8m2!3d35.676286!4d139.765355)


### Admin

#### 運営：TOKYO STARTUP GATEWAY

TOKYO STARTUP GATEWAY（TSG）は、東京都が主催するスタートアップ支援プログラム。「起業って特別な人がするもの？」そんなことはありません。 小さなアイデアと一歩踏み出す気持ちがあれば、誰でも挑戦できます。必要なのは、400文字のアイデアだけ。あとは、メンタリングやワークショップでサポートしながら、アイデア実現への道を一緒に進んでいきます。さらに、同じ想いを持つ仲間と出会える“起業同期”のコミュニティもあるので、ひとりで悩む必要はありません。ここから、たくさんの挑戦が生まれています。

#### 運営事務局：特定非営利活動法人エティック

1993年設立、2000年3月にNPO法人化。2017年に認定NPO法人取得。「変革の現場に挑む機会を通して、アントレプレナーシップ（起業家精神）溢れる人材を育みます。そして、創造的で活力に溢れ、ともに支え合い、課題が自律的に解決されていく社会・地域を実現していきます。」をミッションに、ローカルイノベーション、企業共創、人材マッチングなど様々な事業を展開しています。

#### 運営事務局：一般社団法人ASIBA

ASIBAは、建築・デザイン・アート領域に問いと実践を往復する「クリエイティブ・アントレプレナー」を育み、誰もが自分の可能性や才能を諦めずに、クリエイションに挑戦できる社会を目指すオープンプラットフォームです。(参考：https://asiba.or.jp/)