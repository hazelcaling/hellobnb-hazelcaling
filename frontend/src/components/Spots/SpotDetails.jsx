import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getSpotById } from '../../store/spots'

export default function SpotDetails () {
    const { spotId } = useParams();

    const dispatch = useDispatch();
    const spots = useSelector(state => state.spots)
    const { name, city, state, country, description } = spots[spotId]

    useEffect(() => {
        dispatch(getSpotById(spotId))
    }, [spotId])

    return (
        <div>
            <div>Spot Name: {name}, City: {city}, State: {state}, Country: {country}</div>
            <div>Description: {description}</div>
        </div>
    )
}
