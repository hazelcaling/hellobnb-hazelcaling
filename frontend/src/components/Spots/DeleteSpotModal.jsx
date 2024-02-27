import OpenModalButton from '../Navigation/OpenModalButton'
import DeleteSpot from './DeleteSpot'
export default function DeleteSpotModal ( {spotId } ) {

    return (
        <div>
        <OpenModalButton
            buttonText='Delete'
            modalComponent={<DeleteSpot spotId={spotId}  />}
        />
        </div>
    )
}
