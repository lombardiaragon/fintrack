import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useCredits } from "./useCredits";
import {
  applyEarlyPayment,
  validateEarlyPaymentInput,
  payNextInstallment,
} from "../../utils/loanCalculations";
import { clientsCalculations } from "../../utils/clientsCalculations";
import { formatCurrency, formatDateTime } from "../../utils/format";
import StatusBadge from "../../components/StatusBadge";
import EarlyPaymentForm from "./EarlyPaymentForm";
import AmortizationTable from "./AmortizationTable";

function StatCard({ label, value, accent }) {
  return (
    <div className="rounded-xl bg-[#F7F6F3] p-4">
      <p className="mb-1 text-xs font-semibold tracking-wider text-gray-400 uppercase">
        {label}
      </p>
      <p
        className={`font-mono text-lg font-medium ${accent ? "text-red-600" : "text-gray-900"}`}
      >
        {value}
      </p>
    </div>
  );
}

export default function CreditDetail() {
  const { id } = useParams();
  const { getCreditByCreditId, updateCredit } = useCredits();
  const { calcTotalCreditDebt, calcTotalCreditInterests } = clientsCalculations();

  const credit = getCreditByCreditId(id);

  const [simulation, setSimulation] = useState(null);
  const [simError, setSimError] = useState("");

  const scheduleToShow = simulation || credit?.schedule || [];

  if (!credit)
    return <p className="text-sm text-gray-400">Crédit introuvable.</p>;

  const nextUnpaid = credit.schedule.findIndex((row) => !row.paid);
  const allPaid = nextUnpaid === -1;
  const paidCount = credit.schedule.filter((row) => row.paid).length;
  const totalDebt = calcTotalCreditDebt(scheduleToShow);
  const totalInterests = calcTotalCreditInterests(scheduleToShow);

  const handlePayInstallment = () => {
    const updatedSchedule = payNextInstallment(credit.schedule);
    const allNowPaid = updatedSchedule.every((row) => row.paid);
    updateCredit(credit.id, {
      ...credit,
      schedule: updatedSchedule,
      status: allNowPaid ? "paid" : credit.status,
    });
  };

  const handleSimulate = (amount, month) => {
    setSimError("");
    try {
      const { amount: a, month: m } = validateEarlyPaymentInput(amount, month);
      setSimulation(applyEarlyPayment(credit.schedule, a, m, credit.annualRate));
    } catch (err) {
      setSimError(err.message);
    }
  };

  const handleConfirm = () => {
    if (simulation) updateCredit(credit.id, { ...credit, schedule: simulation });
    setSimulation(null);
  };

  return (
    <div className="space-y-6">
      <Link
        to={`/clients/${credit.clientId}`}
        className="text-xs text-gray-400 transition hover:text-gray-700"
      >
        ← Retour au client
      </Link>

      <div
        className={`rounded-2xl border bg-white p-6 shadow-sm transition ${simulation ? "border-amber-300" : "border-gray-100"}`}
      >
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              {credit.clientName}
            </h1>
            <p className="mt-0.5 text-sm text-gray-400">
              Créé le {formatDateTime(credit.createdAt)}
            </p>
          </div>
          <StatusBadge status={credit.status} />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <StatCard label="Principal initial" value={formatCurrency(credit.principal)} />
          <StatCard label="Solde restant" value={formatCurrency(scheduleToShow[0]?.balance ?? 0)} />
          <StatCard label="Mensualité" value={`${formatCurrency(credit.installment)}/mois`} />
          <StatCard label="Dette totale" value={formatCurrency(totalDebt)} />
          <StatCard label="Intérêts restants" value={formatCurrency(totalInterests)} accent />
          <StatCard label="Taux annuel" value={`${credit.annualRate}%`} />
        </div>

        {simulation && (
          <div className="mt-4 flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
            <p className="flex-1 text-sm font-medium text-amber-800">
              Mode simulation — voulez-vous confirmer le paiement anticipé ?
            </p>
            <button
              onClick={handleConfirm}
              className="rounded-lg bg-green-600 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-green-700"
            >
              Confirmer
            </button>
            <button
              onClick={() => setSimulation(null)}
              className="rounded-lg border border-gray-200 px-4 py-1.5 text-sm font-medium text-gray-600 transition hover:text-gray-900"
            >
              Annuler
            </button>
          </div>
        )}

        <div className="mt-4 flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
          <div>
            <p className="text-sm font-medium text-gray-900">
              {allPaid
                ? "Crédit soldé"
                : `Mensualité ${paidCount + 1} / ${credit.months}`}
            </p>
            <p className="mt-0.5 text-xs text-gray-400">
              {allPaid
                ? "Toutes les mensualités ont été payées"
                : `${formatCurrency(credit.installment)} à régler`}
            </p>
          </div>
          {!allPaid && (
            <button
              onClick={handlePayInstallment}
              className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700"
            >
              Payer
            </button>
          )}
          {allPaid && <StatusBadge status="paid" />}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <StatusBadge status={credit.status} />
        <select
          value={credit.status}
          onChange={(e) =>
            updateCredit(credit.id, { ...credit, status: e.target.value })
          }
          className="cursor-pointer rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs font-medium text-gray-500 transition focus:ring-2 focus:ring-gray-900 focus:outline-none"
        >
          <option value="active">Actif</option>
          <option value="late">En retard</option>
          <option value="paid">Soldé</option>
        </select>
      </div>

      <EarlyPaymentForm onSubmit={handleSimulate} error={simError} />

      <AmortizationTable schedule={scheduleToShow} isSimulation={!!simulation} />
    </div>
  );
}
