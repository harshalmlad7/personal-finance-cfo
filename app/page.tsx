"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Target,
  Landmark,
  Brain,
  Plane,
  BarChart3,
  Plus,
  Trash2,
  AlertTriangle
} from "lucide-react";

type Transaction = {
  id: string;
  date: string;
  type: "income" | "expense";
  bucket: string;
  category: string;
  subcategory: string;
  merchant: string;
  amount: number;
  note: string;
};

type Loan = {
  id: string;
  name: string;
  principal: number;
  rate: number;
  months: number;
};

type Goal = {
  id: string;
  name: string;
  target: number;
  saved: number;
};

const categoryMap: Record<string, Record<string, string[]>> = {
  Needs: {
    Housing: ["Rent", "Maintenance", "Electricity", "Gas", "Internet"],
    Transport: ["Metro", "Train", "Auto", "Cab", "Bus"],
    Vehicle: ["Fuel", "Parking", "Toll", "Insurance", "Maintenance"],
    Bills: ["Mobile", "Internet", "Utilities", "Insurance"]
  },
  Wants: {
    "Food & Drinks": [
      "Restaurants",
      "Online Food Delivery",
      "Groceries",
      "Snacks",
      "Cafe"
    ],
    Shopping: ["Clothing", "Electronics", "Personal Care", "Online Shopping"],
    Entertainment: ["Movies", "OTT", "Events", "Trips", "Games"]
  },
  Wealth: {
    Investments: ["SIP", "Mutual Funds", "Stocks", "Gold", "FD"],
    Savings: ["Emergency Fund", "Travel Fund", "Home Fund"]
  },
  Debt: {
    Loans: ["Personal Loan", "Home Loan", "Vehicle Loan", "Education Loan"],
    Credit: ["Credit Card", "BNPL", "Late Fees"]
  },
  Income: {
    Income: ["Salary", "Bonus", "Freelance", "Interest", "Refund"]
  }
};

const sampleTransactions: Transaction[] = [
  {
    id: "1",
    date: "2026-05-01",
    type: "income",
    bucket: "Income",
    category: "Income",
    subcategory: "Salary",
    merchant: "Company",
    amount: 75000,
    note: "Monthly salary"
  },
  {
    id: "2",
    date: "2026-05-02",
    type: "expense",
    bucket: "Needs",
    category: "Housing",
    subcategory: "Rent",
    merchant: "Landlord",
    amount: 22000,
    note: "Monthly rent"
  },
  {
    id: "3",
    date: "2026-05-03",
    type: "expense",
    bucket: "Wants",
    category: "Food & Drinks",
    subcategory: "Online Food Delivery",
    merchant: "Swiggy",
    amount: 850,
    note: "Dinner"
  },
  {
    id: "4",
    date: "2026-05-04",
    type: "expense",
    bucket: "Wealth",
    category: "Investments",
    subcategory: "SIP",
    merchant: "Mutual Fund",
    amount: 10000,
    note: "Monthly SIP"
  }
];

const sampleLoans: Loan[] = [
  {
    id: "l1",
    name: "Personal Loan",
    principal: 300000,
    rate: 13.5,
    months: 36
  }
];

const sampleGoals: Goal[] = [
  {
    id: "g1",
    name: "Emergency Fund",
    target: 300000,
    saved: 60000
  },
  {
    id: "g2",
    name: "Japan Travel",
    target: 250000,
    saved: 62000
  }
];

function money(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value || 0);
}

function emi(principal: number, annualRate: number, months: number) {
  const r = annualRate / 12 / 100;
  if (!principal || !months) return 0;
  if (!r) return principal / months;
  return (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
}

export default function Home() {
  const [tab, setTab] = useState("home");

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);

  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    type: "expense" as "income" | "expense",
    bucket: "Wants",
    category: "Food & Drinks",
    subcategory: "Online Food Delivery",
    merchant: "",
    amount: "",
    note: ""
  });

  const [loanForm, setLoanForm] = useState({
    name: "",
    principal: "",
    rate: "",
    months: ""
  });

  const [goalForm, setGoalForm] = useState({
    name: "",
    target: "",
    saved: ""
  });

  useEffect(() => {
    const savedTransactions = localStorage.getItem("pfc_transactions");
    const savedLoans = localStorage.getItem("pfc_loans");
    const savedGoals = localStorage.getItem("pfc_goals");

    setTransactions(savedTransactions ? JSON.parse(savedTransactions) : sampleTransactions);
    setLoans(savedLoans ? JSON.parse(savedLoans) : sampleLoans);
    setGoals(savedGoals ? JSON.parse(savedGoals) : sampleGoals);
  }, []);

  useEffect(() => {
    localStorage.setItem("pfc_transactions", JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem("pfc_loans", JSON.stringify(loans));
  }, [loans]);

  useEffect(() => {
    localStorage.setItem("pfc_goals", JSON.stringify(goals));
  }, [goals]);

  const categories = Object.keys(categoryMap[form.bucket] || {});
  const subcategories = categoryMap[form.bucket]?.[form.category] || [];

  const totals = useMemo(() => {
    const income = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const expense = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const savings = income - expense;
    const savingsRate = income ? Math.round((savings / income) * 100) : 0;

    return { income, expense, savings, savingsRate };
  }, [transactions]);

  const bucketSpend = useMemo(() => {
    const map: Record<string, number> = {};
    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        map[t.bucket] = (map[t.bucket] || 0) + Number(t.amount);
      });

    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [transactions]);

  const categorySpend = useMemo(() => {
    const map: Record<string, number> = {};
    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        const key = `${t.category} → ${t.subcategory}`;
        map[key] = (map[key] || 0) + Number(t.amount);
      });

    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [transactions]);

  const loanSummary = useMemo(() => {
    const rows = loans.map((loan) => {
      const monthlyEmi = emi(loan.principal, loan.rate, loan.months);
      const totalPayable = monthlyEmi * loan.months;
      const interest = totalPayable - loan.principal;

      return {
        ...loan,
        monthlyEmi,
        totalPayable,
        interest
      };
    });

    const totalEmi = rows.reduce((sum, loan) => sum + loan.monthlyEmi, 0);
    const debtBurden = totals.income ? Math.round((totalEmi / totals.income) * 100) : 0;

    return { rows, totalEmi, debtBurden };
  }, [loans, totals.income]);

  const riskScore = useMemo(() => {
    let score = 30;

    if (totals.savingsRate < 20) score += 20;
    if (loanSummary.debtBurden > 35) score += 25;
    if ((bucketSpend.find(([name]) => name === "Wants")?.[1] || 0) > totals.income * 0.3) {
      score += 15;
    }

    return Math.min(score, 100);
  }, [totals, loanSummary.debtBurden, bucketSpend]);

  const advisorText = useMemo(() => {
    if (totals.income === 0) {
      return "Add your income first. Without income data, the advisor cannot judge savings, debt, or investment capacity.";
    }

    if (loanSummary.debtBurden > 35) {
      return "Your EMI burden is high. Focus on reducing expensive loans before increasing risky investments.";
    }

    if (totals.savingsRate < 20) {
      return "Your savings rate is low. Reduce wants like food delivery, shopping, and entertainment first.";
    }

    if (riskScore > 60) {
      return "Your financial risk is rising. Review overspending, loans, and emergency fund before new purchases.";
    }

    return "You are in a decent position. Keep emergency fund priority high, continue SIPs, and avoid lifestyle inflation.";
  }, [totals.income, totals.savingsRate, loanSummary.debtBurden, riskScore]);

  function addTransaction() {
    const amount = Number(form.amount);
    if (!amount || amount <= 0) return;

    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      date: form.date,
      type: form.type,
      bucket: form.bucket,
      category: form.category,
      subcategory: form.subcategory,
      merchant: form.merchant || "Unknown",
      amount,
      note: form.note
    };

    setTransactions([newTransaction, ...transactions]);
    setForm({ ...form, merchant: "", amount: "", note: "" });
  }

  function addLoan() {
    const principal = Number(loanForm.principal);
    const rate = Number(loanForm.rate);
    const months = Number(loanForm.months);

    if (!loanForm.name || !principal || !months) return;

    setLoans([
      {
        id: crypto.randomUUID(),
        name: loanForm.name,
        principal,
        rate,
        months
      },
      ...loans
    ]);

    setLoanForm({ name: "", principal: "", rate: "", months: "" });
  }

  function addGoal() {
    const target = Number(goalForm.target);
    const saved = Number(goalForm.saved);

    if (!goalForm.name || !target) return;

    setGoals([
      {
        id: crypto.randomUUID(),
        name: goalForm.name,
        target,
        saved
      },
      ...goals
    ]);

    setGoalForm({ name: "", target: "", saved: "" });
  }

  function resetDemo() {
    setTransactions(sampleTransactions);
    setLoans(sampleLoans);
    setGoals(sampleGoals);
  }

  return (
    <main style={{ padding: 24, maxWidth: 1250, margin: "0 auto" }}>
      <section
        style={{
          background: "linear-gradient(135deg, #16a34a, #047857)",
          color: "white",
          padding: 28,
          borderRadius: 28,
          marginBottom: 20
        }}
      >
        <span className="badge">Personal Finance CFO</span>
        <h1 style={{ fontSize: 40, marginBottom: 8 }}>
          AI Money Command Center
        </h1>
        <p style={{ maxWidth: 780, opacity: 0.95 }}>
          Add your real income, expenses, goals, and loans. The app calculates
          savings rate, debt burden, spending leakage, and advisor alerts.
        </p>

        <div className="nav">
          {[
            "home",
            "add",
            "cashflow",
            "spending",
            "loans",
            "goals",
            "mutual funds",
            "travel",
            "bi ml",
            "advisor"
          ].map((item) => (
            <button
              key={item}
              onClick={() => setTab(item)}
              className={tab === item ? "active" : ""}
            >
              {item.toUpperCase()}
            </button>
          ))}
        </div>
      </section>

      {tab === "home" && (
        <>
          <div className="grid grid-4">
            <div className="card">
              <Wallet />
              <p className="small">Total Balance Estimate</p>
              <p className="stat">{money(totals.savings)}</p>
            </div>

            <div className="card">
              <TrendingUp />
              <p className="small">Total Income</p>
              <p className="stat">{money(totals.income)}</p>
            </div>

            <div className="card">
              <TrendingDown />
              <p className="small">Total Expense</p>
              <p className="stat">{money(totals.expense)}</p>
            </div>

            <div className="card">
              <PiggyBank />
              <p className="small">Savings Rate</p>
              <p className="stat">{totals.savingsRate}%</p>
            </div>
          </div>

          <div className="grid grid-2" style={{ marginTop: 16 }}>
            <div className="card">
              <h2>Today’s CFO Advice</h2>
              <p>{advisorText}</p>
            </div>

            <div className="card">
              <h2>Financial Risk Score</h2>
              <p className="stat">{riskScore}/100</p>
              <p className="small">
                Lower is better. This score uses savings rate, loans, and wants-based spending.
              </p>
            </div>
          </div>
        </>
      )}

      {tab === "add" && (
        <div className="grid grid-2">
          <div className="card">
            <h2>Add Transaction</h2>

            <p className="small">Date</p>
            <input
              value={form.date}
              type="date"
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              style={inputStyle}
            />

            <p className="small">Type</p>
            <select
              value={form.type}
              onChange={(e) =>
                setForm({
                  ...form,
                  type: e.target.value as "income" | "expense",
                  bucket: e.target.value === "income" ? "Income" : "Wants",
                  category: e.target.value === "income" ? "Income" : "Food & Drinks",
                  subcategory: e.target.value === "income" ? "Salary" : "Online Food Delivery"
                })
              }
              style={inputStyle}
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>

            <p className="small">Bucket</p>
            <select
              value={form.bucket}
              onChange={(e) => {
                const bucket = e.target.value;
                const firstCategory = Object.keys(categoryMap[bucket])[0];
                const firstSubcategory = categoryMap[bucket][firstCategory][0];

                setForm({
                  ...form,
                  bucket,
                  category: firstCategory,
                  subcategory: firstSubcategory
                });
              }}
              style={inputStyle}
            >
              {Object.keys(categoryMap).map((bucket) => (
                <option key={bucket}>{bucket}</option>
              ))}
            </select>

            <p className="small">Category</p>
            <select
              value={form.category}
              onChange={(e) => {
                const category = e.target.value;
                setForm({
                  ...form,
                  category,
                  subcategory: categoryMap[form.bucket][category][0]
                });
              }}
              style={inputStyle}
            >
              {categories.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>

            <p className="small">Subcategory</p>
            <select
              value={form.subcategory}
              onChange={(e) => setForm({ ...form, subcategory: e.target.value })}
              style={inputStyle}
            >
              {subcategories.map((subcategory) => (
                <option key={subcategory}>{subcategory}</option>
              ))}
            </select>

            <p className="small">Merchant / Source</p>
            <input
              value={form.merchant}
              onChange={(e) => setForm({ ...form, merchant: e.target.value })}
              placeholder="Swiggy, Salary, Amazon, HDFC..."
              style={inputStyle}
            />

            <p className="small">Amount</p>
            <input
              value={form.amount}
              type="number"
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              placeholder="Enter amount"
              style={inputStyle}
            />

            <p className="small">Note</p>
            <input
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              placeholder="Optional note"
              style={inputStyle}
            />

            <button onClick={addTransaction} style={primaryButton}>
              <Plus size={16} /> Add Transaction
            </button>
          </div>

          <div className="card">
            <h2>Transaction Ledger</h2>
            {transactions.map((t) => (
              <div key={t.id} style={rowStyle}>
                <div>
                  <strong>{t.merchant}</strong>
                  <p className="small">
                    {t.date} • {t.bucket} → {t.category} → {t.subcategory}
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <strong>{money(t.amount)}</strong>
                  <br />
                  <button
                    onClick={() =>
                      setTransactions(transactions.filter((x) => x.id !== t.id))
                    }
                    style={deleteButton}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "cashflow" && (
        <div className="card">
          <BarChart3 />
          <h2>Cash Flow</h2>
          <p>Income: {money(totals.income)}</p>
          <p>Expense: {money(totals.expense)}</p>
          <p>Net Savings: {money(totals.savings)}</p>
          <p>Savings Rate: {totals.savingsRate}%</p>
          <p>
            Forecast: If your current behavior continues, your savings will stay
            around {money(totals.savings)}.
          </p>
        </div>
      )}

      {tab === "spending" && (
        <div className="grid grid-2">
          <div className="card">
            <h2>Bucket Funnel</h2>
            {bucketSpend.map(([bucket, amount]) => (
              <div key={bucket} style={rowStyle}>
                <strong>{bucket}</strong>
                <span>{money(amount)}</span>
              </div>
            ))}
          </div>

          <div className="card">
            <h2>Category Leakage</h2>
            {categorySpend.map(([category, amount]) => (
              <div key={category} style={rowStyle}>
                <span>{category}</span>
                <strong>{money(amount)}</strong>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "loans" && (
        <div className="grid grid-2">
          <div className="card">
            <Landmark />
            <h2>Add Loan</h2>

            <p className="small">Loan Name</p>
            <input
              value={loanForm.name}
              onChange={(e) => setLoanForm({ ...loanForm, name: e.target.value })}
              placeholder="Personal Loan, Home Loan..."
              style={inputStyle}
            />

            <p className="small">Principal</p>
            <input
              value={loanForm.principal}
              onChange={(e) =>
                setLoanForm({ ...loanForm, principal: e.target.value })
              }
              type="number"
              style={inputStyle}
            />

            <p className="small">Interest Rate % p.a.</p>
            <input
              value={loanForm.rate}
              onChange={(e) => setLoanForm({ ...loanForm, rate: e.target.value })}
              type="number"
              style={inputStyle}
            />

            <p className="small">Tenure Months</p>
            <input
              value={loanForm.months}
              onChange={(e) =>
                setLoanForm({ ...loanForm, months: e.target.value })
              }
              type="number"
              style={inputStyle}
            />

            <button onClick={addLoan} style={primaryButton}>
              <Plus size={16} /> Add Loan
            </button>
          </div>

          <div className="card">
            <h2>Loan Intelligence</h2>
            <p>Total EMI: {money(loanSummary.totalEmi)}</p>
            <p>Debt Burden: {loanSummary.debtBurden}% of income</p>

            {loanSummary.rows.map((loan) => (
              <div key={loan.id} style={rowStyle}>
                <div>
                  <strong>{loan.name}</strong>
                  <p className="small">
                    EMI {money(loan.monthlyEmi)} • Interest {money(loan.interest)}
                  </p>
                </div>
                <button
                  onClick={() => setLoans(loans.filter((x) => x.id !== loan.id))}
                  style={deleteButton}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}

            {loanSummary.debtBurden > 35 && (
              <p style={{ color: "#dc2626" }}>
                Warning: EMI burden is high. Reduce debt before aggressive investing.
              </p>
            )}
          </div>
        </div>
      )}

      {tab === "goals" && (
        <div className="grid grid-2">
          <div className="card">
            <Target />
            <h2>Add Goal</h2>

            <p className="small">Goal Name</p>
            <input
              value={goalForm.name}
              onChange={(e) => setGoalForm({ ...goalForm, name: e.target.value })}
              placeholder="Emergency Fund, Travel..."
              style={inputStyle}
            />

            <p className="small">Target Amount</p>
            <input
              value={goalForm.target}
              onChange={(e) =>
                setGoalForm({ ...goalForm, target: e.target.value })
              }
              type="number"
              style={inputStyle}
            />

            <p className="small">Already Saved</p>
            <input
              value={goalForm.saved}
              onChange={(e) => setGoalForm({ ...goalForm, saved: e.target.value })}
              type="number"
              style={inputStyle}
            />

            <button onClick={addGoal} style={primaryButton}>
              <Plus size={16} /> Add Goal
            </button>
          </div>

          <div className="card">
            <h2>Goals</h2>
            {goals.map((goal) => {
              const progress = Math.round((goal.saved / goal.target) * 100);

              return (
                <div key={goal.id} style={rowStyle}>
                  <div>
                    <strong>{goal.name}</strong>
                    <p className="small">
                      {money(goal.saved)} / {money(goal.target)} • {progress}%
                    </p>
                  </div>
                  <button
                    onClick={() => setGoals(goals.filter((x) => x.id !== goal.id))}
                    style={deleteButton}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {tab === "mutual funds" && (
        <div className="card">
          <PiggyBank />
          <h2>Mutual Fund Portfolio</h2>
          <p>This section will become Version 3.</p>
          <p>Planned features:</p>
          <p>• SIP tracker</p>
          <p>• Fund-wise invested amount and current value</p>
          <p>• Goal mapping</p>
          <p>• Risk-o-meter</p>
          <p>• SEBI-compliant educational advisor mode</p>
        </div>
      )}

      {tab === "travel" && (
        <div className="card">
          <Plane />
          <h2>Travel & Forex</h2>
          <p>This section will become Version 4.</p>
          <p>Planned features:</p>
          <p>• Country-wise travel budget</p>
          <p>• Currency conversion</p>
          <p>• Forex impact on trip cost</p>
          <p>• Monthly travel savings target</p>
        </div>
      )}

      {tab === "bi ml" && (
        <div className="card">
          <Brain />
          <h2>Business Intelligence + Machine Learning</h2>
          <p>Risk Score: {riskScore}/100</p>
          <p>Likely savings opportunity: wants-based spending reduction.</p>
          <p>
            Later this will include anomaly detection, recurring expense
            detection, overspending prediction, and AI recommendations.
          </p>
        </div>
      )}

      {tab === "advisor" && (
        <div className="card">
          <Brain />
          <h2>AI CFO Advisor</h2>
          <p>{advisorText}</p>
          <div style={{ marginTop: 16 }}>
            <AlertTriangle />
            <p className="small">
              Investment advice will remain educational until a compliant
              advisory structure is added.
            </p>
          </div>
        </div>
      )}

      <div style={{ marginTop: 20 }}>
        <button onClick={resetDemo} style={secondaryButton}>
          Reset Demo Data
        </button>
      </div>
    </main>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px",
  borderRadius: "12px",
  border: "1px solid #d1d5db",
  marginBottom: "10px"
};

const primaryButton: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  border: 0,
  background: "#16a34a",
  color: "white",
  padding: "12px 16px",
  borderRadius: "14px",
  cursor: "pointer",
  fontWeight: 700
};

const secondaryButton: React.CSSProperties = {
  border: 0,
  background: "#e5e7eb",
  color: "#111827",
  padding: "12px 16px",
  borderRadius: "14px",
  cursor: "pointer",
  fontWeight: 700
};

const deleteButton: React.CSSProperties = {
  border: 0,
  background: "#fee2e2",
  color: "#991b1b",
  padding: "8px",
  borderRadius: "10px",
  cursor: "pointer"
};

const rowStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 12,
  borderBottom: "1px solid #e5e7eb",
  padding: "12px 0"
};
