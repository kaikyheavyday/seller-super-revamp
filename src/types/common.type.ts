export type ApiResponse<T> = {
  statusCode: string | number;
  message: string;
  data: T | null;
};
