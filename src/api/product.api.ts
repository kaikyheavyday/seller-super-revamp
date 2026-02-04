import {
  IRequestQueryCreateProduct,
  IRequestQueryProductMerchant,
} from "@/interfaces/product/product.request.interface";
import {
  IMerchantProductCountResponse,
  IProductResponseListResponse,
  IProductMasterDataResponse,
  IProductVariantImageResponse,
  IProductImportResponse,
} from "@/interfaces/product/product.response.interface";
import { productAPI } from "@/libs/axios";
import { ApiResponse } from "@/types/common.type";

export const getMerchantProducts = async (
  merchantSlug: string,
  params: IRequestQueryProductMerchant,
) => {
  const response = await productAPI.get<
    ApiResponse<IProductResponseListResponse>
  >(`/v1/product`, {
    headers: {
      CurrentMerchantSlug: merchantSlug,
    },
    params: {
      page: params.page,
      pageLimit: params.pageLimit,
      search: params.search,
      searchType: params.searchType,
      productTypeId: params.productTypeId,
      categoryIds: params.categoryIds,
      merchantProductStatus: params.merchantProductStatus,
    },
  });

  return response.data;
};

export const getMerchantsProductCount = async (merchantSlug: string) => {
  const response = await productAPI.get<
    ApiResponse<IMerchantProductCountResponse>
  >(`/v1/product/status-count`, {
    headers: {
      CurrentMerchantSlug: merchantSlug,
    },
  });
  console.log(response);
  return response.data;
};

export const getMasterDataProduct = async (type: string) => {
  const response = await productAPI.get<
    ApiResponse<IProductMasterDataResponse[]>
  >(`/v1/master-data`, {
    params: {
      type: type,
    },
  });

  return response.data;
};

export const getProductVariantImages = async (
  merchantSlug: string,
  productVariantIds: string,
) => {
  const response = await productAPI.get<
    ApiResponse<IProductVariantImageResponse[]>
  >(`/v1/product/variant-images`, {
    headers: {
      CurrentMerchantSlug: merchantSlug,
    },
    params: {
      productVariantIds: productVariantIds,
    },
  });

  return response.data;
};

export const getProductImport = async (
  merchantSlug: string,
  params: IRequestQueryCreateProduct,
) => {
  const response = await productAPI.get<ApiResponse<IProductImportResponse>>(
    `/v1/product/product-import`,
    {
      headers: {
        CurrentMerchantSlug: merchantSlug,
      },
      params: {
        page: params.page,
        pageLimit: params.pageLimit,
        search: params.search,
        searchType: params.searchType,
      },
    },
  );

  return response.data;
};
