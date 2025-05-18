import React, { ReactElement, useState } from 'react';

import {
  Button,
  FormControl,
  FormHelperText,
  Input,
  Textarea,
  FormLabel,
  Collapse,
  Box,
} from '@chakra-ui/react';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';

import Card from '../../components/Card/Card';
import ProfileSection from '../../components/ProfileSection/ProfileSection';

import './ModPanel.scss';

const initialForm = {
  name: '',
  smallImageUrl: '',
  largeImageUrl: '',
  provider: '',
  brand: '',
  categories: '',
  shortDescription: '',
  longDescription: '',
  volume: '',
  ingredients: '',
};

const ModPanel = (): ReactElement => {
  const [form, setForm] = useState(initialForm);
  const [expanded, setExpanded] = useState<'product' | 'images' | null>(
    'product',
  );
  const [imageProductId, setImageProductId] = useState('');
  const [smallImage, setSmallImage] = useState<File | null>(null);
  const [largeImage, setLargeImage] = useState<File | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Prepare request body
    const body = {
      ...form,
      provider: Number(form.provider),
      brand: Number(form.brand),
      categories: form.categories.split(',').map((id) => Number(id.trim())),
      ingredients: form.ingredients.split(',').map((id) => Number(id.trim())),
    };
    // TODO: Call API to add product
    // await addProductApi(body);
    console.log('Product added:', body);
  };

  const handleImageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Call API to upload images for product with ID imageProductId
    // Example: await uploadImagesApi(imageProductId, smallImage, largeImage);
    console.log('Images uploaded for product ID:', imageProductId);
  };

  return (
    <div className="mod-panel-container">
      <div className="card-wrapper">
        <Card>
          <div className="card-content-container">
            {/* Add a Product Section */}
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
              <Collapse in={expanded === 'product'}>
                <Box p="15px">
                  <form
                    className="add-product-form two-column-form"
                    onSubmit={handleSubmit}
                  >
                    <div className="form-columns">
                      <div className="form-col">
                        <FormControl id="name" mb={4} isRequired>
                          <FormLabel>Product name</FormLabel>
                          <Input
                            name="name"
                            type="text"
                            value={form.name}
                            onChange={handleChange}
                          />
                        </FormControl>
                        <FormControl id="provider" mb={4} isRequired>
                          <FormLabel>Provider ID</FormLabel>
                          <Input
                            name="provider"
                            type="number"
                            value={form.provider}
                            onChange={handleChange}
                          />
                        </FormControl>
                        <FormControl id="brand" mb={4} isRequired>
                          <FormLabel>Brand ID</FormLabel>
                          <Input
                            name="brand"
                            type="number"
                            value={form.brand}
                            onChange={handleChange}
                          />
                        </FormControl>
                        <FormControl id="categories" mb={4}>
                          <FormLabel>
                            Category IDs (comma separated)
                          </FormLabel>
                          <Input
                            name="categories"
                            type="text"
                            value={form.categories}
                            onChange={handleChange}
                          />
                        </FormControl>
                      </div>
                      <div className="form-col">
                        <FormControl id="shortDescription" mb={4}>
                          <FormLabel>Short description</FormLabel>
                          <Input
                            name="shortDescription"
                            type="text"
                            value={form.shortDescription}
                            onChange={handleChange}
                          />
                        </FormControl>
                        <FormControl id="longDescription" mb={4}>
                          <FormLabel>Long description</FormLabel>
                          <Textarea
                            name="longDescription"
                            value={form.longDescription}
                            onChange={handleChange}
                          />
                        </FormControl>
                        <FormControl id="volume" mb={4}>
                          <FormLabel>Volume</FormLabel>
                          <Input
                            name="volume"
                            type="text"
                            value={form.volume}
                            onChange={handleChange}
                          />
                        </FormControl>
                        <FormControl id="ingredients" mb={4}>
                          <FormLabel>
                            Ingredient IDs (comma separated)
                          </FormLabel>
                          <Input
                            name="ingredients"
                            type="text"
                            value={form.ingredients}
                            onChange={handleChange}
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
                    >
                      Add Product
                    </Button>
                  </form>
                </Box>
              </Collapse>
            </Box>
            {/* Add Images to a Product Section */}
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
                      <FormLabel>Product ID</FormLabel>
                      <Input
                        name="imageProductId"
                        type="number"
                        value={imageProductId}
                        onChange={(e) => setImageProductId(e.target.value)}
                      />
                    </FormControl>
                    <FormControl id="smallImage" mb={4} isRequired>
                      <FormLabel>Small image file</FormLabel>
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
                      <FormLabel>Large image file</FormLabel>
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
                    >
                      Upload Images
                    </Button>
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
