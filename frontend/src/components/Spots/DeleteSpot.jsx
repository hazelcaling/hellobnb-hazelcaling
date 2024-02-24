import { useDispatch } from 'react-redux'
import { useModal } from '../../context/Modal';
import './DeleteSpot.css'
import { spotDeleted } from '../../store/spots'

export default function DeleteSpot ({spotId}) {
    const { closeModal } = useModal();
    const dispatch = useDispatch()

    const deleteSpot = async () => {
        await dispatch(spotDeleted(spotId)).then(closeModal)
    }

    return (

        <div className="delete-spot-container">
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to remove this spot from the listings?</p>
            <button onClick={deleteSpot}>Yes (Delete Spot)</button>
            <button onClick={() => closeModal()}>No (Keep Spot)</button>
        </div>

    )

}
