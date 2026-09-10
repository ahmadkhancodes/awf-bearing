import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ChartSpec } from "@/lib/ask";

const axis = {
  stroke: "var(--muted-foreground)",
  fontSize: 11,
  tickLine: false,
  axisLine: false,
};

const tooltipStyle = {
  contentStyle: {
    borderRadius: 8,
    border: "1px solid var(--rule)",
    background: "var(--card)",
    fontSize: 12,
    boxShadow: "0 8px 24px -12px rgba(15,23,42,0.35)",
  },
  labelStyle: { color: "var(--foreground)", fontWeight: 600, marginBottom: 4 },
};

export function AnswerChart({ spec, height = 260 }: { spec: ChartSpec; height?: number }) {
  const legend = spec.series.length > 1 ? <Legend wrapperStyle={{ fontSize: 12 }} /> : null;
  const fmt = (v: number | string) => `${v}${spec.unit ?? ""}`;

  return (
    <figure className="rounded-lg border border-rule bg-card">
      <figcaption className="border-b border-rule px-4 py-3">
        <p className="text-[13px] font-semibold text-foreground">{spec.title}</p>
        <p className="text-[12px] text-muted-foreground">{spec.description}</p>
      </figcaption>
      <div
        className="px-2 py-3"
        role="img"
        aria-label={`${spec.title}. ${spec.description}. ${spec.series
          .map((s) => s.name)
          .join(", ")}.`}
      >
        <ResponsiveContainer width="100%" height={height}>
          {spec.kind === "line" ? (
            <LineChart data={spec.data} margin={{ top: 6, right: 14, bottom: 0, left: -12 }}>
              <CartesianGrid stroke="var(--rule)" vertical={false} />
              <XAxis dataKey={spec.xKey} {...axis} />
              <YAxis {...axis} domain={spec.domain ?? ["auto", "auto"]} tickFormatter={fmt} />
              <Tooltip {...tooltipStyle} formatter={(v) => fmt(v as number)} />
              {legend}
              {spec.series.map((s) => (
                <Line
                  key={s.key}
                  type="monotone"
                  dataKey={s.key}
                  name={s.name}
                  stroke={s.color}
                  strokeWidth={2}
                  strokeDasharray={s.dashed ? "4 4" : undefined}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              ))}
            </LineChart>
          ) : spec.kind === "area" ? (
            <AreaChart data={spec.data} margin={{ top: 6, right: 14, bottom: 0, left: -12 }}>
              <defs>
                {spec.series.map((s) => (
                  <linearGradient key={s.key} id={`fill-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={s.color} stopOpacity={0.18} />
                    <stop offset="100%" stopColor={s.color} stopOpacity={0.02} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid stroke="var(--rule)" vertical={false} />
              <XAxis dataKey={spec.xKey} {...axis} />
              <YAxis {...axis} domain={spec.domain ?? ["auto", "auto"]} tickFormatter={fmt} />
              <Tooltip {...tooltipStyle} formatter={(v) => fmt(v as number)} />
              {legend}
              {spec.series.map((s) => (
                <Area
                  key={s.key}
                  type="monotone"
                  dataKey={s.key}
                  name={s.name}
                  stroke={s.color}
                  strokeWidth={2}
                  fill={`url(#fill-${s.key})`}
                />
              ))}
            </AreaChart>
          ) : spec.kind === "hbar" ? (
            <BarChart
              data={spec.data}
              layout="vertical"
              margin={{ top: 4, right: 20, bottom: 0, left: 10 }}
            >
              <CartesianGrid stroke="var(--rule)" horizontal={false} />
              <XAxis type="number" {...axis} tickFormatter={fmt} />
              <YAxis type="category" dataKey={spec.xKey} width={128} {...axis} />
              <Tooltip {...tooltipStyle} cursor={{ fill: "var(--muted)" }} />
              {spec.series.map((s) => (
                <Bar key={s.key} dataKey={s.key} name={s.name} fill={s.color} radius={[0, 4, 4, 0]}>
                  {spec.data.map((row, i) => (
                    <Cell
                      key={i}
                      fill={Number(row["risk"] ?? 0) > 40 ? "var(--critical)" : s.color}
                    />
                  ))}
                </Bar>
              ))}
            </BarChart>
          ) : (
            <BarChart data={spec.data} margin={{ top: 6, right: 14, bottom: 0, left: -12 }}>
              <CartesianGrid stroke="var(--rule)" vertical={false} />
              <XAxis dataKey={spec.xKey} {...axis} />
              <YAxis {...axis} tickFormatter={fmt} />
              <Tooltip {...tooltipStyle} cursor={{ fill: "var(--muted)" }} />
              {legend}
              {spec.series.map((s) => (
                <Bar
                  key={s.key}
                  dataKey={s.key}
                  name={s.name}
                  {...(spec.kind === "stacked" ? { stackId: "a" } : {})}
                  fill={s.color}
                  radius={spec.kind === "stacked" ? [0, 0, 0, 0] : [4, 4, 0, 0]}
                  maxBarSize={48}
                >
                  {spec.kind === "bar" && spec.series.length === 1
                    ? spec.data.map((row, i) => (
                        <Cell
                          key={i}
                          fill={Number(row[s.key]) < 0 ? "var(--critical)" : "var(--signal)"}
                        />
                      ))
                    : null}
                </Bar>
              ))}
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </figure>
  );
}
