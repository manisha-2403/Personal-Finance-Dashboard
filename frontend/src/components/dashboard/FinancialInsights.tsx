import type { Transaction } from "../../services/dashboardService";

type FinancialInsightsProps = {
  transactions: Transaction[];
  monthlyBudget: number;
};

function FinancialInsights({
  transactions,
  monthlyBudget,
}: FinancialInsightsProps) {

  const income = transactions
    .filter((transaction) => transaction.type === "Income")
    .reduce(
      (sum, transaction) =>
        sum + transaction.amount,
      0
    );

  const expenses = transactions
    .filter((transaction) => transaction.type === "Expense")
    .reduce(
      (sum, transaction) =>
        sum + transaction.amount,
      0
    );

  const savings = income - expenses;

  const savingsRate =
    income > 0
      ? (savings / income) * 100
      : 0;

  const categoryTotals =
    transactions
      .filter(
        (transaction) =>
          transaction.type === "Expense"
      )
      .reduce(
        (
          totals: Record<string, number>,
          transaction
        ) => {

          const category =
            transaction.category || "Other";

          totals[category] =
            (totals[category] || 0) +
            transaction.amount;

          return totals;
        },
        {}
      );

  const categoryEntries =
    Object.entries(categoryTotals);

  const highestCategory =
    categoryEntries.length > 0
      ? categoryEntries.sort(
          (a, b) => b[1] - a[1]
        )[0]
      : null;

  const budgetUsed =
    monthlyBudget > 0
      ? (expenses / monthlyBudget) * 100
      : 0;

  let budgetMessage =
    "Set a monthly budget to receive budget alerts.";

  let budgetClass =
    "bg-gray-100 text-gray-700";

  if (monthlyBudget > 0) {

    if (budgetUsed >= 100) {

      budgetMessage =
        "⚠ You have exceeded your monthly budget.";

      budgetClass =
        "bg-red-100 text-red-700";

    } else if (budgetUsed >= 80) {

      budgetMessage =
        "⚠ You have used more than 80% of your monthly budget.";

      budgetClass =
        "bg-yellow-100 text-yellow-700";

    } else {

      budgetMessage =
        "✓ Your spending is currently within your budget.";

      budgetClass =
        "bg-green-100 text-green-700";
    }
  }

  let savingsMessage =
    "Start recording income and expenses to track your savings.";

  if (income > 0) {

    if (savingsRate >= 30) {

      savingsMessage =
        "Excellent! You are saving more than 30% of your income.";

    } else if (savingsRate >= 20) {

      savingsMessage =
        "Good job! You are maintaining a healthy savings rate.";

    } else if (savingsRate > 0) {

      savingsMessage =
        "You are saving money, but there may be room to increase your savings.";

    } else {

      savingsMessage =
        "⚠ Your expenses are currently equal to or higher than your income.";
    }
  }

  return (
    <div className="bg-white rounded-xl shadow p-6 mt-8">

      <div className="mb-6">

        <h2 className="text-2xl font-bold">
          Financial Insights
        </h2>

        <p className="text-gray-500 mt-1">
          Automatic analysis of your financial activity.
        </p>

      </div>

      {/* Insight Cards */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Savings */}

        <div className="bg-green-50 rounded-lg p-5">

          <p className="text-sm text-gray-500">
            Savings
          </p>

          <p className="text-2xl font-bold text-green-600 mt-2">
            ₹{savings.toFixed(2)}
          </p>

          <p className="text-sm text-gray-600 mt-2">
            Savings rate: {savingsRate.toFixed(1)}%
          </p>

        </div>

        {/* Highest Category */}

        <div className="bg-blue-50 rounded-lg p-5">

          <p className="text-sm text-gray-500">
            Highest Spending Category
          </p>

          {highestCategory ? (

            <>
              <p className="text-2xl font-bold text-blue-600 mt-2">
                {highestCategory[0]}
              </p>

              <p className="text-sm text-gray-600 mt-2">
                ₹{highestCategory[1].toFixed(2)} spent
              </p>
            </>

          ) : (

            <p className="text-gray-500 mt-2">
              No expense data yet.
            </p>

          )}

        </div>

        {/* Total Expenses */}

        <div className="bg-red-50 rounded-lg p-5">

          <p className="text-sm text-gray-500">
            Total Expenses
          </p>

          <p className="text-2xl font-bold text-red-600 mt-2">
            ₹{expenses.toFixed(2)}
          </p>

          <p className="text-sm text-gray-600 mt-2">
            Across all recorded transactions
          </p>

        </div>

      </div>

      {/* Budget Alert */}

      <div
        className={`rounded-lg p-4 mt-6 ${budgetClass}`}
      >
        <p className="font-semibold">
          Budget Status
        </p>

        <p className="mt-1">
          {budgetMessage}
        </p>

      </div>

      {/* Savings Insight */}

      <div className="bg-indigo-50 text-indigo-700 rounded-lg p-4 mt-4">

        <p className="font-semibold">
          Savings Insight
        </p>

        <p className="mt-1">
          {savingsMessage}
        </p>

      </div>

    </div>
  );
}

export default FinancialInsights;