'use client'
import { ChangeEvent } from 'react'

interface BalanceInputProps {
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  name: string
}

const PriceInput = ({ value, onChange, name }: BalanceInputProps) => {
  const formatNumber = (num: string | number) => {
    // Remove any non-digit characters
    const cleanNum = String(num).replace(/\D/g, '')
    // Format with commas
    return cleanNum.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value
    const formattedValue = formatNumber(rawValue)
    e.target.value = formattedValue
    onChange(e)
  }

  return (
    <div className="relative lg:mt-4">
      <input
        dir=""
        type="text"
        name="accountBalance"
        inputMode="numeric"
        placeholder={name}
        value={formatNumber(value)}
        onChange={handleChange}
        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-left"
      />
      <span className="absolute right-4 top-3 text-gray-400">تومان</span>
    </div>
  )
}

export default PriceInput
