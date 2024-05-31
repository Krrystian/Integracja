"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React from "react";

const Navbar = () => {
  const router = useRouter();
  const logout = async () => {
    const url = "/api/auth/logout";
    const response = await axios.post(url, {
      id: localStorage.getItem("token"),
    });
    if (response.status === 200) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("email");
      router.push("/login");
    }
  };
  return (
    <nav className="w-screen h-[4rem] bg-green-500 flex justify-between items-center px-8">
      <h3 className="text-2xl">Projekt</h3>
      <div
        className="text-2xl hover:bg-green-800 hover:text-white duration-300 transition-all rounded-xl p-2 cursor-pointer"
        onClick={logout}
      >
        Wyloguj
      </div>
    </nav>
  );
};

export default Navbar;
