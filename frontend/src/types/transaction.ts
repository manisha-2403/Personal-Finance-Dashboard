export interface Transaction {
  id: number;
  title: string;
  amount: number;
  type: "Income" | "Expense";
  category: string;
  date: string;
  notes: string;
}