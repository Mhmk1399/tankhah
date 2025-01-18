'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { toast, Toaster } from 'react-hot-toast'

const Page = () => {
  const [formData, setFormData] = useState({
    name: '',
    color: '#000000'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
      
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      })
  
      if (response.ok) {
        toast.success('دسته‌بندی با موفقیت اضافه شد', {
          style: {
            direction: 'rtl',
            backgroundColor: '#10B981',
            color: 'white'
          }
        })
        setFormData({
          name: '',
          color: '#000000'
        })
      } else {
        // Add this else block to handle non-ok responses
        const errorData = await response.json()
        toast.error(errorData.message || 'خطا در ثبت دسته‌بندی', {
          style: {
            direction: 'rtl',
            backgroundColor: '#EF4444',
            color: 'white'
          }
        })
      }
    } catch (error) {
      // Improve error handling by showing the actual error
      const errorMessage = error instanceof Error ? error.message : 'خطا در ثبت دسته‌بندی'+error
      toast.error(errorMessage, {
        style: {
          direction: 'rtl',
          backgroundColor: '#EF4444',
          color: 'white'
        }
      })
      console.error('Category creation error:', error)
    }
  }
  

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className={` font-ray bg-purple-50 w-full pt-5 pb-20 h-full`} dir="rtl">
    <Toaster position="top-center" />

      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl lg:text-4xl font-bold text-gray-800 mb-2 lg:mb-10 text-center">
          افزودن دسته‌بندی جدید
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4 bg-purple-50 rounded-xl p-6">
          <div className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="نام دسته‌بندی"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            />
            
            <div className="flex items-center gap-4 rounded-full">
            <span className="text-gray-600 ">انتخاب رنگ دسته‌بندی</span>
              <input
                type="color"
                name="color"
                value={formData.color}
                onChange={handleInputChange}
                className="w-10 h-10  rounded-lg cursor-pointer"
              />
             
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full py-4 rounded-lg text-white font-medium shadow-lg bg-purple-500 hover:bg-purple-600 transition-colors"
          >
            ثبت دسته‌بندی
          </motion.button>
        </form>
      </div>
    </div>
  )
}

export default Page
