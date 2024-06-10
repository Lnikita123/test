// calculating the chess square
import { ArrowLineType } from "@/store/useInteraction";
function fillSquare(
  ctx: CanvasRenderingContext2D,
  position: { x: number; y: number },
  color: string
): void {
  const squareSize = 100; // assuming 50 as the size of each square, adjust as needed
  ctx.fillStyle = color;
  ctx.fillRect(
    position.x * squareSize,
    position.y * squareSize,
    squareSize,
    squareSize
  );
}
//calculating the position of clicked square
function getSquare(
  position: { x: number; y: number },
  squareSize: number
): { x: number; y: number } {
  return {
    x: position.x / squareSize,
    y: position.y / squareSize,
  };
}
// draw shape function to calculate the shape x,y
const drawShape = (
  ctx: CanvasRenderingContext2D,
  shapeObject: ArrowLineType,
  shape: "arrow" | "line" | "brush"
) => {
  const { start, end, color } = shapeObject;
  ctx.strokeStyle = color;
  if (shape === "arrow") {
    const arrowLength = distance(start, end);

    // Define a minimum length for the arrow
    const minArrowLength = 10; // Adjust this value as needed

    // If the arrow is too short, ignore the draw operation
    if (arrowLength < minArrowLength) {
      return;
    }
    const headLength = 20;
    const angle = Math.atan2(end.y - start.y, end.x - start.x);
    const arrowEnd = {
      x: end.x - headLength * Math.cos(angle),
      y: end.y - headLength * Math.sin(angle),
    };
    shapeObject.head = {
      a: { x: arrowEnd.x, y: arrowEnd.y },
      b: {
        x: arrowEnd.x - headLength * Math.cos(angle - Math.PI / 6),
        y: arrowEnd.y - headLength * Math.sin(angle - Math.PI / 6),
      },
      c: {
        x: arrowEnd.x - headLength * Math.cos(angle + Math.PI / 6),
        y: arrowEnd.y - headLength * Math.sin(angle + Math.PI / 6),
      },
    };
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(arrowEnd.x, arrowEnd.y);
    ctx.stroke();
    // ctx.strokeStyle = color;
    // ctx.fillStyle = color;
    ctx.beginPath();
    ctx.lineTo(
      arrowEnd.x - headLength * Math.cos(angle - Math.PI / 6),
      arrowEnd.y - headLength * Math.sin(angle - Math.PI / 6)
    );
    ctx.lineTo(arrowEnd.x, arrowEnd.y);
    ctx.lineTo(
      arrowEnd.x - headLength * Math.cos(angle + Math.PI / 6),
      arrowEnd.y - headLength * Math.sin(angle + Math.PI / 6)
    );
    // ctx.fill();
    ctx.stroke();
  } else if (shape === "line") {
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
  }
};
function distance(
  point1: { x: number; y: number },
  point2: { x: number; y: number }
): number {
  const dx = point1.x - point2.x;
  const dy = point1.y - point2.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function isPointNearLine(
  point: { x: number; y: number },
  lineStart: { x: number; y: number },
  lineEnd: { x: number; y: number },
  tolerance: number
): boolean {
  const lineLength = distance(lineStart, lineEnd);

  const t =
    ((point.x - lineStart.x) * (lineEnd.x - lineStart.x) +
      (point.y - lineStart.y) * (lineEnd.y - lineStart.y)) /
    (lineLength * lineLength);

  if (t < 0 || t > 1) {
    return false;
  }

  const projectionPoint = {
    x: lineStart.x + t * (lineEnd.x - lineStart.x),
    y: lineStart.y + t * (lineEnd.y - lineStart.y),
  };

  return distance(point, projectionPoint) <= tolerance;
}
function isPointInTriangle(
  point: { x: number; y: number },
  triangle: {
    a: { x: number; y: number };
    b: { x: number; y: number };
    c: { x: number; y: number };
  }
): boolean {
  const { a, b, c } = triangle;

  const area =
    0.5 * (-b.y * c.x + a.y * (-b.x + c.x) + a.x * (b.y - c.y) + b.x * c.y);
  const s =
    (1 / (2 * area)) *
    (a.y * c.x - a.x * c.y + (c.y - a.y) * point.x + (a.x - c.x) * point.y);
  const t =
    (1 / (2 * area)) *
    (a.x * b.y - a.y * b.x + (a.y - b.y) * point.x + (b.x - a.x) * point.y);

  return s > 0 && t > 0 && 1 - s - t > 0;
}

export { distance };
export { isPointNearLine };
export { isPointInTriangle };
export { drawShape };
export { getSquare };
export { fillSquare };
