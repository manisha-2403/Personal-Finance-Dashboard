import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "../ui/Button";
import Modal from "../ui/Modal";
import AddTransactionForm from "../dashboard/AddTransactionForm";

import { logoutUser } from "../../services/authService";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();

  function handleLogout() {
    logoutUser();

    navigate("/login");
  }

  return (
    <>
      <header className="bg-white shadow px-8 py-5 flex justify-between items-center">

        <div>
          <h1 className="text-4xl font-bold">
            Personal Finance Dashboard
          </h1>

          <p className="text-gray-500 mt-1">
            Manage your finances smarter 💰
          </p>
        </div>

        <div className="flex items-center gap-3">

          <Button
            text="+ Add Transaction"
            onClick={() => setIsOpen(true)}
          />

          <button
            type="button"
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-100 transition"
          >
            Logout
          </button>

        </div>

      </header>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <AddTransactionForm />
      </Modal>
    </>
  );
}

export default Navbar;