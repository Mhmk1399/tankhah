"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface FormErrors {
  phoneNumber?: string;
  password?: string;
}
export default function LoginPage() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const validateForm = () => {
    const newErrors: FormErrors = {};

    // Phone validation
    if (!phoneNumber.match(/^09[0-9]{9}$/)) {
      newErrors.phoneNumber = "شماره موبایل باید ۱۱ رقم و با ۰۹ شروع شود";
    }

    // Password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    if (!passwordRegex.test(password)) {
      newErrors.password = "رمز عبور باید شامل حروف بزرگ، کوچک و اعداد باشد";
    } else if (password.length < 6) {
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
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // Store the token in localStorage
        localStorage.setItem("token", data.token);
        router.push("/"); // Redirect to dashboard or home page
      } else {
        setError(data.message);
      }
    } catch (err) {
      console.error(err);
      setError("ورود به سیستم با مشکل مواجه شد");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-200">
      <div className="max-w-md w-full mx-2 space-y-8 p-8 bg-white/50 rounded-xl shadow-lg">
        <div>
          <h2
            className="mt-6 text-center text-3xl font-bold text-purple-700 border-b border-purple-200 pb-2"
            dir="rtl"
          >
            رمز جیبتو بگو بریم توش :{")"}
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="text-red-500 text-center text-sm">{error}</div>
          )}
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="phoneNumber" className="sr-only">
                شماره همراه شما
              </label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 ring-1  focus:z-10 sm:text-sm"
                placeholder="شماره همراه خود را وارد کنید"
                dir="rtl"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              {errors.phoneNumber && (
                <p className="mt-1 text-sm text-red-500 text-right">
                  {errors.phoneNumber}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                رمز ورود
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 ring-1  focus:z-10 sm:text-sm"
                placeholder="رمز جیبت !"
                dir="rtl"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500 text-right">
                  {errors.password}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-900"
              >
                رمز جیبم یادت باشه
              </label>
            </div>

            <div className="text-sm">
              <Link
                dir="rtl"
                href="/forgot-password"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                رمز جیبم یادم نیست
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
            >
              {loading ? "در حال ورود به جیب" : "ورود به جیب مبارک"}
            </button>
          </div>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            <Link
              href="/register"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              جیب نداری بسازم برات ؟
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
