import React from "react";

function OrdersGeneralInfoComponent(props:any){

    return (
        <div>
            <span>Showing {props.numberOfOrders} result</span>
             <span>Number of Undelivered orders: {props.numberOfUndeliveredOrders}</span>
        </div>
    )
}

export default OrdersGeneralInfoComponent;