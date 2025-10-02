import { Ball } from './types';

export class RenderingSystem {
    static drawBall(ctx: CanvasRenderingContext2D, ball: Ball): void {
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
    }

    static drawUI(ctx: CanvasRenderingContext2D, asteroidCount: number): void {
        const isMobile = window.innerWidth < 768;
        const panelWidth = isMobile ? 120 : 150;
        const panelHeight = isMobile ? 50 : 60;
        const margin = isMobile ? 15 : 20;
        const fontSizeTitle = isMobile ? '18px' : '24px';
        const fontSizeCount = isMobile ? '22px' : '28px';

        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = 2;

        ctx.fillRect(ctx.canvas.width - panelWidth - margin, margin, panelWidth, panelHeight);
        ctx.strokeRect(ctx.canvas.width - panelWidth - margin, margin, panelWidth, panelHeight);

        ctx.fillStyle = 'white';
        ctx.font = `bold ${fontSizeTitle} Arial`;
        ctx.textAlign = 'right';
        ctx.fillText('Астероиды:', ctx.canvas.width - margin - 10, margin + (isMobile ? 25 : 30));

        ctx.font = `bold ${fontSizeCount} Arial`;
        ctx.fillStyle = '#4FC3F7';
        ctx.fillText(asteroidCount.toString(), ctx.canvas.width - margin - 10, margin + (isMobile ? 45 : 60));
    }

    static clearCanvas(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement): void {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}