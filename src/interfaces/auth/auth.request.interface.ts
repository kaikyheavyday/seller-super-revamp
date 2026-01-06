export interface IAuthRequestCheckPhoneNumberPayload {
  phoneNumber: string;
  countryCode: string;
}

export interface IAuthRequestLoginWithPhoneOtpPayload {
  countryCode: string;
  otp: string;
  otpToken: string;
  phoneNumber: string;
}

export interface IAuthRequestVerifyPhoneOtpPayload {
  otp: string;
  token: string;
  phoneNumber: string;
  countryCode: string;
}
