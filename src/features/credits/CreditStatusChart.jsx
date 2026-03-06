import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { calcCreditsByStatus } from "../../utils/clientsCalculations";

export default function CreditStatusChart({ credits }) {
  const data = calcCreditsByStatus(credits);

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-sm font-semibold text-gray-900">
        Répartition des crédits
      </h2>
      {credits.length === 0 ? (
        <p className="py-8 text-center text-xs text-gray-400">Aucun crédit</p>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [
                `${value} crédit${value > 1 ? "s" : ""}`,
                name,
              ]}
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #F3F4F6",
                fontSize: 12,
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
      <div className="mt-2 flex justify-center gap-4">
        {data.map((entry, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <div
              className="h-2.5 w-2.5 rounded-full"
              style={{ background: entry.color }}
            />
            <span className="text-xs text-gray-500">
              {entry.name} ({entry.value})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
