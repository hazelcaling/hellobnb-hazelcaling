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
    // const [showUserSpots, setShowUserSpots] = useState(false)

    // const manageSpots = () => {
    //     setShowUserSpots(true)
    // }

    useEffect(() => {
        dispatch(loadAllSpots())
    }, [])

    return (
        <>
            {/* {showUserSpots ? (<><h2>Manage Spots</h2><LoadSpots allSpots={allSpots.filter(spot => spot.ownerId === userId)} userId={userId} /></>): (<LoadSpots allSpots={allSpots} userId={userId} />)}
            <button onClick={manageSpots}>ManageSpots</button> */}
            <LoadSpots allSpots={allSpots} userId={userId} />
        </>

    )
}
