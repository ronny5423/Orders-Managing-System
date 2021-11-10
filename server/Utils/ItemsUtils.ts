const itemsModule=require("../products.json");
const items=itemsModule.products;

/**
 * This function checks if a query is in item names
 * @param itemsIdAndQuantity :any, represents an array holds objects that consist item name and quantity
 * of the item in order
 * @param searchQuery :string, search query to check
 */
export function checkIfItemsMatchToQuery(itemsIdAndQuantity:any,searchQuery:string){
    for(let item of itemsIdAndQuantity){
        let id=item.id;
        if(items[id].name.toLowerCase().includes(searchQuery.toLowerCase())){
            return true;
        }
    }
    return false;
}

/**
 * This function receives an array of objects holds item id and quantity and returns an array holds items objects
 * @param itemsIdAndQuantity :any, an array of objects holds item id and quantity
 */
export function getItems(itemsIdAndQuantity:any){
    let itemsArr=[];
    for(let itemIdAndQuantity of itemsIdAndQuantity){
        let item=items[itemIdAndQuantity.id];
        itemsArr.push({
            id: itemIdAndQuantity.id,
            name: item.name,
            price: item.price,
            image: item.images.original,
            quantity:itemIdAndQuantity.quantity
        });
    }
    return itemsArr;
}

