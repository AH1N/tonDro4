export interface Star {
    x: number;
    y: number;
    size: number;
    alpha: number;
    color: number[];
}

export interface Asteroid {
    x: number;
    y: number;
    size: number;
    color: string;
    vertices: { angle: number; radius: number }[];
}

export interface Ball {
    x: number;
    y: number;
    radius: number;
    speedX: number;
    speedY: number;
}

export interface GameState {
    stars: Star[];
    asteroids: Asteroid[];
    ball: Ball | null;
    moving: boolean;
    target: { x: number; y: number };
    animationId: number | null;
    currentAsteroidCount: number;
}

export interface GameConfig {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    gameState: React.MutableRefObject<GameState>;
    onAsteroidCollected: (count: number) => void;
}