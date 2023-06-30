import BookModel from "./BookModel";

class ShelfCurrentloans{
    book:BookModel ;
    days_left:number;
    constructor(book:BookModel,daysLeft:number){
        this.book=book;
        this.days_left=daysLeft;
    } 
}
export default ShelfCurrentloans