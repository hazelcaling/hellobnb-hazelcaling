// import NewSpotForm from "./NewSpotForm";
// import { useDispatch, useSelector } from "react-redux";
// import { useEffect, useState } from "react";
// import { useParams } from "react-router";
// import {getSpotById } from '../../store/spots'

// export default function UpdateSpotForm () {
//     const dispatch = useDispatch()
//     const {spotId} = useParams()
//     const spot = useSelector(state => state.spots)


//     useEffect(() => {
//         dispatch(getSpotById(spotId))
//     }, [dispatch, spotId])
//     console.log(spot)

//     const [data, setData] = useState(() => ({
//         address: 'Hello'
//     }))



//     return (
//         <NewSpotForm spotDetails={spot}/>
//     )
// }

import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createNewSpot } from "../../store/spots";
import { useParams } from "react-router";
import {getSpotById } from '../../store/spots'
import './NewSpotForm.css'

export default function UpdateSpotForm () {
    const spot = useSelector(state => state.spots)
    const { address, city, state, country, lat, lng, name, description, price, previewImage} =  spot
    const {spotId} = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const [submitted, setSubmitted] = useState(false)
    const [formData, setFormData] = useState({
        address: address,
        city: city,
        state: state,
        country: country,
        lat: lat,
        lng: lng,
        name: name,
        description: description,
        price: price,
        previewImage: previewImage,
        imageUrls: []
    })
    const [validationErrors, setValidationErrors] = useState({})

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value})
    }

    useEffect(() => {
        dispatch(getSpotById(spotId))
    }, [dispatch, spotId])


        useEffect(() => {
            const { country, address, city, state, lat, lng, description, name, previewImage, price, imageUrls } = formData
            const errors = {}
            const regex = /\.(jpg|jpeg|png)$/i

                if (!country) errors.country = 'Country is required'
                if (!address) errors.address = 'Address is required'
                if (!city) errors.city = 'City is required'
                if (!state) errors.state = 'State is required'
                if (!lat) errors.lat = 'Latitude is required'
                if (!lng) errors.lng = 'Longitude is required'
                if (description.length < 30) errors.description = 'Description needs a minimum of 30 characters'
                if (!name) errors.name = 'Name is required'
                if (!regex.test(previewImage)) errors.previewImage = 'Image URL must end in .png, .jpg, or .jpeg'
                if (!previewImage) errors.previewImage = 'Preview image is required'

                imageUrls?.forEach((url) => {
                    if (!regex.test(url)) errors.imageUrls = 'Image URL must end in .png, .jpg, or .jpeg'
                })
                if (!price) errors.price = 'Price is required'
                setValidationErrors(errors)
        }, [formData])

    const reset = () => {
        setFormData({
            address: '',
            city: '',
            state: '',
            country: '',
            lat: '',
            lng: '',
            name: '',
            description: '',
            price: '',
            previewImage: '',
            imageUrls: ['', '', '', '']
        })
    }



    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitted(true)

        const spotData = {...formData}
        const createdSpot = await dispatch(createNewSpot(spotData))

        if (createdSpot) {
            navigate(`/spots/${createdSpot.id}`)
            reset()
        }

    }

    return (
            <form
                onSubmit={handleSubmit}
                className="spot-form">
                    <div className="fields-container">
                        <h2>Update your Spot</h2>
                        <div className="first-section">
                            <h3>Where&apos;s your place located?</h3>
                            <p>Guests will only get your exact address once they booked a reservation.</p>
                            <label>
                                {/* Country */}
                                {submitted && <div className="errors">{validationErrors.country}</div>}
                                    <input
                                        type="text"
                                        name="country"
                                        value={formData.country}
                                        onChange={handleChange}
                                        placeholder="Country"
                                    />
                            </label>
                            <label>
                                {/* Street Address */}
                                {submitted && <div className="errors">{validationErrors.address}</div>}
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        placeholder="Address"
                                />
                            </label>
                            <label >
                                {/* City */}
                                {submitted && <div className="errors">{validationErrors.city}</div>}
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        placeholder="City"
                                    />
                            </label>
                            <label>
                                {/* State */}
                                {submitted && <div className="errors">{validationErrors.state}</div>}
                                    <input
                                        type="text"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleChange}
                                        placeholder="STATE"
                                    />
                            </label>
                            <label>
                                {submitted && <div className="errors">{validationErrors.lat}</div>}
                                    <input
                                        type="text"
                                        name="lat"
                                        value={formData.lat}
                                        onChange={handleChange}
                                        placeholder="Latitude"
                                    />
                            </label>,
                            <label>
                                {submitted && <div className="errors">{validationErrors.lng}</div>}
                                    <input
                                        type="text"
                                        name="lng"
                                        value={formData.lng}
                                        onChange={handleChange}
                                        placeholder="Longitude"
                                    />
                            </label>
                        </div>
                        <div className="second-section">
                            <h3>Describe your place to guests</h3>
                            <p>Mention the best features of your space, any special amnetities like fast wifi or parking, and what you love about the neighborhood</p>
                            <textarea
                                type="text"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Please write atleast 30 characters"
                                cols="30" rows="10">
                            </textarea>
                            {submitted && <div className="errors">{validationErrors.description}</div>}
                        </div>
                        <div className="third-section">
                            <h3>Create a title for your spot</h3>
                            <p>Catch guests attention with a spot title that highlights what makes your place special</p>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Name of your spot"
                            />
                            {submitted && <p className="errors">{validationErrors.name}</p>}
                        </div>
                        <div className="fourth-section">
                            <h3>Set a base price for your spot</h3>
                            <p>Competitive pricing can help your listing stand out and rank higher in search results</p>
                            <label >
                                $
                                    <input
                                        type="text"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        placeholder="Price per night (USD)"
                                    />
                                    {submitted && <p className="errors">{validationErrors.price}</p>}
                            </label>
                        </div>
                        <div className="fifth-section">
                            <h3>Liven up your spot with photos</h3>
                            <p>Submit a link to at least one photo to publish your spot</p>
                            <input
                                type="text"
                                name="previewImage"
                                value={formData.previewImage}
                                placeholder="Preview Image URL"
                                onChange={handleChange}
                            />
                            {submitted && <p className="errors">{validationErrors.previewImage}</p>}

                            {formData.imageUrls?.map((imageUrl, index) => (
                                <div key={index}>
                                    <input
                                        type="text"
                                        name={imageUrl}
                                        value={formData.imageUrls[{index}]}
                                        placeholder="Image URL"
                                        onChange={handleChange}
                                    />
                                    {/* {submitted && <p className="errors">{validationErrors.imageUrls}</p>} */}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="submit-container">
                        <button
                            type="submit"
                            >Update your Spot</button>
                    </div>
            </form>

    )
}
