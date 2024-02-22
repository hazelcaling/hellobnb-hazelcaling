import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { loadAllSpots } from "../../store/spots";
import './Spotlist.css'
import  LoadSpots  from "./LoadSpots";

export default function Home () {

    const dispatch = useDispatch();
    const spots = useSelector(state => state.spots)
    const userId = useSelector(state => state.session?.user?.id)
    const allSpots = Object.values(spots);

    useEffect(() => {
        dispatch(loadAllSpots())
    }, [dispatch])

    return (
        <>
            {<LoadSpots allSpots={allSpots.filter(spot => spot.ownerId === userId)}/>}
        </>

    )
}
