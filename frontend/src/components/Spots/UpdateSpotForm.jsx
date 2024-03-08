import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { getSpotById } from "../../store/spots"
import NewSpotForm from "./NewSpotForm"

export default function UpdateSpotForm() {
  const dispatch = useDispatch()
  const { spotId } = useParams()

  useEffect(() => {
    dispatch(getSpotById(spotId))
  }, [spotId, dispatch])
  const spot = useSelector((state) => state.spots)

  return <NewSpotForm spot={spot} />
}
