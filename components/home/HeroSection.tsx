'use client'

import React, { useEffect, useState } from "react";

export interface P5SketchProps {
    preload?: (p5: any) => void;
    setup?: (p5: any, canvasParentRef: Element) => void;
    draw?: (p5: any) => void;
    windowResized?: (p5: any) => void;
    [key: string]: any;
}

export default function HeroSection() {
    const [isLoading, setIsLoading] = useState(true);
    const [P5Component, setP5Component] = useState<React.ComponentType<any> | null>(null);
    const [loadError, setLoadError] = useState<string | null>(null);

    useEffect(() => {
        const initialTimer = setTimeout(() => {
            setIsLoading(false);
        }, 1800);

        return () => clearTimeout(initialTimer);
    }, []);

    // P5コンポーネントの動的読み込み（タイムアウト付き）
    useEffect(() => {
        if (!isLoading && !P5Component && !loadError) {
            const timeoutId = setTimeout(() => {
                console.warn("P5 component loading timeout");
                setLoadError("Loading timeout - showing static version");
            }, 8000);

            const loadP5Component = async () => {
                try {
                    // react-p5を動的インポート
                    const { default: Sketch } = await import("react-p5");
                    clearTimeout(timeoutId);
                    setP5Component(() => Sketch);
                } catch (error) {
                    console.error("Failed to load P5 component:", error);
                    clearTimeout(timeoutId);
                    setLoadError("Failed to load interactive canvas");
                }
            };

            loadP5Component();

            // クリーンアップ関数
            return () => clearTimeout(timeoutId);
        }
    }, [isLoading, P5Component, loadError]);

    // 最適化されたシェーダーコード
    const vert = `
    attribute vec3 aPosition;
    attribute vec2 aTexCoord;
    varying vec2 vTexCoord;
    void main() {
        vTexCoord = aTexCoord;
        vec4 positionVec4 = vec4(aPosition, 1.0);
        positionVec4.xy = positionVec4.xy *2.0 - 1.0;
        gl_Position = positionVec4;
    }
    `;

    const frag = `
    #ifdef GL_ES
    precision mediump float;
    #endif
    uniform sampler2D logoL;
    uniform sampler2D logoC;
    uniform sampler2D logoR;
    uniform sampler2D backL;
    uniform sampler2D backC;
    uniform sampler2D backR;
    uniform vec2 u_resolution;
    uniform vec2 u_linePositions;
    uniform float u_time;
    varying vec2 vTexCoord;
    uniform float u_alphaAnimation;

    void main() {
        vec2 uv = vTexCoord;
        uv.y = 1.0 - uv.y;
        
        // テクスチャ選択をstep関数で実装
        float isLeft = step(uv.x, u_linePositions.x);
        float isRight = step(u_linePositions.y, uv.x);
        float isCenter = (1.0 - isLeft) * (1.0 - isRight);
        
        // 各テクスチャをサンプリング（条件分岐なし）
        vec4 logoL_sample = texture2D(logoL, uv);
        vec4 logoC_sample = texture2D(logoC, uv);
        vec4 logoR_sample = texture2D(logoR, uv);
        vec4 backL_sample = texture2D(backL, uv);
        vec4 backC_sample = texture2D(backC, uv);
        vec4 backR_sample = texture2D(backR, uv);
        
        // mix関数でテクスチャを合成
        vec4 texColor = logoL_sample * isLeft + logoC_sample * isCenter + logoR_sample * isRight;
        vec4 backColor = backL_sample * isLeft + backC_sample * isCenter + backR_sample * isRight;
        
        vec2 screenCoord = uv * u_resolution;
        float lineWidth = 1.0;
        float subLineWidth = 0.5;
        float leftLineX = u_linePositions.x * u_resolution.x;
        float rightLineX = u_linePositions.y * u_resolution.x;
        
        float distToLeftLine = abs(screenCoord.x - leftLineX);
        float distToRightLine = abs(screenCoord.x - rightLineX);
        
        float lineTop = u_resolution.y * 0.1;
        float lineBottom = u_resolution.y * 0.75;
        
        // inLineHeightをsmoothstepで計算
        float inLineHeight = smoothstep(lineTop - 1.0, lineTop, screenCoord.y) * 
                            (1.0 - smoothstep(lineBottom, lineBottom + 1.0, screenCoord.y));
        
        // isLineをstep関数で計算
        float isLeftLine = step(distToLeftLine, lineWidth);
        float isRightLine = step(distToRightLine, lineWidth);
        float isLine = (isLeftLine + isRightLine - isLeftLine * isRightLine) * inLineHeight;
        
        // isLineOutをstep関数で計算
        float isLeftLineOut = step(distToLeftLine, subLineWidth);
        float isRightLineOut = step(distToRightLine, subLineWidth);
        float isLineOut = (isLeftLineOut + isRightLineOut - isLeftLineOut * isRightLineOut) * (1.0 - inLineHeight);
        
        float gap = max(u_resolution.x * 0.02, 50.0);
        
        // gap領域の計算をstep関数で実装
        float leftGapStart = step(0.0, screenCoord.x - leftLineX);
        float leftGapEnd = 1.0 - step(gap, screenCoord.x - leftLineX);
        float isLeftLineRight = leftGapStart * leftGapEnd;
        
        float rightGapStart = step(0.0, screenCoord.x - rightLineX);
        float rightGapEnd = 1.0 - step(gap, screenCoord.x - rightLineX);
        float isRightLineRight = rightGapStart * rightGapEnd;
        
        float leftGapEdgeX = leftLineX + gap;
        float rightGapEdgeX = rightLineX + gap;
        
        // gap edge の計算
        float isLeftGapEdge = step(abs(screenCoord.x - leftGapEdgeX), subLineWidth) * step(leftLineX, screenCoord.x);
        float isRightGapEdge = step(abs(screenCoord.x - rightGapEdgeX), subLineWidth) * step(rightLineX, screenCoord.x);
        float isGapEdge = isLeftGapEdge + isRightGapEdge - isLeftGapEdge * isRightGapEdge;
        
        // gap領域でのアルファ処理
        float gapAlpha = 1.0 - (isLeftLineRight + isRightLineRight - isLeftLineRight * isRightLineRight);
        backColor.a *= gapAlpha;
        
        backColor.a *= u_alphaAnimation * 0.8;
        
        // 最終的な色の決定をmix関数で実装
        vec4 lineColor = vec4(0.0, 0.0, 0.0, 1.0);
        vec4 gapEdgeColor = vec4(0.0, 0.0, 0.0, 0.5);
        
        // 優先順位: line > gapEdge/lineOut > backColor
        backColor = mix(backColor, gapEdgeColor, isGapEdge + isLineOut - isGapEdge * isLineOut);
        backColor = mix(backColor, lineColor, isLine);
        
        gl_FragColor = mix(backColor, texColor, texColor.a);
    }
    `;

    // P5スケッチの変数とロジック
    const createSketchFunctions = () => {
        let logoL: any, logoC: any, logoR: any;
        let backL: any, backC: any, backR: any;
        let posL = 1.2, posR = 1.35;
        let targetPosL = 0.425, targetPosR = 0.575;
        let finalPosL = 0.425, finalPosR = 0.575;
        let theShader: any;
        let resolution: number[] = [];
        let imageAspectRatio = 1;

        // アニメーション制御パラメータ
        let animationComplete = false;
        let interactionEnabled = false;
        let animationStartTime = 0;
        let animationDuration = 2000;
        let interactionDelay = -200;

        // マウス制御パラメータ
        let centerAreaRatio = 0.173;
        let mouseSensitivity = 0.8;
        let lineInertia = 0.96;

        // マウス追跡用変数
        let prevMouseX = 0;
        let mouseVelocityX = 0;
        let smoothedVelocity = 0;
        let velocityHistory: number[] = [];
        let historyLength = 5;

        // エリア計算用変数
        let leftAreaEnd: number, rightAreaStart: number;

        const preload = (p: any) => {
            logoL = p.loadImage('/p5sketches/top-motion/logoL.png');
            logoC = p.loadImage('/p5sketches/top-motion/logoC.png');
            logoR = p.loadImage('/p5sketches/top-motion/logoR.png');
            backL = p.loadImage('/p5sketches/top-motion/backL.png');
            backC = p.loadImage('/p5sketches/top-motion/backC.png');
            backR = p.loadImage('/p5sketches/top-motion/backR.png');
        };

        const setup = (p: any, canvasParentRef: Element) => {
            if (logoL && logoL.width && logoL.height) {
                imageAspectRatio = logoL.width / logoL.height;
            }

            const aspectRatio = 1300 / 680;
            const canvasWidth = p.windowWidth;
            const canvasHeight = canvasWidth / aspectRatio;

            p.createCanvas(canvasWidth, canvasHeight, p.WEBGL).parent(canvasParentRef);
            resolution = [canvasWidth, canvasHeight];

            theShader = p.createShader(vert, frag);
            calculateAreas();

            prevMouseX = p.mouseX / p.width;
            velocityHistory = [];
            for (let i = 0; i < historyLength; i++) {
                velocityHistory.push(0);
            }

            animationStartTime = p.millis();
        };

        const draw = (p: any) => {
            p.background(255);
            centerAreaRatio = 0.25;

            if (!animationComplete) {
                updateAnimation(p);
            } else if (!interactionEnabled) {
                updateInteractionDelay(p);
                posL = finalPosL;
                posR = finalPosR;
                targetPosL = finalPosL;
                targetPosR = finalPosR;
            } else {
                calculateMouseVelocity(p);
                updateLinePositions(p);
            }

            p.shader(theShader);
            theShader.setUniform('logoL', logoL);
            theShader.setUniform('logoC', logoC);
            theShader.setUniform('logoR', logoR);
            theShader.setUniform('backL', backL);
            theShader.setUniform('backC', backC);
            theShader.setUniform('backR', backR);
            theShader.setUniform('u_resolution', resolution);
            theShader.setUniform('u_linePositions', [posL, posR]);
            theShader.setUniform('u_time', p.millis() * 0.001);

            let animationProgress = p.constrain(
                p.map(p.millis() - animationStartTime, animationDuration - 250, animationDuration + 750, 0, 1),
                0,
                1
            );
            theShader.setUniform('u_alphaAnimation', animationProgress);

            p.noStroke();
            p.fill(255);
            p.rect(0, 0, resolution[0], resolution[1]);
        };

        const windowResized = (p: any) => {
            const aspectRatio = 1300 / 680;
            const canvasWidth = p.windowWidth;
            const canvasHeight = canvasWidth / aspectRatio;

            p.resizeCanvas(canvasWidth, canvasHeight);
            resolution = [canvasWidth, canvasHeight];

            if (theShader) {
                theShader.setUniform('u_resolution', resolution);
            }
        };

        // ヘルパー関数群
        const updateAnimation = (p: any) => {
            let currentTime = p.millis();
            let elapsed = currentTime - animationStartTime;
            let progress = elapsed / animationDuration;

            if (progress >= 1.0) {
                progress = 1.0;
                animationComplete = true;
                posL = finalPosL;
                posR = finalPosR;
                targetPosL = finalPosL;
                targetPosR = finalPosR;
            } else {
                let easedProgress = easeOut(progress);
                posL = p.lerp(1.2, finalPosL, easedProgress);
                posR = p.lerp(1.35, finalPosR, easedProgress);
            }
        };

        const updateInteractionDelay = (p: any) => {
            let currentTime = p.millis();
            let timeSinceComplete = currentTime - (animationStartTime + animationDuration);

            if (timeSinceComplete >= interactionDelay) {
                interactionEnabled = true;
                let initialMouseX = 0.5;
                if (p.mouseX >= 0 && p.mouseX <= p.width && p.mouseY >= 0 && p.mouseY <= p.height) {
                    initialMouseX = p.mouseX / p.width;
                }

                prevMouseX = initialMouseX;
                for (let i = 0; i < historyLength; i++) {
                    velocityHistory[i] = 0;
                }
                smoothedVelocity = 0;
                mouseVelocityX = 0;
            }
        };

        const easeOut = (t: number) => {
            return 1 - Math.pow(1 - t, 2);
        };

        const calculateAreas = () => {
            let sideAreaRatio = (1.0 - centerAreaRatio) / 2.0;
            leftAreaEnd = sideAreaRatio;
            rightAreaStart = 1.0 - sideAreaRatio;
        };

        const calculateMouseVelocity = (p: any) => {
            let currentMouseX = p.mouseX / p.width;
            currentMouseX = p.constrain(currentMouseX, 0, 1);

            mouseVelocityX = currentMouseX - prevMouseX;

            velocityHistory.push(mouseVelocityX);
            velocityHistory.shift();

            smoothedVelocity = 0;
            for (let vel of velocityHistory) {
                smoothedVelocity += vel;
            }
            smoothedVelocity /= historyLength;

            prevMouseX = currentMouseX;
        };

        const updateLinePositions = (p: any) => {
            if (p.mouseX <= 0 || p.mouseX >= p.width || p.mouseY <= 0 || p.mouseY >= p.height) {
                return;
            }

            let velocityInfluence = smoothedVelocity * mouseSensitivity;
            let currentMouseX = p.mouseX / p.width;
            currentMouseX = p.constrain(currentMouseX, 0, 1);
            let mouseArea = getMouseArea(currentMouseX);

            switch (mouseArea) {
                case 'left':
                    let leftTarget = p.lerp(0.05, leftAreaEnd - 0.02, p.map(currentMouseX, 0, leftAreaEnd, 0, 1));
                    targetPosL = leftTarget;
                    targetPosR += (leftTarget - posL) * 0.1;
                    break;

                case 'right':
                    let rightTarget = p.lerp(rightAreaStart + 0.02, 0.95, p.map(currentMouseX, rightAreaStart, 1, 0, 1));
                    targetPosR = rightTarget;
                    targetPosL += (rightTarget - posR) * 0.1;
                    break;

                case 'center':
                default:
                    targetPosL += velocityInfluence * 0.5;
                    targetPosR += velocityInfluence * 0.5;
                    break;
            }

            ensureDistance();

            posL = p.lerp(posL, targetPosL, 1 - lineInertia);
            posR = p.lerp(posR, targetPosR, 1 - lineInertia);
        };

        const getMouseArea = (mouseX: number) => {
            if (mouseX < leftAreaEnd) {
                return 'left';
            } else if (mouseX > rightAreaStart) {
                return 'right';
            } else {
                return 'center';
            }
        };

        const ensureDistance = () => {
            let targetDistance = centerAreaRatio;
            let currentDistance = targetPosR - targetPosL;
            let distanceDiff = targetDistance - currentDistance;
            let correction = distanceDiff * 0.3;
            let halfCorrection = correction * 0.5;

            targetPosL -= halfCorrection;
            targetPosR += halfCorrection;

            if (targetPosL < 0.05) {
                let overflow = 0.05 - targetPosL;
                targetPosL = 0.05;
                targetPosR += overflow;
            }

            if (targetPosR > 0.95) {
                let overflow = targetPosR - 0.95;
                targetPosR = 0.95;
                targetPosL -= overflow;
            }
        };

        return { preload, setup, draw, windowResized };
    };

    // 初期ローディング中
    if (isLoading) {
        return (
            <div className="w-full h-full flex flex-col justify-center items-center font-en font-bold">
                <img
                    src="/gifs/icon/icon-01.gif"
                    alt="Loading..."
                    className="w-30"
                />
                <span className="ml-2 text-black">Loading...</span>
            </div>
        );
    }

    // エラー時のフォールバック
    if (loadError) {
        return (
            <div className="w-full h-full flex flex-col justify-center items-center font-en font-bold">
                <div className="text-red-500">⚠️ Canvas loading failed</div>
                <div className="text-sm text-gray-600 mt-2">Falling back to static content...</div>
                {/* 静的な代替コンテンツを表示 */}
                <img 
                    src="/p5sketches/top-motion/logoC.png" 
                    alt="Logo" 
                    className="mt-4 max-w-md opacity-80"
                />
            </div>
        );
    }

    // P5コンポーネントの読み込み中
    if (!P5Component) {
        return (
            <div className="w-full h-full flex flex-col justify-center items-center font-en font-bold">
                <img
                    src="/gifs/icon/icon-01.gif"
                    alt="Loading..."
                    className="w-30"
                />
                <span className="ml-2 text-black">Loading Canvas...</span>
            </div>
        );
    }

    // P5スケッチを描画
    const sketchFunctions = createSketchFunctions();

    return (
        <div className="w-full h-full">
            <P5Component
                preload={sketchFunctions.preload}
                setup={sketchFunctions.setup}
                draw={sketchFunctions.draw}
                windowResized={sketchFunctions.windowResized}
            />
        </div>
    );
}