import './Card.scss'; // Import CSS file for styling

import React from 'react';

interface Card {
  children: React.ReactNode; // Content of the card
}

const CustomCard: React.FC<Card> = ({ children }) => (
  <div className="card">{children}</div>
);

export default CustomCard;
