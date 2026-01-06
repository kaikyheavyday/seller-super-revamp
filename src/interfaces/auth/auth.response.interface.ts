export interface IAuthResponseCheckPhoneNumber {
  code: string;
}

export enum ResponseCheckPhoneNumberCode {
  CHECK_PHONE_EXISTS = "REGISTER_SUC001",
  CHECK_PHONE_EXISTS_IN_SYSTEM = "REGISTER_SUC002",
  CHECK_PHONE_DOES_NOT_EXISTS = "REGISTER_SUCC003",
}

export interface IAuthResponseSendOtpToPhoneNumber {
  status: string;
  token: string;
  refno: string;
  method: string;
  code: string;
}

export interface IAuthResponseLoginWithPhoneOtp {
  accessToken: string;
  authCenter: {
    accessToken: string;
    expiresIn: string;
    refreshExpiresIn: number;
    refreshToken: string;
  };
}

interface IAuthUser {
  id: number;
  uuid: string;
  countryCode: string;
  phoneNumber: string;
  email: string | null;
  name: string;
  firstNameTh: string;
  lastNameTh: string;
  middleNameTh: string;
  firstNameEn: string | null;
  lastNameEn: string | null;
  middleNameEn: string | null;
  kycStatus: string;
  createdInAuth: string;
  registerStatus: string;
  registerStep: string;
  createdAt: string;
  updatedAt: string;
  username: string;
  cisNumber: string;
}

interface IAuthOrganization {
  isOwner: boolean;
  createdAt: string;
  updatedAt: string;
  organization: {
    id: number;
    uuid: string;
    taxId: string | null;
    organizeType: string;
    organizeName: string;
    cisNumber: string;
    type: string;
    businessType: string[];
    remarkTypeOther: string | null;
    branchNumber: string | null;
    mainPhoneNumber: string;
    otherPhoneNumber: string | null;
    mainEmail: string | null;
    highestAuthorityName: string | null;
    highestAuthorityPosition: string | null;
    highestAuthorityPhoneNumber: string | null;
    highestAuthorityEmail: string | null;
    contactName: string | null;
    contactPhoneNumber: string | null;
    contactEmail: string | null;
    kycStatus: string;
    contactShownHighestAuthority: boolean;
    organizeBranchType: string;
    idCard: string;
    registrationNumber: string | null;
    organizationType: string;
    customerStatus: string;
    isDopa: boolean;
    isDbd: boolean;
    juristicInfo: {
      prefix: string;
      subfix: string;
      juristicName: string;
    };
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    totalUsers: number;
  };
  role: {
    id: number;
    name: string;
    displayName: string;
    description: string | null;
    createdAt: string;
    updatedAt: string;
  };
}

export interface IAuthResponseUserProfile {
  user: IAuthUser;
  organizations: IAuthOrganization[];
  merchants?: {
    merchantId: number;
    merchantUuid: string;
    merchantSlug: string;
  };
}
