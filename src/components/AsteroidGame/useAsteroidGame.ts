// import { useCallback } from 'react';
//
// // Кастомный хук для вынесения игровой логики
// export const useAsteroidGame = () => {
//     const random = useCallback((min: number, max: number): number => {
//         return min + Math.random() * (max - min);
//     }, []);
//
//     // Функция для создания скругленного прямоугольника (для UI)
//     const roundRect = useCallback((
//         ctx: CanvasRenderingContext2D,
//         x: number,
//         y: number,
//         width: number,
//         height: number,
//         radius: number
//     ) => {
//         ctx.beginPath();
//         ctx.moveTo(x + radius, y);
//         ctx.lineTo(x + width - radius, y);
//         ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
//         ctx.lineTo(x + width, y + height - radius);
//         ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
//         ctx.lineTo(x + radius, y + height);
//         ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
//         ctx.lineTo(x, y + radius);
//         ctx.quadraticCurveTo(x, y, x + radius, y);
//         ctx.closePath();
//     }, []);
//
//     // Функция для создания эффектов сбора астероидов
//     const createCollectEffect = useCallback(() => {
//         // Можно добавить позже систему частиц
//         return [];
//     }, []);
//
//     return {
//         random,
//         roundRect,
//         createCollectEffect
//     };
// };

import { useCallback, useRef, useEffect } from 'react';
import { GameState, Ball } from './gameEngine/types';
import { StarSystem } from './gameEngine/starSystem';
import { AsteroidSystem } from './gameEngine/asteroidSystem';
import { CollisionSystem } from './gameEngine/collisionSystem';
import { RenderingSystem } from './gameEngine/renderingSystem';
import { InputSystem } from './gameEngine/inputSystem';
import { BALL_RADIUS } from './gameEngine/constants';

interface UseAsteroidGameProps {
    onAsteroidCollected: (count: number) => void;
}

export const useAsteroidGame = ({ onAsteroidCollected }: UseAsteroidGameProps) => {
    const gameState = useRef<GameState>({
        stars: [],
        asteroids: [],
        ball: null,
        moving: false,
        target: { x: 0, y: 0 },
        animationId: null,
        currentAsteroidCount: 0
    });

    const random = useCallback((min: number, max: number): number => {
        return min + Math.random() * (max - min);
    }, []);

    const initializeGame = useCallback((canvas: HTMLCanvasElement) => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        if (gameState.current.stars.length === 0) {
            gameState.current.stars = StarSystem.createStars(canvas, random);
        }
        if (gameState.current.asteroids.length === 0) {
            gameState.current.asteroids = AsteroidSystem.createAsteroids(canvas, random);
        }
        if (!gameState.current.ball) {
            const isMobile = window.innerWidth < 768;
            gameState.current.ball = {
                x: canvas.width / 2,
                y: canvas.height / 2,
                radius: isMobile ? 15 : BALL_RADIUS,
                speedX: 0,
                speedY: 0
            };
            gameState.current.target = { x: canvas.width / 2, y: canvas.height / 2 };
        }
    }, [random]);

    const updateGameLogic = useCallback((ball: Ball) => {
        if (gameState.current.moving) {
            const dx = gameState.current.target.x - ball.x;
            const dy = gameState.current.target.y - ball.y;
            const distance = Math.hypot(dx, dy);
            const stopDistance = ball.radius * 3;

            let speedFactor = 1;
            if (distance > stopDistance * 2) {
                speedFactor = distance / (stopDistance * 2);
            } else if (distance <= stopDistance) {
                speedFactor = 1 - (distance / stopDistance);
            }

            if (distance < 1) {
                ball.x = gameState.current.target.x;
                ball.y = gameState.current.target.y;
                ball.speedX = 0;
                ball.speedY = 0;
                gameState.current.moving = false;
            } else {
                ball.x += ball.speedX * speedFactor;
                ball.y += ball.speedY * speedFactor;
            }
        }
    }, []);

    const checkBoundaries = useCallback((ball: Ball, canvas: HTMLCanvasElement) => {
        if (ball.x + ball.radius >= canvas.width) {
            ball.x = canvas.width - ball.radius;
            ball.speedX = 0;
            gameState.current.moving = false;
        }
        if (ball.x - ball.radius <= 0) {
            ball.x = ball.radius;
            ball.speedX = 0;
            gameState.current.moving = false;
        }
        if (ball.y + ball.radius >= canvas.height) {
            ball.y = canvas.height - ball.radius;
            ball.speedY = 0;
            gameState.current.moving = false;
        }
        if (ball.y - ball.radius <= 0) {
            ball.y = ball.radius;
            ball.speedY = 0;
            gameState.current.moving = false;
        }
    }, []);

    const gameLoop = useCallback((canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
        if (!gameState.current.ball) return;

        const animate = () => {
            // Очистка и отрисовка
            RenderingSystem.clearCanvas(ctx, canvas);
            StarSystem.updateStars(gameState.current.stars, random);
            StarSystem.drawStars(ctx, gameState.current.stars);
            AsteroidSystem.drawAsteroids(ctx, gameState.current.asteroids);
            RenderingSystem.drawBall(ctx, gameState.current.ball!);

            // Коллизии
            gameState.current.asteroids = CollisionSystem.checkAsteroidCollisions(
                gameState.current.ball,
                gameState.current.asteroids,
                (collected) => {
                    gameState.current.currentAsteroidCount += collected;
                    onAsteroidCollected(collected);
                }
            );

            // Логика игры
            updateGameLogic(gameState.current.ball);
            checkBoundaries(gameState.current.ball, canvas);

            // UI
            RenderingSystem.drawUI(ctx, gameState.current.currentAsteroidCount);

            gameState.current.animationId = requestAnimationFrame(animate);
        };

        return animate;
    }, [random, updateGameLogic, checkBoundaries, onAsteroidCollected]);

    return {
        gameState,
        initializeGame,
        gameLoop,
        random
    };
};