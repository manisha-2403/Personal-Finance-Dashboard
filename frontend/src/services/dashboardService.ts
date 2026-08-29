import axios from "axios";
import api from "./api";

// ==========================================
// TRANSACTION TYPE
// ==========================================

export type Transaction = {
  id?: number;
  title: string;
  amount: number;
  type: string;
  category: string;
  date: string;
  notes: string;
};

// ==========================================
// GET ALL TRANSACTIONS
// ==========================================

export async function getTransactions(): Promise<Transaction[]> {
  const response = await api.get("/transactions");

  return response.data;
}

// ==========================================
// ADD TRANSACTION
// ==========================================

export async function addTransaction(
  transaction: Omit<Transaction, "id">
): Promise<Transaction> {
  try {
    const response = await api.post(
      "/transactions",
      transaction
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "ADD TRANSACTION ERROR:",
        error.response?.status,
        error.response?.data
      );
    } else {
      console.error(
        "ADD TRANSACTION ERROR:",
        error
      );
    }

    throw error;
  }
}

// ==========================================
// UPDATE TRANSACTION
// ==========================================

export async function updateTransaction(
  id: number,
  transaction: Transaction
): Promise<Transaction> {
  const response = await api.put(
    `/transactions/${id}`,
    transaction
  );

  return response.data;
}

// ==========================================
// DELETE TRANSACTION
// ==========================================

export async function deleteTransaction(
  id: number
) {
  const response = await api.delete(
    `/transactions/${id}`
  );

  return response.data;
}

// ==========================================
// EXPORT TRANSACTIONS TO CSV
// ==========================================

export async function exportTransactionsCSV() {
  const response = await api.get(
    "/transactions/export/csv",
    {
      responseType: "blob",
    }
  );

  const blob = new Blob(
    [response.data],
    {
      type: "text/csv",
    }
  );

  const url =
    window.URL.createObjectURL(blob);

  const link =
    document.createElement("a");

  link.href = url;

  link.download =
    "finance_transactions.csv";

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);

  window.URL.revokeObjectURL(url);
}

// ==========================================
// DASHBOARD SUMMARY
// ==========================================

export type DashboardSummary = {
  balance: number;
  income: number;
  expenses: number;
  savings: number;
  totalTransactions: number;
};

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const response = await api.get(
    "/api/dashboard"
  );

  return response.data;
};