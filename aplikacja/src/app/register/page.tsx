"use client";
import React from "react";
import { useFormStatus } from "react-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import registerSchema from "../lib/schemas";
import { useRouter } from "next/navigation";
import axios from "axios";
const RegisterButton = () => {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className="text-xl bg-green-500 text-white py-2 hover:bg-green-600 duration-500"
      aria-disabled={pending}
    >
      Register
    </button>
  );
};
const Page = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });
  const onSubmit = async (data: any) => {
    const url = "/api/auth/register";
    const response = await axios.post(url, JSON.stringify(data));
    if (response.status === 200 || response.status === 201) {
      router.push("/login");
    }
  };

  return (
    <div>
      <section className="w-screen h-screen overflow-hidden flex flex-col justify-center items-center">
        <h1 className="text-4xl my-8">Register</h1>
        <form
          className="w-1/4 flex flex-col text-center gap-8"
          onSubmit={handleSubmit(onSubmit)}
        >
          <input
            {...register("email")}
            placeholder="Email"
            type="email"
            className="text-xl focus:outline-none py-2 w-full border-b-4 border-black"
          />
          <input
            {...register("password")}
            placeholder="Password"
            type="password"
            className="text-xl focus:outline-none py-2 w-full border-b-4 border-black"
          />
          <input
            {...register("confirmPassword")}
            placeholder="Confirm password"
            type="password"
            className="text-xl focus:outline-none py-2 w-full border-b-4 border-black"
          />
          <RegisterButton />
        </form>
        <div>
          Have an account?{" "}
          <span
            className="cursor-pointer hover:border-b-2 border-black"
            onClick={() => router.push("/login")}
          >
            Login here
          </span>
        </div>
      </section>
    </div>
  );
};

export default Page;
