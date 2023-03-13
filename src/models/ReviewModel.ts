class Review {
    id: number;
    user_email: string;
    date: Date;
    rating: number;
    book_id: number;
    review_description: string;

    constructor(id: number, user_email: string, date: Date, rating: number, book_id: number, review_description: string) {
        this.id = id;
        this.user_email = user_email;
        this.date = date;
        this.rating = rating;
        this.book_id = book_id;
        this.review_description = review_description
    }
}

export default Review