import { csrfFetch} from "./csrf"

// action types
const LOAD_SPOTS = 'spots/loadAll'
// const LOAD_SPOTS_CURRENT_USER = 'spots/loadAllCurrentUserSpots'
const LOAD_SPOT_DETAILS = 'spot/loadSpotDetails'
const ADD_SPOT = 'spot/addNew'
// const EDIT_SPOT = 'spot/edit'

// action creators
const loadSpots = (spots) => {
    return {
        type: LOAD_SPOTS,
        payload: spots
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
        payload: spot
    }
}

const addSpot = (spot) => {
    return {
        type: ADD_SPOT,
        spot
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
export const loadAllSpots = () => async dispatch => {
    const response = await fetch('/api/spots');

    if (response.ok) {
        const spots = await response.json();
        dispatch(loadSpots(spots))
    }
}


export const getSpotById = (spotId) => async dispatch => {
    const response = await fetch(`/api/spots/${spotId}`);

    if (response.ok) {
        const spot = await response.json();
        dispatch(loadSpotDetails(spot))
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
        case LOAD_SPOTS: {
            const newSpots = {}
            action.payload.Spots.forEach(spot => {
                newSpots[spot.id] = spot
            })
            return {
                ...state,
                ...newSpots
            }
        }
        case LOAD_SPOT_DETAILS:
            return {
                ...action.payload
            }
        case ADD_SPOT:
            return {
                ...state,
                ...state.spots, [action.spot.id]: action.spot
            }
        default:
            return state
    }
}

export default spotReducer
