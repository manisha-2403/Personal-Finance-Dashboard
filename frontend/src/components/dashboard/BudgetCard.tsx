import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import axios from "axios";

import api from "../../services/api";

import {
  getTransactions,
} from "../../services/dashboardService";

import type {
  Transaction,
} from "../../services/dashboardService";


// ==========================================
// BACKEND ERROR TYPE
// ==========================================

interface BackendError {
  detail?: string;
}


// ==========================================
// BUDGET CARD
// ==========================================

function BudgetCard() {

  // ==========================================
  // STATE
  // ==========================================

  const [budget, setBudget] = useState("");

  const [currentBudget, setCurrentBudget] =
    useState(0);

  const [transactions, setTransactions] =
    useState<Transaction[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);


  // ==========================================
  // CURRENT MONTH
  // ==========================================

  const month =
    new Date().toISOString().slice(0, 7);


  // ==========================================
  // LOAD BUDGET + TRANSACTIONS
  // ==========================================

  useEffect(() => {

    let cancelled = false;


    async function fetchData() {

      try {

        const [
          budgetResponse,
          transactionData,
        ] = await Promise.all([

          api.get(
            `/budget/${month}`
          ),

          getTransactions(),

        ]);


        if (cancelled) {
          return;
        }


        // ======================================
        // LOAD BUDGET
        // ======================================

        if (
          budgetResponse.data &&
          budgetResponse.data.budget
        ) {

          const amount =
            Number(
              budgetResponse.data.budget.amount
            );


          setCurrentBudget(amount);

          setBudget(
            amount.toString()
          );

        } else {

          setCurrentBudget(0);

          setBudget("");

        }


        // ======================================
        // LOAD TRANSACTIONS
        // ======================================

        setTransactions(
          transactionData
        );

      } catch (error: unknown) {

        if (!cancelled) {

          console.error(
            "FAILED TO LOAD BUDGET DATA:",
            error
          );


          // ====================================
          // AXIOS ERROR
          // ====================================

          if (
            axios.isAxiosError<BackendError>(
              error
            )
          ) {

            console.error(
              "STATUS:",
              error.response?.status
            );

            console.error(
              "DATA:",
              error.response?.data
            );


            if (
              error.response?.status === 401
            ) {

              console.error(
                "Authentication expired. Please login again."
              );

            }

          }

        }

      } finally {

        if (!cancelled) {

          setLoading(false);

        }

      }

    }


    fetchData();


    return () => {

      cancelled = true;

    };

  }, [month]);


  // ==========================================
  // CALCULATE MONTHLY EXPENSES
  // ==========================================

  const monthlyExpenses =
    transactions

      .filter(
        (transaction) =>
          transaction.type === "Expense" &&
          transaction.date.startsWith(
            month
          )
      )

      .reduce(
        (sum, transaction) =>
          sum +
          Number(transaction.amount),

        0
      );


  // ==========================================
  // REMAINING BUDGET
  // ==========================================

  const remaining =
    currentBudget -
    monthlyExpenses;


  // ==========================================
  // PERCENTAGE USED
  // ==========================================

  const percentageUsed =
    currentBudget > 0

      ? (
          monthlyExpenses /
          currentBudget
        ) * 100

      : 0;


  // ==========================================
  // PROGRESS BAR WIDTH
  // ==========================================

  const progressWidth =
    Math.min(
      percentageUsed,
      100
    );


  // ==========================================
  // STATUS MESSAGE
  // ==========================================

  let statusMessage =
    "Set a monthly budget to start tracking.";


  if (currentBudget > 0) {

    if (percentageUsed >= 100) {

      statusMessage =
        "⚠ Budget exceeded!";

    } else if (percentageUsed >= 80) {

      statusMessage =
        "⚠ You're close to your budget limit.";

    } else {

      statusMessage =
        "✓ You're within your budget.";

    }

  }


  // ==========================================
  // SAVE / UPDATE BUDGET
  // ==========================================

  async function handleSave(
    e: FormEvent
  ) {

    e.preventDefault();


    const amount =
      Number(budget);


    // ========================================
    // VALIDATE AMOUNT
    // ========================================

    if (
      !Number.isFinite(amount) ||
      amount <= 0
    ) {

      alert(
        "Please enter a valid budget."
      );

      return;

    }


    try {

      setSaving(true);


      console.log(
        "Saving budget:",
        {
          month,
          amount,
        }
      );


      // ======================================
      // SAVE BUDGET
      // ======================================

      const response =
        await api.post(
          "/budget",
          {
            month,
            amount,
          }
        );


      console.log(
        "Budget save response:",
        response.data
      );


      // ======================================
      // UPDATE UI IMMEDIATELY
      // ======================================

      setCurrentBudget(
        amount
      );

      setBudget(
        amount.toString()
      );


      alert(
        "Monthly budget saved successfully!"
      );


    } catch (error: unknown) {

      console.error(
        "FAILED TO SAVE BUDGET:",
        error
      );


      // ======================================
      // AXIOS ERROR
      // ======================================

      if (
        axios.isAxiosError<BackendError>(
          error
        )
      ) {

        const status =
          error.response?.status;

        const detail =
          error.response?.data?.detail;


        console.error(
          "STATUS:",
          status
        );

        console.error(
          "DATA:",
          error.response?.data
        );


        if (detail) {

          alert(
            `Failed to save budget: ${detail}`
          );

        } else if (status) {

          alert(
            `Failed to save budget. Server returned ${status}.`
          );

        } else {

          alert(
            "Failed to save budget. Please check the backend."
          );

        }

      } else {

        // ====================================
        // NON-AXIOS ERROR
        // ====================================

        alert(
          "Failed to save budget. Please try again."
        );

      }

    } finally {

      setSaving(false);

    }

  }


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (

      <div className="bg-white rounded-xl shadow p-6 mt-8">

        <p className="text-center text-gray-500">

          Loading budget...

        </p>

      </div>

    );

  }


  // ==========================================
  // UI
  // ==========================================

  return (

    <div className="bg-white rounded-xl shadow p-6 mt-8">

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="flex justify-between items-center mb-6">

        <div>

          <h2 className="text-2xl font-bold">

            Monthly Budget

          </h2>

          <p className="text-gray-500">

            {month}

          </p>

        </div>


        <div className="text-2xl font-bold text-blue-600">

          ₹{currentBudget.toFixed(2)}

        </div>

      </div>


      {/* ======================================
          BUDGET STATISTICS
      ====================================== */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">


        {/* BUDGET */}

        <div className="bg-blue-50 rounded-lg p-4">

          <p className="text-sm text-gray-500">

            Budget

          </p>

          <p className="text-xl font-bold">

            ₹{currentBudget.toFixed(2)}

          </p>

        </div>


        {/* SPENT */}

        <div className="bg-red-50 rounded-lg p-4">

          <p className="text-sm text-gray-500">

            Spent

          </p>

          <p className="text-xl font-bold">

            ₹{monthlyExpenses.toFixed(2)}

          </p>

        </div>


        {/* REMAINING */}

        <div className="bg-green-50 rounded-lg p-4">

          <p className="text-sm text-gray-500">

            Remaining

          </p>

          <p
            className={`text-xl font-bold ${
              remaining < 0
                ? "text-red-600"
                : "text-green-600"
            }`}
          >

            ₹{remaining.toFixed(2)}

          </p>

        </div>

      </div>


      {/* ======================================
          PROGRESS BAR
      ====================================== */}

      {currentBudget > 0 && (

        <div className="mb-6">

          <div className="flex justify-between mb-2">

            <span className="font-medium">

              Budget Used

            </span>


            <span className="font-bold">

              {percentageUsed.toFixed(1)}%

            </span>

          </div>


          <div className="w-full bg-gray-200 rounded-full h-4">

            <div
              className="bg-blue-600 h-4 rounded-full transition-all duration-500"
              style={{
                width:
                  `${progressWidth}%`,
              }}
            />

          </div>

        </div>

      )}


      {/* ======================================
          STATUS
      ====================================== */}

      <div
        className={`rounded-lg p-4 mb-6 ${
          percentageUsed >= 100
            ? "bg-red-100 text-red-700"
            : percentageUsed >= 80
            ? "bg-yellow-100 text-yellow-700"
            : "bg-green-100 text-green-700"
        }`}
      >

        {statusMessage}

      </div>


      {/* ======================================
          UPDATE BUDGET FORM
      ====================================== */}

      <form
        onSubmit={handleSave}
        className="flex flex-col md:flex-row gap-4"
      >

        <input
          type="number"
          min="1"
          step="0.01"
          placeholder="Enter monthly budget"
          value={budget}
          onChange={(e) =>
            setBudget(
              e.target.value
            )
          }
          className="flex-1 border rounded-lg p-3"
        />


        <button
          type="submit"
          disabled={saving}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >

          {saving
            ? "Saving..."
            : "Update Budget"}

        </button>

      </form>

    </div>

  );

}


export default BudgetCard;