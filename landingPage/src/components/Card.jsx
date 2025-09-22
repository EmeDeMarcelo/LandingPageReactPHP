// Card.jsx
import React, { useState } from 'react';
import CardModal from './CardModal';

const Card = ({ title, image, description }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  return (
    <>
      <div
        className="bg-zinc-800 rounded-lg shadow-lg overflow-hidden w-64 mx-2 cursor-pointer transform transition-transform duration-200 hover:scale-100 active:scale-90"
        onClick={handleOpen}
      >
        <img
          src={image}
          alt={title}
          className="w-full h-40 object-cover"
        />
        <div className="p-4">
          <h3 className="text-xl font-semibold mb-2 text-yellow-400">{title}</h3>
          <p className="text-gray-300 text-sm">{description}</p>
        </div>
      </div>

      <CardModal
        isOpen={isOpen}
        onClose={handleClose}
        title={title}
        image={image}
        description={description}
      />
    </>
  );
};

export default Card;
