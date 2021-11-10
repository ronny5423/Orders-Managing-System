const allOrders:any[]=require('../orders.json');
const itemsUtils=require("./ItemsUtils");
let numberOfUndeliveredOrders:number=0;

/**
 * This function calculates number of undelivered orders
 */
function calculateUnDeliveredOrders(){
    for(let order of allOrders){
        if(order.fulfillmentStatus=="not-fulfilled"){
            numberOfUndeliveredOrders++;
        }
    }
}
calculateUnDeliveredOrders();

/**
 * This function returns all orders matching all provided criteria. It returns an objects holds an array of all orders
 * keys that matches the criterias and an array holding numberOfOrdersToShow orders objects
 * @param searchQuery :string
 * @param fulfillmentFilter :string, value of fulfillment filter
 * @param paymentFilter :string, value of payment filter
 * @param sortCriteria :string, sorting criteria
 * @param sortOrder :string, sort order(ascending or descending)
 * @param numberOfOrdersToShow :number, number of orders objects to return
 */
export function getOrders(searchQuery:string,fulfillmentFilter:string,paymentFilter:string,sortCriteria:string,sortOrder:string,numberOfOrdersToShow:number){
    let orders=[];
    for(let order of allOrders){
        if(searchQuery.length>0 && fulfillmentFilter.length>0 && paymentFilter.length>0){//if search query and both filters exist
            if(checkIfOrderHasCustomerNameAndItems(order,searchQuery) && checkIfOrderFitsByFulfillmentFilter(order,fulfillmentFilter,false) && checkIfOrderFitsByFulfillmentFilter(order,paymentFilter,true)){
                orders.push(order.id);
            }
        }
        else if(searchQuery.length>0 && fulfillmentFilter.length>0){//if search query and fulfillment filter exist and no payment filter
            if(checkIfOrderHasCustomerNameAndItems(order,searchQuery) && checkIfOrderFitsByFulfillmentFilter(order,fulfillmentFilter,false)){
                orders.push(order.id);
            }
        }
        else if(searchQuery.length>0 && paymentFilter.length>0){//if search query and payment filter exist and no fulfillment filter
            if(checkIfOrderHasCustomerNameAndItems(order,searchQuery) && checkIfOrderFitsByFulfillmentFilter(order,paymentFilter,true)){
                orders.push(order.id);
            }
        }
        else if(fulfillmentFilter.length>0 && paymentFilter.length>0){//if both filters exist and no search query
            if(checkIfOrderFitsByFulfillmentFilter(order,fulfillmentFilter,false) && checkIfOrderFitsByFulfillmentFilter(order,paymentFilter,true)){
                orders.push(order.id);
            }
        }
        else if(searchQuery.length>0){//if only search query exist
            if(checkIfOrderHasCustomerNameAndItems(order,searchQuery)){
                orders.push(order.id);
            }
        }
        else if(fulfillmentFilter.length>0){//if only fulfillment filter exist
            if(checkIfOrderFitsByFulfillmentFilter(order,fulfillmentFilter,false)){
                orders.push(order.id);
            }
        }
        else if(paymentFilter.length>0){//if only payment filter exist
            if(checkIfOrderFitsByFulfillmentFilter(order,paymentFilter,true)){
                orders.push(order.id);
            }
        }
        else{//if nothing exist, return all orders in database
            orders.push(order.id);
            }
    }
    if(sortCriteria.length>0){
        return sortOrders(orders,sortCriteria,sortOrder,numberOfOrdersToShow);
      }
    return {
        ordersKeys:orders,
        ordersToShow: createFullOrdersObjects(orders.slice(0,numberOfOrdersToShow))
    }
}

/**
 * This function sort orders based on sorting criteria
 * @param ordersIds :number[], an array holds orders keys to sort
 * @param sortCriteria :string, sorting criteria
 * @param sortOrder :string, sort order(ascending or descending)
 * @param numberOfFirstOrdersToShow :number, number of orders objects to return
 */
export function sortOrders(ordersIds:number[],sortCriteria:string,sortOrder:string,numberOfFirstOrdersToShow:number){
    let orders=[];
    for(let order of allOrders){//create array of orders that keys were provided
        if(ordersIds.includes(order.id)){
            orders.push(order);
        }
    }
    switch (sortCriteria) {
        case 'customer':
            orders.sort(compareBetweenCostumerNAmes);
            break;
        case 'price':
            orders.sort(compareBetweenPrices);
            break;
        case 'quantity':
            orders.sort(compareBetweenQuantities);
            break;
        case 'date':
            orders.sort(compareBetweenDates);
            break
    }
    if(sortOrder==="descending"){
        orders.reverse();
    }
    let sortedOrdersKeys=[];
    for(let order of orders){//create array of sorted orders keys
        sortedOrdersKeys.push(order.id);
    }
    return {
        ordersKeys:sortedOrdersKeys,
        ordersToShow:createSortedFullOrderObjects(orders.slice(0,numberOfFirstOrdersToShow))
    }
}

/**
 * This function creates an array of orders objects
 * @param orders :any[], an array of orders holding all information except items objects
 */
function createSortedFullOrderObjects(orders:any[]){
    return orders.map(order=>{
        let newOrder={...order};
        newOrder.detailedItems=itemsUtils.getItems(newOrder.items);
        return newOrder;
    })
}

/**
 * This function creates an array of orders objects from an array of orders keys
 * @param ordersIds :number[], an array of orders keys
 */
export function createFullOrdersObjects(ordersIds:number[]){
    let orders=new Array(ordersIds.length);
    let indexesMap=new Map();
    for(let i=0;i<ordersIds.length;i++){//create a map that holds the id of the order and it's index in the array
        indexesMap.set(ordersIds[i],i);
    }
    for(let order of allOrders){
        if(ordersIds.includes(order.id)){
            let clonedOrder={...order};
            clonedOrder.detailedItems=itemsUtils.getItems(clonedOrder.items);
            orders[indexesMap.get(clonedOrder.id)]=clonedOrder;
        }
    }
    return orders;
  }

/**
 * This function changes the order status
 * @param orderId :number, id of the order to change its status
 * @param orderStatus :String, new status of the order
 */
export function changeOrderStatus(orderId:number,orderStatus:string){
    for(let order of allOrders){
       if(order.id==orderId){
            order.fulfillmentStatus=orderStatus;
            if(orderStatus=="not-fulfilled"){
                numberOfUndeliveredOrders++;
            }
            else{
                numberOfUndeliveredOrders--;
            }
            return;
        }
    }
}

/**
 * This function returns number of undelivered orders
 */
export function getNumberOfUndeliveredOrders(){
    return numberOfUndeliveredOrders;
}

/**
 * This function checks if customer name, order id or one of order's items names contains the search query
 * @param order :any, order object to check
 * @param searchQuery :string, search query
 */
function checkIfOrderHasCustomerNameAndItems(order:any,searchQuery:string){
    if((order.customer.name.toLowerCase() + order.id).includes(searchQuery.toLowerCase())){
        return true;
    }
    return itemsUtils.checkIfItemsMatchToQuery(order.items,searchQuery);
}

/**
 * This function checks if order fits by filter
 * @param order :any, order object to check
 * @param filter :string, value of the filter
 * @param isPaymentFilter :boolean, true if is payment filter or false if fulfillment filter
 */
function checkIfOrderFitsByFulfillmentFilter(order:any,filter:string,isPaymentFilter:boolean){
    if(isPaymentFilter){
        return order.billingInfo.status===filter;
    }
    return order.fulfillmentStatus===filter;
}

/**
 * comparator for comparing two orders by customer name
 * @param order1 :Any, order 1 to check
 * @param order2 :any, order 2 to check
 */
function compareBetweenCostumerNAmes(order1:any,order2:any){
    if(order1.customer.name.toLowerCase()>order2.customer.name.toLowerCase()){
        return 1;
    }
    if(order1.customer.name.toLowerCase()<order2.customer.name.toLowerCase()){
        return -1;
    }
    return 0;
}

/**
 * comparator for compare two orders by price
 * @param order1
 * @param order2
 */
function compareBetweenPrices(order1:any,order2:any){
    return order1.price.total-order2.price.total;
}

/**
 * comparator for compare two orders by item's quantity
 * @param order1
 * @param order2
 */
function compareBetweenQuantities(order1:any,order2:any){
    return order1.itemQuantity-order2.itemQuantity;
}

/**
 * comparator for compare two orders by date
 * @param order1
 * @param order2
 */
function compareBetweenDates(order1:any,order2:any){
    let date1=new Date(order1.createdDate);
    let date2=new Date(order2.createdDate);
    if(date1<date2){
        return -1;
    }
    if(date1>date2){
        return 1;
    }
    return 0;
}
