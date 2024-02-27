import OpenModalButton from '../Navigation/OpenModalButton'
import PostReview from './PostReview'
import { useSelector } from 'react-redux/es/hooks/useSelector'
export default function PostReviewModal ( {spotId} ) {
    const reviews = useSelector(state => state.reviews)
    const hasPostedReview = useSelector(state => state.session.user.id) === +Object.values(reviews).map(review => review.userId)

    return (
        <div>
            {!hasPostedReview && <OpenModalButton
            buttonText='Post Your Review'
            modalComponent={<PostReview spotId={spotId}/>}/>}
        </div>
    )
}
