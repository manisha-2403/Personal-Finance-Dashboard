import { useEffect, useState } from "react";
import { getTransactions } from "../services/dashboardService";

type Transaction = {
  title: string;
  amount: number;
  type: string;
};

function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    loadTransactions();
  }, []);

  async function loadTransactions() {
    const data = await getTransactions();
    setTransactions(data);
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">
        Transactions
      </h1>

      <div className="space-y-4">
        {transactions.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow p-4 flex justify-between"
          >
            <div>
              <h2 className="font-bold">{item.title}</h2>
              <p>{item.type}</p>
            </div>

            <div className="font-bold text-xl">
              ₹{item.amount}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Transactions;