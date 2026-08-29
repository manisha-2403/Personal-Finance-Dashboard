import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import type { Transaction } from "../../services/dashboardService";

type ExpenseChartProps = {
  transactions: Transaction[];
};

function ExpenseChart({
  transactions,
}: ExpenseChartProps) {

  const categoryTotals = transactions
    .filter((transaction) => transaction.type === "Expense")
    .reduce(
      (
        totals: Record<string, number>,
        transaction
      ) => {

        const category =
          transaction.category || "Other";

        if (!totals[category]) {
          totals[category] = 0;
        }

        totals[category] += transaction.amount;

        return totals;
      },
      {}
    );

  const chartData = Object.entries(categoryTotals)
    .map(([category, amount]) => ({
      category,
      amount,
    }))
    .sort((a, b) => b.amount - a.amount);

  return (
    <div className="bg-white rounded-xl shadow p-6 mt-8">

      <div className="mb-6">

        <h2 className="text-2xl font-bold">
          Expense by Category
        </h2>

        <p className="text-gray-500 mt-1">
          See where your money is being spent.
        </p>

      </div>

      {chartData.length === 0 ? (

        <div className="h-80 flex items-center justify-center text-gray-500">
          No expense data available.
        </div>

      ) : (

        <div className="w-full h-80">

          <ResponsiveContainer
            width="100%"
            height="100%"
          >

            <BarChart
              data={chartData}
              margin={{
                top: 10,
                right: 20,
                left: 10,
                bottom: 10,
              }}
            >

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                dataKey="category"
              />

              <YAxis />

              <Tooltip
                formatter={(value) =>
                  `₹${Number(value).toFixed(2)}`
                }
              />

              <Bar
                dataKey="amount"
                name="Expense"
                fill="#2563eb"
                radius={[6, 6, 0, 0]}
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

      )}

    </div>
  );
}

export default ExpenseChart;