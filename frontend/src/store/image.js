import { csrfFetch } from "./csrf"

// action types
const ADD = "images/ADD"

export const add = (imageData) => {
  return {
    type: ADD,
    imageData,
  }
}

// thunk action creator
export const addImage = (spotId, imageData) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}/images`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(imageData),
  })

  if (response.ok) {
    const newImage = await response.json()
    dispatch(add(newImage))
    return newImage
  }
}

// image reducer

const initialState = {}

const imageReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD: {
      return {
        ...state,
        [action.imageData.id]: action.imageData,
      }
    }
    default:
      return state
  }
}

export default imageReducer
