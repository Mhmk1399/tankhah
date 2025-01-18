"use client";
import { motion } from "framer-motion";
import { format } from "date-fns-jalali"; // For Persian date formatting
import { useEffect, useState } from "react";
import PersianDatePicker from "../components/calender";
import { DateObject } from "react-multi-date-picker";

interface TransactionListProps {
  type: "incomes" | "outcomes";
}
interface Category {
  _id: string;
  name: string;
  color: string;
  user: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface Recipient {
  _id: string;
  name: string;
  phoneNumber: number;
  user: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface Transaction {
  _id: string;
  amount: number;
  description: string;
  category: Category;
  date: string;
  user: string;
  recipient: Recipient;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface StartDate {
  year: number;
  month: number;
  day: number;
}

const TransactionList: React.FC<TransactionListProps> = ({ type }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isNameModalOpen, setNameModalOpen] = useState(false);
  const [isDateModalOpen, setDateModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  const [startDate, setStartDate] = useState<StartDate>({
    year: 1402,
    month: 1,
    day: 1,
  });
  const [endDate, setEndDate] = useState<StartDate>({
    year: 1402,
    month: 1,
    day: 1,
  });

  const [filterName, setFilterName] = useState("");
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  const [originalTransactions, setOriginalTransactions] =
    useState(transactions);

  useEffect(() => {
    // Store the original transactions when the component mounts
    setOriginalTransactions(transactions);
  }, [transactions]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch(`/api/transactions/${type}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setTransactions(data);
          console.log(data);
        }
      } catch (error) {
        console.log("Error fetching transactions:", error);
      } finally {
        console.log("Loading finished");
      }
    };

    let mounted = true;
    if (mounted) {
      fetchTransactions();
    }

    return () => {
      mounted = false;
    };
  }, [type]);

  // Filter transactions by Date

  const handleFilterByDate = () => {
    if (!dateRange[0] || !dateRange[1]) {
      setTransactions(originalTransactions);
    } else {
      const filteredTransactions = originalTransactions.filter(
        (transaction) => {
          // Convert transaction date to Jalali
          const transactionJalaliDate = format(
            new Date(transaction.date),
            "yyyy/MM/dd"
          );
          const startJalaliDate = dateRange[0]
            ? format(dateRange[0], "yyyy/MM/dd")
            : "";
          const endJalaliDate = dateRange[1]
            ? format(dateRange[1], "yyyy/MM/dd")
            : "";

          // Compare dates as strings since they're in yyyy/MM/dd format
          return (
            transactionJalaliDate >= startJalaliDate &&
            transactionJalaliDate <= endJalaliDate
          );
        }
      );
      setTransactions(filteredTransactions);
    }
    setDateModalOpen(false);
  };

  // Add this function to clear date filters
  const clearDateFilter = async () => {
    setDateRange([null, null]);
    setStartDate({ year: 1402, month: 1, day: 1 });
    setEndDate({ year: 1402, month: 1, day: 1 });

    try {
      const response = await fetch(`/api/transactions/${type}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTransactions(data);
        setOriginalTransactions(data);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }

    setDateModalOpen(false);
  };

  // Filter transactions by Name

  const handleFilterByName = () => {
    if (!filterName) {
      // If filterName is empty, reset to original transactions
      setTransactions(originalTransactions);
    } else {
      const filteredTransactions = originalTransactions.filter(
        (transaction) => {
          return (
            transaction.recipient.name &&
            typeof transaction.recipient.name === "string" &&
            transaction.recipient.name.includes(filterName)
          );
        }
      );

      setTransactions(filteredTransactions);
    }
    setNameModalOpen(false);
  };

  // Ensure to clear the filterName and reset transactions when the user clears the filter
  const clearNameFilter = async () => {
    setFilterName("");

    try {
      // Re-fetch all transactions
      const response = await fetch(`/api/transactions/${type}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTransactions(data);
        setOriginalTransactions(data);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }

    setNameModalOpen(false);
  };

  // Handle date range change

  const handleDateRangeChange = (dates: DateObject[]) => {
    if (dates.length === 2) {
      const [start, end] = dates;
      setDateRange([start.toDate(), end.toDate()]);

      const startDate = format(start.toDate(), "yyyy/MM/dd");
      const endDate = format(end.toDate(), "yyyy/MM/dd");
      setStartDate({
        year: Number(startDate.split("/")[0]),
        month: Number(startDate.split("/")[1]),
        day: Number(startDate.split("/")[2]),
      });
      setEndDate({
        year: Number(endDate.split("/")[0]),
        month: Number(endDate.split("/")[1]),
        day: Number(endDate.split("/")[2]),
      });

      console.log(startDate, endDate);
    }
  };

  // Handle the svg non Data

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-10">
      <svg
        className={`w-32 h-32 ${
          type === "incomes" ? "text-emerald-200" : "text-rose-200"
        }`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
      >
        {type === "incomes" ? (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        ) : (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
          />
        )}
      </svg>
      <p
        className={`mt-4 text-lg font-medium ${
          type === "incomes" ? "text-emerald-600" : "text-rose-600"
        }`}
      >
        {type === "incomes" ? "هنوز دریافتی ثبت نشده" : "هنوز پرداختی ثبت نشده"}
      </p>
    </div>
  );

  return (
    <motion.div
      className="max-w-xl mx-auto p-6 mb-32"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-row-reverse justify-between items-center mb-4">
        <h2
          className={`text-xl font-bold px-4 mb-4 text-right ${
            type === "incomes"
              ? "text-emerald-600 border-r-4 border-emerald-500"
              : "text-rose-600 border-r-4 border-rose-500"
          }`}
        >
          {type === "incomes" ? "لیست دریافتی‌ها" : "لیست پرداختی‌ها"}
        </h2>

        <div className="flex gap-2 justify-between mb-4">
          <button
            onClick={() => setDateModalOpen(true)}
            className="bg-purple-400 px-3 py-3 rounded-full"
          >
            <svg
              width="15px"
              height="15px"
              viewBox="0 0 16 16"
              fill="#ffffff"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                {" "}
                <path d="M0 3H16V1H0V3Z" fill="#fff"></path>{" "}
                <path d="M2 7H14V5H2V7Z" fill="#fff"></path>{" "}
                <path d="M4 11H12V9H4V11Z" fill="#fff"></path>{" "}
                <path d="M10 15H6V13H10V15Z" fill="#fff"></path>{" "}
              </g>
            </svg>
          </button>
          <button
            onClick={() => setNameModalOpen(true)}
            className="bg-purple-400 px-3 py-3 rounded-full"
          >
            <svg
              width="15px"
              height="15px"
              viewBox="0 0 24 24"
              fill="#ffffff"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M15 10.5A3.502 3.502 0 0 0 18.355 8H21a1 1 0 1 0 0-2h-2.645a3.502 3.502 0 0 0-6.71 0H3a1 1 0 0 0 0 2h8.645A3.502 3.502 0 0 0 15 10.5zM3 16a1 1 0 1 0 0 2h2.145a3.502 3.502 0 0 0 6.71 0H21a1 1 0 1 0 0-2h-9.145a3.502 3.502 0 0 0-6.71 0H3z"
                  fill="#ffffff"
                ></path>
              </g>
            </svg>
          </button>
        </div>
      </div>

      <div className=" rounded-xl overflow-x-auto shadow-lg">
        {transactions.length > 0 ? (
          <table className="w-full overflow-x-auto">
            <thead>
              <tr className="border-b bg-slate-500 text-white">
                <th className="text-center py-2 text-sm">تاریخ</th>
                <th className="text-center py-2">توضیحات</th>
                <th className="text-center py-2">مبلغ</th>
                <th className="">
                  {type === "incomes" ? "فرستنده" : "گیرنده"}
                </th>
              </tr>
            </thead>
            <tbody className="text-center">
              {transactions.map((transaction) => (
                <tr
                  key={transaction._id}
                  className={`border-b hover:bg-gray-300 ${
                    type === "incomes"
                      ? "hover:bg-emerald-100"
                      : "hover:bg-red-100"
                  } cursor-pointer transition-all duration-200`}
                  onClick={() => setSelectedTransaction(transaction)}
                >
                  <td className="py-3">
                    {format(new Date(transaction.date), "yyyy/MM/dd")}
                  </td>
                  <td className="py-3 text-sm text-center" dir="rtl">
                    {transaction.description.slice(0, 10)}
                    {transaction.description.length > 20 ? "..." : ""}
                  </td>

                  <td
                    className={`py-1 text-nowrap text-xs text-center  font-bold ${
                      type === "incomes" ? "text-emerald-700" : "text-rose-600"
                    }`}
                  >
                    {type === "incomes" ? "+" : "-"}

                    {transaction.amount}
                    <span className="ml-1 text-[0.5rem]"> تومان</span>
                  </td>
                  <td className="py-3 text-gray-600 text-center">
                    {type === "incomes"
                      ? transaction.recipient.name
                      : transaction.recipient.name}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <EmptyState />
        )}
      </div>

      {/* Custom Date Filter Modal */}
      {isDateModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <div className="bg-white bg-opacity-85 border border-black/50 backdrop-blur-xl rounded-xl p-8 w-96 mx-4">
            {" "}
            {/* Increased width for better calendar display */}
            <h2 className="text-xl font-bold mb-4 border-b text-center border-gray-300 pb-3 text-purple-400">
              فیلتر بر اساس تاریخ
            </h2>
            <PersianDatePicker onChange={handleDateRangeChange} />
            {dateRange[0] && dateRange[1] && (
              <div
                className="flex items-center bg-purple-100 p-1 rounded-xl justify-between my-4"
                dir="rtl"
              >
                <span className="text-gray-400 text-sm">
                  فیلتر شده از تاریخ {format(dateRange[0], "yyyy/MM/dd")} تا{" "}
                  {format(dateRange[1], "yyyy/MM/dd")}
                </span>
                <button
                  onClick={clearDateFilter}
                  className="text-red-500 font-bold ml-2"
                >
                  X
                </button>
              </div>
            )}
            <div className="flex flex-col justify-center items-end mt-4">
              <span className="text-gray-400 border-b border-gray-300 pb-3 text-right mb-3">
                <strong className="ml-44">تاریخ شروع:</strong>
                {`${startDate.year}/${startDate.month}/${startDate.day}`}
              </span>
              <span className="text-gray-400 border-b border-gray-300 pb-3 text-right mb-3">
                <strong className="ml-44">تاریخ پایان:</strong>{" "}
                {`${endDate.year}/${endDate.month}/${endDate.day}`}
              </span>
            </div>
            <div className="flex justify-between flex-row-reverse mt-4">
              <button
                onClick={handleFilterByDate}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                اعمال فیلتر
              </button>
              <button
                onClick={clearDateFilter}
                className="bg-rose-500 text-white px-4 py-2 rounded"
              >
                بستن
              </button>
            </div>
          </div>
        </motion.div>
      )}
      {selectedTransaction && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setSelectedTransaction(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="bg-purple-400/15 border border-white/50 backdrop-blur-md p-6 w-full rounded-xl max-w-[90%]"
            onClick={(e: React.MouseEvent<HTMLDivElement>) =>
              e.stopPropagation()
            }
            dir="rtl"
          >
            <h2 className="text-xl font-bold mb-4 text-white border-b pb-2">
              جزئیات تراکنش
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-gray-200">تاریخ:</p>
                <p className="text-white font-bold">
                  {format(new Date(selectedTransaction!.date), "yyyy/MM/dd")}
                </p>
              </div>
              <div>
                <p className="text-gray-200">توضیحات:</p>
                <p className="text-white font-bold">
                  {selectedTransaction!.description}
                </p>
              </div>
              <div>
                <p className="text-gray-200">مبلغ:</p>
                <p
                  className={`font-bold ${
                    type === "incomes" ? "text-emerald-400" : "text-rose-400"
                  }`}
                >
                  {type === "incomes" ? "+" : "-"}
                  {selectedTransaction!.amount} تومان
                </p>
              </div>
              <div>
                <p className="text-gray-200">
                  {type === "incomes" ? "فرستنده" : "گیرنده"}:
                </p>
                <p className="text-white font-bold">
                  {selectedTransaction!.recipient.name}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Custom Name Filter Modal */}
      {isNameModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50"
          dir="rtl"
        >
          <div className="bg-white bg-opacity-85 border border-black/50 backdrop-blur-xl rounded-xl p-8 w-96 mx-4">
            <h2 className="text-xl font-bold text-purple-400 text-center pb-3 border-b-2 border-gray-300 mb-4">
              فیلتر بر اساس نام
            </h2>
            <input
              type="text"
              value={filterName}
              onChange={(e) => {
                setFilterName(e.target.value);
                if (!e.target.value) {
                  clearNameFilter(); // Call clearFilter when input is emptied
                }
              }}
              placeholder="نام را وارد کنید"
              className="border p-2 mb-4 w-full rounded-lg focus:outline-none focus:ring-purple-500 focus:ring-1"
              dir="rtl"
            />
            {filterName && (
              <div
                className="flex items-center bg-purple-100 p-1 rounded-xl justify-between mb-4"
                dir="rtl"
              >
                <span className="text-gray-400 text-sm">
                  فیلتر شده بر اساس: {filterName}
                </span>
                <button
                  onClick={clearNameFilter} // Use clearFilter to reset transactions
                  className="text-red-500 font-bold ml-2"
                >
                  X
                </button>
              </div>
            )}
            <div className="flex justify-between">
              <button
                onClick={handleFilterByName}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                اعمال فیلتر
              </button>
              <button
                onClick={() => {
                  setFilterName(""); // Clear filterName on close
                  setNameModalOpen(false);
                }}
                className="bg-rose-500 text-white px-4 py-2 rounded"
              >
                بستن
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};
export default TransactionList;
