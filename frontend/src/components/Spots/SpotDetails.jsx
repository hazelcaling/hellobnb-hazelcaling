import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getSpotById } from '../../store/spots'
import ReviewSummary from "../Reviews/ReviewSummary";
import Reviews from '../Reviews/Reviews'



export default function SpotDetails () {
    const dispatch = useDispatch();
    const { spotId } = useParams();
    const spot = useSelector(state => state.spots)
    const [smallImages, setSmallImages] = useState(null)
    const { name, city, state, country, description, numReviews, avgRating, price} = spot
    const fn = spot?.Owner?.firstName
    const ln = spot?.Owner?.lastName
    const isLoggedIn = useSelector(state => state.session.user !== null)
    const isOwner = useSelector(state => state.spots.ownerId === state.session.user?.id)

    useEffect(() => {
        dispatch(getSpotById(spotId))
        smallImages
    }, [spotId], [spot.SpotImages])

    const handleClick = () => {
        alert('Feature coming soon')
    }

    return (
        <div className="spotDetails-container">
            <div className="spotDetails-heading">
                <h2>{name}</h2>
                <h3>Location: {city}, {state}, {country}</h3>
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
                <p>Paragraph: {description}</p>
            </div>
            <div className="call-out-info-box">
                <div className="spotDetails-price">{price} night </div>
                <ReviewSummary avgRating={avgRating} numReviews={numReviews} spotId={spotId}/>
                <button onClick={handleClick} className="reserve-button">Reserve</button>
                <div>{numReviews === 0 && isLoggedIn && !isOwner} Be the first to post a review!</div>
                {1 === 0 ? <Reviews avgRating={avgRating} numReviews={numReviews} spotId={spotId}/> : null}
            </div>


        </div>
    )
}
