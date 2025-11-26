import React from 'react';
import { useNavigate } from 'react-router-dom';

const CategoriesGrid = () => {
  const navigate = useNavigate();
  
  const categories = [
    { 
      id: 'hoodie', 
      label: 'Hoodies', 
      image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=800',
      count: '12 Products'
    },
    { 
      id: 'tshirt', 
      label: 'T-Shirts', 
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800',
      count: '24 Products'
    },
    { 
      id: 'polo', 
      label: 'Polo Shirts', 
      image: 'https://images.unsplash.com/photo-1625910515337-17d9a227405f?auto=format&fit=crop&q=80&w=800',
      count: '8 Products'
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Shop by Category</h2>
          <p className="text-gray-600">Find your perfect style from our collections</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((cat) => (
            <div 
              key={cat.id}
              onClick={() => navigate(`/shop?type=${encodeURIComponent(cat.label)}`)}
              className="group relative h-96 rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-300"
            >
              <img 
                src={cat.image} 
                alt={cat.label}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              
              <div className="absolute bottom-0 left-0 p-8 w-full">
                <h3 className="text-2xl font-bold text-white mb-2">{cat.label}</h3>
                <p className="text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                  Explore Collection →
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesGrid;
