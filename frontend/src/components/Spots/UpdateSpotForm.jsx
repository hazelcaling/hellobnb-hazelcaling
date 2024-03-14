import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { getSpotById } from "../../store/spots"
import SpotForm from "./SpotForm"

export default function UpdateSpotForm() {
  const dispatch = useDispatch()
  const { spotId } = useParams()
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    dispatch(getSpotById(spotId)).then(() => setIsLoaded(true))
  }, [spotId, dispatch])
  const spot = useSelector((state) => state.spots)
  const images = spot?.SpotImages

  return (
    <>
      {isLoaded && (
        <SpotForm
          spot={spot}
          images={images}
        />
      )}
    </>
  )
}
