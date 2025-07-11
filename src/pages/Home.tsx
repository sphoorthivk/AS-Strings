import React from 'react';
import Hero from '../components/home/Hero';
import FeaturedProducts from '../components/home/FeaturedProducts';
import CategorySection from '../components/home/CategorySection';

const Home: React.FC = () => {
  return (
    <div>
      <Hero />
      <FeaturedProducts />
      <CategorySection />
    </div>
  );
};

export default Home;