export interface IRequestQueryProductMerchant {
  page: number;
  pageLimit: number;
  search?: string;
  searchType?: string;
  productTypeId?: number;
  categoryIds?: string;
  merchantProductStatus?: string;
}

export interface IRequestQueryCreateProduct {
  page: number;
  pageLimit: number;
  search?: string;
  searchType?: string;
}
