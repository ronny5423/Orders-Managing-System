import React,{useState} from "react";
import {Order} from "../api";
import '../CSS/SingleOrderComponent.scss';

/**
 * This function returns an image depends on order state
 * @param status :string, the status of the order
 */
function getAssetByStatus(status: string) {
    switch (status) {
        case 'fulfilled':
            return require('../assets/cancel.png');
        case 'not-fulfilled':
            return require('../assets/pending.png');
        case 'canceled':
            return require('../assets/cancel.png');
        case 'paid':
            return require('../assets/paid.png');
        case 'not-paid':
            return require('../assets/not-paid.png');
        case 'refunded':
            return require('../assets/refunded.png');
    }
}

function SingleOrderComponent(props:any) {
    const order:Order=props.order;
    const [showItemsDetails,changeShowItemDetails]=useState(false);//state to know if show details of items

    return (
        <div className={'orderCard'}>
            <div className={'generalData'}>
                <h6>{order.id}</h6>
                <h4>{order.customer.name}</h4>
                <h5>Order Placed: {new Date(order.createdDate).toLocaleDateString()}</h5>
                {showItemsDetails && <div>
                    <h3>Items:</h3>
                    {
                        order.detailedItems.map(item=> <div key={item.id}>
                        <h5>Name: {item.name}</h5>
                        <h5>Quantity: {item.quantity}</h5>
                        <img src={item.image} />
                    </div>)}
                    <h5>Time of the order: {new Date(order.createdDate).toLocaleTimeString()}</h5>
                </div>}
            </div>
            <div className={'fulfillmentData'}>
                <h4 id="numOfItemsHeader" onClick={()=> changeShowItemDetails(!showItemsDetails)}>{order.itemQuantity} Items</h4>
                <img src={getAssetByStatus(order.fulfillmentStatus)}/>
                {order.fulfillmentStatus !== 'canceled' &&
                <a href="#" onClick={(e)=>{
                    e.preventDefault();//prevent from scrollbar to jump to top of the page
                    props.changeOrderStatus(props.index)
                }
                }>Mark as {order.fulfillmentStatus === 'fulfilled' ? 'Not Delivered' : 'Delivered'}</a>
                }
            </div>
            <div className={'paymentData'}>
                <h4>{order.price.formattedTotalPrice}</h4>
                <img src={getAssetByStatus(order.billingInfo.status)}/>
            </div>
        </div>
    )
}

export default React.memo(SingleOrderComponent);