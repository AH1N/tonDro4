import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useAsteroidGame } from './useAsteroidGame';
import './AsteroidGame.css';

interface AsteroidGameProps {
    onBack: () => void;
}

interface Star {
    x: number;
    y: number;
    size: number;
    alpha: number;
    color: number[];
}

interface Asteroid {
    x: number;
    y: number;
    size: number;
    color: string;
    vertices: { angle: number; radius: number }[];
}

interface Ball {
    x: number;
    y: number;
    radius: number;
    speedX: number;
    speedY: number;
}

const AsteroidGame: React.FC<AsteroidGameProps> = ({ onBack }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [asteroidCount, setAsteroidCount] = useState(0);
    const { random, roundRect, createCollectEffect } = useAsteroidGame();

    // Используем useRef для хранения игрового состояния
    const gameState = useRef({
        stars: [] as Star[],
        asteroids: [] as Asteroid[],
        ball: null as Ball | null,
        moving: false,
        target: { x: 0, y: 0 },
        animationId: null as number | null
    });

    // Константы
    const whiteColor = [255, 255, 255];
    const lightBlueColor = [173, 255, 255];
    const blinkChance = 0.01;

    // Функция для генерации случайного числа
    // const random = useCallback((min: number, max: number): number => {
    //     return min + Math.random() * (max - min);
    // }, []);

    // Создание звезд
    const createStars = useCallback((canvas: HTMLCanvasElement) => {
        const numStars = canvas.width * canvas.height / 2000;
        const stars: Star[] = [];

        for (let i = 0; i < numStars; i++) {
            stars.push({
                x: random(0, canvas.width),
                y: random(0, canvas.height),
                size: random(1, 3),
                alpha: random(0.5, 1),
                color: whiteColor
            });
        }
        return stars;
    }, [random]);

    // Создание астероидов
    const createAsteroids = useCallback((canvas: HTMLCanvasElement) => {
        const numAsteroids = 30;
        const asteroids: Asteroid[] = [];

        for (let i = 0; i < numAsteroids; i++) {
            const vertices = [];
            const numVertices = Math.floor(random(5, 9));
            const size = random(10, 20);

            for (let j = 0; j < numVertices; j++) {
                const angle = (j / numVertices) * Math.PI * 2;
                const radius = size * (0.7 + Math.random() * 0.3);
                vertices.push({ angle, radius });
            }

            asteroids.push({
                x: random(0, canvas.width),
                y: random(0, canvas.height),
                size: size,
                color: 'gray',
                vertices: vertices
            });
        }
        return asteroids;
    }, [random]);

    // Отрисовка звезд
    const drawStars = useCallback((ctx: CanvasRenderingContext2D, stars: Star[]) => {
        for (let star of stars) {
            if (Math.random() < blinkChance) {
                if (Math.random() < 0.5) {
                    star.color = lightBlueColor;
                    star.alpha = random(0.5, 1);
                } else {
                    star.color = whiteColor;
                    star.alpha = random(0.5, 1);
                }
            }

            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${star.color[0]}, ${star.color[1]}, ${star.color[2]}, ${star.alpha})`;
            ctx.fill();
        }
    }, [random]);

    // Отрисовка астероидов
    // Отрисовка астероидов (упрощенная версия с кругами)
    const drawAsteroids = useCallback((ctx: CanvasRenderingContext2D, asteroids: Asteroid[]) => {
        for (let asteroid of asteroids) {
            ctx.beginPath();
            ctx.arc(asteroid.x, asteroid.y, asteroid.size, 0, Math.PI * 2);
            ctx.fillStyle = asteroid.color;
            ctx.fill();
        }
    }, []);
    // const drawAsteroids = useCallback((ctx: CanvasRenderingContext2D, asteroids: Asteroid[]) => {
    //     for (let asteroid of asteroids) {
    //         ctx.beginPath();
    //         for (let i = 0; i < asteroid.vertices.length; i++) {
    //             const vertex = asteroid.vertices[i];
    //             const x = asteroid.x + Math.cos(vertex.angle) * vertex.radius;
    //             const y = asteroid.y + Math.sin(vertex.angle) * vertex.radius;
    //             if (i === 0) {
    //                 ctx.moveTo(x, y);
    //             } else {
    //                 ctx.lineTo(x, y);
    //             }
    //         }
    //         ctx.closePath();
    //         ctx.fillStyle = asteroid.color;
    //         ctx.fill();
    //     }
    // }, []);

    // Проверка столкновений
    const checkAsteroidCollision = useCallback((ball: Ball, asteroids: Asteroid[]) => {
        let collected = 0;
        const remainingAsteroids = asteroids.filter(asteroid => {
            const distance = Math.hypot(ball.x - asteroid.x, ball.y - asteroid.y);
            if (distance < ball.radius + asteroid.size) {
                collected++;
                return false; // Удаляем астероид
            }
            return true; // Сохраняем астероид
        });

        return { remainingAsteroids, collected };
    }, []);

    // Отрисовка UI
    const drawUI = useCallback((ctx: CanvasRenderingContext2D, count: number) => {
        const panelWidth = 150;
        const panelHeight = 60;
        const margin = 20;

        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = 2;

        ctx.fillRect(ctx.canvas.width - panelWidth - margin, margin, panelWidth, panelHeight);
        ctx.strokeRect(ctx.canvas.width - panelWidth - margin, margin, panelWidth, panelHeight);

        ctx.fillStyle = 'white';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'right';
        ctx.fillText('Астероиды:', ctx.canvas.width - margin - 10, margin + 30);

        ctx.font = 'bold 28px Arial';
        ctx.fillStyle = '#4FC3F7';
        ctx.fillText(count.toString(), ctx.canvas.width - margin - 10, margin + 60);
    }, []);

    // Инициализация игры
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Установка размеров
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Инициализация игровых объектов
        gameState.current.stars = createStars(canvas);
        gameState.current.asteroids = createAsteroids(canvas);
        gameState.current.ball = {
            x: canvas.width / 2,
            y: canvas.height / 2,
            radius: 10,
            speedX: 0,
            speedY: 0
        };
        gameState.current.target = { x: canvas.width / 2, y: canvas.height / 2 };

        // Обработчик клика
        const handleClick = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            const targetX = e.clientX - rect.left;
            const targetY = e.clientY - rect.top;

            if (!gameState.current.ball) return;

            const dx = targetX - gameState.current.ball.x;
            const dy = targetY - gameState.current.ball.y;
            const distance = Math.hypot(dx, dy);

            if (distance === 0) return;

            const speed = 0.8;
            gameState.current.ball.speedX = (dx / distance) * speed;
            gameState.current.ball.speedY = (dy / distance) * speed;
            gameState.current.moving = true;
            gameState.current.target = { x: targetX, y: targetY };
        };

        // Обработчик ресайза
        const handleResize = () => {
            if (!canvas) return;
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            gameState.current.stars = createStars(canvas);
            gameState.current.asteroids = createAsteroids(canvas);
        };

        canvas.addEventListener('click', handleClick);
        window.addEventListener('resize', handleResize);

        // Игровой цикл
        const animate = () => {
            if (!ctx || !gameState.current.ball) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            drawStars(ctx, gameState.current.stars);
            drawAsteroids(ctx, gameState.current.asteroids);

            // Отрисовка шарика
            ctx.beginPath();
            ctx.arc(gameState.current.ball.x, gameState.current.ball.y, gameState.current.ball.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'white';
            ctx.fill();

            // Проверка столкновений
            const { remainingAsteroids, collected } = checkAsteroidCollision(
                gameState.current.ball,
                gameState.current.asteroids
            );
            gameState.current.asteroids = remainingAsteroids;
            if (collected > 0) {
                setAsteroidCount(prev => prev + collected);
            }

            // Логика движения
            if (gameState.current.moving && gameState.current.ball) {
                const dx = gameState.current.target.x - gameState.current.ball.x;
                const dy = gameState.current.target.y - gameState.current.ball.y;
                const distance = Math.hypot(dx, dy);
                const stopDistance = gameState.current.ball.radius * 3;

                let speedFactor = 1;
                if (distance > stopDistance * 2) {
                    speedFactor = distance / (stopDistance * 2);
                } else if (distance <= stopDistance) {
                    speedFactor = 1 - (distance / stopDistance);
                }

                if (distance < 1) {
                    gameState.current.ball.x = gameState.current.target.x;
                    gameState.current.ball.y = gameState.current.target.y;
                    gameState.current.ball.speedX = 0;
                    gameState.current.ball.speedY = 0;
                    gameState.current.moving = false;
                } else {
                    gameState.current.ball.x += gameState.current.ball.speedX * speedFactor;
                    gameState.current.ball.y += gameState.current.ball.speedY * speedFactor;
                }
            }

            // Границы
            if (gameState.current.ball) {
                if (gameState.current.ball.x + gameState.current.ball.radius >= canvas.width) {
                    gameState.current.ball.x = canvas.width - gameState.current.ball.radius;
                    gameState.current.ball.speedX = 0;
                    gameState.current.moving = false;
                }
                if (gameState.current.ball.x - gameState.current.ball.radius <= 0) {
                    gameState.current.ball.x = gameState.current.ball.radius;
                    gameState.current.ball.speedX = 0;
                    gameState.current.moving = false;
                }
                if (gameState.current.ball.y + gameState.current.ball.radius >= canvas.height) {
                    gameState.current.ball.y = canvas.height - gameState.current.ball.radius;
                    gameState.current.ball.speedY = 0;
                    gameState.current.moving = false;
                }
                if (gameState.current.ball.y - gameState.current.ball.radius <= 0) {
                    gameState.current.ball.y = gameState.current.ball.radius;
                    gameState.current.ball.speedY = 0;
                    gameState.current.moving = false;
                }
            }

            drawUI(ctx, asteroidCount);
            gameState.current.animationId = requestAnimationFrame(animate);
        };

        gameState.current.animationId = requestAnimationFrame(animate);

        // Очистка
        return () => {
            if (gameState.current.animationId) {
                cancelAnimationFrame(gameState.current.animationId);
            }
            canvas.removeEventListener('click', handleClick);
            window.removeEventListener('resize', handleResize);
        };
    }, [createStars, createAsteroids, drawStars, drawAsteroids, checkAsteroidCollision, drawUI, asteroidCount]);

    return (
        <div className="asteroid-game">
            <button
                className="back-button"
                onClick={onBack}
            >
                ← Назад
            </button>

            <canvas
                ref={canvasRef}
                className="game-canvas"
            />
        </div>
    );
};

export default AsteroidGame;