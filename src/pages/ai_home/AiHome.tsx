// Home.tsx

import './AiHome.scss';

import React, { FormEvent, ReactElement, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import FilledButton, {
  ColorScheme,
} from '../../components/FilledButton/FilledButton';
import SearchBar from '../../components/SearchBar/SearchBar';
import TextButton from '../../components/TextButton/TextButton';
import { ROUTES } from '../../routes/routes';
import {
  ProductCriteria,
  productCriteriaToUrl,
} from '../../services/product.service';

const MAX_INGREDIENTS_SUGGESTIONS = 50;

const AiHome = (): ReactElement => {
  const navigate = useNavigate();
  const [phrase, setPhrase] = useState<string>('');

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const criteria: ProductCriteria = {
      query: phrase,
      kNeighbours: MAX_INGREDIENTS_SUGGESTIONS,
    };
    navigate(productCriteriaToUrl(ROUTES.PRODUCTS, criteria), {
      state: { fromAi: true },
    });
  };

  return (
    <div className="ai-home-screen">
      <div className="ai-centered-component">
        <div className="ai-title-container">
          <h1 className="ai-title">
            Search products by
            <span className="ai-green-highlight"> ingredients</span>
          </h1>

          <h2 className="ai-subtitle">powered by AI</h2>
        </div>
        <form className="ai-search-container" onSubmit={handleSearch}>
          <SearchBar
            id="product-search"
            label="Prompt"
            placeholder="e.g. moisturizing cream for dry skin"
            onChange={(value) => setPhrase(value)}
          />
          <div className="ai-search-button-container">
            <div className="ai-inner-search-button-container">
              <div className="ai-search-button">
                <FilledButton colorScheme={ColorScheme.AI}>
                  AI Search
                </FilledButton>
              </div>
            </div>
          </div>
          <div />
        </form>
        <div className="search-redirect">
          <TextButton onClick={() => navigate(ROUTES.HOME)}>
            Go back to normal search
          </TextButton>
        </div>
      </div>
    </div>
  );
};

export default AiHome;
