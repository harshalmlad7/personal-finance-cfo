"use client";

import { useEffect, useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  Activity,
  AlertTriangle,
  BadgeCheck,
  BarChart3,
  Bell,
  Brain,
  Calculator,
  CreditCard,
  Globe2,
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

type TransactionType = "income" | "expense" | "transfer";

type Transaction = {
  id: string;
  date: string;
  type: TransactionType;
  bucket: string;
  category: string;
  subcategory: string;
  merchant: string;
  amount: number;
  accountFrom: string;
  accountTo: string;
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
  deadline: string;
  monthlyContrib: number;
};

type MutualFund = {
  id: string;
  name: string;
  invested: number;
  current: number;
  sip: number;
  risk: string;
  goal: string;
};

type TravelPlan = {
  id: string;
  destination: string;
  currency: string;
  targetInr: number;
  saved: number;
  travelDate: string;
};

type TabId =
  | "dashboard"
  | "transactions"
  | "categories"
  | "spending"
  | "calculators"
  | "loans"
  | "goals"
  | "mutual-funds"
  | "travel"
  | "insights"
  | "advisor";

const categoryMap: Record<string, Record<string, string[]>> = {
  Needs: {
    Housing: [
      "Rent",
      "Home Loan EMI",
      "Society Maintenance",
      "House Repair",
      "Furniture",
      "Appliances",
      "House Help",
      "Pest Control",
      "Cleaning Supplies",
      "Property Tax",
      "Brokerage",
      "Other Housing"
    ],
    Utilities: [
      "Electricity",
      "Water",
      "Gas Cylinder",
      "Piped Gas",
      "Broadband",
      "Mobile Postpaid",
      "DTH",
      "Home Security",
      "Waste Collection",
      "Other Utilities"
    ],
    Groceries: [
      "Monthly Groceries",
      "Vegetables",
      "Fruits",
      "Milk & Dairy",
      "Eggs",
      "Meat & Fish",
      "Bakery",
      "Packaged Food",
      "Household Essentials",
      "Quick Commerce",
      "Other Groceries"
    ],
    Transportation: [
      "Metro",
      "Train",
      "Bus",
      "Auto",
      "Taxi / Cab",
      "Bike Taxi",
      "Office Commute",
      "Airport Transfer",
      "Intercity Travel",
      "Public Transport Pass",
      "Other Transport"
    ],
    Vehicle: [
      "Fuel",
      "Parking",
      "Toll",
      "Car Wash",
      "Vehicle Insurance",
      "Vehicle Maintenance",
      "Vehicle Repair",
      "Tyres",
      "Battery",
      "PUC",
      "Fines / Challans",
      "Vehicle EMI",
      "Roadside Assistance",
      "Other Vehicle"
    ],
    Healthcare: [
      "Doctor Consultation",
      "Medicines",
      "Lab Tests",
      "Dental",
      "Eye Care",
      "Therapy",
      "Hospital",
      "Health Insurance",
      "Medical Devices",
      "Fitness Recovery",
      "Other Healthcare"
    ],
    Insurance: [
      "Health Insurance",
      "Life Insurance",
      "Term Insurance",
      "Vehicle Insurance",
      "Travel Insurance",
      "Home Insurance",
      "Personal Accident Insurance",
      "Critical Illness Cover",
      "Other Insurance"
    ],
    Family: [
      "Parents Support",
      "Sibling Support",
      "Children Expenses",
      "School Fees",
      "Tuition Fees",
      "Family Medical",
      "Family Travel",
      "Family Gifts",
      "Other Family"
    ],
    Education: [
      "Course Fees",
      "Online Learning",
      "Books",
      "Certifications",
      "Coaching",
      "Exam Fees",
      "Workshops",
      "Software Learning",
      "Other Education"
    ],
    Taxes: [
      "Income Tax",
      "Advance Tax",
      "Property Tax",
      "Professional Tax",
      "GST Payment",
      "Tax Consultant",
      "Penalty / Interest",
      "Other Taxes"
    ],
    Legal: [
      "Legal Consultation",
      "Documentation",
      "Notary",
      "Agreement Registration",
      "Lawyer Fees",
      "Court Fees",
      "Other Legal"
    ]
  },
  Wants: {
    "Food & Drinks": [
      "Restaurants",
      "Online Food Delivery",
      "Cafes",
      "Tea / Coffee",
      "Office Lunch",
      "Snacks",
      "Street Food",
      "Fine Dining",
      "Pubs / Bars",
      "Alcohol",
      "Desserts",
      "Weekend Food",
      "Other Food"
    ],
    Shopping: [
      "Clothing",
      "Footwear",
      "Accessories",
      "Bags",
      "Watches",
      "Electronics",
      "Mobile Phone",
      "Gadgets",
      "Home Decor",
      "Online Shopping",
      "Impulse Purchases",
      "Luxury Shopping",
      "Other Shopping"
    ],
    Entertainment: [
      "Movies",
      "OTT Subscriptions",
      "Music Subscriptions",
      "Gaming",
      "Events",
      "Concerts",
      "Sports Events",
      "Clubbing",
      "Theme Parks",
      "Weekend Outing",
      "Other Entertainment"
    ],
    Lifestyle: [
      "Salon",
      "Spa",
      "Gym",
      "Fitness Classes",
      "Sports",
      "Hobbies",
      "Dating",
      "Socializing",
      "Pets",
      "Photography",
      "Other Lifestyle"
    ],
    "Personal Care": [
      "Skincare",
      "Haircare",
      "Cosmetics",
      "Perfume",
      "Grooming",
      "Personal Hygiene",
      "Supplements",
      "Wellness Products",
      "Other Personal Care"
    ],
    Travel: [
      "Flights",
      "Hotels",
      "Visa",
      "Travel Insurance",
      "Local Transport",
      "Food During Travel",
      "Sightseeing",
      "Shopping During Travel",
      "Forex",
      "Travel Gear",
      "Weekend Trip",
      "International Trip",
      "Other Travel"
    ],
    Gifts: [
      "Birthday Gifts",
      "Wedding Gifts",
      "Festival Gifts",
      "Anniversary Gifts",
      "Office Gifts",
      "Family Gifts",
      "Charity Gifts",
      "Other Gifts"
    ],
    Subscriptions: [
      "Netflix",
      "Amazon Prime",
      "Hotstar",
      "Spotify",
      "YouTube Premium",
      "Cloud Storage",
      "App Subscriptions",
      "News Subscriptions",
      "Software Subscriptions",
      "Other Subscriptions"
    ],
    Donations: [
      "Charity",
      "Religious Donation",
      "NGO",
      "Crowdfunding",
      "Tips",
      "Community Support",
      "Other Donations"
    ],
    Luxury: [
      "Luxury Clothing",
      "Luxury Watches",
      "Premium Gadgets",
      "Designer Items",
      "Premium Dining",
      "Luxury Travel",
      "Other Luxury"
    ]
  },
  Wealth: {
    Investments: [
      "SIP",
      "Mutual Funds",
      "Stocks",
      "ETF",
      "Gold",
      "Sovereign Gold Bond",
      "Fixed Deposit",
      "Recurring Deposit",
      "PPF",
      "NPS",
      "EPF",
      "Bonds",
      "REIT",
      "Crypto",
      "Other Investments"
    ],
    Savings: [
      "Emergency Fund",
      "Travel Fund",
      "Home Fund",
      "Vehicle Fund",
      "Marriage Fund",
      "Education Fund",
      "Medical Fund",
      "Retirement Fund",
      "Short-Term Savings",
      "Other Savings"
    ],
    Assets: [
      "Real Estate",
      "Gold Jewellery",
      "Digital Gold",
      "Vehicle Asset",
      "Business Asset",
      "Collectibles",
      "Other Assets"
    ],
    Retirement: [
      "Retirement SIP",
      "NPS Contribution",
      "PPF Contribution",
      "EPF Voluntary Contribution",
      "Pension Plan",
      "Annuity",
      "Other Retirement"
    ],
    "Tax Saving": [
      "ELSS",
      "PPF",
      "NPS",
      "Life Insurance 80C",
      "Health Insurance 80D",
      "Home Loan Principal",
      "Home Loan Interest",
      "Other Tax Saving"
    ],
    "Goal Funding": [
      "Emergency Goal",
      "Travel Goal",
      "Home Goal",
      "Car Goal",
      "Education Goal",
      "Retirement Goal",
      "Other Goal Funding"
    ]
  },
  Debt: {
    Loans: [
      "Home Loan EMI",
      "Personal Loan EMI",
      "Vehicle Loan EMI",
      "Education Loan EMI",
      "Gold Loan EMI",
      "Consumer Durable Loan",
      "Business Loan EMI",
      "Loan Processing Fee",
      "Loan Prepayment",
      "Loan Foreclosure",
      "Other Loan"
    ],
    Credit: [
      "Credit Card Payment",
      "Credit Card Interest",
      "Credit Card Late Fee",
      "Minimum Due Payment",
      "BNPL Payment",
      "Overdraft Interest",
      "Cash Advance Fee",
      "Other Credit"
    ],
    Borrowing: [
      "Borrowed From Friend",
      "Borrowed From Family",
      "Repaid Friend",
      "Repaid Family",
      "Informal Loan",
      "Other Borrowing"
    ],
    Charges: [
      "Bank Charges",
      "ATM Charges",
      "Card Annual Fee",
      "Processing Fee",
      "Penalty",
      "Late Payment Fee",
      "Bounce Charges",
      "Other Charges"
    ]
  },
  Income: {
    Salary: [
      "Monthly Salary",
      "Bonus",
      "Incentive",
      "Overtime",
      "Arrears",
      "Reimbursement",
      "Leave Encashment",
      "Gratuity",
      "Other Salary Income"
    ],
    Business: [
      "Business Revenue",
      "Client Payment",
      "Consulting Income",
      "Freelance Income",
      "Commission",
      "Affiliate Income",
      "Other Business Income"
    ],
    Investments: [
      "Dividend",
      "Interest",
      "Capital Gains",
      "Mutual Fund Redemption",
      "Stock Sale",
      "FD Interest",
      "RD Interest",
      "Bond Interest",
      "Other Investment Income"
    ],
    Refunds: [
      "Tax Refund",
      "Shopping Refund",
      "Travel Refund",
      "Cashback",
      "Wallet Refund",
      "Insurance Claim",
      "Reimbursement",
      "Other Refund"
    ],
    "Other Income": [
      "Gift Received",
      "Rent Received",
      "Prize",
      "Side Hustle",
      "Sale of Asset",
      "Other Income"
    ]
  },
  Transfers: {
    "Own Accounts": [
      "Bank to Bank Transfer",
      "Bank to Wallet Transfer",
      "Wallet to Bank Transfer",
      "Cash Withdrawal",
      "Cash Deposit",
      "Credit Card Payment",
      "Investment Transfer",
      "Brokerage Transfer",
      "Other Own Transfer"
    ],
    Family: [
      "Parents Support",
      "Sent to Mother",
      "Sent to Father",
      "Sent to Sibling",
      "Sent to Spouse",
      "Family Emergency",
      "Family Gift",
      "Other Family Transfer"
    ],
    Friends: [
      "Split Bill",
      "Lent to Friend",
      "Repaid Friend",
      "Received from Friend",
      "Group Expense",
      "Other Friend Transfer"
    ]
  },
  Others: {
    Uncategorized: [
      "Unknown Expense",
      "Cash Adjustment",
      "Balance Correction",
      "Split Expense",
      "Reimbursement Pending",
      "Mistake Entry",
      "Other Miscellaneous"
    ],
    Work: [
      "Office Expense",
      "Work Travel",
      "Client Meeting",
      "Work Meals",
      "Work Software",
      "Work Reimbursement",
      "Other Work"
    ]
  }
};

const sampleTransactions: Transaction[] = [
  {
    id: "1",
    date: "2026-05-01",
    type: "income",
    bucket: "Income",
    category: "Salary",
    subcategory: "Monthly Salary",
    merchant: "Company",
    amount: 75000,
    accountFrom: "Company",
    accountTo: "HDFC Bank",
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
    accountFrom: "HDFC Bank",
    accountTo: "Landlord",
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
    accountFrom: "UPI",
    accountTo: "Swiggy",
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
    accountFrom: "HDFC Bank",
    accountTo: "AMC",
    note: "Monthly SIP"
  },
  {
    id: "5",
    date: "2026-05-05",
    type: "transfer",
    bucket: "Transfers",
    category: "Family",
    subcategory: "Parents Support",
    merchant: "Parents",
    amount: 5000,
    accountFrom: "HDFC Bank",
    accountTo: "Parents",
    note: "Monthly family support"
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
    saved: 60000,
    deadline: "2026-12-31",
    monthlyContrib: 15000
  },
  {
    id: "g2",
    name: "Japan Travel",
    target: 250000,
    saved: 62000,
    deadline: "2026-10-01",
    monthlyContrib: 10000
  }
];

const sampleFunds: MutualFund[] = [
  {
    id: "mf1",
    name: "Nifty 50 Index Fund",
    invested: 80000,
    current: 91500,
    sip: 5000,
    risk: "High",
    goal: "Retirement"
  },
  {
    id: "mf2",
    name: "Flexi Cap Fund",
    invested: 60000,
    current: 64200,
    sip: 5000,
    risk: "Very High",
    goal: "Wealth Creation"
  }
];

const sampleTravel: TravelPlan[] = [
  {
    id: "tr1",
    destination: "Japan",
    currency: "JPY",
    targetInr: 250000,
    saved: 62000,
    travelDate: "2026-10-01"
  }
];

const trustedSources = [
  {
    title: "SEBI Investor Portal - Mutual Fund Risk-o-meter",
    category: "Regulation",
    keywords: ["sebi", "riskometer", "risk-o-meter", "mutual fund risk", "mutual funds", "investment risk"],
    description: "Official SEBI investor education page explaining mutual fund Risk-o-meter and risk levels.",
    url: "https://investor.sebi.gov.in/riskometer.html",
    priority: 95
  },
  {
    title: "RBI Account Aggregator Master Direction",
    category: "Regulation",
    keywords: ["rbi", "account aggregator", "aa framework", "bank sync", "consent", "financial data sharing"],
    description: "Official RBI Master Direction for NBFC Account Aggregator framework and consent-based data sharing.",
    url: "https://www.rbi.org.in/Scripts/NotificationUser.aspx?Id=10598",
    priority: 95
  },
  {
    title: "AMFI Latest NAV Download",
    category: "Mutual Funds",
    keywords: ["amfi", "nav", "latest nav", "mutual fund nav", "sip", "fund value"],
    description: "Official AMFI page for latest and historical mutual fund NAV data.",
    url: "https://www.amfiindia.com/net-asset-value/nav-download",
    priority: 92
  },
  {
    title: "World Bank Indicators API",
    category: "World Data",
    keywords: ["world bank", "global data", "inflation", "gdp", "country data", "economic indicators"],
    description: "Official World Bank documentation for global development and economic indicators.",
    url: "https://datahelpdesk.worldbank.org/knowledgebase/articles/889392-about-the-indicators-api-documentation",
    priority: 90
  },
  {
    title: "Reserve Bank of India",
    category: "Regulation",
    keywords: ["rbi", "reserve bank", "monetary policy", "banking", "india"],
    description: "Official RBI website for banking, regulation, monetary policy and notifications.",
    url: "https://www.rbi.org.in/",
    priority: 94
  },
  {
    title: "SEBI Official Website",
    category: "Regulation",
    keywords: ["sebi", "securities", "investment advisor", "mutual fund", "regulation"],
    description: "Official SEBI website for securities market regulations, investor protection and circulars.",
    url: "https://www.sebi.gov.in/",
    priority: 94
  }
];

const navItems: { id: TabId; label: string; icon: ReactNode }[] = [
  { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
  { id: "transactions", label: "Transactions", icon: <ReceiptText size={18} /> },
  { id: "categories", label: "Categories", icon: <BarChart3 size={18} /> },
  { id: "spending", label: "Spending", icon: <LineChart size={18} /> },
  { id: "calculators", label: "Calculators", icon: <Calculator size={18} /> },
  { id: "loans", label: "Loans", icon: <Landmark size={18} /> },
  { id: "goals", label: "Goals", icon: <Target size={18} /> },
  { id: "mutual-funds", label: "Mutual Funds", icon: <PiggyBank size={18} /> },
  { id: "travel", label: "Travel & Forex", icon: <Plane size={18} /> },
  { id: "insights", label: "Insights Engine", icon: <Brain size={18} /> },
  { id: "advisor", label: "AI Advisor", icon: <Sparkles size={18} /> }
];

function money(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(Number.isFinite(value) ? value : 0);
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
  if (!principal || !years) return 0;
  return principal * Math.pow(1 + annualReturn / 100, years);
}

function fdMaturity(principal: number, annualRate: number, years: number) {
  if (!principal || !years) return 0;
  const quarterlyRate = annualRate / 4 / 100;
  const periods = 4 * years;
  return principal * Math.pow(1 + quarterlyRate, periods);
}

function rdMaturity(monthlyDeposit: number, annualRate: number, years: number) {
  if (!monthlyDeposit || !years) return 0;
  if (!annualRate) return monthlyDeposit * years * 12;
  const r = annualRate / 4 / 100;
  const n = years * 4;
  const numerator = monthlyDeposit * (Math.pow(1 + r, n) - 1);
  const denominator = 1 - Math.pow(1 + r, -1 / 3);
  return numerator / denominator;
}

function normalizeSearch(text: string) {
  return String(text).toLowerCase().trim();
}

function scoreText(query: string, text: string) {
  const q = normalizeSearch(query);
  const t = normalizeSearch(text);
  if (!q || !t) return 0;

  const words = q.split(/\s+/).filter(Boolean);
  let score = 0;

  if (t === q) score += 200;
  if (t.startsWith(q)) score += 120;
  if (t.includes(q)) score += 80;

  words.forEach((word) => {
    if (t.includes(word)) score += 20;
  });

  return score;
}

function monthDifference(deadline: string) {
  if (!deadline) return null;
  const diff = new Date(deadline).getTime() - Date.now();
  return Math.max(0, Math.round(diff / (1000 * 60 * 60 * 24 * 30)));
}

export default function Home() {
  const [tab, setTab] = useState<TabId>("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [formError, setFormError] = useState("");
  const [storageWarning, setStorageWarning] = useState("");
  const [confirmModal, setConfirmModal] = useState<{ message: string; onConfirm: () => void } | null>(null);

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [funds, setFunds] = useState<MutualFund[]>([]);
  const [travelPlans, setTravelPlans] = useState<TravelPlan[]>([]);

  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    type: "expense" as TransactionType,
    bucket: "Wants",
    category: "Food & Drinks",
    subcategory: "Online Food Delivery",
    merchant: "",
    amount: "",
    accountFrom: "HDFC Bank",
    accountTo: "",
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
    saved: "",
    deadline: "",
    monthlyContrib: ""
  });

  const [fundForm, setFundForm] = useState({
    name: "",
    invested: "",
    current: "",
    sip: "",
    risk: "High",
    goal: ""
  });

  const [travelForm, setTravelForm] = useState({
    destination: "",
    currency: "USD",
    targetInr: "",
    saved: "",
    travelDate: ""
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
    const savedTransactions = localStorage.getItem("pfc_v5_transactions");
    const savedLoans = localStorage.getItem("pfc_v5_loans");
    const savedGoals = localStorage.getItem("pfc_v5_goals");
    const savedFunds = localStorage.getItem("pfc_v5_funds");
    const savedTravel = localStorage.getItem("pfc_v5_travel");

    setTransactions(savedTransactions ? JSON.parse(savedTransactions) : sampleTransactions);
    setLoans(savedLoans ? JSON.parse(savedLoans) : sampleLoans);
    setGoals(savedGoals ? JSON.parse(savedGoals) : sampleGoals);
    setFunds(savedFunds ? JSON.parse(savedFunds) : sampleFunds);
    setTravelPlans(savedTravel ? JSON.parse(savedTravel) : sampleTravel);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("pfc_v5_transactions", JSON.stringify(transactions));
    } catch {
      setStorageWarning("Storage full. Transactions may not be saved. Export data soon.");
    }
  }, [transactions]);

  useEffect(() => {
    try {
      localStorage.setItem("pfc_v5_loans", JSON.stringify(loans));
    } catch {
      setStorageWarning("Storage full. Loan data may not be saved.");
    }
  }, [loans]);

  useEffect(() => {
    try {
      localStorage.setItem("pfc_v5_goals", JSON.stringify(goals));
    } catch {
      setStorageWarning("Storage full. Goal data may not be saved.");
    }
  }, [goals]);

  useEffect(() => {
    try {
      localStorage.setItem("pfc_v5_funds", JSON.stringify(funds));
    } catch {
      setStorageWarning("Storage full. Mutual fund data may not be saved.");
    }
  }, [funds]);

  useEffect(() => {
    try {
      localStorage.setItem("pfc_v5_travel", JSON.stringify(travelPlans));
    } catch {
      setStorageWarning("Storage full. Travel data may not be saved.");
    }
  }, [travelPlans]);

  const categories = Object.keys(categoryMap[form.bucket] || {});
  const subcategories = categoryMap[form.bucket]?.[form.category] || [];

  const totals = useMemo(() => {
    const income = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const expense = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const transfers = transactions
      .filter((t) => t.type === "transfer")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const savings = income - expense;
    const savingsRate = income ? Math.round((savings / income) * 100) : 0;

    return { income, expense, transfers, savings, savingsRate };
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

  const merchantSpend = useMemo(() => {
    const map: Record<string, number> = {};
    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        map[t.merchant] = (map[t.merchant] || 0) + Number(t.amount);
      });

    return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 8);
  }, [transactions]);

  const dailyBars = useMemo(() => {
    const expenses = transactions.filter((t) => t.type === "expense");
    const dateMap: Record<string, number> = {};

    expenses.forEach((t) => {
      dateMap[t.date] = (dateMap[t.date] || 0) + Number(t.amount);
    });

    const days: number[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      days.push(dateMap[key] || 0);
    }

    const hasAny = days.some((v) => v > 0);
    if (!hasAny) {
      return [10, 20, 12, 30, 18, 24, 14, 22, 8, 35, 15, 28, 10, 18, 40, 12, 25, 30, 8, 20, 16, 32, 14, 26, 20, 18, 24, 30, 12, 22];
    }

    return days;
  }, [transactions]);

  const categoryStats = useMemo(() => {
    return Object.entries(categoryMap).map(([bucket, categoriesObj]) => {
      const categoryCount = Object.keys(categoriesObj).length;
      const subcategoryCount = Object.values(categoriesObj).reduce((sum, subs) => sum + subs.length, 0);
      return { bucket, categoryCount, subcategoryCount };
    });
  }, []);

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

  const fundSummary = useMemo(() => {
    const invested = funds.reduce((sum, fund) => sum + fund.invested, 0);
    const current = funds.reduce((sum, fund) => sum + fund.current, 0);
    const sip = funds.reduce((sum, fund) => sum + fund.sip, 0);
    const gain = current - invested;
    const gainPercent = invested ? Math.round((gain / invested) * 100) : 0;
    return { invested, current, sip, gain, gainPercent };
  }, [funds]);

  const travelSummary = useMemo(() => {
    const target = travelPlans.reduce((sum, plan) => sum + plan.targetInr, 0);
    const saved = travelPlans.reduce((sum, plan) => sum + plan.saved, 0);
    const gap = target - saved;
    const progress = target ? Math.round((saved / target) * 100) : 0;
    return { target, saved, gap, progress };
  }, [travelPlans]);

  const wantsSpend = bucketSpend.find(([name]) => name === "Wants")?.[1] || 0;
  const needsSpend = bucketSpend.find(([name]) => name === "Needs")?.[1] || 0;
  const wealthSpend = bucketSpend.find(([name]) => name === "Wealth")?.[1] || 0;
  const debtSpend = bucketSpend.find(([name]) => name === "Debt")?.[1] || 0;

  const riskScore = useMemo(() => {
    let score = 25;
    if (totals.savingsRate < 20) score += 20;
    if (loanSummary.debtBurden > 35) score += 25;
    if (wantsSpend > totals.income * 0.3) score += 15;
    if (totals.expense > totals.income) score += 20;
    return Math.min(score, 100);
  }, [totals, loanSummary.debtBurden, wantsSpend]);

  const gamification = useMemo(() => {
    const health = Math.max(0, 100 - riskScore);
    const saverBadge = totals.savingsRate >= 30 ? "Elite Saver" : totals.savingsRate >= 20 ? "Saver" : "Needs Discipline";
    const debtBadge = loanSummary.debtBurden <= 20 ? "Debt Safe" : loanSummary.debtBurden <= 35 ? "Debt Watch" : "Debt Danger";
    const spendBadge = wantsSpend <= totals.income * 0.2 ? "Spend Controller" : "Lifestyle Watch";
    return { health, saverBadge, debtBadge, spendBadge };
  }, [riskScore, totals.savingsRate, totals.income, loanSummary.debtBurden, wantsSpend]);

  const advisorText = useMemo(() => {
    if (totals.income === 0) {
      return "Add your income first. Without income data, the advisor cannot judge savings, debt, or investment capacity.";
    }

    if (loanSummary.debtBurden > 35) {
      return "Your EMI burden is high. Focus on reducing expensive loans before increasing risky investments.";
    }

    if (totals.expense > totals.income) {
      return "You are spending more than your income. Freeze wants, review subscriptions, and protect essentials first.";
    }

    if (totals.savingsRate < 20) {
      return "Your savings rate is low. Reduce wants like food delivery, shopping, and entertainment first.";
    }

    if (wantsSpend > totals.income * 0.3) {
      return "Lifestyle spending is high. Cap wants and move surplus toward emergency fund or SIP.";
    }

    return "You are in a decent position. Keep emergency fund priority high, continue SIPs, and avoid lifestyle inflation.";
  }, [totals.income, totals.expense, totals.savingsRate, loanSummary.debtBurden, wantsSpend]);

  const notifications = useMemo(() => {
    const list: { title: string; message: string; tone: "green" | "amber" | "red" | "blue" }[] = [];

    if (storageWarning) {
      list.push({ title: "Storage warning", message: storageWarning, tone: "red" });
    }

    if (totals.income === 0) {
      list.push({ title: "Income missing", message: "Add income to unlock accurate savings, risk and advisor logic.", tone: "amber" });
    }

    if (totals.savingsRate < 20 && totals.income > 0) {
      list.push({ title: "Low savings rate", message: `Savings rate is ${totals.savingsRate}%. Target at least 20%.`, tone: "red" });
    }

    if (loanSummary.debtBurden > 35) {
      list.push({ title: "High EMI burden", message: `EMI burden is ${loanSummary.debtBurden}% of income. Consider prepayment strategy.`, tone: "red" });
    }

    if (wantsSpend > totals.income * 0.3 && totals.income > 0) {
      list.push({ title: "Lifestyle leakage", message: "Wants spending is above 30% of income.", tone: "amber" });
    }

    goals.forEach((goal) => {
      const remaining = Math.max(goal.target - goal.saved, 0);
      const deadlineMonths = monthDifference(goal.deadline);
      const requiredMonthly = deadlineMonths && deadlineMonths > 0 ? Math.ceil(remaining / deadlineMonths) : null;

      if (requiredMonthly && goal.monthlyContrib < requiredMonthly) {
        list.push({
          title: `${goal.name} behind schedule`,
          message: `Need ${money(requiredMonthly)}/month, planned ${money(goal.monthlyContrib)}/month.`,
          tone: "amber"
        });
      }
    });

    if (list.length === 0) {
      list.push({ title: "All good", message: "No critical alerts. Keep tracking daily.", tone: "green" });
    }

    return list;
  }, [storageWarning, totals, loanSummary.debtBurden, wantsSpend, goals]);

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
          transaction.accountFrom,
          transaction.accountTo,
          transaction.note
        ].join(" ");

        return {
          type: "Transaction",
          title: transaction.merchant,
          subtitle: `${transaction.date} • ${transaction.type.toUpperCase()} • ${transaction.bucket} → ${transaction.category} → ${transaction.subcategory}`,
          amount: money(transaction.amount),
          score: scoreText(query, searchableText)
        };
      })
      .filter((item) => item.score > 0);

    const categoryResults = Object.entries(categoryMap).flatMap(([bucket, categoriesObj]) =>
      Object.entries(categoriesObj).flatMap(([category, subcategoriesList]) => {
        const text = [bucket, category, subcategoriesList.join(" ")].join(" ");
        const score = scoreText(query, text);

        if (score <= 0) return [];

        return [
          {
            type: "Category",
            title: `${bucket} → ${category}`,
            subtitle: `${subcategoriesList.length} subcategories: ${subcategoriesList.slice(0, 6).join(", ")}${subcategoriesList.length > 6 ? "..." : ""}`,
            amount: `${subcategoriesList.length} items`,
            score
          }
        ];
      })
    );

    const loanResults = loans
      .map((loan) => {
        const monthlyEmi = emi(loan.principal, loan.rate, loan.months);
        const text = [loan.name, loan.principal, loan.rate, loan.months, "loan emi debt calculator"].join(" ");

        return {
          type: "Loan",
          title: loan.name,
          subtitle: `Principal ${money(loan.principal)} • EMI ${money(monthlyEmi)} • Rate ${loan.rate}%`,
          amount: money(monthlyEmi),
          score: scoreText(query, text)
        };
      })
      .filter((item) => item.score > 0);

    const goalResults = goals
      .map((goal) => {
        const text = [goal.name, goal.target, goal.saved, goal.deadline, "goal saving target deadline"].join(" ");

        return {
          type: "Goal",
          title: goal.name,
          subtitle: `Saved ${money(goal.saved)} of ${money(goal.target)} • deadline ${goal.deadline || "not set"}`,
          amount: `${goal.target ? Math.round((goal.saved / goal.target) * 100) : 0}%`,
          score: scoreText(query, text)
        };
      })
      .filter((item) => item.score > 0);

    const fundResults = funds
      .map((fund) => {
        const text = [fund.name, fund.risk, fund.goal, "mutual fund sip nav risk investment"].join(" ");

        return {
          type: "Mutual Fund",
          title: fund.name,
          subtitle: `Invested ${money(fund.invested)} • Current ${money(fund.current)} • Risk ${fund.risk}`,
          amount: money(fund.current - fund.invested),
          score: scoreText(query, text)
        };
      })
      .filter((item) => item.score > 0);

    const travelResults = travelPlans
      .map((plan) => {
        const text = [plan.destination, plan.currency, plan.travelDate, "travel forex currency trip"].join(" ");

        return {
          type: "Travel",
          title: plan.destination,
          subtitle: `${plan.currency} • saved ${money(plan.saved)} of ${money(plan.targetInr)}`,
          amount: `${plan.targetInr ? Math.round((plan.saved / plan.targetInr) * 100) : 0}%`,
          score: scoreText(query, text)
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
        score: scoreText(query, "fd rd fixed deposit recurring deposit calculator maturity")
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
        const searchableText = [source.title, source.category, source.description, source.keywords.join(" ")].join(" ");
        const textScore = scoreText(query, searchableText);
        return { ...source, score: textScore + source.priority, textScore };
      })
      .filter((source) => source.textScore > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);

    const internal = [
      ...calculatorResults,
      ...categoryResults,
      ...transactionResults,
      ...loanResults,
      ...goalResults,
      ...fundResults,
      ...travelResults
    ]
      .sort((a, b) => b.score - a.score)
      .slice(0, 18);

    return {
      internal,
      sources: sourceResults,
      hasQuery: true
    };
  }, [searchQuery, transactions, loans, goals, funds, travelPlans]);

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

  const cardMonths = useMemo(() => {
    const monthlyRate = cardCalc.annualRate / 12 / 100;
    const firstMonthInterest = cardCalc.outstanding * monthlyRate;

    if (cardCalc.monthlyPayment <= firstMonthInterest) {
      return { months: 999, totalInterest: Infinity };
    }

    let balance = cardCalc.outstanding;
    let months = 0;
    let totalInterest = 0;

    while (balance > 0 && months < 600) {
      const interest = balance * monthlyRate;
      totalInterest += interest;
      balance = balance + interest - cardCalc.monthlyPayment;
      months += 1;
    }

    return { months, totalInterest };
  }, [cardCalc]);

  function setType(type: TransactionType) {
    const nextBucket = type === "income" ? "Income" : type === "transfer" ? "Transfers" : "Wants";
    const nextCategory = Object.keys(categoryMap[nextBucket])[0];
    const nextSubcategory = categoryMap[nextBucket][nextCategory][0];

    setForm({
      ...form,
      type,
      bucket: nextBucket,
      category: nextCategory,
      subcategory: nextSubcategory
    });
  }

  function addTransaction() {
    const amount = Number(form.amount);

    if (!amount || amount <= 0) {
      setFormError("Please enter a valid amount greater than zero.");
      return;
    }

    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      date: form.date,
      type: form.type,
      bucket: form.bucket,
      category: form.category,
      subcategory: form.subcategory,
      merchant: form.merchant || (form.type === "transfer" ? form.accountTo || "Transfer" : "Unknown"),
      amount,
      accountFrom: form.accountFrom,
      accountTo: form.accountTo,
      note: form.note
    };

    setTransactions([newTransaction, ...transactions]);
    setForm({ ...form, merchant: "", amount: "", accountTo: "", note: "" });
    setFormError("");
  }

  function deleteTransaction(id: string) {
    setConfirmModal({
      message: "Delete this transaction? This cannot be undone.",
      onConfirm: () => setTransactions((prev) => prev.filter((x) => x.id !== id))
    });
  }

  function addLoan() {
    const principal = Number(loanForm.principal);
    const rate = Number(loanForm.rate);
    const months = Number(loanForm.months);

    if (!loanForm.name || !principal || !months) {
      setFormError("Please enter loan name, principal amount, and tenure months.");
      return;
    }

    setLoans([{ id: crypto.randomUUID(), name: loanForm.name, principal, rate, months }, ...loans]);
    setLoanForm({ name: "", principal: "", rate: "", months: "" });
    setFormError("");
  }

  function deleteLoan(id: string) {
    setConfirmModal({
      message: "Delete this loan? This cannot be undone.",
      onConfirm: () => setLoans((prev) => prev.filter((x) => x.id !== id))
    });
  }

  function addGoal() {
    const target = Number(goalForm.target);
    const saved = Number(goalForm.saved);
    const monthlyContrib = Number(goalForm.monthlyContrib) || 0;

    if (!goalForm.name || !target) {
      setFormError("Please enter a goal name and target amount.");
      return;
    }

    setGoals([
      {
        id: crypto.randomUUID(),
        name: goalForm.name,
        target,
        saved,
        deadline: goalForm.deadline,
        monthlyContrib
      },
      ...goals
    ]);

    setGoalForm({ name: "", target: "", saved: "", deadline: "", monthlyContrib: "" });
    setFormError("");
  }

  function deleteGoal(id: string) {
    setConfirmModal({
      message: "Delete this goal? This cannot be undone.",
      onConfirm: () => setGoals((prev) => prev.filter((x) => x.id !== id))
    });
  }

  function addFund() {
    const invested = Number(fundForm.invested);
    const current = Number(fundForm.current);
    const sip = Number(fundForm.sip);

    if (!fundForm.name || !invested) {
      setFormError("Please enter fund name and invested amount.");
      return;
    }

    setFunds([
      {
        id: crypto.randomUUID(),
        name: fundForm.name,
        invested,
        current: current || invested,
        sip,
        risk: fundForm.risk,
        goal: fundForm.goal || "Wealth Creation"
      },
      ...funds
    ]);

    setFundForm({ name: "", invested: "", current: "", sip: "", risk: "High", goal: "" });
    setFormError("");
  }

  function deleteFund(id: string) {
    setConfirmModal({
      message: "Delete this mutual fund entry?",
      onConfirm: () => setFunds((prev) => prev.filter((x) => x.id !== id))
    });
  }

  function addTravelPlan() {
    const targetInr = Number(travelForm.targetInr);
    const saved = Number(travelForm.saved);

    if (!travelForm.destination || !targetInr) {
      setFormError("Please enter destination and target budget.");
      return;
    }

    setTravelPlans([
      {
        id: crypto.randomUUID(),
        destination: travelForm.destination,
        currency: travelForm.currency,
        targetInr,
        saved,
        travelDate: travelForm.travelDate
      },
      ...travelPlans
    ]);

    setTravelForm({ destination: "", currency: "USD", targetInr: "", saved: "", travelDate: "" });
    setFormError("");
  }

  function deleteTravelPlan(id: string) {
    setConfirmModal({
      message: "Delete this travel plan?",
      onConfirm: () => setTravelPlans((prev) => prev.filter((x) => x.id !== id))
    });
  }

  function resetDemo() {
    setConfirmModal({
      message: "Reset to demo data? This will replace all your current transactions, loans, goals, funds and travel plans.",
      onConfirm: () => {
        setTransactions(sampleTransactions);
        setLoans(sampleLoans);
        setGoals(sampleGoals);
        setFunds(sampleFunds);
        setTravelPlans(sampleTravel);
      }
    });
  }

  function clearAllData() {
    setConfirmModal({
      message: "Permanently clear ALL data? This cannot be undone.",
      onConfirm: () => {
        setTransactions([]);
        setLoans([]);
        setGoals([]);
        setFunds([]);
        setTravelPlans([]);
      }
    });
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
            <button key={item.id} onClick={() => setTab(item.id)} style={tab === item.id ? navButtonActive : navButton}>
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div style={sidebarFooter}>
          <p style={sidebarFooterLabel}>Financial Health</p>
          <p style={sidebarFooterValue}>{gamification.health}/100</p>
          <div style={healthTrack}>
            <div style={{ ...healthFill, width: `${gamification.health}%` }} />
          </div>
        </div>
      </aside>

      <section style={content}>
        {storageWarning && (
          <div style={storageBanner}>
            <span>⚠ {storageWarning}</span>
            <button onClick={() => setStorageWarning("")} style={textButton}>×</button>
          </div>
        )}

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
                placeholder="Search anything: transfer, parents, EMI, SIP, SEBI, NAV, fuel..."
                style={searchInput}
              />
            </div>

            <button onClick={() => setTab("transactions")} style={iconButton} title="Add transaction">
              <Plus size={18} />
            </button>

            <div style={{ position: "relative" }}>
              <button onClick={() => setNotificationsOpen(!notificationsOpen)} style={iconButton} title="Notifications">
                <Bell size={18} />
                {notifications.length > 0 && <span style={notificationDot}>{notifications.length}</span>}
              </button>

              {notificationsOpen && (
                <div style={notificationPanel}>
                  <h3 style={{ marginTop: 0 }}>Notifications</h3>
                  {notifications.map((item, index) => (
                    <div key={index} style={alertCard(item.tone)}>
                      <strong>{item.title}</strong>
                      <p style={{ margin: "6px 0 0", fontSize: 13 }}>{item.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
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
                  <EmptyText text="No matching transactions, calculators, categories, loans, goals, funds or travel plans found." />
                )}

                {searchResults.internal.map((result, index) => (
                  <div key={`${result.type}-${index}`} style={searchResultRow}>
                    <div>
                      <span style={resultTypeBadge}>{result.type}</span>
                      <strong style={{ display: "block", marginTop: 6 }}>{result.title}</strong>
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
                  <a key={source.url} href={source.url} target="_blank" rel="noreferrer" style={sourceCard}>
                    <span style={sourceCategoryBadge}>{source.category}</span>
                    <strong style={{ display: "block", marginTop: 8 }}>{source.title}</strong>
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
                  Your dashboard tracks cash flow, transfers, savings, loans, mutual funds, travel goals, category depth and spending leakage.
                </p>
              </div>

              <div style={heroScore}>
                <p style={heroScoreLabel}>Risk Score</p>
                <p style={heroScoreValue}>{riskScore}</p>
                <p style={heroScoreLabel}>Lower is better</p>
              </div>
            </section>

            <section style={statGrid}>
              <MetricCard title="Current Balance" value={money(totals.savings)} subtext="Income minus tracked expenses" icon={<Wallet />} trend="+ Live" tone="green" />
              <MetricCard title="Total Income" value={money(totals.income)} subtext="All income entries" icon={<TrendingUp />} trend="Cash in" tone="blue" />
              <MetricCard title="Total Expense" value={money(totals.expense)} subtext="All spending entries" icon={<TrendingDown />} trend="Cash out" tone="red" />
              <MetricCard title="Transfers" value={money(totals.transfers)} subtext="Own/family/internal transfers" icon={<ReceiptText />} trend="Neutral" tone="gold" />
            </section>

            <section style={statGrid}>
              <GamificationCard label="Saver Badge" value={gamification.saverBadge} icon={<BadgeCheck />} />
              <GamificationCard label="Debt Status" value={gamification.debtBadge} icon={<ShieldCheck />} />
              <GamificationCard label="Spend Control" value={gamification.spendBadge} icon={<Sparkles />} />
              <GamificationCard label="Savings Rate" value={`${totals.savingsRate}%`} icon={<PiggyBank />} />
            </section>

            <section style={dashboardGrid}>
              <div style={panelLarge}>
                <PanelHeader title="Daily Spending — Last 30 Days" subtitle="Each bar = total spend for that calendar day" icon={<LineChart />} />
                <MiniBarChart values={dailyBars} />
              </div>

              <div style={panel}>
                <PanelHeader title="AI CFO Advice" subtitle="Actionable guidance" icon={<Brain />} />
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
                <PanelHeader title="Budget Funnel" subtitle="Needs, wants, wealth, debt" icon={<BarChart3 />} />
                <BudgetBar label="Needs" value={needsSpend} total={totals.expense} color="#2563eb" />
                <BudgetBar label="Wants" value={wantsSpend} total={totals.expense} color="#ef4444" />
                <BudgetBar label="Wealth" value={wealthSpend} total={totals.expense} color="#16a34a" />
                <BudgetBar label="Debt" value={debtSpend} total={totals.expense} color="#f59e0b" />
              </div>

              <div style={panelLarge}>
                <PanelHeader title="Latest Transactions" subtitle="Most recent money movements" icon={<ReceiptText />} />
                <TransactionTable transactions={transactions.slice(0, 6)} onDelete={deleteTransaction} />
              </div>
            </section>
          </>
        )}

        {tab === "transactions" && (
          <section style={twoColumnGrid}>
            <div style={panel}>
              <PanelHeader title="Add Transaction" subtitle="Income, expense or transfer" icon={<Plus />} />

              <Field label="Date">
                <input value={form.date} type="date" onChange={(e) => setForm({ ...form, date: e.target.value })} style={inputStyle} />
              </Field>

              <Field label="Type">
                <select value={form.type} onChange={(e) => setType(e.target.value as TransactionType)} style={inputStyle}>
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                  <option value="transfer">Transfer</option>
                </select>
              </Field>

              <Field label="Bucket">
                <select
                  value={form.bucket}
                  onChange={(e) => {
                    const bucket = e.target.value;
                    const firstCategory = Object.keys(categoryMap[bucket])[0];
                    const firstSubcategory = categoryMap[bucket][firstCategory][0];

                    setForm({ ...form, bucket, category: firstCategory, subcategory: firstSubcategory });
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
                    setForm({ ...form, category, subcategory: categoryMap[form.bucket][category][0] });
                  }}
                  style={inputStyle}
                >
                  {categories.map((category) => (
                    <option key={category}>{category}</option>
                  ))}
                </select>
              </Field>

              <Field label="Subcategory">
                <select value={form.subcategory} onChange={(e) => setForm({ ...form, subcategory: e.target.value })} style={inputStyle}>
                  {subcategories.map((subcategory) => (
                    <option key={subcategory}>{subcategory}</option>
                  ))}
                </select>
              </Field>

              <Field label={form.type === "transfer" ? "Transfer Party / Reason" : "Merchant / Source"}>
                <input
                  value={form.merchant}
                  onChange={(e) => setForm({ ...form, merchant: e.target.value })}
                  placeholder={form.type === "transfer" ? "Parents, HDFC to ICICI, wallet..." : "Swiggy, Salary, Amazon, HDFC..."}
                  style={inputStyle}
                />
              </Field>

              <Field label="From Account">
                <input value={form.accountFrom} onChange={(e) => setForm({ ...form, accountFrom: e.target.value })} placeholder="HDFC Bank, Cash, Wallet..." style={inputStyle} />
              </Field>

              <Field label="To Account / Receiver">
                <input value={form.accountTo} onChange={(e) => setForm({ ...form, accountTo: e.target.value })} placeholder="ICICI Bank, Parents, AMC, Vendor..." style={inputStyle} />
              </Field>

              <Field label="Amount">
                <input value={form.amount} type="number" onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="Enter amount" style={inputStyle} />
              </Field>

              <Field label="Note">
                <input value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} placeholder="Optional note" style={inputStyle} />
              </Field>

              <button onClick={addTransaction} style={primaryButton}>
                <Plus size={16} /> Add Transaction
              </button>
            </div>

            <div style={panelLarge}>
              <PanelHeader title="Transaction Ledger" subtitle="All income, expense and transfer records" icon={<ReceiptText />} />
              <TransactionTable transactions={transactions} onDelete={deleteTransaction} />
            </div>
          </section>
        )}

        {tab === "categories" && (
          <section>
            <section style={calculatorHero}>
              <div>
                <div style={premiumBadgeDark}>
                  <BarChart3 size={14} /> Category Intelligence
                </div>
                <h2 style={calculatorHeroTitle}>Deep category funnel for sharper money control.</h2>
                <p style={calculatorHeroText}>Bucket → Category → Subcategory. This helps identify leakage with precision.</p>
              </div>
            </section>

            <section style={statGrid}>
              {categoryStats.map((item) => (
                <MetricCard
                  key={item.bucket}
                  title={item.bucket}
                  value={`${item.categoryCount} categories`}
                  subtext={`${item.subcategoryCount} subcategories`}
                  icon={<BarChart3 />}
                  trend="Funnel"
                  tone={item.bucket === "Needs" ? "blue" : item.bucket === "Wants" ? "red" : item.bucket === "Wealth" ? "green" : "gold"}
                />
              ))}
            </section>

            <section style={categoryExplorerGrid}>
              {Object.entries(categoryMap).map(([bucket, categoryObj]) => (
                <div key={bucket} style={panel}>
                  <PanelHeader title={bucket} subtitle={`${Object.keys(categoryObj).length} categories`} icon={<BarChart3 />} />
                  {Object.entries(categoryObj).map(([category, subcategoryList]) => (
                    <details key={category} style={categoryDetails}>
                      <summary style={categorySummary}>
                        <strong>{category}</strong>
                        <span>{subcategoryList.length} items</span>
                      </summary>
                      <div style={subcategoryWrap}>
                        {subcategoryList.map((subcategory) => (
                          <span key={subcategory} style={subcategoryChip}>{subcategory}</span>
                        ))}
                      </div>
                    </details>
                  ))}
                </div>
              ))}
            </section>
          </section>
        )}

        {tab === "spending" && (
          <section>
            <section style={dashboardGrid}>
              <div style={panelLarge}>
                <PanelHeader title="Daily Spending Trend" subtitle="Last 30 days grouped by calendar date" icon={<LineChart />} />
                <MiniBarChart values={dailyBars} />
              </div>

              <div style={panel}>
                <PanelHeader title="Top Merchants" subtitle="Where your money is leaking" icon={<ReceiptText />} />
                {merchantSpend.length === 0 && <EmptyText text="No merchant spending yet." />}
                {merchantSpend.map(([merchant, amount]) => (
                  <div key={merchant} style={dataRow}>
                    <strong>{merchant}</strong>
                    <span>{money(amount)}</span>
                  </div>
                ))}
              </div>
            </section>

            <section style={twoColumnGrid}>
              <div style={panel}>
                <PanelHeader title="Bucket Funnel" subtitle="Needs, wants, wealth, debt" icon={<BarChart3 />} />
                {bucketSpend.length === 0 && <EmptyText text="No spending data yet." />}
                {bucketSpend.map(([bucket, amount]) => (
                  <BudgetBar key={bucket} label={bucket} value={amount} total={totals.expense} color={bucketColor(bucket)} />
                ))}
              </div>

              <div style={panelLarge}>
                <PanelHeader title="Category Leakage" subtitle="Narrow view by category and subcategory" icon={<Activity />} />
                {categorySpend.length === 0 && <EmptyText text="No category spending yet." />}
                {categorySpend.map(([category, amount]) => (
                  <div key={category} style={dataRow}>
                    <span>{category}</span>
                    <strong>{money(amount)}</strong>
                  </div>
                ))}
              </div>
            </section>
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
                <p style={calculatorHeroText}>EMI, SIP, lump sum, FD, RD, goal and credit card payoff calculators.</p>
              </div>
              <button style={primaryButton} onClick={() => setTab("transactions")}>Add real transaction</button>
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
                <button key={id} onClick={() => setCalcType(id)} style={calcType === id ? calculatorTabActive : calculatorTab}>{label}</button>
              ))}
            </div>

            {calcType === "emi" && (
              <section style={calculatorGrid}>
                <div style={calculatorInputPanel}>
                  <PanelHeader title="Loan EMI Calculator" subtitle="Home loan, personal loan and car loan" icon={<Landmark />} />

                  <div style={loanTypeGrid}>
                    {["Home Loan", "Personal Loan", "Car Loan"].map((loanType) => (
                      <button key={loanType} onClick={() => setEmiCalc({ ...emiCalc, loanType })} style={emiCalc.loanType === loanType ? loanTypeActive : loanTypeButton}>
                        {loanType}
                      </button>
                    ))}
                  </div>

                  <SliderField label="Loan Amount" value={emiCalc.amount} min={10000} max={10000000} step={10000} suffix="INR" onChange={(value) => setEmiCalc({ ...emiCalc, amount: value })} />
                  <SliderField label="Rate of Interest" value={emiCalc.rate} min={1} max={24} step={0.1} suffix="%" onChange={(value) => setEmiCalc({ ...emiCalc, rate: value })} />
                  <SliderField label="Tenure" value={emiCalc.months} min={1} max={360} step={1} suffix="Months" onChange={(value) => setEmiCalc({ ...emiCalc, months: value })} />
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
                  <PanelHeader title="SIP Calculator" subtitle="Monthly investment wealth projection" icon={<PiggyBank />} />
                  <SliderField label="Monthly SIP" value={sipCalc.monthly} min={500} max={200000} step={500} suffix="INR" onChange={(value) => setSipCalc({ ...sipCalc, monthly: value })} />
                  <SliderField label="Expected Annual Return" value={sipCalc.returnRate} min={1} max={30} step={0.5} suffix="%" onChange={(value) => setSipCalc({ ...sipCalc, returnRate: value })} />
                  <SliderField label="Investment Duration" value={sipCalc.years} min={1} max={40} step={1} suffix="Years" onChange={(value) => setSipCalc({ ...sipCalc, years: value })} />
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
                  <PanelHeader title="Lump Sum Calculator" subtitle="One-time investment growth" icon={<TrendingUp />} />
                  <SliderField label="Investment Amount" value={lumpCalc.amount} min={1000} max={5000000} step={1000} suffix="INR" onChange={(value) => setLumpCalc({ ...lumpCalc, amount: value })} />
                  <SliderField label="Expected Annual Return" value={lumpCalc.returnRate} min={1} max={30} step={0.5} suffix="%" onChange={(value) => setLumpCalc({ ...lumpCalc, returnRate: value })} />
                  <SliderField label="Duration" value={lumpCalc.years} min={1} max={40} step={1} suffix="Years" onChange={(value) => setLumpCalc({ ...lumpCalc, years: value })} />
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
                  <PanelHeader title="Fixed Deposit Calculator" subtitle="Quarterly compounding maturity estimate" icon={<Wallet />} />
                  <SliderField label="Deposit Amount" value={fdCalc.amount} min={1000} max={5000000} step={1000} suffix="INR" onChange={(value) => setFdCalc({ ...fdCalc, amount: value })} />
                  <SliderField label="Interest Rate" value={fdCalc.rate} min={1} max={15} step={0.1} suffix="%" onChange={(value) => setFdCalc({ ...fdCalc, rate: value })} />
                  <SliderField label="Duration" value={fdCalc.years} min={1} max={20} step={1} suffix="Years" onChange={(value) => setFdCalc({ ...fdCalc, years: value })} />
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
                  <PanelHeader title="Recurring Deposit Calculator" subtitle="Quarterly compounding estimate" icon={<Wallet />} />
                  <SliderField label="Monthly Deposit" value={rdCalc.monthly} min={500} max={200000} step={500} suffix="INR" onChange={(value) => setRdCalc({ ...rdCalc, monthly: value })} />
                  <SliderField label="Interest Rate" value={rdCalc.rate} min={1} max={15} step={0.1} suffix="%" onChange={(value) => setRdCalc({ ...rdCalc, rate: value })} />
                  <SliderField label="Duration" value={rdCalc.years} min={1} max={20} step={1} suffix="Years" onChange={(value) => setRdCalc({ ...rdCalc, years: value })} />
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
                  <PanelHeader title="Goal Planning Calculator" subtitle="Know how much to save monthly" icon={<Target />} />
                  <SliderField label="Goal Target" value={goalCalc.target} min={10000} max={10000000} step={10000} suffix="INR" onChange={(value) => setGoalCalc({ ...goalCalc, target: value })} />
                  <SliderField label="Already Saved" value={goalCalc.current} min={0} max={goalCalc.target} step={1000} suffix="INR" onChange={(value) => setGoalCalc({ ...goalCalc, current: value })} />
                  <SliderField label="Time Available" value={goalCalc.years} min={1} max={30} step={1} suffix="Years" onChange={(value) => setGoalCalc({ ...goalCalc, years: value })} />
                  <SliderField label="Expected Return" value={goalCalc.returnRate} min={0} max={25} step={0.5} suffix="%" onChange={(value) => setGoalCalc({ ...goalCalc, returnRate: value })} />
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
                  <PanelHeader title="Credit Card Payoff Calculator" subtitle="Estimate debt clearance timeline" icon={<CreditCard />} />
                  <SliderField label="Outstanding Amount" value={cardCalc.outstanding} min={1000} max={1000000} step={1000} suffix="INR" onChange={(value) => setCardCalc({ ...cardCalc, outstanding: value })} />
                  <SliderField label="Annual Interest Rate" value={cardCalc.annualRate} min={12} max={60} step={0.5} suffix="%" onChange={(value) => setCardCalc({ ...cardCalc, annualRate: value })} />
                  <SliderField label="Monthly Payment" value={cardCalc.monthlyPayment} min={500} max={200000} step={500} suffix="INR" onChange={(value) => setCardCalc({ ...cardCalc, monthlyPayment: value })} />
                </div>

                <CalculatorResultPanel
                  title="Credit Card Payoff Result"
                  mainLabel="Months to Clear"
                  mainValue={cardMonths.months >= 999 ? "Never — increase payment" : `${cardMonths.months} months (${Math.floor(cardMonths.months / 12)}y ${cardMonths.months % 12}m)`}
                  rows={[
                    ["Outstanding", money(cardCalc.outstanding)],
                    ["Estimated Interest", cardMonths.totalInterest === Infinity ? "Payment too low" : money(cardMonths.totalInterest)],
                    ["Monthly Payment", money(cardCalc.monthlyPayment)]
                  ]}
                  chartPrimary={
                    cardCalc.outstanding + (cardMonths.totalInterest === Infinity ? 0 : cardMonths.totalInterest)
                      ? Math.round(((cardMonths.totalInterest === Infinity ? 0 : cardMonths.totalInterest) / (cardCalc.outstanding + (cardMonths.totalInterest === Infinity ? 0 : cardMonths.totalInterest))) * 100)
                      : 0
                  }
                  chartPrimaryLabel="Interest"
                  chartSecondaryLabel="Principal"
                />
              </section>
            )}
          </section>
        )}

        {tab === "loans" && (
          <section style={twoColumnGrid}>
            <div style={panel}>
              <PanelHeader title="Add Loan" subtitle="Calculate EMI and debt burden" icon={<Landmark />} />

              <Field label="Loan Name">
                <input value={loanForm.name} onChange={(e) => setLoanForm({ ...loanForm, name: e.target.value })} placeholder="Personal Loan, Home Loan..." style={inputStyle} />
              </Field>

              <Field label="Principal">
                <input value={loanForm.principal} onChange={(e) => setLoanForm({ ...loanForm, principal: e.target.value })} type="number" style={inputStyle} />
              </Field>

              <Field label="Interest Rate % p.a.">
                <input value={loanForm.rate} onChange={(e) => setLoanForm({ ...loanForm, rate: e.target.value })} type="number" style={inputStyle} />
              </Field>

              <Field label="Tenure Months">
                <input value={loanForm.months} onChange={(e) => setLoanForm({ ...loanForm, months: e.target.value })} type="number" style={inputStyle} />
              </Field>

              <button onClick={addLoan} style={primaryButton}><Plus size={16} /> Add Loan</button>
            </div>

            <div style={panelLarge}>
              <PanelHeader title="Loan War Room" subtitle="EMI, interest and debt burden" icon={<CreditCard />} />

              <section style={miniStatsGrid}>
                <MiniStat label="Total EMI" value={money(loanSummary.totalEmi)} />
                <MiniStat label="Debt Burden" value={`${loanSummary.debtBurden}%`} />
              </section>

              {loanSummary.rows.map((loan) => (
                <div key={loan.id} style={dataRow}>
                  <div>
                    <strong>{loan.name}</strong>
                    <p style={mutedText}>EMI {money(loan.monthlyEmi)} • Interest {money(loan.interest)}</p>
                  </div>
                  <button onClick={() => deleteLoan(loan.id)} style={deleteButton} aria-label={`Delete loan: ${loan.name}`}>
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
              <PanelHeader title="Add Goal" subtitle="Emergency fund, travel, home, retirement" icon={<Target />} />

              <Field label="Goal Name">
                <input value={goalForm.name} onChange={(e) => setGoalForm({ ...goalForm, name: e.target.value })} placeholder="Emergency Fund, Travel, Home..." style={inputStyle} />
              </Field>

              <Field label="Target Amount">
                <input value={goalForm.target} onChange={(e) => setGoalForm({ ...goalForm, target: e.target.value })} type="number" placeholder="300000" style={inputStyle} />
              </Field>

              <Field label="Already Saved">
                <input value={goalForm.saved} onChange={(e) => setGoalForm({ ...goalForm, saved: e.target.value })} type="number" placeholder="0" style={inputStyle} />
              </Field>

              <Field label="Target Deadline">
                <input value={goalForm.deadline} onChange={(e) => setGoalForm({ ...goalForm, deadline: e.target.value })} type="date" style={inputStyle} />
              </Field>

              <Field label="Monthly Contribution">
                <input value={goalForm.monthlyContrib} onChange={(e) => setGoalForm({ ...goalForm, monthlyContrib: e.target.value })} type="number" placeholder="5000" style={inputStyle} />
              </Field>

              <button onClick={addGoal} style={primaryButton}><Plus size={16} /> Add Goal</button>
            </div>

            <div style={panelLarge}>
              <PanelHeader title="Goal Progress" subtitle="Deadline and monthly saving intelligence" icon={<Target />} />

              {goals.map((goal) => {
                const progress = goal.target ? Math.round((goal.saved / goal.target) * 100) : 0;
                const remaining = Math.max(goal.target - goal.saved, 0);
                const monthsToGoal = goal.monthlyContrib > 0 ? Math.ceil(remaining / goal.monthlyContrib) : null;
                const deadlineMonths = monthDifference(goal.deadline);
                const requiredMonthly = deadlineMonths && deadlineMonths > 0 ? Math.ceil(remaining / deadlineMonths) : null;
                const onTrack = goal.monthlyContrib > 0 && requiredMonthly !== null ? goal.monthlyContrib >= requiredMonthly : null;

                return (
                  <div key={goal.id} style={goalCard}>
                    <div style={dataRowNoBorder}>
                      <div>
                        <strong>{goal.name}</strong>
                        <p style={mutedText}>{money(goal.saved)} saved of {money(goal.target)} • {progress}%</p>
                      </div>

                      <button onClick={() => deleteGoal(goal.id)} style={deleteButton} aria-label={`Delete goal: ${goal.name}`}>
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div style={progressTrack}>
                      <div style={{ ...progressFill, width: `${Math.min(progress, 100)}%`, background: progress >= 100 ? "#16a34a" : onTrack === false ? "#ef4444" : "#16a34a" }} />
                    </div>

                    <div style={{ marginTop: 10, display: "grid", gap: 4 }}>
                      {goal.deadline && <p style={mutedText}>🎯 Deadline: {new Date(goal.deadline).toLocaleDateString("en-IN")}{deadlineMonths !== null && ` (${deadlineMonths} months away)`}</p>}
                      {requiredMonthly !== null && (
                        <p style={{ ...mutedText, color: onTrack === false ? "#ef4444" : "#16a34a", fontWeight: 600 }}>
                          {onTrack === false
                            ? `⚠ Need ${money(requiredMonthly)}/month to reach deadline — planned ${money(goal.monthlyContrib)}/month`
                            : `✓ On track — planned ${money(goal.monthlyContrib)}/month, need ${money(requiredMonthly)}`}
                        </p>
                      )}
                      {monthsToGoal !== null && !goal.deadline && <p style={mutedText}>📅 At {money(goal.monthlyContrib)}/month → {monthsToGoal} months to goal</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {tab === "mutual-funds" && (
          <section style={twoColumnGrid}>
            <div style={panel}>
              <PanelHeader title="Add Mutual Fund" subtitle="Track invested value, current value and SIP" icon={<PiggyBank />} />

              <Field label="Fund Name">
                <input value={fundForm.name} onChange={(e) => setFundForm({ ...fundForm, name: e.target.value })} placeholder="Nifty 50 Index Fund" style={inputStyle} />
              </Field>

              <Field label="Invested Amount">
                <input value={fundForm.invested} onChange={(e) => setFundForm({ ...fundForm, invested: e.target.value })} type="number" style={inputStyle} />
              </Field>

              <Field label="Current Value">
                <input value={fundForm.current} onChange={(e) => setFundForm({ ...fundForm, current: e.target.value })} type="number" style={inputStyle} />
              </Field>

              <Field label="Monthly SIP">
                <input value={fundForm.sip} onChange={(e) => setFundForm({ ...fundForm, sip: e.target.value })} type="number" style={inputStyle} />
              </Field>

              <Field label="Risk Level">
                <select value={fundForm.risk} onChange={(e) => setFundForm({ ...fundForm, risk: e.target.value })} style={inputStyle}>
                  <option>Low</option>
                  <option>Moderate</option>
                  <option>High</option>
                  <option>Very High</option>
                </select>
              </Field>

              <Field label="Linked Goal">
                <input value={fundForm.goal} onChange={(e) => setFundForm({ ...fundForm, goal: e.target.value })} placeholder="Retirement, Travel, Wealth Creation" style={inputStyle} />
              </Field>

              <button onClick={addFund} style={primaryButton}><Plus size={16} /> Add Fund</button>
            </div>

            <div style={panelLarge}>
              <PanelHeader title="Mutual Fund Intelligence" subtitle="Educational, SEBI-safe tracking — not buy/sell advice" icon={<PiggyBank />} />

              <section style={miniStatsGrid}>
                <MiniStat label="Invested" value={money(fundSummary.invested)} />
                <MiniStat label="Current Value" value={money(fundSummary.current)} />
                <MiniStat label="Gain / Loss" value={`${money(fundSummary.gain)} (${fundSummary.gainPercent}%)`} />
                <MiniStat label="Monthly SIP" value={money(fundSummary.sip)} />
              </section>

              {funds.map((fund) => {
                const gain = fund.current - fund.invested;
                const gainPercent = fund.invested ? Math.round((gain / fund.invested) * 100) : 0;

                return (
                  <div key={fund.id} style={goalCard}>
                    <div style={dataRowNoBorder}>
                      <div>
                        <strong>{fund.name}</strong>
                        <p style={mutedText}>Goal: {fund.goal} • Risk: {fund.risk} • SIP {money(fund.sip)}</p>
                      </div>
                      <button onClick={() => deleteFund(fund.id)} style={deleteButton} aria-label={`Delete fund: ${fund.name}`}>
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <p style={{ ...mutedText, color: gain >= 0 ? "#16a34a" : "#ef4444", fontWeight: 600 }}>
                      Invested {money(fund.invested)} → Current {money(fund.current)} • {gain >= 0 ? "Gain" : "Loss"} {money(gain)} ({gainPercent}%)
                    </p>
                  </div>
                );
              })}

              <div style={warningBoxNeutral}>
                <ShieldCheck size={18} />
                Advisor mode uses educational logic only. Live NAV and scheme facts must come from AMFI/SEBI APIs before making factual claims.
              </div>
            </div>
          </section>
        )}

        {tab === "travel" && (
          <section style={twoColumnGrid}>
            <div style={panel}>
              <PanelHeader title="Add Travel Plan" subtitle="Track destination, currency and INR budget" icon={<Plane />} />

              <Field label="Destination">
                <input value={travelForm.destination} onChange={(e) => setTravelForm({ ...travelForm, destination: e.target.value })} placeholder="Japan, Dubai, Europe..." style={inputStyle} />
              </Field>

              <Field label="Currency">
                <input value={travelForm.currency} onChange={(e) => setTravelForm({ ...travelForm, currency: e.target.value.toUpperCase() })} placeholder="USD, JPY, EUR..." style={inputStyle} />
              </Field>

              <Field label="Target Budget in INR">
                <input value={travelForm.targetInr} onChange={(e) => setTravelForm({ ...travelForm, targetInr: e.target.value })} type="number" style={inputStyle} />
              </Field>

              <Field label="Already Saved">
                <input value={travelForm.saved} onChange={(e) => setTravelForm({ ...travelForm, saved: e.target.value })} type="number" style={inputStyle} />
              </Field>

              <Field label="Travel Date">
                <input value={travelForm.travelDate} onChange={(e) => setTravelForm({ ...travelForm, travelDate: e.target.value })} type="date" style={inputStyle} />
              </Field>

              <button onClick={addTravelPlan} style={primaryButton}><Plus size={16} /> Add Travel Plan</button>
            </div>

            <div style={panelLarge}>
              <PanelHeader title="Travel & Forex Planner" subtitle="Budget progress and forex-source placeholder" icon={<Globe2 />} />

              <section style={miniStatsGrid}>
                <MiniStat label="Total Target" value={money(travelSummary.target)} />
                <MiniStat label="Saved" value={money(travelSummary.saved)} />
                <MiniStat label="Gap" value={money(travelSummary.gap)} />
                <MiniStat label="Progress" value={`${travelSummary.progress}%`} />
              </section>

              {travelPlans.map((plan) => {
                const progress = plan.targetInr ? Math.round((plan.saved / plan.targetInr) * 100) : 0;

                return (
                  <div key={plan.id} style={goalCard}>
                    <div style={dataRowNoBorder}>
                      <div>
                        <strong>{plan.destination}</strong>
                        <p style={mutedText}>{plan.currency} • {money(plan.saved)} saved of {money(plan.targetInr)} • {progress}%</p>
                      </div>
                      <button onClick={() => deleteTravelPlan(plan.id)} style={deleteButton} aria-label={`Delete travel plan: ${plan.destination}`}>
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div style={progressTrack}>
                      <div style={{ ...progressFill, width: `${Math.min(progress, 100)}%`, background: "#2563eb" }} />
                    </div>

                    <p style={mutedText}>Live forex will be added later through a verified currency API with source and last-updated timestamp.</p>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {tab === "insights" && (
          <section style={dashboardGrid}>
            <div style={panelLarge}>
              <PanelHeader title="Insights Engine" subtitle="Transparent logic based only on your app data" icon={<Brain />} />

              <InsightRule title="Savings Rate Logic" value={`${totals.savingsRate}%`} explanation="Income minus expenses divided by income. Target: 20%+." />
              <InsightRule title="Debt Burden Logic" value={`${loanSummary.debtBurden}%`} explanation="Total EMI divided by monthly income. Warning above 35%." />
              <InsightRule title="Lifestyle Leakage Logic" value={money(wantsSpend)} explanation="Wants spending compared to income. Warning when above 30%." />
              <InsightRule title="Goal Schedule Logic" value={`${goals.length} goals`} explanation="Compares saved amount, deadline and monthly contribution." />
              <InsightRule title="Transfer Logic" value={money(totals.transfers)} explanation="Transfers are neutral movements and are excluded from income/expense savings rate." />
            </div>

            <div style={panel}>
              <PanelHeader title="Recommendation Engine" subtitle="No black box. Rule-based now; ML later." icon={<Sparkles />} />
              <p style={advisorBox}>{advisorText}</p>
              <div style={warningBoxNeutral}>
                <Brain size={18} />
                Future ML can detect recurring expenses, abnormal spikes, duplicate transactions and overspending patterns once enough real data exists.
              </div>
            </div>
          </section>
        )}

        {tab === "advisor" && (
          <section style={dashboardGrid}>
            <div style={panelLarge}>
              <PanelHeader title="AI CFO Advisor" subtitle="How it works" icon={<Sparkles />} />

              <div style={advisorLarge}>
                <Brain size={30} />
                <p>{advisorText}</p>
              </div>

              <InsightRule title="Input Data" value="Your data" explanation="Reads income, expenses, transfers, categories, loans, goals, funds and travel plans stored in the app." />
              <InsightRule title="Decision Logic" value="Rules first" explanation="Uses savings rate, debt burden, wants spending, category leakage and goal deadline checks." />
              <InsightRule title="Verified World Data" value="Source required" explanation="For SEBI/RBI/NAV/forex claims, the app must show official source links or API data." />
              <InsightRule title="Investment Safety" value="Educational" explanation="It can educate and calculate, but should not give personalized buy/sell advice without a compliant advisory structure." />
            </div>

            <div style={panel}>
              <PanelHeader title="Advisor Guardrails" subtitle="Anti-hallucination design" icon={<ShieldCheck />} />
              <div style={antiHallucinationBox}>
                <ShieldCheck size={18} />
                If verified data is unavailable, say “I cannot verify this yet” instead of guessing.
              </div>
              <div style={warningBoxNeutral}>
                <Globe2 size={18} />
                Live world data should come from APIs like AMFI, RBI, SEBI, World Bank and a currency-rate provider with last-updated timestamps.
              </div>
            </div>
          </section>
        )}

        <footer style={footerActions}>
          <button onClick={resetDemo} style={secondaryButton}>Reset Demo Data</button>
          <button onClick={clearAllData} style={dangerButton}>Clear All Data</button>
        </footer>

        {confirmModal && (
          <div style={modalBackdrop}>
            <div style={modalCard}>
              <p style={{ fontSize: 16, fontWeight: 600, marginBottom: 20, color: "#0f172a", lineHeight: 1.5 }}>
                {confirmModal.message}
              </p>
              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                <button onClick={() => setConfirmModal(null)} style={secondaryButton}>Cancel</button>
                <button onClick={() => { confirmModal.onConfirm(); setConfirmModal(null); }} style={dangerButton}>Confirm</button>
              </div>
            </div>
          </div>
        )}

        {formError && (
          <div style={errorToast}>
            ⚠ {formError}
            <button onClick={() => setFormError("")} style={textButton}>×</button>
          </div>
        )}
      </section>
    </main>
  );
}

function getPageTitle(tab: TabId) {
  const map: Record<TabId, string> = {
    dashboard: "Dashboard",
    transactions: "Transactions",
    categories: "Categories",
    spending: "Spending Analytics",
    calculators: "Financial Calculators",
    loans: "Loans & Debt",
    goals: "Goals",
    "mutual-funds": "Mutual Funds",
    travel: "Travel & Forex",
    insights: "Insights Engine",
    advisor: "AI Advisor"
  };

  return map[tab];
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
  const color = tone === "green" ? "#16a34a" : tone === "blue" ? "#2563eb" : tone === "red" ? "#ef4444" : "#f59e0b";

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

function GamificationCard({ label, value, icon }: { label: string; value: string; icon: ReactNode }) {
  return (
    <div style={metricCard}>
      <div style={metricIcon}>{icon}</div>
      <p style={metricTitle}>{label}</p>
      <h2 style={smallMetricValue}>{value}</h2>
      <p style={mutedText}>Gamified money discipline signal</p>
    </div>
  );
}

function PanelHeader({ title, subtitle, icon }: { title: string; subtitle: string; icon: ReactNode }) {
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
        <div key={index} style={barColumn} title={`Day ${index + 1}: ${money(value)}`}>
          <div style={{ ...bar, height: `${Math.max(8, (value / max) * 190)}px` }} />
          <span style={barLabel}>{index + 1}</span>
        </div>
      ))}
    </div>
  );
}

function BudgetBar({ label, value, total, color }: { label: string; value: number; total: number; color: string }) {
  const percent = total ? Math.round((value / total) * 100) : 0;

  return (
    <div style={budgetItem}>
      <div style={dataRowNoBorder}>
        <strong>{label}</strong>
        <span>{money(value)} • {percent}%</span>
      </div>
      <div style={progressTrack}>
        <div style={{ ...progressFill, width: `${Math.min(percent, 100)}%`, background: color }} />
      </div>
    </div>
  );
}

function TransactionTable({ transactions, onDelete }: { transactions: Transaction[]; onDelete: (id: string) => void }) {
  if (transactions.length === 0) {
    return <EmptyText text="No transactions yet. Add your first entry." />;
  }

  return (
    <div style={tableWrap}>
      {transactions.map((t) => (
        <div key={t.id} style={transactionRow}>
          <div style={transactionAvatar}>
            {t.type === "income" ? <TrendingUp size={16} /> : t.type === "transfer" ? <ReceiptText size={16} /> : <TrendingDown size={16} />}
          </div>

          <div style={{ flex: 1 }}>
            <strong>{t.merchant}</strong>
            <p style={mutedText}>
              {t.date} • {t.type.toUpperCase()} • {t.bucket} → {t.category} → {t.subcategory}
            </p>
            {(t.accountFrom || t.accountTo) && (
              <p style={{ ...mutedText, fontSize: 12 }}>
                {t.accountFrom || "From"} → {t.accountTo || "To"}
              </p>
            )}
          </div>

          <div style={{ textAlign: "right" }}>
            <strong style={{ color: t.type === "income" ? "#16a34a" : t.type === "expense" ? "#111827" : "#2563eb" }}>
              {money(t.amount)}
            </strong>
            <br />
            <button onClick={() => onDelete(t.id)} style={deleteButton} aria-label={`Delete transaction: ${t.merchant} ${t.date}`}>
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
          <input value={value} type="number" onChange={(e) => onChange(Number(e.target.value))} style={sliderNumberInput} />
          <span style={sliderSuffix}>{suffix}</span>
        </div>
      </div>

      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} style={rangeStyle} />
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
        <div style={{ ...donut, background: `conic-gradient(#3155d4 0% ${primary}%, #e5e7eb ${primary}% 100%)` }}>
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

function InsightRule({ title, value, explanation }: { title: string; value: string; explanation: string }) {
  return (
    <div style={insightRule}>
      <div>
        <strong>{title}</strong>
        <p style={mutedText}>{explanation}</p>
      </div>
      <span style={insightValue}>{value}</span>
    </div>
  );
}

function bucketColor(bucket: string) {
  if (bucket === "Needs") return "#2563eb";
  if (bucket === "Wants") return "#ef4444";
  if (bucket === "Wealth") return "#16a34a";
  if (bucket === "Debt") return "#f59e0b";
  return "#64748b";
}

function alertCard(tone: "green" | "amber" | "red" | "blue"): CSSProperties {
  const color = tone === "green" ? "#166534" : tone === "amber" ? "#92400e" : tone === "red" ? "#991b1b" : "#1d4ed8";
  const background = tone === "green" ? "#f0fdf4" : tone === "amber" ? "#fffbeb" : tone === "red" ? "#fef2f2" : "#eff6ff";
  const border = tone === "green" ? "#bbf7d0" : tone === "amber" ? "#fde68a" : tone === "red" ? "#fca5a5" : "#bfdbfe";

  return {
    padding: 12,
    borderRadius: 14,
    background,
    color,
    border: `1px solid ${border}`,
    marginBottom: 10
  };
}

const appShell: CSSProperties = {
  minHeight: "100vh",
  display: "grid",
  gridTemplateColumns: "280px 1fr",
  background: "#eef3f8",
  color: "#0f172a",
  fontFamily: "Inter, Arial, sans-serif"
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

const brandBox: CSSProperties = { display: "flex", alignItems: "center", gap: 12, marginBottom: 26 };

const brandIcon: CSSProperties = {
  width: 46,
  height: 46,
  borderRadius: 16,
  background: "linear-gradient(135deg, #22c55e, #facc15)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 900,
  fontSize: 24,
  color: "#052e16"
};

const brandTitle: CSSProperties = { margin: 0, fontSize: 22, letterSpacing: "-0.5px" };
const brandSubtitle: CSSProperties = { margin: "4px 0 0", fontSize: 12, color: "#c4b5fd" };
const navStyle: CSSProperties = { display: "grid", gap: 8 };

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
  fontWeight: 600
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

const sidebarFooterLabel: CSSProperties = { margin: 0, color: "#ddd6fe", fontSize: 13 };
const sidebarFooterValue: CSSProperties = { margin: "6px 0", fontSize: 26, fontWeight: 900 };
const healthTrack: CSSProperties = { height: 8, background: "rgba(255,255,255,0.2)", borderRadius: 999, overflow: "hidden" };
const healthFill: CSSProperties = { height: "100%", background: "#22c55e", borderRadius: 999 };
const content: CSSProperties = { padding: 26, minWidth: 0 };

const storageBanner: CSSProperties = {
  background: "#fef2f2",
  border: "1px solid #fca5a5",
  color: "#991b1b",
  padding: "10px 16px",
  borderRadius: 12,
  marginBottom: 16,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  fontSize: 14
};

const topbar: CSSProperties = { display: "flex", justifyContent: "space-between", gap: 18, alignItems: "center", marginBottom: 22 };
const eyebrow: CSSProperties = { margin: 0, color: "#64748b", fontSize: 12, letterSpacing: "1.6px", fontWeight: 900 };
const pageTitle: CSSProperties = { margin: "4px 0 0", fontSize: 34, letterSpacing: "-1px" };
const topbarRight: CSSProperties = { display: "flex", gap: 10, alignItems: "center" };

const searchBox: CSSProperties = {
  minWidth: 390,
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

const searchInput: CSSProperties = { border: 0, outline: "none", width: "100%", background: "transparent", color: "#0f172a", fontSize: 15 };

const iconButton: CSSProperties = {
  width: 46,
  height: 46,
  borderRadius: 16,
  border: "1px solid #e2e8f0",
  background: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  position: "relative"
};

const notificationDot: CSSProperties = {
  position: "absolute",
  top: -6,
  right: -6,
  background: "#ef4444",
  color: "white",
  borderRadius: 999,
  fontSize: 11,
  padding: "2px 6px",
  fontWeight: 700
};

const notificationPanel: CSSProperties = {
  position: "absolute",
  top: 54,
  right: 0,
  width: 360,
  background: "white",
  border: "1px solid #e2e8f0",
  borderRadius: 20,
  boxShadow: "0 24px 60px rgba(15,23,42,0.18)",
  padding: 16,
  zIndex: 30
};

const searchResultsPanel: CSSProperties = {
  background: "white",
  borderRadius: 26,
  padding: 22,
  border: "1px solid #e2e8f0",
  boxShadow: "0 14px 45px rgba(15,23,42,0.06)",
  marginBottom: 20
};

const searchGrid: CSSProperties = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 };
const searchSectionTitle: CSSProperties = { margin: "0 0 12px", fontSize: 18 };

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

const sourceLinkText: CSSProperties = { margin: "8px 0 0", color: "#2563eb", fontWeight: 900, fontSize: 14 };

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

const heroTitle: CSSProperties = { margin: "16px 0 8px", fontSize: 38, letterSpacing: "-1px" };
const heroText: CSSProperties = { margin: 0, color: "#dcfce7", maxWidth: 760, lineHeight: 1.5 };

const heroScore: CSSProperties = {
  minWidth: 170,
  padding: 20,
  borderRadius: 24,
  background: "rgba(255,255,255,0.12)",
  border: "1px solid rgba(255,255,255,0.16)",
  textAlign: "center"
};

const heroScoreLabel: CSSProperties = { margin: 0, fontSize: 13, color: "#dcfce7" };
const heroScoreValue: CSSProperties = { margin: "8px 0", fontSize: 44, fontWeight: 900 };
const statGrid: CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 18 };

const metricCard: CSSProperties = {
  background: "white",
  borderRadius: 24,
  padding: 20,
  border: "1px solid #e2e8f0",
  boxShadow: "0 14px 45px rgba(15,23,42,0.06)"
};

const metricTop: CSSProperties = { display: "flex", justifyContent: "space-between", alignItems: "center" };

const metricIcon: CSSProperties = {
  width: 42,
  height: 42,
  borderRadius: 16,
  background: "#f1f5f9",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
};

const trendBadge: CSSProperties = { padding: "6px 10px", borderRadius: 999, fontWeight: 900, fontSize: 12 };
const metricTitle: CSSProperties = { margin: "16px 0 6px", color: "#64748b" };
const metricValue: CSSProperties = { margin: 0, fontSize: 30, letterSpacing: "-0.8px" };
const smallMetricValue: CSSProperties = { margin: 0, fontSize: 22, letterSpacing: "-0.4px" };
const dashboardGrid: CSSProperties = { display: "grid", gridTemplateColumns: "1.45fr 1fr", gap: 18, marginBottom: 18 };
const twoColumnGrid: CSSProperties = { display: "grid", gridTemplateColumns: "minmax(320px, 0.85fr) minmax(360px, 1.2fr)", gap: 18 };
const categoryExplorerGrid: CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: 18 };

const categoryDetails: CSSProperties = {
  padding: 14,
  borderRadius: 18,
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
  marginBottom: 10
};

const categorySummary: CSSProperties = { cursor: "pointer", display: "flex", justifyContent: "space-between", gap: 10, color: "#0f172a" };
const subcategoryWrap: CSSProperties = { display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 };

const subcategoryChip: CSSProperties = {
  display: "inline-flex",
  padding: "7px 10px",
  borderRadius: 999,
  background: "white",
  border: "1px solid #e2e8f0",
  fontSize: 13,
  color: "#334155"
};

const panel: CSSProperties = {
  background: "white",
  borderRadius: 26,
  padding: 22,
  border: "1px solid #e2e8f0",
  boxShadow: "0 14px 45px rgba(15,23,42,0.06)"
};

const panelLarge: CSSProperties = { ...panel, minHeight: 320 };
const panelHeader: CSSProperties = { display: "flex", justifyContent: "space-between", gap: 14, alignItems: "flex-start", marginBottom: 16 };
const panelTitle: CSSProperties = { margin: 0, fontSize: 24, letterSpacing: "-0.6px" };

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

const mutedText: CSSProperties = { margin: "4px 0 0", color: "#64748b", fontSize: 14, lineHeight: 1.45 };

const advisorBox: CSSProperties = {
  padding: 16,
  borderRadius: 18,
  background: "#f0fdf4",
  color: "#14532d",
  border: "1px solid #bbf7d0",
  lineHeight: 1.55,
  fontWeight: 600
};

const actionList: CSSProperties = { display: "grid", gap: 8, marginTop: 14 };

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
  height: 245,
  display: "flex",
  alignItems: "end",
  gap: 6,
  padding: "20px 8px 0",
  borderRadius: 20,
  background: "linear-gradient(180deg, #f8fafc, white)",
  overflowX: "auto"
};

const barColumn: CSSProperties = { minWidth: 18, flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 };

const bar: CSSProperties = {
  width: "100%",
  maxWidth: 24,
  borderRadius: "14px 14px 4px 4px",
  background: "linear-gradient(180deg, #7c3aed, #06b6d4)",
  boxShadow: "0 8px 20px rgba(124,58,237,0.24)"
};

const barLabel: CSSProperties = { fontSize: 10, color: "#94a3b8" };
const budgetItem: CSSProperties = { marginBottom: 16 };
const progressTrack: CSSProperties = { height: 10, background: "#e5e7eb", borderRadius: 999, overflow: "hidden", marginTop: 8 };
const progressFill: CSSProperties = { height: "100%", borderRadius: 999 };

const dataRow: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 12,
  padding: "14px 0",
  borderBottom: "1px solid #e5e7eb",
  alignItems: "center"
};

const dataRowNoBorder: CSSProperties = { display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" };
const tableWrap: CSSProperties = { display: "grid", gap: 0 };
const transactionRow: CSSProperties = { display: "flex", gap: 12, alignItems: "center", padding: "14px 0", borderBottom: "1px solid #e5e7eb" };

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

const fieldLabel: CSSProperties = { margin: "12px 0 6px", color: "#475569", fontSize: 14, fontWeight: 700 };

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
  fontWeight: 600
};

const miniStatsGrid: CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 16 };
const miniStat: CSSProperties = { padding: 16, borderRadius: 18, background: "#f8fafc", border: "1px solid #e2e8f0" };
const miniStatValue: CSSProperties = { margin: "6px 0 0", fontSize: 22 };
const goalCard: CSSProperties = { padding: 16, borderRadius: 18, background: "#f8fafc", border: "1px solid #e2e8f0", marginBottom: 12 };
const emptyText: CSSProperties = { color: "#64748b", background: "#f8fafc", padding: 16, borderRadius: 16 };

const advisorLarge: CSSProperties = {
  padding: 22,
  borderRadius: 22,
  background: "linear-gradient(135deg, #020617, #064e3b)",
  color: "white",
  fontSize: 18,
  lineHeight: 1.65,
  display: "grid",
  gap: 12,
  marginBottom: 16
};

const footerActions: CSSProperties = { marginTop: 22, display: "flex", gap: 10, flexWrap: "wrap" };

const calculatorHero: CSSProperties = {
  background: "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(220,252,231,0.95))",
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

const calculatorHeroTitle: CSSProperties = { fontSize: 34, margin: "14px 0 8px", letterSpacing: "-1px" };
const calculatorHeroText: CSSProperties = { color: "#475569", maxWidth: 780, lineHeight: 1.5, margin: 0 };
const calculatorTabs: CSSProperties = { display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 18 };

const calculatorTab: CSSProperties = {
  border: "1px solid #cbd5e1",
  background: "white",
  color: "#0f172a",
  padding: "10px 14px",
  borderRadius: 999,
  cursor: "pointer",
  fontWeight: 700
};

const calculatorTabActive: CSSProperties = {
  ...calculatorTab,
  background: "#3155d4",
  color: "white",
  border: "1px solid #3155d4",
  boxShadow: "0 12px 30px rgba(49,85,212,0.25)"
};

const calculatorGrid: CSSProperties = { display: "grid", gridTemplateColumns: "1fr 0.85fr", gap: 18 };
const calculatorInputPanel: CSSProperties = { ...panel, minHeight: 520 };
const calculatorResultPanel: CSSProperties = { ...panel, minHeight: 520, display: "flex", flexDirection: "column" };
const loanTypeGrid: CSSProperties = { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 16 };

const loanTypeButton: CSSProperties = {
  border: "1px solid #cbd5e1",
  background: "#f8fafc",
  color: "#0f172a",
  padding: "12px 10px",
  borderRadius: 14,
  cursor: "pointer",
  fontWeight: 700
};

const loanTypeActive: CSSProperties = { ...loanTypeButton, background: "#3155d4", color: "white", border: "1px solid #3155d4" };
const sliderBlock: CSSProperties = { padding: 16, borderRadius: 20, background: "#f8fafc", border: "1px solid #e2e8f0", marginBottom: 14 };
const sliderTopRow: CSSProperties = { display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", marginBottom: 12 };
const sliderValueBox: CSSProperties = { display: "flex", alignItems: "center", border: "1px solid #cbd5e1", borderRadius: 12, overflow: "hidden", background: "white" };
const sliderNumberInput: CSSProperties = { width: 110, border: 0, outline: "none", padding: "9px 10px", fontWeight: 800 };
const sliderSuffix: CSSProperties = { padding: "9px 10px", background: "#3155d4", color: "white", fontWeight: 900, fontSize: 12 };
const rangeStyle: CSSProperties = { width: "100%", accentColor: "#3155d4" };
const donutWrap: CSSProperties = { display: "flex", alignItems: "center", justifyContent: "center", gap: 20, margin: "8px 0 20px" };
const donut: CSSProperties = { width: 190, height: 190, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" };

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

const legendWrap: CSSProperties = { display: "grid", gap: 10 };
const legendItem: CSSProperties = { display: "flex", alignItems: "center", gap: 8, color: "#475569", fontWeight: 800 };
const legendDot: CSSProperties = { width: 12, height: 12, borderRadius: "50%" };
const resultMainBox: CSSProperties = { padding: 18, borderRadius: 20, background: "linear-gradient(135deg, #eef2ff, #f8fafc)", textAlign: "center", marginBottom: 10 };
const calculatorMainValue: CSSProperties = { margin: "4px 0 0", fontSize: 32, letterSpacing: "-1px" };

const insightRule: CSSProperties = {
  padding: 16,
  borderRadius: 18,
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
  marginBottom: 12,
  display: "flex",
  justifyContent: "space-between",
  gap: 12
};

const insightValue: CSSProperties = {
  whiteSpace: "nowrap",
  fontWeight: 900,
  color: "#065f46"
};

const modalBackdrop: CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000
};

const modalCard: CSSProperties = {
  background: "white",
  borderRadius: 20,
  padding: 28,
  maxWidth: 400,
  width: "90%",
  boxShadow: "0 24px 60px rgba(0,0,0,0.2)"
};

const errorToast: CSSProperties = {
  position: "fixed",
  bottom: 24,
  left: "50%",
  transform: "translateX(-50%)",
  background: "#fef2f2",
  border: "1px solid #fca5a5",
  color: "#991b1b",
  padding: "12px 20px",
  borderRadius: 14,
  zIndex: 999,
  display: "flex",
  gap: 12,
  alignItems: "center",
  fontSize: 14,
  boxShadow: "0 8px 24px rgba(0,0,0,0.1)"
};

const textButton: CSSProperties = {
  background: "none",
  border: "none",
  cursor: "pointer",
  fontSize: 18,
  color: "inherit"
};
