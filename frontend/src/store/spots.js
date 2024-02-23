import { csrfFetch} from "./csrf"

// action types
const LOAD = 'spots/LOAD'
// const LOAD_SPOTS_CURRENT_USER = 'spots/loadAllCurrentUserSpots'
const LOAD_SPOT_DETAILS = 'spot/loadSpotDetails'
const ADD_SPOT = 'spot/addNew'
// const EDIT_SPOT = 'spot/edit'

// action creators
// const loadSpots = (spots) => {
//     return {
//         type: LOAD_SPOTS,
//         payload: spots
//     }
// }

const load = (spots) => {
    return {
        type: LOAD,
        spots
    }
}

// const loadSpotsCurrentUser = (spots) => {
//     return {
//         type: LOAD_SPOTS_CURRENT_USER,
//         payload: spots
//     }
// }


const loadSpotDetails = (spot) => {
    return {
        type: LOAD_SPOT_DETAILS,
        spot
    }
}

const addSpot = (spot) => {
    return {
        type: ADD_SPOT,
        payload: spot
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
        default:
            return state
    }
}

export default spotReducer
