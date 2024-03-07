import { useEffect } from "react"
import NewSpotForm from "./NewSpotForm"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { getSpotById } from "../../store/spots"

export default function UpdateSpotForm() {
  const { spotId } = useParams()
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getSpotById(spotId))
  }, [spotId, dispatch])
  const spot = useSelector((state) => state.spots)

  return <NewSpotForm spot={spot} />
}
