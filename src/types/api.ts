export type ApiError = {
  code: string;
  message: string;
  status?: number;
};

export type ApiResponse<T> = {
  data: T;
  status: number;
};
