// action types
const LOAD_SPOTS = 'spots/loadAll'
const LOAD_SPOT_DETAILS = 'spots/loadSpotDetails'

// action creators
const loadSpots = (spots) => {
    return {
        type: LOAD_SPOTS,
        payload: spots
    }
}

const loadSpotDetails = () => {
    return {
        type: LOAD_SPOT_DETAILS,
    }
}

// thunk action creators
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
                ...state,
                spot: action.payload
            }
        default:
            return state
    }
}

export default spotReducer
