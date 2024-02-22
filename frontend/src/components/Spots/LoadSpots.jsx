import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";


export default function LoadSpots ({allSpots}) {

    return (
        // <div className="spots-container">
        // {allSpots?.map((spot) => {
        //     const { id, name, previewImage, city, state, avgRating, price } = spot
        //     return (
        //         <div className="spot-container" key={id} title={name} >
        //             <Link to={`spots/${id}`}>
        //                 <div className="spot-image-container">
        //                     {previewImage === 'No image' ? (<p>No Image</p>) : (<img src={previewImage} alt={name} />)}
        //                 </div>
        //                 <div className="spot-details">
        //                     <div className="location">{city}, {state} </div>
        //                     <div className="rating"><FaStar /> {avgRating === null ? 'New' : avgRating}</div>
        //                     <div className="price">{`$${price} night`}</div>
        //                 </div>
        //             </Link>
        //         </div>)
        //     })}
        //     </div>
        <div className="spots-container">
            {allSpots?.map((spot) => (
                <div className="spot-container" key={spot?.id} title={spot?.name}>
                    <Link to={`${spot?.id}`}>
                        <div className="spot-image-container">
                            {spot?.previewImage === 'No image' ? (<p>No Image</p>) : (<img src={spot?.previewImage} alt={spot?.name} />)}
                        </div>
                        <div>
                            <div className="location">{spot?.city}, {spot?.state}</div>
                            <div className="rating"><FaStar /> {spot?.avgRating === null ? 'New' : spot?.avgRating}</div>
                            <div className="price">{`$${spot?.price} night`}</div>
                        </div>
                    </Link>
                </div>
            ))}
        </div>
    )
}
