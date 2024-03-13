import { useState } from "react"
import "./PostReview.css"
import { useDispatch } from "react-redux"
import { createReview } from "../../store/reviews"
import { useModal } from "../../context/Modal"
import React from "react"
export default function ReviewForm({ spotId }) {
  const { closeModal } = useModal()
  const dispatch = useDispatch()
  const [rating, setRating] = useState(0)
  const [textReview, setTextReview] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    const createdReview = await dispatch(
      createReview(spotId, {
        review: textReview,
        stars: rating,
      })
    ).then(closeModal)
    if (createdReview) {
      return createdReview
    }
  }

  return (
    <div className="review-form">
      <h2 className="review-form-title">How was your stay?</h2>
      <form
        onSubmit={handleSubmit}
        className="review-content"
      >
        <textarea
          cols="30"
          rows="10"
          placeholder="Leave your review here.."
          value={textReview}
          onChange={(e) => setTextReview(e.target.value)}
        />

        <div className="star-rating">
          {[...Array(5)].map((_, index) => (
            <React.Fragment key={index}>
              <label>
                <input
                  type="radio"
                  name="rating"
                  value={index + 1}
                  onClick={() => setRating(index + 1)}
                />
                <span className={index < rating ? "filled" : ""}>&#9733;</span>
              </label>
            </React.Fragment>
          ))}{" "}
          <span>
            <h4> Stars </h4>
          </span>
        </div>

        <button
          disabled={textReview.length < 10 || rating === 0}
          type="submit"
          className="submit-review-button"
        >
          Submit Your Review
        </button>
      </form>
    </div>
  )
}
