import './ModPanel.scss';

import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Collapse,
  FormControl,
  Input,
} from '@chakra-ui/react';
import React, { ReactElement, useState } from 'react';

import Card from '../../components/Card/Card';
import ScrollBar from '../../components/Scrollbar/ScrollBar';
import SearchBar from '../../components/SearchBar/SearchBar';
import SearchBarTagsSelector from '../../components/SearchBarTagsSelector/SearchBarTagsSelector';
import { BrandObject, getBrandsApi } from '../../services/brand.service';
import {
  CategoryObject,
  getCategoriesApi,
} from '../../services/category.service';
import {
  getIngredientsApi,
  IngredientObject,
} from '../../services/ingredients.service';
import {
  addProductApi,
  uploadProductImagesApi,
} from '../../services/product.service';
import { getProvidersApi, ProviderObject } from '../../services/providers.api';
import { handleError } from '../../utils/handleError';

const initialForm = {
  name: '',
  smallImageUrl: '',
  largeImageUrl: '',
  shortDescription: '',
  longDescription: '',
  volume: '',
  provider: '',
  brand: '',
  categories: '',
  ingredients: '',
};

const MAX_NUMBER_OF_SUGGESTIONS = 50;

const ModPanel = (): ReactElement => {
  const [form, setForm] = useState(initialForm);
  const [expanded, setExpanded] = useState<'product' | 'images' | null>(
    'product',
  );
  const [imageProductId, setImageProductId] = useState('');
  const [smallImage, setSmallImage] = useState<File | null>(null);
  const [largeImage, setLargeImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [addedProductId, setAddedProductId] = useState<number | null>(null);
  const [imageUploadSuccess, setImageUploadSuccess] = useState<boolean | null>(
    null,
  );

  // Dropdown state
  const [selectedBrands, setSelectedBrands] = useState<BrandObject[]>([]);
  const [selectedProviders, setSelectedProviders] = useState<ProviderObject[]>(
    [],
  );
  const [selectedCategories, setSelectedCategories] = useState<
    CategoryObject[]
  >([]);
  const [selectedIngredients, setSelectedIngredients] = useState<
    IngredientObject[]
  >([]);

  const fetchBrandsSuggestions = async (query: string) => {
    if (!query) return [];
    const res = await getBrandsApi(query, MAX_NUMBER_OF_SUGGESTIONS);
    return res.data;
  };
  const fetchProvidersSuggestions = async (query: string) => {
    if (!query) return [];
    const res = await getProvidersApi(query, MAX_NUMBER_OF_SUGGESTIONS);
    return res.data;
  };
  const fetchCategoriesSuggestions = async (query: string) => {
    if (!query) return [];
    const res = await getCategoriesApi(query, MAX_NUMBER_OF_SUGGESTIONS);
    return res.data;
  };
  const fetchIngredientsSuggestions = async (query: string) => {
    if (!query) return [];
    const res = await getIngredientsApi(query, MAX_NUMBER_OF_SUGGESTIONS);
    return res.data;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = {
      name: form.name,
      smallImageUrl: form.smallImageUrl,
      largeImageUrl: form.largeImageUrl,
      provider: selectedProviders[0]?.id ? Number(selectedProviders[0].id) : 1,
      brand: selectedBrands[0]?.id ? Number(selectedBrands[0].id) : 1,
      categories: selectedCategories.map((cat) => Number(cat.id)),
      shortDescription: form.shortDescription,
      longDescription: form.longDescription,
      volume: form.volume,
      ingredients: selectedIngredients.map((ing) => Number(ing.id)),
    };
    setIsLoading(true);
    setAddedProductId(null);
    try {
      const productAdded = await addProductApi(body);
      setAddedProductId(productAdded.data.id);
      setForm(initialForm);
      setSelectedBrands([]);
      setSelectedProviders([]);
      setSelectedCategories([]);
      setSelectedIngredients([]);
    } catch (error) {
      handleError('Failed to add product');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setImageUploadSuccess(null);
    try {
      await uploadProductImagesApi(imageProductId, smallImage, largeImage);
      setImageProductId('');
      setSmallImage(null);
      setLargeImage(null);
      setImageUploadSuccess(true);
      setTimeout(() => setImageUploadSuccess(null), 3000);
    } catch (error) {
      handleError('Failed to upload images');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mod-panel-container">
      <div className="card-wrapper">
        <Card>
          <div className="card-content-container">
            <Box mb={4}>
              <Button
                onClick={() =>
                  setExpanded(expanded === 'product' ? null : 'product')}
                rightIcon={
                  expanded === 'product' ? (
                    <ChevronUpIcon />
                  ) : (
                    <ChevronDownIcon />
                  )
                }
                variant="ghost"
                width="100%"
                justifyContent="space-between"
                fontSize="lg"
                mb={2}
              >
                Add a product
              </Button>
              {addedProductId && (
                <div style={{ marginTop: 16, color: 'green', fontWeight: 600 }}>
                  Product added! New product ID:
                  {' '}
                  {addedProductId}
                </div>
              )}
              <Collapse in={expanded === 'product'}>
                <div className="scrollbar-container">
                  <ScrollBar>
                    <div className="scrollbar-inside">
                      <Box p="15px">
                        <form
                          className="add-product-form two-column-form"
                          onSubmit={handleSubmit}
                        >
                          <div className="form-columns">
                            <div className="form-col">
                              <FormControl id="name" mb={4} isRequired>
                                <SearchBar
                                  label="Product name"
                                  placeholder="e.g. Nivea Moisturizing Cream"
                                  initialValue={form.name}
                                  onChange={(value) =>
                                    setForm((prev) => ({
                                      ...prev,
                                      name: value,
                                    }))}
                                />
                              </FormControl>
                              <FormControl id="provider" mb={4} isRequired>
                                <SearchBarTagsSelector
                                  getSuggestions={fetchProvidersSuggestions}
                                  selectedElements={selectedProviders}
                                  onElementChosen={(element) =>
                                    setSelectedProviders([element])}
                                  onElementRemoved={() =>
                                    setSelectedProviders([])}
                                  label="Provider"
                                  placeholder="e.g. Rossmann"
                                />
                              </FormControl>
                              <FormControl id="brand" mb={4} isRequired>
                                <SearchBarTagsSelector
                                  getSuggestions={fetchBrandsSuggestions}
                                  selectedElements={selectedBrands}
                                  onElementChosen={(element) =>
                                    setSelectedBrands([element])}
                                  onElementRemoved={() => setSelectedBrands([])}
                                  label="Brand"
                                  placeholder="e.g. Nivea"
                                />
                              </FormControl>
                              <FormControl id="categories" mb={4}>
                                <SearchBarTagsSelector
                                  getSuggestions={fetchCategoriesSuggestions}
                                  selectedElements={selectedCategories}
                                  onElementChosen={(element) =>
                                    setSelectedCategories((old) => [
                                      ...old,
                                      element,
                                    ])}
                                  onElementRemoved={(id) =>
                                    setSelectedCategories((old) =>
                                      old.filter((cat) => cat.id !== id))}
                                  label="Categories"
                                  placeholder="e.g. skin"
                                />
                              </FormControl>
                            </div>
                            <div className="form-col">
                              <FormControl id="shortDescription" mb={4}>
                                <SearchBar
                                  label="Short description"
                                  placeholder="e.g. moisturizing cream"
                                  initialValue={form.shortDescription}
                                  onChange={(value) =>
                                    setForm((prev) => ({
                                      ...prev,
                                      shortDescription: value,
                                    }))}
                                />
                              </FormControl>
                              <FormControl id="longDescription" mb={4}>
                                <SearchBar
                                  label="Long description"
                                  placeholder="e.g. This cream is perfect for dry skin..."
                                  initialValue={form.longDescription}
                                  onChange={(value) =>
                                    setForm((prev) => ({
                                      ...prev,
                                      longDescription: value,
                                    }))}
                                />
                              </FormControl>
                              <FormControl id="volume" mb={4}>
                                <SearchBar
                                  label="Volume"
                                  placeholder="e.g. 400ml"
                                  initialValue={form.volume}
                                  onChange={(value) =>
                                    setForm((prev) => ({
                                      ...prev,
                                      volume: value,
                                    }))}
                                />
                              </FormControl>
                              <FormControl id="ingredients" mb={4}>
                                <SearchBarTagsSelector
                                  getSuggestions={fetchIngredientsSuggestions}
                                  selectedElements={selectedIngredients}
                                  onElementChosen={(element) =>
                                    setSelectedIngredients((old) => [
                                      ...old,
                                      element,
                                    ])}
                                  onElementRemoved={(id) =>
                                    setSelectedIngredients((old) =>
                                      old.filter((ing) => ing.id !== id))}
                                  label="Ingredients"
                                  placeholder="e.g. shea butter"
                                />
                              </FormControl>
                            </div>
                          </div>
                          <Button
                            borderRadius={20}
                            px={8}
                            fontSize={18}
                            mt={2}
                            mb={2}
                            colorScheme="green"
                            type="submit"
                            width="100%"
                            isLoading={isLoading}
                          >
                            Add Product
                          </Button>
                        </form>
                      </Box>
                    </div>
                  </ScrollBar>
                </div>
              </Collapse>
            </Box>
            <Box>
              <Button
                onClick={() =>
                  setExpanded(expanded === 'images' ? null : 'images')}
                rightIcon={
                  expanded === 'images' ? (
                    <ChevronUpIcon />
                  ) : (
                    <ChevronDownIcon />
                  )
                }
                variant="ghost"
                width="100%"
                justifyContent="space-between"
                fontSize="lg"
                mb={2}
              >
                Add images to a product
              </Button>
              <Collapse in={expanded === 'images'}>
                <Box p="15px">
                  <form
                    className="add-product-form"
                    onSubmit={handleImageSubmit}
                  >
                    <FormControl id="imageProductId" mb={4} isRequired>
                      <SearchBar
                        label="Product ID"
                        placeholder="e.g. 1"
                        initialValue={imageProductId}
                        onChange={(value) => setImageProductId(value)}
                      />
                    </FormControl>
                    <FormControl id="smallImage" mb={4} isRequired>
                      <Input
                        pt="4px"
                        name="smallImage"
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          setSmallImage(
                            e.target.files ? e.target.files[0] : null,
                          )}
                      />
                    </FormControl>
                    <FormControl id="largeImage" mb={4} isRequired>
                      <Input
                        pt="4px"
                        name="largeImage"
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          setLargeImage(
                            e.target.files ? e.target.files[0] : null,
                          )}
                      />
                    </FormControl>
                    <Button
                      borderRadius={20}
                      px={8}
                      fontSize={18}
                      mt={2}
                      mb={2}
                      colorScheme="blue"
                      type="submit"
                      width="100%"
                      isLoading={isLoading}
                    >
                      Upload Images
                    </Button>
                    {imageUploadSuccess === true && (
                      <div
                        style={{
                          color: 'green',
                          marginTop: 8,
                          fontWeight: 600,
                        }}
                      >
                        Images uploaded successfully!
                      </div>
                    )}
                  </form>
                </Box>
              </Collapse>
            </Box>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ModPanel;
