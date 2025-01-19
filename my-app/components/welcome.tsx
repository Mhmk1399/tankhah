import handleTokenExpiration from "@/lib/handleTokenExpiration";
import React, { useEffect, useState } from "react";

const Welcome = () => {
  const [userData, setUserData] = useState<{ name: string } | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (localStorage.getItem("token") === null) {
        window.location.href = "/login";
      }
      try {
        const response = await fetch("/api/auth", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();

        setUserData(data.users);
        if (response.status === 401|| localStorage.getItem("token") === null) {
          
          const error = new Error("Token is expired");
          handleTokenExpiration(error);
        }

      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div
      dir="rtl"
      className="text-right mt-4 p-4 mx-4 rounded-2xl border-2 border-[#4361ee] shadow-lg"
    >
      <h1 className="text-xl font-bold text-[#4361ee] ">
        {userData?.name || "کاربر"} به سامانه <br />
        <strong className="font-extrabold text-2xl text-[#4361ee]">
          {" "}
          تنخواه{" "}
        </strong>{" "}
        خوش آمدید ...
      </h1>
      <p className="text-xs text-gray-50 bg-[#4361ee] p-4 rounded-2xl mt-4">
        تمامی اطلاعات مالی خود را در اینجا ثبت کنید و از آنها به بهترین نحو برای
        مدیریت و برنامه ریزی استفاده کنید.
      </p>
    </div>
  );
};

export default Welcome;
