import { usePagination } from "../../hooks/usePagination";
import { formatCurrency } from "../../utils/format";

const COLUMNS = ["Mois", "Mensualité", "Intérêts", "Capital", "Solde restant"];

export default function AmortizationTable({ schedule, isSimulation }) {
  const { visibleItems: visibleRows, hasMore, loadMore } = usePagination(schedule, 10);

  return (
    <div className="overflow-auto rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-sm font-semibold text-gray-900">
        Tableau d'amortissement
        {isSimulation && (
          <span className="ml-2 text-xs font-normal text-amber-600">
            (Simulation)
          </span>
        )}
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full min-w-120">
          <thead>
            <tr>
              {COLUMNS.map((h) => (
                <th
                  key={h}
                  className="pr-6 pb-3 text-left text-xs font-semibold tracking-wider text-gray-400 uppercase"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((row) => (
              <tr
                key={row.month}
                className={`border-t border-gray-50 transition ${row.paid ? "opacity-40" : "hover:bg-gray-50"}`}
              >
                <td className="py-3 pr-6 font-mono text-sm text-gray-500">
                  {row.month}{" "}
                  {row.paid && <span className="text-xs text-green-500">✓</span>}
                </td>
                <td className="py-3 pr-6 font-mono text-sm text-gray-900">
                  {formatCurrency(row.installment)} €
                </td>
                <td className="py-3 pr-6 font-mono text-sm text-red-500">
                  {formatCurrency(row.interestPaid)} €
                </td>
                <td className="py-3 pr-6 font-mono text-sm text-gray-900">
                  {formatCurrency(row.principalPaid)} €
                </td>
                <td className="py-3 pr-6 font-mono text-sm font-medium text-gray-900">
                  {formatCurrency(row.balance)} €
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {hasMore && (
          <button
            onClick={loadMore}
            className="mt-4 w-full rounded-xl border border-gray-100 py-2 text-sm font-medium text-gray-500 transition hover:bg-gray-50 hover:text-gray-900"
          >
            Charger plus ({schedule.length - visibleRows.length} restants)
          </button>
        )}
      </div>
    </div>
  );
}
