import OpenModalButton from '../OpenModalButton/OpenModalButton'
import PostReview from './PostReview'
export default function PostReviewModal ( {spotId} ) {

    return (
        <div>
        <OpenModalButton
            buttonText='Post Your Review'
            modalComponent={<PostReview spotId={spotId}/>}
        />
        </div>
    )
}
