"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import UpdateProfileModal from "./updateProfile";
import LogoutModal from "./logOut";
import { usePathname } from "next/navigation";

interface User {
  _id: string;
  name: string;
  phoneNumber: number;
  password: string;
  role: "user" | "admin";
  createdAt: string;
  updatedAt: string;
  __v: number;
}

import {
  UserIcon,
  ArrowLeftStartOnRectangleIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import Image from "next/image";

const Profile = () => {
  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [user, setUser] = useState<User>();

  // fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/getOneUser", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          console.log(data, "data");
          setUser(data);
        }
      } catch (error) {
        console.log("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (
      pathname === "/login" ||
      pathname === "/register" ||
      pathname === "/addCard" ||
      pathname === "/addCategory" ||
      pathname === "/addRecipient"
    ) {
      setMounted(true);
      const timer = setInterval(() => {
        setCurrentDateTime(new Date());
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [pathname]);

  useEffect(() => {
    if (
      pathname !== "/login" &&
      pathname !== "/register" &&
      pathname !== "/addCard" &&
      pathname !== "/addCategory" &&
      pathname !== "/addRecipient"
    ) {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node)
        ) {
          setIsDropdownOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [pathname]);

  if (
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/addCard" ||
    pathname === "/addCategory" ||
    pathname === "/addRecipient"
  ) {
    return null;
  }
  const dropdownVariants = {
    hidden: {
      opacity: 0,
      y: -10,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: {
        duration: 0.2,
        ease: "easeIn",
      },
    },
  };

  return (
    <section className="flex flex-row-reverse items-center bg-purple-50  justify-between  w-full h-16 px-2">
      <div className="flex flex-col font-medium items-end justify-end h-fit relative mt-2">
        <div className="relative" ref={dropdownRef}>
          <motion.div
            className="flex items-center justify-center mx-2 cursor-pointer"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-purple-700 text-xs font-bold mr-3">
              {user?.name || "کاربر"}
            </span>
            <div className="w-8 h-10 overflow-hidden rounded-full">
              <Image
                width={100}
                height={100}
                alt="profile"
                src="/images/profile.svg"
              />
            </div>
            <motion.svg
              animate={{ rotate: isDropdownOpen ? 180 : 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="w-4 h-4 ml-1"
              fill="#7e22ce"
              //   stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </motion.svg>
          </motion.div>

          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                variants={dropdownVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="absolute right-2 mt-4 w-52 p-3 rounded-2xl shadow-lg shadow-purple-300 z-10 backdrop-blur-md border-2 border-gray-300 bg-purple-700/20"
              >
                <motion.button
                  whileHover={{ backgroundColor: "#ffffff" }}
                  className="block px-4 py-2 text-right rounded-2xl text-sm  w-full"
                  onClick={() => setIsUpdateModalOpen(true)}
                >
                  <span className="text-white font-base">
                    بروزرسانی پروفایل
                  </span>
                  <UserIcon className="w-4 inline h-4 ml-2 text-white " />
                </motion.button>
                <Link href="/manageTransactions">
                  <motion.button
                    whileHover={{ backgroundColor: "#ffffff" }}
                    className=" px-4 py-2 text-sm rounded-2xl w-full text-right flex items-center justify-end"
                  >
                    <span className="text-white font-base mx-2">
                      مدیریت تراکنش‌ها
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="20px"
                      viewBox="0 -960 960 960"
                      width="20px"
                      fill="#ffffff"
                    >
                      <path d="M240-160q-33 0-56.5-23.5T160-240q0-33 23.5-56.5T240-320q33 0 56.5 23.5T320-240q0 33-23.5 56.5T240-160Zm0-240q-33 0-56.5-23.5T160-480q0-33 23.5-56.5T240-560q33 0 56.5 23.5T320-480q0 33-23.5 56.5T240-400Zm0-240q-33 0-56.5-23.5T160-720q0-33 23.5-56.5T240-800q33 0 56.5 23.5T320-720q0 33-23.5 56.5T240-640Zm240 0q-33 0-56.5-23.5T400-720q0-33 23.5-56.5T480-800q33 0 56.5 23.5T560-720q0 33-23.5 56.5T480-640Zm240 0q-33 0-56.5-23.5T640-720q0-33 23.5-56.5T720-800q33 0 56.5 23.5T800-720q0 33-23.5 56.5T720-640ZM480-400q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm40 240v-123l221-220q9-9 20-13t22-4q12 0 23 4.5t20 13.5l37 37q8 9 12.5 20t4.5 22q0 11-4 22.5T863-380L643-160H520Zm300-263-37-37 37 37ZM580-220h38l121-122-18-19-19-18-122 121v38Zm141-141-19-18 37 37-18-19Z" />
                    </svg>
                  </motion.button>
                </Link>
                <Link href="/manageRecipients">
                  <motion.button
                    whileHover={{ backgroundColor: "#ffffff" }}
                    className="flex px-4 py-2 text-sm rounded-2xl w-full text-end justify-end "
                  >
                    <span className="text-white font-base mx-2">
                      مدیریت گیرنده ها
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="20px"
                      viewBox="0 -960 960 960"
                      width="20px"
                      fill="#ffffff"
                    >
                      <path d="M480-800q-33 0-56.5-23.5T400-880q0-33 23.5-56.5T480-960q33 0 56.5 23.5T560-880q0 33-23.5 56.5T480-800ZM360-200v-480q-60-5-122-15t-118-25l20-80q78 21 166 30.5t174 9.5q86 0 174-9.5T820-800l20 80q-56 15-118 25t-122 15v480h-80v-240h-80v240h-80ZM320 0q-17 0-28.5-11.5T280-40q0-17 11.5-28.5T320-80q17 0 28.5 11.5T360-40q0 17-11.5 28.5T320 0Zm160 0q-17 0-28.5-11.5T440-40q0-17 11.5-28.5T480-80q17 0 28.5 11.5T520-40q0 17-11.5 28.5T480 0Zm160 0q-17 0-28.5-11.5T600-40q0-17 11.5-28.5T640-80q17 0 28.5 11.5T680-40q0 17-11.5 28.5T640 0Z" />
                    </svg>
                  </motion.button>
                </Link>
                <Link href="/manageCards">
                  <motion.button
                    whileHover={{ backgroundColor: "#ffffff" }}
                    className="flex px-4 py-2 text-sm rounded-2xl w-full text-end justify-end "
                  >
                    <span className="text-white font-base mx-2">
                      مدیریت کارت ها
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="24px"
                      viewBox="0 -960 960 960"
                      width="24px"
                      fill="#ffffff"
                    >
                      <path d="M880-720v480q0 33-23.5 56.5T800-160H160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720Zm-720 80h640v-80H160v80Zm0 160v240h640v-240H160Zm0 240v-480 480Z" />
                    </svg>
                  </motion.button>
                </Link>
                <Link href="/manageCategories">
                  <motion.button
                    whileHover={{ backgroundColor: "#ffffff" }}
                    className="flex px-4 py-2 text-sm rounded-2xl w-full text-end justify-end "
                  >
                    <span className="text-white font-base mx-2">
                      مدیریت دسته‌بندی ها
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="20px"
                      viewBox="0 -960 960 960"
                      width="20px"
                      fill="#ffffff"
                    >
                      <path d="m276-528 204-336 204 336H276ZM696-96q-70 0-119-49t-49-119q0-70 49-119t119-49q70 0 119 49t49 119q0 70-49 119T696-96Zm-552-24v-288h288v288H144Zm551.77-48Q736-168 764-195.77q28-27.78 28-68Q792-304 764.23-332q-27.78-28-68-28Q656-360 628-332.23q-28 27.78-28 68Q600-224 627.77-196q27.78 28 68 28ZM216-192h144v-144H216v144Zm188-408h152l-76-125-76 125Zm76 0ZM360-336Zm331 67Z" />
                    </svg>
                  </motion.button>
                </Link>
                <motion.button
                  whileHover={{ backgroundColor: "#ffffff" }}
                  className="block px-4 py-2 text-sm rounded-2xl w-full text-right"
                  onClick={() => setIsLogoutModalOpen(true)}
                >
                  <span className="text-red-500 font-base">خروج</span>
                  <ArrowLeftStartOnRectangleIcon className="w-4 h-4 ml-2 inline  text-red-500" />{" "}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <div
        className="w-full text-[0.7rem] font-bold mt-2 rounded-md flex text-purple-700 items-start justify-end"
        dir="rtl"
      >
        {mounted
          ? new Intl.DateTimeFormat("fa-IR", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }).format(currentDateTime)
          : null}
      </div>
      <UpdateProfileModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
      />
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
      />
    </section>
  );
};

export default Profile;
