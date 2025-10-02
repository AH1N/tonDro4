import React, { useRef, useEffect } from 'react';
import { useAsteroidGame } from './useAsteroidGame';
import { BackButton } from './ui/BackButton';
import { InputSystem } from './gameEngine/inputSystem';
import './AsteroidGame.css';

interface AsteroidGameProps {
    onBack: () => void;
}

const AsteroidGame: React.FC<AsteroidGameProps> = ({ onBack }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const {
        gameState,
        initializeGame,
        gameLoop
    } = useAsteroidGame({
        onAsteroidCollected: () => {} // Счетчик теперь в gameState
    });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Инициализация игры
        initializeGame(canvas);

        // Обработчики событий
        const handleClick = (e: MouseEvent) => {
            InputSystem.handleCanvasClick(e, canvas, gameState.current);
        };

        const handleTouchStart = (e: TouchEvent) => {
            InputSystem.handleTouchStart(e, canvas, gameState.current);
        };

        const handleResize = () => {
            if (!canvas) return;
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            // Обновляем позицию шарика если он у края
            if (gameState.current.ball) {
                gameState.current.ball.x = Math.min(
                    gameState.current.ball.x,
                    canvas.width - gameState.current.ball.radius
                );
                gameState.current.ball.y = Math.min(
                    gameState.current.ball.y,
                    canvas.height - gameState.current.ball.radius
                );
                gameState.current.target.x = Math.min(
                    gameState.current.target.x,
                    canvas.width
                );
                gameState.current.target.y = Math.min(
                    gameState.current.target.y,
                    canvas.height
                );
            }
        };

        // Подписываемся на события
        canvas.addEventListener('click', handleClick);
        canvas.addEventListener('touchstart', handleTouchStart);
        window.addEventListener('resize', handleResize);

        // Запускаем игровой цикл
        const animate = gameLoop(canvas, ctx);
        gameState.current.animationId = requestAnimationFrame(animate);

        // Очистка
        return () => {
            if (gameState.current.animationId) {
                cancelAnimationFrame(gameState.current.animationId);
            }
            canvas.removeEventListener('click', handleClick);
            canvas.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('resize', handleResize);
        };
    }, [initializeGame, gameLoop, gameState]);

    return (
        <div className="asteroid-game">
            <BackButton onBack={onBack} />
            <canvas
                ref={canvasRef}
                className="game-canvas"
            />
        </div>
    );
};

export default AsteroidGame;