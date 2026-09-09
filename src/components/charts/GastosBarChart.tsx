// react-doctor-disable-next-line react-doctor/prefer-dynamic-import -- Este módulo es cargado perezosamente vía React.lazy() en Dashboard.tsx
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

export interface EvolucionPunto {
  mes: string;
  gasto: number;
}

interface GastosBarChartProps {
  data: EvolucionPunto[];
}

function ChartTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
}) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#00201B] text-white text-[12px] px-3 py-1.5 rounded-lg shadow-lg font-mono">
        ${payload[0].value.toLocaleString("es-CL")}K
      </div>
    );
  }
  return null;
}

export default function GastosBarChart({ data }: GastosBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart
        data={data}
        barCategoryGap="28%"
        margin={{ top: 4, right: 4, left: -24, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
        <XAxis
          dataKey="mes"
          tick={{
            fontSize: 11,
            fontFamily: "Inter, system-ui, sans-serif",
            fill: "#94A3B8",
          }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{
            fontSize: 10,
            fontFamily: "Inter, system-ui, sans-serif",
            fill: "#94A3B8",
          }}
          axisLine={false}
          tickLine={false}
          domain={[500, 620]}
        />
        <Tooltip content={<ChartTooltip />} cursor={{ fill: "#F0FDFA" }} />
        <Bar dataKey="gasto" radius={[5, 5, 0, 0]}>
          {data.map((m, i) => (
            <Cell key={m.mes} fill={i === data.length - 1 ? "#0D9488" : "#CCFBF1"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
