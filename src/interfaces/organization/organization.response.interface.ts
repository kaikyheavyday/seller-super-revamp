import { IAuthOrganization, IAuthUser } from "../auth/auth.response.interface";

export interface IOrganizationResponse {
  organizations: IAuthOrganization[];
  user: IAuthUser;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    totalOrganizations: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface IOrganizationJuristicTypeMasterDataResponse {
  id: number;
  label: string;
  value: string;
  prefix: string | null;
  subfix: string | null;
  language: string;
  createdAt?: string;
  updatedAt?: string;
}
