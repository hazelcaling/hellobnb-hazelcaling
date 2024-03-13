import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { getSpotById } from "../../store/spots"
import ReviewSummary from "../Reviews/ReviewSummary"
import Reviews from "../Reviews/Reviews"
import PostReviewModal from "../Reviews/PostReviewModal"
import "./SpotDetails.css"

export default function SpotDetails() {
  console.log("rendering")

  const dispatch = useDispatch()
  const { spotId } = useParams()

  const spot = useSelector((state) => state.spots)

  const fn = spot?.Owner?.firstName
  const ln = spot?.Owner?.lastName
  const isLoggedIn = useSelector((state) => state.session.user !== null)
  const isOwner = useSelector(
    (state) => state.spots?.ownerId === state.session.user?.id
  )

  const reviews = useSelector((state) => state.reviews)
  const reviewArr = Object.values(reviews)
  const hasPostedReview = reviewArr.filter(
    (review) => review.userId === spot.ownerId
  )
  const spotImages = useSelector((state) => state?.spots?.SpotImages)

  useEffect(() => {
    dispatch(getSpotById(spotId))
  }, [dispatch, spotId])

  const handleClick = () => {
    alert("Feature coming soon")
  }

  // useEffect(() => {
  //   dispatch(loadAllReviews(spotId))
  // }, [spotId, dispatch])

  return (
    <div className="spotDetails-container">
      <div className="spotDetails-heading">
        <h2>{spot?.name}</h2>
        <h3>
          {spot?.city}, {spot?.state}, {spot?.country}
        </h3>
      </div>
      <div className="parent-images">
        <div className="child large-image">
          {spotImages ? (
            <img src={Object.values(spotImages)[0]?.url} />
          ) : (
            <img src="https://via.placeholder.com/150" />
          )}
        </div>
        <div className="child small-images">
          {spotImages
            ? Object.values(spotImages)
                .slice(0, 4)
                .map((image, index) => (
                  <div
                    key={index}
                    className="smallbox"
                  >
                    <img
                      src={image?.url}
                      alt={`Small Image ${index}`}
                    />
                  </div>
                ))
            : "No Image"}
        </div>
      </div>
      <div className="spotDetails-body">
        <div className="owner-description">
          <h4>
            Hosted by: {fn} {ln}
          </h4>
          <p>{spot?.description}</p>
        </div>
        <div className="call-out-info-box">
          <div className="left">${spot?.price} night </div>
          <div className="right">
            <ReviewSummary
              avgRating={spot?.avgRating}
              numReviews={spot?.numReviews}
              spotId={spotId}
            />
          </div>
          <div className="bottom">
            <button
              onClick={handleClick}
              className="reserve-button"
            >
              Reserve
            </button>
          </div>
        </div>
      </div>
      <div className="spot-details-reviews">
        <ReviewSummary
          avgRating={spot?.avgRating}
          numReviews={spot?.numReviews}
        />
        {isLoggedIn && hasPostedReview.length === 0 && !isOwner && (
          <PostReviewModal spotId={spotId} />
        )}
        <div>
          {spot?.numReviews === 0 &&
            isLoggedIn &&
            !isOwner &&
            "Be the first to post a review!"}{" "}
        </div>
        {
          <Reviews
            avgRating={spot.avgRating}
            numReviews={spot.numReviews}
            spotId={spotId}
            isLoggedIn={isLoggedIn}
            reviews={reviews}
          />
        }
      </div>
    </div>
  )
}
