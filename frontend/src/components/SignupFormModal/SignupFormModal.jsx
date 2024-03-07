import { useState } from "react"
import { useDispatch } from "react-redux"
import { useModal } from "../../context/Modal"
import * as sessionActions from "../../store/session"
import "./SignupForm.css"

function SignupFormModal() {
  const dispatch = useDispatch()
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [errors, setErrors] = useState({})
  const { closeModal } = useModal()

  const isDisabled =
    !email ||
    !username ||
    !firstName ||
    !lastName ||
    !password ||
    !confirmPassword ||
    username.length < 4 ||
    password.length < 6
  console.log(isDisabled)

  const handleSubmit = (e) => {
    e.preventDefault()
    // if (password === confirmPassword) {
    setErrors({})
    return dispatch(
      sessionActions.signup({
        email,
        username,
        firstName,
        lastName,
        password,
      })
    )
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json()
        if (data?.errors) {
          setErrors(data.errors)
        }
      })
  }

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}
          <label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Email"
            />
          </label>
        </div>

        <div className="form-group">
          <label>
            {errors.username && (
              <p style={{ color: "red" }}>{errors.username}</p>
            )}
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Username"
            />
          </label>
        </div>

        <div className="form-group">
          <label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              placeholder="First Name"
            />
          </label>
        </div>
        {errors.firstName && <p>{errors.firstName}</p>}
        <div className="form-group">
          <label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              placeholder="Last Name"
            />
          </label>
        </div>
        {errors.lastName && <p>{errors.lastName}</p>}
        <div className="form-group">
          <label>
            {errors.password && (
              <p style={{ color: "red" }}>{errors.password}</p>
            )}
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Password"
            />
          </label>
        </div>

        <div className="form-group">
          <label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Confirm Password"
            />
          </label>
          {errors.confirmPassword && (
            <p style={{ color: "red" }}>{errors.confirmPassword}</p>
          )}
        </div>
        <button
          type="submit"
          className="signup-button"
          disabled={isDisabled}
        >
          Sign Up
        </button>
      </form>
    </div>
  )
}

export default SignupFormModal
