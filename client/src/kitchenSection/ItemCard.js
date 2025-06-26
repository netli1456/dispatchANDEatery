import { useEffect, useState } from 'react';
import { Card, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { addExtras, removeExtras } from '../redux/cartSlice';

const ItemCard = ({ item, handlequantity, quantity, kitchenData }) => {
  const [selectedExtras, setSelectedExtras] = useState({});

  const location = useLocation();

  const { cartItems } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const extraQuantity = ({ newExtraItem, extraId }) => {
    if (cartItems?.length > 0) {
      const existItem = cartItems?.find((i) => i._id === newExtraItem._id);
      if (existItem) {
        dispatch(addExtras({ newExtraItem: existItem, extraId: extraId }));
      }
    }
  };

  const getCartQuantity = ({ productId, extraId }) => {
    const product = cartItems.find((item) => item._id === productId);
    const extra = product?.extras?.find((e) => e._id === extraId);
    return extra?.quantity || 0;
  };

  const removeExtraQuantity = ({ newExtraItem, extraId }) => {
    if (cartItems?.length > 0) {
      const existItem = cartItems.find((i) => i._id === newExtraItem._id);
      if (existItem) {
        dispatch(removeExtras({ newExtraItem: existItem, extraId }));
      }
    }
  };

  const productList = kitchenData?.products || cartItems || [];

  useEffect(() => {
    if (Object.keys(selectedExtras).length > 0) return; // Do nothing if already set

    const initialSelections = {};
    productList?.forEach((product) => {
      const cartItem = cartItems.find((item) => item._id === product._id);

      if (cartItem?.extras?.length > 0) {
        const selected = cartItem.extras.find((ex) => ex.quantity > 0);
        if (selected) {
          initialSelections[product._id] = selected._id;
        }
      } else if (product?.extras?.length > 0) {
        initialSelections[product._id] = product.extras[0]._id;
      }
    });

    setSelectedExtras(initialSelections);
  }, [productList, cartItems]);

  return (
    <Card
      style={{ borderRadius: '15px' }}
      className={location.pathname === '/cart' ? 'p-3  border-0' : 'p-3 shadow'}
    >
      <Row>
        <Col xs={4}>
          <Link to={`/product/${item._id}`} className=" ">
            <img style={{ width: '100%' }} src={item?.imgs[0]?.url} alt={''} />
          </Link>
          <h6 className="my-2 text-success">N{item?.price?.toFixed(2)}</h6>
          {cartItems?.find((i) => i._id === item?._id) ? (
            <div className="d-flex align-items-center gap-1">
              {' '}
              <Button
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                }}
                variant="success"
                className=" bg-success d-flex justify-content-center align-items-center fs-3 text-white"
                disabled={item?.quantity === 1}
                onClick={() =>
                  location.pathname !== '/cart' &&
                  location.pathname !== `/product/${item?._id}`
                    ? handlequantity(item, item?._id)
                    : handlequantity(item, item?.quantity - 1)
                }
              >
                -
              </Button>{' '}
              {quantity(item)}
              <Button
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                }}
                variant="success"
                className=" bg-success d-flex justify-content-center align-items-center fs-4 text-white"
                onClick={() =>
                  location.pathname !== '/cart' &&
                  location.pathname !== `/product/${item?._id}`
                    ? handlequantity(item)
                    : handlequantity(item, item?.quantity + 1)
                }
              >
                +
              </Button>{' '}
            </div>
          ) : (
            <div className="w-100">
              <Button
                style={{
                  borderRadius: '10px',
                }}
                variant="success"
                className=" bg-success w-100 text-white"
                onClick={() =>
                  location.pathname !== '/cart' &&
                  location.pathname !== `/product/${item?._id}`
                    ? handlequantity(item)
                    : handlequantity(item, item?.quantity + 1)
                }
              >
                Add
              </Button>{' '}
            </div>
          )}
        </Col>
        <Col xs={8}>
          <Card.Body className="p-0">
            <Card.Title
              className="mb-1"
              style={{ fontSize: '1rem', fontWeight: '600' }}
            >
              {item?.name?.length > 35
                ? `${item?.name?.slice(0, 35)}...`
                : item?.name}
            </Card.Title>
            <Card.Text>
              {item?.desc?.length > 60
                ? `${item?.desc?.slice(0, 60)}...`
                : item?.desc}
            </Card.Text>

            {/* Pounded Yam */}

            {productList &&
              productList?.map((product) => (
                <Row
                  key={product._id}
                  className="bg-info rounded pb-1 align-items-center mb-2"
                >
                  <select
                    value={selectedExtras[product._id] || ''}
                    onChange={(e) =>
                      setSelectedExtras({
                        ...selectedExtras,
                        [product._id]: e.target.value,
                      })
                    }
                    style={{
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                    }}
                  >
                    {product?.extras?.map((i) => (
                      <option key={i._id} value={i._id}>
                        {i.item} (₦{i.price})
                      </option>
                    ))}
                  </select>

                  <div style={{ height: '30px' }}>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() =>
                        removeExtraQuantity({
                          newExtraItem: product,
                          extraId: selectedExtras[product._id],
                        })
                      }
                    >
                      -
                    </Button>{' '}
                    <span className="mx-2">
                      {getCartQuantity({
                        productId: product?._id,
                        extraId: selectedExtras[product._id],
                      })}
                    </span>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() =>
                        extraQuantity({
                          newExtraItem: product,
                          extraId: selectedExtras[product._id],
                        })
                      }
                    >
                      +
                    </Button>
                  </div>
                </Row>
              ))}
          </Card.Body>
        </Col>
      </Row>
    </Card>
  );
};

export default ItemCard;
