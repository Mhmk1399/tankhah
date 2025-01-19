"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import PriceInput from "./priceInput";
import LoadingComponent from './loading'
import toast from "react-hot-toast";

const TransactionsPage = () => {
  const CategoryModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    if (!isOpen) return null;
   
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      >
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className="bg-white/70 rounded-xl w-[90%] max-w-2xl h-[65vh] overflow-hidden"
        >
          <div className="flex justify-between items-center p-4 border-b bg-white">
            <h3 className="text-lg font-bold">افزودن دسته‌بندی جدید</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              ✕
            </button>
          </div>
          <iframe src="/addCategory" className="w-full h-[calc(100%-60px)] bg-white/80" />
        </motion.div>
      </motion.div>
    );
  };
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  const transactionType= "incomes"


  const [loading, setLoading] = useState(true);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    category: {
      _id: "",
      name: "",
      color: "",
      user: "",
    },
  
    description: "",
    transactionType: transactionType,
    image: "",
    Date: Date.now(),
  });

  const [categories, setCategories] = useState<[{
    _id: string;
    name: string;
    color: string;
    user: string;
  }]>([{
    _id: "",
    name: "",
    color: "",
    user: "",

  }]);
 
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const postTransaction = async () => {

      const numericAmount = Number(formData.amount.replace(/,/g, ''));


      const transactionData = {
        amount: numericAmount,
        description: formData.description,
        category: formData.category._id,
        date: new Date(),
        image: formData.image
      };
      console.log('transactionData', transactionData);

      try {
        const response = await fetch(`/api/transactions/outcomes`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(transactionData),
        });
        if (response.ok) {
          console.log("Transaction posted successfully");
          toast.success("تراکنش با موفقیت انجام شد");
        }
      } catch (error) {
        console.error("Error posting transaction:", error);

      }
    };
    postTransaction();
  };



  const formatNumber = (value: string) => {
    const numberOnly = value.replace(/\D/g, "");
    return numberOnly.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
 
  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories);

      }
    } catch (error) {
      console.log('Error fetching categories:', error);

    }
  };
  
  useEffect(() => {

    const loading = async () => {
      await fetchCategories();
     
      setLoading(false);
    }
    loading();
  }, []);
  if (localStorage.getItem("token") === null) {
    window.location.href = "/login";
  }

  useEffect(() => {
    fetchCategories();
  }, [isCategoryModalOpen]);
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatNumber(e.target.value);
    setFormData((prev) => ({
      ...prev,
      amount: formattedValue,
    }));
  };
  console.log(categories);

  // Update the handleInputChange function to handle objects
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "category") {
      const selectedCategory = categories.find(cat => cat._id === value);
      setFormData(prev => ({
        ...prev,
        category: {
          user: selectedCategory?._id || "",
          name: selectedCategory?.name || "",
          color: selectedCategory?.color || "",
          _id: selectedCategory?._id || ""
        }
      }));
    }
 


    else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    console.log(formData);
  };

  if (loading) {
    return <LoadingComponent />;
  }
  if (!loading) {
    return (
      <div
        className={` font-ray min-h-screen pt-0 p-4 lg:p-8 w-full mb-24`}
        dir="rtl"
      >
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl lg:text-4xl border-4 rounded-md px-5 py-3 mt-3 w-fit mx-auto border-blue-500 font-bold text-gray-800 mb-6 lg:mb-10 text-center">
            ثبت تراکنش جدید
          </h1>

      

          <form className="space-y-4 lg:space-y-6 max-w-6xl mx-auto">
            <div className="lg:grid lg:grid-cols-2 lg:gap-2">
              {/* Left Column */}
              <div className="space-y-1">
                <div className="relative lg:mt-4">
                  <PriceInput
                    value={formData.amount}
                    onChange={handleAmountChange}
                    name="مبلغ"
                  />
                </div>


              </div>

              {/* Full-width textarea and submit button */}
              <div className="lg:max-w-full mt-2">
                <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-4 mb-3 text-center lg:h-[80px] flex items-center justify-center ">
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = () => {
                          setFormData((prev) => ({
                            ...prev,
                            image: reader.result as string,
                          }));
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  <div className="space-y-2 ">
                    <i className="fas fa-cloud-upload-alt text-2xl text-gray-400"></i>
                    <p className="text-sm text-gray-500">آپلود تصویر رسید</p>
                  </div>
                </div>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="توضیحات (اختیاری)"
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all mb-1 "
                  rows={2}
                />
                <div className=" ">
                  <div className="flex justify-between items-center ">
                    <div className="relative w-full my-1">
                      <div
                        onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                        className="group bg-white px-4 py-3 rounded-xl border-2 border-gray-200 hover:border-blue-400 cursor-pointer transition-all duration-300 flex items-center gap-3"
                      >
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-blue-50">
                          <i className="fas fa-tag text-gray-500 group-hover:text-blue-500" />
                        </div>
                        <span className="flex-1">{formData.category.name || "دسته‌بندی"}</span>
                        <i className={`fas fa-chevron-down text-gray-400 transition-all duration-300 ${isCategoryDropdownOpen ? 'rotate-180 text-blue-500' : ''}`} />
                      </div>
                      {isCategoryDropdownOpen && (
                        <div className="absolute z-50 w-full mt-2 bg-white rounded-xl border shadow-lg overflow-hidden">
                          <div className="max-h-48 overflow-y-auto">
                            {categories.map((category) => (
                              <div
                                key={category._id}
                                onClick={() => {
                                  setFormData(prev => ({ ...prev, category }));
                                  setIsCategoryDropdownOpen(false);
                                }}
                                className="px-4 py-2.5 hover:bg-blue-50 cursor-pointer flex items-center gap-3"
                                style={{ borderRight: `10px solid ${category.color}` }}
                              >
                                <span className="text-gray-700">{category.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsCategoryModalOpen(true)}
                      className="bg-blue-500 text-white px-3 py-3 text-2xl rounded-xl w-fit mr-3"
                    >
                      +
                    </button>
                  </div>

                  <CategoryModal
                    isOpen={isCategoryModalOpen}
                    onClose={() => setIsCategoryModalOpen(false)}
                  />
                </div>
               
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className={`w-full lg:w-full mt-2 lg:mx-auto block py-4 rounded-lg text-white text-lg shadow-lg ${transactionType === "incomes" ? "bg-blue-500" : "bg-[#ff6961]"
                    }`}
                  onClick={handleSubmit}
                >
                  ثبت تراکنش
                </motion.button>
              </div>
            </div>

          </form>
        </div>
      </div>
    );
  }
}
export default TransactionsPage;
