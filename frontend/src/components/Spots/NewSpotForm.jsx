import { useEffect, useState } from "react";
import './NewSpotForm.css'
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createNewSpot } from "../../store/spots";

export default function NewSpotForm () {
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
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
    const [validationErrors, setValidationErrors] = useState({})

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value})
    }

        useEffect(() => {
            const { country, address, city, state, lat, lng, description, name, previewImage, price } = formData
            const errors = {}
                if (!country) errors.country = 'Country is required'
                if (!address) errors.address = 'Address is required'
                if (!city) errors.city = 'City is required'
                if (!state) errors.state = 'State is required'
                if (!lat) errors.lat = 'Latitude is required'
                if (!lng) errors.lng = 'Longitude is required'
                if (description.length < 30) errors.description = 'Description needs a minimum of 30 characters'
                if (!name) errors.name = 'Name is required'
                if (!previewImage) errors.previewImage = 'Prevew image is required'
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
                        <h2>Create a new Spot</h2>
                        <div className="first-section">
                            <h3>Where your place located?</h3>
                            <p>Guests will only get your exact address once they booked a reservation.</p>
                            <label>
                                Country
                                <span className="errors">{validationErrors.country}</span>
                                    <input
                                        type="text"
                                        name="country"
                                        value={formData.country}
                                        onChange={handleChange}
                                        placeholder="Country"
                                    />
                            </label>
                            <label>
                                Street Address
                                <span className="errors">{validationErrors.address}</span>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        placeholder="Address"
                                />
                            </label>
                            <label >
                                City
                                <span className="errors">{validationErrors.city}</span>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        placeholder="City"
                                    />
                            </label>
                            <label>
                                State
                                <span className="errors">{validationErrors.state}</span>
                                    <input
                                        type="text"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleChange}
                                        placeholder="STATE"
                                    />
                            </label>
                            <label >
                                Latitude
                                <span className="errors">{validationErrors.lat}</span>
                                    <input
                                        type="text"
                                        name="lat"
                                        value={formData.lat}
                                        onChange={handleChange}
                                        placeholder="Latitude"
                                    />
                            </label>
                            <label >
                                Longitude
                                <span className="errors">{validationErrors.lng}</span>
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
                            <p>Mention the best features of your space, any special amnetities like fast wifi or parking, and what you love abut the neighborhood</p>
                            <textarea
                                type="text"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Please write atleast 30 characters"
                                cols="30" rows="10">
                            </textarea>
                            <span className="errors">{validationErrors.description}</span>
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
                            <p className="errors">{validationErrors.name}</p>
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
                                    <p className="errors">{validationErrors.price}</p>
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
                            <p className="errors">{validationErrors.previewImage}</p>
                            {formData.imageUrls.map((imageUrl, index) => (
                                <div key={index}>
                                    <input
                                        type="text"
                                        name={formData.imageUrls[{index}]}
                                        value={formData.imageUrls[{index}]}
                                        placeholder="Image URL"
                                        onChange={handleChange}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="submit-container">
                        <button
                            type="submit"
                            disabled={Object.keys(validationErrors).length !== 0}
                            >Create Spot</button>
                    </div>
            </form>

    )
}
// Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vero, omnis quos accusantium magnam sed aspernatur ratione. Architecto quia quasi aperiam, voluptate est obcaecati sunt deleniti rerum pariatur tenetur in ab ullam!
