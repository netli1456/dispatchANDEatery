import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function LetsDoItTogether({ setVendorRegistrationOpen }) {
  const { userInfo } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const handleVendorRegistration = () => {
    navigate(`/profile/${userInfo?.user?._id}?openUpload=true`);
  };

  return (
    <section className="w-full mb-12">
      <div className="relative rounde overflow-hidden">
        {/* Background Image */}
        <img
          src="/images/1.jpeg"
          alt="Become a vendor or rider"
          className="w-full h-[700px] md:h-[420px] object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-start md:justify-center px-4 md:px-10 py-6 md:py-10 text-white">
          {/* Heading */}
          <div className="mb-6">
            <h2 className="text-2xl md:text-4xl font-bold bg-white text-green-600 px-6 py-2 rounded-xl shadow">
              Become a Vendor or Rider Today
            </h2>
          </div>

          {/* Grid */}
          <div className="grid md:grid-cols-2 gap-6 w-full max-w-6xl">
            {/* Vendor Section */}
            <div className="bg-white/90 text-gray-800 rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg md:text-xl font-semibold text-green-700 mb-3">
                Register as a Food Vendor
              </h3>
              <p className="text-sm md:text-base leading-relaxed">
                Join a fast-growing food marketplace and take your business online. 
                Reach more customers, increase your sales, and earn bonuses based on performance.
              </p>

              <button
                onClick={handleVendorRegistration}
                className="mt-4 bg-red-500 hover:bg-red-600 text-white font-semibold px-5 py-2 rounded-lg transition"
              >
                Food Vendor Registration
              </button>
            </div>

            {/* Rider Section */}
            <div className="bg-white/90 text-gray-800 rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg md:text-xl font-semibold text-green-700 mb-3">
                Register as a Dispatch Rider
              </h3>
              <p className="text-sm md:text-base leading-relaxed">
                Help deliver meals quickly and reliably. Join our rider network and earn
                bonuses for completing deliveries, including rewards for your first rides.
              </p>

              <button
                onClick={() => setVendorRegistrationOpen(true)}
                className="mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2 rounded-lg transition"
              >
                Dispatch Rider Registration
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
