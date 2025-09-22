import React from 'react';
import banner1 from '../images/banners/banner1.jpg';

const Banner = () => {
  return (
    <section className="w-full h-64 overflow-hidden">
      <img
        src={banner1}
        alt="Banner principal"
        className="w-full h-full object-cover"
      />
    </section>
  );
};

export default Banner;
