import React, { useEffect, useState } from 'react';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import AddIcon from '@mui/icons-material/Add';
import Container from 'react-bootstrap/Container';

import CartCard from './CartCard';
import Footer from '../footerSection/Footer';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Shipping from '../shipping/Shipping';
import ShippingDetails from '../shipping/ShippingDetails';
import { toast } from 'react-toastify';
import { clearCart } from '../redux/cartSlice';
import { api, useFingerprint } from '../utils/apiConfig';
import Recommended from '../recommended/Recommended';
import Spinners from '../utils/Spinner';
import CartHeader from './CartHeader';
import { CartCardNew, CartItemCardNew } from './CartCarddNew';
import { MapPin } from 'lucide-react';
import ShippingNew from '../shipping/ShippingNew';

function Cart() {
  const { cartItems , cartExtras} = useSelector((state) => state.cart);
  const { shipping } = useSelector((state) => state.shippingAddress);
  const [shipOpen, setShipOpen] = useState(false);


  const cartItemTotal = cartItems?.reduce((total, item) => {
    const productTotal = item.price * item.quantity;

    const extrasTotal =
      item.extras?.reduce((extraSum, extra) => {
        return extraSum + extra.price * extra.quantity;
      }, 0) || 0;

    return total + productTotal + extrasTotal;

  }, 0);







  
  const shippingFee = cartItemTotal > 5000 ? 1200 : 1500;
  const total = shippingFee + cartItemTotal;
  const { userInfo } = useSelector((state) => state.user);
  const businessId = cartItems[0]?.userId;
  const navigate = useNavigate();
  const [order, setOrder] = useState({});
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const product = cartItems[0];
  const fingerprint = useFingerprint();

  const handleOrder = async () => {
    setLoading(true);
    const extras = cartItems
      ?.map((item) => item.extras)
      ?.map((i) => i?.filter((e) => e.quantity > 0));
    try {
      if (userInfo?.user?._id) {
        const { data } = await axios.post(
          `${api}/api/orders/${fingerprint}/${userInfo?.user?._id}/${businessId}`,
          {
            orderedItems: cartItems,
            shippingAddress: shipping,
            total: total,
            subtotal: cartItemTotal,
            shippingFee: shippingFee,
            extras: extras,
          },
        );
        setOrder(data);
        dispatch(clearCart());
        toast.success('order completed successfully');
        setLoading(false);
      } else {
        navigate('/signin');
      }
    } catch (error) {
      if (
        error.response.data.message === 'sorry! you can not buy from yourself'
      ) {
        toast.error(error.response.data.message, {
          autoClose: false,
          theme: 'colored',
          toastId: 'unique-toast-id',
        });
      } else if (error.response.data.message === 'Insufficient funds') {
        toast.error(error.response.data.message, {
          autoClose: false,
          theme: 'colored',
          toastId: 'unique-toast-id',
        });
      } else if (error.response.data.message === 'something went wrong') {
        toast.error(error.response.data.message, {
          autoClose: false,
          theme: 'colored',
          toastId: 'unique-toast-id',
        });
      } else {
        toast.error(error.response.data.message, {
          autoClose: true,
          theme: 'colored',
          toastId: 'unique-toast-id',
        });
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    if (order._id) {
      navigate(`/order/${order?._id}`);
    }
  }, [navigate, order._id]);

  useEffect(() => {
    if (shipOpen === true) {
      window.document.body.style.overflowY = 'hidden';
      window.document.body.style.height = '100vh';
    } else {
      window.document.body.style.overflow = 'scroll';
      window.document.body.style.height = 'scroll';
    }
  }, [shipOpen]);



const totals = cartItems.reduce(
  (acc, item) => acc + (item.price || 0) * (item.quantity || 0),
  0
);

const extraTotals = cartItems.reduce((acc, item) => {
  return (
    acc +
    (item.extras || [])
      .filter(ex => ex.price && ex.quantity)
      .reduce((sum, ex) => sum + ex.price * ex.quantity, 0)
  );
}, 0);



const allTotal = totals + extraTotals + Number(shippingFee || 0);



  

  return (
    <div className="overflow-x-hidden">
      <Row className=" ">
        <Card className="border-0 ">
          <Card.Body>
            {cartItems?.length === 0 ? (
              <div
                className="d-flex justify-content-center align-items-center "
                style={{ height: '200px' }}
              >
                <h3>
                  Cart is empty{' '}
                  <Link to="/search" style={{ fontSize: '16px' }}>
                    Click here to see available kitchens
                  </Link>
                </h3>
              </div>
            ) : (
              <>
                <CartHeader cartItems={cartItems} />

                <Row variant="flush" className="">
                  {cartItems?.length > 0 && (
                    <Col md={12}>
                      {' '}
                      <div className="bg-green-50 border border-green-100 rounded-2xl p-2 flex items-center justify-between  max-w-6xl mx-auto px-0 md:px-4 ">
                        <div className="flex items-center gap-3">
                          <div onClick={()=> navigate(`/kitchen/${cartItems[0]?.userId}`)}   className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm md:text-2xl font-bold hover: cursor-pointer">
                            {cartItems[0]?.kitchenName }
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span className="text-yellow-500">★</span>
                            <span className="fw-bold">{Number(cartItems[0]?.rating) % 1 === 0
                ? `${cartItems[0].rating}.0`
                : cartItems[0].rating}{' '}</span>
                            <span className="text-gray-400">•</span>
                            <span className="font-semibold">TOP 400</span>
                            <span className="text-gray-400">•</span>
                            <span className="font-semibold">{cartItems[0]?.km} km</span>
                          </div>
                        </div>
                      </div>
                      {/* Dropdown Placeholder */}
                      <div className="mt-3 border max-w-6xl mx-auto px-0 md:px-4 rounded-xl p-1 flex items-center justify-between text-gray-600">
                        <span>Items in cart from:</span>
                        <span className="text-xl">⌄</span>
                      </div>
                      {cartItems?.length > 0 && (
                        <div className="my-4 max-w-6xl mx-auto p-0 md:px-4 ">
                          <Row>
                            <Col md={6}>
                              <div>
                                <CartCard cartItemTotal={cartItemTotal} />
                              </div>
                            </Col>
                            <Col md={6}>
                              <div style={{ width: '100%', margin: 'auto' }}>
                                <Card className="bor shadow border-0 ">
                                  <Card.Body className="bg-gray-100 rounded-2xl">
                                    <strong>Order Summary</strong>

                                    <Card>
                                      <Card.Body>
                                        <div className="flex items-center gap-10 ">
                                          <div className="flex items-center gap-1 font-semibold text-gray-800">
                                            <MapPin className="w-4 h-4 text-green-600" />
                                            <span className="fs-bold">
                                              Delivery Address
                                            </span>
                                          </div>
                                          {shipping?.name && (
                                            <span className="fw-bold fs-6 text-green-700 cursor-pointer" onClick={() => setShipOpen(true)}>
                                              Edit
                                            </span>
                                          )}
                                        </div>
                                        {shipping?.name && (
                                          <ShippingDetails
                                            shipping={shipping}
                                          />
                                        )}
                                        <div
                                          className="d-flex align-items-center"
                                          style={{ width: '100%' }}
                                        >
                                          <Button
                                            style={{ width: 'fit-content' }}
                                            variant="light"
                                            className="text-success "
                                            onClick={() => setShipOpen(true)}
                                          >
                                            {!shipping?.name && <AddIcon />}
                                            {!shipping?.name && 'Add Shipping'}
                                          </Button>{' '}
                                        </div>
                                      </Card.Body>
                                    </Card>
                                    <div className="d-flex flex-column gap-3 mt-3">
                                      <div className="flex gap-5 align-items-center">
                                        <span className="border-bottom font-semibold border-grey">
                                          Subtotal:
                                        </span>
                                        <span className="font-bold">
                                          ({cartItems?.length} items){' '}
                                          {`N${(total - shippingFee).toFixed(2)}`}
                                        </span>
                                      </div>
                                      <div className="flex gap-5 align-items-center">
                                        {' '}
                                        <span
                                          style={{ width: 'fit-content' }}
                                          variant="lighter"
                                          className=" font-semibold"
                                        >
                                          Delivery Fee :{' '}
                                        </span>{' '}
                                        <span className="font-bold">
                                          {cartItems?.reduce(
                                            (a, c) => a + c.price * c.quantity,
                                            0,
                                          ) > 5000
                                            ? `N1200.00`
                                            : `N1500.00`}
                                        </span>
                                      </div>
                                      <div className="flex gap-5 align-items-center">
                                        <span
                                          style={{ width: 'fit-content' }}
                                          variant="lighter"
                                          className=" border-bottom border-grey  fw-bold"
                                        >
                                          Total:
                                        </span>{' '} 
                                        <h5 className="text-green-700  fw-bold">{`N${allTotal}`}</h5>
                                      </div>
                                      <div
                                        className="d-grid"
                                        style={{ position: 'relative' }}
                                      >
                                        <Button
                                          style={{ width: '100%' }}
                                          variant="success"
                                          className=" border-bottom border-grey fs-  fw-bold"
                                          onClick={handleOrder}
                                        >
                                          Proceed to Checkout
                                        </Button>{' '}
                                        {loading && (
                                          <div
                                            style={{
                                              position: 'absolute',
                                              top: 2,
                                              left: '45%',
                                            }}
                                          >
                                            {' '}
                                            <Spinners />
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </Card.Body>
                                </Card>
                              </div>
                            </Col>
                          </Row>
                        </div>
                      )}
                    </Col>
                  )}
                </Row>

               
              </>
            )}
          </Card.Body>
        </Card>
      </Row>

      <div className="mb-3">
        <Recommended product={product} />
      </div>
      <Footer />
      {shipOpen && (
        <div className="">
          <ShippingNew shipOpen={shipOpen} setShipOpen={setShipOpen} />
        </div>
      )}
    </div>
  );
}

export default Cart;
