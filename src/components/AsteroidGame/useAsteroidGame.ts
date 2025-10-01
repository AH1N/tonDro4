import { useCallback } from 'react';

// Кастомный хук для вынесения игровой логики
export const useAsteroidGame = () => {
    const random = useCallback((min: number, max: number): number => {
        return min + Math.random() * (max - min);
    }, []);

    // Функция для создания скругленного прямоугольника (для UI)
    const roundRect = useCallback((
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        width: number,
        height: number,
        radius: number
    ) => {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
    }, []);

    // Функция для создания эффектов сбора астероидов
    const createCollectEffect = useCallback(() => {
        // Можно добавить позже систему частиц
        return [];
    }, []);

    return {
        random,
        roundRect,
        createCollectEffect
    };
};