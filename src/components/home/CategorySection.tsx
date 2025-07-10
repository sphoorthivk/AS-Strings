import React from 'react';
import { Link } from 'react-router-dom';

const CategorySection: React.FC = () => {
  const categories = [
    {
      id: 'women-dresses',
      name: 'Women\'s Dresses',
      image: 'https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg?auto=compress&cs=tinysrgb&w=600',
      link: '/women/dresses',
    },
    {
      id: 'men-shirts',
      name: 'Men\'s Shirts',
      image: 'https://images.pexels.com/photos/1192609/pexels-photo-1192609.jpeg?auto=compress&cs=tinysrgb&w=600',
      link: '/men/shirts',
    },
    {
      id: 'women-accessories',
      name: 'Accessories',
      image: 'https://images.pexels.com/photos/1667088/pexels-photo-1667088.jpeg?auto=compress&cs=tinysrgb&w=600',
      link: '/accessories',
    },
    {
      id: 'shoes',
      name: 'Shoes',
      image: 'https://images.pexels.com/photos/1032110/pexels-photo-1032110.jpeg?auto=compress&cs=tinysrgb&w=600',
      link: '/shoes',
    },
    {
      id: 'jackets',
      name: 'Jackets & Coats',
      image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=600',
      link: '/jackets',
    },
    {
      id: 'activewear',
      name: 'Activewear',
      image: 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=600',
      link: '/activewear',
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Shop by Category
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Browse our extensive collection across different categories
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={category.link}
              className="group relative overflow-hidden rounded-2xl bg-gray-100 aspect-square hover:shadow-2xl transition-all duration-300"
            >
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition-all duration-300">
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="text-white text-xl font-bold mb-2">{category.name}</h3>
                  <div className="inline-flex items-center text-white text-sm group-hover:text-purple-300 transition-colors">
                    <span>Shop Now</span>
                    <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;