import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { calcDebtEvolution } from "../../utils/clientsCalculations";

export default function DebtEvolutionChart({ credits }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-sm font-semibold text-gray-900">
        Évolution de la dette
      </h2>
      {credits.length === 0 ? (
        <p className="py-8 text-center text-xs text-gray-400">Aucun crédit</p>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <LineChart
            data={calcDebtEvolution(credits)}
            margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 10, fill: "#9CA3AF" }}
              tickLine={false}
              interval={9}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "#9CA3AF" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip
              formatter={(v) => [`${v.toLocaleString("fr-FR")} €`, "Dette totale"]}
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #F3F4F6",
                fontSize: 12,
              }}
            />
            <Line
              type="monotone"
              dataKey="debt"
              stroke="#111827"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
