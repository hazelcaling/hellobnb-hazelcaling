import { csrfFetch } from "./csrf"

// action types
const LOAD_REVIEWS = 'reviews/loadAll'
const ADD_REVIEW = 'reviews/reviewAdded'

// action creators
const loadReviews = (reviews) => {
    return {
        type: LOAD_REVIEWS,
        reviews
    }
}

const addReview = (review) => {
    return {
        type: ADD_REVIEW,
        review
    }
}

// thunk action creators
export const loadAllReviews = (spotId) => async (dispatch) => {
    const response = await fetch(`/api/spots/${spotId}/reviews`);

    if (response.ok) {
        const reviews = await response.json()
        dispatch(loadReviews(reviews))
        return reviews
    }
}

export const createReview = (spotId, review) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(review)
    })
    if (response.ok) {
        const newReview = await response.json()
        dispatch(addReview(newReview))
    }
}

// review reducer
const initialState = {};

const reviewReducer = (state = initialState, action) => {
    switch(action.type) {
        case LOAD_REVIEWS: {
            const newReviews = {}
            action.reviews.Reviews.forEach(review => {
                newReviews[review.id] = review
            })
            return {
                ...state,
                ...newReviews
            }
        }
        case ADD_REVIEW:
        return {
            ...state,
            ...state.reviews, [action.review.id]: action.review
        }
        default:
            return state;
    }
}

export default reviewReducer
