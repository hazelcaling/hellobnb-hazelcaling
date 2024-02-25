import { useDispatch } from "react-redux"
import { useModal } from '../../context/Modal';
import { reviewDeleted } from "../../store/reviews"
export default function DeleteReview ({ reviewId }) {
    const { closeModal } = useModal();
    const dispatch = useDispatch();

    const deleteReview = async () => {
        await dispatch(reviewDeleted(reviewId)).then(closeModal)
    }

    return (
        <div className="delete-review-container">
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to delete this review?</p>
            <button onClick={deleteReview}>Yes (Delete Review)</button>
            <button onClick={() => closeModal()}>No (Keep Review)</button>
        </div>
    )
}
