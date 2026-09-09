// react-doctor-disable-next-line react-doctor/prefer-dynamic-import -- Este módulo es cargado perezosamente vía React.lazy() en ResidenteDashboard.tsx
import { AreaChart, Area, ResponsiveContainer, Tooltip } from "recharts";

export interface SparkPoint {
  v: number;
}

interface SparkAreaChartProps {
  data: SparkPoint[];
  title: string;
  sparkColor?: string;
}

export default function SparkAreaChart({
  data,
  title,
  sparkColor = "#0D9488",
}: SparkAreaChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={`sg-${title}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={sparkColor} stopOpacity={0.18} />
            <stop offset="95%" stopColor={sparkColor} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Tooltip
          content={({ active, payload }) =>
            active && payload?.length ? (
              <span className="text-[11px] font-body bg-[#00201B] text-white px-2 py-1 rounded-md">
                {payload[0].value}
              </span>
            ) : null
          }
        />
        <Area
          type="monotone"
          dataKey="v"
          stroke={sparkColor}
          strokeWidth={1.5}
          fill={`url(#sg-${title})`}
          dot={false}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
