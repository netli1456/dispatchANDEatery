import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import {  addExtras, removeExtras } from "../redux/cartSlice";

export default function ItemCard({ item, handlequantity, kitchenData }) {
  const [selectedExtras, setSelectedExtras] = useState({});

  const location = useLocation();
  const { cartItems } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const currentQty =
    cartItems.find((i) => i?._id === item?._id)?.quantity || 0;

  const extraQuantity = ({ newExtraItem, extraId }) => { 
    

   
    dispatch(addExtras({ newExtraItem, extraId }));

  };

  const removeExtraQuantity = ({ newExtraItem, extraId }) => {
    const existItem = cartItems?.find((i) => i._id === newExtraItem._id);
    if (existItem) {
      dispatch(removeExtras({ newExtraItem: existItem, extraId }));
    }
  };




  const getCartQuantity = ({ productId, extraId }) => {
    const product = cartItems?.find((item) => item._id === productId);
    const extra = product?.extras?.find((e) => e._id === extraId);
    return extra?.quantity || 0;
  };

  useEffect(() => {
  
    if(selectedExtras[0]){
      getCartQuantity()
    }
  },[selectedExtras])

  // Initialize selected extra only once per item (prevents infinite loops)
  // useEffect(() => {
  //   if (selectedExtras[item._id]) return;

  //   const cartItem = cartItems.find((i) => i._id === item._id);

  //   let selectedId = "";

  //   if (cartItem?.extras?.length > 0) {
  //     const selected = cartItem.extras.find((ex) => ex.quantity > 0);
  //     if (selected) selectedId = selected._id;
  //   } else if (item?.extras?.length > 0) {
  //     selectedId = item.extras[0]._id;
  //   }

  //   if (selectedId) {
  //     setSelectedExtras((prev) => ({
  //       ...prev,
  //       [item._id]: selectedId,
  //     }));
  //   }
  // }, [item._id, cartItems]);





//   const addExtras = ({ itemId, extraItemId }) => {
//   const item = cartItems.find((i) => i._id === itemId);

//   if (!item) return;

//   const updatedExtras = item.extras.map((exItem) =>
//     exItem._id === extraItemId
//       ? { ...exItem, quantity: exItem.quantity + 1 }
//       : exItem
//   );

//   dispatch(
//     addCart({
//       ...item,
//       extras: updatedExtras,
//     })
//   );
// };

  return (
    <div
      className={`rounded-2xl min-h-[185px] p-3 ${
        location.pathname === "/cart"
          ? "border-0"
          : "shadow-md"
      } bg-white`}
    >
      <div className="flex gap-3 h-full">
        {/* LEFT */}
        <div className="w-1/3 flex flex-col">
          <Link to={`/product/${item._id}`}>
            <img
              className="w-full h-[110px] object-cover rounded-lg"
              src={item?.imgs?.[0]?.url}
              alt=""
            />
          </Link>

          <p className="mt-2 text-sm font-semibold text-gray-700">
            ₦{item?.price?.toFixed(2)}
          </p>

          {/* Quantity (with extras) */}
          {item?.extras?.length > 0 && (
            <div className="mt-auto">
              {cartItems.find((i) => i._id === item._id) ? (
                <div className="flex items-center gap-2">
                  <button
                    disabled={currentQty === 1}
                    onClick={() => handlequantity(item, currentQty - 1)}
                    className="w-10 h-10 border rounded-lg text-xl"
                  >
                    -
                  </button>

                  <span className="text-lg font-medium">
                    {currentQty}
                  </span>

                  <button
                    onClick={() => handlequantity(item, currentQty + 1)}
                    className="w-10 h-10 border rounded-lg text-xl"
                  >
                    +
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handlequantity(item, 1)}
                  className="w-full bg-green-600 text-white rounded-lg py-2"
                >
                  Add
                </button>
              )}
            </div>
          )}
        </div>

        {/* RIGHT */}
        <div className="w-2/3 flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-sm">
              {item?.name?.length > 35
                ? `${item.name.slice(0, 35)}...`
                : item.name}
            </h3>

            <p className="text-xs text-gray-500">
              {item?.desc?.length > 40
                ? `${item.desc.slice(0, 40)}...`
                : item.desc}
            </p>
          </div>

          {/* Extras */}
          {item?.extras?.length > 0 ? (
            <div className="border rounded-lg p-2">
              <select
                className="w-full bg-transparent outline-none text-sm"
                value={selectedExtras[item._id] || ""}
                onChange={(e) =>
                  setSelectedExtras({
                    ...selectedExtras,
                    [item._id]: e.target.value,
                  })
                }
              >
                {item.extras.map((ex) => (
                  <option key={ex._id} value={ex._id}>
                    {ex.item} (₦{ex.price})
                  </option>
                ))}
              </select>

              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={() =>
                    removeExtraQuantity({
                      newExtraItem: item,
                      extraId: selectedExtras[item._id],
                    })
                  }
                  className="px-2 py-1 border rounded"
                >
                  -
                </button>

                <span>
                  {getCartQuantity({
                    productId: item?._id,
                    extraId: selectedExtras[item._id],
                  })}  
                </span>

               <button
  onClick={() =>
    extraQuantity({
      newExtraItem: item,
      extraId:
        selectedExtras[item._id] || item.extras[0]?._id,
    })
  }
  className="px-2 py-1 border rounded"
>
  +
</button>
              </div>
            </div>
          ) : (
            <div>
              {cartItems.find((i) => i._id === item._id) ? (
                <div className="flex items-center gap-2">
                  <button
                    disabled={currentQty === 1}
                    onClick={() => handlequantity(item, currentQty - 1)}
                    className="w-8 h-8 bg-green-600 text-white rounded-full"
                  >
                    -
                  </button>

                  <span>{currentQty}</span>

                  <button
                    onClick={() => handlequantity(item, currentQty + 1)}
                    className="w-8 h-8 bg-green-600 text-white rounded-full"
                  >
                    +
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handlequantity(item, 1)}
                  className="w-full bg-green-600 text-white rounded-lg py-2"
                >
                  Add
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
