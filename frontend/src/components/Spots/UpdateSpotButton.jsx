
import { useNavigate } from "react-router";

export default function UpdateSpotButton ({ spotId }) {

    const navigate = useNavigate()

    const updateSpot = () => {
        navigate(`${spotId}/update`)
    }

    return (
        <button onClick={updateSpot}>Update</button>
    )

}
