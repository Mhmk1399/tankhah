import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { useState } from "react";

interface UpdateProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormErrors {
  name?: string;
  phoneNumber?: string;
  password?: string;
}

const UpdateProfileModal: React.FC<UpdateProfileModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    password: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const fetchUserData = async () => {
    try {
      const response = await fetch(`/api/getOneUser`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
      const data = await response.json();
      setFormData({
        name: data.name,
        phoneNumber: data.phoneNumber,
        password: "", // Don't pre-fill the password for security reasons
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};

    // Name validation
    if (formData.name.length < 3 || formData.name.length === 0) {
      newErrors.name = "نام باید حداقل ۳ کاراکتر باشد";
    }

    // Phone validation
    if (!formData.phoneNumber.match(/^09[0-9]{9}$/)) {
      newErrors.phoneNumber = "شماره موبایل باید ۱۱ رقم و با ۰۹ شروع شود";
    }

    // Password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    if (!passwordRegex.test(formData.password)) {
      newErrors.password = "رمز عبور باید شامل حروف بزرگ، کوچک و اعداد باشد";
    } else if (formData.password.length < 6) {
      newErrors.password = "رمز عبور باید حداقل ۶ کاراکتر باشد";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await fetch(`/api/getOneUser`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        if (!data) {
          throw new Error("خطا در بروزرسانی پروفایل");
        }
        fetchUserData();
        toast.success("حساب کاربری شما با موفقیت بروز شد!", {
          style: {
            direction: "rtl",
            backgroundColor: "#10B981",
            color: "white",
          },
        });
        onClose(); // Close the modal after successful update
      } else {
        throw new Error("خطا در بروزرسانی پروفایل");
      }
    } catch (error) {
      console.log(error);
      toast.error("خطا در بروزرسانی پروفایل", {
        style: {
          direction: "rtl",
          backgroundColor: "#EF4444",
          color: "white",
        },
      });
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50"
  >
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 50,
        duration: 0.5,
      }}
      className="bg-white/85 border border-black/30 backdrop-blur-sm rounded-xl p-8 w-96 mx-4"
      dir="rtl"
    >
  
        <h2 className="text-xl font-bold mb-4 text-purple-500 border-b text-center border-gray-300 pb-2">
          بروزرسانی پروفایل
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-purple-700">
              نام
            </label>
            <input
              type="text"
              name="name"
              className={`mt-1 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 border ${
                errors.name ? "border-red-500" : "border-gray-300"
              } p-2`}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="نام"
            />
            {errors.name && (
              <p className="text-red-500 text-xs font-bold mt-1">
                {errors.name}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-purple-700">
              شماره تماس
            </label>
            <input
              type="tel"
              pattern="09[0-9]{9}"
              maxLength={11}
              name="phoneNumber"
              className={`mt-1 text-right w-full  focus:outline-none focus:ring-2 focus:ring-purple-400 rounded-md border ${
                errors.phoneNumber ? "border-red-500" : "border-gray-300"
              } p-2`}
              onChange={(e) => {
                setFormData({ ...formData, phoneNumber: e.target.value });
              }}
              placeholder="شماره تماس (09xxxxxxxxx)"
            />
            {errors.phoneNumber && (
              <p className="text-red-500 text-xs font-bold mt-1">
                {errors.phoneNumber}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-purple-700">
              رمز عبور جدید
            </label>
            <input
              type="password"
              name="password"
              className={`mt-1 w-full rounded-md  focus:outline-none focus:ring-2 focus:ring-purple-400 border ${
                errors.password ? "border-red-500" : "border-gray-300"
              } p-2`}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder="رمز عبور جدید"
              max={10}
              min={6}
            />
            {errors.password && (
              <p className="text-red-500 text-xs font-bold mt-1">
                {errors.password}
              </p>
            )}
          </div>
          <div className="flex justify-start gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-white bg-rose-600 hover:bg-rose-700 rounded-md"
            >
              انصراف
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
            >
              ذخیره تغییرات
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default UpdateProfileModal;
