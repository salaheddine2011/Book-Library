class AddBookRequest{

     title: string; // without private 
     author:string;
     description:string;
     category:string;
     copies: number;
     img ? : string;// img ? 

    constructor(title:string, description:string,author:string,category:string,copies:number){
                this.author=author;
                this.category=category;
                this.description=description;
                this.copies=copies;
                // this.img=img;
                this.title=title;
    }
}
export default AddBookRequest;