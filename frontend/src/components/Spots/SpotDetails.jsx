import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getSpotById } from '../../store/spots'
import ReviewSummary from "../Reviews/ReviewSummary";
import Reviews from '../Reviews/Reviews'
import PostReviewModal from "../Reviews/PostReviewModal";
import { loadAllReviews } from "../../store/reviews";
import './SpotDetails.css'


// export default function SpotDetails () {
//     const dispatch = useDispatch()
//     const { spotId } = useParams();
//     const spot = useSelector(state => state.spots)

//     useEffect(() => {
//         dispatch(getSpotById(spotId))
//     }, [spotId, dispatch])

//     const { name, city, state, country, description, price } = spot
//     return (
//         <div className="spot-container">
//             <h2>{name}</h2>
//             <span>{city}, {state}, {country}</span>
//             <div className="large-image">Large Image</div>
//             <div className="small-images">Small Images</div>
//             <div>Hosted by {spot.Owner.firstName} {spot.Owner.lastName}</div>
//             <div>{description}</div>
//             <div>
//                 <span>{`$${price} night`} {<ReviewSummary spot={spot}/>}</span>
//                 <button>Reserve</button>
//             </div>
//             <div>
//                 <span><ReviewSummary spot={spot}/></span>
//                 <Reviews spot={spot}/>
//             </div>
//         </div>
//     )
// }

export default function SpotDetails () {
    const dispatch = useDispatch();
    const { spotId } = useParams();
    const spot = useSelector(state => state.spots)

    const fn = spot?.Owner?.firstName
    const ln = spot?.Owner?.lastName
    const isLoggedIn = useSelector(state => state.session.user !== null)
    const userId = useSelector(state => state.session?.id)
    const isOwner = useSelector(state => state.spots?.ownerId === state.session.user?.id)
    const isReviewOwner = useSelector(state => state.reviews.userId === userId)
    const reviews = useSelector(state => state.reviews)
    const reviewArr = Object.values(reviews)


    useEffect(() => {
        dispatch(getSpotById(spotId))

    }, [dispatch, spotId])

    const handleClick = () => {
        alert('Feature coming soon')
    }

    useEffect(() => {
        dispatch(loadAllReviews(spotId))
    }, [spotId, dispatch])


    const hasPostedReview = reviewArr.filter(review => review.userId === spot.ownerId)
    console.log(spot.SpotImages)


    return (
        <div className="spotDetails-container">
            <div className="spotDetails-heading">
                <h2>{spot?.name}</h2>
                <h3>{spot?.city}, {spot?.state}, {spot?.country}</h3>
            </div>
            <div className="spotDetails-images-container" >
                <div className="large-image">{spot.SpotImages && spot.SpotImages.length > 0 && <img src={spot.SpotImages[0]}/>}</div>
                <div className="small-images">
                {spot.SpotImages && spot.SpotImages.length > 0 && spot.SpotImages.map((image, index) => (
                    <img
                        key={index}
                        src={image}
                        alt={`Small Image ${index}`}
                    />
                ))}
                </div>
            </div>
            <div className="spotDetails-body">
                <div className="owner-description">
                <h4>Hosted by: {fn} {ln}</h4>
                <p>{spot?.description}</p>
                </div>
            <div className="call-out-info-box">
                <div className="left">${spot?.price} night </div>
                <div className="right"><ReviewSummary avgRating={spot?.avgRating} numReviews={spot?.numReviews} spotId={spotId}/></div>
                <div className="bottom"><button onClick={handleClick} className="reserve-button">Reserve</button></div>
            </div>
            </div>
                <div>{spot?.numReviews === 0 && isLoggedIn && !isOwner && 'Be the first to post a review!'} </div>
                <div className="spot-details-reviews">
                    <ReviewSummary avgRating={spot?.avgRating} numReviews={spot?.numReviews} spotId={spotId}/>
                    {isLoggedIn && hasPostedReview.length === 0 && !isOwner && <PostReviewModal spotId={spotId}/>}
                    {<Reviews avgRating={spot.avgRating} numReviews={spot.numReviews} spotId={spotId} spot={spot} isLoggedIn={isLoggedIn} isReviewOwner={isReviewOwner} />}
                </div>


        </div>
    )
}
