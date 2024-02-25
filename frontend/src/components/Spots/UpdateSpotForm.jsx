import NewSpotForm from "./NewSpotForm";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useParams } from "react-router";
import {getSpotById } from '../../store/spots'

export default function UpdateSpotForm () {
    const dispatch = useDispatch()
    const {spotId} = useParams()
    const spot = useSelector(state => state.spots)


    useEffect(() => {
        dispatch(getSpotById(spotId))
    }, [dispatch, spotId])

    // useEffect(() => {
    //     dispatch(updatedSpot(spotId))
    // })
    console.log('Rendering')
    console.log(spot)
    console.log('Rendering')

    return (
        <NewSpotForm spotDetails={spot}/>
    )
}
