import { useEffect, useMemo, useState } from "react";

import {
  getTransactions,
} from "../services/dashboardService";

import type {
  Transaction,
} from "../services/dashboardService";


function Reports() {
  const [transactions, setTransactions] =
    useState<Transaction[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [selectedMonth, setSelectedMonth] =
    useState(
      new Date().toISOString().slice(0, 7)
    );


  // ==========================================
  // LOAD TRANSACTIONS
  // ==========================================

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);

        const data =
          await getTransactions();

        setTransactions(data);

      } catch (error) {
        console.error(
          "Failed to load report data:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);


  // ==========================================
  // MONTHLY TRANSACTIONS
  // ==========================================

  const monthlyTransactions =
    useMemo(() => {
      return transactions.filter(
        (transaction) =>
          transaction.date.startsWith(
            selectedMonth
          )
      );
    }, [
      transactions,
      selectedMonth,
    ]);


  // ==========================================
  // TOTAL INCOME
  // ==========================================

  const income =
    monthlyTransactions
      .filter(
        (transaction) =>
          transaction.type === "Income"
      )
      .reduce(
        (sum, transaction) =>
          sum + Number(transaction.amount),
        0
      );


  // ==========================================
  // TOTAL EXPENSE
  // ==========================================

  const expense =
    monthlyTransactions
      .filter(
        (transaction) =>
          transaction.type === "Expense"
      )
      .reduce(
        (sum, transaction) =>
          sum + Number(transaction.amount),
        0
      );


  // ==========================================
  // BALANCE
  // ==========================================

  const balance =
    income - expense;


  // ==========================================
  // SAVINGS RATE
  // ==========================================

  const savingsRate =
    income > 0
      ? (balance / income) * 100
      : 0;


  // ==========================================
  // EXPENSE BY CATEGORY
  // ==========================================

  const categoryExpenses =
    useMemo(() => {

      const categoryMap: Record<
        string,
        number
      > = {};

      monthlyTransactions
        .filter(
          (transaction) =>
            transaction.type === "Expense"
        )
        .forEach(
          (transaction) => {

            const category =
              transaction.category ||
              "Other";

            categoryMap[category] =
              (categoryMap[category] || 0) +
              Number(transaction.amount);
          }
        );

      return Object.entries(categoryMap)
        .sort(
          (a, b) => b[1] - a[1]
        );

    }, [
      monthlyTransactions,
    ]);


  // ==========================================
  // HIGHEST EXPENSE CATEGORY
  // ==========================================

  const highestCategory =
    categoryExpenses.length > 0
      ? categoryExpenses[0]
      : null;


  // ==========================================
  // FORMAT CURRENCY
  // ==========================================

  function formatCurrency(
    amount: number
  ) {
    return `₹${amount.toFixed(2)}`;
  }


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 p-6 md:p-8">

        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-10 text-center">

          <p className="text-slate-500">
            Loading reports...
          </p>

        </div>

      </div>
    );
  }


  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8">

      <div className="max-w-6xl mx-auto">

        {/* ======================================
            HEADER
        ====================================== */}

        <div className="mb-8">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <div>

              <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
                Financial Reports
              </h1>

              <p className="text-slate-500 mt-2">
                Analyze your income, expenses and spending patterns.
              </p>

            </div>


            {/* MONTH SELECTOR */}

            <input
              type="month"
              value={selectedMonth}
              onChange={(e) =>
                setSelectedMonth(
                  e.target.value
                )
              }
              className="border border-slate-300 rounded-lg px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>

        </div>


        {/* ======================================
            SUMMARY CARDS
        ====================================== */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">


          {/* INCOME */}

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

            <p className="text-sm text-slate-500">
              Total Income
            </p>

            <p className="text-2xl font-bold text-green-600 mt-2">
              {formatCurrency(income)}
            </p>

          </div>


          {/* EXPENSE */}

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

            <p className="text-sm text-slate-500">
              Total Expenses
            </p>

            <p className="text-2xl font-bold text-red-600 mt-2">
              {formatCurrency(expense)}
            </p>

          </div>


          {/* BALANCE */}

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

            <p className="text-sm text-slate-500">
              Net Balance
            </p>

            <p
              className={`text-2xl font-bold mt-2 ${
                balance >= 0
                  ? "text-blue-600"
                  : "text-red-600"
              }`}
            >
              {formatCurrency(balance)}
            </p>

          </div>


          {/* SAVINGS RATE */}

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

            <p className="text-sm text-slate-500">
              Savings Rate
            </p>

            <p
              className={`text-2xl font-bold mt-2 ${
                savingsRate >= 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {savingsRate.toFixed(1)}%
            </p>

          </div>

        </div>


        {/* ======================================
            REPORT OVERVIEW
        ====================================== */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">


          {/* MONTHLY SUMMARY */}

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

            <h2 className="text-xl font-bold text-slate-900">
              Monthly Summary
            </h2>

            <p className="text-sm text-slate-500 mt-1 mb-6">
              Financial activity for {selectedMonth}.
            </p>


            <div className="space-y-4">

              <div className="flex justify-between border-b pb-3">

                <span className="text-slate-600">
                  Transactions
                </span>

                <span className="font-bold">
                  {monthlyTransactions.length}
                </span>

              </div>


              <div className="flex justify-between border-b pb-3">

                <span className="text-slate-600">
                  Income
                </span>

                <span className="font-semibold text-green-600">
                  {formatCurrency(income)}
                </span>

              </div>


              <div className="flex justify-between border-b pb-3">

                <span className="text-slate-600">
                  Expenses
                </span>

                <span className="font-semibold text-red-600">
                  {formatCurrency(expense)}
                </span>

              </div>


              <div className="flex justify-between">

                <span className="font-medium text-slate-900">
                  Net Balance
                </span>

                <span
                  className={`font-bold ${
                    balance >= 0
                      ? "text-blue-600"
                      : "text-red-600"
                  }`}
                >
                  {formatCurrency(balance)}
                </span>

              </div>

            </div>

          </div>


          {/* SPENDING INSIGHT */}

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

            <h2 className="text-xl font-bold text-slate-900">
              Spending Insight
            </h2>

            <p className="text-sm text-slate-500 mt-1 mb-6">
              Your biggest spending category this month.
            </p>


            {highestCategory ? (

              <div className="bg-slate-50 rounded-xl p-5">

                <p className="text-sm text-slate-500">
                  Highest Expense Category
                </p>

                <p className="text-2xl font-bold text-slate-900 mt-2">
                  {highestCategory[0]}
                </p>

                <p className="text-xl font-semibold text-red-600 mt-2">
                  {formatCurrency(
                    highestCategory[1]
                  )}
                </p>


                {expense > 0 && (
                  <p className="text-sm text-slate-500 mt-2">
                    {(
                      (highestCategory[1] /
                        expense) *
                      100
                    ).toFixed(1)}
                    % of your total expenses
                  </p>
                )}

              </div>

            ) : (

              <div className="bg-slate-50 rounded-xl p-5">

                <p className="text-slate-500">
                  No expense data available for this month.
                </p>

              </div>

            )}

          </div>

        </div>


        {/* ======================================
            CATEGORY REPORT
        ====================================== */}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-8">

          <div className="mb-6">

            <h2 className="text-xl font-bold text-slate-900">
              Spending by Category
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              See where your money is going.
            </p>

          </div>


          {categoryExpenses.length === 0 ? (

            <div className="bg-slate-50 rounded-xl p-8 text-center">

              <p className="text-slate-500">
                No expense transactions found for this month.
              </p>

            </div>

          ) : (

            <div className="space-y-5">

              {categoryExpenses.map(
                ([category, amount]) => {

                  const percentage =
                    expense > 0
                      ? (amount / expense) *
                        100
                      : 0;

                  return (

                    <div
                      key={category}
                    >

                      <div className="flex justify-between items-center mb-2">

                        <span className="font-medium text-slate-700">
                          {category}
                        </span>

                        <span className="font-semibold text-slate-900">
                          {formatCurrency(
                            amount
                          )}
                        </span>

                      </div>


                      <div className="w-full bg-slate-200 rounded-full h-3">

                        <div
                          className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.min(
                              percentage,
                              100
                            )}%`,
                          }}
                        />

                      </div>


                      <p className="text-xs text-slate-500 mt-1">
                        {percentage.toFixed(1)}%
                        {" "}of expenses
                      </p>

                    </div>

                  );
                }
              )}

            </div>

          )}

        </div>


        {/* ======================================
            TRANSACTION REPORT
        ====================================== */}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

          <div className="mb-6">

            <h2 className="text-xl font-bold text-slate-900">
              Monthly Transactions
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Transactions included in this report.
            </p>

          </div>


          {monthlyTransactions.length === 0 ? (

            <div className="bg-slate-50 rounded-xl p-8 text-center">

              <p className="text-slate-500">
                No transactions found for {selectedMonth}.
              </p>

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full text-left">

                <thead>

                  <tr className="border-b border-slate-200">

                    <th className="py-3 px-3 text-sm text-slate-500">
                      Date
                    </th>

                    <th className="py-3 px-3 text-sm text-slate-500">
                      Title
                    </th>

                    <th className="py-3 px-3 text-sm text-slate-500">
                      Category
                    </th>

                    <th className="py-3 px-3 text-sm text-slate-500">
                      Type
                    </th>

                    <th className="py-3 px-3 text-sm text-slate-500 text-right">
                      Amount
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {monthlyTransactions.map(
                    (transaction) => (

                      <tr
                        key={transaction.id}
                        className="border-b border-slate-100 hover:bg-slate-50"
                      >

                        <td className="py-3 px-3 text-sm">
                          {transaction.date}
                        </td>

                        <td className="py-3 px-3 font-medium">
                          {transaction.title}
                        </td>

                        <td className="py-3 px-3 text-slate-600">
                          {transaction.category}
                        </td>

                        <td
                          className={`py-3 px-3 font-medium ${
                            transaction.type ===
                            "Income"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {transaction.type}
                        </td>

                        <td
                          className={`py-3 px-3 text-right font-semibold ${
                            transaction.type ===
                            "Income"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {transaction.type ===
                          "Income"
                            ? "+"
                            : "-"}
                          {formatCurrency(
                            Number(
                              transaction.amount
                            )
                          )}
                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>

    </div>
  );
}

export default Reports;