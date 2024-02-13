import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"
import { loadAllSpots } from "../../store/spots";
import './Spotlist.css'
import { Link } from "react-router-dom";
export default function SpotList () {
    const dispatch = useDispatch();
    const spots = useSelector(state => state.spots)
    const spotArr = Object.values(spots)

    // console.log('line 11', spots)
    const spotList = spotArr.map((spot) => (
        <div key={spot.id} className="spots-container">
            <Link to={`/spots/${spot.id}`}>
                <div className="spot-container" title={spot.name}>
                    <img src={spot.previewImage} alt={spot.name} />
                </div>
                <div >
                    <div>{spot.city}, {spot.state}</div>
                    <div>star rating: {spot.avgRating === null && `New`}{spot.avgRating}</div>
                    <div>{`$${spot.price} per night`}</div>
                </div>
            </Link>
        </div>
    ))

    useEffect(() => {
        dispatch(loadAllSpots())
    }, [])

    return (
        <div className="spots-container">
            {/* <h2>All spots</h2> */}
            {spotList}
        </div>
    )
}
