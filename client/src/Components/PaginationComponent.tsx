import React,{useState,useEffect} from "react";
import {Pagination} from "react-bootstrap";

const numberOfVisiblePages=20;

function PaginationComponent(props:any){
    //state to hold an object contains an array of the pages need to show,the first page in the block to show and the last page in the block to show
    const [pageNumbers,updatePageNumbers]=useState<{pages:number[],firstPageToShow:number,lastPageToShow:number}>({
        pages:[],
        firstPageToShow:1,
        lastPageToShow:numberOfVisiblePages
    });

    /**
     * use effect for creating an array of pages to show and update the state where we show pages 1 to
     * the minimum between number of visible pages or length of pages array
     */
    useEffect(()=>{
        let numberOfPages=props.numberOfPages;
        let pagesNumbers=[];
        for(let i=1;i<=numberOfPages;i++){//create array of pages
            pagesNumbers.push(i);
        }
        updatePageNumbers({
            pages: pagesNumbers,
            firstPageToShow:1,
            lastPageToShow:numberOfVisiblePages
        })
    },[props.numberOfPages]);

    /**
     * use effect for changing current page number
     */
    useEffect(()=>{
        let firstPage,lastPage;
        let pageNumber=props.currentPage;
        if(pageNumber-pageNumbers.lastPageToShow===1){//if clicked on next when was in last visible page
            firstPage=pageNumber;
            lastPage=pageNumbers.lastPageToShow+numberOfVisiblePages;
        }
        else if(pageNumbers.firstPageToShow-pageNumber===1){// if clicked on previous page when was in first visible page
            firstPage=pageNumbers.firstPageToShow-numberOfVisiblePages;
            lastPage=pageNumber;
        }
        else if(pageNumber===1 && pageNumbers.firstPageToShow!==1){//if we clicked on first page and we show not the first block of pages
            firstPage=1;
            lastPage=numberOfVisiblePages;
        }
        // if the user want to go to last page and we aren't showing the last block of pages
        else if(pageNumber===pageNumbers.pages.length && pageNumbers.lastPageToShow!==pageNumbers.pages.length){
            firstPage=pageNumber-numberOfVisiblePages+1;
            lastPage=pageNumber;
        }
        else{//don't change the block of pages to show
            firstPage=pageNumbers.firstPageToShow;
            lastPage=pageNumbers.lastPageToShow;
        }
        updatePageNumbers({
            pages:pageNumbers.pages,
            firstPageToShow:firstPage,
            lastPageToShow:lastPage
        });
    },[props.currentPage])

    /**
     * This function checks if the page number the user clicked is valid and if yes, tell parent components
     * that the page has been updated.
     * @param pageNumber :number, new page number the user wants to go to
     */
    function changePage(pageNumber:number){
        if(pageNumber>props.numberOfPages || pageNumber<1 || props.currentPage===pageNumber){
            return;
        }
        window.scrollTo(0,0);
        props.updateOrdersInPage(pageNumber);
    }

    return(
        <Pagination>
            <Pagination.Item activeLabel=""  onClick={()=>changePage(1)} >{"<<"}</Pagination.Item>
            <Pagination.Item activeLabel=""  onClick={()=>changePage(props.currentPage-1)}>{"<"}</Pagination.Item>
            {
                pageNumbers.pages.slice(pageNumbers.firstPageToShow-1,pageNumbers.lastPageToShow).map(page=>(
                    <Pagination.Item key={page} active={page===props.currentPage} activeLabel="" onClick={()=>changePage(page)}>{page}</Pagination.Item>
                ))
            }
            <Pagination.Item activeLabel="" onClick={()=>changePage(props.currentPage+1)}>{">"}</Pagination.Item>
            <Pagination.Item activeLabel="" onClick={()=>changePage(pageNumbers.pages.length)}>{">>"}</Pagination.Item>
        </Pagination>
    )
}

export default PaginationComponent;