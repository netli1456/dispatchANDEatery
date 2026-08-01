import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { api } from '../utils/apiConfig';
import LoadingBox from '../LoadingBox';
import {
  pageSuccess,
  resetProducts,
  searchSuccess,
} from '../redux/searchSlice';

export default function StoresPage(props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { search } = useLocation();
  const sp = new URLSearchParams(search);

  const query = sp.get('query') || '';
  const initialPage = parseInt(sp.get('page')) || 1;
  const popularFilter = sp.get('popularFilter') || '';
  const rating = sp.get('rating') || '';

  const { searchedLocation, searchproducts, pagecounts } = useSelector(
    (state) => state.searching,
  );

  const locationQuery = searchedLocation || '';

  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);

  // ✅ FETCH STORES (YOUR ENDPOINT)
  useEffect(() => {
    const fetchStores = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          `${api}/api/users/stores?searchedLocation=${locationQuery}&query=${query}&page=${page}&popularFilter=${popularFilter}&rating=${rating}`,
        );

        const { stores, totalPages } = data;

        if (page === 1) {
          dispatch(resetProducts(stores));
        } else {
          dispatch(searchSuccess(stores));
        }

        dispatch(pageSuccess(totalPages));
      } catch (error) {
        toast.error('Something went wrong', {
          autoClose: 3000,
        });
      }
      setLoading(false);
    };

    fetchStores();
  }, [query, page, popularFilter, rating, locationQuery, dispatch]);

  // ✅ SEARCH INPUT
  const handleSearch = (value) => {
    navigate(`/search?searchedLocation=${locationQuery}&query=${value}&page=1`);
  };

  // ✅ FILTER BUTTONS
  const handleFilter = (filter) => {
    setPage(1);

    if (filter === 'Rating') {
      navigate(
        `/search?searchedLocation=${locationQuery}&query=${query}&rating=4`,
      );
    } else if (filter === 'Near') {
      navigate(`/search?searchedLocation=${locationQuery}`);
    } else {
      navigate(
        `/search?searchedLocation=${locationQuery}&popularFilter=${filter}`,
      );
    }
  };

  // ✅ PAGINATION
  const handleNextPage = () => {
    const next = page + 1;
    setPage(next);

    navigate(
      `/search?searchedLocation=${locationQuery}&query=${query}&page=${next}&popularFilter=${popularFilter}&rating=${rating}`,
    );
  };

  const handlePrevPage = () => {
    if (page <= 1) return;

    const prev = page - 1;
    setPage(prev);

    navigate(
      `/search?searchedLocation=${locationQuery}&query=${query}&page=${prev}&popularFilter=${popularFilter}&rating=${rating}`,
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      
      <aside className="w-72 bg-white border-r p-5 hidden lg:block sticky top-0 h-screen">
        <h2 className="text-lg font-semibold mb-4">Explore Kitchens</h2>

        {/* QUICK FILTERS */}
        <div className="space-y-2 text-sm mb-6">
          <button
            onClick={() => handleFilter('Rating')}
            className="block hover:text-green-600"
          >
            ⭐ Top Rated
          </button>

          <button
            onClick={() => handleFilter('Fastest')}
            className="block hover:text-green-600"
          >
            ⚡ Fast Delivery
          </button>

          <button
            onClick={() => handleFilter('Near')}
            className="block hover:text-green-600"
          >
            📍 Near Me
          </button>
        </div>

        {/* CATEGORY SECTION (IMPROVED FROM OLD SCREEN) */}
        <div>
          <h3 className="font-medium mb-3">Food Types</h3>

          <div className="grid grid-cols-2 gap-2 text-sm">
            <button
              onClick={() => handleFilter('swallow')}
              className="px-2 py-1 border rounded hover:bg-gray-100"
            >
              🍲 Swallow
            </button>

            <button
              onClick={() => handleFilter('rice')}
              className="px-2 py-1 border rounded hover:bg-gray-100"
            >
              🍚 Rice
            </button>

            <button
              onClick={() => handleFilter('fast food')}
              className="px-2 py-1 border rounded hover:bg-gray-100"
            >
              🍔 Fast Food
            </button>

            <button
              onClick={() => handleFilter('sea food')}
              className="px-2 py-1 border rounded hover:bg-gray-100"
            >
              🐟 Sea Food
            </button>

            <button
              onClick={() => handleFilter('dessert')}
              className="px-2 py-1 border rounded hover:bg-gray-100"
            >
              🍰 Dessert
            </button>

            <button
              onClick={() => handleFilter('ice cream')}
              className="px-2 py-1 border rounded hover:bg-gray-100"
            >
              🍦 Ice Cream
            </button>
          </div>
        </div>
      </aside>
      {/* MAIN */}
      <main className="flex-1 p-6">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
          <h1 className="text-2xl font-bold">Search Kitchens</h1>

          <input
            defaultValue={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search kitchens..."
            className="border rounded-lg px-4 py-2 w-full md:w-80"
          />
        </div>

        {/* CONTENT */}
        {loading ? (
          <LoadingBox />
        ) : searchproducts.length === 0 ? (
          <p>No kitchens found</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {searchproducts.map((store, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition"
              >
                {/* IMAGE */}
                <div className="h-40 bg-gray-200 relative">
                  {store.businessImg && (
                    <img
                      src={store.businessImg}
                      alt={store.businessName}
                      className="w-full h-full object-cover"
                    />
                  )}

                  {/* TAG */}
                  {store.tag && (
                    <span className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
                      {store.tag}
                    </span>
                  )}

                  {/* VERIFIED */}
                  {store.verified && (
                    <span className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                      Verified
                    </span>
                  )}
                </div>

                {/* DETAILS */}
                <div className="px-4 flex flex-col">
                  {/* NAME */}
                  <span className="font-semibold text-capitalize mt-2 text-lg">
                    {store.businessName}
                  </span>

                  {/* CATEGORY + LOCATION */}
                  <span className="text-sm mb-2 text-gray-500">
                    {store.category}
                  </span>

                  {/* METRICS ROW */}
                  <div className="flex justify-between mt- text-sm text-gray-600">
                    <span>⭐ {store.rating}</span>

                    <span>{store.reviews} reviews</span>
                  </div>

                  {/* EXTRA INFO */}
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>🚚 {store.deliveryTime} min</span>

                    <span>📍 {store.km} km</span>
                  </div>

                  <div className="text-sm mt-2 text-gray-700">
                    Min Order: ₦{store.minOrder}
                  </div>

                  {/* BUTTON */}
                  <button
                    onClick={() => navigate(`/kitchen/${store?._id}`)}
                    className="my-2 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                  >
                    View Menu
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-center mt-10 gap-2">
          <button
            onClick={handlePrevPage}
            disabled={page <= 1}
            className="px-3 py-1 border rounded"
          >
            Prev
          </button>

          <span className="px-3 py-1 border rounded bg-green-600 text-white">
            {page}
          </span>

          <button onClick={handleNextPage} className="px-3 py-1 border rounded">
            Next
          </button>
        </div>
      </main>
    </div>
  );
}
