import { useDispatch } from "react-redux"
import { useModal } from "../../context/Modal"
import { reviewDeleted } from "../../store/reviews"
export default function DeleteReview({ reviewId, onDeleteReview }) {
  const { closeModal } = useModal()
  const dispatch = useDispatch()

  const deleteReview = async () => {
    onDeleteReview()
    await dispatch(reviewDeleted(reviewId)).then(closeModal)
  }

  return (
    <div className="delete-review-container">
      <h2>Confirm Delete</h2>
      <p>Are you sure you want to delete this review?</p>
      <button
        onClick={deleteReview}
        style={{ background: "red", color: "white" }}
      >
        Yes (Delete Review)
      </button>
      <button
        onClick={() => closeModal()}
        style={{ background: "gray", color: "white" }}
      >
        No (Keep Review)
      </button>
    </div>
  )
}
