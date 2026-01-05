"use client";

import { FC, useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import FormLogin from "./components/FormLogin";
import { useAuth } from "@/hooks/useAuth";
import { useMutation } from "@tanstack/react-query";
import {
  checkPhoneNumber,
  CheckPhoneNumberCode,
  sendOtpToPhoneNumber,
  ISendOtpToPhoneNumberResponse,
} from "@/api/auth.api";
import FormOtp from "./components/FormOtp";

const LoginPage: FC = () => {
  const router = useRouter();
  const { user, login } = useAuth();
  const [step, setStep] = useState<1 | 2>(1);
  const [otpData, setOtpData] = useState<ISendOtpToPhoneNumberResponse>();
  const [telNumber, setTelNumber] = useState<string>("");

  // Redirect to home if already authenticated
  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  const { mutateAsync: handleCheckPhoneNumber } = useMutation({
    mutationFn: async (data: { phoneNumber: string }) => {
      const response = await checkPhoneNumber({
        phoneNumber: data.phoneNumber,
        countryCode: "66",
      });
      return response;
    },
  });

  const { mutateAsync: handleSendOtp } = useMutation({
    mutationFn: async (data: { phoneNumber: string }) => {
      const response = await sendOtpToPhoneNumber({
        phoneNumber: data.phoneNumber,
        countryCode: "66",
      });
      return response;
    },
  });

  const handlePhoneLogin = async (values: { phoneNumber: string }) => {
    try {
      const { data } = await handleCheckPhoneNumber({
        phoneNumber: values.phoneNumber.startsWith("0")
          ? values.phoneNumber.slice(1)
          : values.phoneNumber,
      });
      if (data?.code === CheckPhoneNumberCode.CHECK_PHONE_EXISTS_IN_SYSTEM) {
        const response = await handleSendOtp({
          phoneNumber: values.phoneNumber.startsWith("0")
            ? values.phoneNumber.slice(1)
            : values.phoneNumber,
        });
        if (response.data) {
          setOtpData(response.data);
          setTelNumber(
            values.phoneNumber.startsWith("0")
              ? values.phoneNumber.slice(1)
              : values.phoneNumber
          );
          setStep(2);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleFinishOtp = async (values: { otp: string }) => {
    try {
      if (otpData) {
        await login(telNumber, values.otp, otpData.token);
        router.push("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

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
      {step === 1 && <FormLogin onFinishPhoneLogin={handlePhoneLogin} />}
      {step === 2 && <FormOtp onFinish={handleFinishOtp} otpData={otpData} />}
    </div>
  );
};

export default LoginPage;
