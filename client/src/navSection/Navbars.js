import { useState } from 'react';
import {
  MapPin,
  Search,
  ShoppingCart,
  Menu,
  X,
  ChevronDown,
  CircleUser,
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearUserInfo } from '../redux/userSlice';
import { clearShipping } from '../redux/shippingSlice';
import { clearCart } from '../redux/cartSlice';

export default function Navbars() {
  const [open, setOpen] = useState(false);
  const { cartItems } = useSelector((state) => state.cart);
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.user);
  const dispatch = useDispatch();


  const logout = () => {
    dispatch(clearUserInfo());
    dispatch(clearShipping());
    dispatch(clearCart());
    navigate('/signin');

  }
  const location = useLocation();

  return (
    <header className="w-full bg-white">
      <div className="flex gap-3 items-center justify-between px-4 py-3 md:px-8">
        {/* Logo */}
        <Link
          to="/"
          className="flex no-underline items-center gap-2 font-bold text-green-600 text-xl"
        >
          <span className="text-2xl">🍲</span>
          <span>
            <span className="text-2xl md:text-2xl font-bold">A</span>
            <span className="text-black text-3xl font-bold">Wa</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-700">
          <Link
            to="/"
            className={location.pathname === '/' ? "hover:text-green-600 underline text-green-600" : "hover:text-green-600 no-underline text-gray-700"}
          >
            Home
          </Link>
          <Link
            to="/search"
            className={location.pathname === '/search' ? "hover:text-green-600 underline text-green-600" : "hover:text-green-600 no-underline text-gray-700"}
          >
            Browse Kitchens
          </Link>
          <Link
            to={`/profile/${userInfo?.user?._id}`}
            className={location.pathname === `/profile/${userInfo?.user?._id}` ? "hover:text-green-600 underline text-green-600" : "hover:text-green-600 no-underline text-gray-700"}
          >
            Track Order
          </Link>
          <Link
            to="/vendor"
            className={location.pathname === '/vendor' ? "hover:text-green-600 underline text-green-600" : "hover:text-green-600 no-underline text-gray-700"}
          >
            Become a Vendor
          </Link>
          <Link
            to="/help"
            className={location.pathname === '/help' ? "hover:text-green-600 underline text-green-600" : "hover:text-green-600 no-underline text-gray-700"}
          >
            Help
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Location */}
          <div className="hidden md:flex border-grey items-center gap-1 text-sm text-gray-600 border px-2 py-1 rounded-full">
            <MapPin className="text-green-600" size={14} />
            <span>Yaba, Lagos</span>
            <ChevronDown size={14} />
          </div>

          {/* Search */}
          <button className="p-2 rounded-full hover:bg-gray-100">
            <Search size={18} />
          </button>

          {/* Cart */}
          <div
            className="relative cursor-pointer"
            onClick={() => navigate('/cart')}
          >
            <button className="p-2 rounded-full hover:bg-gray-100">
              <ShoppingCart size={18} />
            </button>
            <span className="absolute -top-1 -right-1 bg-green-600 text-white text-[10px] px-1.5 rounded-full">
              {cartItems?.length}
            </span>
          </div>

          {/* Avatar */}
          <div
            onClick={() => setOpen(!open)}
            className="relative w-8 hidden md:flex justify-center align-items-center  h-8 rounded-full bg-gray-300"
          >
            <CircleUser size={28} className="text-green-800 cursor-pointer" />
            {open && (
              <div className="absolute  top-10 right-0 bg-green-600 shadow-md rounded-md p-4 w-40 flex flex-col gap-2">
                {' '}
                <Link to={`/profile/${userInfo?.user?._id}`} className="font-medium text-white hover:text-green-200 cursor-pointer">
                  Profile
                </Link>
                <span className="font-medium text-white hover:text-green-200 cursor-pointer">
                  Track Orders
                </span>
                <span className="font-medium text-white hover:text-green-200 cursor-pointer" onClick={logout}>
                  Log out
                </span>
                
              </div>
            )}
          </div>
          {/* Mobile menu */}
          <button className="md:hidden" onClick={() => setOpen(!open)}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {open && (
        <div className="md:hidden px-4 pb-4 flex flex-col gap-3 text-sm text-gray-700">
          <Link to="">Home</Link>
          <Link onClick={() => navigate('/search')}>Browse Kitchens</Link>
          <Link to="">Track Order</Link>
          <Link to="">Become a Vendor</Link>
          <Link to="">Help</Link>
        </div>
      )}
    </header>
  );
}
