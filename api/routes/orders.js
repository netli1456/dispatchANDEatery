import express from 'express';
import {
  CreateOrder,
  getPopularItems,
  getSingleOrder,
  orderedItems,
  refundAndCancelOrder,
  takeOrder,
  updatePayment,
  
} from '../controllers/orders.js';
import { authMiddleware } from '../middleWareAuth/midleware.js';

const OrderRouter = express.Router();

OrderRouter.post(
  '/:fingerprint/:buyerId/:businessId',
  
  CreateOrder
);
OrderRouter.get('/:fingerprint/allorders/:id',  orderedItems);
OrderRouter.get(
  '/:fingerprint/find/:orderId/:id',
 
  getSingleOrder
);
OrderRouter.put(
  '/:fingerprint/takeorder/:businessId/:orderId',
  authMiddleware,
  takeOrder
);
OrderRouter.put(
  '/:fingerprint/refund/:id/:orderId',
  authMiddleware,
  refundAndCancelOrder
);

OrderRouter.post('/pay', updatePayment )
OrderRouter.get('/popular/:id', getPopularItems )

export default OrderRouter;
