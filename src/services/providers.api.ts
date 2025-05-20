import { AxiosResponse } from 'axios';

import api from '../config/api';
import { apiUrl } from '../config/config';
import { ObjectWithNameAndId } from '../types/objectWithNameAndId';
import RequestUrlBuilder from '../utils/requestBuilder';

const providersApiUrl = `${apiUrl}/providers`;

export type ProviderObject = ObjectWithNameAndId

export const getProvidersApi = (query: string, count: number): Promise<
  AxiosResponse<ProviderObject[]>
> => api.get(new RequestUrlBuilder(`${providersApiUrl}`).setParam('count', count.toString()).setParam('query', query)
  .build());

// Example of the ids string: '5,21,52,10,11'
export const getProvidersByIdsStringApi = (ids: string): Promise<
  AxiosResponse<ProviderObject[]>
> => api.get(new RequestUrlBuilder(`${providersApiUrl}/get-by`).setParam('ids', ids).build());

export const getProvidersByIdsApi = (ids: string[]): Promise<
  AxiosResponse<ProviderObject[]>
> => getProvidersByIdsStringApi(ids.join(','));
