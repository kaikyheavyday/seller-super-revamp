import { PaginationResponse } from "@/types/common.type";

export interface IProductResponseBrand {
  id: number;
  name: string;
}

export interface IProductResponseCategory {
  id: number;
  name: string;
  parentCategoryId: string | null;
}

export interface IProductResponseProduct {
  id: number;
  name: string | null;
  brand: IProductResponseBrand;
  category: IProductResponseCategory;
}

export interface IProductResponseVariant {
  id: number;
  alias: string;
  sku: string;
  barcode: string;
  productId: number;
  product: IProductResponseProduct;
}

export interface IProductResponseType {
  code: string;
  name: string;
  name_th: string;
}

export interface IProductResponseMerchantProduct {
  id: number;
  merchantCustomName: string | null;
  thumbnail: string | null;
  quantity: number | null;
  merchantProductStatus: "Selling" | "Hidden" | "OutOfStock" | "NotApproved";
  status: "Active" | "Inactive";
  priceVat: number | null;
  priceExcludeVat: number | null;
  priceVatPercent: number | null;
  priceIncludeVat: number | null;
  specialPriceVat: number | null;
  specialPriceIncludeVat: number | null;
  specialPriceExcludeVat: number | null;
  specialPriceVatPercent: number | null;
  prepareDays: number | null;
  createdAt: string;
  productVariant: IProductResponseVariant;
  productType: IProductResponseType;
}

export interface IProductResponseListResponse {
  items: IProductResponseMerchantProduct[];
  meta: PaginationResponse;
}

export interface IMerchantProductCountResponse {
  ALL: number;
  Hidden: number;
  NotApproved: number;
  OutOfStock: number;
  Selling: number;
}

export interface IProductMasterDataResponse {
  id: number;
  type: string;
  code: string;
  name: string;
  name_th: string;
  displayOrder: number;
}

export interface IProductVariantImageResponse {
  id: number;
  productVariantId: number;
  imageUploadId: number;
  order: number;
  createdAt: string;
  imageUpload: {
    id: number;
    name: string;
    url: string;
  };
}

export interface IProductImport {
  id: string;
  name: string;
  sku: string;
  brand: string;
  barcode: string;
  categoryName: string | null;
  image: string | null;
  productVariant: null;
}

export interface IProductImportResponse {
  meta: PaginationResponse;
  items: IProductImport[];
}
