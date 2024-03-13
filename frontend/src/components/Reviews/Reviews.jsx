import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { loadAllReviews } from "../../store/reviews"
import "./Reviews.css"
import ReviewSummary from "./ReviewSummary"
import ReviewDetails from "./ReviewDetails"

export default function Reviews({ spotId, isLoggedIn }) {
  const dispatch = useDispatch()
  const reviews = useSelector((state) => state.reviews)
  const reviewArr = Object.values(reviews)
  const sortedReviews = reviewArr.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  )

  useEffect(() => {
    dispatch(loadAllReviews(spotId))
  }, [dispatch, spotId])

  const reviewList = sortedReviews.map((review) => (
    <div
      className="review-container"
      key={review?.id}
    >
      <ReviewDetails
        review={review}
        isLoggedIn={isLoggedIn}
      />
    </div>
  ))

  return (
    <>
      <div className="reviews-container">
        <div className="review-heading">{1 === 0 && <ReviewSummary />}</div>
        {reviewList}
      </div>
    </>
  )
}
