import type { ApiResponse } from "@/types/common.type";
import { customerAPI } from "@/libs/axios";

export interface ICheckPhoneNumberPayload {
  phoneNumber: string;
  countryCode: string;
}

export interface ICheckPhoneNumberResponse {
  code: string;
}

export const checkPhoneNumber = async (payload: ICheckPhoneNumberPayload) => {
  const response = await customerAPI.post<
    ApiResponse<ICheckPhoneNumberResponse>
  >("/apiapp/v_3/login", payload);

  return response.data;
};
