import { useParams, Link } from "react-router-dom";
import { useClients } from "./useClients";
import { useCredits } from "../credits/useCredits";
import CreditItem from "../credits/CreditItem";
import { clientsCalculations } from "../../utils/clientsCalculations";
import { formatCurrency, formatDateTime } from "../../utils/format";
import { avatarColor, initials } from "../../utils/avatar";

function StatCard({ label, value }) {
  return (
    <div className="rounded-xl bg-[#F7F6F3] p-3 md:p-4">
      <p className="mb-1 text-xs font-semibold tracking-wider text-gray-400 uppercase leading-tight">
        {label}
      </p>
      <p className="font-mono text-sm font-medium text-gray-900 md:text-lg">
        {value}
      </p>
    </div>
  );
}

export default function ClientDetail() {
  const { id } = useParams();
  const { getClientById } = useClients();
  const { getCreditsByClientId } = useCredits();
  const { calcTotalClientDebt, calcTotalClientInterests } = clientsCalculations();

  const client = getClientById(id);
  if (!client) return <p className="text-sm text-gray-400">Client introuvable.</p>;

  const clientCredits = getCreditsByClientId(id);
  const totalDebt = calcTotalClientDebt(clientCredits);
  const totalPendingInterest = calcTotalClientInterests(clientCredits);

  return (
    <div className="space-y-6">
      <Link
        to="/clients"
        className="text-xs text-gray-400 transition hover:text-gray-700"
      >
        ← Retour aux clients
      </Link>

      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-4">
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              background: avatarColor(client.name),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 16,
              fontWeight: 600,
              flexShrink: 0,
            }}
          >
            {initials(client.name)}
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">{client.name}</h1>
            <p className="text-sm text-gray-400">
              {client.email} · Client depuis {formatDateTime(client.createdAt)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <StatCard label="Crédits" value={clientCredits.length} />
          <StatCard label="Dette totale" value={formatCurrency(totalDebt)} />
          <StatCard
            label="Intérêts en attente"
            value={formatCurrency(totalPendingInterest)}
          />
        </div>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900">
            Crédits
            <span className="ml-2 text-xs font-normal text-gray-400">
              ({clientCredits.length})
            </span>
          </h2>
          <Link
            to={`/clients/${id}/new-credit`}
            className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700"
          >
            + Nouveau crédit
          </Link>
        </div>

        {clientCredits.length === 0 ? (
          <p className="text-sm text-gray-400">Aucun crédit pour ce client.</p>
        ) : (
          <ul className="space-y-3">
            {clientCredits.map((credit) => (
              <CreditItem key={credit.id} credit={credit} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
