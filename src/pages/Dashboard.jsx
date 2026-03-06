import { Link } from "react-router-dom";
import { useClients } from "../features/clients/useClients";
import { useCredits } from "../features/credits/useCredits";
import { clientsCalculations } from "../utils/clientsCalculations";
import { formatCurrency } from "../utils/format";
import { avatarColor, initials } from "../utils/avatar";
import StatusBadge from "../components/StatusBadge";
import CreditStatusChart from "../features/credits/CreditStatusChart";
import DebtEvolutionChart from "../features/credits/DebtEvolutionChart";

function MetricCard({ label, value, sub, progress }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md md:p-6">
      <p className="mb-2 text-xs font-semibold tracking-wider text-gray-400 uppercase">
        {label}
      </p>
      <p className="truncate font-mono text-base font-medium text-gray-900 md:text-2xl">
        {value}
      </p>
      {sub && <p className="mt-1 truncate text-xs text-gray-400">{sub}</p>}
      {progress !== undefined && (
        <div className="mt-3">
          <div className="h-1 rounded-full bg-gray-100">
            <div
              className="h-1 rounded-full bg-gray-900 transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-1 text-xs text-gray-400">{progress}% actifs</p>
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const { clients } = useClients();
  const { credits } = useCredits();
  const { calcDashboardMetrics } = clientsCalculations();

  const metrics = calcDashboardMetrics(credits);
  const activeCredits = credits.filter((c) => c.status === "active").length;
  const lateCredits = credits.filter((c) => c.status === "late").length;
  const paidCredits = credits.filter((c) => c.status === "paid").length;
  const activePercent = credits.length
    ? Math.round((activeCredits / credits.length) * 100)
    : 0;

  const recentClients = [...clients].slice(-5).reverse();
  const recentCredits = [...credits].slice(-3).reverse();

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
          <p className="mt-0.5 text-sm text-gray-400">
            Vue globale ·{" "}
            {new Date().toLocaleDateString("fr-FR", {
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
        <Link
          to="/clients"
          className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700"
        >
          + Nouveau client
        </Link>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricCard
          label="Dette totale"
          value={formatCurrency(metrics.totalDebt)}
          sub="Tous crédits confondus"
        />
        <MetricCard
          label="Intérêts"
          value={formatCurrency(metrics.totalInterests)}
          sub="Intérêts restants"
        />
        <MetricCard label="Clients" value={clients.length} progress={100} />
        <MetricCard
          label="Crédits"
          value={credits.length}
          progress={activePercent}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="col-span-2 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="flex items-center justify-between px-6 pt-6 pb-4">
            <h2 className="text-sm font-semibold text-gray-900">
              Clients récents
            </h2>
            <Link
              to="/clients"
              className="rounded-xl bg-gray-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-gray-700 md:px-4"
            >
              <span className="hidden sm:inline">+ Nouveau client</span>
              <span className="sm:hidden">+</span>
            </Link>
          </div>

          {recentClients.length === 0 ? (
            <p className="px-6 pb-6 text-sm text-gray-400">
              Aucun client pour le moment.
            </p>
          ) : (
            <table className="w-full">
              <thead>
                <tr>
                  <th className="px-6 pb-3 text-left text-xs font-semibold tracking-wider text-gray-400 uppercase">
                    Client
                  </th>
                  <th className="hidden px-6 pb-3 text-left text-xs font-semibold tracking-wider text-gray-400 uppercase sm:table-cell">
                    Email
                  </th>
                  <th className="px-6 pb-3 text-left text-xs font-semibold tracking-wider text-gray-400 uppercase">
                    Statut
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentClients.map((client) => (
                  <tr
                    key={client.id}
                    className="border-t border-gray-50 transition hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      <Link
                        to={`/clients/${client.id}`}
                        className="flex items-center gap-3"
                      >
                        <div
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                            background: avatarColor(client.name),
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#fff",
                            fontSize: 11,
                            fontWeight: 600,
                            flexShrink: 0,
                          }}
                        >
                          {initials(client.name)}
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {client.name}
                        </span>
                      </Link>
                    </td>
                    <td className="hidden px-6 py-4 text-sm text-gray-400 sm:table-cell">
                      {client.email}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status="active" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-900">
                Crédits récents
              </h2>
              <Link
                to="/credits"
                className="text-xs text-gray-400 transition hover:text-gray-700"
              >
                Voir tout →
              </Link>
            </div>
            {recentCredits.length === 0 ? (
              <p className="text-sm text-gray-400">Aucun crédit.</p>
            ) : (
              <div className="flex flex-col gap-4">
                {recentCredits.map((credit) => {
                  const paid =
                    credit.schedule?.filter((r) => r.balance === 0).length ?? 0;
                  const pct = credit.months
                    ? Math.min(100, Math.round((paid / credit.months) * 100))
                    : 0;
                  return (
                    <div key={credit.id}>
                      <div className="mb-1.5 flex items-center justify-between">
                        <div>
                          <p className="font-mono text-sm font-medium text-gray-900">
                            {formatCurrency(credit.principal)}
                          </p>
                          <p className="text-xs text-gray-400">
                            {credit.clientName} · {credit.months} mois
                          </p>
                        </div>
                        <StatusBadge status={credit.status} />
                      </div>
                      <div className="h-1 rounded-full bg-gray-100">
                        <div
                          className="h-1 rounded-full bg-gray-900"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold text-gray-900">
              Répartition
            </h2>
            <div className="flex flex-col gap-2.5">
              {[
                { label: "Actifs", value: activeCredits, color: "#1A1A1A" },
                { label: "En retard", value: lateCredits, color: "#DC2626" },
                { label: "Soldés", value: paidCredits, color: "#2563EB" },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: color,
                      }}
                    />
                    <span className="text-xs text-gray-600">{label}</span>
                  </div>
                  <span className="font-mono text-xs font-medium">
                    {value} / {credits.length}
                  </span>
                </div>
              ))}
            </div>
            {credits.length > 0 && (
              <div className="mt-4 flex h-1.5 gap-0.5 overflow-hidden rounded-full">
                <div
                  style={{
                    background: "#1A1A1A",
                    width: `${(activeCredits / credits.length) * 100}%`,
                  }}
                />
                <div
                  style={{
                    background: "#DC2626",
                    width: `${(lateCredits / credits.length) * 100}%`,
                  }}
                />
                <div
                  style={{
                    background: "#2563EB",
                    width: `${(paidCredits / credits.length) * 100}%`,
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <CreditStatusChart credits={credits} />
        <DebtEvolutionChart credits={credits} />
      </div>
    </div>
  );
}
