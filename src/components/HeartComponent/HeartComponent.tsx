import './HeartComponent.scss';

import React from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

type HeartProps = {
  isLiked: boolean;
  onLike: () => void;
  onUnlike: () => void;
  className?: string;
};

const HeartComponent = ({
  isLiked,
  onLike,
  onUnlike,
  className,
}: HeartProps): JSX.Element => (
  <button
    className={`heart ${className}`}
    onClick={isLiked ? onUnlike : onLike}
    aria-label={isLiked ? 'Unlike' : 'Like'}
    type="button"
  >
    {isLiked ? (
      <FaHeart className="heart-icon" />
    ) : (
      <FaRegHeart className="heart-icon" />
    )}
  </button>
);

export default HeartComponent;
