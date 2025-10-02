import { Star, GameConfig } from './types';
import { WHITE_COLOR, LIGHT_BLUE_COLOR, BLINK_CHANCE, NUM_STARS_DENSITY } from './constants';

export class StarSystem {
    static createStars(canvas: HTMLCanvasElement, random: (min: number, max: number) => number): Star[] {
        const numStars = canvas.width * canvas.height / NUM_STARS_DENSITY;
        const stars: Star[] = [];

        for (let i = 0; i < numStars; i++) {
            stars.push({
                x: random(0, canvas.width),
                y: random(0, canvas.height),
                size: random(1, 3),
                alpha: random(0.5, 1),
                color: WHITE_COLOR
            });
        }
        return stars;
    }

    static updateStars(stars: Star[], random: (min: number, max: number) => number): void {
        for (let star of stars) {
            if (Math.random() < BLINK_CHANCE) {
                if (Math.random() < 0.5) {
                    star.color = LIGHT_BLUE_COLOR;
                    star.alpha = random(0.5, 1);
                } else {
                    star.color = WHITE_COLOR;
                    star.alpha = random(0.5, 1);
                }
            }
        }
    }

    static drawStars(ctx: CanvasRenderingContext2D, stars: Star[]): void {
        for (let star of stars) {
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${star.color[0]}, ${star.color[1]}, ${star.color[2]}, ${star.alpha})`;
            ctx.fill();
        }
    }
}