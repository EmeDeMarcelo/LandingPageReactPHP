import React from 'react';

const Card = ({ title, image, description }) => {
  return (
    <div className="bg-zinc-800 rounded-2xl shadow-md overflow-hidden w-64 mx-2 border border-yellow-500/30 hover:border-yellow-500 transition-colors">
      <img
        src={image}
        alt={title}
        className="w-full h-40 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-bold mb-2 text-yellow-400">{title}</h3>
        <p className="text-gray-300 text-sm">{description}</p>
      </div>
    </div>
  );
};

export default Card;
