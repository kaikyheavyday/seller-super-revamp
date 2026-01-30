import type { ApiResponse } from "@/types/common.type";
import { customerAPI } from "@/libs/axios";
import {
  IAuthRequestCheckPhoneNumberPayload,
  IAuthRequestLoginWithPhoneOtpPayload,
  IAuthRequestVerifyPhoneOtpPayload,
} from "@/interfaces/auth/auth.request.interface";
import {
  IAuthResponseCheckPhoneNumber,
  IAuthResponseLoginWithPhoneOtp,
  IAuthResponseSendOtpToPhoneNumber,
  IAuthResponseUserProfile,
  IAuthResponseUserProfileWithMerchants,
} from "@/interfaces/auth/auth.response.interface";

export const checkPhoneNumber = async (
  payload: IAuthRequestCheckPhoneNumberPayload,
) => {
  const response = await customerAPI.post<
    ApiResponse<IAuthResponseCheckPhoneNumber>
  >("/v1/register/check-phone", payload);

  return response.data;
};

export const sendOtpToPhoneNumber = async (
  payload: IAuthRequestCheckPhoneNumberPayload,
) => {
  const response = await customerAPI.post<
    ApiResponse<IAuthResponseSendOtpToPhoneNumber>
  >("/v1/register/otp/send-sms", payload);
  return response.data;
};

export const loginWithPhoneOtp = async (
  payload: IAuthRequestLoginWithPhoneOtpPayload,
) => {
  const response = await customerAPI.post<
    ApiResponse<IAuthResponseLoginWithPhoneOtp>
  >("/auth/login-otp", payload);
  return response.data;
};

export const getUserProfileByPhone = async (
  payload: IAuthRequestCheckPhoneNumberPayload,
) => {
  const response = await customerAPI.get<ApiResponse<IAuthResponseUserProfile>>(
    "/v1/register/user-profile",
    {
      params: {
        phoneNumber: payload.phoneNumber,
        countryCode: payload.countryCode,
      },
    },
  );
  return response.data;
};

export const getProfile = async () => {
  const response =
    await customerAPI.get<IAuthResponseUserProfileWithMerchants>("/auth");
  return response.data;
};
