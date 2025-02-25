import React, { useState, ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import { toast, Toaster } from 'react-hot-toast';
import PriceInput from './priceInput';


export const AddRequest = () => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value.replace(/,/g, ''));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          amount: Number(amount),
          description,
          Date: Date.now(),
          status: 'pending'
        })
      });

      if (response.ok) {
        toast.success('درخواست با موفقیت ثبت شد', {
          style: {
            direction: 'rtl',
            backgroundColor: '#10B981',
            color: 'white'
          }
        });
        setAmount('');
        setDescription('');
        
      } else {
        throw new Error('خطا در ثبت درخواست');
      }
    } catch (error) {
      console.log(error);
      
      toast.error('خطا در ثبت درخواست', {
        style: {
          direction: 'rtl',
          backgroundColor: '#EF4444',
          color: 'white'
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen w-full flex flex-col items-center justify-center p-4"
    >
      <Toaster />
      <div className="w-full  bg-white rounded-2xl shadow-lg border-t border p-6 space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-800">ثبت درخواست جدید</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4" dir="rtl">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              مبلغ (تومان)
            </label>
            <PriceInput
              value={amount}
              onChange={handleAmountChange}
              name="مبلغ درخواستی"
            />          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              توضیحات
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24"
              placeholder="توضیحات درخواست را وارد کنید"
              required
            />
          </div>

          

          <motion.button
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium 
              ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'} 
              transition duration-200 ease-in-out`}
          >
            {isLoading ? 'در حال ثبت...' : 'ثبت درخواست'}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
};
