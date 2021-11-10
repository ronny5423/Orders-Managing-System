import express from 'express';
const router=express.Router();
const ordersUtils=require("../../Utils/OrdersUtils");

/**
 * router for getting orders based on search query, fulfillment filter,payment filter, sort criteria
 * and sort order. It returns an objects contains an array of order keys fits to all parameters
 * and an array holds the first numberOfOrdersToShow orders objects
 */
router.get("/getSearchedAndFilteredOrders", async (req,res)=>{
   try{
      const searchQuery=req.query.searchQuery;
      const filterByFulfillment=req.query.filterByFulfillment;
      const filterByPayment=req.query.filterByPayment;
      const sort=req.query.sort;
      const sortOrder=req.query.sortOrder;
      const numberOfOrdersToShow=req.query.numberOfOrdersToShow;
      res.status(200).send(ordersUtils.getOrders(searchQuery,filterByFulfillment,filterByPayment,sort,sortOrder,numberOfOrdersToShow));
   }
   catch (error){
      res.sendStatus(500);
   }
});

/**
 * router for sorting orders based on sorting criteria. It receives an array of orders keys to sort, sorting criteria,
 * sort order and number of orders to show to the user. It returns an object holding an array of sorted orders keys
 * and an array of first numberOfOrdersToShow orders objects
 */
router.get("/sort/:ordersToSort", async (req,res)=>{
   try{
      const ordersKeysToSort=JSON.parse(req.params.ordersToSort);
      const sortingCriteria=req.query.sortingCriteria;
      const sortOrder=req.query.sortOrder;
      const numberOfOrdersToShow=req.query.numberOfOrdersToShow;
      res.status(200).send(ordersUtils.sortOrders(ordersKeysToSort,sortingCriteria,sortOrder,numberOfOrdersToShow));
   }
   catch (error){
      res.sendStatus(500);
   }
});

/**
 * router for receiving an orders objects array to show to the user. It gets an array of orders keys
 * and returns an array of orders objects
 */
router.get("/getOrdersToShow/:ordersKeys", async(req,res)=>{
   try{
      const ordersKeysToShow=JSON.parse(req.params.ordersKeys);
      res.status(200).send(ordersUtils.createFullOrdersObjects(ordersKeysToShow));
   }
   catch (error){
      res.sendStatus(500);
   }
});

/**
 * router for updating a status of order. It receives an order id and it's status and update the status
 * of the order.
 */
router.put("/updateDeliveryStatus/:orderId",async(req,res)=>{
   try{
      const orderId=req.params.orderId;
      const orderStatus=req.query.orderStatus;
      ordersUtils.changeOrderStatus(orderId,orderStatus);
      res.sendStatus(200);
   }
   catch (error){
      res.sendStatus(500);
   }
} );

/**
 * router for getting number of undelivered orders.
 */
router.get("/getNumberOfUndeliveredOrders",async(req,res)=>{
   try{
      res.status(200).send(ordersUtils.getNumberOfUndeliveredOrders().toString());
   }
   catch(error){
      res.sendStatus(500);
   }
});

export default router;