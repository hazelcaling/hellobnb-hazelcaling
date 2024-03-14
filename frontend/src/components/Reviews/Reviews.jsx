import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { loadAllReviews } from "../../store/reviews"
import "./Reviews.css"
import ReviewDetails from "./ReviewDetails"
import { getSpotById } from "../../store/spots"

export default function Reviews({ spotId, isLoggedIn }) {
  const dispatch = useDispatch()
  const reviews = useSelector((state) => state.reviews)
  const [isLoaded, setIsLoaded] = useState(false)
  const reviewArr = Object.values(reviews)
  const sortedReviews = reviewArr.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  )

  const [numReviews, setNumReviews] = useState(0)

  const handleDeleteReview = () => {
    setNumReviews(numReviews - 1)
  }

  useEffect(() => {
    dispatch(getSpotById(spotId)).then((response) => {
      setNumReviews(response.numReviews)
    })
  }, [dispatch, numReviews, spotId])

  useEffect(() => {
    dispatch(loadAllReviews(spotId)).then(() => setIsLoaded(true))
  }, [dispatch, spotId])

  const reviewList = sortedReviews.map((review) => (
    <div
      className="review-container"
      key={review?.id}
    >
      <ReviewDetails
        review={review}
        isLoggedIn={isLoggedIn}
        onDeleteReview={handleDeleteReview}
      />
    </div>
  ))

  return (
    <>
      {isLoaded && (
        <div className="reviews-container">
          {/* <div className="review-heading">{1 === 0 && <ReviewSummary />}</div> */}
          {reviewList}
        </div>
      )}
    </>
  )
}
