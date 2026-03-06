import { useState } from "react";

export default function EarlyPaymentForm({ onSubmit, error }) {
  const [amount, setAmount] = useState("");
  const [month, setMonth] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(amount, month);
    setAmount("");
    setMonth("");
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-sm font-semibold text-gray-900">
        Simuler un paiement anticipé
      </h2>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-start gap-3 sm:flex-row sm:items-end"
      >
        <div>
          <label className="mb-1.5 block text-xs font-semibold tracking-wider text-gray-400 uppercase">
            Montant (€)
          </label>
          <input
            type="number"
            placeholder="ex: 5000"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-36 rounded-xl border border-gray-200 px-4 py-2.5 font-mono text-sm transition focus:ring-2 focus:ring-gray-900 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold tracking-wider text-gray-400 uppercase">
            Mois
          </label>
          <input
            type="number"
            placeholder="ex: 6"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="w-28 rounded-xl border border-gray-200 px-4 py-2.5 font-mono text-sm transition focus:ring-2 focus:ring-gray-900 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-700"
        >
          Simuler
        </button>
        {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
      </form>
    </div>
  );
}
