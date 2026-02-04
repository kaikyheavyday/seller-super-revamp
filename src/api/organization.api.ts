import { IOrganizationResponse } from "@/interfaces/organization/organization.response.interface";
import { customerAPI } from "@/libs/axios";
import { ApiResponse } from "@/types/common.type";

export const getMyOrganizationList = async (
  userUuid: string,
  params: { page: number; limit: number },
) => {
  const response = await customerAPI.get<ApiResponse<IOrganizationResponse>>(
    `/organization/user/${userUuid}`,
    {
      params: {
        page: params.page,
        limit: params.limit,
      },
    },
  );
  return response.data;
};
