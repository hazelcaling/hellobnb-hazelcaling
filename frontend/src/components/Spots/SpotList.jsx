import { FaStar } from "react-icons/fa"
import { Link } from "react-router-dom"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { loadSpots } from "../../store/spots"
import "./Spotlist.css"

export default function SpotList() {
  const dispatch = useDispatch()
  const spots = useSelector((state) => state.spots)
  const spotList = Object.values(spots)

  useEffect(() => {
    dispatch(loadSpots())
  }, [dispatch])

  const sortedSpots = spotList.sort(
    (a, b) => new Date(b?.createdAt) - new Date(a?.createdAt)
  )

  const sortedSpotList = sortedSpots.map((spot) => (
    <div
      key={spot?.id}
      className="spot-container-spotlist"
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
        <div>
          <div className="location">
            {spot?.city}, {spot?.state}
          </div>
          <div className="rating">
            <FaStar /> {spot?.avgRating === null ? "New" : spot?.avgRating}
          </div>
          <div className="price">{`$${spot?.price} night`}</div>
        </div>
      </Link>
    </div>
  ))

  return <div className="spots-container-spotlist">{sortedSpotList}</div>
}
