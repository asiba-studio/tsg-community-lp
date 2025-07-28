'use client'

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import p5 from "p5";



export interface P5SketchProps {
    preload?: (p5: p5) => void;
    setup?: (p5: p5, canvasParentRef: Element) => void;
    draw?: (p5: p5) => void;
    windowResized?: (p5: p5) => void;
    [key: string]: any;
}

const Sketch = dynamic(() => import("react-p5"), {
    ssr: false,
}) as React.ComponentType<P5SketchProps>;

export default function HeroSection() {
    const [isLoading, setIsLoading] = useState(true);
    const [canShowSketch, setCanShowSketch] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1800); 

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        // react-p5の読み込み完了を待つ
        const loadTimer = setTimeout(() => {
            setCanShowSketch(true);
        }, 100); // 少し遅延させてreact-p5の準備を確実にする

        return () => clearTimeout(loadTimer);
    }, []);

    // シェーダーコード
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
    `

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
        
        vec4 texColor;
        vec4 backColor;
        
        if (uv.x < u_linePositions.x) {
            texColor = texture2D(logoL, uv);
            backColor = texture2D(backL, uv);
        } else if (uv.x > u_linePositions.y) {
            texColor = texture2D(logoR, uv);
            backColor = texture2D(backR, uv);
        } else {
            texColor = texture2D(logoC, uv);
            backColor = texture2D(backC, uv);
        }
        
        vec2 screenCoord = uv * u_resolution;
        float lineWidth = 1.0;
        float subLineWidth = 0.5;
        float leftLineX = u_linePositions.x * u_resolution.x;
        float rightLineX = u_linePositions.y * u_resolution.x;
        
        float distToLeftLine = abs(screenCoord.x - leftLineX);
        float distToRightLine = abs(screenCoord.x - rightLineX);
        
        float lineTop = u_resolution.y * 0.1;
        float lineBottom = u_resolution.y * 0.75;
        bool inLineHeight = screenCoord.y > lineTop && screenCoord.y < lineBottom;
        
        bool isLine = (distToLeftLine < lineWidth || distToRightLine < lineWidth) && inLineHeight;
        bool isLineOut = (distToLeftLine < subLineWidth || distToRightLine < subLineWidth) && !inLineHeight;
        
        float gap = max(u_resolution.x * 0.02, 50.0);
        bool isLeftLineRight = (screenCoord.x - leftLineX < gap ) && (screenCoord.x - leftLineX > 0.0);
        bool isRightLineRight = (screenCoord.x - rightLineX < gap ) && (screenCoord.x - rightLineX > 0.0);
        
        float leftGapEdgeX = leftLineX + gap;
        float rightGapEdgeX = rightLineX + gap;

        bool isGapEdge = (abs(screenCoord.x - leftGapEdgeX) < subLineWidth && screenCoord.x > leftLineX) || 
                         (abs(screenCoord.x - rightGapEdgeX) < subLineWidth && screenCoord.x > rightLineX);
        
        if (isLeftLineRight || isRightLineRight) {
            backColor = vec4(0.0, 0.0, 0.0, 0.0);
        }
        
        backColor.a *= u_alphaAnimation;
        backColor.a *= 0.8;
        
        if (isLine) {
            backColor = vec4(0.0, 0.0, 0.0, 1.0);
        } else if (isGapEdge || isLineOut) {
            backColor = vec4(0.0, 0.0, 0.0, 0.5);
        } 
        
        gl_FragColor = mix(backColor, texColor, texColor.a);
    }
    `

    // 変数定義
    let logoL: any, logoC: any, logoR: any
    let backL: any, backC: any, backR: any
    let posL = 1.2, posR = 1.35
    let targetPosL = 0.425, targetPosR = 0.575
    let finalPosL = 0.425, finalPosR = 0.575
    let theShader: any
    let resolution: number[] = []
    let imageAspectRatio = 1

    // アニメーション制御パラメータ
    let animationComplete = false
    let interactionEnabled = false
    let animationStartTime = 0
    let animationDuration = 2000
    let interactionDelay = -200

    // マウス制御パラメータ
    let centerAreaRatio = 0.173
    let mouseSensitivity = 0.8
    let lineInertia = 0.96

    // マウス追跡用変数
    let prevMouseX = 0
    let mouseVelocityX = 0
    let smoothedVelocity = 0
    let velocityHistory: number[] = []
    let historyLength = 5

    // エリア計算用変数
    let leftAreaEnd: number, rightAreaStart: number

    const preload = (p: p5) => {
        logoL = p.loadImage('/p5sketches/top-motion/logoL.png')
        logoC = p.loadImage('/p5sketches/top-motion/logoC.png')
        logoR = p.loadImage('/p5sketches/top-motion/logoR.png')
        backL = p.loadImage('/p5sketches/top-motion/backL.png')
        backC = p.loadImage('/p5sketches/top-motion/backC.png')
        backR = p.loadImage('/p5sketches/top-motion/backR.png')
    }

    const setup = (p: p5, canvasParentRef: Element) => {
        if (logoL && logoL.width && logoL.height) {
            imageAspectRatio = logoL.width / logoL.height
        }

        // アスペクト比1300:680に固定
        const aspectRatio = 1300 / 680
        const canvasWidth = p.windowWidth
        const canvasHeight = canvasWidth / aspectRatio

        p.createCanvas(canvasWidth, canvasHeight, p.WEBGL).parent(canvasParentRef)
        resolution = [canvasWidth, canvasHeight]

        // シェーダー初期化
        theShader = p.createShader(vert, frag)

        // エリア境界を計算
        calculateAreas()

        // マウス位置を初期化
        prevMouseX = p.mouseX / p.width

        // 速度履歴を初期化
        velocityHistory = []
        for (let i = 0; i < historyLength; i++) {
            velocityHistory.push(0)
        }

        // アニメーション開始
        animationStartTime = p.millis()
    }

    const draw = (p: p5) => {
        p.background(255)
        centerAreaRatio = 0.25

        // アニメーション処理
        if (!animationComplete) {
            updateAnimation(p)
        } else if (!interactionEnabled) {
            updateInteractionDelay(p)
            posL = finalPosL
            posR = finalPosR
            targetPosL = finalPosL
            targetPosR = finalPosR
        } else {
            calculateMouseVelocity(p)
            updateLinePositions(p)
        }

        // シェーダーの描画
        p.shader(theShader)
        theShader.setUniform('logoL', logoL)
        theShader.setUniform('logoC', logoC)
        theShader.setUniform('logoR', logoR)
        theShader.setUniform('backL', backL)
        theShader.setUniform('backC', backC)
        theShader.setUniform('backR', backR)
        theShader.setUniform('u_resolution', resolution)
        theShader.setUniform('u_linePositions', [posL, posR])
        theShader.setUniform('u_time', p.millis() * 0.001)

        let animationProgress = p.constrain(p.map(p.millis() - animationStartTime, animationDuration - 250, animationDuration + 750, 0, 1), 0, 1)
        theShader.setUniform('u_alphaAnimation', animationProgress)

        p.noStroke()
        p.fill(255)
        p.rect(0, 0, resolution[0], resolution[1])
    }

    const updateAnimation = (p: p5) => {
        let currentTime = p.millis()
        let elapsed = currentTime - animationStartTime
        let progress = elapsed / animationDuration

        if (progress >= 1.0) {
            progress = 1.0
            animationComplete = true
            posL = finalPosL
            posR = finalPosR
            targetPosL = finalPosL
            targetPosR = finalPosR
        } else {
            let easedProgress = easeOut(progress)
            posL = p.lerp(1.2, finalPosL, easedProgress)
            posR = p.lerp(1.35, finalPosR, easedProgress)
        }
    }

    const updateInteractionDelay = (p: p5) => {
        let currentTime = p.millis()
        let timeSinceComplete = currentTime - (animationStartTime + animationDuration)

        if (timeSinceComplete >= interactionDelay) {
            interactionEnabled = true
            let initialMouseX = 0.5
            if (p.mouseX >= 0 && p.mouseX <= p.width && p.mouseY >= 0 && p.mouseY <= p.height) {
                initialMouseX = p.mouseX / p.width
            }

            prevMouseX = initialMouseX
            for (let i = 0; i < historyLength; i++) {
                velocityHistory[i] = 0
            }
            smoothedVelocity = 0
            mouseVelocityX = 0
        }
    }

    const easeOut = (t: number) => {
        return 1 - Math.pow(1 - t, 2)
    }

    const calculateAreas = () => {
        let sideAreaRatio = (1.0 - centerAreaRatio) / 2.0
        leftAreaEnd = sideAreaRatio
        rightAreaStart = 1.0 - sideAreaRatio
    }

    const calculateMouseVelocity = (p: p5) => {
        let currentMouseX = p.mouseX / p.width
        currentMouseX = p.constrain(currentMouseX, 0, 1)

        mouseVelocityX = currentMouseX - prevMouseX

        velocityHistory.push(mouseVelocityX)
        velocityHistory.shift()

        smoothedVelocity = 0
        for (let vel of velocityHistory) {
            smoothedVelocity += vel
        }
        smoothedVelocity /= historyLength

        prevMouseX = currentMouseX
    }

    const updateLinePositions = (p: p5) => {
        if (p.mouseX <= 0 || p.mouseX >= p.width || p.mouseY <= 0 || p.mouseY >= p.height) {
            return
        }

        let velocityInfluence = smoothedVelocity * mouseSensitivity
        let currentMouseX = p.mouseX / p.width
        currentMouseX = p.constrain(currentMouseX, 0, 1)
        let mouseArea = getMouseArea(currentMouseX)

        switch (mouseArea) {
            case 'left':
                let leftTarget = p.lerp(0.05, leftAreaEnd - 0.02, p.map(currentMouseX, 0, leftAreaEnd, 0, 1))
                targetPosL = leftTarget
                targetPosR += (leftTarget - posL) * 0.1
                break

            case 'right':
                let rightTarget = p.lerp(rightAreaStart + 0.02, 0.95, p.map(currentMouseX, rightAreaStart, 1, 0, 1))
                targetPosR = rightTarget
                targetPosL += (rightTarget - posR) * 0.1
                break

            case 'center':
            default:
                targetPosL += velocityInfluence * 0.5
                targetPosR += velocityInfluence * 0.5
                break
        }

        ensureDistance()

        posL = p.lerp(posL, targetPosL, 1 - lineInertia)
        posR = p.lerp(posR, targetPosR, 1 - lineInertia)
    }

    const getMouseArea = (mouseX: number) => {
        if (mouseX < leftAreaEnd) {
            return 'left'
        } else if (mouseX > rightAreaStart) {
            return 'right'
        } else {
            return 'center'
        }
    }

    const ensureDistance = () => {
        let targetDistance = centerAreaRatio
        let currentDistance = targetPosR - targetPosL
        let distanceDiff = targetDistance - currentDistance
        let correction = distanceDiff * 0.3
        let halfCorrection = correction * 0.5

        targetPosL -= halfCorrection
        targetPosR += halfCorrection

        if (targetPosL < 0.05) {
            let overflow = 0.05 - targetPosL
            targetPosL = 0.05
            targetPosR += overflow
        }

        if (targetPosR > 0.95) {
            let overflow = targetPosR - 0.95
            targetPosR = 0.95
            targetPosL -= overflow
        }
    }

    const calculateCanvasSize = (maxWidth: number, maxHeight: number) => {
        let windowAspect = maxWidth / maxHeight
        let canvasWidth: number, canvasHeight: number

        if (imageAspectRatio > windowAspect) {
            canvasWidth = maxWidth
            canvasHeight = maxWidth / imageAspectRatio
        } else {
            canvasHeight = maxHeight
            canvasWidth = maxHeight * imageAspectRatio
        }

        return { width: canvasWidth, height: canvasHeight }
    }

    const windowResized = (p: p5) => {
        // アスペクト比1300:680に固定
        const aspectRatio = 1300 / 680
        const canvasWidth = p.windowWidth
        const canvasHeight = canvasWidth / aspectRatio

        p.resizeCanvas(canvasWidth, canvasHeight)
        resolution = [canvasWidth, canvasHeight]

        if (theShader) {
            theShader.setUniform('u_resolution', resolution)
        }
    }

    if (isLoading || !canShowSketch) {

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

    return (
        <div className="w-full h-full">
            <Sketch
                preload={preload}
                setup={setup}
                draw={draw}
                windowResized={windowResized}
            />
        </div>
    )
}