import React from "react";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
export default function Footers() {
  return (
    <footer className="bg-green-900 text-green-100 px-6 md:px-12 lg:px-20 pt-12 pb-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-10">
        
        {/* LOGO + DESCRIPTION */}
        <div>
          <h2 className="text-xl font-bold text-white mb-3">
            🍲 NaijaEateries
          </h2>
          <p className="text-sm text-green-200 mb-2">
            Connecting you with the best local kitchens.
            Fresh food. Fast delivery.
          </p>

          {/* SOCIAL ICONS */}
          <div className="flex gap-4">
            <FaFacebook className="text-blue-600 text-2xl bg-white rounded-full cursor-pointer h-10 w-10" />
            <FaInstagram className=" text-pink-500 cursor-pointer text-2xl bg-white rounded-full h-10 w-10" />
            <FaTwitter className=" cursor-pointer text-2xl bg-white rounded-full text-black hover:text-white h-10 w-10" />
          </div>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h3 className="text-white font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-white cursor-pointer">Browse Kitchens</li>
            <li className="hover:text-white cursor-pointer">Track Order</li>
            <li className="hover:text-white cursor-pointer">Become a Vendor</li>
            <li className="hover:text-white cursor-pointer">Help & Support</li>
          </ul>
        </div>

        {/* FOR VENDORS */}
        <div>
          <h3 className="text-white font-semibold mb-4">For Vendors</h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-white cursor-pointer">Vendor Dashboard</li>
            <li className="hover:text-white cursor-pointer">Add Your Kitchen</li>
            <li className="hover:text-white cursor-pointer">Vendor Guide</li>
            <li className="hover:text-white cursor-pointer">Contact Us</li>
          </ul>
        </div>

        {/* SUPPORT */}
        <div>
          <h3 className="text-white font-semibold mb-4">Support</h3>
          <ul className="space-y-3 text-sm">
            <li>📞 +234 901 0000008</li>
            <li>📧 support@naijaeateries.com</li>
            <li>🕒 Mon - Sun: 8:00 AM - 8:00 PM</li>
          </ul>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="border-t border-green-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-green-300">
        <p>© 2024 NaijaEateries. All rights reserved.</p>

        <div className="flex gap-6 mt-3 md:mt-0">
          <span className="hover:text-white cursor-pointer">
            Privacy Policy
          </span>
          <span className="hover:text-white cursor-pointer">
            Terms of Service
          </span>
        </div>
      </div>
    </footer>
  );
}