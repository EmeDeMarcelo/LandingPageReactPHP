// CardModal.jsx
import React from 'react';

const CardModal = ({ isOpen, onClose, title, image, description }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 transition-opacity duration-300"
    >
      <div 
        className="bg-zinc-900 text-yellow-400 rounded-lg shadow-lg max-w-md w-full overflow-hidden transform transition-transform duration-300 scale-100"
      >
        <button
          onClick={onClose}
          className="text-gray-300 float-right m-2 text-xl font-bold hover:text-yellow-500"
        >
          &times;
        </button>
        <img src={image} alt={title} className="w-full h-64 object-cover" />
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-2">{title}</h2>
          <p className="text-gray-300">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default CardModal;
