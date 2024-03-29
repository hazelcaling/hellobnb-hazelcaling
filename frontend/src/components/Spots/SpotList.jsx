import { FaStar } from "react-icons/fa"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { loadSpots } from "../../store/spots"
import "./Spotlist.css"

export default function SpotList() {
  // const spots = useSelector((state) => state.spots)
  const dispatch = useDispatch()
  const [spots, setSpots] = useState({})
  const [isLoaded, setIsLoaded] = useState(false)

  // const sortedSpotList = sortedSpots.map((spot) => (
  //   <div
  //     key={spot?.id}
  //     className="spot-container-spotlist"
  //     title={spot?.name}
  //   >
  //     <Link to={`${spot?.id}`}>
  //       <div className="spot-image-container-spotlist">
  //         {spot?.previewImage !== "No image" ? (
  //           <img
  //             src={spot?.previewImage}
  //             style={{ maxWidth: "100%", maxHeight: "100%" }}
  //             alt={spot?.name}
  //           />
  //         ) : (
  //           <img
  //             src="https://via.placeholder.com/300"
  //             style={{ maxWidth: "100%", maxHeight: "100%" }}
  //           />
  //         )}
  //       </div>
  //       <div className="details-spotlist">
  //         <div className="location-spotlist">
  //           {spot?.city}, {spot?.state}
  //         </div>
  //         <div className="rating-spotlist">
  //           <FaStar />{" "}
  //           {spot?.avgRating === null ? "New" : spot?.avgRating?.toFixed(1)}
  //         </div>
  //       </div>
  //       <div className="price-spotlist">{`$${spot?.price} night`}</div>
  //     </Link>
  //   </div>
  // ))

  useEffect(() => {
    dispatch(loadSpots()).then((response) => setSpots(response.Spots))
    setIsLoaded(true)
  }, [dispatch])
  const spotList = Object.values(spots)
  console.log("line 53", spots)
  const sortedSpots = spotList.sort(
    (a, b) => new Date(b?.createdAt) - new Date(a?.createdAt)
  )

  // return <div className="spots-container-spotlist">{sortedSpotList}</div>
  return (
    <>
      {isLoaded && (
        <div className="spots-container-spotlist">
          {sortedSpots.map((spot) => (
            <div
              key={spot?.id}
              className="spot-container-spotlist"
              title={spot?.name}
            >
              <Link to={`${spot?.id}`}>
                <div className="spot-image-container-spotlist">
                  {spot?.previewImage !== "No image" ? (
                    <img
                      src={spot?.previewImage}
                      style={{ maxWidth: "100%", maxHeight: "100%" }}
                      alt={spot?.name}
                    />
                  ) : (
                    <img
                      src="https://via.placeholder.com/300"
                      style={{ maxWidth: "100%", maxHeight: "100%" }}
                    />
                  )}
                </div>
                <div className="details-spotlist">
                  <div className="location-spotlist">
                    {spot?.city}, {spot?.state}
                  </div>
                  <div className="rating-spotlist">
                    <FaStar />{" "}
                    {spot?.avgRating === null
                      ? "New"
                      : spot?.avgRating?.toFixed(1)}
                  </div>
                </div>
                <div className="price-spotlist">{`$${spot?.price} night`}</div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
