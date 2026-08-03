'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface MenuProps {
    className?: string;
}

// モーダルコンポーネント
function MenuModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    // より強力なスクロール無効化
    useEffect(() => {
        if (isOpen) {
            // 現在のスクロール位置を保存
            const scrollY = window.scrollY;

            // body を固定
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = '100%';
            document.body.style.overflow = 'hidden';

            // タッチイベントも防ぐ
            const preventTouch = (e: TouchEvent) => {
                e.preventDefault();
            };

            document.addEventListener('touchmove', preventTouch, { passive: false });

            return () => {
                // スクロール位置を復元
                document.body.style.position = '';
                document.body.style.top = '';
                document.body.style.width = '';
                document.body.style.overflow = '';

                window.scrollTo(0, scrollY);
                document.removeEventListener('touchmove', preventTouch);
            };
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50">
            {/* 領域外クリック用の背景 */}
            <div
                className="absolute inset-0"
                onClick={onClose}
                onTouchMove={(e) => e.preventDefault()} // 追加のタッチ防止
            />

            <div className="lg:hidden backdrop-blur-md backdrop-saturate-300 bg-white/25 
        p-8 mr-25
        font-en font-bold leading-snug
        flex flex-col gap-4
        relative z-10"
            >
                <Link href="/#program" className='no-underline px-2 w-auto mr-auto inline-block bg-white' onClick={onClose}>Program</Link>
                <Link href="/articles" className='no-underline px-2 w-auto mr-auto inline-block bg-white' onClick={onClose}>Articles</Link>
                <Link href="/articles#news" className='no-underline px-2 w-auto mr-auto inline-block bg-white' onClick={onClose}>News</Link>
                <Link href="/archive/3rd" className='no-underline px-2 w-auto mr-auto inline-block bg-white' onClick={onClose}>Archives</Link>
            </div>
        </div>
    );
}

export default function Menu({ className }: MenuProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <>
            <div className={`sticky top-0 lg:top-12 z-30 flex justify-end w-full h-0 ${className || ''}`}>
                <nav>
                    <button
                        onClick={(e) => {
                            // lg以上の場合はクリックを無効化
                            if (window.innerWidth >= 1024) {
                                e.preventDefault();
                                return;
                            }
                            openModal();
                        }}
                        className="lg:pointer-events-none" // lg以上でマウスイベント無効
                    >
                        <img
                            src="/images/common/menu-b.png"
                            alt="menu-b"
                            className="
          w-25 px-2 lg:px-3 py-2
          lg:w-60 lg:px-6
          backdrop-blur-md backdrop-saturate-300 bg-white/25
        "
                        />
                    </button>
                </nav>
            </div>

            <MenuModal isOpen={isModalOpen} onClose={closeModal} />
        </>
    );
}