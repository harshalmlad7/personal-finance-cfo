"use client";

import { useEffect, useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Bell,
  Brain,
  Calculator,
  CreditCard,
  Landmark,
  LayoutDashboard,
  LineChart,
  PiggyBank,
  Plane,
  Plus,
  ReceiptText,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  Trash2,
  TrendingDown,
  TrendingUp,
  Wallet
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

const trustedSources = [
  {
    title: "SEBI Investor Portal - Mutual Fund Risk-o-meter",
    category: "Regulation",
    keywords: [
      "sebi",
      "riskometer",
      "risk-o-meter",
      "mutual fund risk",
      "mutual funds",
      "investment risk"
    ],
    description:
      "Official SEBI investor education page explaining mutual fund Risk-o-meter and risk levels.",
    url: "https://investor.sebi.gov.in/riskometer.html",
    priority: 95
  },
  {
    title: "RBI Account Aggregator Master Direction",
    category: "Regulation",
    keywords: [
      "rbi",
      "account aggregator",
      "aa framework",
      "bank sync",
      "consent",
      "financial data sharing"
    ],
    description:
      "Official RBI Master Direction for NBFC Account Aggregator framework and consent-based financial data sharing.",
    url: "https://www.rbi.org.in/Scripts/NotificationUser.aspx?Id=10598",
    priority: 95
  },
  {
    title: "AMFI Latest NAV Download",
    category: "Mutual Funds",
    keywords: [
      "amfi",
      "nav",
      "latest nav",
      "mutual fund nav",
      "sip",
      "fund value"
    ],
    description:
      "Official AMFI page for latest and historical mutual fund NAV data.",
    url: "https://www.amfiindia.com/net-asset-value/nav-download",
    priority: 92
  },
  {
    title: "World Bank Indicators API",
    category: "World Data",
    keywords: [
      "world bank",
      "global data",
      "inflation",
      "gdp",
      "country data",
      "economic indicators",
      "world information"
    ],
    description:
      "Official World Bank documentation for global development and economic indicators.",
    url: "https://datahelpdesk.worldbank.org/knowledgebase/articles/889392-about-the-indicators-api-documentation",
    priority: 90
  }
];

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
  { id: "transactions", label: "Transactions", icon: <ReceiptText size={18} /> },
  { id: "spending", label: "Spending", icon: <BarChart3 size={18} /> },
  { id: "calculators", label: "Calculators", icon: <Calculator size={18} /> },
  { id: "loans", label: "Loans", icon: <Landmark size={18} /> },
  { id: "goals", label: "Goals", icon: <Target size={18} /> },
  { id: "mutual funds", label: "Mutual Funds", icon: <PiggyBank size={18} /> },
  { id: "travel", label: "Travel & Forex", icon: <Plane size={18} /> },
  { id: "bi ml", label: "BI & ML", icon: <Brain size={18} /> },
  { id: "advisor", label: "AI Advisor", icon: <Sparkles size={18} /> }
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

function sipFutureValue(monthlyInvestment: number, annualReturn: number, years: number) {
  const r = annualReturn / 12 / 100;
  const n = years * 12;
  if (!monthlyInvestment || !years) return 0;
  if (!r) return monthlyInvestment * n;
  return monthlyInvestment * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
}

function lumpSumFutureValue(principal: number, annualReturn: number, years: number) {
  return principal * Math.pow(1 + annualReturn / 100, years);
}

function fdMaturity(principal: number, annualRate: number, years: number) {
  return principal * Math.pow(1 + annualRate / 100, years);
}

function rdMaturity(monthlyDeposit: number, annualRate: number, years: number) {
  const r = annualRate / 4 / 100;
  const months = years * 12;
  let maturity = 0;

  for (let i = 0; i < months; i++) {
    const remainingMonths = months - i;
    const quarters = remainingMonths / 3;
    maturity += monthlyDeposit * Math.pow(1 + r, quarters);
  }

  return maturity;
}

function normalizeSearch(text: string) {
  return text.toLowerCase().trim();
}

function scoreText(query: string, text: string) {
  const q = normalizeSearch(query);
  const t = normalizeSearch(text);

  if (!q || !t) return 0;

  const words = q.split(/\s+/).filter(Boolean);
  let score = 0;

  if (t === q) score += 100;
  if (t.includes(q)) score += 60;

  words.forEach((word) => {
    if (t.includes(word)) score += 12;
  });

  return score;
}

export default function Home() {
  const [tab, setTab] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");

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

  const [calcType, setCalcType] = useState("emi");

  const [emiCalc, setEmiCalc] = useState({
    loanType: "Home Loan",
    amount: 1000000,
    rate: 8,
    months: 120
  });

  const [sipCalc, setSipCalc] = useState({
    monthly: 10000,
    returnRate: 12,
    years: 10
  });

  const [lumpCalc, setLumpCalc] = useState({
    amount: 100000,
    returnRate: 12,
    years: 10
  });

  const [fdCalc, setFdCalc] = useState({
    amount: 100000,
    rate: 7,
    years: 5
  });

  const [rdCalc, setRdCalc] = useState({
    monthly: 5000,
    rate: 7,
    years: 5
  });

  const [goalCalc, setGoalCalc] = useState({
    target: 500000,
    current: 50000,
    years: 5,
    returnRate: 10
  });

  const [cardCalc, setCardCalc] = useState({
    outstanding: 75000,
    annualRate: 36,
    monthlyPayment: 10000
  });

  useEffect(() => {
    const savedTransactions = localStorage.getItem("pfc_transactions_v4");
    const savedLoans = localStorage.getItem("pfc_loans_v4");
    const savedGoals = localStorage.getItem("pfc_goals_v4");

    setTransactions(savedTransactions ? JSON.parse(savedTransactions) : sampleTransactions);
    setLoans(savedLoans ? JSON.parse(savedLoans) : sampleLoans);
    setGoals(savedGoals ? JSON.parse(savedGoals) : sampleGoals);
  }, []);

  useEffect(() => {
    localStorage.setItem("pfc_transactions_v4", JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem("pfc_loans_v4", JSON.stringify(loans));
  }, [loans]);

  useEffect(() => {
    localStorage.setItem("pfc_goals_v4", JSON.stringify(goals));
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

  const dailyBars = useMemo(() => {
    const expenses = transactions.filter((t) => t.type === "expense");
    const values = expenses.slice(0, 7).map((t) => t.amount).reverse();
    if (values.length === 0) return [10, 20, 12, 30, 18, 24, 14];
    return values;
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

  const wantsSpend = bucketSpend.find(([name]) => name === "Wants")?.[1] || 0;
  const needsSpend = bucketSpend.find(([name]) => name === "Needs")?.[1] || 0;
  const wealthSpend = bucketSpend.find(([name]) => name === "Wealth")?.[1] || 0;
  const debtSpend = bucketSpend.find(([name]) => name === "Debt")?.[1] || 0;

  const riskScore = useMemo(() => {
    let score = 28;
    if (totals.savingsRate < 20) score += 20;
    if (loanSummary.debtBurden > 35) score += 25;
    if (wantsSpend > totals.income * 0.3) score += 15;
    return Math.min(score, 100);
  }, [totals, loanSummary.debtBurden, wantsSpend]);

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

  const searchResults = useMemo(() => {
    const query = normalizeSearch(searchQuery);

    if (!query) {
      return {
        internal: [],
        sources: [],
        hasQuery: false
      };
    }

    const transactionResults = transactions
      .map((transaction) => {
        const searchableText = [
          transaction.merchant,
          transaction.date,
          transaction.type,
          transaction.bucket,
          transaction.category,
          transaction.subcategory,
          transaction.amount,
          transaction.note
        ].join(" ");

        return {
          type: "Transaction",
          title: transaction.merchant,
          subtitle: `${transaction.date} • ${transaction.bucket} → ${transaction.category} → ${transaction.subcategory}`,
          amount: money(transaction.amount),
          score: scoreText(query, searchableText)
        };
      })
      .filter((item) => item.score > 0);

    const loanResults = loans
      .map((loan) => {
        const monthlyEmi = emi(loan.principal, loan.rate, loan.months);
        const searchableText = [
          loan.name,
          loan.principal,
          loan.rate,
          loan.months,
          "loan",
          "emi",
          "debt",
          "calculator"
        ].join(" ");

        return {
          type: "Loan",
          title: loan.name,
          subtitle: `Principal ${money(loan.principal)} • EMI ${money(monthlyEmi)} • Rate ${loan.rate}%`,
          amount: money(monthlyEmi),
          score: scoreText(query, searchableText)
        };
      })
      .filter((item) => item.score > 0);

    const goalResults = goals
      .map((goal) => {
        const searchableText = [
          goal.name,
          goal.target,
          goal.saved,
          "goal",
          "saving",
          "target",
          "calculator"
        ].join(" ");

        return {
          type: "Goal",
          title: goal.name,
          subtitle: `Saved ${money(goal.saved)} of ${money(goal.target)}`,
          amount: `${goal.target ? Math.round((goal.saved / goal.target) * 100) : 0}%`,
          score: scoreText(query, searchableText)
        };
      })
      .filter((item) => item.score > 0);

    const calculatorResults = [
      {
        type: "Calculator",
        title: "EMI Calculator",
        subtitle: "Home loan, personal loan and car loan EMI calculation",
        amount: "Open",
        score: scoreText(query, "emi loan home loan personal loan car loan calculator interest tenure")
      },
      {
        type: "Calculator",
        title: "SIP Calculator",
        subtitle: "Monthly SIP future value and wealth projection",
        amount: "Open",
        score: scoreText(query, "sip mutual fund monthly investment calculator future value")
      },
      {
        type: "Calculator",
        title: "FD / RD Calculator",
        subtitle: "Fixed deposit and recurring deposit maturity estimates",
        amount: "Open",
        score: scoreText(query, "fd rd fixed deposit recurring deposit calculator")
      },
      {
        type: "Calculator",
        title: "Goal Planning Calculator",
        subtitle: "Monthly investment required to reach a future goal",
        amount: "Open",
        score: scoreText(query, "goal planning target saving travel emergency fund calculator")
      },
      {
        type: "Calculator",
        title: "Credit Card Payoff Calculator",
        subtitle: "Estimate months required to clear credit card outstanding",
        amount: "Open",
        score: scoreText(query, "credit card debt payoff calculator interest")
      }
    ].filter((item) => item.score > 0);

    const sourceResults = trustedSources
      .map((source) => {
        const searchableText = [
          source.title,
          source.category,
          source.description,
          source.keywords.join(" ")
        ].join(" ");

        return {
          ...source,
          score: scoreText(query, searchableText) + source.priority
        };
      })
      .filter((source) =>
        scoreText(
          query,
          [
            source.title,
            source.category,
            source.description,
            source.keywords.join(" ")
          ].join(" ")
        ) > 0
      )
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);

    const internal = [
      ...calculatorResults,
      ...transactionResults,
      ...loanResults,
      ...goalResults
    ]
      .sort((a, b) => b.score - a.score)
      .slice(0, 12);

    return {
      internal,
      sources: sourceResults,
      hasQuery: true
    };
  }, [searchQuery, transactions, loans, goals]);

  const emiValue = emi(emiCalc.amount, emiCalc.rate, emiCalc.months);
  const emiTotal = emiValue * emiCalc.months;
  const emiInterest = emiTotal - emiCalc.amount;
  const emiInterestPercent = emiTotal ? Math.round((emiInterest / emiTotal) * 100) : 0;

  const sipMaturity = sipFutureValue(sipCalc.monthly, sipCalc.returnRate, sipCalc.years);
  const sipInvested = sipCalc.monthly * sipCalc.years * 12;
  const sipGains = sipMaturity - sipInvested;

  const lumpMaturity = lumpSumFutureValue(lumpCalc.amount, lumpCalc.returnRate, lumpCalc.years);
  const lumpGains = lumpMaturity - lumpCalc.amount;

  const fdValue = fdMaturity(fdCalc.amount, fdCalc.rate, fdCalc.years);
  const fdInterest = fdValue - fdCalc.amount;

  const rdValue = rdMaturity(rdCalc.monthly, rdCalc.rate, rdCalc.years);
  const rdInvested = rdCalc.monthly * rdCalc.years * 12;
  const rdInterest = rdValue - rdInvested;

  const goalGap = Math.max(goalCalc.target - goalCalc.current, 0);
  const goalMonths = goalCalc.years * 12;
  const goalMonthlyRequired = goalMonths ? goalGap / goalMonths : 0;
  const goalSIPRequired = useMemo(() => {
    const r = goalCalc.returnRate / 12 / 100;
    const n = goalCalc.years * 12;
    if (!n) return 0;
    if (!r) return goalGap / n;
    return goalGap / (((Math.pow(1 + r, n) - 1) / r) * (1 + r));
  }, [goalCalc, goalGap]);

  const cardMonthlyRate = cardCalc.annualRate / 12 / 100;
  const cardMonths = useMemo(() => {
    let balance = cardCalc.outstanding;
    let months = 0;
    let totalInterest = 0;

    while (balance > 0 && months < 600) {
      const interest = balance * cardMonthlyRate;
      totalInterest += interest;
      balance += interest;
      balance -= cardCalc.monthlyPayment;
      months += 1;

      if (cardCalc.monthlyPayment <= interest) return { months: 999, totalInterest };
    }

    return { months, totalInterest };
  }, [cardCalc, cardMonthlyRate]);

  function addTransaction() {
    const amount = Number(form.amount);
    if (!amount || amount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

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

  function deleteTransaction(id: string) {
    const consent = window.confirm("Are you sure you want to delete this transaction?");
    if (!consent) return;
    setTransactions(transactions.filter((x) => x.id !== id));
  }

  function addLoan() {
    const principal = Number(loanForm.principal);
    const rate = Number(loanForm.rate);
    const months = Number(loanForm.months);

    if (!loanForm.name || !principal || !months) {
      alert("Please enter loan name, principal, and tenure.");
      return;
    }

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

  function deleteLoan(id: string) {
    const consent = window.confirm("Are you sure you want to delete this loan?");
    if (!consent) return;
    setLoans(loans.filter((x) => x.id !== id));
  }

  function addGoal() {
    const target = Number(goalForm.target);
    const saved = Number(goalForm.saved);

    if (!goalForm.name || !target) {
      alert("Please enter goal name and target amount.");
      return;
    }

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

  function deleteGoal(id: string) {
    const consent = window.confirm("Are you sure you want to delete this goal?");
    if (!consent) return;
    setGoals(goals.filter((x) => x.id !== id));
  }

  function resetDemo() {
    const consent = window.confirm(
      "This will reset demo transactions, loans, and goals. Continue?"
    );
    if (!consent) return;

    setTransactions(sampleTransactions);
    setLoans(sampleLoans);
    setGoals(sampleGoals);
  }

  function clearAllData() {
    const consent = window.confirm(
      "This will permanently clear all transactions, loans, and goals from this browser. Continue?"
    );
    if (!consent) return;

    setTransactions([]);
    setLoans([]);
    setGoals([]);
  }

  return (
    <main style={appShell}>
      <aside style={sidebar}>
        <div style={brandBox}>
          <div style={brandIcon}>₹</div>
          <div>
            <h2 style={brandTitle}>Finance CFO</h2>
            <p style={brandSubtitle}>Money Command OS</p>
          </div>
        </div>

        <nav style={navStyle}>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              style={tab === item.id ? navButtonActive : navButton}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div style={sidebarFooter}>
          <p style={sidebarFooterLabel}>Financial Health</p>
          <p style={sidebarFooterValue}>{100 - riskScore}/100</p>
          <div style={healthTrack}>
            <div
              style={{
                ...healthFill,
                width: `${Math.max(0, 100 - riskScore)}%`
              }}
            />
          </div>
        </div>
      </aside>

      <section style={content}>
        <header style={topbar}>
          <div>
            <p style={eyebrow}>PERSONAL FINANCE CFO</p>
            <h1 style={pageTitle}>{getPageTitle(tab)}</h1>
          </div>

          <div style={topbarRight}>
            <div style={searchBox}>
              <Search size={16} />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search anything: Swiggy, EMI, SIP, SEBI, NAV, RBI..."
                style={searchInput}
              />
            </div>
            <button style={iconButton}>
              <Bell size={18} />
            </button>
          </div>
        </header>

        {searchResults.hasQuery && (
          <section style={searchResultsPanel}>
            <PanelHeader
              title={`Search results for "${searchQuery}"`}
              subtitle="App data first. Verified source links separately. No hallucinated answers."
              icon={<Search />}
            />

            <section style={searchGrid}>
              <div style={panel}>
                <h3 style={searchSectionTitle}>Your App Data & Tools</h3>

                {searchResults.internal.length === 0 && (
                  <EmptyText text="No matching transactions, calculators, loans, or goals found." />
                )}

                {searchResults.internal.map((result, index) => (
                  <div key={`${result.type}-${index}`} style={searchResultRow}>
                    <div>
                      <span style={resultTypeBadge}>{result.type}</span>
                      <strong style={{ display: "block", marginTop: 6 }}>
                        {result.title}
                      </strong>
                      <p style={mutedText}>{result.subtitle}</p>
                    </div>

                    <strong>{result.amount}</strong>
                  </div>
                ))}
              </div>

              <div style={panel}>
                <h3 style={searchSectionTitle}>Verified Sources</h3>

                {searchResults.sources.length === 0 && (
                  <EmptyText text="No verified source match yet. Future live APIs will broaden world search." />
                )}

                {searchResults.sources.map((source) => (
                  <a
                    key={source.url}
                    href={source.url}
                    target="_blank"
                    rel="noreferrer"
                    style={sourceCard}
                  >
                    <span style={sourceCategoryBadge}>{source.category}</span>
                    <strong style={{ display: "block", marginTop: 8 }}>
                      {source.title}
                    </strong>
                    <p style={mutedText}>{source.description}</p>
                    <p style={sourceLinkText}>Open verified source →</p>
                  </a>
                ))}
              </div>
            </section>

            <div style={antiHallucinationBox}>
              <ShieldCheck size={18} />
              Rule: If verified data or a trusted source is unavailable, the app should say it cannot verify instead of guessing.
            </div>
          </section>
        )}

        {tab === "dashboard" && (
          <>
            <section style={heroPanel}>
              <div>
                <div style={premiumBadge}>
                  <Sparkles size={14} /> AI-powered money command center
                </div>
                <h2 style={heroTitle}>Control spending. Reduce debt. Build wealth.</h2>
                <p style={heroText}>
                  Your dashboard tracks cash flow, savings, debt burden, goals, calculators, and spending leakage in one cockpit.
                </p>
              </div>

              <div style={heroScore}>
                <p style={heroScoreLabel}>Risk Score</p>
                <p style={heroScoreValue}>{riskScore}</p>
                <p style={heroScoreLabel}>Lower is better</p>
              </div>
            </section>

            <section style={statGrid}>
              <MetricCard
                title="Current Balance"
                value={money(totals.savings)}
                subtext="Income minus tracked expenses"
                icon={<Wallet />}
                trend="+ Live"
                tone="green"
              />
              <MetricCard
                title="Total Income"
                value={money(totals.income)}
                subtext="All income entries"
                icon={<TrendingUp />}
                trend="Cash in"
                tone="blue"
              />
              <MetricCard
                title="Total Expense"
                value={money(totals.expense)}
                subtext="All spending entries"
                icon={<TrendingDown />}
                trend="Cash out"
                tone="red"
              />
              <MetricCard
                title="Savings Rate"
                value={`${totals.savingsRate}%`}
                subtext="Target should be 20%+"
                icon={<PiggyBank />}
                trend="Goal"
                tone="gold"
              />
            </section>

            <section style={dashboardGrid}>
              <div style={panelLarge}>
                <PanelHeader
                  title="Balance & Spending Trend"
                  subtitle="Visual snapshot from recent expenses"
                  icon={<LineChart />}
                />
                <MiniBarChart values={dailyBars} />
              </div>

              <div style={panel}>
                <PanelHeader
                  title="AI CFO Advice"
                  subtitle="Actionable guidance"
                  icon={<Brain />}
                />
                <p style={advisorBox}>{advisorText}</p>

                <div style={actionList}>
                  <ActionItem label="Track daily" />
                  <ActionItem label="Use calculators before decisions" />
                  <ActionItem label="Protect emergency fund" />
                </div>
              </div>
            </section>

            <section style={dashboardGrid}>
              <div style={panel}>
                <PanelHeader
                  title="Budget Funnel"
                  subtitle="Needs, wants, wealth, debt"
                  icon={<BarChart3 />}
                />

                <BudgetBar label="Needs" value={needsSpend} total={totals.expense} color="#2563eb" />
                <BudgetBar label="Wants" value={wantsSpend} total={totals.expense} color="#ef4444" />
                <BudgetBar label="Wealth" value={wealthSpend} total={totals.expense} color="#16a34a" />
                <BudgetBar label="Debt" value={debtSpend} total={totals.expense} color="#f59e0b" />
              </div>

              <div style={panelLarge}>
                <PanelHeader
                  title="Latest Transactions"
                  subtitle="Most recent money movements"
                  icon={<ReceiptText />}
                />

                <TransactionTable
                  transactions={transactions.slice(0, 6)}
                  onDelete={deleteTransaction}
                />
              </div>
            </section>
          </>
        )}

        {tab === "transactions" && (
          <section style={twoColumnGrid}>
            <div style={panel}>
              <PanelHeader
                title="Add Transaction"
                subtitle="Build your daily money database"
                icon={<Plus />}
              />

              <Field label="Date">
                <input
                  value={form.date}
                  type="date"
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  style={inputStyle}
                />
              </Field>

              <Field label="Type">
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
              </Field>

              <Field label="Bucket">
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
              </Field>

              <Field label="Category">
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
              </Field>

              <Field label="Subcategory">
                <select
                  value={form.subcategory}
                  onChange={(e) => setForm({ ...form, subcategory: e.target.value })}
                  style={inputStyle}
                >
                  {subcategories.map((subcategory) => (
                    <option key={subcategory}>{subcategory}</option>
                  ))}
                </select>
              </Field>

              <Field label="Merchant / Source">
                <input
                  value={form.merchant}
                  onChange={(e) => setForm({ ...form, merchant: e.target.value })}
                  placeholder="Swiggy, Salary, Amazon, HDFC..."
                  style={inputStyle}
                />
              </Field>

              <Field label="Amount">
                <input
                  value={form.amount}
                  type="number"
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  placeholder="Enter amount"
                  style={inputStyle}
                />
              </Field>

              <Field label="Note">
                <input
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                  placeholder="Optional note"
                  style={inputStyle}
                />
              </Field>

              <button onClick={addTransaction} style={primaryButton}>
                <Plus size={16} /> Add Transaction
              </button>
            </div>

            <div style={panelLarge}>
              <PanelHeader
                title="Transaction Ledger"
                subtitle="All income and expense records"
                icon={<ReceiptText />}
              />

              <TransactionTable
                transactions={transactions}
                onDelete={deleteTransaction}
              />
            </div>
          </section>
        )}

        {tab === "calculators" && (
          <section>
            <div style={calculatorHero}>
              <div>
                <div style={premiumBadgeDark}>
                  <Calculator size={14} /> Premium financial calculators
                </div>
                <h2 style={calculatorHeroTitle}>Plan before you spend, borrow or invest.</h2>
                <p style={calculatorHeroText}>
                  Use EMI, SIP, lump sum, FD, RD, goal and credit card calculators before taking money decisions.
                </p>
              </div>

              <button style={primaryButton} onClick={() => setTab("transactions")}>
                Add real transaction
              </button>
            </div>

            <div style={calculatorTabs}>
              {[
                ["emi", "EMI"],
                ["sip", "SIP"],
                ["lumpsum", "Lump Sum"],
                ["fd", "FD"],
                ["rd", "RD"],
                ["goal", "Goal"],
                ["card", "Credit Card"]
              ].map(([id, label]) => (
                <button
                  key={id}
                  onClick={() => setCalcType(id)}
                  style={calcType === id ? calculatorTabActive : calculatorTab}
                >
                  {label}
                </button>
              ))}
            </div>

            {calcType === "emi" && (
              <section style={calculatorGrid}>
                <div style={calculatorInputPanel}>
                  <PanelHeader
                    title="Loan EMI Calculator"
                    subtitle="Home loan, personal loan and car loan"
                    icon={<Landmark />}
                  />

                  <div style={loanTypeGrid}>
                    {["Home Loan", "Personal Loan", "Car Loan"].map((loanType) => (
                      <button
                        key={loanType}
                        onClick={() => setEmiCalc({ ...emiCalc, loanType })}
                        style={emiCalc.loanType === loanType ? loanTypeActive : loanTypeButton}
                      >
                        {loanType}
                      </button>
                    ))}
                  </div>

                  <SliderField
                    label="Loan Amount"
                    value={emiCalc.amount}
                    min={10000}
                    max={10000000}
                    step={10000}
                    suffix="INR"
                    onChange={(value) => setEmiCalc({ ...emiCalc, amount: value })}
                  />

                  <SliderField
                    label="Rate of Interest"
                    value={emiCalc.rate}
                    min={1}
                    max={24}
                    step={0.1}
                    suffix="%"
                    onChange={(value) => setEmiCalc({ ...emiCalc, rate: value })}
                  />

                  <SliderField
                    label="Tenure"
                    value={emiCalc.months}
                    min={1}
                    max={360}
                    step={1}
                    suffix="Months"
                    onChange={(value) => setEmiCalc({ ...emiCalc, months: value })}
                  />
                </div>

                <CalculatorResultPanel
                  title={`${emiCalc.loanType} Result`}
                  mainLabel="Loan EMI"
                  mainValue={money(emiValue)}
                  rows={[
                    ["Principal Amount", money(emiCalc.amount)],
                    ["Total Interest Payable", money(emiInterest)],
                    ["Total Payment", money(emiTotal)]
                  ]}
                  chartPrimary={emiInterestPercent}
                  chartPrimaryLabel="Interest"
                  chartSecondaryLabel="Principal"
                />
              </section>
            )}

            {calcType === "sip" && (
              <section style={calculatorGrid}>
                <div style={calculatorInputPanel}>
                  <PanelHeader
                    title="SIP Calculator"
                    subtitle="Monthly investment wealth projection"
                    icon={<PiggyBank />}
                  />

                  <SliderField
                    label="Monthly SIP"
                    value={sipCalc.monthly}
                    min={500}
                    max={200000}
                    step={500}
                    suffix="INR"
                    onChange={(value) => setSipCalc({ ...sipCalc, monthly: value })}
                  />

                  <SliderField
                    label="Expected Annual Return"
                    value={sipCalc.returnRate}
                    min={1}
                    max={30}
                    step={0.5}
                    suffix="%"
                    onChange={(value) => setSipCalc({ ...sipCalc, returnRate: value })}
                  />

                  <SliderField
                    label="Investment Duration"
                    value={sipCalc.years}
                    min={1}
                    max={40}
                    step={1}
                    suffix="Years"
                    onChange={(value) => setSipCalc({ ...sipCalc, years: value })}
                  />
                </div>

                <CalculatorResultPanel
                  title="SIP Wealth Projection"
                  mainLabel="Future Value"
                  mainValue={money(sipMaturity)}
                  rows={[
                    ["Total Invested", money(sipInvested)],
                    ["Estimated Gains", money(sipGains)],
                    ["Total Value", money(sipMaturity)]
                  ]}
                  chartPrimary={sipMaturity ? Math.round((sipGains / sipMaturity) * 100) : 0}
                  chartPrimaryLabel="Gains"
                  chartSecondaryLabel="Invested"
                />
              </section>
            )}

            {calcType === "lumpsum" && (
              <section style={calculatorGrid}>
                <div style={calculatorInputPanel}>
                  <PanelHeader
                    title="Lump Sum Calculator"
                    subtitle="One-time investment growth"
                    icon={<TrendingUp />}
                  />

                  <SliderField
                    label="Investment Amount"
                    value={lumpCalc.amount}
                    min={1000}
                    max={5000000}
                    step={1000}
                    suffix="INR"
                    onChange={(value) => setLumpCalc({ ...lumpCalc, amount: value })}
                  />

                  <SliderField
                    label="Expected Annual Return"
                    value={lumpCalc.returnRate}
                    min={1}
                    max={30}
                    step={0.5}
                    suffix="%"
                    onChange={(value) => setLumpCalc({ ...lumpCalc, returnRate: value })}
                  />

                  <SliderField
                    label="Duration"
                    value={lumpCalc.years}
                    min={1}
                    max={40}
                    step={1}
                    suffix="Years"
                    onChange={(value) => setLumpCalc({ ...lumpCalc, years: value })}
                  />
                </div>

                <CalculatorResultPanel
                  title="Lump Sum Result"
                  mainLabel="Future Value"
                  mainValue={money(lumpMaturity)}
                  rows={[
                    ["Invested Amount", money(lumpCalc.amount)],
                    ["Estimated Gains", money(lumpGains)],
                    ["Total Value", money(lumpMaturity)]
                  ]}
                  chartPrimary={lumpMaturity ? Math.round((lumpGains / lumpMaturity) * 100) : 0}
                  chartPrimaryLabel="Gains"
                  chartSecondaryLabel="Invested"
                />
              </section>
            )}

            {calcType === "fd" && (
              <section style={calculatorGrid}>
                <div style={calculatorInputPanel}>
                  <PanelHeader
                    title="Fixed Deposit Calculator"
                    subtitle="Maturity value estimate"
                    icon={<Wallet />}
                  />

                  <SliderField
                    label="Deposit Amount"
                    value={fdCalc.amount}
                    min={1000}
                    max={5000000}
                    step={1000}
                    suffix="INR"
                    onChange={(value) => setFdCalc({ ...fdCalc, amount: value })}
                  />

                  <SliderField
                    label="Interest Rate"
                    value={fdCalc.rate}
                    min={1}
                    max={15}
                    step={0.1}
                    suffix="%"
                    onChange={(value) => setFdCalc({ ...fdCalc, rate: value })}
                  />

                  <SliderField
                    label="Duration"
                    value={fdCalc.years}
                    min={1}
                    max={20}
                    step={1}
                    suffix="Years"
                    onChange={(value) => setFdCalc({ ...fdCalc, years: value })}
                  />
                </div>

                <CalculatorResultPanel
                  title="FD Maturity Result"
                  mainLabel="Maturity Value"
                  mainValue={money(fdValue)}
                  rows={[
                    ["Principal", money(fdCalc.amount)],
                    ["Interest Earned", money(fdInterest)],
                    ["Maturity Value", money(fdValue)]
                  ]}
                  chartPrimary={fdValue ? Math.round((fdInterest / fdValue) * 100) : 0}
                  chartPrimaryLabel="Interest"
                  chartSecondaryLabel="Principal"
                />
              </section>
            )}

            {calcType === "rd" && (
              <section style={calculatorGrid}>
                <div style={calculatorInputPanel}>
                  <PanelHeader
                    title="Recurring Deposit Calculator"
                    subtitle="Monthly deposit maturity estimate"
                    icon={<Wallet />}
                  />

                  <SliderField
                    label="Monthly Deposit"
                    value={rdCalc.monthly}
                    min={500}
                    max={200000}
                    step={500}
                    suffix="INR"
                    onChange={(value) => setRdCalc({ ...rdCalc, monthly: value })}
                  />

                  <SliderField
                    label="Interest Rate"
                    value={rdCalc.rate}
                    min={1}
                    max={15}
                    step={0.1}
                    suffix="%"
                    onChange={(value) => setRdCalc({ ...rdCalc, rate: value })}
                  />

                  <SliderField
                    label="Duration"
                    value={rdCalc.years}
                    min={1}
                    max={20}
                    step={1}
                    suffix="Years"
                    onChange={(value) => setRdCalc({ ...rdCalc, years: value })}
                  />
                </div>

                <CalculatorResultPanel
                  title="RD Maturity Result"
                  mainLabel="Maturity Value"
                  mainValue={money(rdValue)}
                  rows={[
                    ["Total Deposited", money(rdInvested)],
                    ["Interest Earned", money(rdInterest)],
                    ["Maturity Value", money(rdValue)]
                  ]}
                  chartPrimary={rdValue ? Math.round((rdInterest / rdValue) * 100) : 0}
                  chartPrimaryLabel="Interest"
                  chartSecondaryLabel="Deposited"
                />
              </section>
            )}

            {calcType === "goal" && (
              <section style={calculatorGrid}>
                <div style={calculatorInputPanel}>
                  <PanelHeader
                    title="Goal Planning Calculator"
                    subtitle="Know how much to save monthly"
                    icon={<Target />}
                  />

                  <SliderField
                    label="Goal Target"
                    value={goalCalc.target}
                    min={10000}
                    max={10000000}
                    step={10000}
                    suffix="INR"
                    onChange={(value) => setGoalCalc({ ...goalCalc, target: value })}
                  />

                  <SliderField
                    label="Already Saved"
                    value={goalCalc.current}
                    min={0}
                    max={goalCalc.target}
                    step={1000}
                    suffix="INR"
                    onChange={(value) => setGoalCalc({ ...goalCalc, current: value })}
                  />

                  <SliderField
                    label="Time Available"
                    value={goalCalc.years}
                    min={1}
                    max={30}
                    step={1}
                    suffix="Years"
                    onChange={(value) => setGoalCalc({ ...goalCalc, years: value })}
                  />

                  <SliderField
                    label="Expected Return"
                    value={goalCalc.returnRate}
                    min={0}
                    max={25}
                    step={0.5}
                    suffix="%"
                    onChange={(value) => setGoalCalc({ ...goalCalc, returnRate: value })}
                  />
                </div>

                <CalculatorResultPanel
                  title="Goal Plan Result"
                  mainLabel="Monthly SIP Required"
                  mainValue={money(goalSIPRequired)}
                  rows={[
                    ["Goal Gap", money(goalGap)],
                    ["Simple Monthly Saving", money(goalMonthlyRequired)],
                    ["Return-adjusted Monthly SIP", money(goalSIPRequired)]
                  ]}
                  chartPrimary={goalCalc.target ? Math.round((goalCalc.current / goalCalc.target) * 100) : 0}
                  chartPrimaryLabel="Saved"
                  chartSecondaryLabel="Remaining"
                />
              </section>
            )}

            {calcType === "card" && (
              <section style={calculatorGrid}>
                <div style={calculatorInputPanel}>
                  <PanelHeader
                    title="Credit Card Payoff Calculator"
                    subtitle="Estimate debt clearance timeline"
                    icon={<CreditCard />}
                  />

                  <SliderField
                    label="Outstanding Amount"
                    value={cardCalc.outstanding}
                    min={1000}
                    max={1000000}
                    step={1000}
                    suffix="INR"
                    onChange={(value) => setCardCalc({ ...cardCalc, outstanding: value })}
                  />

                  <SliderField
                    label="Annual Interest Rate"
                    value={cardCalc.annualRate}
                    min={12}
                    max={60}
                    step={0.5}
                    suffix="%"
                    onChange={(value) => setCardCalc({ ...cardCalc, annualRate: value })}
                  />

                  <SliderField
                    label="Monthly Payment"
                    value={cardCalc.monthlyPayment}
                    min={500}
                    max={200000}
                    step={500}
                    suffix="INR"
                    onChange={(value) => setCardCalc({ ...cardCalc, monthlyPayment: value })}
                  />
                </div>

                <CalculatorResultPanel
                  title="Credit Card Payoff Result"
                  mainLabel="Months to Clear"
                  mainValue={cardMonths.months >= 999 ? "Not possible" : `${cardMonths.months} months`}
                  rows={[
                    ["Outstanding", money(cardCalc.outstanding)],
                    ["Estimated Interest", money(cardMonths.totalInterest)],
                    ["Monthly Payment", money(cardCalc.monthlyPayment)]
                  ]}
                  chartPrimary={
                    cardCalc.outstanding + cardMonths.totalInterest
                      ? Math.round((cardMonths.totalInterest / (cardCalc.outstanding + cardMonths.totalInterest)) * 100)
                      : 0
                  }
                  chartPrimaryLabel="Interest"
                  chartSecondaryLabel="Principal"
                />
              </section>
            )}
          </section>
        )}

        {tab === "spending" && (
          <section style={twoColumnGrid}>
            <div style={panel}>
              <PanelHeader
                title="Bucket Funnel"
                subtitle="Where your money goes first"
                icon={<BarChart3 />}
              />

              {bucketSpend.length === 0 && <EmptyText text="No spending data yet." />}

              {bucketSpend.map(([bucket, amount]) => (
                <BudgetBar
                  key={bucket}
                  label={bucket}
                  value={amount}
                  total={totals.expense}
                  color={bucketColor(bucket)}
                />
              ))}
            </div>

            <div style={panelLarge}>
              <PanelHeader
                title="Category Leakage"
                subtitle="Narrow view by category and subcategory"
                icon={<Activity />}
              />

              {categorySpend.length === 0 && <EmptyText text="No category spending yet." />}

              {categorySpend.map(([category, amount]) => (
                <div key={category} style={dataRow}>
                  <span>{category}</span>
                  <strong>{money(amount)}</strong>
                </div>
              ))}
            </div>
          </section>
        )}

        {tab === "loans" && (
          <section style={twoColumnGrid}>
            <div style={panel}>
              <PanelHeader
                title="Add Loan"
                subtitle="Calculate EMI and debt burden"
                icon={<Landmark />}
              />

              <Field label="Loan Name">
                <input
                  value={loanForm.name}
                  onChange={(e) => setLoanForm({ ...loanForm, name: e.target.value })}
                  placeholder="Personal Loan, Home Loan..."
                  style={inputStyle}
                />
              </Field>

              <Field label="Principal">
                <input
                  value={loanForm.principal}
                  onChange={(e) =>
                    setLoanForm({ ...loanForm, principal: e.target.value })
                  }
                  type="number"
                  style={inputStyle}
                />
              </Field>

              <Field label="Interest Rate % p.a.">
                <input
                  value={loanForm.rate}
                  onChange={(e) => setLoanForm({ ...loanForm, rate: e.target.value })}
                  type="number"
                  style={inputStyle}
                />
              </Field>

              <Field label="Tenure Months">
                <input
                  value={loanForm.months}
                  onChange={(e) =>
                    setLoanForm({ ...loanForm, months: e.target.value })
                  }
                  type="number"
                  style={inputStyle}
                />
              </Field>

              <button onClick={addLoan} style={primaryButton}>
                <Plus size={16} /> Add Loan
              </button>
            </div>

            <div style={panelLarge}>
              <PanelHeader
                title="Loan War Room"
                subtitle="EMI, interest and debt burden"
                icon={<CreditCard />}
              />

              <section style={miniStatsGrid}>
                <MiniStat label="Total EMI" value={money(loanSummary.totalEmi)} />
                <MiniStat label="Debt Burden" value={`${loanSummary.debtBurden}%`} />
              </section>

              {loanSummary.rows.map((loan) => (
                <div key={loan.id} style={dataRow}>
                  <div>
                    <strong>{loan.name}</strong>
                    <p style={mutedText}>
                      EMI {money(loan.monthlyEmi)} • Interest {money(loan.interest)}
                    </p>
                  </div>
                  <button onClick={() => deleteLoan(loan.id)} style={deleteButton}>
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}

              {loanSummary.debtBurden > 35 && (
                <div style={warningBox}>
                  <AlertTriangle size={18} />
                  EMI burden is high. Reduce debt before aggressive investing.
                </div>
              )}
            </div>
          </section>
        )}

        {tab === "goals" && (
          <section style={twoColumnGrid}>
            <div style={panel}>
              <PanelHeader
                title="Add Goal"
                subtitle="Emergency fund, travel, home, retirement"
                icon={<Target />}
              />

              <Field label="Goal Name">
                <input
                  value={goalForm.name}
                  onChange={(e) => setGoalForm({ ...goalForm, name: e.target.value })}
                  placeholder="Emergency Fund, Travel..."
                  style={inputStyle}
                />
              </Field>

              <Field label="Target Amount">
                <input
                  value={goalForm.target}
                  onChange={(e) =>
                    setGoalForm({ ...goalForm, target: e.target.value })
                  }
                  type="number"
                  style={inputStyle}
                />
              </Field>

              <Field label="Already Saved">
                <input
                  value={goalForm.saved}
                  onChange={(e) => setGoalForm({ ...goalForm, saved: e.target.value })}
                  type="number"
                  style={inputStyle}
                />
              </Field>

              <button onClick={addGoal} style={primaryButton}>
                <Plus size={16} /> Add Goal
              </button>
            </div>

            <div style={panelLarge}>
              <PanelHeader
                title="Goal Progress"
                subtitle="Track future financial goals"
                icon={<Target />}
              />

              {goals.map((goal) => {
                const progress = goal.target ? Math.round((goal.saved / goal.target) * 100) : 0;

                return (
                  <div key={goal.id} style={goalCard}>
                    <div style={dataRowNoBorder}>
                      <div>
                        <strong>{goal.name}</strong>
                        <p style={mutedText}>
                          {money(goal.saved)} / {money(goal.target)} • {progress}%
                        </p>
                      </div>

                      <button onClick={() => deleteGoal(goal.id)} style={deleteButton}>
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div style={progressTrack}>
                      <div
                        style={{
                          ...progressFill,
                          width: `${Math.min(progress, 100)}%`,
                          background: "#16a34a"
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {tab === "mutual funds" && (
          <ComingSoon
            icon={<PiggyBank />}
            title="Mutual Fund Intelligence"
            subtitle="Next version: SIP tracker, fund-wise value, goal mapping, risk-o-meter and SEBI-compliant educational advisor mode."
          />
        )}

        {tab === "travel" && (
          <ComingSoon
            icon={<Plane />}
            title="Travel & Forex Planner"
            subtitle="Next version: country-wise travel budget, currency conversion, forex movement impact and trip savings plan."
          />
        )}

        {tab === "bi ml" && (
          <section style={panel}>
            <PanelHeader
              title="Business Intelligence + Machine Learning"
              subtitle="Prediction, anomaly detection and recommendation engine"
              icon={<Brain />}
            />

            <section style={miniStatsGrid}>
              <MiniStat label="Risk Score" value={`${riskScore}/100`} />
              <MiniStat label="Savings Rate" value={`${totals.savingsRate}%`} />
              <MiniStat label="Debt Burden" value={`${loanSummary.debtBurden}%`} />
            </section>

            <div style={warningBoxNeutral}>
              <Brain size={18} />
              Later this module will detect unusual expenses, recurring payments, overspending patterns, and savings opportunities.
            </div>
          </section>
        )}

        {tab === "advisor" && (
          <section style={panel}>
            <PanelHeader
              title="AI CFO Advisor"
              subtitle="Your personal financial decision engine"
              icon={<Sparkles />}
            />

            <div style={advisorLarge}>
              <Brain size={30} />
              <p>{advisorText}</p>
            </div>

            <div style={warningBoxNeutral}>
              <ShieldCheck size={18} />
              Investment advice will remain educational until a compliant advisory structure is added.
            </div>
          </section>
        )}

        <footer style={footerActions}>
          <button onClick={resetDemo} style={secondaryButton}>
            Reset Demo Data
          </button>
          <button onClick={clearAllData} style={dangerButton}>
            Clear All Data
          </button>
        </footer>
      </section>
    </main>
  );
}

function getPageTitle(tab: string) {
  const map: Record<string, string> = {
    dashboard: "Dashboard",
    transactions: "Transactions",
    spending: "Spending Analytics",
    calculators: "Financial Calculators",
    loans: "Loans & Debt",
    goals: "Goals",
    "mutual funds": "Mutual Funds",
    travel: "Travel & Forex",
    "bi ml": "BI & ML",
    advisor: "AI Advisor"
  };

  return map[tab] || "Dashboard";
}

function MetricCard({
  title,
  value,
  subtext,
  icon,
  trend,
  tone
}: {
  title: string;
  value: string;
  subtext: string;
  icon: ReactNode;
  trend: string;
  tone: "green" | "blue" | "red" | "gold";
}) {
  const color =
    tone === "green"
      ? "#16a34a"
      : tone === "blue"
      ? "#2563eb"
      : tone === "red"
      ? "#ef4444"
      : "#f59e0b";

  return (
    <div style={metricCard}>
      <div style={metricTop}>
        <div style={{ ...metricIcon, color }}>{icon}</div>
        <span style={{ ...trendBadge, color, background: `${color}14` }}>{trend}</span>
      </div>
      <p style={metricTitle}>{title}</p>
      <h2 style={metricValue}>{value}</h2>
      <p style={mutedText}>{subtext}</p>
    </div>
  );
}

function PanelHeader({
  title,
  subtitle,
  icon
}: {
  title: string;
  subtitle: string;
  icon: ReactNode;
}) {
  return (
    <div style={panelHeader}>
      <div>
        <h2 style={panelTitle}>{title}</h2>
        <p style={mutedText}>{subtitle}</p>
      </div>
      <div style={panelIcon}>{icon}</div>
    </div>
  );
}

function MiniBarChart({ values }: { values: number[] }) {
  const max = Math.max(...values, 1);

  return (
    <div style={barChartWrap}>
      {values.map((value, index) => (
        <div key={index} style={barColumn}>
          <div
            style={{
              ...bar,
              height: `${Math.max(12, (value / max) * 180)}px`
            }}
          />
          <span style={barLabel}>{index + 1}</span>
        </div>
      ))}
    </div>
  );
}

function BudgetBar({
  label,
  value,
  total,
  color
}: {
  label: string;
  value: number;
  total: number;
  color: string;
}) {
  const percent = total ? Math.round((value / total) * 100) : 0;

  return (
    <div style={budgetItem}>
      <div style={dataRowNoBorder}>
        <strong>{label}</strong>
        <span>
          {money(value)} • {percent}%
        </span>
      </div>
      <div style={progressTrack}>
        <div
          style={{
            ...progressFill,
            width: `${Math.min(percent, 100)}%`,
            background: color
          }}
        />
      </div>
    </div>
  );
}

function TransactionTable({
  transactions,
  onDelete
}: {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}) {
  if (transactions.length === 0) {
    return <EmptyText text="No transactions yet. Add your first entry." />;
  }

  return (
    <div style={tableWrap}>
      {transactions.map((t) => (
        <div key={t.id} style={transactionRow}>
          <div style={transactionAvatar}>
            {t.type === "income" ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          </div>

          <div style={{ flex: 1 }}>
            <strong>{t.merchant}</strong>
            <p style={mutedText}>
              {t.date} • {t.bucket} → {t.category} → {t.subcategory}
            </p>
          </div>

          <div style={{ textAlign: "right" }}>
            <strong style={{ color: t.type === "income" ? "#16a34a" : "#111827" }}>
              {money(t.amount)}
            </strong>
            <br />
            <button onClick={() => onDelete(t.id)} style={deleteButton}>
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function SliderField({
  label,
  value,
  min,
  max,
  step,
  suffix,
  onChange
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  suffix: string;
  onChange: (value: number) => void;
}) {
  return (
    <div style={sliderBlock}>
      <div style={sliderTopRow}>
        <strong>{label}</strong>
        <div style={sliderValueBox}>
          <input
            value={value}
            type="number"
            onChange={(e) => onChange(Number(e.target.value))}
            style={sliderNumberInput}
          />
          <span style={sliderSuffix}>{suffix}</span>
        </div>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={rangeStyle}
      />
    </div>
  );
}

function CalculatorResultPanel({
  title,
  mainLabel,
  mainValue,
  rows,
  chartPrimary,
  chartPrimaryLabel,
  chartSecondaryLabel
}: {
  title: string;
  mainLabel: string;
  mainValue: string;
  rows: [string, string][];
  chartPrimary: number;
  chartPrimaryLabel: string;
  chartSecondaryLabel: string;
}) {
  const primary = Math.min(Math.max(chartPrimary, 0), 100);
  const secondary = 100 - primary;

  return (
    <div style={calculatorResultPanel}>
      <PanelHeader title={title} subtitle="Calculation summary" icon={<BarChart3 />} />

      <div style={donutWrap}>
        <div
          style={{
            ...donut,
            background: `conic-gradient(#3155d4 0% ${primary}%, #e5e7eb ${primary}% 100%)`
          }}
        >
          <div style={donutCenter}>
            <strong>{primary}%</strong>
            <span>{chartPrimaryLabel}</span>
          </div>
        </div>

        <div style={legendWrap}>
          <div style={legendItem}>
            <span style={{ ...legendDot, background: "#3155d4" }} />
            {chartPrimaryLabel}: {primary}%
          </div>
          <div style={legendItem}>
            <span style={{ ...legendDot, background: "#e5e7eb" }} />
            {chartSecondaryLabel}: {secondary}%
          </div>
        </div>
      </div>

      <div style={resultMainBox}>
        <p style={mutedText}>{mainLabel}</p>
        <h2 style={calculatorMainValue}>{mainValue}</h2>
      </div>

      {rows.map(([label, value]) => (
        <div key={label} style={dataRow}>
          <span>{label}</span>
          <strong>{value}</strong>
        </div>
      ))}
    </div>
  );
}

function ActionItem({ label }: { label: string }) {
  return (
    <div style={actionItem}>
      <ShieldCheck size={16} />
      {label}
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div style={miniStat}>
      <p style={mutedText}>{label}</p>
      <h3 style={miniStatValue}>{value}</h3>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label>
      <p style={fieldLabel}>{label}</p>
      {children}
    </label>
  );
}

function EmptyText({ text }: { text: string }) {
  return <p style={emptyText}>{text}</p>;
}

function ComingSoon({
  icon,
  title,
  subtitle
}: {
  icon: ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <section style={comingSoon}>
      <div style={comingIcon}>{icon}</div>
      <h2 style={panelTitle}>{title}</h2>
      <p style={mutedText}>{subtitle}</p>
    </section>
  );
}

function bucketColor(bucket: string) {
  if (bucket === "Needs") return "#2563eb";
  if (bucket === "Wants") return "#ef4444";
  if (bucket === "Wealth") return "#16a34a";
  if (bucket === "Debt") return "#f59e0b";
  return "#64748b";
}

const appShell: CSSProperties = {
  minHeight: "100vh",
  display: "grid",
  gridTemplateColumns: "280px 1fr",
  background: "#eef3f8",
  color: "#0f172a"
};

const sidebar: CSSProperties = {
  background: "linear-gradient(180deg, #111827 0%, #312e81 55%, #5b21b6 100%)",
  color: "white",
  padding: 22,
  position: "sticky",
  top: 0,
  height: "100vh",
  overflowY: "auto"
};

const brandBox: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  marginBottom: 26
};

const brandIcon: CSSProperties = {
  width: 46,
  height: 46,
  borderRadius: 16,
  background: "linear-gradient(135deg, #22c55e, #facc15)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 950,
  fontSize: 24,
  color: "#052e16"
};

const brandTitle: CSSProperties = {
  margin: 0,
  fontSize: 22,
  letterSpacing: "-0.5px"
};

const brandSubtitle: CSSProperties = {
  margin: "4px 0 0",
  fontSize: 12,
  color: "#c4b5fd"
};

const navStyle: CSSProperties = {
  display: "grid",
  gap: 8
};

const navButton: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  border: 0,
  background: "transparent",
  color: "#e5e7eb",
  padding: "12px 14px",
  borderRadius: 14,
  cursor: "pointer",
  textAlign: "left",
  fontWeight: 750
};

const navButtonActive: CSSProperties = {
  ...navButton,
  background: "rgba(255,255,255,0.15)",
  color: "white",
  boxShadow: "inset 3px 0 0 #22c55e"
};

const sidebarFooter: CSSProperties = {
  marginTop: 24,
  padding: 16,
  borderRadius: 20,
  background: "rgba(255,255,255,0.12)",
  border: "1px solid rgba(255,255,255,0.12)"
};

const sidebarFooterLabel: CSSProperties = {
  margin: 0,
  color: "#ddd6fe",
  fontSize: 13
};

const sidebarFooterValue: CSSProperties = {
  margin: "6px 0",
  fontSize: 26,
  fontWeight: 950
};

const healthTrack: CSSProperties = {
  height: 8,
  background: "rgba(255,255,255,0.2)",
  borderRadius: 999,
  overflow: "hidden"
};

const healthFill: CSSProperties = {
  height: "100%",
  background: "#22c55e",
  borderRadius: 999
};

const content: CSSProperties = {
  padding: 26,
  minWidth: 0
};

const topbar: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 18,
  alignItems: "center",
  marginBottom: 22
};

const eyebrow: CSSProperties = {
  margin: 0,
  color: "#64748b",
  fontSize: 12,
  letterSpacing: "1.6px",
  fontWeight: 950
};

const pageTitle: CSSProperties = {
  margin: "4px 0 0",
  fontSize: 34,
  letterSpacing: "-1px"
};

const topbarRight: CSSProperties = {
  display: "flex",
  gap: 10,
  alignItems: "center"
};

const searchBox: CSSProperties = {
  minWidth: 360,
  display: "flex",
  alignItems: "center",
  gap: 8,
  background: "white",
  color: "#94a3b8",
  padding: "12px 14px",
  borderRadius: 16,
  border: "1px solid #e2e8f0",
  boxShadow: "0 8px 25px rgba(15,23,42,0.06)"
};

const searchInput: CSSProperties = {
  border: 0,
  outline: "none",
  width: "100%",
  background: "transparent",
  color: "#0f172a",
  fontSize: 15
};

const iconButton: CSSProperties = {
  width: 46,
  height: 46,
  borderRadius: 16,
  border: "1px solid #e2e8f0",
  background: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer"
};

const searchResultsPanel: CSSProperties = {
  background: "white",
  borderRadius: 26,
  padding: 22,
  border: "1px solid #e2e8f0",
  boxShadow: "0 14px 45px rgba(15,23,42,0.06)",
  marginBottom: 20
};

const searchGrid: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 16
};

const searchSectionTitle: CSSProperties = {
  margin: "0 0 12px",
  fontSize: 18
};

const searchResultRow: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 12,
  alignItems: "center",
  padding: "14px 0",
  borderBottom: "1px solid #e5e7eb"
};

const resultTypeBadge: CSSProperties = {
  display: "inline-block",
  padding: "5px 9px",
  borderRadius: 999,
  background: "#eef2ff",
  color: "#4338ca",
  fontSize: 12,
  fontWeight: 900
};

const sourceCard: CSSProperties = {
  display: "block",
  padding: 14,
  borderRadius: 18,
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
  marginBottom: 12,
  color: "#0f172a",
  textDecoration: "none"
};

const sourceCategoryBadge: CSSProperties = {
  display: "inline-block",
  padding: "5px 9px",
  borderRadius: 999,
  background: "#dcfce7",
  color: "#166534",
  fontSize: 12,
  fontWeight: 900
};

const sourceLinkText: CSSProperties = {
  margin: "8px 0 0",
  color: "#2563eb",
  fontWeight: 900,
  fontSize: 14
};

const antiHallucinationBox: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  marginTop: 16,
  padding: 14,
  borderRadius: 18,
  background: "#fffbeb",
  color: "#92400e",
  border: "1px solid #fde68a",
  fontWeight: 800
};

const heroPanel: CSSProperties = {
  background: "linear-gradient(135deg, #052e2b 0%, #065f46 45%, #10b981 100%)",
  color: "white",
  borderRadius: 28,
  padding: 28,
  display: "flex",
  justifyContent: "space-between",
  gap: 24,
  alignItems: "center",
  marginBottom: 20,
  boxShadow: "0 24px 70px rgba(6, 95, 70, 0.28)"
};

const premiumBadge: CSSProperties = {
  display: "inline-flex",
  gap: 8,
  alignItems: "center",
  padding: "8px 12px",
  borderRadius: 999,
  background: "rgba(255,255,255,0.16)",
  fontSize: 13,
  fontWeight: 900
};

const premiumBadgeDark: CSSProperties = {
  display: "inline-flex",
  gap: 8,
  alignItems: "center",
  padding: "8px 12px",
  borderRadius: 999,
  background: "rgba(15, 23, 42, 0.08)",
  color: "#064e3b",
  fontSize: 13,
  fontWeight: 900
};

const heroTitle: CSSProperties = {
  margin: "16px 0 8px",
  fontSize: 38,
  letterSpacing: "-1px"
};

const heroText: CSSProperties = {
  margin: 0,
  color: "#dcfce7",
  maxWidth: 760,
  lineHeight: 1.5
};

const heroScore: CSSProperties = {
  minWidth: 170,
  padding: 20,
  borderRadius: 24,
  background: "rgba(255,255,255,0.12)",
  border: "1px solid rgba(255,255,255,0.16)",
  textAlign: "center"
};

const heroScoreLabel: CSSProperties = {
  margin: 0,
  fontSize: 13,
  color: "#dcfce7"
};

const heroScoreValue: CSSProperties = {
  margin: "8px 0",
  fontSize: 44,
  fontWeight: 950
};

const statGrid: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 16,
  marginBottom: 18
};

const metricCard: CSSProperties = {
  background: "white",
  borderRadius: 24,
  padding: 20,
  border: "1px solid #e2e8f0",
  boxShadow: "0 14px 45px rgba(15,23,42,0.06)"
};

const metricTop: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center"
};

const metricIcon: CSSProperties = {
  width: 42,
  height: 42,
  borderRadius: 16,
  background: "#f1f5f9",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
};

const trendBadge: CSSProperties = {
  padding: "6px 10px",
  borderRadius: 999,
  fontWeight: 900,
  fontSize: 12
};

const metricTitle: CSSProperties = {
  margin: "16px 0 6px",
  color: "#64748b"
};

const metricValue: CSSProperties = {
  margin: 0,
  fontSize: 30,
  letterSpacing: "-0.8px"
};

const dashboardGrid: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1.45fr 1fr",
  gap: 18,
  marginBottom: 18
};

const twoColumnGrid: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "minmax(320px, 0.85fr) minmax(360px, 1.2fr)",
  gap: 18
};

const panel: CSSProperties = {
  background: "white",
  borderRadius: 26,
  padding: 22,
  border: "1px solid #e2e8f0",
  boxShadow: "0 14px 45px rgba(15,23,42,0.06)"
};

const panelLarge: CSSProperties = {
  ...panel,
  minHeight: 320
};

const panelHeader: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 14,
  alignItems: "flex-start",
  marginBottom: 16
};

const panelTitle: CSSProperties = {
  margin: 0,
  fontSize: 24,
  letterSpacing: "-0.6px"
};

const panelIcon: CSSProperties = {
  width: 42,
  height: 42,
  borderRadius: 16,
  background: "#f1f5f9",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#0f172a"
};

const mutedText: CSSProperties = {
  margin: "4px 0 0",
  color: "#64748b",
  fontSize: 14,
  lineHeight: 1.45
};

const advisorBox: CSSProperties = {
  padding: 16,
  borderRadius: 18,
  background: "#f0fdf4",
  color: "#14532d",
  border: "1px solid #bbf7d0",
  lineHeight: 1.55,
  fontWeight: 650
};

const actionList: CSSProperties = {
  display: "grid",
  gap: 8,
  marginTop: 14
};

const actionItem: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  padding: 12,
  borderRadius: 14,
  background: "#f8fafc",
  color: "#334155",
  fontWeight: 800
};

const barChartWrap: CSSProperties = {
  height: 230,
  display: "flex",
  alignItems: "end",
  gap: 14,
  padding: "20px 8px 0",
  borderRadius: 20,
  background: "linear-gradient(180deg, #f8fafc, white)"
};

const barColumn: CSSProperties = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 8
};

const bar: CSSProperties = {
  width: "100%",
  maxWidth: 42,
  borderRadius: "14px 14px 4px 4px",
  background: "linear-gradient(180deg, #7c3aed, #06b6d4)",
  boxShadow: "0 8px 20px rgba(124,58,237,0.24)"
};

const barLabel: CSSProperties = {
  fontSize: 12,
  color: "#94a3b8"
};

const budgetItem: CSSProperties = {
  marginBottom: 16
};

const progressTrack: CSSProperties = {
  height: 10,
  background: "#e5e7eb",
  borderRadius: 999,
  overflow: "hidden",
  marginTop: 8
};

const progressFill: CSSProperties = {
  height: "100%",
  borderRadius: 999
};

const dataRow: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 12,
  padding: "14px 0",
  borderBottom: "1px solid #e5e7eb",
  alignItems: "center"
};

const dataRowNoBorder: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 12,
  alignItems: "center"
};

const tableWrap: CSSProperties = {
  display: "grid",
  gap: 0
};

const transactionRow: CSSProperties = {
  display: "flex",
  gap: 12,
  alignItems: "center",
  padding: "14px 0",
  borderBottom: "1px solid #e5e7eb"
};

const transactionAvatar: CSSProperties = {
  width: 38,
  height: 38,
  borderRadius: 14,
  background: "#eef2ff",
  color: "#4f46e5",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0
};

const fieldLabel: CSSProperties = {
  margin: "12px 0 6px",
  color: "#475569",
  fontSize: 14,
  fontWeight: 700
};

const inputStyle: CSSProperties = {
  width: "100%",
  padding: "13px 14px",
  borderRadius: "14px",
  border: "1px solid #cbd5e1",
  outline: "none",
  background: "white",
  fontSize: 15
};

const primaryButton: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  border: 0,
  background: "linear-gradient(135deg, #16a34a, #047857)",
  color: "white",
  padding: "13px 18px",
  borderRadius: "16px",
  cursor: "pointer",
  fontWeight: 900,
  marginTop: 14,
  boxShadow: "0 12px 30px rgba(22, 163, 74, 0.25)"
};

const secondaryButton: CSSProperties = {
  border: 0,
  background: "#e5e7eb",
  color: "#111827",
  padding: "12px 16px",
  borderRadius: "14px",
  cursor: "pointer",
  fontWeight: 800
};

const dangerButton: CSSProperties = {
  border: 0,
  background: "#fee2e2",
  color: "#991b1b",
  padding: "12px 16px",
  borderRadius: "14px",
  cursor: "pointer",
  fontWeight: 800
};

const deleteButton: CSSProperties = {
  border: 0,
  background: "#fee2e2",
  color: "#991b1b",
  padding: "8px",
  borderRadius: "10px",
  cursor: "pointer"
};

const warningBox: CSSProperties = {
  marginTop: 16,
  display: "flex",
  gap: 10,
  alignItems: "center",
  padding: 14,
  borderRadius: 16,
  background: "#fef2f2",
  color: "#991b1b",
  fontWeight: 800
};

const warningBoxNeutral: CSSProperties = {
  marginTop: 16,
  display: "flex",
  gap: 10,
  alignItems: "center",
  padding: 14,
  borderRadius: 16,
  background: "#f8fafc",
  color: "#334155",
  fontWeight: 750
};

const miniStatsGrid: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
  gap: 12,
  marginBottom: 16
};

const miniStat: CSSProperties = {
  padding: 16,
  borderRadius: 18,
  background: "#f8fafc",
  border: "1px solid #e2e8f0"
};

const miniStatValue: CSSProperties = {
  margin: "6px 0 0",
  fontSize: 22
};

const goalCard: CSSProperties = {
  padding: 16,
  borderRadius: 18,
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
  marginBottom: 12
};

const emptyText: CSSProperties = {
  color: "#64748b",
  background: "#f8fafc",
  padding: 16,
  borderRadius: 16
};

const advisorLarge: CSSProperties = {
  padding: 22,
  borderRadius: 22,
  background: "linear-gradient(135deg, #020617, #064e3b)",
  color: "white",
  fontSize: 18,
  lineHeight: 1.65,
  display: "grid",
  gap: 12
};

const comingSoon: CSSProperties = {
  ...panel,
  minHeight: 280,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center"
};

const comingIcon: CSSProperties = {
  width: 64,
  height: 64,
  borderRadius: 22,
  background: "#dcfce7",
  color: "#15803d",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: 14
};

const footerActions: CSSProperties = {
  marginTop: 22,
  display: "flex",
  gap: 10,
  flexWrap: "wrap"
};

const calculatorHero: CSSProperties = {
  background:
    "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(220,252,231,0.95))",
  border: "1px solid #d1fae5",
  boxShadow: "0 18px 55px rgba(15,23,42,0.08)",
  borderRadius: 30,
  padding: 26,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 18,
  marginBottom: 18
};

const calculatorHeroTitle: CSSProperties = {
  fontSize: 34,
  margin: "14px 0 8px",
  letterSpacing: "-1px"
};

const calculatorHeroText: CSSProperties = {
  color: "#475569",
  maxWidth: 780,
  lineHeight: 1.5,
  margin: 0
};

const calculatorTabs: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 10,
  marginBottom: 18
};

const calculatorTab: CSSProperties = {
  border: "1px solid #cbd5e1",
  background: "white",
  color: "#0f172a",
  padding: "10px 14px",
  borderRadius: 999,
  cursor: "pointer",
  fontWeight: 850
};

const calculatorTabActive: CSSProperties = {
  ...calculatorTab,
  background: "#3155d4",
  color: "white",
  border: "1px solid #3155d4",
  boxShadow: "0 12px 30px rgba(49,85,212,0.25)"
};

const calculatorGrid: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 0.85fr",
  gap: 18
};

const calculatorInputPanel: CSSProperties = {
  ...panel,
  minHeight: 520
};

const calculatorResultPanel: CSSProperties = {
  ...panel,
  minHeight: 520,
  display: "flex",
  flexDirection: "column"
};

const loanTypeGrid: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: 8,
  marginBottom: 16
};

const loanTypeButton: CSSProperties = {
  border: "1px solid #cbd5e1",
  background: "#f8fafc",
  color: "#0f172a",
  padding: "12px 10px",
  borderRadius: 14,
  cursor: "pointer",
  fontWeight: 850
};

const loanTypeActive: CSSProperties = {
  ...loanTypeButton,
  background: "#3155d4",
  color: "white",
  border: "1px solid #3155d4"
};

const sliderBlock: CSSProperties = {
  padding: 16,
  borderRadius: 20,
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
  marginBottom: 14
};

const sliderTopRow: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 12,
  alignItems: "center",
  marginBottom: 12
};

const sliderValueBox: CSSProperties = {
  display: "flex",
  alignItems: "center",
  border: "1px solid #cbd5e1",
  borderRadius: 12,
  overflow: "hidden",
  background: "white"
};

const sliderNumberInput: CSSProperties = {
  width: 110,
  border: 0,
  outline: "none",
  padding: "9px 10px",
  fontWeight: 800
};

const sliderSuffix: CSSProperties = {
  padding: "9px 10px",
  background: "#3155d4",
  color: "white",
  fontWeight: 900,
  fontSize: 12
};

const rangeStyle: CSSProperties = {
  width: "100%",
  accentColor: "#3155d4"
};

const donutWrap: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 20,
  margin: "8px 0 20px"
};

const donut: CSSProperties = {
  width: 190,
  height: 190,
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
};

const donutCenter: CSSProperties = {
  width: 110,
  height: 110,
  borderRadius: "50%",
  background: "white",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "inset 0 0 0 1px #e5e7eb"
};

const legendWrap: CSSProperties = {
  display: "grid",
  gap: 10
};

const legendItem: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  color: "#475569",
  fontWeight: 800
};

const legendDot: CSSProperties = {
  width: 12,
  height: 12,
  borderRadius: "50%"
};

const resultMainBox: CSSProperties = {
  padding: 18,
  borderRadius: 20,
  background: "linear-gradient(135deg, #eef2ff, #f8fafc)",
  textAlign: "center",
  marginBottom: 10
};

const calculatorMainValue: CSSProperties = {
  margin: "4px 0 0",
  fontSize: 32,
  letterSpacing: "-1px"
};
