import { useEffect, useState } from "react";
import { updateTransaction } from "../../services/dashboardService";
import type { Transaction } from "../../services/dashboardService";

type EditTransactionModalProps = {
  isOpen: boolean;
  transaction: Transaction | null;
  onClose: () => void;
  onSuccess: () => void;
};

function EditTransactionModal({
  isOpen,
  transaction,
  onClose,
  onSuccess,
}: EditTransactionModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    amount: 0,
    type: "Income",
    category: "",
    date: "",
    notes: "",
  });

  useEffect(() => {
    if (transaction) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        title: transaction.title,
        amount: transaction.amount,
        type: transaction.type,
        category: transaction.category,
        date: transaction.date,
        notes: transaction.notes,
      });
    }
  }, [transaction]);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "amount" ? Number(value) : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!transaction?.id) {
      return;
    }

    try {
      await updateTransaction(transaction.id, {
        id: transaction.id,
        ...formData,
      });

      alert("Transaction updated successfully.");

      onSuccess();
      onClose();
    } catch (error) {
      console.error("UPDATE TRANSACTION ERROR:", error);

      alert("Failed to update transaction.");
    }
  }

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">

        <h2 className="text-2xl font-bold mb-6">
          Edit Transaction
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          {/* TITLE */}
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Title"
            className="w-full border rounded-lg p-3"
            required
          />

          {/* AMOUNT */}
          <input
            name="amount"
            type="number"
            value={formData.amount}
            onChange={handleChange}
            placeholder="Amount"
            className="w-full border rounded-lg p-3"
            required
          />

          {/* TYPE */}
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          >
            <option value="Income">
              Income
            </option>

            <option value="Expense">
              Expense
            </option>
          </select>

          {/* CATEGORY */}
          <input
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="Category"
            className="w-full border rounded-lg p-3"
            required
          />

          {/* DATE */}
          <input
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            required
          />

          {/* NOTES */}
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Notes"
            className="w-full border rounded-lg p-3"
            rows={4}
          />

          {/* BUTTONS */}
          <div className="flex justify-end gap-3">

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-lg bg-gray-500 text-white hover:bg-gray-600"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              Save Changes
            </button>

          </div>

        </form>

      </div>
    </div>
  );
}

export default EditTransactionModal;