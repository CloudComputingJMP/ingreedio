import { AxiosResponse } from 'axios';

import api from '../config/api';
import { apiUrl } from '../config/config';
import { ObjectWithNameAndId } from '../types/objectWithNameAndId';
import RequestUrlBuilder from '../utils/requestBuilder';

const ingredientsApiUrl = `${apiUrl}/ingredients`;

export type IngredientObject = ObjectWithNameAndId

export const getIngredientsApi = (query: string, count: number, skipAllergens?: boolean): Promise<
  AxiosResponse<IngredientObject[]>
> => api.get(new RequestUrlBuilder(`${ingredientsApiUrl}`).setParam('skip-allergens', skipAllergens?.toString() ?? 'false').setParam('count', count.toString()).setParam('query', query)
  .build());

// Example of the ids string: '5,21,52,10,11'
export const getIngredientsByIdsStringApi = (ids: string): Promise<
  AxiosResponse<IngredientObject[]>
> => api.get(new RequestUrlBuilder(`${ingredientsApiUrl}/get-by`).setParam('ids', ids).build());

export const getIngredientsByIdsApi = (ids: string[]): Promise<
  AxiosResponse<IngredientObject[]>
> => getIngredientsByIdsStringApi(ids.join(','));
