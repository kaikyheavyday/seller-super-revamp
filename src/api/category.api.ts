import {
  ICategoryByProductVariantResponse,
  ICategoryResponse,
} from "@/interfaces/category/category.response.interface";
import { productAPI } from "@/libs/axios";
import { ApiResponse } from "@/types/common.type";

export const getCategories = async () => {
  const response =
    await productAPI.get<ApiResponse<ICategoryResponse[]>>("/v1/category");

  return response.data;
};

export const getCategoriesByProductVariant = async (
  productVariantIds: string,
) => {
  const response = await productAPI.get<
    ApiResponse<ICategoryByProductVariantResponse>
  >(`v1/category/hierarchy`, {
    params: {
      productVariantIds: productVariantIds,
    },
  });

  return response.data;
};
