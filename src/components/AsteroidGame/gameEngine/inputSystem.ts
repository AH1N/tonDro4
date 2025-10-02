import { GameState, Ball } from './types';
import { BALL_SPEED } from './constants';

export class InputSystem {
    static handleCanvasClick(
        e: MouseEvent,
        canvas: HTMLCanvasElement,
        gameState: GameState
    ): void {
        const rect = canvas.getBoundingClientRect();
        const targetX = e.clientX - rect.left;
        const targetY = e.clientY - rect.top;

        if (!gameState.ball) return;

        const dx = targetX - gameState.ball.x;
        const dy = targetY - gameState.ball.y;
        const distance = Math.hypot(dx, dy);

        if (distance === 0) return;

        gameState.ball.speedX = (dx / distance) * BALL_SPEED;
        gameState.ball.speedY = (dy / distance) * BALL_SPEED;
        gameState.moving = true;
        gameState.target = { x: targetX, y: targetY };
    }

    static handleTouchStart(
        e: TouchEvent,
        canvas: HTMLCanvasElement,
        gameState: GameState
    ): void {
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        const touch = e.touches[0];
        const targetX = touch.clientX - rect.left;
        const targetY = touch.clientY - rect.top;

        if (!gameState.ball) return;

        const dx = targetX - gameState.ball.x;
        const dy = targetY - gameState.ball.y;
        const distance = Math.hypot(dx, dy);

        if (distance === 0) return;

        gameState.ball.speedX = (dx / distance) * BALL_SPEED;
        gameState.ball.speedY = (dy / distance) * BALL_SPEED;
        gameState.moving = true;
        gameState.target = { x: targetX, y: targetY };
    }
}