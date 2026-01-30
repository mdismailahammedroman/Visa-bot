// src/app/utils/pagination.ts
type PaginationOptions = {
  page?: string | number;
  limit?: string | number;
};

export const getPagination = (
  options: PaginationOptions,
  config?: {
    defaultLimit?: number;
    maxLimit?: number;
  },
) => {
  const page = Math.max(Number(options.page) || 1, 1);

  const limit = Math.min(
    Number(options.limit) || config?.defaultLimit || 10,
    config?.maxLimit || 100,
  );

  const skip = (page - 1) * limit;

  return {
    page,
    limit,
    skip,
  };
};

export const buildPaginationMeta = (
  total: number,
  page: number,
  limit: number,
) => {
  const totalPage = Math.ceil(total / limit);

  return {
    page,
    limit,
    total,
    totalPage,
  };
};
