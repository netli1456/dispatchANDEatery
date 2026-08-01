import { MapPin } from "lucide-react";
import { Col, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

export default function CartHeader({cartItems}) {
  const navigate = useNavigate();
  return (
    <div className="max-w-6xl mx-auto px-1 md:px-4 ">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
        <Link to="/" className="text-gray-500 hover:underline hover:text-gray-700 cursor-pointer no-underline">Home</Link>
        <span>{">"}</span>
        <span className="text-gray-700 font-medium">Cart</span>
      </div>

      {/* Title Section */}
      <div className="flex items-start gap-2 md:gap-4 ">
        <div className="text-3xl text-green-400">🛒</div>
        <div>
          <h5 className="text-1xl md:text-3xl font-bold text-gray-900">Your Food Cart</h5>
          <p className="text-gray-500 font-semibold mt-1">
            Here are the items you have added to your cart.
          </p>
        </div>
      </div>

      {/* Kitchen Info */}
      <div className="flex align-items-center items-center gap-2 text-gray-600 text-sm mb-3">
        <span className=" text-sm md:text-2xl">Items in cart from:</span>
        <div className="flex items-center gap-1 font-semibold text-gray-800">
          <MapPin className="w-4 h-4 text-green-600" />
          <span  className="text-sm md:text-2xl ">
            {cartItems[0]?.kitchenName}
          </span>
        </div>
      </div>

      {/* Kitchen Card */}
      
    </div>
  );
}
