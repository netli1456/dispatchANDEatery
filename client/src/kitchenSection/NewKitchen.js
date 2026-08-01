import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { addCart } from '../redux/cartSlice';
import { api } from '../utils/apiConfig';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import LoadingBox from '../LoadingBox';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';

const popularItems = [
  {
    name: 'Jollof Rice & Chicken',
    price: 2500,
    desc: 'Party jollof rice served with well-seasoned chicken.',
    img: 'https://images.unsplash.com/photo-1604908811908-7c5cdb7f5c16',
  },
  {
    name: 'Egusi Soup & Pounded Yam',
    price: 2000,
    desc: 'Rich egusi soup with assorted meat and pounded yam.',
    img: 'https://images.unsplash.com/photo-1625944525903-c6b6a3c8a7e2',
  },
  {
    name: 'Fried Rice & Plantain',
    price: 1800,
    desc: 'Fried rice with mixed veggies, served with fried plantain.',
    img: 'https://images.unsplash.com/photo-1605478038742-5c6c7d0b3c5a',
  },
];

const mainDishes = [
  {
    name: 'Ogbono Soup & Swallow',
    price: 2200,
    desc: 'Draw soup with assorted meat and swallow.',
    img: 'https://images.unsplash.com/photo-1617196038435-1e3f6a8d6c55',
  },
  {
    name: 'Peppersoup (Goat Meat)',
    price: 2300,
    desc: 'Spicy goat meat peppersoup with local spices.',
    img: 'https://images.unsplash.com/photo-1604908176997-125f25cc6a75',
  },
  {
    name: 'Ofada Rice & Ayamase',
    price: 2000,
    desc: 'Ofada rice with designer stew.',
    img: 'https://images.unsplash.com/photo-1625944525903-c6b6a3c8a7e2',
  },
  {
    name: 'White Rice & Stew',
    price: 1700,
    desc: 'White rice with fresh tomato stew.',
    img: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092',
  },
];



export default function KitchenPage() {
  const [cart, setCart] = useState(popularItems.slice(0, 2));

  const addToCart = (item) => setCart((prev) => [...prev, item]);

  const subtotal = cart.reduce((acc, i) => acc + i.price, 0);
  const deliveryFee = 400;
  const total = subtotal + deliveryFee;

  const params = useParams();
  const { id } = params;
  const [openSort, setOpenSort] = useState(false);
  const [kitchenData, setKitchenData] = useState([]);
  const [maxPrice, setMaxPrice] = useState(500);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const query = sp.get('query') || 'all';
  const price = sp.get('price') || 'all';
  const category = sp.get('category') || 'all';
  const page = sp.get('page') || 1;
  const [popular, setPopular] = useState([]);

  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);

  const [cat, setCat] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const searchedCategory = async () => {
      try {
        const { data } = await axios.get(
          `${api}/api/products/kitchen/cat/${id}?category=${category}`,
        );

        setCat(data);
      } catch (error) {
        console.log(error);
      }
    };
    searchedCategory();
  }, [id, category]);

  useEffect(() => {
    const handleSearch = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          `${api}/api/products/kitchen/${id}?query=${query}&page=${page}&price=${price}&category=${category}`,
        );
        setKitchenData(data);
        setLoading(false);
      } catch (error) {
        toast.error(
          'error fetching data',
          { toastId: 'unique-toast-id' },
          error,
        );
        setLoading(false);
      }
    };
    handleSearch();
  }, [query, category, price, page, id]);



  const handlequantity = (item, id) => {
    if (cartItems?.length === 0 || cartItems[0]?.userId === item?.userId) {
      if (id) {
        const existItem = cartItems.find((items) => items._id === item._id);
        const quant = existItem ? existItem.quantity - 1 : 0;
                

        if (quant < 1) {
          return;
        }
        dispatch(addCart({ ...item, quantity: quant }));
      } else {
        const existItem = cartItems.find((items) => items._id === item._id);
        const quantity = existItem ? existItem.quantity + 1 : 1;
        const kitchenName = kitchenData?.businessName || 'Unknown Kitchen';
                const rating = kitchenData?.rating || 'N/A';
                const km = kitchenData?.km || 'N/A';
                
        dispatch(addCart({ ...item, quantity ,  kitchenName, rating,  km}));
      }
    } else {
      toast.warning(
        'You can only add items from one store. you already have an item from another store in your cart. ',
        {
          autoClose: false,
          theme: 'dark',
          toastId: 'unique-toast-id',
        },
      );
    }
  };

  const quantity = (item) => {
    return cartItems?.map((items) =>
      items._id === item._id ? (
        <span className="text-outline fw-bold"> {items.quantity} </span>
      ) : (
        ''
      ),
    );
  };



 useEffect(() => {
  const fetchPopularItems = async ()=>{
    try {
      const {data} = await axios.get(`${api}/api/orders/popular/${id}`)
       setPopular(data)
    } catch (error) {
      console.log(error)
    }
  }
  fetchPopularItems()
 },[id])







  

  return (
    <div className={loading ? "bg-gray-50 max-h-48 overflow-x-hidden": "bg-gray-50 min-h-screen overflow-x-hidden"}>
      {/* HERO */}
      {loading ? (
       <div className='max-h-32'> <LoadingBox /></div>
      ) : (
        <div className="relative h-64 text-white flex items-end p-6">
          <img
            src={kitchenData?.businessImg}
            className="absolute inset-0 w-full h-full object-cover"
            alt=""
          />
          <div className="absolute inset-0 bg-black/60" />

          <div className="relative z-10">
            <h2 className="text-3xl font-bold">{kitchenData?.businessName}</h2>

            <p className="text-sm">
              ⭐{' '}
              {Number(kitchenData?.rating) % 1 === 0
                ? `${kitchenData.rating}.0`
                : kitchenData.rating}{' '}
              ({kitchenData?.reviews}) • 30–40 Min • {kitchenData?.category}
            </p>

            <p className="text-xs mt-1">
              ₦{kitchenData?.minOrder?.toFixed(2)} Min Order • ₦400 Delivery Fee
            </p>

            <p className="text-xs">📍 {kitchenData?.physicalAddress}</p>
          </div>
        </div>
      )}

      {kitchenData?.products?.length > 0 ? (
        <Row className="gri grid-co gap- p-6">
          {/* LEFT */}
          <Col
            md={2}
            className=" hidden md:block bg-white p-4 rounded-2xl shadow-sm space-y-2"
          >
            <h6 className="text-gray-500 text-decoration-underline">
              Categories
            </h6>
            {cat?.map((c, i) => (
              <div key={i} className="p-2 rounded-lg text-sm">
                {c}
              </div>
            ))}
          </Col>

          {/* CENTER */}
          <Col md={7} className="col-span-7 space-y-10">
            {/* POPULAR */}
           <div>
  <div className="flex justify-between mb-3">
    <h3 className="font-semibold">Popular Items</h3>
  </div>

  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
    {popular?.products?.map((item) => (
      <div
        key={item._id}
        className="bg-white rounded-xl shadow-sm overflow-hidden relative"
      >
        {/* 🟢 NEW BADGE */}
        {popular?.type === "newest" && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] px-2 py-1 rounded-full z-10">
            NEW
          </div>
        )}

        <img
          src={item?.imgs?.[0]?.url}
          className="h-32 w-full object-cover"
          alt=""
        />

        <div className="px-3 py-2 flex flex-col">
          <span className="text-sm font-medium">{item?.name}</span>

          <span className="text-xs text-gray-500">
            {item?.desc?.length > 35
              ? item.desc.substring(0, 35) + "..."
              : item.desc}
          </span>

          <span className="text-green-600 font-semibold text-sm">
            ₦{item.price}
          </span>

          <button
            onClick={() => handlequantity(item)}
            className="mt-2 w-full bg-green-600 text-white py-1 rounded-lg text-sm"
          >
            Add {quantity(item)}
          </button>
        </div>
      </div>
    ))}
  </div>
</div>

            {/* MAIN DISHES */}
            <div>
              <div className="flex justify-between mb-3">
                <h3 className="font-semibold">Main Dishes</h3>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {kitchenData?.products?.map((item) => (
                  <div
                    key={item.name}
                    className="bg-white rounded-xl shadow-sm overflow-hidden"
                  >
                    <img
                      src={item.imgs?.[0]?.url}
                      className="h-32 w-full object-cover"
                      alt=""
                    />

                    <div className="p-3 flex flex-col">
                      <span className="text-sm font-medium">{item.name}</span>
                      <span className="text-xs text-gray-500">{item.desc.length > 20 ? `${item.desc.substring(0, 20)}...` : item.desc}</span>
                      <span className="text-green-600 font-semibold text-sm">
                        ₦{item.price}
                      </span>

                      <button
                        onClick={() => addToCart(item)}
                        className="mt-2 w-full bg-green-600 text-white py-1 rounded-lg text-sm"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SOUPS */}
            {kitchenData?.soups?.length > 0 && (
              <div>
                <div className="flex justify-between mb-3">
                  <h3 className="font-semibold">Soups</h3>
                </div>

                <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                  {kitchenData?.soups?.map((item, i) => (
                    <div
                      key={item.i}
                      className="bg-white rounded-xl shadow-sm overflow-hidden"
                    >
                      <img
                        src={item.img}
                        className="h-28 w-full object-cover"
                        alt=""
                      />

                      <div className="p-3 flex justify-between">
                        <div>
                          <p className="text-sm">{item.name}</p>
                          <p className="text-xs">₦{item.price}</p>
                        </div>

                        <button onClick={() => addToCart(item)}>Add +</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* RATING SECTION (FULL RESTORE) */}
            <div className="bg-white rounded-2xl p-6 shadow-sm grid grid-cols-3 gap-6 items-center">
              {/* LEFT: SCORE */}
              <div>
                <p className="text-4xl font-bold">
                  {Number(kitchenData?.rating) % 1 === 0
                    ? `${kitchenData.rating}.0`
                    : kitchenData.rating}{' '}
                  ⭐
                </p>

                <p className="text-sm text-gray-500">
                  Based on {kitchenData?.reviews} reviews
                </p>
              </div>

              {/* MIDDLE: BARS */}
              <div className="space-y-1 text-sm">
                {[5, 4, 3, 2, 1].map((star, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span>{star}</span>

                    <div className="flex-1 h-2 bg-gray-200 rounded">
                      <div
                        className="h-2 bg-green-500 rounded"
                        style={{ width: `${[88, 8, 3, 1, 0][i]}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* RIGHT: REVIEW */}
              <div className="text-sm">
                <p className="font-semibold">Chioma N.</p>
                <p className="text-yellow-500">★★★★★</p>
                <p className="text-gray-500">
                  The food was amazing! Will definitely order again.
                </p>
              </div>
            </div>

            {/* DELIVERY STRIP */}
            <div className="bg-white p-2 md:p-6 rounded-2xl grid-cols-3 grid  text-center">
              <div>
                <p className="font-semibold">Fresh Ingredients</p>
                <p className="text-gray-400">Locally sourced daily</p>
              </div>
              <div>
                <p className="font-semibold">Fast Delivery</p>
                <p className="text-gray-400">Right to your door</p>
              </div>
              <div>
                <p className="font-semibold">Top Rated</p>
                <p className="text-gray-400">Loved by customers</p>
              </div>
            </div>
          </Col>

          {/* RIGHT SIDEBAR */}
          <Col md={3} className="">
            {/* CART */}
            <div className="bg-white my-3 p-4 rounded-2xl shadow-sm">
              <h3 className="mb-3 font-semibold">Your Order</h3>

              {cart.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span>{item.name}</span>
                  <span>₦{item.price}</span>
                </div>
              ))}

              <div className="border-t pt-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₦{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span>₦{deliveryFee}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>₦{total}</span>
                </div>
              </div>
            </div>

            {/* DELIVERY DETAILS */}
            <div className="bg-white p-4 rounded-2xl shadow-sm text-sm">
              <p className="font-semibold">Yaba, Lagos</p>
              <p>30–40 Min</p>
              <p>₦1,500 Min Order</p>
              <p>₦400 Delivery Fee</p>
            </div>
          </Col>
        </Row>
      ) : (
        <div className="py-20 text-center text-gray-500">
          <p className="text-2xl">No items available.</p>
        </div>
      )}
    </div>
  );
}
