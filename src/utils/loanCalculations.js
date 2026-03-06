export function calculateMonthlyRate(annualRate) {
  return annualRate / 12 / 100;
}

export function calculateInstallment(principal, annualRate, months) {
  const r = calculateMonthlyRate(annualRate);
  if (r === 0) return principal / months;
  const numerator = principal * r * Math.pow(1 + r, months);
  const denominator = Math.pow(1 + r, months) - 1;
  return parseFloat((numerator / denominator).toFixed(2));
}

export function generateAmortizationSchedule(principal, annualRate, months) {
  let schedule = [];
  let balance = principal;
  const installment = calculateInstallment(principal, annualRate, months);
  const r = calculateMonthlyRate(annualRate);

  for (let month = 1; month <= months; month++) {
    const interestPaid = parseFloat((balance * r).toFixed(2));
    const principalPaid = parseFloat((installment - interestPaid).toFixed(2));
    balance = parseFloat((balance - principalPaid).toFixed(2));

    schedule = [
      ...schedule,
      {
        month,
        installment,
        principalPaid,
        interestPaid,
        balance: balance < 0 ? 0 : balance,
        paid: false,
      },
    ];
  }

  return schedule;
}

export function generateScheduleWithFixedInstallment(
  balance,
  annualRate,
  installment,
) {
  const monthlyRate = calculateMonthlyRate(annualRate);
  const schedule = [];
  let month = 1;

  while (balance > 0) {
    const interestPaid = parseFloat((balance * monthlyRate).toFixed(2));
    let principalPaid = parseFloat((installment - interestPaid).toFixed(2));

    if (principalPaid > balance) principalPaid = balance;
    balance = parseFloat((balance - principalPaid).toFixed(2));

    schedule.push({
      month,
      installment: parseFloat((principalPaid + interestPaid).toFixed(2)),
      principalPaid,
      interestPaid,
      balance,
    });

    month++;
  }

  return schedule;
}

export function validateEarlyPaymentInput(amountInput, monthInput) {
  const amount = Number(amountInput);
  const month = Number(monthInput);

  if (!amountInput || Number.isNaN(amount)) {
    throw new Error("Le montant est requis et doit être un nombre valide");
  }

  if (!monthInput || Number.isNaN(month)) {
    throw new Error("Le mois est requis et doit être un nombre valide");
  }

  if (amount < 3000) {
    throw new Error("Le paiement anticipé minimum est de 3 000 €");
  }

  if (month <= 0 || !Number.isInteger(month)) {
    throw new Error("Le mois doit être un entier positif");
  }

  return { amount, month };
}

export function applyEarlyPayment(schedule, amount, monthNumber, annualRate) {
  const currentBalance = schedule[monthNumber - 1].balance;

  if (amount < 3000)
    throw new Error("Le paiement anticipé minimum est de 3 000 €");
  if (amount > currentBalance)
    throw new Error(
      `Le paiement anticipé est trop élevé. Solde restant : ${currentBalance.toFixed(2)} €`,
    );

  let newBalance = currentBalance - amount;
  if (newBalance < 0) newBalance = 0;
  if (newBalance === 0) return [];

  const installment = schedule[0].installment;

  return generateScheduleWithFixedInstallment(newBalance, annualRate, installment);
}

export function payNextInstallment(schedule) {
  const nextUnpaid = schedule.findIndex((row) => !row.paid);
  if (nextUnpaid === -1) return schedule;
  return schedule.map((row, i) =>
    i === nextUnpaid ? { ...row, paid: true } : row,
  );
}
