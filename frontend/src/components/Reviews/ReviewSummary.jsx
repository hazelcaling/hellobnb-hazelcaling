import { FaStar } from "react-icons/fa";
import { FaCircle } from "react-icons/fa";

export default function ReviewSummary ({avgRating, numReviews}) {
    return (
        <div>
            <span><FaStar /> {avgRating} {numReviews !== 0 && <FaCircle />} </span>
            <span>{numReviews === 1 ? (` ${numReviews} Review`) : numReviews > 1 ? (` ${numReviews} Reviews`) : 'New'}</span>
        </div>
    )
}
