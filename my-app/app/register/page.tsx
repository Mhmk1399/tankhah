"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface FormErrors {
  name?: string;
  password?: string;
  phoneNumber?: string;
}

export default function RegisterPage() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validateForm = () => {
    const newErrors: FormErrors = {};

    // Name validation
    if (name.length < 3) {
      newErrors.name = "نام باید حداقل ۳ کاراکتر باشد";
    }

    // Password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    if (!passwordRegex.test(password)) {
      newErrors.password = "رمز عبور باید شامل حروف بزرگ، کوچک و اعداد باشد";
    }

    // Phone validation
    if (!phoneNumber.match(/^09[0-9]{9}$/)) {
      newErrors.phoneNumber = "شماره موبایل باید ۱۱ رقم و با ۰۹ شروع شود";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setLoading(true);
    setError("");
    console.log(phoneNumber, name, password);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber, name, password }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/login");
      } else {
        setError(data.message);
      }
    } catch (err) {
      console.error(err);
      setError("خطا در ثبت نام");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-200">
      <div className="max-w-md w-full mx-2 space-y-8 p-8 bg-white/50 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-purple-700 border-b border-purple-200 pb-2">
            ساخت حساب کاربری
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="text-red-500 text-center text-sm">{error}</div>
          )}
          <div className="rounded-md shadow-sm space-y-4" dir="rtl">
            <div>
              <label htmlFor="name" className="sr-only">
                نام کاربری
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 ring-1  focus:z-10 sm:text-sm"
                placeholder="نام کاربری"
                dir="rtl"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                رمز جیب
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 ring-1  focus:z-10 sm:text-sm"
                placeholder="رمز ورود"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
            </div>
            <div>
              <label htmlFor="phoneNumber" className="sr-only">
                شماره همراه
              </label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 ring-1  focus:z-10 sm:text-sm"
                placeholder="شماره همراه"
                dir="rtl"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              {errors.phoneNumber && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.phoneNumber}
                </p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
            >
              {loading ? "در حال ساخت حساب کاربری" : "ثبت نام"}
            </button>
          </div>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            <Link
              href="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              یک جیب دارم منو ببر تو همون
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
