"use client";
import DatePicker, { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { motion } from "framer-motion";

interface PersianDatePickerProps {
  onChange: (date: DateObject[]) => void;
}

const PersianDatePicker: React.FC<PersianDatePickerProps> = ({ onChange }) => {
//   const [date, setDate] = useState<DateObject>();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      <DatePicker
        range
        calendar={persian}
        locale={persian_fa}
        calendarPosition="top-center"
        onChange={onChange}
        format="YYYY/MM/DD"
        rangeHover
        dateSeparator=" تا "
        inputClass="w-full p-2 rounded-lg bg-white/10 backdrop-blur-sm text-white border border-purple-300"
        containerClassName="w-full"
      />
    </motion.div>
  );
};
export default PersianDatePicker;
