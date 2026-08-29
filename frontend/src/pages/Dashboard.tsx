import { useEffect, useMemo, useState } from "react";
import api from "../services/api";

import {
  getTransactions,
  exportTransactionsCSV,
} from "../services/dashboardService";

import type { Transaction } from "../services/dashboardService";

import StatCard from "../components/dashboard/StatCard";
import ExpenseChart from "../components/dashboard/ExpenseChart";
import TransactionTable from "../components/dashboard/TransactionTable";
import EditTransactionModal from "../components/dashboard/EditTransactionModal";
import RecentTransactions from "../components/dashboard/RecentTransactions";
import FinancialInsights from "../components/dashboard/FinancialInsights";



function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  const [modalOpen, setModalOpen] = useState(false);

  const [monthlyBudget, setMonthlyBudget] = useState(0);

  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );

  const [exporting, setExporting] = useState(false);

  async function loadTransactions() {
    try {
      const data = await getTransactions();
      setTransactions(data);
    } catch (error) {
      console.error("Failed to load transactions:", error);
    } finally {
      setLoading(false);
    }
  }

  async function loadBudget() {
  try {
    const response = await api.get(
      `/budget/${selectedMonth}`
    );

    if (response.data?.budget) {
      setMonthlyBudget(
        Number(response.data.budget.amount)
      );
    } else {
      setMonthlyBudget(0);
    }
  } catch (error) {
    console.error("Failed to load budget:", error);
    setMonthlyBudget(0);
  }
}

  useEffect(() => {
    async function loadDashboardData() {
      setLoading(true);

      await Promise.all([
        loadTransactions(),
        loadBudget(),
      ]);
    }

    loadDashboardData();
  }, [selectedMonth]);

  function handleEdit(transaction: Transaction) {
    setSelectedTransaction(transaction);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setSelectedTransaction(null);
  }

  async function handleExportCSV() {
    try {
      setExporting(true);

      await exportTransactionsCSV();

      alert("Transactions exported successfully!");
    } catch (error) {
      console.error("CSV export failed:", error);

      alert("Failed to export transactions.");
    } finally {
      setExporting(false);
    }
  }

  const monthlyTransactions = useMemo(() => {
    return transactions.filter((transaction) =>
      transaction.date.startsWith(selectedMonth)
    );
  }, [transactions, selectedMonth]);

  const filteredTransactions = useMemo(() => {
    return monthlyTransactions.filter((transaction) => {
      const matchesSearch = transaction.title
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesFilter =
        filter === "All"
          ? true
          : transaction.type === filter;

      return matchesSearch && matchesFilter;
    });
  }, [monthlyTransactions, search, filter]);

  const income = monthlyTransactions
    .filter(
      (transaction) => transaction.type === "Income"
    )
    .reduce(
      (sum, transaction) => sum + transaction.amount,
      0
    );

  const expense = monthlyTransactions
    .filter(
      (transaction) => transaction.type === "Expense"
    )
    .reduce(
      (sum, transaction) => sum + transaction.amount,
      0
    );

  const balance = income - expense;

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8">

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="mb-8">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <div>

            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
              Personal Finance Dashboard
            </h1>

            <p className="text-slate-500 mt-2">
              Track, analyze and manage your personal finances.
            </p>

          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">

            <div className="text-sm text-slate-500">
              Monthly Overview
            </div>

            <button
              onClick={handleExportCSV}
              disabled={exporting}
              className="bg-green-600 text-white px-4 py-2 rounded-lg
                         hover:bg-green-700 transition
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {exporting
                ? "Exporting..."
                : "Export CSV"}
            </button>

          </div>

        </div>

      </div>


      {/* ======================================
          MONTH SELECTOR
      ====================================== */}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 md:p-6 mb-8">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <div>

            <h2 className="text-xl font-bold text-slate-900">
              Financial Overview
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Select a month to view your financial activity.
            </p>

          </div>

          <input
            type="month"
            value={selectedMonth}
            onChange={(e) =>
              setSelectedMonth(e.target.value)
            }
            className="border border-slate-300 rounded-lg px-4 py-3
                       outline-none focus:ring-2 focus:ring-blue-500
                       focus:border-blue-500"
          />

        </div>

      </div>


      {/* ======================================
          STAT CARDS
      ====================================== */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">

        <StatCard
          title="Balance"
          value={`₹${balance.toFixed(2)}`}
        />

        <StatCard
          title="Income"
          value={`₹${income.toFixed(2)}`}
        />

        <StatCard
          title="Expense"
          value={`₹${expense.toFixed(2)}`}
        />

      </div>


      {/* ======================================
          EXPENSE ANALYTICS
      ====================================== */}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 md:p-6 mb-8">

        <div className="mb-5">

          <h2 className="text-xl font-bold text-slate-900">
            Expense Analytics
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Understand how your money is being spent.
          </p>

        </div>

        <ExpenseChart
          transactions={monthlyTransactions}
        />

      </div>


      {/* ======================================
          RECENT TRANSACTIONS
      ====================================== */}

      <div className="mb-8">

        <RecentTransactions
          transactions={monthlyTransactions}
        />

      </div>


      {/* ======================================
          FINANCIAL INSIGHTS
      ====================================== */}

      <div className="mb-8">

        <FinancialInsights
          transactions={monthlyTransactions}
          monthlyBudget={monthlyBudget}
        />

      </div>


      {/* ======================================
          TRANSACTION SEARCH
      ====================================== */}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 md:p-6 mb-8">

        <div className="mb-5">

          <h2 className="text-xl font-bold text-slate-900">
            All Transactions
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Search and filter your transactions.
          </p>

        </div>

        <div className="flex flex-col md:flex-row gap-4">

          <input
            type="text"
            placeholder="Search transaction..."
            className="border border-slate-300 rounded-lg p-3 flex-1
                       outline-none focus:ring-2 focus:ring-blue-500
                       focus:border-blue-500"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          <select
            className="border border-slate-300 rounded-lg p-3
                       outline-none focus:ring-2 focus:ring-blue-500"
            value={filter}
            onChange={(e) =>
              setFilter(e.target.value)
            }
          >

            <option value="All">
              All Transactions
            </option>

            <option value="Income">
              Income
            </option>

            <option value="Expense">
              Expense
            </option>

          </select>

        </div>

      </div>


      {/* ======================================
          TRANSACTION TABLE
      ====================================== */}

      {loading ? (

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-10 text-center">

          <p className="text-slate-500">
            Loading transactions...
          </p>

        </div>

      ) : (

        <TransactionTable
          transactions={filteredTransactions}
          onEdit={handleEdit}
          refresh={loadTransactions}
        />

      )}


      {/* ======================================
          EDIT TRANSACTION MODAL
      ====================================== */}

      <EditTransactionModal
        isOpen={modalOpen}
        transaction={selectedTransaction}
        onClose={closeModal}
        onSuccess={loadTransactions}
      />

    </div>
  );
}

export default Dashboard;