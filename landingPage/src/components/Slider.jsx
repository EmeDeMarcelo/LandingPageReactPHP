import React from 'react';
import Card from './Card';
import card1 from '../images/cards/card1.jpg';
import card2 from '../images/cards/card2.jpg';
import card3 from '../images/cards/card3.jpg';

const Slider = () => {
  const cards = [
    { title: 'Breack Fast', image: card1, description: 'Desayunos Corporativos' },
    { title: 'Kitchen Lessons', image: card2, description: 'clases de Cocina personalizadas' },
    { title: 'BBQ', image: card3, description: 'Llevamos el Asado a tu casa' },
  ];

  return (
    <div className="flex overflow-x-auto py-4 px-2">
      {cards.map((card, index) => (
        <Card
          key={index}
          title={card.title}
          image={card.image}
          description={card.description}
        />
      ))}
    </div>
  );
};

export default Slider;
