'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Position {
    x: number;
    y: number;
}

// ボタンのサイズを定数として定義 (CSSの値と合わせるか、取得するようにする)
// ここでは、CSSの見た目から推定した値を仮定します
const BUTTON_WIDTH = 250;
const BUTTON_HEIGHT = 120;

export default function FloatingApplicationButton() {
    const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
    const [isInitialized, setIsInitialized] = useState(false);
    // ボタン要素への参照を保持
    const buttonRef = useRef<HTMLButtonElement>(null);

    /**
     * ランダムな位置を生成し、ボタンが画面内に収まるように制限する関数
     * @param windowWidth ビューポートの幅
     * @param windowHeight ビューポートの高さ
     * @returns 画面内のランダムな座標
     */
    const generateRandomPosition = (windowWidth: number, windowHeight: number): Position => {
        // ボタンのサイズを取得（refを使用するのが最も確実ですが、今回は固定値を使用）
        const buttonWidth = buttonRef.current ? buttonRef.current.offsetWidth : BUTTON_WIDTH;
        const buttonHeight = buttonRef.current ? buttonRef.current.offsetHeight : BUTTON_HEIGHT;

        // X座標: 0 から (ビューポート幅 - ボタン幅) の間
        const maxX = Math.max(0, windowWidth - buttonWidth);
        const x = Math.random() * maxX;

        // Y座標: 0 から (ビューポート高さ - ボタン高さ) の間
        const maxY = Math.max(0, windowHeight - buttonHeight);
        const y = Math.random() * maxY;

        return { x, y };
    };

    // 初期化とリサイズ処理
    useEffect(() => {
        const handleResize = () => {
            // リサイズ時にも画面内に留まるように再計算
            if (isInitialized) {
                // 現在のビューポートに合わせて新しい位置を計算し直す
                setPosition(currentPos => {
                    const buttonWidth = buttonRef.current ? buttonRef.current.offsetWidth : BUTTON_WIDTH;
                    const buttonHeight = buttonRef.current ? buttonRef.current.offsetHeight : BUTTON_HEIGHT;

                    const newX = Math.min(currentPos.x, Math.max(0, window.innerWidth - buttonWidth));
                    const newY = Math.min(currentPos.y, Math.max(0, window.innerHeight - buttonHeight));
                    return { x: newX, y: newY };
                });
            }
        };

        // 初期位置を設定
        if (window.innerWidth && window.innerHeight) {
            // 画面左下の初期位置を設定 (例: x=20, y=画面の高さ-ボタンの高さ-20)
            const initialX = 20;
            const initialY = window.innerHeight - BUTTON_HEIGHT - 20;
            setPosition({ x: initialX, y: initialY });
            setIsInitialized(true);
        }

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [isInitialized]);

    // 移動ロジック
    useEffect(() => {
        if (!isInitialized) return;
        
        // 4~8秒のランダムな時間を生成
        const getRandomInterval = () => {
            // Math.random() * (最大値 - 最小値) + 最小値
            return (Math.random() * 5000 + 8000); // 8000ms ~ 12000ms
        };

        const moveButton = () => {
            // 現在の画面サイズを使用してランダムな位置を計算
            setPosition(currentPos => {
                // 位置を更新してから、次の移動をスケジュールする
                return generateRandomPosition(window.innerWidth, window.innerHeight);
            });

            // 移動が完了したら、次の移動をランダムな時間でスケジュール
            startTimer();
        };

        let timerId: NodeJS.Timeout | null = null;

        // タイマーを開始する関数
        const startTimer = () => {
            const interval = getRandomInterval();
            timerId = setTimeout(moveButton, interval);
        };

        // 初回実行
        startTimer();

        // クリーンアップ関数: コンポーネントがアンマウントされるか依存関係が変わる際にタイマーを停止
        return () => {
            if (timerId) {
                clearTimeout(timerId);
            }
        };

    }, [isInitialized]); // 依存配列に変更なし

    // styleにleftとtopを指定し、position.x/yを直接ピクセル値として使用
    return (
        <Link href="/#application">
            <button
                ref={buttonRef} // refを追加
                className="fixed font-sans font-bold text-lg leading-snug px-[1.5vw] inline-block z-400 transition-all duration-1000 ease-out pointer-events-auto hover:scale-120"
                style={{

                    position: 'fixed',
                    left: `${position.x}px`,
                    top: `${position.y}px`,
                }}
            >
                <Image
                    src="/gifs/green-mosaic.gif"
                    alt="green mosaic"
                    // widthとheightはボタンのサイズに合わせる
                    width={BUTTON_WIDTH}
                    height={BUTTON_HEIGHT}
                    className="absolute inset-0 w-full scale-x-[1.1] object-cover -z-10"
                    quality={80}
                    sizes="(max-width: 768px) 50vw, 30vw"
                />
                プログラム3期<br></br>
                応募はこちらから
            </button>
        </Link>
    );
}