// action types
const LOAD_REVIEWS = 'reviews/loadAll'

// action creators
const loadReviews = (reviews) => {
    return {
        type: LOAD_REVIEWS,
        payload: reviews
    }
}

// thunk action creators
export const loadAllReviews = (spotId) => async (dispatch) => {
    const response = await fetch(`/api/spots/${spotId}/reviews`);

    if (response.ok) {
        const reviews = await response.json()
        dispatch(loadReviews(reviews))
    }
}

// review reducer
const initialState = {};

const reviewReducer = (state = initialState, action) => {
    switch(action.type) {
        case LOAD_REVIEWS: {
            const newReviews = {}
            action.payload.Reviews.forEach(review => {
                newReviews[review.id] = review
            })
            return {
                ...state,
                ...newReviews
            }
        }
        default:
            return state;
    }
}

export default reviewReducer
