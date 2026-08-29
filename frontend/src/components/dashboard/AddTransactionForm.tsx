import { useState } from "react";
import { addTransaction } from "../../services/dashboardService";

type Props = {
  onSuccess?: () => void;
};

function AddTransactionForm({ onSuccess }: Props) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("Expense");
  const [category, setCategory] = useState("Food");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");

  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!title.trim()) {
      alert("Please enter a transaction title.");
      return;
    }

    if (!amount || Number(amount) <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    if (!date) {
      alert("Please select a date.");
      return;
    }

    try {
      setSaving(true);

      await addTransaction({
        title: title.trim(),
        amount: Number(amount),
        type,
        category,
        date,
        notes: notes.trim(),
      });

      alert("Transaction added successfully!");

      setTitle("");
      setAmount("");
      setType("Expense");
      setCategory("Food");
      setDate("");
      setNotes("");

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error(
        "Failed to add transaction:",
        error
      );

      console.error(
        "Backend response:",
        error?.response?.data
      );

      const message =
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        "Failed to add transaction.";

      alert(message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-white rounded-xl shadow p-6">

      <h2 className="text-2xl font-bold mb-6">
        Add Transaction
      </h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >

        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
          className="w-full border rounded-lg p-3"
          required
        />

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) =>
            setAmount(e.target.value)
          }
          className="w-full border rounded-lg p-3"
          min="0.01"
          step="0.01"
          required
        />

        <select
          value={type}
          onChange={(e) =>
            setType(e.target.value)
          }
          className="w-full border rounded-lg p-3"
        >

          <option value="Income">
            Income
          </option>

          <option value="Expense">
            Expense
          </option>

        </select>

        <select
          value={category}
          onChange={(e) =>
            setCategory(e.target.value)
          }
          className="w-full border rounded-lg p-3"
        >

          <option value="Food">
            Food
          </option>

          <option value="Transport">
            Transport
          </option>

          <option value="Shopping">
            Shopping
          </option>

          <option value="Bills">
            Bills
          </option>

          <option value="Salary">
            Salary
          </option>

          <option value="Investment">
            Investment
          </option>

          <option value="Entertainment">
            Entertainment
          </option>

          <option value="Health">
            Health
          </option>

          <option value="Education">
            Education
          </option>

          <option value="Other">
            Other
          </option>

        </select>

        <input
          type="date"
          value={date}
          onChange={(e) =>
            setDate(e.target.value)
          }
          className="w-full border rounded-lg p-3"
          required
        />

        <textarea
          placeholder="Notes"
          value={notes}
          onChange={(e) =>
            setNotes(e.target.value)
          }
          className="w-full border rounded-lg p-3"
          rows={4}
        />

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-blue-600 text-white rounded-lg py-3 hover:bg-blue-700 transition disabled:opacity-50"
        >

          {saving
            ? "Saving..."
            : "Save Transaction"}

        </button>

      </form>

    </div>
  );
}

export default AddTransactionForm;