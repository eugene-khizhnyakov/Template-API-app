import { Pagination } from 'nestjs-typeorm-paginate';
import { SelectQueryBuilder } from 'typeorm';

import { IPaginateOptions } from './types';

export async function paginateRawData<TResponse, TEntity>(
  query: SelectQueryBuilder<TEntity>,
  options: IPaginateOptions
): Promise<Pagination<TResponse>> {
  const page = Number(options.page);
  const limit = Number(options.limit);
  const skip = (page - 1) * limit;

  const items = await query.offset(skip).limit(limit).getRawMany();

  const totalItems = await query.getCount();

  return {
    items,
    meta: {
      totalItems,
      itemCount: items.length,
      itemsPerPage: limit,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page,
    },
  };
}
