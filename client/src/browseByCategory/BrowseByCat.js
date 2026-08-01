import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';


  const categories = [
  {
    name: 'Swallows & Fufu',
    image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=300&q=80',
  },
  {
    name: 'Jollof & Rice Specials',
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=300&q=80',
  },
  {
    name: 'Grills & BBQ',
    image: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=300&q=80',
  },
  {
    name: 'Local Soups',
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=300&q=80',
  },
  {
    name: 'Street Food',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=300&q=80',
  },
  {
    name: 'Small Chops',
    image: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=300&q=80',
  },
  {
    name: 'Drinks & Beverages',
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=300&q=80',
  },
  {
    name: 'Breakfast & Brunch',
    image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=300&q=80',
  },
  {
    name: 'Pastries & Desserts',
    image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=300&q=80',
  },
  {
    name: 'Pepper Soup Specials',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=300&q=80',
  },
  {
    name: 'Seafood Delights',
    image: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=300&q=80',
  },
  {
    name: 'Healthy Options',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80',
  },

  // New ones added
  {
    name: 'Noodles & Stir Fry',
    image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=300&q=80',
  },
  {
    name: 'Burger & Sandwiches',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=300&q=80',
  },
  {
    name: 'Family Platters',
    image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=300&q=80',
  },
];
export default function BrowseByCat(props) {

    const { searchedLocation } = useSelector((state) => state.searching);
   const navigate = useNavigate();
const { setOpen } = props

    const handleFilter = (filterData) => {
    if (filterData !== 'Near me') {
      navigate(`/search?&popularFilter=${filterData}`);
    } else {
      if (searchedLocation) {
        navigate(`/search?&searchedLocation=${searchedLocation}`);
      } else {
        setOpen(true);
      }
    }
  };

  return (
    <section className="px-6 md:px-12 lg:px-20 py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
          Browse By Category
        </h2>

        {/* CATEGORY LIST */}
        <div className="flex flex-wrap  gap-6 justify-between">
          {categories.map((cat, index) => (
            <div
            onClick={() => handleFilter(cat.name)}
              key={index}
              className="min-w-[120px] pointer-cursor flex-shrink-0 text-center cursor-pointer group"
            >
              {/* IMAGE */}
              <div className="w-24 h-24 mx-auto rounded-full overflow-hidden shadow-sm group-hover:shadow-md transition">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition"
                />
              </div>

              {/* LABEL */}
              <p className="mt-3 text-sm font-medium text-gray-700 group-hover:text-green-600 transition">
                {cat.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
