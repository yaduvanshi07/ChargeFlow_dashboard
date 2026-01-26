"use client";

import { useState, useEffect } from "react";
import "./activity.css";

interface Transaction {
  type: "Charging Session" | "Weekly Payout";
  chargerName?: string;
  dateTime: string;
  customerName?: string;
  bankInfo?: string;
  amount: string;
  isPositive: boolean;
}

const transactions: Transaction[] = [
  {
    type: "Charging Session",
    chargerName: "Premium DC Charger",
    dateTime: "Today, 10:00 AM:",
    customerName: "Priya Singh",
    amount: "+₹450",
    isPositive: true,
  },
  {
    type: "Charging Session",
    chargerName: "Premium AC Charger",
    dateTime: "Yesterday, 06:00 PM",
    customerName: "Amit Sharma",
    amount: "+₹320",
    isPositive: true,
  },
  {
    type: "Weekly Payout",
    bankInfo: "Bank Transfer - HDFC Bank",
    dateTime: "7 Dec 2024",
    amount: "-₹8,240",
    isPositive: false,
  },
];

export default function RecentTransactions() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="transactions-container">
      {/* Title (outside card) */}
      <h2 className="transactions-title">
        Recent Transactions
      </h2>

      {/* Card container */}
      <div className="transactions-card">
        {/* Transactions List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {transactions.map((transaction, index) => (
            <div key={index} className="transaction-item">
              {/* Icon */}
              <div className="transaction-icon">
                {isMounted && (
                  <>
                    {transaction.type === "Charging Session" ? (
                      <span 
                        className="iconify transaction-icon-size" 
                        data-icon="material-symbols:ev-charger-rounded"
                        style={{ color: "#FFFFFF" }}
                      />
                    ) : (
                      <span 
                        className="iconify transaction-icon-size" 
                        data-icon="ri:bank-fill"
                        style={{ color: "#FFFFFF" }}
                      />
                    )}
                  </>
                )}
              </div>

              {/* Details */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="transaction-type">
                  {transaction.type}
                </div>
                {transaction.chargerName && (
                  <div className="transaction-charger-name">
                    {transaction.chargerName}
                  </div>
                )}
                 {transaction.bankInfo && (
                  <div className="transaction-text" style={{ marginBottom: 0 }}>
                    {transaction.bankInfo}
                  </div>
                )}
                <div className="transaction-datetime">
                  {transaction.dateTime}
                </div>
                {transaction.customerName && (
                  <div className="transaction-customer">
                    <span className="transaction-customer-label">Name: </span>
                    <span className="transaction-customer-value">{transaction.customerName}</span>
                  </div>
                )}
                
              </div>

              {/* Amount */}
              <div style={{ display: "flex", alignItems: "center" }}>
                <div className="transaction-amount">
                  {transaction.amount}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

