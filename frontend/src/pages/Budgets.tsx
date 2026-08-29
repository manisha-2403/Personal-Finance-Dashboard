import BudgetCard from "../components/dashboard/BudgetCard";

function Budgets() {
  return (
    <div className="min-h-screen bg-slate-100 p-6">

      <div className="max-w-6xl mx-auto">

        {/* PAGE HEADER */}

        <div className="mb-8">

          <h1 className="text-4xl font-bold text-slate-900">
            Budgets
          </h1>

          <p className="text-slate-500 mt-2">
            Set and manage your monthly spending budget.
          </p>

        </div>

        {/* BUDGET CARD */}

        <BudgetCard />

      </div>

    </div>
  );
}

export default Budgets;