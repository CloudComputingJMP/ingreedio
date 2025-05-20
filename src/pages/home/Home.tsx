// Home.tsx

import './Home.scss';

import { AxiosResponse } from 'axios';
import React, { FormEvent, ReactElement, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import AutocompleteSearchBar from '../../components/AutocompleteSearchBar/AutocompleteSearchBar';
import FilledButton, {
  ColorScheme,
} from '../../components/FilledButton/FilledButton';
import SearchBar from '../../components/SearchBar/SearchBar';
import Tag from '../../components/Tag/Tag';
import { ROUTES } from '../../routes/routes';
import {
  getIngredientsApi,
  IngredientObject,
} from '../../services/ingredients.service';
import {
  ProductCriteria,
  productCriteriaToUrl,
} from '../../services/product.service';
import { RootState } from '../../store/reducers';
import { TagColor } from '../../theme/tagColor';
import { ObjectWithNameAndId } from '../../types/objectWithNameAndId';

const MAX_INGREDIENTS_SUGGESTIONS = 50;

const Home = (): ReactElement => {
  const allergensSelector = useSelector(
    (state: RootState) => state.like.dislikedIngredients,
  );
  const hasAllergens: boolean = allergensSelector?.length > 0;

  const navigate = useNavigate();
  // todo: keep ingredients in a provider to not duplicate code between Home and Products list
  const [phrase, setPhrase] = useState<string>('');
  const [ingredientsSuggestions, setIngredientsSuggestions] = useState<
    IngredientObject[] | null
  >(null);

  const [selectedIngredients, setSelectedIngredients] = useState<
    IngredientObject[]
  >([]);

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const criteria: ProductCriteria = {
      phrase,
      ingredientsToIncludeIds: selectedIngredients?.map(
        (ingr: IngredientObject) => ingr.id,
      ),
    };
    navigate(productCriteriaToUrl(ROUTES.PRODUCTS, criteria));
  };

  const onSearchBarChange = (query: string) => {
    if (query.length === 0) {
      setIngredientsSuggestions(null);
      return;
    }
    getIngredientsApi(query, MAX_INGREDIENTS_SUGGESTIONS, hasAllergens).then(
      (value: AxiosResponse<IngredientObject[]>) => {
        setIngredientsSuggestions(value.data);
      },
    );
  };

  const onIngredientClick = (suggestion: ObjectWithNameAndId) => {
    if (
      selectedIngredients.find(
        (value: IngredientObject) => value.id === suggestion.id,
      )
    ) {
      return;
    }
    setSelectedIngredients((prevIngredients: IngredientObject[]) => [
      ...prevIngredients,
      suggestion,
    ]);
  };

  const handleRemoveIngredient = (id: string) => {
    // eslint-disable-next-line max-len
    setSelectedIngredients((prevIngredients: IngredientObject[]) =>
      prevIngredients.filter((ingredient) => ingredient.id !== id));
  };

  return (
    <div className="home-screen">
      <div className="centered-component">
        <div className="title-container">
          <h1 className="title">
            Search products by
            <span className="green-highlight"> ingredients</span>
          </h1>
        </div>
        <form className="search-container" onSubmit={handleSearch}>
          <SearchBar
            id="product-search"
            label="Product"
            placeholder="e.g. shampoo"
            onChange={(value) => setPhrase(value)}
          />
          <AutocompleteSearchBar
            id="ingredient-search"
            label="Ingredients"
            placeholder="e.g. shea butter"
            suggestions={ingredientsSuggestions ?? undefined}
            onChange={onSearchBarChange}
            onSuggestionClick={onIngredientClick}
          />
          <div className="search-button-container">
            <div className="inner-search-button-container">
              <div className="search-button">
                <FilledButton>Search</FilledButton>
              </div>
            </div>
          </div>
          <div />
          <div className="ingredient-tag-container">
            <div className="ingredients-tags">
              {selectedIngredients.map((ingredient) => (
                <Tag
                  key={ingredient.id}
                  text={ingredient.name}
                  color={TagColor.INGREDIENT}
                  onDelete={() => handleRemoveIngredient(ingredient.id)}
                />
              ))}
            </div>
          </div>
        </form>
        <div className="ai-search-redirect">
          <FilledButton
            colorScheme={ColorScheme.AI}
            onClick={() => navigate(ROUTES.AI)}
          >
            Try our new AI search! ✨
          </FilledButton>
        </div>
      </div>
    </div>
  );
};

export default Home;
