"use client";

import { FC, useState } from "react";
import Image from "next/image";
import FormLogin from "./components/FormLogin";

const LoginPage: FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 h-screen">
      <div
        style={{
          background: "linear-gradient(180deg, #E5F7EC 0%, #BDF5D2 100%)",
        }}
        className=" flex-col justify-center items-center hidden lg:flex"
      >
        <Image
          src="/home/landing.png"
          alt="Login Image"
          width={400}
          height={400}
          className="w-full"
        />
      </div>
      <FormLogin />
    </div>
  );
};

export default LoginPage;
