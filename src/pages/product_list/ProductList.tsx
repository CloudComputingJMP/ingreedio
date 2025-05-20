import './ProductList.scss';

import { CircularProgress } from '@chakra-ui/react';
import { AxiosResponse } from 'axios';
import React, { ReactElement, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import Filters from '../../components/Filters/Filters';
import PagingScrollBar from '../../components/PagingScrollBar/PagingScrollBar';
import ProductTile from '../../components/ProductTile/ProductTile';
import useEffectSingular from '../../hooks/useEffectSignular';
import { ROUTES } from '../../routes/routes';
import { BrandObject } from '../../services/brand.service';
import { CategoryObject } from '../../services/category.service';
import { IngredientObject } from '../../services/ingredients.service';
import {
  getProductsListAiApi,
  getProductsListApi,
  ProductCriteria,
  productCriteriaToUrl,
  ProductObject,
  ProductResponse,
  SortBy,
  SortOption,
  SortOrder,
  urlToProductCriteria,
} from '../../services/product.service';
import { ProviderObject } from '../../services/providers.api';
import { RootState } from '../../store/reducers';
import { ObjectWithNameAndId } from '../../types/objectWithNameAndId';
import { handleError } from '../../utils/handleError';

const ProductList = (): ReactElement => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const queryProductCriteria: ProductCriteria = urlToProductCriteria(
    location.search,
  );

  const [isAi, setIsAi] = useState<boolean>(location.state?.fromAi ?? false);
  const [products, setProducts] = useState<ProductObject[]>([]);
  const [pageNumber, setPageNumber] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const fetchProducts = async (criteria: ProductCriteria, page: number) => {
    if (isFetching || page >= totalPages) return;

    setIsFetching(true);
    try {
      let response: AxiosResponse<ProductResponse>;
      if (isAi) {
        response = await getProductsListAiApi(criteria);
        setIsAi(false);
      } else {
        response = await getProductsListApi(criteria, page);
      }
      if (response && response.data) {
        setProducts((prevProducts) => {
          const newProducts = response.data.products.filter(
            (newProduct) =>
              !prevProducts.some((product) => product.id === newProduct.id),
          );
          return [...prevProducts, ...newProducts];
        });
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      handleError('An error occurred while loading products.');
    } finally {
      setIsFetching(false);
    }
  };

  const handleSearch = (
    phrase: string,
    selectedIngredients: ObjectWithNameAndId[] | null,
    selectedProviders: ObjectWithNameAndId[] | null,
    selectedBrands: ObjectWithNameAndId[] | null,
    selectedCategories: ObjectWithNameAndId[] | null,
    sortBy: SortBy | null,
  ) => {
    const criteria: ProductCriteria = {
      phrase,
      ingredientsToIncludeIds: selectedIngredients?.map(
        (ingr: IngredientObject) => ingr.id,
      ),
      providersIds: selectedProviders?.map((ingr: ProviderObject) => ingr.id),
      brandsToIncludeIds: selectedBrands?.map((ingr: BrandObject) => ingr.id),
      categoriesIds: selectedCategories?.map((ingr: CategoryObject) => ingr.id),
      ...(sortBy
        ? {
          sortingCriteria: [sortBy],
        }
        : { option: SortOption.MATCH_SCORE, order: SortOrder.DESCENDING }),
    };
    setProducts([]);
    setPageNumber(0);
    setTotalPages(1);
    fetchProducts(criteria, 0);
    navigate(productCriteriaToUrl(ROUTES.PRODUCTS, criteria));
  };

  useEffectSingular(() => {
    fetchProducts(queryProductCriteria, pageNumber);
  });

  const loadMoreProducts = () => {
    if (!isFetching) {
      setPageNumber((prevPageNumber) => prevPageNumber + 1);
    }
    if (pageNumber > 0) fetchProducts(queryProductCriteria, pageNumber);
  };

  return (
    <div className="product-list-page">
      <PagingScrollBar
        className="scrollbar-container"
        onLoadMore={loadMoreProducts}
      >
        <ul className="product-grid">
          {products.length === 0 && !isFetching && (
            <div className="no-products-message">No products found</div>
          )}
          {products.map((product) => (
            <li key={product.id} className="product">
              <Link to={`/products/${product.id}`}>
                <ProductTile
                  name={`${product.brand.name} ${product.name}`}
                  provider={product.provider.name}
                  smallImageUrl={product.smallImageUrl}
                  shortDescription={product.shortDescription}
                  rating={product.rating}
                  showLike={isAuthenticated}
                  isLiked={!!product.isLiked}
                />
              </Link>
            </li>
          ))}
        </ul>
        {isFetching && (
          <div className="loading-indicator">
            <CircularProgress isIndeterminate color="green" trackColor="none" />
          </div>
        )}
      </PagingScrollBar>
      <Filters
        queryProductCriteria={queryProductCriteria}
        handleSearch={handleSearch}
      />
    </div>
  );
};

export default ProductList;
