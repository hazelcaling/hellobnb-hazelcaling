import { useEffect, useState } from "react"
import "./NewSpotForm.css"
import { useDispatch } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { getSpotById, updateSpot } from "../../store/spots"
import { addImage } from "../../store/image"

export default function UpdateSpotForm() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { spotId } = useParams()
  const [spotData, setSpotData] = useState({})
  const [imageData, setImageData] = useState([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    // let initialImageData
    dispatch(getSpotById(spotId))
      .then((data) => {
        setSpotData(data)
        setImageData(data.SpotImages.slice(0, 5))
        // initialImageData = data.SpotImages.slice(0, 5)
      })
      .then(() => setIsLoaded(true))
  }, [dispatch, spotId])

  const [validationErrors, setValidationErrors] = useState({})

  useEffect(() => {
    const {
      country,
      address,
      city,
      state,
      lat,
      lng,
      description,
      name,
      price,
    } = spotData

    const errors = {}
    const regex = /\.(jpg|jpeg|png)$/i

    if (!country) errors.country = "Country is required"
    if (!address) errors.address = "Address is required"
    if (!city) errors.city = "City is required"
    if (!state) errors.state = "State is required"
    if (!lat) errors.lat = "Latitude is required"
    if (!lng) errors.lng = "Longitude is required"
    if (description?.length < 30)
      errors.description = "Description needs a minimum of 30 characters"
    if (!name) errors.name = "Name is required"
    if (!price) errors.price = "Price is required"

    imageData.forEach((image, index) => {
      if (!image.url && index === 0) errors[index] = "Preview image is required"
      if (image.url && !regex.test(image.url))
        errors[index] = "Image URL must end in .png, .jpg, or .jpeg"
    })

    setValidationErrors(errors)
  }, [spotData, imageData])

  const reset = () => {
    setSpotData({
      address: "",
      city: "",
      state: "",
      country: "",
      lat: "",
      lng: "",
      name: "",
      description: "",
      price: "",
    })

    setImageData({
      url: "",
      preview: true,
    })
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    // console.log(name, "name")
    // console.log(value, "value")
    setSpotData({ ...spotData, [name]: value })
  }

  const handleImageChange = (e, index) => {
    const { value } = e.target
    const updatedImageData = [...imageData]
    updatedImageData[index] = { ...updatedImageData[index], url: value }
    setImageData(updatedImageData)
    // console.log(value)
    // console.log(name)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitted(true)
    // if (imageData.length === 0) return

    const spot = { ...spotData }
    const updatedSpot = await dispatch(updateSpot(spotId, spot))

    if (updatedSpot) {
      for (const imageObj of imageData) {
        const isNewImage = !Object.keys(imageObj).includes("id")
        if (isNewImage) {
          const newImage = { ...imageObj, preview: true }
          await dispatch(addImage(spotId, newImage))
        }
      }

      navigate(`/spots/${updatedSpot.id}`)
      reset()
    }
    return updatedSpot
  }

  return (
    <>
      {isLoaded && (
        <form
          onSubmit={handleSubmit}
          className="spot-form"
        >
          <div className="fields-container">
            <h2>Update your Spot</h2>
            <div className="first-section">
              <h3>Where&apos;s your place located?</h3>
              <p>
                Guests will only get your exact address once they booked a
                reservation.
              </p>
              <label>
                Country
                {submitted && (
                  <div className="errors">{validationErrors.country}</div>
                )}
                <input
                  type="text"
                  name="country"
                  value={spotData.country}
                  onChange={handleChange}
                  placeholder="Country"
                />
              </label>
              <label>
                {/* Street Address */}
                {submitted && (
                  <div className="errors">{validationErrors.address}</div>
                )}
                <input
                  type="text"
                  name="address"
                  value={spotData.address}
                  onChange={handleChange}
                  placeholder="Address"
                />
              </label>
              <div className="cityState">
                <label>
                  {/* City */}
                  {submitted && (
                    <div className="errors">{validationErrors.city}</div>
                  )}
                  <input
                    type="text"
                    name="city"
                    value={spotData.city}
                    onChange={handleChange}
                    placeholder="City"
                  />
                </label>
                <label>
                  {/* State */}
                  {submitted && (
                    <div className="errors">{validationErrors.state}</div>
                  )}
                  <input
                    type="text"
                    name="state"
                    value={spotData.state}
                    onChange={handleChange}
                    placeholder="STATE"
                  />
                </label>
              </div>
              <div className="latlng">
                <label>
                  {submitted && (
                    <div className="errors">{validationErrors.lat}</div>
                  )}
                  <input
                    type="text"
                    name="lat"
                    value={spotData.lat}
                    onChange={handleChange}
                    placeholder="Latitude"
                  />
                </label>
                ,
                <label>
                  {submitted && (
                    <div className="errors">{validationErrors.lng}</div>
                  )}
                  <input
                    type="text"
                    name="lng"
                    value={spotData.lng}
                    onChange={handleChange}
                    placeholder="Longitude"
                  />
                </label>
              </div>
            </div>
            <div className="second-section">
              <h3>Describe your place to guests</h3>
              <p>
                Mention the best features of your space, any special amnetities
                like fast wifi or parking, and what you love about the
                neighborhood
              </p>
              <textarea
                type="text"
                name="description"
                value={spotData.description}
                onChange={handleChange}
                placeholder="Please write atleast 30 characters"
                cols="30"
                rows="10"
              ></textarea>
              {submitted && (
                <div className="errors">{validationErrors.description}</div>
              )}
            </div>
            <div className="third-section">
              <h3>Create a title for your spot</h3>
              <p>
                Catch guests attention with a spot title that highlights what
                makes your place special
              </p>
              <input
                type="text"
                name="name"
                value={spotData.name}
                onChange={handleChange}
                placeholder="Name of your spot"
              />
              {submitted && <p className="errors">{validationErrors.name}</p>}
            </div>
            <div className="fourth-section">
              <h3>Set a base price for your spot</h3>
              <p>
                Competitive pricing can help your listing stand out and rank
                higher in search results
              </p>
              <label>
                $
                <input
                  type="text"
                  name="price"
                  value={spotData.price}
                  onChange={handleChange}
                  placeholder="Price per night (USD)"
                />
                {submitted && (
                  <p className="errors">{validationErrors.price}</p>
                )}
              </label>
            </div>
            <div className="fifth-section">
              <h3>Liven up your spot with photos</h3>
              <p>Submit a link to at least one photo to publish your spot</p>
              {[0, 1, 2, 3, 4].map((index) => (
                <div key={index}>
                  <input
                    placeholder={index === 0 ? "Preview Image" : "Image URL"}
                    type="text"
                    name={`url${index}`}
                    value={imageData[index]?.url}
                    onChange={(e) => handleImageChange(e, index)}
                  />
                  {submitted && (
                    <p className="errors">{validationErrors.index}</p>
                  )}
                </div>
              ))}

              {/* <input
            type="text"
            name="url"
            value={imageData.url}
            // (spot?.SpotImages && Object.values(spot?.SpotImages)[0]?.url)
            placeholder="Preview Image URL"
            onChange={handleChange}
          />
          {submitted && <p className="errors">{validationErrors.url}</p>}
          <div>
            <input
              type="text"
              name="imageUrl1"
              value={spotData.imageUrl1}
              placeholder="Image URL"
              onChange={handleChange}
            />
          </div>
          {submitted && <p className="errors">{validationErrors.imageUrl1}</p>}
          <div>
            <input
              type="text"
              name="imageUrl2"
              value={spotData.imageUrl2}
              placeholder="Image URL"
              onChange={handleChange}
            />
          </div>
          {submitted && <p className="errors">{validationErrors.imageUrl2}</p>}
          <div>
            <input
              type="text"
              name="imageUrl3"
              value={spotData.imageUrl3}
              placeholder="Image URL"
              onChange={handleChange}
            />
          </div>
          {submitted && <p className="errors">{validationErrors.imageUrl3}</p>}
          <div>
            <input
              type="text"
              name="imageUrl4"
              value={spotData.imageUrl4}
              placeholder="Image URL"
              onChange={handleChange}
            />
          </div>
          {submitted && <p className="errors">{validationErrors.imageUrl4}</p>} */}
            </div>
          </div>
          <div className="submit-container">
            <button type="submit">Update your Spot</button>
          </div>
        </form>
      )}
    </>
  )
}

// import { useEffect, useState } from "react"
// import { useDispatch, useSelector } from "react-redux"
// import { useParams } from "react-router-dom"
// import { getSpotById } from "../../store/spots"
// import SpotForm from "./SpotForm"

// export default function UpdateSpotForm() {
//   const dispatch = useDispatch()
//   const { spotId } = useParams()
//   const [isLoaded, setIsLoaded] = useState(false)

//   useEffect(() => {
//     dispatch(getSpotById(spotId)).then(() => setIsLoaded(true))
//   }, [spotId, dispatch])
//   const spot = useSelector((state) => state.spots)
//   const images = spot?.SpotImages

//   return (
//     <>
//       {isLoaded && (
//         <SpotForm
//           spot={spot}
//           images={images}
//         />
//       )}
//     </>
//   )
// }
