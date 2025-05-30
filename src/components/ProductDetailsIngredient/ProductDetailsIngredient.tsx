import './ProductDetailsIngredient.scss';

import React, { useState } from 'react';
import { MdOutlineThumbDown, MdOutlineThumbUp } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';

import actions from '../../store/actions';
import { RootState } from '../../store/reducers';

type ProductDetailsIngredientProps = {
  ingredient: {id: string, name:string};
  isLiked?: boolean;
  isDisliked?: boolean;
};

const ProductDetailsIngredient = ({
  ingredient,
  isLiked = false,
  isDisliked = false,
}: ProductDetailsIngredientProps): JSX.Element => {
  const dispatch = useDispatch();
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const {
    isAuthenticated,
  } = useSelector((state: RootState) => state.auth);

  const toggleLike = () => {
    if (isLiked) {
      dispatch(actions.unlikeIngredient(ingredient));
    } else {
      if (isDisliked) {
        dispatch(actions.undislikeIngredient(ingredient));
      }
      dispatch(actions.likeIngredient(ingredient));
    }
  };

  const toggleDislike = () => {
    if (isDisliked) {
      dispatch(actions.undislikeIngredient(ingredient));
    } else {
      if (isLiked) {
        dispatch(actions.unlikeIngredient(ingredient));
      }
      dispatch(actions.dislikeIngredient(ingredient));
    }
  };

  return (
    <div
      // eslint-disable-next-line no-nested-ternary
      className={`product-ingredient-container ${isLiked ? 'liked' : isDisliked ? 'disliked' : ''}`}
      onMouseEnter={() => isAuthenticated && setIsHovered(true)}
      onMouseLeave={() => isAuthenticated && setIsHovered(false)}
    >
      <span>{ingredient.name}</span>
      {isHovered && (
        <div className="icon-container">
          <MdOutlineThumbUp
            onClick={toggleLike}
            className={`icon ${isLiked ? 'liked' : ''}`}
          />
          <MdOutlineThumbDown
            onClick={toggleDislike}
            className={`icon ${isDisliked ? 'disliked' : ''}`}
          />
        </div>
      )}
    </div>
  );
};

export default ProductDetailsIngredient;
