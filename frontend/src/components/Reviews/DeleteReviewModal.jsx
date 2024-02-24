import OpenModalButton from "../OpenModalButton/OpenModalButton";
import DeleteReview from "./DeleteReview";

export default function DeleteReviewModal ({ reviewId }) {

    return (
        <div>
            <OpenModalButton
                buttonText='Delete'
                modalComponent={<DeleteReview reviewId={reviewId} />}
            />
        </div>
    )
}
