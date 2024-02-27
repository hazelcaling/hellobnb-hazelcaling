import { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './LoginForm.css';


function LoginFormModal() {

  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();
  const isLoginButtonEnabled = credential.length >= 4 && password.length >= 6
  const isLoginButtonDisabled = credential.length < 4 || password.length < 6


  const handleSubmit = (e) => {
    e.preventDefault();

    if (errors.credential) {
    isLoginButtonDisabled
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data?.errors) setErrors(data.errors);
      })

    }
    return setErrors({credential: 'The provided credentials were invalid'})

  };

  const handleClick = () => {
    setCredential('Demo-lition')
    setPassword('password')
  }

  return (
    <div className='login-container'>
      <h2>Log In</h2>
      <form onSubmit={handleSubmit}>
        <div className='form-group'>
        <label>
          {/* Username or Email */}
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
            placeholder='Username or Email'
          />
        </label>
        </div>
        <div className='form-group'>
        <label>
          {/* Password */}
          <input
            type="password"
            value={password }
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder='Password'
          />
        </label>
        {errors.credential && <p style={{color: 'red'}}>{errors.credential}</p>}
        </div>

        <button type="submit" disabled={isLoginButtonDisabled} className={isLoginButtonEnabled ? 'login-button-enabled' : 'login-button-disabled'}>Log In</button>
        <button onClick={handleClick}>Demo User</button>
      </form>
    </div>
  );
}

export default LoginFormModal;
