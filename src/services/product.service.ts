import { AxiosResponse } from 'axios';

import api from '../config/api';
import { apiUrl } from '../config/config';
import RequestUrlBuilder from '../utils/requestBuilder';
import { stringToUrlString, urlStringToString } from '../utils/urlUtils';

const productsApiUrl = `${apiUrl}/products`;

enum ProductListRequestParam {
  PAGE_NUMBER = 'page-number',
  INGREDIENTS_EXCLUDE = 'ingredients-exclude',
  INGREDIENTS_INCLUDE = 'ingredients-include',
  BRANDS_EXCLUDE = 'brands-exclude',
  BRANDS_INCLUDE = 'brands-include',
  PROVIDERS = 'providers',
  CATEGORIES = 'categories',
  MIN_RATING = 'min-rating',
  PHRASE = 'phrase',
  SORT_BY = 'sort-by',
  LIKED = 'liked',
  K_NEIGHBOURS = 'kNeighbours',
  QUERY = 'query',
}

export enum SortOption {
  MATCH_SCORE = 'match-score',
  OPINIONS_COUNT = 'opinions-count',
  RATES_COUNT = 'rates-count',
  RATING = 'rating',
}

export enum SortOrder {
  ASCENDING = 'a',
  DESCENDING = 'd',
}

export interface SortBy {
  option: SortOption;
  order: SortOrder;
}

export interface ProductCriteria {
  ingredientsToIncludeIds?: string[];
  ingredientsToExcludeIds?: string[];
  brandsToIncludeIds?: string[];
  brandsToExcludeIds?: string[];
  providersIds?: string[];
  categoriesIds?: string[];
  minRating?: number;
  sortingCriteria?: SortBy[];
  phrase?: string;
  kNeighbours?: number;
  query?: string;
}

export interface ProductObject {
  id: string;
  name: string;
  brand: { id: string; name: string };
  smallImageUrl: string;
  provider: { id: string; name: string };
  shortDescription: string;
  isLiked?: boolean;
  rating: number;
}

export interface ProductResponse {
  products: ProductObject[];
  totalPages: number;
}

export interface ProductDetailsResponse {
  id: string;
  name: string;
  largeImageUrl: string;
  provider: { id: string; name: string };
  brand: { id: string; name: string };
  longDescription: string;
  volume: number;
  ingredients: { id: string; name: string }[];
  isLiked: boolean | null;
  rating: number;
}

export interface AddProductPayload {
  name: string;
  smallImageUrl: string;
  largeImageUrl: string;
  provider: number;
  brand: number;
  categories: number[];
  shortDescription: string;
  longDescription: string;
  volume: string;
  ingredients: number[];
}

export interface AddProductResponse {
  id: number;
  name: string;
  smallImageUrl: string;
  largeImageUrl: string;
  provider: { id: number; name: string };
  brand: { id: number; name: string };
  categories: { id: number; name: string }[];
  shortDescription: string;
  longDescription: string;
  volume: string;
  ingredients: { id: number; name: string }[];
  rating: number;
  ratingSum: number;
  likedBy: number[];
  ratings: Record<string, number>;
}

export const parseSortBy = (input: string): SortBy | undefined => {
  const parts = input.split('-');
  const order = parts[0];
  const option = parts.slice(1).join('-');
  if (
    (order === SortOrder.ASCENDING || order === SortOrder.DESCENDING)
    && Object.values(SortOption).includes(option as SortOption)
  ) {
    return {
      option: option as SortOption,
      order: order as SortOrder,
    };
  }
  return undefined;
};

export const urlToProductCriteria = (url: string): ProductCriteria => {
  const queryParams = new URLSearchParams(url);

  const sortingCriteriaParam = queryParams.get(ProductListRequestParam.SORT_BY);
  let sortingCriteria: SortBy[] = [];
  if (sortingCriteriaParam) {
    sortingCriteria = sortingCriteriaParam
      .split(',')
      .map(parseSortBy)
      .filter((sortBy): sortBy is SortBy => sortBy !== undefined);
  }

  const minRatingParam = queryParams.get(ProductListRequestParam.MIN_RATING);
  let minRating: number | undefined;
  if (minRatingParam) {
    const parsedRating = parseInt(minRatingParam, 10);
    if (!Number.isNaN(parsedRating)) {
      minRating = parsedRating;
    }
  }

  const criteria: ProductCriteria = {
    phrase: queryParams.get(ProductListRequestParam.PHRASE) ?? undefined,
    ingredientsToExcludeIds:
      queryParams
        .get(ProductListRequestParam.INGREDIENTS_EXCLUDE)
        ?.split(',') ?? undefined,
    ingredientsToIncludeIds:
      queryParams
        .get(ProductListRequestParam.INGREDIENTS_INCLUDE)
        ?.split(',') ?? undefined,
    brandsToExcludeIds:
      queryParams.get(ProductListRequestParam.BRANDS_EXCLUDE)?.split(',')
      ?? undefined,
    brandsToIncludeIds:
      queryParams.get(ProductListRequestParam.BRANDS_INCLUDE)?.split(',')
      ?? undefined,
    providersIds:
      queryParams.get(ProductListRequestParam.PROVIDERS)?.split(',')
      ?? undefined,
    categoriesIds:
      queryParams.get(ProductListRequestParam.CATEGORIES)?.split(',')
      ?? undefined,
    minRating,
    sortingCriteria,
    query: queryParams.get(ProductListRequestParam.QUERY) ?? undefined,
    kNeighbours: parseInt(
      queryParams.get(ProductListRequestParam.K_NEIGHBOURS) ?? '0',
      10,
    ),
  };

  return criteria;
};

export const productCriteriaToUrlBuilder = (
  baseUrl: string,
  criteria: ProductCriteria,
): RequestUrlBuilder => {
  const builder = new RequestUrlBuilder(baseUrl);

  const setIdsArrayParam = (key: string, values?: string[]) => {
    if (values && values.length > 0) {
      builder.setParam(key, values.join(','));
    }
  };

  setIdsArrayParam(
    ProductListRequestParam.INGREDIENTS_INCLUDE,
    criteria.ingredientsToIncludeIds,
  );
  setIdsArrayParam(
    ProductListRequestParam.INGREDIENTS_EXCLUDE,
    criteria.ingredientsToExcludeIds,
  );
  setIdsArrayParam(
    ProductListRequestParam.BRANDS_INCLUDE,
    criteria.brandsToIncludeIds,
  );
  setIdsArrayParam(
    ProductListRequestParam.BRANDS_EXCLUDE,
    criteria.brandsToExcludeIds,
  );
  setIdsArrayParam(ProductListRequestParam.CATEGORIES, criteria.categoriesIds);
  setIdsArrayParam(ProductListRequestParam.PROVIDERS, criteria.providersIds);

  if (criteria.phrase) {
    // The phrase has the uneccessary spaces removed
    // and the rest of the spaces are replaced with '%20'
    builder.setParam(
      ProductListRequestParam.PHRASE,
      stringToUrlString(criteria.phrase),
    );
  }

  if (criteria.minRating) {
    builder.setParam(
      ProductListRequestParam.MIN_RATING,
      criteria.minRating.toString(),
    );
  }

  if (criteria.sortingCriteria && criteria.sortingCriteria.length > 0) {
    builder.setParam(
      ProductListRequestParam.SORT_BY,
      criteria.sortingCriteria
        .map((sortBy: SortBy) => `${sortBy.order}-${sortBy.option}`)
        .join(','),
    );
  }

  if (criteria.kNeighbours) {
    builder.setParam(
      ProductListRequestParam.K_NEIGHBOURS,
      criteria.kNeighbours.toString(),
    );
  }

  if (criteria.query) {
    builder.setParam(
      ProductListRequestParam.QUERY,
      stringToUrlString(criteria.query),
    );
  }

  return builder;
};

export const productCriteriaToUrl = (
  baseUrl: string,
  criteria: ProductCriteria,
): string => productCriteriaToUrlBuilder(baseUrl, criteria).build();

export const getProductsListApi = (
  criteria?: ProductCriteria,
  pageNumber?: number,
): Promise<AxiosResponse<ProductResponse>> => {
  if (criteria === undefined) {
    const builder = new RequestUrlBuilder(`${productsApiUrl}/search`);
    builder.setParam(
      ProductListRequestParam.PAGE_NUMBER,
      (pageNumber ?? 0).toString(),
    );
    return api.get(builder.build());
  }

  const builder = productCriteriaToUrlBuilder(
    `${productsApiUrl}/search`,
    criteria,
  );
  builder.setParam(
    ProductListRequestParam.PAGE_NUMBER,
    (pageNumber ?? 0).toString(),
  );

  return api.get(builder.build());
};

export const getProductDetailsApi = (
  id: string,
): Promise<AxiosResponse<ProductDetailsResponse>> =>
  api.get(`${productsApiUrl}/${id}`);

export const getLikedProductsApi = (
  pageNumber?: number,
): Promise<AxiosResponse<ProductResponse>> => {
  const builder = new RequestUrlBuilder(productsApiUrl);
  builder.setParam(
    ProductListRequestParam.PAGE_NUMBER,
    (pageNumber ?? 0).toString(),
  );
  builder.setParam(ProductListRequestParam.LIKED, 'true');

  return api.get(builder.build());
};

export const getProductsListAiApi = (
  criteria?: ProductCriteria,
): Promise<AxiosResponse<ProductResponse>> => {
  if (criteria === undefined) {
    const builder = new RequestUrlBuilder(`${productsApiUrl}/AskAI`);
    return api.post(builder.build());
  }

  const builder = productCriteriaToUrlBuilder(
    `${productsApiUrl}/AskAI`,
    criteria,
  );

  return api.post(builder.build(), {
    query: criteria.query ? urlStringToString(criteria.query) : undefined,
    kNeighbours: criteria.kNeighbours,
  });
};

export const addProductApi = (
  payload: AddProductPayload,
): Promise<AxiosResponse<AddProductResponse>> => api.post(`${productsApiUrl}`, payload);

export const uploadProductImagesApi = (
  productId: string,
  smallImg: File | null,
  bigImg: File | null,
): Promise<void> => {
  const formData = new FormData();
  if (smallImg) formData.append('smallImg', smallImg);
  if (bigImg) formData.append('bigImg', bigImg);

  return api.post(`/products/${productId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
