import DeleteReviewModal from "./DeleteReviewModal"
import { useSelector } from "react-redux"
export default function ReviewDetails({ review, isLoggedIn }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const options = { month: "long", year: "numeric" }
    return date.toLocaleDateString("en-US", options)
  }
  const userId = useSelector((state) => state.session?.user.id)
  const isReviewOwner = review.userId === userId

  return (
    <>
      <div className="firstName">{review?.User?.firstName}</div>
      <div className="date">{formatDate(review.createdAt)}</div>
      <div className="review-text">{review.review}</div>
      {isLoggedIn && isReviewOwner && (
        <div>
          <DeleteReviewModal reviewId={review.id} />
        </div>
      )}
    </>
  )
}
