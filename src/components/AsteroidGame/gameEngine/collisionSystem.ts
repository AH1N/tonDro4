import { Ball, Asteroid } from './types';

export class CollisionSystem {
    static checkAsteroidCollisions(
        ball: Ball,
        asteroids: Asteroid[],
        onCollect: (count: number) => void
    ): Asteroid[] {
        let collected = 0;
        const remainingAsteroids = asteroids.filter(asteroid => {
            const distance = Math.hypot(ball.x - asteroid.x, ball.y - asteroid.y);
            if (distance < ball.radius + asteroid.size) {
                collected++;
                return false;
            }
            return true;
        });

        if (collected > 0) {
            onCollect(collected);
        }

        return remainingAsteroids;
    }
}