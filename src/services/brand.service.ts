import { AxiosResponse } from 'axios';

import api from '../config/api';
import { apiUrl } from '../config/config';
import { ObjectWithNameAndId } from '../types/objectWithNameAndId';
import RequestUrlBuilder from '../utils/requestBuilder';

const brandsApiUrl = `${apiUrl}/brands`;

export type BrandObject = ObjectWithNameAndId

export const getBrandsApi = (query: string, count: number): Promise<
  AxiosResponse<BrandObject[]>
> => api.get(new RequestUrlBuilder(`${brandsApiUrl}`).setParam('count', count.toString()).setParam('query', query)
  .build());

// Example of the ids string: '5,21,52,10,11'
export const getBrandsByIdsStringApi = (ids: string): Promise<
  AxiosResponse<BrandObject[]>
> => api.get(new RequestUrlBuilder(`${brandsApiUrl}/get-by`).setParam('ids', ids).build());

export const getBrandsByIdsApi = (ids: string[]): Promise<
  AxiosResponse<BrandObject[]>
> => getBrandsByIdsStringApi(ids.join(','));
