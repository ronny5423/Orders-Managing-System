import axios from 'axios';

export type Customer = {
	name: string;
}

export type BillingInfo = {
	status: string;
}

export type Price = {
	formattedTotalPrice: string;
	total:number;
}

export type ItemInOrder={
	id:string;
	quantity:number;
}

export type Order = {
	id: number;
	createdDate: string;
	fulfillmentStatus: string;
	billingInfo: BillingInfo;
	customer: Customer;
	itemQuantity: number;
	price: Price;
	items:ItemInOrder[];
	detailedItems:Item[];
}

export type searchResults={
	ordersKeys:number[];
	ordersToShow:Order[];
}

export type Item = {
	id: string;
	name: string;
	price: number;
	image: string;
	quantity:number
}

export type ApiClient = {
	/**
	 * function to get orders from server depends on search query,fulfillment filter,payment filter, sort criteria and sort order
	 * @param searchQuery :string
	 * @param fulfillmentFilter :String, value of fulfillment filter
	 * @param paymentFilter :string, value of payment filter
	 * @param sort :string, sorting criteria
	 * @param sortOrder :string, sort order(descending or ascending)
	 * @param numberOfOrdersToShow :number, number of orders objects to return to show
	 */
	getOrders: (searchQuery: string, fulfillmentFilter: string, paymentFilter: string, sort: string, sortOrder: string, numberOfOrdersToShow: number) => Promise<searchResults>;

	/**
	 * This function send orders keys to server to sort and gets from the server sorted array of order keys by
	 * sorting criteria and first numberOfOrdersToShow orders objects to show to the user
	 * @param ordersToSort :number[], an array of orders keys to sort
	 * @param sortCriteria :string, the criteria to sort the orders by it
	 * @param sortOrder :string, the order to sort the orders by(ascending or descending)
	 * @param numberOfOrdersToShow :number, number of orders objects to return to show
	 */
	sortOrders: (ordersToSort: number[], sortCriteria: string, sortOrder: string, numberOfOrdersToShow: number) => Promise<searchResults>;

	/**
	 * This function sends to the server an array of order's keys and gets these orders objects
	 * @param ordersKeys :number[], an array of orders keys to get their order object
	 */
	getOrdersToShow: (ordersKeys: number[]) => Promise<Order[]>;

	/**
	 * This function sends to the server an order key and the status to update it's order status in the server
	 * @param oderId :number, id of the order to update
	 * @param orderStatus :string, new status of the order
	 */
	updateOrderStatus:(oderId:number,orderStatus:string)=> Promise<void>;

	/**
	 * This function gets number of undelivered orders from the server
	 */
	getNumberOfUndeliveredOrders:()=>Promise<number>;
}

/**
 * This function checks the response code from the server and returns an answer depends on the response code
 * @param res :any, server's response
 */
function checkResponseCode(res:any){
	if(res.status===200){
		return res.data;
	}
	return null;
}

export const createApiClient = (): ApiClient => {
	return <ApiClient>{
		getOrders: (searchQuery: string, fulfillmentFilter: string, paymentFilter: string, sort: string, sortOrder: string, numberOfOrdersToShow: number) => {
			return axios.get(`http://localhost:3232/Orders/getSearchedAndFilteredOrders`,{
				params:{
					searchQuery: searchQuery,
					filterByFulfillment: fulfillmentFilter,
					filterByPayment: paymentFilter,
					sort: sort,
					sortOrder: sortOrder,
					numberOfOrdersToShow: numberOfOrdersToShow
				}
			}).then(res => checkResponseCode(res));
		},
		sortOrders: (ordersToSort: number[], sortCriteria: string, sortOrder: string, numberOfOrdersToShow: number) => {
			return axios.get(`http://localhost:3232/Orders/sort/${JSON.stringify(ordersToSort)}`,{
				params:{
					sortingCriteria: sortCriteria,
					sortOrder: sortOrder,
					numberOfOrdersToShow: numberOfOrdersToShow
				}
			}).then(res =>checkResponseCode(res) );
		},
		getOrdersToShow: (ordersKeys: number[]) => {
			return axios.get(`http://localhost:3232/Orders/getOrdersToShow/${JSON.stringify(ordersKeys)}`).then(res =>checkResponseCode(res));
		},
		updateOrderStatus:(orderId:number,orderStatus:string)=>{
			return axios.put(`http://localhost:3232/Orders/updateDeliveryStatus/${orderId}`,null,{
				params:{
					orderStatus:orderStatus
				}
			})
		},
		getNumberOfUndeliveredOrders:()=>{
			return axios.get(`http://localhost:3232/Orders/getNumberOfUndeliveredOrders`).then(res=>checkResponseCode(res));
		}
	}
};



