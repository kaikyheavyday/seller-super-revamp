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

export interface IMerchantList {
  id: number;
  slug: string;
  merchantType: string;
  name: string;
  description: string;
  tel: string;
  highlight: string | null;
  keyword: string | null;
  email: string | null;
  merchantLogo: string | null;
  merchantIcon: string | null;
  contactAddress: string | null;
  postCodeContactAddress: string | null;
  provinceContactAddress: string | null;
  districtContactAddress: string | null;
  subdistrictContactAddress: string | null;
  lineSocialContact: string | null;
  facebookSocialContact: string | null;
  youtubeSocialContact: string | null;
  instagramSocialContact: string | null;
  companyName: string;
  companyId: string;
  companyBranch: string | null;
  companyAddress: string | null;
  postCodeCompanyAddress: string | null;
  provinceCompanyAddress: string | null;
  districtCompanyAddress: string | null;
  subdistrictCompanyAddress: string | null;
  status: string;
  verified: boolean;
  expiredDate: string | null;
  createdAt: string;
  currentSubscriptionPackageSlug: string;
  currentSubscriptionPackageStartDate: string | null;
  currentSubscriptionPackagePrice: number;
  currentSubscriptionPackageTotalNumberOfDay: number;
  commision: number;
  marketplaceCommision: number;
  discountCommision: number;
  platformCommision: number;
  shopditpayCreditCardCommision: number;
  shopditpayLinepayCommision: number;
  shopditpayAirpayCommision: number;
  shopditpayScbEasyCommision: number;
  shopditpayBblCommision: number;
  shopditpayBaybankCommision: number;
  shopditpayTruemoneyCommision: number;
  primaryColor: string;
  shopditPayMerchantId: string | null;
  appsFlyerAppleId: string | null;
  appsFlyerOnelinkId: string | null;
  deeplinkHostUrl: string | null;
  chatContract: string | null;
  isFinishMerchantGuide: boolean;
  isEnableSES: boolean;
  locationName: string;
  locationCode: string;
  availableLocale: string[];
  locationCurrencyIsoCode: string;
  locationCurrencySymbol: string;
  locationUTC: string;
  locationTimezone: string;
  defaultLocale: string;
  urlGoogleMap: string | null;
  isEnableGoogleAi: boolean;
  isEnableCache: boolean;
  isEnableOtpLogin: boolean;
  merchantWallet: string | null;
  shopditProductWhitelists: string[];
  isEditOrderTime: boolean;
  orderExpireTime: number;
  orderSuccessTime: number;
  kind: string;
  merchantWebUrl: string;
}

export interface IAuthResponseUserProfileWithMerchants {
  id: number;
  uuid: string;
  countryCode: string;
  tel: string;
  email: string;
  name: string;
  firstNameTh: string;
  lastNameTh: string;
  middleNameTh: string;
  firstNameEn: string | null;
  lastNameEn: string | null;
  middleNameEn: string | null;
  role: string;
  locale: string;
  interfaceMode: string;
  status: string;
  gender: string | null;
  onBoardingStep: string | null;
  birthDate: string | null;
  cisNumber: string;
  idCard: string | null;
  kycStatus: string;
  maritalStatus: string | null;
  isSeller: boolean;
  businessType: string[];
  remarkKyc: string | null;
  createdInAuth: string;
  username: string;
  registerStatus: string;
  authRefreshToken: string;
  registerStep: string;
  createdAt: string;
  updatedAt: string;
  merchants: IMerchantList[];
  imageUpload: string | null;
}
