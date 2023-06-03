const canvasSketch = require("canvas-sketch");
const { lerp } = require("canvas-sketch-util/math");
const random = require("canvas-sketch-util/random");
const palettes = require("nice-color-palettes");

const SIZE = 2048;

const settings = {
  dimensions: [SIZE, SIZE],
};

const sketch = () => {
  const colorCount = random.rangeFloor(2, 6);
  const palette = random.shuffle(random.pick(palettes)).slice(0, colorCount);

  const createGrid = () => {
    const points = [];
    const count = 30;
    const minusCount = count - 1;
    const isCountLessThanOne = count <= 1;
    const centerPoint = 0.5;
    for (let x = 0; x < count; x++) {
      for (let y = 0; y < count; y++) {
        const u = isCountLessThanOne ? centerPoint : x / minusCount;
        const v = isCountLessThanOne ? centerPoint : y / minusCount;
        const radius = Math.abs(random.noise2D(u, v)) * 0.05;
        points.push({
          position: [u, v],
          color: random.pick(palette),
          radius,
        });
      }
    }
    return points;
  };

  const points = createGrid().filter(() => random.value() > 0.5);
  const margin = 400;

  return ({ context, width, height }) => {
    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);

    points.forEach((point) => {
      const { position, radius, color } = point;
      const [u, v] = position;
      const x = lerp(margin, width - margin, u);
      const y = lerp(margin, height - margin, v);

      context.beginPath();
      context.arc(x, y, radius * width, 0, Math.PI * 2, false);
      context.strokeStyle = "black";
      context.lineWidth = 20;

      context.fillStyle = color;
      context.fill();
    });
  };
};

canvasSketch(sketch, settings);
