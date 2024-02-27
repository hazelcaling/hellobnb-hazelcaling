import { NavLink, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import OpenModalButton from './OpenModalButton';
import LoginFormModal from '../LoginFormModal/LoginFormModal';
import SignupFormModal from '../SignupFormModal/SignupFormModal';
import { FaAirbnb } from "react-icons/fa";
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  let sessionLinks;
  if (sessionUser) {
    sessionLinks = (
      <li>
        <ProfileButton user={sessionUser} />
      </li>
    );
  } else {
    sessionLinks = (
      <ul>
      <li>
        <OpenModalButton
          buttonText="Log In"
          modalComponent={<LoginFormModal />}
        />
      </li>
      <li>
        <OpenModalButton
          buttonText="Sign Up"
          modalComponent={<SignupFormModal />}
        />
      </li>
      </ul>
    );
  }

  return (
    <div className='navbar'>
      <div className='logo'><NavLink to="/"><FaAirbnb style={{color: "#f25090", fontSize: "4em"}}/></NavLink></div>
      <div className='top-right'>
      {sessionUser && <div className='createNewSpot'><Link to='new-spot' className='create-new-spot'>Create a New Spot</Link></div>}
      <div className='profile-dropdown'><ul className='profile-dropdown'>{isLoaded && sessionLinks}</ul></div>
      </div>
    </div>
  );
}

export default Navigation;
