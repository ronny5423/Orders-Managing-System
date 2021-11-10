import React,{useState} from "react";
import {Dropdown,DropdownButton} from "react-bootstrap";
import "../CSS/SearchComponent.scss";

function SearchComponent(props:any){
    const [fulfillment,changeFulfillment]=useState("By fulfillment status");//state for fulfillment filter
    const [payment,changePayment]=useState("By payment status");//state for payment filter
    const [sort,changeSort]=useState("Sort");//state for sort criteria

    /**
     * This function checks if to update the state with initial value or with value and notify the parent component
     * that the state was changed
     * @param value :string, new value of the state
     * @param initialValue: string, initial value of the sort/filter criteria
     * @param propsFunction :Function, function to handle update in parent component
     * @param updateStateFunction:Function, a function to update the state
     */
    function handleChange(value:string,initialValue:string,propsFunction:Function,updateStateFunction:Function){
        if(value===""){
            updateStateFunction(initialValue);
        }
        else{
            updateStateFunction(value);
        }
        propsFunction(value);
    }

   function changeSearchQuery(query:string){
       setTimeout(()=>{
           props.getSearchQuery(query)
       },800)
   }
    return (
        <div className="mainDiv">
            <input id="searchInput" type="search" placeholder="Search for customer name, item name or order id" onChange={(e) => changeSearchQuery(e.target.value)}/>
            <div className="singleFilterDiv">
            <div id="filtersDiv" >
                <h3>Filters</h3>
                <div className="singleFilterDiv">
                    <span>Filter by fulfillment status</span>
                    <DropdownButton  variant="success" title={fulfillment} onSelect={e=>handleChange(e as string,"By fulfillment status",props.getFulfillmentFilter,changeFulfillment)}>
                            <Dropdown.Item eventKey="">None</Dropdown.Item>
                            <Dropdown.Item eventKey="fulfilled">fulfilled</Dropdown.Item>
                            <Dropdown.Item eventKey="not-fulfilled">not-fulfilled</Dropdown.Item>
                            <Dropdown.Item eventKey="canceled">Canceled</Dropdown.Item>

                    </DropdownButton>
                </div>
                <div className="singleFilterDiv">
                    <span>Filter by payment status</span>
                            <DropdownButton title={payment} onSelect={(e)=>handleChange(e as string,"By payment status",props.getPaymentFilter,changePayment)}>
                            <Dropdown.Item eventKey="">None</Dropdown.Item>
                            <Dropdown.Item eventKey="paid">paid</Dropdown.Item>
                            <Dropdown.Item eventKey="not-paid">not paid</Dropdown.Item>
                            <Dropdown.Item eventKey="refunded">refunded</Dropdown.Item>
                    </DropdownButton>
                </div>
            </div>
            <div className="filtersDiv sortDiv">
            <h3>Sort</h3>
            <div className="singleFilterDiv">
                <span>Sort By:</span>
                <DropdownButton title={sort} onSelect={e=>handleChange(e as string,"Sort",props.getSortValue,changeSort)}>
                    <Dropdown.Item eventKey="">None</Dropdown.Item>
                    <Dropdown.Item eventKey="customer">Customer</Dropdown.Item>
                    <Dropdown.Item eventKey="price">Price</Dropdown.Item>
                    <Dropdown.Item eventKey="date">Order Date</Dropdown.Item>
                    <Dropdown.Item eventKey="quantity">Quantity</Dropdown.Item>
                </DropdownButton>
                {sort!=="Sort" &&  <div id="sortOrderDiv" onChange={props.updateSortOrder}>
                    <input  id="ascendingRadio" type="radio" value="ascending" name="sortOrder" defaultChecked/>
                    <label htmlFor="ascendingRadio" >Asc</label>
                    <br/>
                    <input id="descendingRadio" type="radio" value="descending" name="sortOrder"/>
                    <label htmlFor="descendingRadio"> Desc</label>
                </div>}
                </div>
            </div>
            </div>
        </div>
    )
}

export default React.memo(SearchComponent);