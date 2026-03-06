import { Link } from "react-router-dom";
import { formatCurrency } from "../../utils/format";
import StatusBadge from "../../components/StatusBadge";

export default function CreditItem({ credit }) {
  const paidCount = credit.schedule?.filter((r) => r.paid).length ?? 0;
  const totalCount = credit.schedule?.length ?? 0;
  const pct = totalCount ? Math.round((paidCount / totalCount) * 100) : 0;

  return (
    <li className="flex items-center justify-between rounded-xl border border-gray-100 bg-[#F7F6F3] px-5 py-4 transition hover:bg-gray-100">
      <div className="min-w-0 flex-1">
        <div className="mb-2 flex items-center gap-3">
          <p className="font-mono text-sm font-medium text-gray-900">
            {formatCurrency(credit.principal)}
          </p>
          <StatusBadge status={credit.status} />
        </div>
        <p className="mb-2 text-xs text-gray-400">
          {credit.annualRate}% · {credit.months} mois ·{" "}
          {formatCurrency(credit.installment)} €/mois
          {paidCount > 0 && (
            <span className="ml-2 font-medium text-green-600">
              {paidCount}/{totalCount} payées
            </span>
          )}
        </p>
        <div className="h-1 w-48 rounded-full bg-gray-200">
          <div
            className="h-1 rounded-full bg-gray-900 transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
      <Link
        to={`/credits/${credit.id}`}
        className="ml-4 shrink-0 text-xs font-medium text-gray-500 transition hover:text-gray-900"
      >
        Voir →
      </Link>
    </li>
  );
}
