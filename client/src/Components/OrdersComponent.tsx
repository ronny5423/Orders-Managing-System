import React, {useState, useEffect, useCallback, useRef} from "react";
import {Order, createApiClient, Item} from "../api";
import SingleOrderComponent from "./SingleOrderComponent";
import '../CSS/OrdersComponents.scss';
import PaginationComponent from "./PaginationComponent";
import {searchResults} from "../api";
import OrdersGeneralInfoComponent from "./OrdersGeneralInfoComponent";

const api=createApiClient();
const numberOfItemsPerPage=20;

function OrdersComponent(props:any){
    const [ordersKeys,updateOrders]=useState<number[]>([]);//state for keys of search results orders
    const [ordersToShow,updateordersToShow]=useState<Order[]>([]);// state for orders to show to user
    const [numberOfUndeliveredOrders,updateNumberOfUnDeliveredOrders]=useState(0); //state for number of undelivered orders
    const [pageNumber,updatePageNumber]=useState(1);//state for the page which to show to the user
    const [wasError,updateErrorStatus]=useState(false);//state if error has been occurred
    const firstRun=useRef(false);//useref to determine if first run

    /**
     * This function calculates the last index of orders keys array to show to the user.
     * It returns the end index of orders keys to show
     * @param beginning, :number, order key from where we start to show
     */
    function getEndOfordersToShow(beginning:number){
        if(beginning+numberOfItemsPerPage<ordersKeys.length){
            return beginning+numberOfItemsPerPage;
        }
        return ordersKeys.length;
    }

    /**
     * This function updates orders keys and orders to show if error wasn't occurred during data fetching
     * @param res :SearchResult, an object contains new orders keys and new orders to show array to present to the user
     */
    function checkIfUpdateComponent(res:searchResults){
        if(!checkIfErrorOccurred(res)){
            if(wasError){//if we presented in previous stage error message
                updateErrorStatus(false);
            }
            updateordersToShow(res.ordersToShow);
            updateOrders(res.ordersKeys);
            updatePageNumber(1);
        }
     }

    /**
     * This function updates orders to show if error wasn't occurred during data fetching
     * @param res, :Order[], an array of new orders objects to present to the user
     * @param pageNumber: number, page number to update
     */
    function checkIfUpdateShowedOrders(res:Order[],pageNumber:number){
        if(!checkIfErrorOccurred(res)){
            if(wasError){//if we presented in previous stage error message
                updateErrorStatus(false);
            }
            updateordersToShow(res);
            updatePageNumber(pageNumber);
        }
     }

    /**
     * This function updates number of undelivered orders if error wasn't occurred
     * @param res :number, number of undelivered orders
     */
     function shouldUpdateUnDeliveredCounter(res:number){
        if(!checkIfErrorOccurred(res)){
            if(wasError){//if we presented in previous stage error message
                updateErrorStatus(false);
            }
            updateNumberOfUnDeliveredOrders(res)
        }
     }

    /**
     * This function checks if an error was occurred during fetching data, if yes it presenting an error message
     * and returns if error was occurred or not
     * @param res :any, data to check
     */
    function checkIfErrorOccurred(res:any){
        if(res==null){
            if(!wasError){
                updateErrorStatus(true);
            }
            return true;
        }
        return false;
    }

    /**
     * use effect for updating orders when filter or search query changes
     */
    useEffect(()=>{
        if(!firstRun.current){// if it's before the component was mounted
            //fetch number of undelivered orders from the server
            api.getNumberOfUndeliveredOrders().then(res=>shouldUpdateUnDeliveredCounter(res));
            firstRun.current=true;
        }
        //fetch data about orders
        api.getOrders(props.searchQuery,props.fulfillmentFilter,props.paymentFilter,props.sort,props.sortOrder,numberOfItemsPerPage).then((res)=>checkIfUpdateComponent(res))
    },[props.searchQuery,props.fulfillmentFilter,props.paymentFilter]);

    /**
     * use effect for sort orders when sort criteria changes
     */
    useEffect(()=>{
    if(ordersKeys.length>0) {
        // send orders to sort in server
        api.sortOrders(ordersKeys, props.sort, props.sortOrder, numberOfItemsPerPage).then(res => checkIfUpdateComponent(res))
    }
    },[props.sort])

    /**
     * use effect for change sorted orders order
     */
    useEffect(()=>{
    if(ordersKeys.length>0) {
        let reversedOrders = [...ordersKeys].reverse();
        //get order to show from server
        api.getOrdersToShow(reversedOrders.slice(0, numberOfItemsPerPage)).then(res => {
            checkIfUpdateShowedOrders(res,1);
            updateOrders(reversedOrders);
        })
    }

    },[props.sortOrder])

    /**
     * callback for changing order status from delivered to undelivered and vice versa
      */
    const changeOrderStatus=useCallback((orderIndex:number)=>{
        const newOrders:Order[]= [...ordersToShow];
        let newUnDeliveredNumber=numberOfUndeliveredOrders;
        switch (newOrders[orderIndex].fulfillmentStatus){
            case 'fulfilled':
                newOrders[orderIndex].fulfillmentStatus='not-fulfilled';
                newUnDeliveredNumber++;
                updateNumberOfUnDeliveredOrders(newUnDeliveredNumber)
                break
            case 'not-fulfilled':
                newOrders[orderIndex].fulfillmentStatus='fulfilled';
                newUnDeliveredNumber--;
                updateNumberOfUnDeliveredOrders(newUnDeliveredNumber);

                break
        }
        //update the status of the order in the server
        api.updateOrderStatus(newOrders[orderIndex].id,newOrders[orderIndex].fulfillmentStatus);
        updateordersToShow(newOrders);
    },[ordersToShow]);

    /**
     * call back for getting new orders to show to user when user change the page
     */
    const updateOrdersInPage=useCallback((pageNumber:number)=>{
        async function getOrdersToShow(){
            let beginning=(pageNumber-1)*numberOfItemsPerPage;//calculate beginning of orders to show
            //fetch new orders from server
            let newOrdersToShow=await api.getOrdersToShow(ordersKeys.slice(beginning,getEndOfordersToShow(beginning)));
            checkIfUpdateShowedOrders(newOrdersToShow,pageNumber);
       }
        getOrdersToShow();
    },[ordersKeys])

    return (
        !wasError ? <div className='results'>

            <OrdersGeneralInfoComponent numberOfUndeliveredOrders={numberOfUndeliveredOrders} numberOfOrders={ordersKeys.length} />
            {
                ordersToShow.map((order:Order,index:number)=>(
                    <SingleOrderComponent key={order.id} order={order} changeOrderStatus={changeOrderStatus} index={index}  />
                ))
            }
            <br/>
            <PaginationComponent numberOfPages={Math.ceil(ordersKeys.length/numberOfItemsPerPage)} updateOrdersInPage={updateOrdersInPage} currentPage={pageNumber} />
        </div> : <div>Error has been occurred. Please try again later!</div>


    )
}

export default OrdersComponent;