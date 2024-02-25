import { FaStar } from "react-icons/fa";
import { Link } from 'react-router-dom';

export default function LoadSpots ({spots}) {
    const spotList = spots.map((spot) => (
        <div key={spot?.id} className="spot-container">
            <Link to={`${spot?.id}`}>
            <div className="spot-image-container">
                {spot?.previewImage === 'No image' ? (<p>No Image</p>) : (<img src={spot?.previewImage} style={{maxWidth: '100%', maxHeight: '100%'}} alt={spot?.name} />)}
            </div>
            <div>
                <div className="location">{spot?.city}, {spot?.state}</div>
                <div className="rating"><FaStar /> {spot?.avgRating === null ? 'New' : spot?.avgRating}</div>
                <div className="price">{`$${spot?.price} night`}</div>
            </div>
            </Link>
        </div>
    ))

    return (<div className="spots-container">{spotList}</div>)
}
