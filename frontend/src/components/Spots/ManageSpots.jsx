import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"
import { loadSpots } from "../../store/spots";
import './ManageSpots.css'
import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";
export default function ManageSpots ( ) {

    const dispatch = useDispatch();
    const spots = useSelector(state => state.spots)
    const userId = useSelector(state => state.session?.user?.id)
    const userSpots= Object.values(spots).filter(spot => spot?.ownerId === userId);

    useEffect(() => {
        dispatch(loadSpots())
    }, [userId])

    return (
        <div className="manage-spots-container">
            <h2 className="manage-spots-title">Manage Your Spots</h2>
            <button className="create-new-spot-button-manage-spots">Create a New Spot</button>
             <div className="spots-container">
            {userSpots?.map((spot) => (
                <div key={spot?.id}>
                <div className="spot-container"  title={spot?.name}>
                    <Link to={`${spot?.id}`}>
                        <div className="spot-image-container">
                            {spot?.previewImage === 'No image' ? (<p>No Image</p>) : (<img src={spot?.previewImage} alt={spot?.name} />)}
                        </div>
                        <div className="manage-spot-content">
                            <div className="location">{spot?.city}, {spot?.state}</div>
                            <div className="rating"><FaStar /> {spot?.avgRating === null ? 'New' : spot?.avgRating}</div>
                            <div className="price">{`$${spot?.price} night`}</div>
                        </div>
                    </Link>
                </div>
                <div className="manage-spots-update-delete-buttons-container"><button className="manage-spot-update-button">Update</button><button className="manage-spot-delete-button">Delete</button></div>
                </div>
            ))}
        </div>
        </div>
    )
}
