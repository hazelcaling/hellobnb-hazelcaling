import { csrfFetch} from "./csrf"

// action types
const LOAD = 'spots/LOAD'
const LOAD_SPOT_DETAILS = 'spot/loadSpotDetails'
const ADD_SPOT = 'spot/addNew'
const DELETE = 'spots/DELETE'

const load = (spots) => {
    return {
        type: LOAD,
        spots
    }
}

const loadSpotDetails = (spot) => {
    return {
        type: LOAD_SPOT_DETAILS,
        spot
    }
}

const addSpot = (spot) => {
    return {
        type: ADD_SPOT,
        spot
    }
}

export const deleteSpot = (spotId) => {
    return {
        type: DELETE,
        spotId
    }
}

// const editSpot = (spotId) => {
//     return {
//         type: EDIT_SPOT,
//         payload: spotId
//     }

// }

// thunk action creators

// export const updateSpot = (spotId) => async (dispatch) => {
//     const response = await fetc
// }
export const loadSpots = () => async dispatch => {
    const response = await fetch(`/api/spots`);

    if (response.ok) {
        const spots = await response.json();
        dispatch(load(spots))
        return spots
    }
}


export const getSpotById = (spotId) => async dispatch => {
    const response = await fetch(`/api/spots/${spotId}`);

    if (response.ok) {
        const spot = await response.json();
        dispatch(loadSpotDetails(spot))
        return spot
    }
}

export const createNewSpot = (spotData) => async dispatch => {
    const response = await csrfFetch('/api/spots', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(spotData)
    });

    if (response.ok) {
        const newSpot = await response.json();
        dispatch(addSpot(newSpot))
        return newSpot
    }
}

export const spotDeleted = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
        method: 'DELETE'
    });
    dispatch(deleteSpot(spotId))
    return response
}

// spots reducer
const initialState = {}

const spotReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD: {
            const newSpots = {}
            action.spots.Spots.forEach(spot => {
                newSpots[spot.id] = spot
            })

            return {
                ...newSpots
            }
        }
        case LOAD_SPOT_DETAILS:
            return {
                ...action.spot
            }
        case ADD_SPOT:
            return {
                ...state,
                [action.spot.id]: action.spot
            }
        case DELETE: {
            const newState = {...state}
            delete newState[action.spotId]
            return newState
        }

        default:
            return state
    }
}

export default spotReducer
