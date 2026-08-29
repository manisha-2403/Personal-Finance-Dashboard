import { NavLink } from "react-router-dom";

function Sidebar() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `block rounded-lg px-4 py-2 transition ${
      isActive
        ? "bg-blue-600 text-white"
        : "text-gray-300 hover:bg-slate-800 hover:text-white"
    }`;

  return (
    <aside className="w-64 h-screen bg-slate-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-8">
        💰 Finance Dashboard
      </h1>

      <nav className="space-y-2">
        <NavLink to="/dashboard" className={linkClass}>
          Dashboard
        </NavLink>

        <NavLink to="/transactions" className={linkClass}>
          Transactions
        </NavLink>

        <NavLink to="/budgets" className={linkClass}>
          Budgets
        </NavLink>

        <NavLink to="/reports" className={linkClass}>
          Reports
        </NavLink>
        <NavLink to="/profile" className={linkClass}>
  Profile
</NavLink>

        <NavLink to="/settings" className={linkClass}>
          Settings
        </NavLink>
      </nav>
    </aside>
  );
}

export default Sidebar;