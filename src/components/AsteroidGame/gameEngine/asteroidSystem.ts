import { Asteroid } from './types';
import { NUM_ASTEROIDS } from './constants';

export class AsteroidSystem {
    static createAsteroids(canvas: HTMLCanvasElement, random: (min: number, max: number) => number): Asteroid[] {
        const asteroids: Asteroid[] = [];

        for (let i = 0; i < NUM_ASTEROIDS; i++) {
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
    }

    static drawAsteroids(ctx: CanvasRenderingContext2D, asteroids: Asteroid[]): void {
        for (let asteroid of asteroids) {
            ctx.beginPath();
            ctx.arc(asteroid.x, asteroid.y, asteroid.size, 0, Math.PI * 2);
            ctx.fillStyle = asteroid.color;
            ctx.fill();
        }
    }
}