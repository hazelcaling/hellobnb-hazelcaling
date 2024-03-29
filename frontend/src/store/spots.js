import { csrfFetch } from "./csrf"

// action types
const LOAD = "spots/LOAD"
const LOAD_SPOT_DETAILS = "spot/LOAD_DETAILS"
const ADDED = "spot/ADDED"
const DELETE = "spots/DELETE"
const EDIT = "spots/EDIT"

export const edit = (spotId, updatedSpot) => {
  return {
    type: EDIT,
    payload: {
      spotId,
      updatedSpot,
    },
  }
}

const load = (spots) => {
  return {
    type: LOAD,
    spots,
  }
}

const loadSpotDetails = (spot) => {
  return {
    type: LOAD_SPOT_DETAILS,
    spot,
  }
}

const add = (spot) => {
  return {
    type: ADDED,
    spot,
  }
}

export const deleteSpot = (spotId) => {
  return {
    type: DELETE,
    spotId,
  }
}

// thunk action creator
export const updateSpot = (spotId, updatedSpot) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedSpot),
  })

  if (response.ok) {
    const updatedSpot = response.json()
    dispatch(edit(updatedSpot))
    return updatedSpot
  }
}
export const loadSpots = () => async (dispatch) => {
  const response = await fetch(`/api/spots`)

  if (response.ok) {
    const spots = await response.json()
    dispatch(load(spots))
    return spots
  }
}

export const getSpotById = (spotId) => async (dispatch) => {
  const response = await fetch(`/api/spots/${spotId}`)

  if (response.ok) {
    const spot = await response.json()
    dispatch(loadSpotDetails(spot))
    return spot
  }
}

export const createNewSpot = (spot) => async (dispatch) => {
  const response = await csrfFetch("/api/spots", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(spot),
  })

  if (response.ok) {
    const newSpot = await response.json()
    dispatch(add(newSpot))
    return newSpot
  }
}

export const spotDeleted = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}`, {
    method: "DELETE",
  })
  dispatch(deleteSpot(spotId))
  return response
}

// spots reducer
const initialState = {}

const spotReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD: {
      const newSpots = {}
      action.spots.Spots.forEach((spot) => {
        newSpots[spot.id] = spot
      })

      return {
        ...newSpots,
      }
    }
    case LOAD_SPOT_DETAILS:
      return {
        ...action.spot,
      }

    case ADDED:
      return {
        ...state,
        [action.spot.id]: action.spot,
      }

    case DELETE: {
      const newState = { ...state }
      delete newState[action.spotId]
      return newState
    }
    case EDIT: {
      return { ...state, ...action.payload.updatedSpot }
    }

    default:
      return state
  }
}

export default spotReducer
