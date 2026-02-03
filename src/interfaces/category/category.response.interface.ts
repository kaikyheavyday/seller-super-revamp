export interface ICategoryResponse {
  id: number;
  name: string;
  description: string;
  d365CategoryCode: string;
  status: string;
  imageUploadId: string | null;
  parentCategoryId: string | null;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
  imageUpload: null;
  children: ICategoryResponse[];
}

export interface ICategoryByProductVariantResponse {
  items: {
    productVariantId: number;
    categoryTree: ICategoryTree | null;
  }[];
}

export interface ICategoryTree {
  id: number;
  name: string;
  child: ICategoryTree | null;
}
