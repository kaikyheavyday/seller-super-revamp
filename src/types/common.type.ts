export type ApiResponse<T> = {
  statusCode: string | number;
  message: string;
  data: T | null;
};

export type PaginationResponse = {
  page: number;
  pageLimit: number;
  totalItems: number;
  totalPages: number;
};
