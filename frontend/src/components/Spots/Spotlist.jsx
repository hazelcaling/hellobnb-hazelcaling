import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"
import { loadAllSpots } from "../../store/spots";
import './Spotlist.css'
import { Link, useParams } from "react-router-dom";
import { FaStar } from "react-icons/fa";

export default function SpotList () {
    const dispatch = useDispatch();
    const spots = useSelector(state => state.spots)
    const spotArr = Object.values(spots);

    const spotList = spotArr.map((spot) => (
            <Link to={`/spots/${spot.id}`}>
            <div key={spot.id} className="spot-container" title={spot.name}>
                    <div className="spot-image-container">
                        <img src={spot.previewImage} alt={spot.name} />
                    </div>
                    <div className="spot-details">
                        <div className="location">{spot.city}, {spot.state} </div>
                        <div className="rating"><FaStar /> {spot.avgRating === null && `New`}{spot.avgRating}</div>
                        <div className="price">{`$${spot.price} night`}</div>
                    </div>
            </div>
            </Link>
    ))

    useEffect(() => {
        dispatch(loadAllSpots())
    }, [dispatch])

    return (
        <div className="spots-container">
            {spotList}
        </div>
    )

}
