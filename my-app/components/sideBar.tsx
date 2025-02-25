"use client";
import { motion } from "framer-motion";
import {
  Settings,
  Wallet,
  ListOrdered,
  CreditCard,
  HelpCircle,
} from "lucide-react";
import { useState } from "react";
import TransactionList from "./transactionList";
import Welcome from "./welcome";
import { AddRequest } from "./addRequest";
import { ManageRequests } from "./manageRequests";
import TransactionsPage from "./transactinsPage";
const SideBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeComponent, setActiveComponent] = useState<string | null>(null);

  const sidebarVariants = {
    open: { x: 0, opacity: 1 },
    closed: { x: "100%", opacity: 0 },
  };

  const menuItems = [
    {
      id: "request",
      title: "درخواست شارژ تنخواه",
      icon: <Wallet className="w-6 h-6" />,
    },
    
    {
      id: "transactionOut",
      title: "پرداختی‌ها",
      icon: <ListOrdered className="w-6 h-6" />,
    },
    {
      id: "payment",
      title: "ثبت پرداخت",
      icon: <CreditCard className="w-6 h-6" />,
    },
    { id: "help", title: "راهنمایی", icon: <HelpCircle className="w-6 h-6" /> },
    {
      id: "manageRequests",
      title: "مدیریت درخواست‌ها",
      icon: <Settings className="w-6 h-6" />,
      
    }
  ];
  const handleMenuClick = (id: string) => {
    setActiveComponent(id);
    setIsOpen(false);
  };

  const renderComponent = () => {
    switch (activeComponent) {
      case "transactionIn":
        return <TransactionList type={"incomes"} />;
      case "transactionOut":
        return <TransactionList type={"outcomes"} />;
      case "payment":
      return  <TransactionsPage />;
      case "request":
        return <AddRequest />;
      case "manageRequests":
        return <ManageRequests />;
      default:
        return null;
    }
  };

  return (
    <>
     {activeComponent==null&& <Welcome />}
      {renderComponent()}

      <button
        onClick={() => setIsOpen(true)}
        className="fixed right-6 bottom-6 rounded-full bg-[#4361ee] p-3 text-white hover:animate-spin hover:bg-blue-700 transition-all duration-300"
      >
        <Settings className="h-6 w-6" />
      </button>

      <motion.div
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        variants={sidebarVariants}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl"
        dir="rtl"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-[#4361ee] border-b pb-3 border-[#4361ee]">
              تنظیمات
            </h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-600 hover:text-gray-800"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            {menuItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="flex group items-center gap-4 p-3 rounded-lg hover:bg-blue-500 cursor-pointer transition-colors"
                onClick={() => handleMenuClick(item.id)}
              >
                <span className="text-gray-500 group-hover:text-white/70">
                  {item.icon}
                </span>

                <span className="text-gray-600 font-bold group-hover:text-white">
                  {item.title}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </>
  );
};
export default SideBar;
