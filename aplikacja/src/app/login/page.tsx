"use client";
import React, { useState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../lib/schemas";
import axios from "axios";

const LoginButton = () => {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className="text-xl bg-green-500 text-white py-2 hover:bg-green-600 duration-500"
      aria-disabled={pending}
    >
      Login
    </button>
  );
};

const Page = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: any) => {
    if (loading) return;
    setLoading(true);
    try {
      const url = "/api/auth/login";
      const response = await axios.post(url, JSON.stringify(data));
      setLoading(false);
      if (response.status === 200) {
        localStorage.setItem("token", response.data.user.token);
        localStorage.setItem("email", response.data.user.email);
        localStorage.setItem("role", response.data.user.role);
        router.push("/");
      }
    } catch (error: any) {
      setLoading(false);
      setError(error);
      console.log(error);
    }
  };

  return (
    <section className="w-screen h-screen overflow-hidden flex flex-col justify-center items-center">
      <h1 className="text-4xl my-8">Welcome</h1>
      <form
        className="w-1/4 flex flex-col text-center gap-8"
        onSubmit={handleSubmit(onSubmit)}
      >
        <input
          {...register("email")}
          placeholder="Email"
          type="email"
          className="text-xl focus:outline-none py-2 w-full border-b-4 border-black"
        />{" "}
        <input
          {...register("password")}
          placeholder="Password"
          type="password"
          className="text-xl focus:outline-none py-2 w-full border-b-4 border-black"
        />{" "}
        <LoginButton />
      </form>
      <div>
        Don't have an account?{" "}
        <span
          className="cursor-pointer hover:border-b-2 border-black"
          onClick={() => router.push("/register")}
        >
          Register here
        </span>
      </div>
    </section>
  );
};

export default Page;
