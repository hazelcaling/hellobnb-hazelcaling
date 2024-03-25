import { useEffect, useState } from "react"
import "./NewSpotForm.css"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { createNewSpot } from "../../store/spots"
import { addImage } from "../../store/image"

export default function SpotForm() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const initialValue = {
    address: "",
    city: "",
    state: "",
    country: "",
    lat: "",
    lng: "",
    name: "",
    description: "",
    price: "",
    imageUrl1: "",
    imageUrl2: "",
    imageUrl3: "",
    imageUrl4: "",
  }

  const [submitted, setSubmitted] = useState(false)
  const [spotData, setSpotData] = useState({ ...initialValue })
  const [imageData, setImageData] = useState({
    url: "",
    preview: true,
  })

  const [validationErrors, setValidationErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setSpotData({ ...spotData, [name]: value })
    setImageData({ ...imageData, [name]: value })
  }

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
      imageUrl1,
      imageUrl2,
      imageUrl3,
      imageUrl4,
    } = spotData
    const { url } = imageData
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
    if (!regex.test(url))
      errors.url = "Image URL must end in .png, .jpg, or .jpeg"
    if (!url) errors.url = "Preview image is required"
    if (!price) errors.price = "Price is required"
    if (imageUrl1 && !regex.test(imageUrl1))
      errors.imageUrl1 = "Image URL must end in .png, .jpg, or .jpeg"
    if (imageUrl2 && !regex.test(imageUrl2))
      errors.imageUrl2 = "Image URL must end in .png, .jpg, or .jpeg"
    if (imageUrl3 && !regex.test(imageUrl3))
      errors.imageUrl3 = "Image URL must end in .png, .jpg, or .jpeg"
    if (imageUrl4 && !regex.test(imageUrl4))
      errors.imageUrl4 = "Image URL must end in .png, .jpg, or .jpeg"
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitted(true)

    const spot = { ...spotData }
    const createdSpot = await dispatch(createNewSpot(spot))
    const image = { url: imageData.url, preview: true }
    await dispatch(addImage(createdSpot.id, image))
    let image1
    let image2
    let image3
    let image4

    !spotData.imageUrl1
      ? (image1 = { url: "https://via.placeholder.com/300", preview: true })
      : (image1 = { url: spotData.imageUrl1, preview: true })
    await dispatch(addImage(createdSpot.id, image1))
    !spotData.imageUrl2
      ? (image2 = { url: "https://via.placeholder.com/300", preview: true })
      : (image2 = { url: spotData.imageUrl2, preview: true })
    await dispatch(addImage(createdSpot.id, image2))
    !spotData.imageUrl3
      ? (image3 = { url: "https://via.placeholder.com/300", preview: true })
      : (image3 = { url: spotData.imageUrl3, preview: true })
    await dispatch(addImage(createdSpot.id, image3))
    !spotData.imageUrl4
      ? (image4 = { url: "https://via.placeholder.com/300", preview: true })
      : (image4 = { url: spotData.imageUrl4, preview: true })
    await dispatch(addImage(createdSpot.id, image4))

    if (createdSpot) {
      navigate(`/spots/${createdSpot.id}`)
      reset()
    }
    return createdSpot
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="spot-form"
    >
      <div className="fields-container">
        <h2>Create a new Spot</h2>
        <div className="first-section">
          <h3>Where&apos;s your place located?</h3>
          <p>
            Guests will only get your exact address once they booked a
            reservation.
          </p>
          <label>
            {/* Country */}
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
            ,
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
            Mention the best features of your space, any special amnetities like
            fast wifi or parking, and what you love about the neighborhood
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
            Catch guests attention with a spot title that highlights what makes
            your place special
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
            Competitive pricing can help your listing stand out and rank higher
            in search results
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
            {submitted && <p className="errors">{validationErrors.price}</p>}
          </label>
        </div>
        <div className="fifth-section">
          <h3>Liven up your spot with photos</h3>
          <p>Submit a link to at least one photo to publish your spot</p>
          <input
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
          {submitted && <p className="errors">{validationErrors.imageUrl4}</p>}
        </div>
      </div>
      <div className="submit-container">
        <button type="submit">Create Spot</button>
      </div>
    </form>
  )
}

// import { useEffect, useState } from "react"
// import "./NewSpotForm.css"
// import { useDispatch } from "react-redux"
// import { useNavigate, useParams } from "react-router-dom"
// import { createNewSpot } from "../../store/spots"
// import { addImage } from "../../store/image"
// import { updateSpot } from "../../store/spots"

// export default function SpotForm({ spot, images }) {
//   const { spotId } = useParams()
//   const dispatch = useDispatch()
//   const navigate = useNavigate()
//   let initialValue

//   if (spotId) {
//     initialValue = { ...spot }
//   } else {
//     initialValue = {
//       address: "",
//       city: "",
//       state: "",
//       country: "",
//       lat: "",
//       lng: "",
//       name: "",
//       description: "",
//       price: "",
//       imageUrl1: "",
//       imageUrl2: "",
//       imageUrl3: "",
//       imageUrl4: "",
//     }
//   }

//   const [submitted, setSubmitted] = useState(false)
//   const [spotData, setSpotData] = useState({ ...initialValue })
//   const [imageData, setImageData] = useState({
//     url: "",
//     preview: true,
//   })

//   useEffect(() => {
//     setSpotData({ ...spot })
//     if (images) {
//       const imagesArr = Object.values(images)
//       imageData.previewImage = imagesArr[0].url
//       setImageData({
//         url: imagesArr[0].url,
//         preview: true,
//       })
//     }
//   }, [spot])

//   const [validationErrors, setValidationErrors] = useState({})

//   const handleChange = (e) => {
//     const { name, value } = e.target
//     setSpotData({ ...spotData, [name]: value })
//     setImageData({ ...imageData, [name]: value })
//   }

//   useEffect(() => {
//     const {
//       country,
//       address,
//       city,
//       state,
//       lat,
//       lng,
//       description,
//       name,
//       price,
//       imageUrl1,
//       imageUrl2,
//       imageUrl3,
//       imageUrl4,
//     } = spotData
//     const { url } = imageData
//     const errors = {}
//     const regex = /\.(jpg|jpeg|png)$/i

//     if (!country) errors.country = "Country is required"
//     if (!address) errors.address = "Address is required"
//     if (!city) errors.city = "City is required"
//     if (!state) errors.state = "State is required"
//     if (!lat) errors.lat = "Latitude is required"
//     if (!lng) errors.lng = "Longitude is required"
//     if (description?.length < 30)
//       errors.description = "Description needs a minimum of 30 characters"
//     if (!name) errors.name = "Name is required"
//     if (!regex.test(url))
//       errors.url = "Image URL must end in .png, .jpg, or .jpeg"
//     if (!url) errors.url = "Preview image is required"
//     if (!price) errors.price = "Price is required"
//     if (imageUrl1 && !regex.test(imageUrl1))
//       errors.imageUrl1 = "Image URL must end in .png, .jpg, or .jpeg"
//     if (imageUrl2 && !regex.test(imageUrl2))
//       errors.imageUrl2 = "Image URL must end in .png, .jpg, or .jpeg"
//     if (imageUrl3 && !regex.test(imageUrl3))
//       errors.imageUrl3 = "Image URL must end in .png, .jpg, or .jpeg"
//     if (imageUrl4 && !regex.test(imageUrl4))
//       errors.imageUrl4 = "Image URL must end in .png, .jpg, or .jpeg"
//     setValidationErrors(errors)
//   }, [spotData, imageData])

//   const reset = () => {
//     setSpotData({
//       address: "",
//       city: "",
//       state: "",
//       country: "",
//       lat: "",
//       lng: "",
//       name: "",
//       description: "",
//       price: "",
//     })

//     setImageData({
//       url: "",
//       preview: true,
//     })
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setSubmitted(true)

//     const spot = { ...spotData }
//     const createdSpot = await dispatch(createNewSpot(spot))
//     const image = { url: imageData.url, preview: true }
//     await dispatch(addImage(createdSpot.id, image))
//     let image1
//     let image2
//     let image3
//     let image4

//     !spotData.imageUrl1
//       ? (image1 = { url: "https://via.placeholder.com/300", preview: true })
//       : (image1 = { url: spotData.imageUrl1, preview: true })
//     await dispatch(addImage(createdSpot.id, image1))
//     !spotData.imageUrl2
//       ? (image2 = { url: "https://via.placeholder.com/300", preview: true })
//       : (image2 = { url: spotData.imageUrl2, preview: true })
//     await dispatch(addImage(createdSpot.id, image2))
//     !spotData.imageUrl3
//       ? (image3 = { url: "https://via.placeholder.com/300", preview: true })
//       : (image3 = { url: spotData.imageUrl3, preview: true })
//     await dispatch(addImage(createdSpot.id, image3))
//     !spotData.imageUrl4
//       ? (image4 = { url: "https://via.placeholder.com/300", preview: true })
//       : (image4 = { url: spotData.imageUrl4, preview: true })
//     await dispatch(addImage(createdSpot.id, image4))

//     if (createdSpot) {
//       navigate(`/spots/${createdSpot.id}`)
//       reset()
//     }
//     return createdSpot
//   }

//   const handleUpdate = async (e) => {
//     e.preventDefault()
//     const image = { url: imageData.url, preview: true }
//     console.log(validationErrors)

//     await dispatch(addImage(spotId, image))
//     let image1
//     let image2
//     let image3
//     let image4

//     !spotData.imageUrl1
//       ? (image1 = { url: "https://via.placeholder.com/300", preview: true })
//       : (image1 = { url: spotData.imageUrl1, preview: true })
//     await dispatch(addImage(spotId, image1))
//     !spotData.imageUrl2
//       ? (image2 = { url: "https://via.placeholder.com/300", preview: true })
//       : (image2 = { url: spotData.imageUrl2, preview: true })
//     await dispatch(addImage(spotId, image2))
//     !spotData.imageUrl3
//       ? (image3 = { url: "https://via.placeholder.com/300", preview: true })
//       : (image3 = { url: spotData.imageUrl3, preview: true })
//     await dispatch(addImage(spotId, image3))
//     !spotData.imageUrl4
//       ? (image4 = { url: "https://via.placeholder.com/300", preview: true })
//       : (image4 = { url: spotData.imageUrl4, preview: true })
//     await dispatch(addImage(spotId, image4))

//     if (spotId) {
//       const editedSpot = await dispatch(updateSpot(spotId, spotData))

//       if (editedSpot) {
//         navigate(`/spots/${spotId}`)
//         reset()
//       }
//     }
//   }

//   return (
//     <form
//       onSubmit={spotId ? handleUpdate : handleSubmit}
//       className="spot-form"
//     >
//       <div className="fields-container">
//         <h2>{spotId ? "Update your Spot" : "Create a new Spot"}</h2>
//         <div className="first-section">
//           <h3>Where&apos;s your place located?</h3>
//           <p>
//             Guests will only get your exact address once they booked a
//             reservation.
//           </p>
//           <label>
//             {/* Country */}
//             {submitted && (
//               <div className="errors">{validationErrors.country}</div>
//             )}
//             <input
//               type="text"
//               name="country"
//               value={spotData.country}
//               onChange={handleChange}
//               placeholder="Country"
//             />
//           </label>
//           <label>
//             {/* Street Address */}
//             {submitted && (
//               <div className="errors">{validationErrors.address}</div>
//             )}
//             <input
//               type="text"
//               name="address"
//               value={spotData.address}
//               onChange={handleChange}
//               placeholder="Address"
//             />
//           </label>
//           <label>
//             {/* City */}
//             {submitted && <div className="errors">{validationErrors.city}</div>}
//             <input
//               type="text"
//               name="city"
//               value={spotData.city}
//               onChange={handleChange}
//               placeholder="City"
//             />
//           </label>
//           <label>
//             {/* State */}
//             {submitted && (
//               <div className="errors">{validationErrors.state}</div>
//             )}
//             <input
//               type="text"
//               name="state"
//               value={spotData.state}
//               onChange={handleChange}
//               placeholder="STATE"
//             />
//           </label>
//           <label>
//             {submitted && <div className="errors">{validationErrors.lat}</div>}
//             <input
//               type="text"
//               name="lat"
//               value={spotData.lat}
//               onChange={handleChange}
//               placeholder="Latitude"
//             />
//           </label>
//           ,
//           <label>
//             {submitted && <div className="errors">{validationErrors.lng}</div>}
//             <input
//               type="text"
//               name="lng"
//               value={spotData.lng}
//               onChange={handleChange}
//               placeholder="Longitude"
//             />
//           </label>
//         </div>
//         <div className="second-section">
//           <h3>Describe your place to guests</h3>
//           <p>
//             Mention the best features of your space, any special amnetities like
//             fast wifi or parking, and what you love about the neighborhood
//           </p>
//           <textarea
//             type="text"
//             name="description"
//             value={spotData.description}
//             onChange={handleChange}
//             placeholder="Please write atleast 30 characters"
//             cols="30"
//             rows="10"
//           ></textarea>
//           {submitted && (
//             <div className="errors">{validationErrors.description}</div>
//           )}
//         </div>
//         <div className="third-section">
//           <h3>Create a title for your spot</h3>
//           <p>
//             Catch guests attention with a spot title that highlights what makes
//             your place special
//           </p>
//           <input
//             type="text"
//             name="name"
//             value={spotData.name}
//             onChange={handleChange}
//             placeholder="Name of your spot"
//           />
//           {submitted && <p className="errors">{validationErrors.name}</p>}
//         </div>
//         <div className="fourth-section">
//           <h3>Set a base price for your spot</h3>
//           <p>
//             Competitive pricing can help your listing stand out and rank higher
//             in search results
//           </p>
//           <label>
//             $
//             <input
//               type="text"
//               name="price"
//               value={spotData.price}
//               onChange={handleChange}
//               placeholder="Price per night (USD)"
//             />
//             {submitted && <p className="errors">{validationErrors.price}</p>}
//           </label>
//         </div>
//         <div className="fifth-section">
//           <h3>Liven up your spot with photos</h3>
//           <p>Submit a link to at least one photo to publish your spot</p>
//           <input
//             type="text"
//             name="url"
//             value={imageData.url}
//             // (spot?.SpotImages && Object.values(spot?.SpotImages)[0]?.url)
//             placeholder="Preview Image URL"
//             onChange={handleChange}
//           />
//           {submitted && <p className="errors">{validationErrors.url}</p>}
//           <div>
//             <input
//               type="text"
//               name="imageUrl1"
//               value={spotData.imageUrl1}
//               placeholder="Image URL"
//               onChange={handleChange}
//             />
//           </div>
//           {submitted && <p className="errors">{validationErrors.imageUrl1}</p>}
//           <div>
//             <input
//               type="text"
//               name="imageUrl2"
//               value={spotData.imageUrl2}
//               placeholder="Image URL"
//               onChange={handleChange}
//             />
//           </div>
//           {submitted && <p className="errors">{validationErrors.imageUrl2}</p>}
//           <div>
//             <input
//               type="text"
//               name="imageUrl3"
//               value={spotData.imageUrl3}
//               placeholder="Image URL"
//               onChange={handleChange}
//             />
//           </div>
//           {submitted && <p className="errors">{validationErrors.imageUrl3}</p>}
//           <div>
//             <input
//               type="text"
//               name="imageUrl4"
//               value={spotData.imageUrl4}
//               placeholder="Image URL"
//               onChange={handleChange}
//             />
//           </div>
//           {submitted && <p className="errors">{validationErrors.imageUrl4}</p>}
//         </div>
//       </div>
//       <div className="submit-container">
//         <button type="submit">
//           {spotId ? "Update your Spot" : "Create Spot"}
//         </button>
//       </div>
//     </form>
//   )
// }
