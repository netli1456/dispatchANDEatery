import { MapPin, Truck } from 'lucide-react';
import React from 'react';

export default function Hero({ open, setOpen }) {
  return (
    <section className="bg-gray-50 py-10 px-4 md:px-8 lg:px-12">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-center">
        {/* LEFT CONTENT */}
        <div>
          <p className="text-green-700 h-100 flex gap-2 align-items-center font-semibold text-sm mb-1">
            <Truck
              size={40}
              className="text-green-700 p-1 border-4 border-green-700 rounded-full "
            />
            <span> LOCAL FOOD. FAST DELIVERY.</span>
          </p>

          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-1">
            Order Food From <br />
            <span className="text-green-700 text-2xl">
              Local Kitchens You Love
            </span>
          </h1>

          <p className="text-sm text-gray-600 mb-4">
            Discover tasty meals from trusted local kitchens. Fresh. Fast.
            Reliable.
          </p>

          {/* SEARCH BAR */}
          <div  onClick={() => setOpen(true)}  className="flex items-center bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200 max-w-md">
            <MapPin className="text-green-600 mx-2" size={18} />

            <input
              type="text"
              placeholder="Enter your delivery address..."
              className="flex-1 px-0  md:px-2 py-1 md:py-3 outline-none text-gray-700"
            />
            <button className="bg-green-700 hover:bg-green-800 text-white px-2 md:px-5  py-2 font-medium">
              Find Food
            </button>
          </div>

          {/* STATS */}
          <div className="flex items-center gap-8 mt-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span className="text-yellow-600 text-2xl">⚡</span>
              <span className="grid">
                <strong>30–45 Min</strong>
                <span>Fast Delivery</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-yellow-500 text-2xl">⭐</span>
              <span className="grid">
                <strong>5000+</strong>
                <span>Happy Customers</span>
              </span>
            </div>
          </div>
        </div>

        <div className="relative h-56 w-full rounded-xl overflow-hidden shadow-lg">
          <img
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836"
            alt="Food"
            className="w-full h-full object-cover"
          />

          {/* LEFT fade only */}
          <div className="absolute inset-0 bg-gradient-to-r from-gray-50/40 via-transparent to-transparent"></div>
        </div>
      </div>
    </section>
  );
}
