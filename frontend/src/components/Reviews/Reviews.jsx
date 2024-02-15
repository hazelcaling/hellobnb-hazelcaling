import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"
import { loadAllReviews } from "../../store/reviews";
import { FaStar } from "react-icons/fa";
import './Reviews.css'

export default function Reviews ({avgRating, numReviews}) {
    const dispatch = useDispatch();
    const reviews = useSelector(state => state.reviews)
    const reviewArr = Object.values(reviews)

    useEffect(() => {
        dispatch(loadAllReviews(reviews))
    }, [])

    const reviewList = reviewArr.map(review => (
        <div className="review-container" key={review.id}>
            <div className="review-heading">
                <div className="avgRating"><FaStar /> {avgRating} </div>
                <div className="numReviews">{numReviews} reviews</div>
            </div>
            <div className="firstName">{review.User.firstName}</div>
            <div className="date">{review.createdAt}</div>
            <div className="review-text">{review.review}</div>
        </div>
    ))




    return (
        <div className="reviews-container">
            {reviewList}
        </div>
    )
}
