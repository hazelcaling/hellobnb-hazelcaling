import { FaStar } from "react-icons/fa"

export default function ReviewSummary({ avgRating, numReviews }) {
  return (
    <>
      <span>
        <FaStar /> {avgRating} {numReviews !== 0 && "\u00B7"}
        {numReviews === 1
          ? ` ${numReviews} Review`
          : numReviews > 1
          ? ` ${numReviews} Reviews`
          : "New"}
      </span>
    </>
  )
}
