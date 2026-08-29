import type { Transaction } from "../../services/dashboardService";
import { deleteTransaction } from "../../services/dashboardService";

type Props = {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  refresh: () => void;
};

function TransactionTable({
  transactions,
  onEdit,
  refresh,
}: Props) {
  async function handleDelete(id?: number) {
    if (!id) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this transaction?"
    );

    if (!confirmDelete) return;

    try {
      await deleteTransaction(id);

      alert("Transaction deleted successfully!");

      refresh();

    } catch (error) {
      console.error(error);
      alert("Failed to delete transaction.");
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg mt-8 p-6">

      <h2 className="text-2xl font-bold mb-6">
        Transaction History
      </h2>

      <div className="overflow-x-auto">

        <table className="min-w-full border border-gray-200">

          <thead className="bg-gray-100">

            <tr>

              <th className="border px-4 py-3">Title</th>

              <th className="border px-4 py-3">Amount</th>

              <th className="border px-4 py-3">Type</th>

              <th className="border px-4 py-3">Category</th>

              <th className="border px-4 py-3">Date</th>

              <th className="border px-4 py-3">Notes</th>

              <th className="border px-4 py-3">Actions</th>

            </tr>

          </thead>

          <tbody>

            {transactions.length === 0 ? (

              <tr>

                <td
                  colSpan={7}
                  className="text-center py-8"
                >
                  No transactions found.
                </td>

              </tr>

            ) : (

              transactions.map((transaction) => (

                <tr
                  key={transaction.id}
                  className="hover:bg-gray-50"
                >

                  <td className="border px-4 py-3">
                    {transaction.title}
                  </td>

                  <td className="border px-4 py-3">
                    ₹{transaction.amount}
                  </td>

                  <td className="border px-4 py-3">
                    {transaction.type}
                  </td>

                  <td className="border px-4 py-3">
                    {transaction.category}
                  </td>

                  <td className="border px-4 py-3">
                    {transaction.date}
                  </td>

                  <td className="border px-4 py-3">
                    {transaction.notes}
                  </td>

                  <td className="border px-4 py-3">

                    <div className="flex gap-2">

                      <button
                        onClick={() => onEdit(transaction)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(transaction.id)
                        }
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                      >
                        Delete
                      </button>

                    </div>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default TransactionTable;