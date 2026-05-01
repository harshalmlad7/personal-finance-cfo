"use client";

import { useState } from "react";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Target,
  Landmark,
  Brain,
  Plane,
  BarChart3
} from "lucide-react";

export default function Home() {
  const [tab, setTab] = useState("home");

  const income = 75000;
  const expenses = 48250;
  const savings = income - expenses;
  const savingsRate = Math.round((savings / income) * 100);

  return (
    <main style={{ padding: 24, maxWidth: 1200, margin: "0 auto" }}>
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
        <p style={{ maxWidth: 760, opacity: 0.95 }}>
          Track spending, control loans, plan investments, manage mutual funds,
          forecast savings, build wealth, and prepare travel goals.
        </p>

        <div className="nav">
          {[
            "home",
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
              <p className="small">Total Balance</p>
              <p className="stat">₹1,23,500</p>
            </div>

            <div className="card">
              <TrendingUp />
              <p className="small">Monthly Income</p>
              <p className="stat">₹75,000</p>
            </div>

            <div className="card">
              <TrendingDown />
              <p className="small">Monthly Expense</p>
              <p className="stat">₹48,250</p>
            </div>

            <div className="card">
              <PiggyBank />
              <p className="small">Savings Rate</p>
              <p className="stat">{savingsRate}%</p>
            </div>
          </div>

          <div className="grid grid-2" style={{ marginTop: 16 }}>
            <div className="card">
              <h2>Today’s CFO Advice</h2>
              <p>
                Your savings rate is healthy, but food delivery and shopping
                should be watched closely. Keep emergency fund priority above
                lifestyle spending.
              </p>
            </div>

            <div className="card">
              <h2>Upcoming Payments</h2>
              <p>Rent: ₹22,000</p>
              <p>SIP: ₹10,000</p>
              <p>Mobile + Internet: ₹1,800</p>
            </div>
          </div>
        </>
      )}

      {tab === "cashflow" && (
        <div className="card">
          <BarChart3 />
          <h2>Cash Flow</h2>
          <p>Income: ₹75,000</p>
          <p>Expense: ₹48,250</p>
          <p>Net Savings: ₹26,750</p>
          <p>Forecast: You may save around ₹24,000–₹27,000 this month.</p>
        </div>
      )}

      {tab === "spending" && (
        <div className="card">
          <h2>Spending Funnel</h2>
          <p>Needs → Housing, Transport, Vehicle, Communication</p>
          <p>Wants → Food Delivery, Shopping, Entertainment</p>
          <p>Wealth → SIP, Mutual Funds, Emergency Fund</p>
          <p>Debt → EMI, Credit Card, Personal Loan</p>
        </div>
      )}

      {tab === "loans" && (
        <div className="card">
          <Landmark />
          <h2>Loan Intelligence</h2>
          <p>Personal Loan EMI: ₹10,182</p>
          <p>Credit Card Outstanding: ₹60,000</p>
          <p>
            Advisor: Clear high-interest credit card debt before increasing
            risky investments.
          </p>
        </div>
      )}

      {tab === "goals" && (
        <div className="card">
          <Target />
          <h2>Goals</h2>
          <p>Emergency Fund Target: ₹3,00,000</p>
          <p>Travel Fund Target: ₹2,50,000</p>
          <p>Home Fund Target: ₹10,00,000</p>
        </div>
      )}

      {tab === "mutual funds" && (
        <div className="card">
          <PiggyBank />
          <h2>Mutual Fund Portfolio</h2>
          <p>Total Invested: ₹2,40,000</p>
          <p>Current Value: ₹2,78,500</p>
          <p>Gain: ₹38,500</p>
          <p>
            Advisor mode: Educational analysis only until SEBI-compliant
            advisory integration is added.
          </p>
        </div>
      )}

      {tab === "travel" && (
        <div className="card">
          <Plane />
          <h2>Travel & Forex</h2>
          <p>Japan Trip Goal: ₹2,50,000</p>
          <p>Saved: ₹62,000</p>
          <p>Monthly Required: ₹15,667</p>
          <p>Forex engine will track currency movement daily later.</p>
        </div>
      )}

      {tab === "bi ml" && (
        <div className="card">
          <Brain />
          <h2>Business Intelligence + Machine Learning</h2>
          <p>Risk Score: 42/100</p>
          <p>Likely recurring payments detected: Rent, SIP, Internet</p>
          <p>Potential saving opportunity: ₹6,500/month</p>
          <p>ML models will later predict overspending and savings forecast.</p>
        </div>
      )}

      {tab === "advisor" && (
        <div className="card">
          <Brain />
          <h2>AI CFO Advisor</h2>
          <p>
            Ask questions like: “Can I afford a trip?”, “Should I prepay loan or
            invest?”, “Where is my money leaking?”
          </p>
          <p>
            Later this will connect to your real data and give daily financial
            actions.
          </p>
        </div>
      )}
    </main>
  );
}
