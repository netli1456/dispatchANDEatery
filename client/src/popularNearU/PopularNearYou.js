import { Box, Skeleton } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const kitchens = [
  {
    id: 1,
    businessName: "Amaka's Kitchen",
    category: 'Nigerian • Swallow',
    minOrder: '₦1,500 Min Order',
    rating: 4.8,
    reviews: 124,
    deliveryTime: '20-35 MIN',

    businessImg: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
    tag: 'TOP RATED',
  },
  {
    id: 2,
    businessName: "Tobi's Grill House",
    category: 'Grills • Fast Food',
    minOrder: '₦2,000 Min Order',
    rating: 4.6,
    reviews: 89,
    deliveryTime: '25-40 MIN',
    businessImg: 'https://images.unsplash.com/photo-1550547660-d9450f859349',
  },
  {
    id: 3,
    businessName: 'Mama Efe Meals',
    category: 'Homemade • Nigerian',
    minOrder: '₦1,200 Min Order',
    rating: 4.9,
    reviews: 156,
    deliverydeliveryTime: '15-30 MIN',
    businessImg: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d',
    tag: 'FASTEST',
  },
  {
    id: 4,
    businessName: 'Lagos Bites',
    category: 'Rice • Continental',
    minOrder: '₦1,800 Min Order',
    rating: 4.7,
    reviews: 203,
    deliveryTime: '30-45 MIN',
    businessImg: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
  },
];



export default function PopularNearYou({ carouselData, loading }) {
  const navigate =useNavigate()
  return (
    <section className="px-6 md:px-12 lg:px-20 py-12 bg-white">
      {loading ? (
        <div>
          <Skeleton variant="rectangular" height={200} />
          <Box sx={{ pt: 0.5 }}>
            <Skeleton />
            <Skeleton width="60%" />
          </Box>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto">
          {/* HEADER */}
          <div className="flex items-center justify-between mb-6">
            <h5 className=" md:text-3xl font-bold text-gray-900">
              Popular Near You
            </h5>
            <button className="text-green-600 font-medium hover:underline">
              See All Kitchens →
            </button>
          </div>

          {/* GRID */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {carouselData?.map((item) => (
              <div onClick={()=> navigate(`/kitchen/${item?._id}`)} 
                key={item._id}
                className="bg-white border cursor-pointer border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition"
              >
                {/* IMAGE */}
                <div className="relative">
                  <img
                    src={item.businessImg}
                    alt={item.businessName}
                    className="w-full h-40 object-cover"
                  />

                  {/* deliveryTime BADGE */}
                  <span className="absolute top-3 left-3 bg-yellow-400 text-xs font-semibold px-3 py-1 rounded-full">
                    {item?.deliveryTime}- {parseInt(item.deliveryTime) + 15} MIN
                  </span>
                </div>

                {/* CONTENT */}
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 text-sm">
                      {item?.businessName}
                    </h3>

                    {/* RATING */}
                    <div className="flex items-center text-xs text-gray-600">
                      ⭐ {item?.rating} ({item?.reviews})
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 mt-1">{item.category}</p>

                  <div className="flex items-center justify-between mt-3">
                    <p className="text-sm font-medium text-gray-800">
                      {item.minOrder} Min Order 
                    </p>

                    {/* OPTIONAL TAG */}
                    {item.tag && (
                      <span className="text-[10px] text-capitalize font-semibold bg-green-100 text-green-600 px-2 py-1 rounded-full">
                        {item.tag}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
