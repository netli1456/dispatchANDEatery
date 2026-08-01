import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addCart, removeCart } from '../redux/cartSlice';
import ItemCard from '../kitchenSection/ItemCard';

function CartCard(props) {
  const location = useLocation();
  const { cartItems, } = useSelector((state) => state.cart);
  const { product } = props;
  const dispatch = useDispatch();

  const handleRemoveCart = (id) => {
    if (!id) return;
    dispatch(removeCart(id));
  };

  // ✅ get quantity safely
  const quantity = (item) => {
    const found = cartItems?.find((i) => i?._id === item?._id);
    return found?.quantity || 0;
  };

  // ✅ always send valid quantity
  const handlequantity = (item, qty) => {
    if (!item) return;

    // default to 1 if qty is missing
    const newQty = qty || 1;

    dispatch(addCart({ ...item, quantity: newQty }));
  };

  // ✅ protect against null items
  const itemsToRender =
    location.pathname === `/product/${product}`
      ? cartItems?.slice(0, 3)
      : cartItems;

  return (
    <div>
      {location.pathname !== '/cart' && (
        <Card className="shadow">
          <Card.Body>
            <strong>
              Total({cartItems?.length || 0} Items):{' '}
              {`N${
                cartItems
                  ?.filter(Boolean)
                  ?.reduce((a, c) => a + c.price * c.quantity, 0)
                  .toFixed(2) || '0.00'
              }`}
            </strong>
          </Card.Body>
        </Card>
      )}

      <ListGroup className="mt-2 mb-3">
        {location.pathname !== '/cart' && (
          <span className="text-center fw-bold border-bottom border-dark fs-5">
            Your Cart Items
          </span>
        )}

        {itemsToRender
          ?.filter(Boolean) 
          ?.map((item) => (
            <ListGroup.Item
              className="d-flex mb-3 bor shadow border-0 gap-1 position-relative"
              key={item._id}
            >
              <ItemCard
                handlequantity={handlequantity}
                quantity={quantity(item)} // ✅ now correct
                item={item}
              />

              <span
                style={{
                  position: 'absolute',
                  top: 5,
                  right: 8,
                  cursor: 'pointer',
                }}
                className="text-danger"
                onClick={() => handleRemoveCart(item._id)}
              >
                <HighlightOffOutlinedIcon />
              </span>
            </ListGroup.Item>
          ))}
      </ListGroup>
    </div>
  );
}

export default CartCard;