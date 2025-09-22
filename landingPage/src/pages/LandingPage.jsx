import React from 'react';
import Header from '../components/Header';
import Banner from '../components/Banner';
import Slider from '../components/Slider';
import Form from '../components/Form';
import Footer from '../components/Footer';

const LandingPage = () => {
  return (
    <div className="bg-zinc-900 text-gray-200 min-h-screen">
      <Header />
      <Banner />

      <main className="p-10">
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4 text-center text-yellow-500">
            Nuestros Servicios
          </h2>
          <Slider />
        </section>

        <section>
          <Form />
        </section>
        <Footer />
      </main>
    </div>
  );
};

export default LandingPage;
