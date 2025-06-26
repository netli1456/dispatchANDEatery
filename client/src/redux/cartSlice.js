import { createSlice } from '@reduxjs/toolkit';

export const cartSlice = createSlice({
  name: 'cart',

  initialState: {
    cartItems: [],
    cartExtras: [],
  },
  reducers: {
    addCart: (state, action) => {
      const newItem = action.payload;
      const quantity = action.payload.quantity;
      const existItem = state.cartItems.find(
        (item) => item._id === newItem._id
      );

      const updatedItem = existItem
        ? state.cartItems.map((item) =>
            item._id === existItem._id ? { ...item, quantity: quantity } : item
          )
        : [...state.cartItems, { ...newItem, quantity: 1 }];
      return { ...state, cartItems: updatedItem };
    },
    removeCart: (state, action) => {
      const removedItems = state.cartItems.filter(
        (item) => item._id !== action.payload
      );
      return { ...state, cartItems: removedItems };
    },
    clearCart: (state) => {
      state.cartItems = [];
    },

    // addExtras: (state, action) => {
    //   const { newExtraItem, extraId } = action.payload;
    //   const existItem = state.cartItems.find(
    //     (item) => item._id === newExtraItem._id
    //   );

    //   if (existItem) {
    //     const updateExtras = existItem.extras.map((item) =>
    //       item._id === extraId
    //         ? { ...item, quantity: (item.quantity || 0) + 1 }
    //         : item
    //     );

    //     const updateCart = state.cartItems.map((item) =>
    //       item._id === existItem._id ? { ...item, extras: updateExtras } : item
    //     );
    //     return { ...state, cartItems: updateCart };
    //   }
    // },

    addExtras: (state, action) => {
  const { newExtraItem, extraId } = action.payload;
  const existItem = state.cartItems.find(
    (item) => item._id === newExtraItem._id
  );

  if (existItem) {
    if (!Array.isArray(existItem.extras)) {
      existItem.extras = [];
    }

    const existExtra = existItem.extras.find((item) => item._id === extraId);

    if (existExtra) {
      existExtra.quantity = (existExtra.quantity || 0) + 1;
    } else {
      existItem.extras.push({
        _id: extraId,
        quantity: 1,
      });
    }
  }
},



    removeExtras: (state, action) => {
  const { newExtraItem, extraId } = action.payload;
  const existItem = state.cartItems.find(
    (item) => item._id === newExtraItem._id
  );

  if (existItem) {
    const updatedExtras = existItem.extras.map((extra) =>
      extra._id === extraId
        ? { ...extra, quantity: Math.max((extra.quantity || 1) - 1, 0) }
        : extra
    );

    const updateCart = state.cartItems.map((item) =>
      item._id === existItem._id ? { ...item, extras: updatedExtras } : item
    );

    return { ...state, cartItems: updateCart };
  }
},

  },
});

export const { removeExtras, addCart, removeCart, clearCart, addExtras } = cartSlice.actions;

export default cartSlice.reducer;
