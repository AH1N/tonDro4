import React from 'react';

interface GameUIProps {
    asteroidCount: number;
}

export const GameUI: React.FC<GameUIProps> = ({ asteroidCount }) => {
    // Этот компонент можно использовать для дополнительного UI
    // поверх canvas, если понадобится
    return null; // Пока не используем
};