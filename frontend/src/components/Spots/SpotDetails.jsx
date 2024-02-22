import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getSpotById } from '../../store/spots'
import ReviewSummary from "../Reviews/ReviewSummary";
import Reviews from '../Reviews/Reviews'
import PostReviewModal from "../Reviews/PostReviewModal";
import { loadAllReviews } from "../../store/reviews";
import './SpotDetails.css'


export default function SpotDetails () {
    const dispatch = useDispatch();
    const { spotId } = useParams();
    const spot = useSelector(state => state.spots)
    const [smallImages, setSmallImages] = useState(null)
    const fn = spot?.Owner?.firstName
    const ln = spot?.Owner?.lastName
    const isLoggedIn = useSelector(state => state.session.user !== null)
    const isOwner = useSelector(state => state.spots?.ownerId === state.session.user?.id)
    const reviews = useSelector(state => state.reviews)
    const reviewArr = Object.values(reviews)

    useEffect(() => {
        dispatch(getSpotById(spotId))
        smallImages
    }, [dispatch, smallImages])

    const handleClick = () => {
        alert('Feature coming soon')
    }

    useEffect(() => {
        dispatch(loadAllReviews(spotId))
    }, [spotId])

    const hasPostedReview = reviewArr.filter(review => review.userId === spot.ownerId)


    return (
        <div className="spotDetails-container">
            <div className="spotDetails-heading">
                <h2>{spot?.name}</h2>
                <h3>Location: {spot?.city}, {spot?.state}, {spot?.country}</h3>
            </div>
            <div className="spotDetails-images-container">
                <img src={spot.previewImage} alt="Large Image" className="large-image"/>
                {spot.SpotImages && spot.SpotImages.length > 0 && spot.SpotImages.map((image, index) => (
                    <img
                        key={index}
                        src={image.url}
                        alt={`Small Image ${index}`}
                        onClick={() => {
                            setSmallImages(index)
                        }}
                    />
                ))}
            </div>
            <div className="spotDetails-body">
                <span>Hosted by: {fn} {ln}</span>
                <p>Paragraph: {spot?.description}</p>
            </div>
            <div className="call-out-info-box">
                <div className="spotDetails-price">${spot?.price} night </div>
                <ReviewSummary avgRating={spot?.avgRating} numReviews={spot?.numReviews} spotId={spotId}/>
                <button onClick={handleClick} className="reserve-button">Reserve</button>
                <div>{spot?.numReviews === 0 && isLoggedIn && !isOwner && 'Be the first to post a review!'} </div>
                {isLoggedIn && hasPostedReview.length === 0 && !isOwner && <PostReviewModal spotId={spotId}/>}
                {<Reviews avgRating={spot.avgRating} numReviews={spot.numReviews} spotId={spotId} spot={spot}/>}
            </div>
        </div>
    )
}
