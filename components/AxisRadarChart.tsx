import { AXIS_KEYS, AXIS_SHORT_LABELS, AxisKey } from "@/lib/types";

const SIZE = 240;
const CENTER = SIZE / 2;
const MAX_RADIUS = 62;
const MAX_SCORE = 5;
const LABEL_RADIUS = MAX_RADIUS + 18;

function axisAngle(index: number) {
  return (Math.PI * 2 * index) / AXIS_KEYS.length - Math.PI / 2;
}

function polar(index: number, radius: number) {
  const angle = axisAngle(index);
  return {
    x: CENTER + radius * Math.cos(angle),
    y: CENTER + radius * Math.sin(angle),
  };
}

// polar() と同じ角度基準(真上を0、時計回り)でラベルの水平寄せを決める。
// cos がほぼ0(真上/真下)なら中央寄せ、正なら右半分なので左寄せ、負なら右寄せ。
function labelAnchor(index: number): "start" | "middle" | "end" {
  const cos = Math.cos(axisAngle(index));
  if (Math.abs(cos) < 0.15) return "middle";
  return cos > 0 ? "start" : "end";
}

export function AxisRadarChart({ scores }: { scores: Record<AxisKey, number> }) {
  const ringLevels = [1, 2, 3, 4, 5];
  const points = AXIS_KEYS.map((axis, i) => polar(i, (scores[axis] / MAX_SCORE) * MAX_RADIUS));
  const polygonPoints = points.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      className="mx-auto block w-full max-w-[220px]"
      role="img"
      aria-label="評価軸レーダーチャート"
    >
      {ringLevels.map((level) => {
        const r = (level / MAX_SCORE) * MAX_RADIUS;
        const ringPoints = AXIS_KEYS.map((_, i) => {
          const p = polar(i, r);
          return `${p.x},${p.y}`;
        }).join(" ");
        return (
          <polygon
            key={level}
            points={ringPoints}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth={1}
          />
        );
      })}

      {AXIS_KEYS.map((axis, i) => {
        const outer = polar(i, MAX_RADIUS);
        return (
          <line
            key={axis}
            x1={CENTER}
            y1={CENTER}
            x2={outer.x}
            y2={outer.y}
            stroke="#e2e8f0"
            strokeWidth={1}
          />
        );
      })}

      <polygon points={polygonPoints} fill="#0d9488" fillOpacity={0.18} stroke="#0d9488" strokeWidth={2} />

      {points.map((p, i) => (
        <circle key={AXIS_KEYS[i]} cx={p.x} cy={p.y} r={2.5} fill="#0d9488">
          <title>
            {AXIS_SHORT_LABELS[AXIS_KEYS[i]]}: {scores[AXIS_KEYS[i]]} / 5
          </title>
        </circle>
      ))}

      {AXIS_KEYS.map((axis, i) => {
        const p = polar(i, LABEL_RADIUS);
        return (
          <text
            key={axis}
            x={p.x}
            y={p.y}
            textAnchor={labelAnchor(i)}
            dominantBaseline="middle"
            fontSize={9}
            fill="#94a3b8"
          >
            {AXIS_SHORT_LABELS[axis]}
          </text>
        );
      })}
    </svg>
  );
}
