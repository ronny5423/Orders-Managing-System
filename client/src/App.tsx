import React,{useState,useCallback} from 'react';
import './App.scss';
import OrdersComponent from "./Components/OrdersComponent";
import SearchComponent from "./Components/SearchComponent";

function App(){
	const [searchQuery,updateSearchQuery]= useState("");
	const [fulfillmentFilter,updateFulfillmentFilter]=useState("");
	const [paymentFilter,updatePaymentFilter]=useState("");
	const [sort,updateSort]=useState("");
	const [sortOrder,updateSortOrder]=useState("ascending");

	/**
	 * callback to update search query state in order to pass it to orders component
	 */
	const passSearchQueryToOrdersComponent= useCallback((searchQuery:string)=>{
		updateSearchQuery(searchQuery);
	},[searchQuery]);

	/**
	 * callback to update fulfillment filter state in order to pass it to orders component
	 */
	const passFullfillmentFilterToOrdersComponents= useCallback((fulfillmentFilter:string)=>{
		updateFulfillmentFilter(fulfillmentFilter);
	},[fulfillmentFilter]);

	/**
	 * callback to update payment filter state in order to pass it to orders component
	 */
	const passPaymentFilterToOrdersComponent=useCallback((paymentFilter:string)=>{
		updatePaymentFilter(paymentFilter);
	},[paymentFilter]);

	/**
	 * callback to update sort criteria state in order to pass it to orders component
	 */
	const passSortValue=useCallback((sortValue:string)=>{
		updateSort(sortValue);
	},[sort])

	/**
	 * callback to update sort order state in order to pass it to orders component
	 */
	const passSortOrder=useCallback((sortOrder)=>{
		updateSortOrder(sortOrder.target.value);
	},[sortOrder])

	return(
		<main>
				<h1>Orders</h1>
				<SearchComponent getSearchQuery={passSearchQueryToOrdersComponent} getFulfillmentFilter={passFullfillmentFilterToOrdersComponents} getPaymentFilter={passPaymentFilterToOrdersComponent} getSortValue={passSortValue} updateSortOrder={passSortOrder} />
				<OrdersComponent searchQuery={searchQuery} fulfillmentFilter={fulfillmentFilter} paymentFilter={paymentFilter} sort={sort} sortOrder={sortOrder} />
			</main>
	)
}

export default App;
