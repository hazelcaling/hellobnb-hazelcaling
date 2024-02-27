
import { FaStar } from "react-icons/fa";
import { FaCircle } from "react-icons/fa";

export default function ReviewSummary ({avgRating, numReviews}) {

    return (
        <>
            <span><FaStar /> {avgRating} {numReviews !== 0 && <FaCircle style={{fontSize: '5px'}}/>} {numReviews === 1 ? (` ${numReviews} Review`) : numReviews > 1 ? (` ${numReviews} Reviews`) : 'New'} </span>
            {/* <span></span> */}
        </>
    )
}
