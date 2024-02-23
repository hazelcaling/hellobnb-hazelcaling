import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"
import { loadAllReviews } from "../../store/reviews";
import './Reviews.css'
import ReviewSummary from './ReviewSummary'

export default function Reviews ({avgRating, numReviews, spotId }) {
    const dispatch = useDispatch();
    const reviews = useSelector(state => state.reviews)
    const reviewArr = Object.values(reviews)
    const sortedReviews = reviewArr.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt))
    const formatDate = (dateString) => {
        const date = new Date(dateString)
        const options = { month: 'long', year: 'numeric'};
        return date.toLocaleDateString('en-US', options)
    }

    useEffect(() => {
        dispatch(loadAllReviews(spotId))
    }, [dispatch])

    const reviewList = sortedReviews.map(review => (
        <div className="review-container" key={review.id}>
            <div className="firstName">{review.User.firstName}</div>
            <div className="date">{formatDate(review.createdAt)}</div>
            <div className="review-text">{review.review}</div>
        </div>
    ))

    return (
        <div className="reviews-container">
            <div className="review-heading">
                <ReviewSummary avgRating={avgRating} numReviews={numReviews} spotId={spotId} />
            </div>
            {reviewList}
        </div>
    )
}
