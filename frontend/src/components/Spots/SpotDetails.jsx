import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getSpotById } from '../../store/spots'
import { FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import { loadAllReviews } from "../../store/reviews";
import Reviews from "../Reviews/Reviews";

export default function SpotDetails () {
    const dispatch = useDispatch();
    const { spotId } = useParams();
    const spot = useSelector(state => state.spots)
    const [smallImages, setSmallImages] = useState(null)
    const { name, city, state, country, description, numReviews, avgRating, price} = spot
    const fn = spot?.Owner?.firstName
    const ln = spot?.Owner?.lastName

    useEffect(() => {
        dispatch(getSpotById(spotId))
        smallImages
    }, [spotId], [spot.SpotImages])

    const handleClick = () => {
        alert('Feature coming soon')
    }

    const handleReviewClick = () => {
        dispatch(loadAllReviews(spotId))
    }

    return (
        <div>
            <h2>{name}</h2>
            <h3>Location: {city}, {state}, {country}</h3>
            <div className="images-container">
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
            <span>Hosted by: {fn} {ln}</span>
            <p>Paragraph: {description}</p>
            <div className="call-out-info-box">
                <span>{price} night </span>
                <span><FaStar /> {avgRating}</span>
                <span>{numReviews} <Link to='reviews' onClick={handleReviewClick}>reviews</Link></span>
            </div>
            <button onClick={handleClick} className="reserve-button">Reserve</button>
            <Reviews avgRating={avgRating} numReviews={numReviews}/>
        </div>
    )
}
