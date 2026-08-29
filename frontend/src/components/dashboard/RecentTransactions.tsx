import type { Transaction } from "../../services/dashboardService";

type RecentTransactionsProps = {
  transactions: Transaction[];
};

function RecentTransactions({
  transactions,
}: RecentTransactionsProps) {

  const recentTransactions = [...transactions]
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();

      return dateB - dateA;
    })
    .slice(0, 5);

  return (
    <div className="bg-white rounded-xl shadow p-6 mt-8">

      <div className="flex justify-between items-center mb-6">

        <div>
          <h2 className="text-2xl font-bold">
            Recent Transactions
          </h2>

          <p className="text-gray-500 mt-1">
            Your latest financial activity.
          </p>
        </div>

        <div className="text-sm text-gray-500">
          Latest 5
        </div>

      </div>

      {recentTransactions.length === 0 ? (

        <div className="text-center py-10 text-gray-500">
          No transactions available.
        </div>

      ) : (

        <div className="space-y-3">

          {recentTransactions.map((transaction) => (

            <div
              key={transaction.id}
              className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border rounded-lg p-4 hover:bg-gray-50 transition"
            >

              {/* Transaction information */}

              <div className="flex-1">

                <h3 className="font-semibold text-lg">
                  {transaction.title}
                </h3>

                <div className="flex flex-wrap gap-2 mt-1 text-sm">

                  <span className="text-gray-500">
                    {transaction.category}
                  </span>

                  <span className="text-gray-400">
                    •
                  </span>

                  <span className="text-gray-500">
                    {transaction.date}
                  </span>

                </div>

              </div>

              {/* Transaction type */}

              <div>

                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    transaction.type === "Income"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {transaction.type}
                </span>

              </div>

              {/* Amount */}

              <div
                className={`text-lg font-bold min-w-[120px] text-right ${
                  transaction.type === "Income"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {transaction.type === "Income"
                  ? "+"
                  : "-"}
                ₹{transaction.amount.toFixed(2)}
              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default RecentTransactions;