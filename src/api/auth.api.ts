import type { ApiResponse } from "@/types/common.type";
import { customerAPI } from "@/libs/axios";

export interface ICheckPhoneNumberPayload {
  phoneNumber: string;
  countryCode: string;
}

export interface ICheckPhoneNumberResponse {
  code: string;
}

export enum CheckPhoneNumberCode {
  CHECK_PHONE_EXISTS = "REGISTER_SUC001",
  CHECK_PHONE_EXISTS_IN_SYSTEM = "REGISTER_SUC002",
  CHECK_PHONE_DOES_NOT_EXISTS = "REGISTER_SUCC003",
}

export const checkPhoneNumber = async (payload: ICheckPhoneNumberPayload) => {
  const response = await customerAPI.post<
    ApiResponse<ICheckPhoneNumberResponse>
  >("/v1/register/check-phone", payload);

  return response.data;
};

export interface ISendOtpToPhoneNumberResponse {
  status: string;
  token: string;
  refno: string;
  method: string;
  code: string;
}

export const sendOtpToPhoneNumber = async (
  payload: ICheckPhoneNumberPayload
) => {
  const response = await customerAPI.post<
    ApiResponse<ISendOtpToPhoneNumberResponse>
  >("/v1/register/otp/send-sms", payload);
  return response.data;
};

export const loginWithUsername = async (payload: {
  username: string;
  password: string;
}) => {
  const response = await customerAPI.post<ApiResponse<null>>(
    "/v1/auth/login",
    payload
  );
  return response.data;
};

export interface ILoginWithPhoneOtpPayload {
  countryCode: string;
  otp: string;
  otpToken: string;
  phoneNumber: string;
}

export interface ILoginWithPhoneOtpResponse {
  accessToken: string;
  authCenter: {
    accessToken: string;
    expiresIn: string;
    refreshExpiresIn: number;
    refreshToken: string;
  };
}

export const loginWithPhoneOtp = async (payload: ILoginWithPhoneOtpPayload) => {
  const response = await customerAPI.post<
    ApiResponse<ILoginWithPhoneOtpResponse>
  >("/auth/login-otp", payload);
  return response.data;
};
