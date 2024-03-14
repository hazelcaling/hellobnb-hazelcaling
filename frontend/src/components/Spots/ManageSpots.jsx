import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { loadSpots } from "../../store/spots"
import { Link, useNavigate } from "react-router-dom"
import { FaStar } from "react-icons/fa"
import DeleteSpotModal from "./DeleteSpotModal"
import "./ManageSpots.css"
import UpdateSpotButton from "./UpdateSpotButton"

export default function ManageSpots() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const spots = useSelector((state) => state.spots)
  const userId = useSelector((state) => state.session?.user?.id)
  const userSpots = Object.values(spots).filter(
    (spot) => spot?.ownerId === userId
  )

  // const sortedUserSpots = userSpots.sort(
  //   (a, b) => new Date(b?.createdAt) - new Date(a?.createdAt)
  // )

  useEffect(() => {
    dispatch(loadSpots())
  }, [dispatch])

  const createSpot = () => {
    navigate("/new-spot")
  }

  return (
    <div className="manage-spots-container">
      <h2 className="manage-spots-title">Manage Your Spots</h2>
      <button
        className="create-new-spot-button-manage-spots"
        onClick={createSpot}
      >
        Create a New Spot
      </button>
      <div className="spots-container-manageSpots">
        {userSpots?.map((spot) => (
          <div key={spot?.id}>
            <div
              className="spot-container"
              title={spot?.name}
            >
              <Link to={`${spot?.id}`}>
                <div className="spot-image-container">
                  {spot?.previewImage === "No image" ? (
                    <img
                      src="https://via.placeholder.com/300"
                      // style={{ height: "200px" }}
                      style={{ maxWidth: "100%", maxHeight: "100%" }}
                    />
                  ) : (
                    <img
                      src={spot?.previewImage}
                      alt={spot?.name}
                    />
                  )}
                </div>
                <div className="manage-spot-content">
                  <div className="location">
                    {spot?.city}, {spot?.state}
                  </div>
                  <div className="rating">
                    <FaStar />{" "}
                    {spot?.avgRating === null
                      ? "New"
                      : spot?.avgRating?.toFixed(1)}
                  </div>
                </div>
                <div className="price">{`$${spot?.price} night`}</div>
              </Link>
              <div className="manage-spots-update-delete-buttons-container">
                <UpdateSpotButton spotId={spot?.id} />
                <DeleteSpotModal spotId={spot?.id} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
